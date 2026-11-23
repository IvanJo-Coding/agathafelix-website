import React from 'react';
import { Badge } from '../core/Badge.jsx';

/**
 * Centered (or left-aligned) section intro: eyebrow Badge + display
 * heading (one optional colored word) + short description.
 */
export function SectionHeader({
  eyebrow,
  eyebrowColor = 'orange',
  title,
  highlight,
  highlightColor = 'orange',
  description,
  align = 'center',
  style,
}) {
  // Heading text is large, so 3:1 is enough; bright green on paper is 2.93:1.
  const colors = {
    orange: 'var(--af-orange)', green: 'var(--af-green-deep)',
    yellow: 'var(--af-yellow-deep)', purple: 'var(--af-purple)', blue: 'var(--af-blue-deep)',
  };
  const parts = highlight && title.includes(highlight) ? title.split(highlight) : null;
  return (
    <div
      style={{
        textAlign: align, maxWidth: 640,
        margin: align === 'center' ? '0 auto var(--space-7, 48px)' : '0 0 var(--space-7, 48px)',
        display: 'flex', flexDirection: 'column', gap: 'var(--space-3, 12px)',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        ...style,
      }}
    >
      {eyebrow ? <Badge color={eyebrowColor}>{eyebrow}</Badge> : null}
      <h2 style={{ fontSize: 'var(--text-xl, 1.95rem)' }}>
        {parts ? (
          <>
            {parts[0]}
            <span style={{ color: colors[highlightColor] || colors.orange }}>{highlight}</span>
            {parts[1]}
          </>
        ) : title}
      </h2>
      {description ? (
        <p style={{ margin: 0, fontSize: 'var(--text-sm, 0.84rem)', color: 'var(--text-body)' }}>{description}</p>
      ) : null}
    </div>
  );
}
