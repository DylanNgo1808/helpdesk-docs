# Review Workflow

Review generated help articles, validate content, and manage screenshot capture.

## Step 1: Scan for Articles Needing Review

Search the docs for MDX files with screenshot placeholders:

```bash
grep -r "screenshot:" helpdesk/ --include="*.mdx" -l
```

For each file, count placeholders:

```bash
grep -c "{/\* screenshot:" <file>
```

## Step 2: Generate Screenshot Checklist

For each article with placeholders, extract and list:

```
<article_title>
  [ ] Step 1: <description> -> /images/<slug>/step-1.png
    Page: <app_page_path>
    Element: <css_selector>
  [ ] Step 2: <description> -> /images/<slug>/step-2.png
    Page: <app_page_path>
    Element: <css_selector>
```

## Step 3: Capture Screenshots (Optional)

If browser automation is available, use the ScreenCapture skill to:

1. Navigate to the app page
2. Wait for the target element to be visible
3. Capture a screenshot of the element or viewport
4. Save to the correct image path
5. Remove the `{/* screenshot: ... */}` comment from the MDX

If browser automation is NOT available, output the checklist for manual capture.

## Step 4: Content Review

For each article, verify:

- [ ] Title is clear and action-oriented
- [ ] Description is under 160 characters
- [ ] Steps are in logical order
- [ ] Callout types are appropriate (info/warning/error)
- [ ] Related articles links are valid
- [ ] No broken markdown or MDX syntax
- [ ] Images exist at referenced paths (after screenshot capture)

## Step 5: Report

```
Review Summary:
  Articles reviewed: <count>
  Screenshots captured: <captured>/<total>
  Articles ready to publish: <count>
  Articles needing attention: <count>
    - <article>: <issue>
```
