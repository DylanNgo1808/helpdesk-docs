'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

const ICONS = {
  copy: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  markdown: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  chatgpt: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  ),
  claude: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  link: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  external: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2 }}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  chevron: (open) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
}

const menuItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.625rem',
  padding: '0.5rem 0.75rem',
  width: '100%',
  background: 'none',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  textAlign: 'left',
  color: 'inherit',
  textDecoration: 'none',
  fontSize: '0.8125rem',
  lineHeight: 1.3,
  transition: 'background 0.15s',
}

const separatorStyle = {
  height: 1,
  background: '#e6edf0',
  margin: '0.25rem 0.5rem',
}

function MenuItem({ icon, label, description, external, onClick, href }) {
  const content = (
    <>
      <span style={{ flexShrink: 0, marginTop: 1, color: '#5d6167' }}>{icon}</span>
      <span>
        <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 2 }}>
          {label}
          {external && ICONS.external}
        </span>
        {description && (
          <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginTop: 1 }}>
            {description}
          </span>
        )}
      </span>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={menuItemStyle}
        onMouseEnter={e => e.currentTarget.style.background = '#f5f8fa'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      onClick={onClick}
      style={menuItemStyle}
      onMouseEnter={e => e.currentTarget.style.background = '#f5f8fa'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      {content}
    </button>
  )
}

function getPageMarkdown() {
  const article = document.querySelector('article')
  if (!article) return ''

  const title = article.querySelector('h1')?.innerText || document.title
  const lines = [`# ${title}\n`]

  const nodes = article.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, pre, blockquote, table')
  nodes.forEach(node => {
    const tag = node.tagName.toLowerCase()
    const text = node.innerText.trim()
    if (!text) return

    if (tag === 'h1') return // already added
    if (tag === 'h2') lines.push(`\n## ${text}\n`)
    else if (tag === 'h3') lines.push(`\n### ${text}\n`)
    else if (tag === 'h4') lines.push(`\n#### ${text}\n`)
    else if (tag === 'h5') lines.push(`\n##### ${text}\n`)
    else if (tag === 'h6') lines.push(`\n###### ${text}\n`)
    else if (tag === 'li') lines.push(`- ${text}`)
    else if (tag === 'pre') lines.push(`\n\`\`\`\n${text}\n\`\`\`\n`)
    else if (tag === 'blockquote') lines.push(`\n> ${text}\n`)
    else if (tag === 'table') lines.push(`\n${text}\n`)
    else lines.push(`\n${text}\n`)
  })

  return lines.join('\n')
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.cssText = 'position:fixed;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    return true
  }
}

export function CopyButton() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(null) // null | 'page' | 'mcp'
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCopyPage = useCallback(async () => {
    const md = getPageMarkdown()
    await copyToClipboard(md)
    setCopied('page')
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const handleCopyMCP = useCallback(async () => {
    const url = window.location.origin + '/api/mcp'
    await copyToClipboard(url)
    setCopied('mcp')
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const pageUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''
  const pageTitle = typeof document !== 'undefined' ? encodeURIComponent(document.title) : ''

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-label="Copy options"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          background: 'none',
          border: '1px solid #e6edf0',
          borderRadius: '6px',
          padding: '0.375rem 0.625rem',
          cursor: 'pointer',
          fontSize: '0.8rem',
          color: '#5d6167',
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#7EC8E3'
          e.currentTarget.style.color = '#5BB8DB'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#e6edf0'
          e.currentTarget.style.color = '#5d6167'
        }}
      >
        {ICONS.copy}
        Copy
        {ICONS.chevron(open)}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          right: 0,
          width: 260,
          background: '#fff',
          border: '1px solid #e6edf0',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          padding: '0.375rem',
          zIndex: 50,
          color: '#18181b',
        }}>
          <MenuItem
            icon={copied === 'page' ? ICONS.check : ICONS.copy}
            label={copied === 'page' ? 'Copied!' : 'Copy page'}
            description="Copy page as Markdown for LLMs"
            onClick={handleCopyPage}
          />
          <MenuItem
            icon={ICONS.markdown}
            label="View as Markdown"
            description="View this page as plain text"
            external
            href={`data:text/plain;charset=utf-8,${typeof window !== 'undefined' ? encodeURIComponent(getPageMarkdown()) : ''}`}
          />

          <div style={separatorStyle} />

          <MenuItem
            icon={ICONS.chatgpt}
            label="Open in ChatGPT"
            description="Ask ChatGPT about this page"
            external
            href={`https://chat.openai.com/?q=Summarize+this+page:+${pageUrl}`}
          />
          <MenuItem
            icon={ICONS.claude}
            label="Open in Claude"
            description="Ask Claude about this page"
            external
            href={`https://claude.ai/new?q=Summarize+this+page:+${pageUrl}`}
          />

          <div style={separatorStyle} />

          <MenuItem
            icon={ICONS.link}
            label={copied === 'mcp' ? 'Copied!' : 'Connect with MCP'}
            description="Copy the MCP Server URL"
            onClick={handleCopyMCP}
          />
          <MenuItem
            icon={ICONS.external}
            label="Connect to VSCode"
            description="Install MCP Server on VSCode"
            external
            href={`vscode:extension/anthropic.claude-code`}
          />
        </div>
      )}
    </div>
  )
}
