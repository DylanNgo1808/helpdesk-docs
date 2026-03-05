---
name: Helpdesk
description: Generate help documentation from codebase exploration. Explores code, writes Intercom-style guides with screenshot steps, outputs MDX for Nextra. USE WHEN helpdesk, help docs, help article, write guide, create documentation, feature guide, generate docs, help center, write help, document feature, release notes guide, merge request docs, nextra docs.
---

# Helpdesk

Generate professional help center documentation by exploring codebases and producing Intercom-style MDX articles for the Nextra docs framework.

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| **Target repo** | *(your app codebase)* | Codebase to explore for features |
| **Output dir** | `helpdesk/` | Directory within Nextra for MDX content |
| **Image dir** | `public/images/` | Directory for screenshots |
| **Feedback URL** | *(your issues URL)* | Link for "Was this helpful?" |

## Article Types

### Guide (How-to)
**Template:** `Templates/Guide.mdx`
**Use for:** Step-by-step instructions to accomplish a task
**Pattern:** Prerequisites -> Numbered Steps with Screenshots -> What's Next

### Reference
**Template:** `Templates/Reference.mdx`
**Use for:** Feature explanations, settings, API docs, variable lists
**Pattern:** Overview -> Parameter Tables -> Code Examples -> Related

### Troubleshooting
**Template:** `Templates/Troubleshooting.mdx`
**Use for:** Problem-solution articles when things go wrong
**Pattern:** Symptom -> Quick Fix -> Causes (Tabbed) with Solutions -> Escalation

## Screenshot Placeholder Format

All templates use a structured comment format for screenshots:

```
{/* screenshot: DESCRIPTION | page: APP_PATH | element: CSS_SELECTOR */}
![ALT_TEXT](/images/ARTICLE_SLUG/FILENAME.png)
```

- **DESCRIPTION**: What the screenshot should show
- **page**: The app page/route where the screenshot is taken
- **element**: CSS selector to highlight or focus on
- **ALT_TEXT**: Accessible alt text for the image

Screenshots are captured via the ScreenCapture skill or manually.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **Generate** | "generate docs", "write guide", "document feature", "help article for" | `Workflows/Generate.md` |
| **FromMR** | "merge request docs", "MR guide", "release docs", "document this MR" | `Workflows/FromMR.md` |
| **Review** | "review docs", "check help articles", "screenshot review" | `Workflows/Review.md` |
| **Organize** | "organize docs", "update navigation", "restructure help center" | `Workflows/Organize.md` |

## Examples

**Example 1: Generate a guide from a feature**
```
User: "write a help guide for the email automation feature"
-> Invokes Generate workflow
-> Explores app codebase for email automation code
-> Identifies UI flows, settings, and user-facing behavior
-> Generates Guide.mdx with steps, screenshot placeholders, and callouts
```

**Example 2: Document a merge request**
```
User: "document this MR: https://github.com/org/repo/pull/123"
-> Invokes FromMR workflow
-> Reads MR diff to understand what changed
-> Determines article type (guide/reference/troubleshooting)
-> Generates appropriate MDX article from changes
```

**Example 3: Review and add screenshots**
```
User: "review docs and capture screenshots"
-> Invokes Review workflow
-> Scans all MDX files for screenshot placeholders
-> Lists pages needing screenshots with instructions
-> Optionally uses browser automation to capture them
```

## Nextra Integration

**Adding a new article requires:**
1. Create the MDX file at the correct path in `helpdesk/`
2. Add images to `public/images/{article-slug}/`
3. Update navigation metadata (`_meta.json`) if needed

**Supported Nextra components:**
- `Steps` — numbered step sequences
- `Callout` — info, warning, error, important boxes
- `Cards` — related article link cards
- `Tabs` — tabbed content (causes, platforms, etc.)
- `FileTree` — directory structure visualization

All imports from `nextra/components`.

## Category Structure

Suggested help center categories:

| Category | Slug | Topics |
|----------|------|--------|
| Getting Started | `getting-started` | Installation, setup wizard, first use |
| Templates | `templates` | Creating, editing, variables, CSS, preview |
| Orders | `orders` | Printing, downloading, bulk operations |
| Automation | `automation` | Email triggers, scheduling, webhooks |
| Settings | `settings` | Store details, payment info, integrations |
| Advanced | `advanced` | Metafields, custom data, FTP, Google Drive |
| Troubleshooting | `troubleshooting` | Common issues, email delivery, rendering |
