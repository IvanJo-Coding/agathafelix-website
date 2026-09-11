import React from 'react';

const BADGE_COLORS = {
  orange: ['var(--af-orange-soft)', 'var(--af-orange-deep)'],
  green:  ['var(--af-green-soft)',  'var(--af-green-deep)'],
  yellow: ['var(--af-yellow-soft)', 'var(--af-yellow-deep)'],
  purple: ['var(--af-purple-soft)', 'var(--af-purple-deep)'],
  blue:   ['var(--af-blue-soft)',   'var(--af-blue-deep)'],
  ink:    ['var(--af-paper-2)',     'var(--af-ink-2)'],
};

/**
 * Uppercase eyebrow label pill — sits above section headings.
 */
export function Badge({ color = 'orange', dot = false, children, style, ...rest }) {
  const [bg, fg] = BADGE_COLORS[color] || BADGE_COLORS.orange;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        background: bg, color: fg,
        fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs, 0.75rem)',
        fontWeight: 700, letterSpacing: 'var(--tracking-caps, 0.08em)',
        textTransform: 'uppercase', padding: '6px 14px',
        borderRadius: 'var(--radius-pill, 999px)',
        ...style,
      }}
      {...rest}
    >
      {dot ? (
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }}></span>
      ) : null}
      {children}
    </span>
  );
}
