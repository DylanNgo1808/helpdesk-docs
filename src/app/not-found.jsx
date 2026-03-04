export default function NotFound() {
  return (
    <>
      <style>{`
        .not-found-link:hover {
          background-color: #5BB8DB !important;
        }
      `}</style>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          padding: '2rem'
        }}
      >
        <h1
          style={{
            fontSize: '6rem',
            fontWeight: 800,
            margin: 0,
            lineHeight: 1,
            color: '#7EC8E3',
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif"
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            margin: '1rem 0 0.5rem',
            color: '#18181b',
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif"
          }}
        >
          Page Not Found
        </h2>
        <p
          style={{
            fontSize: '1rem',
            color: '#5d6167',
            maxWidth: '28rem',
            margin: '0 0 2rem'
          }}
        >
          The page you are looking for does not exist or may have been moved.
          Try browsing the help center from the home page.
        </p>
        <a
          href="/docs"
          className="not-found-link"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#7EC8E3',
            color: '#131410',
            borderRadius: '0.5rem',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'background-color 0.2s'
          }}
        >
          Back to Help Center
        </a>
      </div>
    </>
  )
}
