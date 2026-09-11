import React from 'react';

const CHIP_COLORS = {
  orange: ['var(--af-orange-tint)', 'var(--af-orange-deep)', 'var(--af-orange-soft)'],
  green:  ['var(--af-green-tint)',  'var(--af-green-deep)',  'var(--af-green-soft)'],
  yellow: ['var(--af-yellow-tint)', 'var(--af-yellow-deep)', 'var(--af-yellow-soft)'],
  purple: ['var(--af-purple-tint)', 'var(--af-purple-deep)', 'var(--af-purple-soft)'],
  blue:   ['var(--af-blue-tint)',   'var(--af-blue-deep)',   'var(--af-blue-soft)'],
};

/**
 * Small metadata tag pill, e.g. "Kantor · Sekolah" on product cards.
 */
export function Chip({ color = 'blue', children, style, ...rest }) {
  const [bg, fg, border] = CHIP_COLORS[color] || CHIP_COLORS.blue;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center',
        background: bg, color: fg, border: `1.5px solid ${border}`,
        fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600,
        padding: '3px 12px', borderRadius: 'var(--radius-pill, 999px)',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
