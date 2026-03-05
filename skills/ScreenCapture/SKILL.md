---
name: ScreenCapture
description: Browser screenshot capture and annotation via Playwright CDP. Launches browser, user logs in, then navigates pages, captures screenshots with Excalidraw-style annotations, and saves to docs repo. USE WHEN screenshot, capture screenshot, annotate screenshot, screen capture, capture page, capture flow, screenshot from placeholder, capture help docs screenshots, browser screenshot, take screenshot, annotate image, capture steps, capture UI.
---

# ScreenCapture

Capture production screenshots via Playwright CDP and annotate them with Excalidraw-style sketchy arrows, red rectangles, and step number badges. Outputs polished images with gradient backgrounds, rounded corners, and drop shadows.

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| **Session dir** | `/tmp/playwright-session` | Working directory for browser session files |
| **CDP port** | `9222` | Chrome DevTools Protocol port |
| **Profile dir** | `/tmp/playwright-session/profile` | Browser profile for session persistence |
| **Viewport width** | `1280` | Browser viewport width |
| **Viewport height** | `800` | Browser viewport height |
| **Image radius** | `16` | Rounded corner radius on screenshots |
| **Background style** | `gradient` | Background: `gradient`, `solid`, or `bgImage` path |
| **Image dir** | `public/images/` | Image directory within docs repo |

## Architecture

### Browser Session (Persistent)

The browser runs as a background process with CDP enabled. The user logs in once, and all subsequent captures reuse that authenticated session.

```
Launch (headless: false, CDP port 9222)
  -> User logs into the app
  -> Browser stays open
  -> All capture commands connect via CDP
  -> Session cookies persist in profile dir
```

### Annotation Style

All annotations use a consistent Excalidraw-inspired style:
- **Red only** (`#E8364F`) — single color for all annotations
- **Sketchy rectangles** — double-stroke wobbly borders with subtle fill
- **Hand-drawn arrows** — curved paths with hand-drawn arrowheads
- **Step number badges** — red circle with white number (hidden for single-step)
- **One annotation per image** — single focus for readability
- **Auto-positioning** — arrow + badge placed where there's most space

### Output Style

- Rounded corners (16px)
- Gradient background (cyan -> deep blue -> purple -> amber)
- Drop shadow for depth
- 60px horizontal / 50px vertical padding

## Tools

Located in `.tools/` at the project root:

| Tool | File | Purpose |
|------|------|---------|
| **capture.js** | `.tools/capture.js` | Browser launch, CDP connection, navigate, screenshot, resize |
| **annotate.js** | `.tools/annotate.js` | DOM-aware sketchy annotation engine |
| **package.json** | `.tools/package.json` | Dependencies: `playwright`, `sharp` |

### capture.js Commands

```bash
# Launch browser with persistent profile + CDP
node .tools/capture.js launch

# Commands (connect via CDP):
node .tools/capture.js run screenshot <output.png>
node .tools/capture.js run screenshot-full <output.png>
node .tools/capture.js run goto <url>
node .tools/capture.js run click <selector>
node .tools/capture.js run resize <width> <height>
node .tools/capture.js run type <selector> <text>
node .tools/capture.js run url
node .tools/capture.js run pages
node .tools/capture.js run switch <tab-index>
node .tools/capture.js run eval <js-expression>
```

### annotate.js Usage

```bash
# Single annotation (arrow only, no number badge)
node .tools/annotate.js <output.png> '{"selector":".css-selector","position":"auto"}'

# Multi-step (numbered badges)
node .tools/annotate.js <output.png> '{"selector":".btn","stepNumber":1,"totalSteps":3,"position":"auto"}'

# With options
node .tools/annotate.js <output.png> <annotation.json> '{"imageRadius":16,"paddingX":60}'
```

Annotation JSON:
```json
{
  "selector": ".Polaris-Button",
  "position": "auto",
  "stepNumber": 1,
  "totalSteps": 3
}
```

Position options: `auto`, `top`, `bottom`, `left`, `right`, `top-left`, `top-right`, `bottom-left`, `bottom-right`

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **Capture** | "take screenshot", "capture page", "screenshot this" | `Workflows/Capture.md` |
| **CaptureFlow** | "capture flow", "capture steps", "screenshot walkthrough" | `Workflows/CaptureFlow.md` |
| **FromPlaceholders** | "capture from placeholders", "fill screenshots", "capture help doc images" | `Workflows/FromPlaceholders.md` |

## Integration with Helpdesk Skill

The **FromPlaceholders** workflow reads `{/* screenshot: ... */}` comments from Helpdesk MDX files:

```
{/* screenshot: DESCRIPTION | page: APP_PATH | element: CSS_SELECTOR */}
![ALT_TEXT](/images/ARTICLE_SLUG/FILENAME.png)
```

For each placeholder:
1. Navigate to the page
2. Wait for the element
3. Resize viewport to 1280px
4. Take screenshot
5. Annotate the element with sketchy red rect + arrow + step badge
6. Add gradient background + rounded corners
7. Save to docs repo at the image path
8. Remove the `{/* screenshot: ... */}` comment from the MDX

## Examples

**Example 1: Single screenshot**
```
User: "take a screenshot of the orders page"
-> Connects to browser via CDP
-> Navigates to orders page
-> Captures screenshot with gradient bg
-> Saves to output directory
```

**Example 2: Annotated capture**
```
User: "capture the Save button on the settings page"
-> Connects via CDP
-> Finds button element via selector
-> Draws sketchy red rect + arrow
-> Adds gradient background
-> Saves annotated image
```

**Example 3: Fill Helpdesk placeholders**
```
User: "capture screenshots for the send-invoice help article"
-> Reads MDX file for screenshot placeholders
-> For each placeholder: navigate, capture, annotate, save
-> Updates MDX to remove placeholder comments
-> Reports: "4 screenshots captured and saved"
```
