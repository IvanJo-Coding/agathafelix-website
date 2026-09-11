import React from 'react';
import { Chip } from '../core/Chip.jsx';

const PC_ACCENTS = {
  orange: 'var(--af-orange)', green: 'var(--af-green)',
  purple: 'var(--af-purple)', blue: 'var(--af-blue)',
};
const PC_TINTS = {
  orange: 'var(--af-orange-tint)', green: 'var(--af-green-tint)',
  purple: 'var(--af-purple-tint)', blue: 'var(--af-blue-tint)',
};

/**
 * Product card: tinted media area (photo or icon), tag, title, description,
 * audience chip + price hint. featured = sticker outline in the accent color.
 */
export function ProductCard({
  tag,
  title,
  description,
  image,
  icon,
  chip,
  price,
  accent = 'blue',
  featured = false,
  style,
}) {
  const accentColor = PC_ACCENTS[accent] || PC_ACCENTS.blue;
  return (
    <div
      style={{
        background: 'var(--surface-card, #fff)', overflow: 'hidden',
        borderRadius: 'var(--radius-lg, 24px)', fontFamily: 'var(--font-body)',
        border: featured ? `2px solid ${accentColor}` : '1px solid var(--af-line)',
        boxShadow: featured ? 'var(--shadow-sticker)' : 'var(--shadow-soft)',
        display: 'flex', flexDirection: 'column',
        ...style,
      }}
    >
      <div
        style={{
          height: 140, background: PC_TINTS[accent] || PC_TINTS.blue,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accentColor, borderBottom: '1px solid var(--af-line)',
        }}
      >
        {image ? (
          <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ display: 'flex', width: 48, height: 48 }}>{icon}</span>
        )}
      </div>
      <div style={{ padding: '18px 20px 14px', flex: 1 }}>
        {tag ? (
          <span
            style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: featured ? accentColor : 'var(--text-muted)',
              display: 'block', marginBottom: 8,
            }}
          >
            {tag}
          </span>
        ) : null}
        <h3 style={{ fontSize: '1.25rem', marginBottom: 6 }}>{title}</h3>
        <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text-body)' }}>{description}</p>
      </div>
      {(chip || price) ? (
        <div
          style={{
            padding: '12px 20px 16px', borderTop: '1px solid var(--af-line)',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
          }}
        >
          {chip ? <Chip color={accent}>{chip}</Chip> : null}
          {price ? (
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Mulai <strong style={{ color: accentColor }}>{price}</strong>/pcs
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
