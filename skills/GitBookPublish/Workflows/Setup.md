# Setup Workflow

Set up the GitBook publish pipeline from scratch.

## Step 1: Create GitHub Bridge Repo

The bridge repo acts as an intermediary between local markdown and GitBook.

```bash
# Via GitHub API
curl -X POST -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.github.com/user/repos" \
  -d '{"name":"helpdesk-content","description":"Bridge repo for GitBook docs","auto_init":true,"private":false}'
```

Or create manually at github.com/new.

## Step 2: Get GitBook Credentials

1. **API Token**: Go to [GitBook Developer Settings](https://app.gitbook.com/account/developer) → Generate token
2. **Space ID**: From your GitBook space URL:
   ```
   https://app.gitbook.com/o/{orgId}/s/{spaceId}/
                                       ^^^^^^^^^ this
   ```
3. **Org ID**: From the same URL:
   ```
   https://app.gitbook.com/o/{orgId}/s/{spaceId}/
                              ^^^^^^ this
   ```

## Step 3: Initialize Repo Structure

The repo structure must match your GitBook space's group/page hierarchy:

```
getting-started/
  welcome.md
  quick-start.md
discount-list/
  how-to-set-up.md
payment-customization/
  how-to-set-up.md
  trigger-conditions.md
  hide-a-payment-method.md
```

- **Directories** → GitBook groups
- **Files** → GitBook pages
- **Filenames** → page slugs (kebab-case)

Push the initial structure:

```bash
cd /path/to/bridge-repo
# Copy your existing markdown
cp -r /path/to/docs/user-guide/* .
git add -A && git commit -m "Initial docs structure"
git push origin main
```

## Step 4: Test Git Import

```bash
curl -X POST \
  -H "Authorization: Bearer $GITBOOK_TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.gitbook.com/v1/spaces/$SPACE_ID/git/import" \
  -d "{
    \"url\": \"https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git\",
    \"ref\": \"refs/heads/main\"
  }"
```

Expected: HTTP 204 (import started).

## Step 5: Configure the Script

Edit `scripts/push-helpdesk.mjs` with your values:

```javascript
const GITHUB_REPO = 'your-org/helpdesk-content';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'ghp_xxx';
const GITBOOK_TOKEN = process.env.GITBOOK_TOKEN || 'gb_api_xxx';
const GITBOOK_SPACE_ID = 'your-space-id';
const SOURCE_DIR = resolve(import.meta.dirname, '../docs/user-guide');
```

## Step 6: Verify

```bash
node scripts/push-helpdesk.mjs --dry-run
```

Should list all markdown files that would be published.

## Checklist

- [ ] GitHub bridge repo created
- [ ] GitBook API token generated
- [ ] Space ID identified
- [ ] Repo structure matches GitBook space
- [ ] First Git Import test returns HTTP 204
- [ ] Script configured with correct values
- [ ] Dry run shows expected files
