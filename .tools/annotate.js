const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs');

const CDP_URL = 'http://localhost:9222';
const RED = '#E8364F';

function escapeXml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ── Sketchy / hand-drawn primitives ──

function jitter(val, amount) {
  return val + (Math.random() - 0.5) * amount * 2;
}

function sketchyRect(box, opts = {}) {
  const pad = opts.padding || 5;
  const x = box.x - pad, y = box.y - pad;
  const w = box.width + pad * 2, h = box.height + pad * 2;
  const r = opts.borderRadius || 6;
  const sw = opts.strokeWidth || 2;
  const j = 1.2; // jitter amount

  // Draw slightly wobbly rounded rect — two passes for pencil effect
  const path = (seed) => {
    const rng = (v, s) => v + Math.sin(s * 7.3 + v * 0.1) * j;
    return `M ${rng(x+r,seed)},${rng(y,seed)}
      L ${rng(x+w-r,seed+1)},${rng(y,seed+1)}
      Q ${rng(x+w,seed+2)},${rng(y,seed+2)} ${rng(x+w,seed+3)},${rng(y+r,seed+3)}
      L ${rng(x+w,seed+4)},${rng(y+h-r,seed+4)}
      Q ${rng(x+w,seed+5)},${rng(y+h,seed+5)} ${rng(x+w-r,seed+6)},${rng(y+h,seed+6)}
      L ${rng(x+r,seed+7)},${rng(y+h,seed+7)}
      Q ${rng(x,seed+8)},${rng(y+h,seed+8)} ${rng(x,seed+9)},${rng(y+h-r,seed+9)}
      L ${rng(x,seed+10)},${rng(y+r,seed+10)}
      Q ${rng(x,seed+11)},${rng(y,seed+11)} ${rng(x+r,seed+12)},${rng(y,seed+12)} Z`;
  };

  return `
    <path d="${path(0)}" fill="none" stroke="${RED}" stroke-width="${sw}" opacity="0.35"/>
    <path d="${path(3.7)}" fill="none" stroke="${RED}" stroke-width="${sw}" opacity="0.8"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}"
      fill="${RED}" opacity="0.06"/>`;
}

function sketchyArrow(fromX, fromY, toX, toY, opts = {}) {
  const sw = opts.strokeWidth || 3;

  // Create a curved path with control points that wobble
  const dx = toX - fromX;
  const dy = toY - fromY;
  const len = Math.sqrt(dx * dx + dy * dy);

  // Perpendicular offset for curve
  const perpX = -dy / len;
  const perpY = dx / len;
  const curveAmount = len * 0.15 * (Math.random() > 0.5 ? 1 : -1);

  const cx = (fromX + toX) / 2 + perpX * curveAmount;
  const cy = (fromY + toY) / 2 + perpY * curveAmount;

  // Arrowhead - hand drawn style (two separate strokes)
  const angle = Math.atan2(toY - cy, toX - cx);
  const headLen = 12;
  const spread = Math.PI / 5;

  const a1x = toX - headLen * Math.cos(angle - spread) + (Math.random() - 0.5) * 2;
  const a1y = toY - headLen * Math.sin(angle - spread) + (Math.random() - 0.5) * 2;
  const a2x = toX - headLen * Math.cos(angle + spread) + (Math.random() - 0.5) * 2;
  const a2y = toY - headLen * Math.sin(angle + spread) + (Math.random() - 0.5) * 2;

  return `
    <path d="M ${fromX},${fromY} Q ${cx},${cy} ${toX},${toY}"
      fill="none" stroke="${RED}" stroke-width="${sw}" stroke-linecap="round" opacity="0.85"/>
    <line x1="${toX}" y1="${toY}" x2="${a1x}" y2="${a1y}"
      stroke="${RED}" stroke-width="${sw}" stroke-linecap="round" opacity="0.85"/>
    <line x1="${toX}" y1="${toY}" x2="${a2x}" y2="${a2y}"
      stroke="${RED}" stroke-width="${sw}" stroke-linecap="round" opacity="0.85"/>`;
}

function stepBadge(x, y, stepNumber) {
  const r = 14;
  const rot = (Math.random() - 0.5) * 2;

  // Red circle with white step number
  return `
    <g transform="rotate(${rot}, ${x}, ${y})">
      <circle cx="${x}" cy="${y}" r="${r + 2}" fill="white" opacity="0.95"/>
      <circle cx="${x}" cy="${y}" r="${r}" fill="${RED}" opacity="0.9"/>
      <text x="${x}" y="${y}" dy="0.35em" text-anchor="middle"
        fill="white" font-family="'Inter','Helvetica Neue',Arial,sans-serif"
        font-weight="700" font-size="15px">${stepNumber}</text>
    </g>`;
}

// ── Arrow + label placement around box ──

