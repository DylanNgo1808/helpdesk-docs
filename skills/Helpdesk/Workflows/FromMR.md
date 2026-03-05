# FromMR Workflow

Generate help documentation from a pull request or merge request.

## Step 1: Parse the PR/MR

Extract:

| Field | Source | Example |
|-------|--------|---------|
| **URL** | User message | `https://github.com/org/repo/pull/123` |
| **Project** | URL path | `repo-name` |
| **ID** | URL path | `123` |

## Step 2: Read the Diff

Fetch the PR/MR details:

```bash
# GitHub
gh pr diff <ID>

# Or via git
git fetch origin pull/<ID>/head:pr-<ID>
git diff main...pr-<ID>
```

## Step 3: Analyze Changes

From the diff, determine:

1. **What changed?** — New features, bug fixes, UI changes, settings
2. **User-facing?** — Does this affect the end-user experience?
3. **Article type needed:**
   - New feature -> Guide article
   - New settings/options -> Reference article
   - Bug fix with workaround -> Troubleshooting article
   - Internal refactor -> No article needed

4. **Scope:** Single article or multiple articles needed?

## Step 4: Generate Article(s)

For each user-facing change, invoke the Generate workflow (Step 2 onward) with the feature details extracted from the PR/MR.

Pass context:
- Changed files -> helps locate the feature code
- PR description -> may contain user-facing summary
- Labels/tags -> help categorize the article

## Step 5: Report

```
PR #<ID>: <TITLE>
Articles generated: <count>
  1. <article_1_title> (<type>) -> <path>
  2. <article_2_title> (<type>) -> <path>
Total screenshots needed: <count>
Next: Run /fill-screenshots to capture screenshots
```
