Capture an annotated screenshot from the browser.

## Prerequisites

- Browser must be running with CDP on port 9222
- If not running: `node .tools/capture.js launch` then log into the app
- Tools installed: `cd .tools && npm install`

## Instructions

1. Parse the user's request for: page/URL, element selector, output path
2. Navigate if needed: `node .tools/capture.js run goto "<url>"`
3. Resize viewport: `node .tools/capture.js run resize 1280 800`
4. Capture with annotation:

If an element selector was provided:
```bash
node .tools/annotate.js <output.png> '{"selector":"<css>","position":"auto"}' '{"imageRadius":16}'
```

For multi-step captures, pass stepNumber and totalSteps:
```bash
node .tools/annotate.js <output.png> '{"selector":"<css>","stepNumber":1,"totalSteps":3,"position":"auto"}' '{"imageRadius":16}'
```

If totalSteps is 1 or omitted, only the arrow is shown (no number badge).

For plain screenshot (no annotation):
```bash
node .tools/capture.js run screenshot <output.png>
```

5. Report the result and open the file: `open <output.png>`

## Selector Tips

- Use Playwright text selectors: `button:has-text('Save')`
- Polaris components: `.Polaris-Button`, `.Polaris-Select`, `.Polaris-TextField`
- Check `.tools/config/annotation-rules.json` for the full Polaris selector mapping

$ARGUMENTS: What to capture (page, element, description)
