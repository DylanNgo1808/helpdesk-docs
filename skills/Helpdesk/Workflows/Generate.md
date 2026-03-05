# Generate Workflow

Generate a help article by exploring the codebase and producing Intercom-style MDX for Nextra.

## Step 1: Parse the User's Request

Extract from the user's message:

| Field | Extract From | Default |
|-------|-------------|---------|
| **Feature** | The feature/topic to document | (required) |
| **Article type** | "guide", "reference", "troubleshooting" | `guide` |
| **Category** | Which help center category | Infer from feature |
| **Audience** | Merchant, developer, admin | `merchant` |

## Step 2: Explore the Codebase

Use the Explore agent to understand the feature:

1. **Find the feature code** — Search the app codebase for:
   - Controllers/routes handling the feature
   - Frontend pages/components for the feature UI
   - Services/helpers implementing the business logic

2. **Map the user flow** — From the code, determine:
   - What page(s) does the user visit?
   - What actions do they take (buttons, forms, selections)?
   - What are the prerequisites (settings, permissions)?
   - What are the success/error states?
   - What settings or options are configurable?

3. **Identify edge cases** — From the code:
   - Error handling and validation messages
   - Limits or restrictions (plan limits, rate limits)
   - Dependencies on other features or settings

## Step 3: Select Template

Based on article type and content:

| User Intent | Template | File |
|-------------|----------|------|
| "how to", "steps to", "set up" | Guide | `Templates/Guide.mdx` |
| "what is", "settings", "options", "variables" | Reference | `Templates/Reference.mdx` |
| "not working", "error", "fix", "issue" | Troubleshooting | `Templates/Troubleshooting.mdx` |

Read the selected template from the skill's `Templates/` directory.

## Step 4: Fill the Template

Replace all `{{PLACEHOLDER}}` values with content derived from codebase exploration:

### Frontmatter
- `{{TITLE}}` — Clear, action-oriented title (Guide: "How to X", Reference: "X Settings", Troubleshooting: "Fix: X Not Working")
- `{{DESCRIPTION}}` — One sentence, under 160 chars, includes the benefit

### Orientation Layer
- `{{INTRO_PARAGRAPH}}` — 1-2 sentences explaining what this article covers and why
- `{{PREREQUISITES}}` — What the user needs before starting (settings, permissions, plan)
- `{{OVERVIEW_PARAGRAPH}}` — Brief context about the feature

### Core Layer (varies by type)

**Guide:**
- `{{STEP_N_TITLE}}` — Action verb + object (e.g., "Open the template editor")
- `{{STEP_N_DESCRIPTION}}` — 2-3 sentences explaining the step, referencing specific UI elements in **bold**
- `{{STEP_N_SCREENSHOT_DESCRIPTION}}` — What the screenshot should show
- `{{APP_PAGE_PATH}}` — App route where screenshot is taken
- `{{CSS_SELECTOR}}` — Element to highlight
- `{{TIP_OR_WARNING}}` — Common gotcha or pro tip

**Reference:**
- Table headers and rows from feature settings/options
- Code examples from actual config or API usage
- Tabbed content for different platforms or methods

**Troubleshooting:**
- `{{SYMPTOM_DESCRIPTION}}` — What the user sees that's wrong
- `{{CAUSE_N_LABEL}}` — Tab label for each cause
- `{{CAUSE_N_EXPLANATION}}` — Why this cause happens
- Fix steps for each cause

### Navigation Layer
- `{{RELATED_N_TITLE}}` — Related article titles (from the category structure)
- `{{RELATED_N_HREF}}` — Nextra route paths
- `{{FEEDBACK_URL}}` — Issues URL

## Step 5: Write the Article

1. Determine the file path: `helpdesk/{category}/{slug}.mdx`
2. Create the directory if needed
3. Write the filled MDX file
4. Create the image directory: `mkdir -p public/images/{slug}/`

## Step 6: Report

Output summary:

```
Article: {title}
Path: helpdesk/{category}/{slug}.mdx
Screenshots needed: {count}
Next: Run /fill-screenshots to capture them, or /screenshot for individual ones
```
