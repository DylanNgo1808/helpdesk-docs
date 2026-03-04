'use client'

const categories = [
  {
    heading: 'Get Started',
    cards: [
      {
        title: 'Getting Started',
        description: 'Install the app, configure your store, and generate your first PDF invoice.',
        href: '/docs/getting-started',
        bg: `radial-gradient(ellipse at 20% 50%, #7EC8E3 0%, transparent 60%),radial-gradient(ellipse at 80% 20%, #C084FC 0%, transparent 50%),radial-gradient(ellipse at 60% 80%, #3B82F6 0%, transparent 50%),linear-gradient(135deg, #1e3a5f 0%, #2d1b69 100%)`,
      },
      {
        title: 'Settings',
        description: 'Configure store details, numbering, tax settings, and global preferences.',
        href: '/docs/settings',
        bg: `radial-gradient(ellipse at 10% 80%, #06B6D4 0%, transparent 55%),radial-gradient(ellipse at 90% 30%, #A855F7 0%, transparent 50%),radial-gradient(ellipse at 50% 10%, #7EC8E3 0%, transparent 45%),linear-gradient(160deg, #1a1040 0%, #0f2847 100%)`,
      },
      {
        title: 'Templates',
        description: 'Browse, create, and customize invoice templates, layouts, and themes.',
        href: '/docs/templates',
        bg: `radial-gradient(ellipse at 30% 20%, #B1E346 0%, transparent 50%),radial-gradient(ellipse at 80% 70%, #5BB8DB 0%, transparent 55%),radial-gradient(ellipse at 10% 90%, #7C3AED 0%, transparent 45%),linear-gradient(140deg, #0f2027 0%, #1a1040 100%)`,
      },
    ]
  },
  {
    heading: 'Orders & Documents',
    cards: [
      {
        title: 'Orders',
        description: 'View, search, filter, print, download, and manage invoices for orders.',
        href: '/docs/orders',
        bg: `radial-gradient(ellipse at 70% 20%, #22D3EE 0%, transparent 50%),radial-gradient(ellipse at 20% 70%, #8B5CF6 0%, transparent 55%),radial-gradient(ellipse at 90% 80%, #EC4899 0%, transparent 45%),linear-gradient(135deg, #0c1445 0%, #1e1b4b 100%)`,
      },
      {
        title: 'Draft Orders',
        description: 'Generate PDF invoices for draft orders, print, download, and manage.',
        href: '/docs/draft-orders',
        bg: `radial-gradient(ellipse at 80% 30%, #7EC8E3 0%, transparent 55%),radial-gradient(ellipse at 20% 80%, #D946EF 0%, transparent 50%),radial-gradient(ellipse at 50% 50%, #6366F1 0%, transparent 45%),linear-gradient(150deg, #1a0533 0%, #0f2847 100%)`,
      },
    ]
  },
  {
    heading: 'Automation & Delivery',
    cards: [
      {
        title: 'Email Automation',
        description: 'Set up automated email delivery of invoices with triggers and scheduling.',
        href: '/docs/email-automation',
        bg: `radial-gradient(ellipse at 15% 30%, #38BDF8 0%, transparent 55%),radial-gradient(ellipse at 85% 60%, #C084FC 0%, transparent 50%),radial-gradient(ellipse at 50% 90%, #2563EB 0%, transparent 45%),linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)`,
      },
      {
        title: 'Delivery Methods',
        description: 'Configure FTP, SFTP, and Google Drive integrations for invoice delivery.',
        href: '/docs/delivery-methods',
        bg: `radial-gradient(ellipse at 25% 20%, #34D399 0%, transparent 50%),radial-gradient(ellipse at 75% 75%, #7EC8E3 0%, transparent 55%),radial-gradient(ellipse at 90% 10%, #A78BFA 0%, transparent 45%),linear-gradient(130deg, #064e3b 0%, #0f2847 100%)`,
      },
    ]
  },
  {
    heading: 'B2B & Billing',
    cards: [
      {
        title: 'B2B Features',
        description: 'Manage company-specific settings, tax exemptions, and B2B templates.',
        href: '/docs/b2b',
        bg: `radial-gradient(ellipse at 60% 10%, #818CF8 0%, transparent 50%),radial-gradient(ellipse at 10% 60%, #06B6D4 0%, transparent 55%),radial-gradient(ellipse at 80% 90%, #E879F9 0%, transparent 45%),linear-gradient(155deg, #1e1b4b 0%, #0c1445 100%)`,
      },
      {
        title: 'Subscription',
        description: 'View and manage your plan, compare features, upgrade or downgrade.',
        href: '/docs/subscription',
        bg: `radial-gradient(ellipse at 75% 25%, #F472B6 0%, transparent 50%),radial-gradient(ellipse at 15% 60%, #7EC8E3 0%, transparent 55%),radial-gradient(ellipse at 60% 85%, #8B5CF6 0%, transparent 45%),linear-gradient(125deg, #1a1040 0%, #2d0a3e 100%)`,
      },
    ]
  },
  {
    heading: 'Integrations & Support',
    cards: [
      {
        title: 'Shopify Extensions',
        description: 'Use invoice actions directly from Shopify Admin and POS.',
        href: '/docs/shopify-extensions',
        bg: `radial-gradient(ellipse at 20% 25%, #22D3EE 0%, transparent 55%),radial-gradient(ellipse at 70% 70%, #A855F7 0%, transparent 50%),radial-gradient(ellipse at 90% 15%, #6366F1 0%, transparent 45%),linear-gradient(135deg, #0f2847 0%, #1e1b4b 100%)`,
      },
      {
        title: 'Troubleshooting',
        description: 'Resolve common issues with generation, email, templates, and connections.',
        href: '/docs/troubleshooting',
        bg: `radial-gradient(ellipse at 30% 80%, #5BB8DB 0%, transparent 55%),radial-gradient(ellipse at 80% 20%, #D946EF 0%, transparent 50%),radial-gradient(ellipse at 10% 10%, #7C3AED 0%, transparent 50%),linear-gradient(150deg, #0f172a 0%, #2d0a3e 100%)`,
      },
    ]
  }
]

export default function CardGrid() {
  return (
    <div>
      {categories.map((category) => (
        <div key={category.heading} style={{ marginTop: '2.5rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--card-title)',
            fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
            margin: '0 0 1rem',
          }}>
            {category.heading}
          </h2>
          <div className="card-grid-3col" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem',
          }}>
            {category.cards.map((section) => (
              <a
                key={section.title}
                href={section.href}
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
                  background: section.bg,
                  height: '120px',
                }} />
                <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
                  <h3 style={{
                    margin: '0 0 0.375rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--card-title)',
                    fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif"
                  }}>
                    {section.title}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    color: 'var(--card-desc)'
                  }}>
                    {section.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
