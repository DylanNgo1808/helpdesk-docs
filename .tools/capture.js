const { chromium } = require('playwright');
const fs = require('fs');

const SESSION_DIR = '/tmp/playwright-session';
const PROFILE_DIR = `${SESSION_DIR}/profile`;
const WS_FILE = `${SESSION_DIR}/ws-endpoint.txt`;
const CDP_PORT = 9222;

// ── Launch browser with persistent profile + CDP ──

async function launch() {
  if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });
  if (!fs.existsSync(PROFILE_DIR)) fs.mkdirSync(PROFILE_DIR, { recursive: true });

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    args: ['--start-maximized', `--remote-debugging-port=${CDP_PORT}`],
    viewport: null
  });

  console.log('BROWSER_READY');
  console.log(`CDP: http://localhost:${CDP_PORT}`);
  console.log('Profile: ' + PROFILE_DIR);
  console.log('Login to your app, then use capture commands.');

  // Keep alive
  await new Promise(() => {});
}

// ── Connect + execute command ──

async function run() {
  const browser = await chromium.connectOverCDP(`http://localhost:${CDP_PORT}`);
  const context = browser.contexts()[0];
  const pages = context.pages();
  const page = pages[pages.length - 1];

  const action = process.argv[3];
  const arg1 = process.argv[4];
  const arg2 = process.argv[5];

  switch (action) {
    case 'screenshot': {
      const out = arg1 || `${SESSION_DIR}/screenshot.png`;
      await page.screenshot({ path: out });
      console.log(JSON.stringify({ ok: true, path: out }));
      break;
    }
    case 'screenshot-full': {
      const out = arg1 || `${SESSION_DIR}/screenshot.png`;
      await page.screenshot({ path: out, fullPage: true });
      console.log(JSON.stringify({ ok: true, path: out }));
      break;
    }
    case 'goto': {
      await page.goto(arg1, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(1500);
      console.log(JSON.stringify({ ok: true, url: page.url(), title: await page.title() }));
      break;
    }
    case 'click': {
      await page.click(arg1, { timeout: 5000 });
      await page.waitForTimeout(500);
      console.log(JSON.stringify({ ok: true, clicked: arg1 }));
      break;
    }
    case 'resize': {
      const w = parseInt(arg1) || 1280;
      const h = parseInt(arg2) || 800;
      await page.setViewportSize({ width: w, height: h });
      await page.waitForTimeout(500);
      console.log(JSON.stringify({ ok: true, width: w, height: h }));
      break;
    }
    case 'type': {
      await page.fill(arg1, arg2);
      console.log(JSON.stringify({ ok: true, typed: arg2, into: arg1 }));
      break;
    }
    case 'url': {
      console.log(JSON.stringify({ ok: true, url: page.url(), title: await page.title() }));
      break;
    }
    case 'pages': {
      const result = [];
      for (let i = 0; i < pages.length; i++) {
        result.push({ i, url: pages[i].url(), title: await pages[i].title() });
      }
      console.log(JSON.stringify({ ok: true, pages: result }));
      break;
    }
    case 'switch': {
      const idx = parseInt(arg1);
      if (idx >= 0 && idx < pages.length) {
        await pages[idx].bringToFront();
        console.log(JSON.stringify({ ok: true, url: pages[idx].url() }));
      } else {
        console.log(JSON.stringify({ ok: false, error: 'bad index' }));
      }
      break;
    }
    case 'eval': {
      const data = await page.evaluate(arg1);
      console.log(JSON.stringify({ ok: true, data }));
      break;
    }
    default:
      console.log('Commands: screenshot, screenshot-full, goto, click, resize, type, url, pages, switch, eval');
  }

  process.exit(0);
}

// ── CLI router ──

const mode = process.argv[2];
if (mode === 'launch') {
  launch().catch(e => { console.error(e.message); process.exit(1); });
} else if (mode === 'run') {
  run().catch(e => { console.error(JSON.stringify({ ok: false, error: e.message })); process.exit(1); });
} else {
  console.log('Usage:');
  console.log('  node capture.js launch                    — Launch browser');
  console.log('  node capture.js run screenshot <out.png>  — Take screenshot');
  console.log('  node capture.js run goto <url>            — Navigate');
  console.log('  node capture.js run click <selector>      — Click element');
  console.log('  node capture.js run resize <w> <h>        — Resize viewport');
  console.log('  node capture.js run url                   — Get current URL');
  console.log('  node capture.js run pages                 — List all tabs');
  console.log('  node capture.js run switch <index>        — Switch tab');
  console.log('  node capture.js run eval <js>             — Evaluate JS');
}
