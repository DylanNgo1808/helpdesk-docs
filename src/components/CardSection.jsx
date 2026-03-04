'use client'

const cards = [
  {
    title: 'Getting Started',
    description: 'Install the app, configure your store, and generate your first PDF invoice.',
    href: '/docs/getting-started',
  },
  {
    title: 'Settings',
    description: 'Configure store details, numbering, tax settings, and global preferences.',
    href: '/docs/settings',
  },
  {
    title: 'Templates',
    description: 'Browse, create, and customize invoice templates, layouts, and themes.',
    href: '/docs/templates',
  },
  {
    title: 'Orders',
    description: 'View, search, filter, print, download, and manage invoices for orders.',
    href: '/docs/orders',
  },
  {
    title: 'Draft Orders',
    description: 'Generate PDF invoices for draft orders, print, download, and manage.',
    href: '/docs/draft-orders',
  },
  {
    title: 'Email Automation',
    description: 'Set up automated email delivery of invoices with triggers and scheduling.',
    href: '/docs/email-automation',
  },
  {
    title: 'Delivery Methods',
    description: 'Configure FTP, SFTP, and Google Drive integrations for invoice delivery.',
    href: '/docs/delivery-methods',
  },
  {
    title: 'B2B Features',
    description: 'Manage company-specific settings, tax exemptions, and B2B templates.',
    href: '/docs/b2b',
  },
  {
    title: 'Subscription',
    description: 'View and manage your plan, compare features, upgrade or downgrade.',
    href: '/docs/subscription',
  },
  {
    title: 'Shopify Extensions',
    description: 'Use invoice actions directly from Shopify Admin and POS.',
    href: '/docs/shopify-extensions',
  },
  {
    title: 'Troubleshooting',
    description: 'Resolve common issues with generation, email, templates, and connections.',
    href: '/docs/troubleshooting',
  }
]

export default function CardSection() {
  return (
    <div className="card-grid-3col" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.25rem',
      marginTop: '1.5rem',
    }}>
      {cards.map((card) => (
        <a
          key={card.title}
          href={card.href}
          style={{
            display: 'block',
            borderRadius: '12px',
            border: '1px solid var(--card-border)',
            backgroundColor: 'var(--card-bg)',
            textDecoration: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
            overflow: 'hidden',
          }}
          className="doc-card"
        >
          <div style={{
            background: '#7EC8E3',
            height: '120px',
          }} />
          <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
            <h3 style={{
              margin: '0 0 0.375rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--card-title)',
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif"
            }}>
              {card.title}
            </h3>
            <p style={{
              margin: 0,
              fontSize: '0.85rem',
              lineHeight: 1.5,
              color: 'var(--card-desc)'
            }}>
              {card.description}
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}
