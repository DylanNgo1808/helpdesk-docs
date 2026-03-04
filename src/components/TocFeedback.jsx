'use client'

import { useState } from 'react'

export function TocFeedback() {
  const [state, setState] = useState('idle') // idle | thanks

  if (state === 'thanks') {
    return (
      <div style={{
        padding: '0.75rem 1rem',
        borderTop: 'none',
        fontSize: '0.8125rem',
        color: '#5BB8DB',
        fontWeight: 500,
        textAlign: 'left',
      }}>
        Thanks for the feedback!
      </div>
    )
  }

  return (
    <div style={{
      padding: '0.75rem 1rem',
      borderTop: 'none',
    }}>
      <p style={{
        fontSize: '0.8125rem',
        color: '#5d6167',
        margin: '0 0 0.5rem 0',
        fontWeight: 500,
      }}>
        Was this helpful?
      </p>
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {[
          { emoji: '😊', label: 'Yes' },
          { emoji: '😐', label: 'Somewhat' },
          { emoji: '😞', label: 'No' },
        ].map(({ emoji, label }) => (
          <button
            key={label}
            onClick={() => setState('thanks')}
            aria-label={label}
            style={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.125rem',
              background: 'none',
              border: '1px solid #e6edf0',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'border-color 0.15s, background 0.15s',
              filter: 'grayscale(1)',
              opacity: 0.6,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#7EC8E3'
              e.currentTarget.style.background = 'rgba(91,184,219,0.06)'
              e.currentTarget.style.filter = 'grayscale(0)'
              e.currentTarget.style.opacity = '1'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#e6edf0'
              e.currentTarget.style.background = 'none'
              e.currentTarget.style.filter = 'grayscale(1)'
              e.currentTarget.style.opacity = '0.6'
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
