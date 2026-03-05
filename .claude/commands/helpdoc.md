Generate a help article by exploring the codebase.

## Instructions

### Step 1: Parse Request

Extract: feature to document, article type (guide/reference/troubleshooting), category, audience (default: merchant).

### Step 2: Explore the Codebase

Search the app codebase for:
- Controllers/routes handling the feature
- Frontend pages/components for the feature UI
- Services/helpers with business logic
- Error handling and validation messages

Map the user flow: pages visited, actions taken, prerequisites, success/error states.

### Step 3: Select Template

| Intent | Type |
|--------|------|
| "how to", "steps to", "set up" | Guide |
| "what is", "settings", "options" | Reference |
| "not working", "error", "fix" | Troubleshooting |

### Step 4: Load Configs for Screenshot Placeholders

Read `.tools/config/routes.json` to find the app route for this article's slug/category.

Read `.tools/config/annotation-rules.json` to:
- Classify each step's action verb → annotate/plain/skip
- Infer CSS selectors from bold text in step descriptions using the priority chain:
  1. Bold text → `button:has-text('Save')`
  2. Element type → `.Polaris-Button`
  3. Semantic keyword → `.Polaris-Navigation`
  4. ARIA fallback → `[aria-label*='Save']`

### Step 5: Write the Article

Create the MDX file at `helpdesk/{category}/{slug}.mdx` with:

**Frontmatter:** title, description

**Guide structure:**
```mdx
import { Steps, Callout, Cards } from 'nextra/components'

# {Title}

{Intro paragraph — what this covers and why}

<Callout type="info">
**Prerequisites:** {What's needed before starting}
</Callout>

<Steps>

### Step 1: {Action verb + object}

{2-3 sentences with specific UI elements in **bold**}

{/* screenshot: {description} | page: {route} | element: {selector} | annotate: yes */}
![{alt text}](/images/{slug}/step-1.png)

### Step 2: {Action verb + object}

...

</Steps>

<Callout type="warning">
{Common gotcha or pro tip}
</Callout>

## Related Articles

<Cards>
  <Cards.Card title="{Related title}" href="/docs/{path}" />
</Cards>
```

### Step 6: Create Image Directory

```bash
mkdir -p public/images/{slug}/
```

### Step 7: Report

```
Article: {title}
Path: helpdesk/{category}/{slug}.mdx
Screenshots needed: {count} (annotated: {n}, plain: {n})
Next: Run /fill-screenshots to capture them, or /screenshot for individual ones
```

$ARGUMENTS: Feature to document and any specific instructions