function placeArrowAndLabel(box, position, text, imgW, imgH) {
  const pad = 8;
  const arrowLen = 60;
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  let arrowFrom, arrowTo, labelX, labelY;

  switch (position) {
    case 'top-right': {
      arrowTo = { x: box.x + box.width + pad, y: box.y - pad };
      arrowFrom = { x: arrowTo.x + arrowLen, y: arrowTo.y - arrowLen };
      labelX = arrowFrom.x + 5;
      labelY = arrowFrom.y - 8;
      break;
    }
    case 'top-left': {
      arrowTo = { x: box.x - pad, y: box.y - pad };
      arrowFrom = { x: arrowTo.x - arrowLen, y: arrowTo.y - arrowLen };
      labelX = arrowFrom.x - text.length * 10;
      labelY = arrowFrom.y - 8;
      break;
    }
    case 'bottom-right': {
      arrowTo = { x: box.x + box.width + pad, y: box.y + box.height + pad };
      arrowFrom = { x: arrowTo.x + arrowLen, y: arrowTo.y + arrowLen };
      labelX = arrowFrom.x + 5;
      labelY = arrowFrom.y + 20;
      break;
    }
    case 'bottom-left': {
      arrowTo = { x: box.x - pad, y: box.y + box.height + pad };
      arrowFrom = { x: arrowTo.x - arrowLen, y: arrowTo.y + arrowLen };
      labelX = arrowFrom.x - text.length * 10;
      labelY = arrowFrom.y + 20;
      break;
    }
    case 'left': {
      arrowTo = { x: box.x - pad, y: cy };
      arrowFrom = { x: arrowTo.x - arrowLen - 20, y: cy - 15 };
      labelX = arrowFrom.x - text.length * 10;
      labelY = arrowFrom.y;
      break;
    }
    case 'right': {
      arrowTo = { x: box.x + box.width + pad, y: cy };
      arrowFrom = { x: arrowTo.x + arrowLen + 20, y: cy - 15 };
      labelX = arrowFrom.x + 5;
      labelY = arrowFrom.y;
      break;
    }
    case 'top':
    default: {
      arrowTo = { x: cx, y: box.y - pad };
      arrowFrom = { x: cx + 30, y: arrowTo.y - arrowLen };
      labelX = arrowFrom.x + 8;
      labelY = arrowFrom.y - 8;
      break;
    }
    case 'bottom': {
      arrowTo = { x: cx, y: box.y + box.height + pad };
      arrowFrom = { x: cx + 30, y: arrowTo.y + arrowLen };
      labelX = arrowFrom.x + 8;
      labelY = arrowFrom.y + 20;
      break;
    }
  }

  // Clamp to image bounds
  labelX = Math.max(10, Math.min(labelX, imgW - text.length * 11));
  labelY = Math.max(25, Math.min(labelY, imgH - 10));
  arrowFrom.x = Math.max(15, Math.min(arrowFrom.x, imgW - 15));
  arrowFrom.y = Math.max(15, Math.min(arrowFrom.y, imgH - 15));

  return { arrowFrom, arrowTo, labelX, labelY };
}

// ── Smart position: pick best side based on available space ──

function autoPick(box, imgW, imgH) {
  const spaceTop = box.y;
  const spaceBottom = imgH - (box.y + box.height);
  const spaceLeft = box.x;
  const spaceRight = imgW - (box.x + box.width);

  const max = Math.max(spaceTop, spaceBottom, spaceLeft, spaceRight);

  if (max === spaceTop && spaceRight > 100) return 'top-right';
  if (max === spaceTop) return 'top';
  if (max === spaceBottom && spaceRight > 100) return 'bottom-right';
  if (max === spaceBottom) return 'bottom';
  if (max === spaceRight) return 'right';
  return 'left';
}

// ── Background ──

