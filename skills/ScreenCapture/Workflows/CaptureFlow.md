# CaptureFlow Workflow

Capture a multi-step UI flow — navigate through pages, capture + annotate each step, output numbered images.

## Prerequisites

- Browser running with CDP on port 9222
- User logged into the app

## Step 1: Parse the Flow

From the user's request, build a step list:

```json
[
  { "action": "goto", "url": "/orders", "selector": ".order-list", "description": "Orders page" },
  { "action": "click", "target": ".order-row:first-child", "selector": ".order-detail", "description": "Open order" },
  { "action": "click", "target": "button:has-text('More actions')", "selector": ".dropdown-menu", "description": "More actions menu" }
]
```

Each step has:
- **action**: `goto`, `click`, `wait`, or `none` (just capture current state)
- **url/target**: Where to navigate or what to click
- **selector**: Element to highlight in the annotation
- **description**: What this step shows

## Step 2: Set Viewport

```bash
node .tools/capture.js run resize 1280 800
```

## Step 3: Execute Each Step

For each step in the flow:

1. **Perform the action** (navigate/click/wait)
2. **Wait for page to settle** (networkidle or timeout)
3. **Capture + annotate**:
   ```bash
   node .tools/annotate.js <output-dir>/step-<N>.png \
     '{"selector":"<css>","stepNumber":<N>,"totalSteps":<total>,"position":"auto"}' \
     '{"imageRadius":16}'
   ```
4. **Verify** the output image

## Step 4: Report

```
Flow captured: <flow_name>
  Step 1: <description> -> <path>/step-1.png
  Step 2: <description> -> <path>/step-2.png
  Step 3: <description> -> <path>/step-3.png
  Total: <count> screenshots
  Output: <output_dir>
```
