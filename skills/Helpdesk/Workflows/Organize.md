# Organize Workflow

Organize the help center structure: update navigation, reorder articles, manage categories.

## Step 1: Scan Current Structure

Read all MDX files and navigation metadata to build a map:

```
Category -> Articles (with metadata)
```

## Step 2: Identify Issues

Check for:
- Articles not in navigation (orphaned)
- Navigation entries without matching files (broken links)
- Categories with too many articles (>15 = should split)
- Missing index pages for categories
- Inconsistent frontmatter (missing descriptions, etc.)

## Step 3: Propose Changes

Present a reorganization plan:

```
Help Center Structure:
  getting-started/ (3 articles)
    - installation
    - setup-wizard
    - first-use
  templates/ (5 articles)
    - creating-templates
    - editing-templates
    - template-variables
    - css-customization
    - preview-testing
  ...

Proposed changes:
  - Move <article> from <old_category> to <new_category>
  - Create index page for <category>
  - Add <orphaned_article> to navigation
```

## Step 4: Apply Changes (After Approval)

1. Move files to correct directories
2. Update navigation metadata with new structure
3. Update internal links in affected articles
4. Create missing index pages

## Step 5: Verify

Read navigation config and confirm all entries have matching files.
