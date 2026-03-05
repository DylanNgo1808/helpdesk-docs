# PDF Help Docs — Claude Code Instructions

This is a Nextra-based help center for the PDF Invoice Shopify app. Claude Code can generate help articles, capture annotated screenshots, and manage documentation.

## Quick Start

Use slash commands:
- `/screenshot` — Capture and annotate a browser screenshot
- `/helpdoc` — Generate a help article from codebase exploration
- `/fill-screenshots` — Auto-capture screenshots for all placeholders in MDX files

## Setup (One-Time)

### 1. Install screenshot tools

```bash
cd .tools && npm install && cd ..
```

### 2. Launch browser for screenshots

```bash
node .tools/capture.js launch
```

Then log into the Shopify app in the browser window. The browser stays open — all screenshot commands connect via CDP on port 9222.

## Screenshot Tools

Located in `.tools/`. Two Node.js scripts:

### capture.js — Browser control via CDP

```bash
node .tools/capture.js run screenshot <output.png>   # Take screenshot
node .tools/capture.js run goto <url>                 # Navigate
node .tools/capture.js run click <selector>           # Click element
node .tools/capture.js run resize <w> <h>             # Resize viewport
node .tools/capture.js run eval <js>                  # Run JS in page
```

### annotate.js — Add Excalidraw-style annotations

Draws a red rectangle around an element with a hand-drawn arrow and optional step number badge. Outputs with gradient background and rounded corners.

```bash
# Single annotation (arrow only, no number badge)
node .tools/annotate.js output.png '{"selector":".Polaris-Button","position":"auto"}'

# Multi-step (numbered badges: 1, 2, 3...)
node .tools/annotate.js output.png '{"selector":".btn","stepNumber":1,"totalSteps":3,"position":"auto"}'
```

Options (3rd arg): `{"imageRadius":16,"paddingX":60,"noBackground":false}`

## Screenshot Placeholder Format

MDX files use placeholder comments that `/fill-screenshots` processes:

**Simple format:**
```
{/* screenshot: Click the Save button */}
```

**Enriched format (from /helpdoc):**
```
{/* screenshot: Save button | page: /orders | element: button:has-text('Save') | annotate: yes */}
![Save button](/images/article-slug/step-1.png)
```

## Annotation Intelligence

Config files in `.tools/config/`:

- **routes.json** — Maps article slugs/categories to app routes
- **annotation-rules.json** — Decision matrix for annotate vs plain vs skip, CSS selector inference from step text, Polaris component patterns

### How selector inference works

1. Extract **bold text** from step description → `button:has-text('Save')`
2. Match UI element type to Polaris class → `.Polaris-Button--primary`
3. Match description keywords → `.Polaris-Navigation`
4. ARIA fallback → `[aria-label*='Save']`

### How annotation decisions work

- Action verbs (click, select, toggle, enter) → annotated screenshot
- Observation verbs (review, verify, navigate to) → plain screenshot
- Transient states (wait, loading) → skip

## Help Article Structure

Articles live in `helpdesk/` as MDX files organized by category:

```
helpdesk/
  getting-started/
  orders/
  templates/
  settings/
  ...
```

Images go in `public/images/{article-slug}/`.

## Article Types

- **Guide** — Step-by-step how-to with numbered steps and screenshots
- **Reference** — Feature explanation with tables and code examples
- **Troubleshooting** — Problem-solution with tabbed causes

## Nextra Components

Available imports from `nextra/components`: Steps, Callout, Cards, Tabs, FileTree.
