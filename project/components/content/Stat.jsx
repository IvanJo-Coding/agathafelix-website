import React from 'react';

const STAT_COLORS = {
  orange: 'var(--af-orange)', green: 'var(--af-green)',
  yellow: 'var(--af-yellow-deep)', purple: 'var(--af-purple)', blue: 'var(--af-blue)',
  ink: 'var(--af-ink)',
};

/**
 * Big playful number + small label, e.g. "500+ / Institusi Dilayani".
 */
export function Stat({ value, label, color = 'orange', style }) {
  return (
    <div
      style={{
        background: 'var(--surface-card, #fff)', border: '1px solid var(--af-line)',
        borderRadius: 'var(--radius-md, 16px)', padding: '14px 18px',
        boxShadow: 'var(--shadow-soft)', display: 'flex', flexDirection: 'column', gap: 4,
        ...style,
      }}
    >
      <strong
        style={{
          fontFamily: 'var(--font-display)', fontSize: '1.9rem', lineHeight: 1,
          fontWeight: 800, color: STAT_COLORS[color] || STAT_COLORS.orange,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </strong>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        {label}
      </span>
    </div>
  );
}
