---
name: GitBookPublish
description: Publish markdown documentation to GitBook via Git Import API. Pushes local markdown files to a GitHub bridge repo, then triggers GitBook's Git Import to sync content into a GitBook space. USE WHEN publish gitbook, push to gitbook, sync gitbook, deploy docs, publish help docs, update gitbook, gitbook import, push markdown to gitbook, deploy help center.
---

# GitBookPublish

Publish markdown help documentation to GitBook by pushing content through a GitHub bridge repo and triggering GitBook's Git Import API. Supports full space sync and single-folder updates.

## Configuration

| Setting | Required | Description |
|---------|----------|-------------|
| **GITHUB_TOKEN** | Yes | GitHub PAT with repo write access |
| **GITHUB_REPO** | Yes | GitHub bridge repo (e.g., `org/helpdesk-content`) |
| **GITBOOK_TOKEN** | Yes | GitBook API token from [Developer Settings](https://app.gitbook.com/account/developer) |
| **GITBOOK_SPACE_ID** | Yes | Target GitBook space ID (from space URL) |
| **SOURCE_DIR** | Yes | Local directory containing markdown files |

## Architecture

### Why a Bridge Repo?

GitBook's API is **read-only for page content** — there is no `PUT /pages` endpoint. The only way to push markdown programmatically is through Git Import, which requires a remote Git repository URL.

```
Local markdown  -->  GitHub repo (bridge)  -->  GitBook Space
  docs/user-guide/     tuanvm-glitch/CKU-*      docs.avada.io

  [git push]            [Git Import API]
  Step 1-3              Step 4
```

### GitBook API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/v1/spaces/{spaceId}/git/import` | POST | Trigger content sync from Git repo |
| `/v1/spaces/{spaceId}/content/pages` | GET | Verify page structure after import |
| `/v1/spaces/{spaceId}/content/page/{pageId}` | GET | Verify page content |

### How Git Import Works

1. GitBook clones the repo at the specified ref
2. Parses all `.md` files following the directory structure
3. Maps directories → GitBook groups, files → pages
4. Supports GitBook-flavored markdown: `{% embed %}`, `{% hint %}`, tables, etc.
5. **Replaces the entire space content** with repo content

### GitBook Markdown Format

GitBook supports standard markdown plus special blocks:

```markdown
# Page Title

Regular markdown content.

{% hint style="warning" %}
Warning text here.
{% endhint %}

{% embed url="https://example.com/image.webp" %}

| Column 1 | Column 2 |
|----------|----------|
| Data     | Data     |
```

## Script: push-helpdesk.mjs

Located at `scripts/push-helpdesk.mjs`. A standalone Node.js script (no dependencies) that handles the full publish flow.

### Usage

```bash
# Push ALL markdown files from source dir
node scripts/push-helpdesk.mjs

# Push only a specific folder
node scripts/push-helpdesk.mjs discount-list

# Preview what would be pushed (no changes)
node scripts/push-helpdesk.mjs --dry-run

# Combine: preview a specific folder
node scripts/push-helpdesk.mjs discount-list --dry-run
```

### What the Script Does

| Step | Action | Detail |
|------|--------|--------|
| 1 | Clone | Clones the GitHub bridge repo to `/tmp/` |
| 2 | Copy | Copies `.md` files from source dir to repo |
| 3 | Commit & Push | Stages, commits, pushes to GitHub `main` |
| 4 | Git Import | `POST /spaces/{spaceId}/git/import` — GitBook syncs from repo |

### Configuration in Script

Edit the config section at the top of `scripts/push-helpdesk.mjs`:

```javascript
const GITHUB_REPO = 'org/helpdesk-content';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'ghp_xxx';
const GITBOOK_TOKEN = process.env.GITBOOK_TOKEN || 'gb_api_xxx';
const GITBOOK_SPACE_ID = 'your-space-id';
const SOURCE_DIR = resolve(import.meta.dirname, '../docs/user-guide');
```

Or use environment variables:

```bash
GITHUB_TOKEN=ghp_xxx GITBOOK_TOKEN=gb_api_xxx node scripts/push-helpdesk.mjs
```

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **Publish** | "publish to gitbook", "push to gitbook", "sync gitbook", "deploy docs" | `Workflows/Publish.md` |
| **Verify** | "check gitbook", "verify gitbook", "gitbook status" | `Workflows/Verify.md` |
| **Setup** | "setup gitbook", "configure gitbook publish", "create bridge repo" | `Workflows/Setup.md` |

## Important Notes

- **Full space sync**: Git Import replaces ALL content in the space with repo content. Ensure your repo contains the complete space structure.
- **GitBook parses markdown**: `{% embed %}`, `{% hint %}`, tables are converted to GitBook's internal document format automatically.
- **Import takes ~15 seconds**: Content update is async. Verify after a short wait.
- **Branch**: Always imports from `refs/heads/main`.
- **No SUMMARY.md needed**: GitBook infers structure from directory layout + existing space TOC.
- **Images**: Use external URLs (e.g., CloudFront). GitBook renders `{% embed url="..." %}` as inline images.

## Integration with Other Skills

### With Helpdesk Skill
1. **Helpdesk** generates MDX articles with screenshot placeholders
2. **ScreenCapture** fills placeholders with annotated screenshots
3. Convert MDX to GitBook markdown (remove Nextra-specific imports)
4. **GitBookPublish** pushes to GitBook space

### With ScreenCapture Skill
Screenshots uploaded to external hosting (e.g., CloudFront via Avada Capture API) are referenced in markdown as `{% embed url="..." %}` — GitBook renders these as embedded images.

## Examples

**Example 1: Publish all docs**
```
User: "publish docs to gitbook"
-> Runs push-helpdesk.mjs
-> Copies all markdown from docs/user-guide/ to GitHub repo
-> Triggers GitBook import
-> Reports: "38 files synced to GitBook"
```

**Example 2: Publish single section**
```
User: "push discount-list docs to gitbook"
-> Runs push-helpdesk.mjs discount-list
-> Copies only discount-list/*.md
-> Pushes and triggers import
-> Reports: "1 file synced"
```

**Example 3: Verify after publish**
```
User: "check if gitbook updated"
-> Calls GET /spaces/{spaceId}/content/pages
-> Compares page titles and node counts
-> Reports content status per page
```
