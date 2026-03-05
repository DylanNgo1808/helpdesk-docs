# FromPlaceholders Workflow

Read Helpdesk MDX files, find `{/* screenshot: ... */}` placeholders, and auto-capture + annotate each one.

## Prerequisites

- Browser running with CDP on port 9222
- User logged into the app
- Helpdesk MDX files with screenshot placeholders

## Step 1: Load Configs

Read `.tools/config/routes.json` and `.tools/config/annotation-rules.json`.

## Step 2: Find Placeholders

Search for MDX files with screenshot comments:

```bash
grep -r "{/\* screenshot:" helpdesk/ --include="*.mdx" -l
```

For each file, extract all placeholders using two patterns:

**Enriched:** `{/* screenshot: (.+?) | page: (.+?) | element: (.+?) | annotate: (yes|no|auto) */}`
**Simple:** `{/* screenshot: (.+?) */}`

Build a list with:
- **file**: MDX file path
- **description**: What the screenshot should show
- **page**: App route (from placeholder or inferred from routes.json)
- **element**: CSS selector (from placeholder or inferred from annotation-rules.json)
- **imagePath**: Output image path
- **stepNumber**: Position among placeholders in this file

## Step 3: Infer Missing Data (Simple Placeholders)

**Route:** Look up slug in routes.json `slugRoutes`, fall back to `categoryRoutes`.
**Selector:** Use annotation-rules.json priority chain (bold text -> Polaris -> semantic -> ARIA).
**Decision:** Match action verb to `decisionMatrix` (annotate/plain/skip).

## Step 4: Set Viewport

```bash
node .tools/capture.js run resize 1280 800
```

## Step 5: Capture Each Placeholder

Group by route to minimize navigation. For each:

1. **Navigate** if page changed: `node .tools/capture.js run goto "<route>"`
2. **If annotate=yes**:
   ```bash
   node .tools/annotate.js public<imagePath> \
     '{"selector":"<element>","stepNumber":<N>,"totalSteps":<total>,"position":"auto"}' \
     '{"imageRadius":16}'
   ```
3. **If annotate=no** (plain): `node .tools/capture.js run screenshot <output.png>`
4. **If skip**: log and continue
5. **Create image dir**: `mkdir -p public/images/<slug>/`

## Step 6: Update MDX Files

For each successful capture, replace the placeholder comment with an image tag:

Before: `{/* screenshot: Send invoice button */}`
After: `![Send invoice button](/images/send-invoice/step-2.png)`

**Never remove a placeholder unless the screenshot was successfully captured.**

## Step 7: Report

```
Screenshots captured:

  <filename>.mdx (<category>/)
    Step 1: <description> -> PLAIN -> /images/<slug>/step-1.png
    Step 2: <description> -> ANNOTATED -> /images/<slug>/step-2.png
    Step 3: <description> -> SKIPPED (reason)

  Summary:
    Total: <n> | Annotated: <n> | Plain: <n> | Skipped: <n> | Failed: <n>
```

## Error Handling

- **Selector not found**: Log warning, skip to next placeholder, do NOT remove the comment
- **Navigation failure**: Log error, skip to next placeholder
- **Image write failure**: Log error, continue

Never remove a `{/* screenshot: ... */}` comment unless the screenshot was successfully captured and saved.
