# Capture Workflow

Capture a single annotated screenshot from the browser.

## Prerequisites

- Browser must be running with CDP on port 9222
- User must be logged into the app
- If not running: `node .tools/capture.js launch`
- Then ask the user to log in and confirm

## Step 1: Parse Request

Extract from the user's message:

| Field | Extract | Default |
|-------|---------|---------|
| **Page/URL** | What page to capture | Current page |
| **Element** | CSS selector to highlight | None (plain screenshot) |
| **Output path** | Where to save | `public/images/<slug>/<name>.png` |

## Step 2: Navigate (if needed)

If a specific page was requested:

```bash
node .tools/capture.js run goto "<url>"
```

## Step 3: Resize Viewport

```bash
node .tools/capture.js run resize 1280 800
```

Wait for the page to settle after resize.

## Step 4: Capture + Annotate

If an element selector was provided:

```bash
node .tools/annotate.js <output.png> '{"selector":"<css>","position":"auto"}' '{"imageRadius":16}'
```

If no element (plain screenshot):

```bash
node .tools/capture.js run screenshot <output.png>
```

## Step 5: Report

```
Screenshot captured:
  File: <output_path>
  Element: <selector>
  Size: <width>x<height>
```

Open the file for the user: `open <output_path>`
