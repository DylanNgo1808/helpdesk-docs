# Verify Workflow

Check that GitBook content matches local markdown after a publish.

## Prerequisites

- `GITBOOK_TOKEN` and `GITBOOK_SPACE_ID` configured
- Content was recently published via the Publish workflow

## Step 1: Fetch Space Content

```bash
GITBOOK_TOKEN="<token>"
SPACE_ID="<space-id>"

curl -s -H "Authorization: Bearer $GITBOOK_TOKEN" \
  "https://api.gitbook.com/v1/spaces/$SPACE_ID/content/pages" | \
  python3 -c "
import json, sys
data = json.load(sys.stdin)
def show(pages, indent=0):
    for p in pages:
        kind = p.get('kind','')
        title = p.get('title','')
        path = p.get('path','')
        pid = p.get('id','')[:20]
        print(f\"{'  '*indent}{kind}: {title} [{path}]\")
        show(p.get('pages',[]), indent+1)
show(data.get('pages',[]))
"
```

## Step 2: Verify Specific Page (Optional)

If the user wants to check a specific page:

```bash
# Get page by ID
curl -s -H "Authorization: Bearer $GITBOOK_TOKEN" \
  "https://api.gitbook.com/v1/spaces/$SPACE_ID/content/page/<pageId>" | \
  python3 -c "
import json, sys
data = json.load(sys.stdin)
doc = data.get('document', {})
nodes = doc.get('nodes', [])
print(f'Title: {data.get(\"title\",\"\")}')
print(f'Nodes: {len(nodes)}')
for i, node in enumerate(nodes[:20]):
    ntype = node.get('type','')
    text_parts = []
    def extract_text(n):
        for leaf in n.get('leaves', []):
            text_parts.append(leaf.get('text',''))
        for child in n.get('nodes', []):
            extract_text(child)
    extract_text(node)
    text = ''.join(text_parts)
    print(f'  [{i}] {ntype}: {text[:100]}')
"
```

## Step 3: Check Embeds

Verify all image embeds are present:

```bash
curl -s -H "Authorization: Bearer $GITBOOK_TOKEN" \
  "https://api.gitbook.com/v1/spaces/$SPACE_ID/content/page/<pageId>" | \
  python3 -c "
import json, sys
data = json.load(sys.stdin)
nodes = data.get('document', {}).get('nodes', [])
embeds = [n for n in nodes if n.get('type') == 'embed']
print(f'Embeds found: {len(embeds)}')
for i, e in enumerate(embeds):
    url = e.get('data', {}).get('url', '')
    print(f'  [{i+1}] {url}')
"
```

## Step 4: Report

```
GitBook Space Status:
  Space: {title}
  Total groups: {count}
  Total pages: {count}

  Page: {page_title}
    Nodes: {count}
    Embeds: {count}
    Status: OK / MISMATCH
```
