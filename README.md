# PDF Help Docs

Help center for the Better PDF Invoice Shopify app, built with [Nextra](https://nextra.site). Includes AI-powered tools for generating help articles and capturing annotated screenshots via Claude Code.

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (comes with Node.js)
- **Claude Code** CLI — for `/helpdoc`, `/screenshot`, and `/fill-screenshots` slash commands

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

The help center is now running at `http://localhost:3000`.

### 3. Build for production

```bash
npm run build
npm start
```

The build step also generates a sitemap and [Pagefind](https://pagefind.app/) search index.

---

## Project Structure

```
pdf-help-docs/
  helpdesk/               # MDX help articles organized by category
    getting-started/
    orders/
    draft-orders/
    templates/
    email-automation/
    settings/
    delivery-methods/
    subscription/
    b2b/
    shopify-extensions/
    troubleshooting/
    ARTICLE_TEMPLATE.md   # Template for new articles
  public/
    images/               # Screenshot images (per article slug)
  src/app/                # Next.js app directory
    docs/[[...mdxPath]]/  # Nextra catch-all route
  .tools/                 # Screenshot & annotation tools
    capture.js            # Browser control via Playwright CDP
    annotate.js           # Excalidraw-style annotation engine
    config/
      routes.json         # Maps article slugs to app routes
      annotation-rules.json  # Annotation decision matrix & selector inference
  .claude/commands/       # Claude Code slash commands
    helpdoc.md            # /helpdoc — generate help articles
    screenshot.md         # /screenshot — capture annotated screenshots
    fill-screenshots.md   # /fill-screenshots — batch-fill placeholders
```

---

## Screenshot & Annotation Tools

The `.tools/` directory contains two Node.js scripts for capturing and annotating screenshots of the Shopify app.

### Setup (one-time)

```bash
cd .tools && npm install && cd ..
```

This installs **Playwright** (browser automation) and **Sharp** (image processing).

### Launch the browser

```bash
node .tools/capture.js launch
```

This opens a Chromium browser with CDP (Chrome DevTools Protocol) on port 9222. **Log into your Shopify app** in this browser window. The browser stays open — all screenshot commands connect to it.

### capture.js — Browser control

```bash
# Take a screenshot
node .tools/capture.js run screenshot output.png

# Full-page screenshot
node .tools/capture.js run screenshot-full output.png

# Navigate to a URL
node .tools/capture.js run goto "https://your-app-url.com/orders"

# Click an element
node .tools/capture.js run click "button:has-text('Save')"

# Resize viewport
node .tools/capture.js run resize 1280 800

# Type into a field
node .tools/capture.js run type ".Polaris-TextField input" "Hello"

# Get current URL
node .tools/capture.js run url

# List all open tabs
node .tools/capture.js run pages

# Switch to tab by index
node .tools/capture.js run switch 0

# Run JavaScript in the page
node .tools/capture.js run eval "document.title"
```

### annotate.js — Add annotations to screenshots

Draws a hand-drawn red rectangle around a UI element with a sketchy arrow and optional step number badge. Outputs with a gradient background and rounded corners.

```bash
# Single annotation (arrow only, no number badge)
node .tools/annotate.js output.png '{"selector":".Polaris-Button","position":"auto"}'

# Multi-step (numbered badges: 1, 2, 3...)
node .tools/annotate.js output.png '{"selector":".btn","stepNumber":1,"totalSteps":3,"position":"auto"}'

# With custom options
node .tools/annotate.js output.png '{"selector":".Polaris-Button","position":"auto"}' '{"imageRadius":16,"paddingX":60,"noBackground":false}'
```

**Annotation JSON fields:**

| Field | Type | Description |
|-------|------|-------------|
| `selector` | string | CSS/Playwright selector for the target element |
| `position` | string | Arrow position: `auto`, `top`, `bottom`, `left`, `right`, `top-right`, `top-left`, `bottom-right`, `bottom-left` |
| `stepNumber` | number | Step number for the badge (default: 1) |
| `totalSteps` | number | Total steps — if 1 or omitted, no badge is shown |

**Options JSON fields:**

| Field | Default | Description |
|-------|---------|-------------|
| `imageRadius` | 16 | Corner radius for the screenshot |
| `paddingX` | 60 | Horizontal padding around the image |
| `paddingY` | 50 | Vertical padding around the image |
| `noBackground` | false | Skip the gradient background |

---

## Claude Code Skills

These slash commands are available in Claude Code when working in this project.

### /helpdoc — Generate a help article

Explores the app codebase, maps the user flow, and generates a complete MDX help article with screenshot placeholders.

```
/helpdoc How to send an invoice
```

**What it does:**
1. Parses your request (feature, article type, category)
2. Explores the app codebase for routes, components, and business logic
3. Selects the right template (Guide / Reference / Troubleshooting)
4. Loads route and annotation configs for smart screenshot placeholders
5. Writes the MDX file to `helpdesk/{category}/{slug}.mdx`
6. Creates the image directory at `public/images/{slug}/`

**Article types:**

| Request pattern | Type |
|-----------------|------|
| "how to", "steps to", "set up" | Guide |
| "what is", "settings", "options" | Reference |
| "not working", "error", "fix" | Troubleshooting |

### /screenshot — Capture a single screenshot

Captures an annotated or plain screenshot from the running browser.

```
/screenshot the orders page with the print button highlighted
```

**Prerequisites:** Browser must be running (`node .tools/capture.js launch`) and logged into the app.

### /fill-screenshots — Batch-fill all placeholders

Finds all `{/* screenshot: ... */}` placeholders in MDX files and captures them automatically.

```
/fill-screenshots
/fill-screenshots orders/send-invoice
```

**What it does:**
1. Scans MDX files for screenshot placeholder comments
2. Groups placeholders by route to minimize navigation
3. Infers selectors and annotation decisions from step text
4. Captures each screenshot (annotated, plain, or skip)
5. Replaces placeholders with `![alt](/images/slug/step-N.png)` tags

---

## Screenshot Placeholder Format

MDX files use comment placeholders that `/fill-screenshots` processes:

**Simple format** (for manually written articles):
```
{/* screenshot: Click the Save button */}
```

**Enriched format** (auto-generated by `/helpdoc`):
```
{/* screenshot: Save button | page: /orders | element: button:has-text('Save') | annotate: yes */}
![Save button](/images/article-slug/step-1.png)
```

### How annotation decisions work

The decision matrix in `.tools/config/annotation-rules.json`:

- **Annotate** — action verbs (click, select, toggle, enter, type) — draws red rect + arrow
- **Plain** — observation verbs (review, verify, navigate to) — full-page screenshot only
- **Skip** — transient states (wait, loading, repeat step) — no screenshot

### How selector inference works

When a placeholder doesn't specify an element, the system infers it:

1. Extract **bold text** from the step description -> `button:has-text('Save')`
2. Match UI element type to Polaris class -> `.Polaris-Button--primary`
3. Match description keywords -> `.Polaris-Navigation`
4. ARIA fallback -> `[aria-label*='Save']`

---

## Writing Articles Manually

Articles are MDX files in `helpdesk/` organized by category. See `helpdesk/ARTICLE_TEMPLATE.md` for the standard format.

**Key rules:**
- Title format: "How to [Verb]..." (task-oriented)
- 5-12 steps per article
- Every step has a screenshot placeholder
- Mention UI elements in **bold** (buttons, tabs, fields)
- Use Nextra components: `Steps`, `Callout`, `Cards`, `Tabs`, `FileTree` from `nextra/components`

---

## Configuration

### routes.json

Maps article slugs and categories to app routes for screenshot navigation. Located at `.tools/config/routes.json`.

```json
{
  "categoryRoutes": {
    "orders": "/orders",
    "templates": "/templates"
  },
  "slugRoutes": {
    "send-invoice": "/orders/view/:id",
    "browse-templates": "/templates"
  }
}
```

### annotation-rules.json

Controls annotation decisions, selector inference, and density limits. Located at `.tools/config/annotation-rules.json`.

---

## Tech Stack

- **[Next.js](https://nextjs.org/)** 16 — React framework
- **[Nextra](https://nextra.site/)** 4 — Documentation theme for Next.js
- **[Pagefind](https://pagefind.app/)** — Static search index (generated at build time)
- **[Playwright](https://playwright.dev/)** — Browser automation for screenshots
- **[Sharp](https://sharp.pixelplumbing.com/)** — Image processing for annotations
