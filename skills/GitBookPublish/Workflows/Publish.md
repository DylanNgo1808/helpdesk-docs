# Publish Workflow

Push local markdown documentation to GitBook via GitHub bridge repo + Git Import API.

## Prerequisites

- `scripts/push-helpdesk.mjs` exists and is configured with:
  - `GITHUB_TOKEN` — GitHub PAT with repo write access
  - `GITBOOK_TOKEN` — GitBook API token
  - `GITBOOK_SPACE_ID` — Target space ID
  - `GITHUB_REPO` — Bridge repo path
  - `SOURCE_DIR` — Local markdown directory
- GitHub bridge repo exists and matches GitBook space structure
- GitBook API token has admin access to the space

## Step 1: Parse Request

Extract from the user's message:

| Field | Extract | Default |
|-------|---------|---------|
| **Folder** | Specific folder to publish | All folders |
| **Dry run** | "preview", "what would change" | No |

## Step 2: Dry Run (Optional)

If the user wants to preview:

```bash
node scripts/push-helpdesk.mjs <folder> --dry-run
```

This shows which files would be copied without making any changes.

## Step 3: Execute Publish

```bash
# All folders
node scripts/push-helpdesk.mjs

# Specific folder
node scripts/push-helpdesk.mjs <folder-name>
```

The script will:
1. Clone the GitHub bridge repo to `/tmp/`
2. Copy markdown files from source directory
3. Commit and push changes to GitHub
4. Trigger GitBook Git Import via API (`POST /spaces/{spaceId}/git/import`)

## Step 4: Verify (Optional)

Wait ~15 seconds for GitBook to process, then verify:

```bash
curl -s -H "Authorization: Bearer $GITBOOK_TOKEN" \
  "https://api.gitbook.com/v1/spaces/$SPACE_ID/content/pages" | \
  python3 -c "
import json, sys
data = json.load(sys.stdin)
def show(pages, indent=0):
    for p in pages:
        print(f\"{'  '*indent}{p.get('kind','')}: {p.get('title','')} [{p.get('path','')}\")
        show(p.get('pages',[]), indent+1)
show(data.get('pages',[]))
"
```

## Step 5: Report

```
Published to GitBook:
  Files pushed: {count}
  Folder: {folder or "all"}
  Space: {space_url}
  Status: GitBook import triggered (HTTP 204)

Verify at: https://app.gitbook.com/o/{orgId}/s/{spaceId}/
```

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| "No changes detected" | Source files match repo | Check if markdown was actually modified |
| GitBook import returns 401 | Invalid GitBook token | Regenerate at app.gitbook.com/account/developer |
| GitBook import returns 403 | Token lacks admin access | Ensure token user has admin on the space |
| Pages not updated after import | Import still processing | Wait 15-30 seconds and verify again |
| Content structure wrong | Repo doesn't match space TOC | Ensure directory structure matches GitBook groups |
