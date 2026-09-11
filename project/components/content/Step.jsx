import React from 'react';

const STEP_COLORS = {
  orange: ['var(--af-orange)', 'var(--af-orange-deep)'],
  green:  ['var(--af-green)',  'var(--af-green-deep)'],
  purple: ['var(--af-purple)', 'var(--af-purple-deep)'],
  blue:   ['var(--af-blue)',   'var(--af-blue-deep)'],
};

/**
 * Numbered process step — candy circle number + title + description.
 */
export function Step({ num, title, children, color = 'orange', style }) {
  const [bg, deep] = STEP_COLORS[color] || STEP_COLORS.orange;
  return (
    <div style={{ textAlign: 'center', padding: '0 8px', fontFamily: 'var(--font-body)', ...style }}>
      <div
        style={{
          width: 64, height: 64, borderRadius: '50%', background: bg, color: '#fff',
          fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 18px', boxShadow: `0 4px 0 ${deep}`,
        }}
      >
        {num}
      </div>
      <h3 style={{ fontSize: 'var(--text-lg, 1.45rem)', marginBottom: 8 }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 'var(--text-sm, 0.84rem)', color: 'var(--text-body)' }}>{children}</p>
    </div>
  );
}
