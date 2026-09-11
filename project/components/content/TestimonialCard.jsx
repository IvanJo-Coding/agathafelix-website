import React from 'react';

const AVATAR_COLORS = ['var(--af-orange)', 'var(--af-green)', 'var(--af-purple)', 'var(--af-blue)'];

/**
 * Customer quote card: ★ stars, italic quote, initials avatar + name/role.
 */
export function TestimonialCard({ quote, name, role, avatarColor = 0, style }) {
  const initials = name
    .split(' ')
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <div
      style={{
        background: 'var(--surface-card, #fff)', border: '1px solid var(--af-line)',
        borderRadius: 'var(--radius-lg, 24px)', padding: 'var(--space-5, 24px)',
        boxShadow: 'var(--shadow-soft)', fontFamily: 'var(--font-body)',
        display: 'flex', flexDirection: 'column', gap: 14,
        ...style,
      }}
    >
      <div style={{ color: 'var(--af-yellow-deep)', fontSize: '0.95rem', letterSpacing: 3 }}>★★★★★</div>
      <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.75, fontStyle: 'italic', color: 'var(--text-body)' }}>
        “{quote}”
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--af-line)', paddingTop: 14 }}>
        <div
          style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: AVATAR_COLORS[avatarColor % AVATAR_COLORS.length], color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.8rem',
          }}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-heading)' }}>{name}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{role}</div>
        </div>
      </div>
    </div>
  );
}
