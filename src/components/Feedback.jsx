'use client'

import { useState } from 'react'

export function Feedback() {
  const [state, setState] = useState('idle') // idle | thanks

  if (state === 'thanks') {
    return (
      <div style={{
        marginTop: '2rem',
        padding: '1rem 1.5rem',
        borderTop: '1px solid #e6edf0',
        textAlign: 'center',
        color: '#5BB8DB',
        fontSize: '0.875rem',
        fontWeight: 500,
      }}>
        Thank you for your feedback!
      </div>
    )
  }

  return (
    <div style={{
      marginTop: '2rem',
      padding: '1rem 1.5rem',
      borderTop: '1px solid #e6edf0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      fontSize: '0.875rem',
      color: '#5d6167',
    }}>
      <span>Was this article helpful?</span>
      <button
        onClick={() => setState('thanks')}
        aria-label="Yes, this was helpful"
        style={{
          background: 'none',
          border: '1px solid #e6edf0',
          borderRadius: '6px',
          padding: '0.375rem 0.75rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
          color: '#5d6167',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
        Yes
      </button>
      <button
        onClick={() => setState('thanks')}
        aria-label="No, this was not helpful"
        style={{
          background: 'none',
          border: '1px solid #e6edf0',
          borderRadius: '6px',
          padding: '0.375rem 0.75rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
          color: '#5d6167',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 15V19a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
        </svg>
        No
      </button>
    </div>
  )
}
