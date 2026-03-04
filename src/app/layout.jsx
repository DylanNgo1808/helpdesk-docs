import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { TocFeedback } from '../components/TocFeedback'
import 'nextra-theme-docs/style.css'
import './globals.css'

export const metadata = {
  metadataBase: new URL('https://invoice.avada.io'),
  title: {
    template: '%s - Avada PDF Invoice Help Center',
    default: 'Avada PDF Invoice Help Center'
  },
  description:
    'Get help with Avada PDF Invoice for Shopify. Browse guides on settings, templates, orders, email automation, and more.',
  openGraph: {
    title: 'Avada PDF Invoice Help Center',
    description:
      'Get help with Avada PDF Invoice for Shopify. Browse guides on settings, templates, orders, email automation, and more.',
    url: 'https://invoice.avada.io/help/en',
    siteName: 'Avada PDF Invoice Help Center',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Avada PDF Invoice Help Center'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Avada PDF Invoice Help Center',
    description:
      'Get help with Avada PDF Invoice for Shopify. Browse guides on settings, templates, orders, email automation, and more.',
    images: ['/images/og-image.jpg']
  }
}

export default async function RootLayout({ children }) {
  const navbar = (
    <Navbar
      logo={
        <img
          src="/help/en/images/pdf-invoice-logo.avif"
          alt="Avada PDF Invoice"
          height={40}
          style={{ height: 40, width: 'auto' }}
        />
      }
      logoLink="/"
      projectLink="https://apps.shopify.com/avada-pdf-invoice"
      projectIcon={
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      }
    >
      <a
        href="https://invoice.avada.io"
        target="_blank"
        rel="noopener noreferrer"
        style={{ padding: '0 8px', color: 'currentColor', textDecoration: 'none', fontSize: 14 }}
      >
        Website
      </a>
      <a
        href="mailto:support@avada.io"
        style={{ padding: '0 8px', color: 'currentColor', textDecoration: 'none', fontSize: 14 }}
      >
        Contact
      </a>
    </Navbar>
  )
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/help/en/favicon.jpg" type="image/jpeg" />
      </Head>
      <body>
        <Layout
          banner={
            <Banner storageKey="new-templates-2026" dismissible>
              <a
                href="/docs/templates"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                New! Check out our latest template designs →
              </a>
            </Banner>
          }
          navbar={navbar}
          footer={
            <Footer>
              <div style={{ width: '100%' }}>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '0.875rem',
                  color: '#5d6167'
                }}>
                  <p style={{ margin: 0 }}>
                    &copy; 2026 Avada PDF Invoice. All rights reserved.
                  </p>
                  <nav style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.5rem'
                  }}>
                    <a href="https://invoice.avada.io" target="_blank" rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none' }}>
                      Website
                    </a>
                    <a href="https://invoice.avada.io/privacy-policy" target="_blank" rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none' }}>
                      Privacy Policy
                    </a>
                    <a href="https://invoice.avada.io/terms-of-service" target="_blank" rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none' }}>
                      Terms of Service
                    </a>
                    <a href="https://invoice.avada.io/contact" target="_blank" rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none' }}>
                      Contact Support
                    </a>
                  </nav>
                </div>
              </div>
            </Footer>
          }
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          editLink={null}
          feedback={{ content: null }}
          toc={{ extraContent: <TocFeedback /> }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