async function generateGradientBg(width, height) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0055CC"/>
        <stop offset="50%" stop-color="#0022AA"/>
        <stop offset="100%" stop-color="#1a0066"/>
      </linearGradient>
      <radialGradient id="cyan" cx="0%" cy="0%" r="60%" fx="5%" fy="5%">
        <stop offset="0%" stop-color="#00BFFF" stop-opacity="0.8"/>
        <stop offset="40%" stop-color="#0077DD" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#0022AA" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="purple" cx="85%" cy="40%" r="50%" fx="90%" fy="45%">
        <stop offset="0%" stop-color="#7744CC" stop-opacity="0.7"/>
        <stop offset="50%" stop-color="#4422AA" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#0022AA" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="amber" cx="95%" cy="95%" r="45%" fx="95%" fy="95%">
        <stop offset="0%" stop-color="#DDAA55" stop-opacity="0.8"/>
        <stop offset="30%" stop-color="#CC8844" stop-opacity="0.5"/>
        <stop offset="60%" stop-color="#7744AA" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#0022AA" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="topblue" cx="40%" cy="0%" r="50%">
        <stop offset="0%" stop-color="#0066EE" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#0022AA" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#base)"/>
    <rect width="${width}" height="${height}" fill="url(#cyan)"/>
    <rect width="${width}" height="${height}" fill="url(#topblue)"/>
    <rect width="${width}" height="${height}" fill="url(#purple)"/>
    <rect width="${width}" height="${height}" fill="url(#amber)"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function roundCorners(buffer, radius) {
  const { width, height } = await sharp(buffer).metadata();
  const mask = Buffer.from(
    `<svg width="${width}" height="${height}">
      <rect width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="white"/>
    </svg>`);
  return sharp(buffer)
    .composite([{ input: await sharp(mask).png().toBuffer(), blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function addBackground(imageBuffer, opts) {
  const { width, height } = await sharp(imageBuffer).metadata();
  const padX = opts.paddingX || 60;
  const padY = opts.paddingY || 50;
  const totalW = width + padX * 2;
  const totalH = height + padY * 2;
  const r = opts.imageRadius || 16;

  const bgBuffer = await generateGradientBg(totalW, totalH);

  const shadowSvg = Buffer.from(
    `<svg width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="18" flood-color="rgba(0,0,0,0.35)" flood-opacity="1"/>
        </filter>
      </defs>
      <rect x="${padX}" y="${padY}" width="${width}" height="${height}"
        rx="${r}" ry="${r}" fill="white" fill-opacity="0.12" filter="url(#s)"/>
    </svg>`);
  const shadowLayer = await sharp(shadowSvg).png().toBuffer();

  return sharp(bgBuffer)
    .composite([
      { input: shadowLayer, top: 0, left: 0 },
      { input: imageBuffer, top: padY, left: padX },
    ])
    .png()
    .toBuffer();
}

// ── Main ──

async function main() {
  const outputPath = process.argv[2];
  const annotationArg = process.argv[3];
  const optsArg = process.argv[4];

  if (!outputPath || !annotationArg) {
    console.log('Usage: node annotate.js <output.png> <annotation.json> [options.json]');
    console.log('');
    console.log('Annotation: red rect + sketchy arrow + step number badge (if multi-step)');
    console.log('');
    console.log('Annotation: { "selector": ".css", "stepNumber": 1, "totalSteps": 3, "position": "auto|top|right|..." }');
    console.log('Options:    { "imageRadius": 16, "paddingX": 60, "noBackground": false }');
    console.log('');
    console.log('If totalSteps is 1 (or omitted), no number badge is shown — just the arrow.');
    process.exit(1);
  }

  let annotation;
  if (annotationArg.startsWith('{')) {
    annotation = JSON.parse(annotationArg);
  } else {
    annotation = JSON.parse(fs.readFileSync(annotationArg, 'utf-8'));
  }

  let opts = {};
  if (optsArg) {
    opts = optsArg.startsWith('{') ? JSON.parse(optsArg) : JSON.parse(fs.readFileSync(optsArg, 'utf-8'));
  }

  const imageRadius = opts.imageRadius || 16;

  // Connect
  const browser = await chromium.connectOverCDP(CDP_URL);
  const context = browser.contexts()[0];
  const pages = context.pages();
  const page = pages[pages.length - 1];

  // Screenshot
  const screenshotBuffer = await page.screenshot({ fullPage: false });
  const { width, height } = await sharp(screenshotBuffer).metadata();

  // Resolve selector
  const el = await page.waitForSelector(annotation.selector, { timeout: 5000 }).catch(() => null);
  if (!el) {
    console.error(JSON.stringify({ ok: false, error: `Selector not found: ${annotation.selector}` }));
    process.exit(1);
  }
  const box = await el.boundingBox();

  // Pick position
  const position = annotation.position === 'auto' || !annotation.position
    ? autoPick(box, width, height)
    : annotation.position;

  // Build SVG
  const totalSteps = annotation.totalSteps || 1;
  const stepNumber = annotation.stepNumber || 1;
  const { arrowFrom, arrowTo, labelX, labelY } = placeArrowAndLabel(box, position, '', width, height);

  const svgParts = [
    sketchyRect(box, { padding: annotation.padding || 5, borderRadius: annotation.borderRadius || 6 }),
    sketchyArrow(arrowFrom.x, arrowFrom.y, arrowTo.x, arrowTo.y),
    totalSteps > 1 ? stepBadge(arrowFrom.x, arrowFrom.y, stepNumber) : '',
  ];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${svgParts.join('\n')}</svg>`;

  let result = await sharp(screenshotBuffer)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer();

  if (imageRadius > 0) {
    result = await roundCorners(result, imageRadius);
  }

  if (opts.noBackground !== true) {
    result = await addBackground(result, {
      paddingX: opts.paddingX || 60,
      paddingY: opts.paddingY || 50,
      imageRadius,
    });
  }

  await sharp(result).toFile(outputPath);
  const finalMeta = await sharp(outputPath).metadata();

  console.log(JSON.stringify({
    ok: true,
    path: outputPath,
    width: finalMeta.width,
    height: finalMeta.height,
    selector: annotation.selector,
    stepNumber: totalSteps > 1 ? stepNumber : null,
    totalSteps,
    position,
  }));

  process.exit(0);
}

main().catch(e => {
  console.error(JSON.stringify({ ok: false, error: e.message }));
  process.exit(1);
});
