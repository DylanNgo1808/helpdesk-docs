Find screenshot placeholders in MDX files and auto-capture them.

## Prerequisites

- Browser running with CDP on port 9222 (`node .tools/capture.js launch`)
- User logged into the app
- Tools installed (`cd .tools && npm install`)

## Instructions

### Step 1: Load Configs

Read `.tools/config/routes.json` and `.tools/config/annotation-rules.json`.

### Step 2: Find Placeholders

Search for MDX files with screenshot comments:

```bash
grep -r "{/\* screenshot:" helpdesk/ --include="*.mdx" -l
```

If a specific article was requested, scope to that file only.

Extract ALL placeholders using two patterns:

**Enriched:** `{/* screenshot: (.+?) | page: (.+?) | element: (.+?) | annotate: (yes|no|auto) */}`
**Simple:** `{/* screenshot: (.+?) */}`

For each placeholder, determine:
- **slug**: filename without extension
- **category**: parent directory
- **stepNumber**: position among placeholders in this file
- **stepTitle**: text of the `### Step N:` heading above
- **stepBody**: paragraph between heading and placeholder

### Step 3: Infer Missing Data (Simple Placeholders)

**Route:** Look up slug in routes.json slugRoutes, fall back to categoryRoutes.
**Selector:** Use annotation-rules.json priority chain (bold text → Polaris → semantic → ARIA).
**Decision:** Match action verb to decisionMatrix (annotate/plain/skip).

### Step 4: Set Viewport

```bash
node .tools/capture.js run resize 1280 800
```

### Step 5: Capture Each Placeholder

Group by route to minimize navigation. For each:

1. Navigate if page changed: `node .tools/capture.js run goto "<route>"`
2. If annotate=yes: `node .tools/annotate.js public{imagePath} '{"selector":"<element>","stepNumber":<N>,"totalSteps":<total>,"position":"auto"}' '{"imageRadius":16}'`
3. If annotate=no (plain): `node .tools/capture.js run screenshot /tmp/temp-capture.png` then process with background
4. If skip: log and continue
5. Create image dir: `mkdir -p public/images/{slug}/`

### Step 6: Update MDX Files

For each successful capture, replace the placeholder comment with an image tag:

Before: `{/* screenshot: Send invoice button */}`
After: `![Send invoice button](/images/send-invoice/step-2.png)`

**Never remove a placeholder unless the screenshot was successfully captured.**

### Step 7: Report

```
Screenshots captured:

  {filename}.mdx ({category}/)
    Step 1: {description} -> PLAIN -> /images/{slug}/step-1.png
    Step 2: {description} -> ANNOTATED -> /images/{slug}/step-2.png
    Step 3: {description} -> SKIPPED (reason)

  Summary:
    Total: {n} | Annotated: {n} | Plain: {n} | Skipped: {n} | Failed: {n}
```

$ARGUMENTS: Optional: specific article filename or category to scope to
