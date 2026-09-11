import React from 'react';

const ACCENTS = {
  orange: 'var(--af-orange)',
  green:  'var(--af-green)',
  yellow: 'var(--af-yellow-deep)',
  purple: 'var(--af-purple)',
  blue:   'var(--af-blue)',
  ink:    'var(--af-ink)',
};

let cardCssInjected = false;
function injectCardCss() {
  if (cardCssInjected || typeof document === 'undefined') return;
  cardCssInjected = true;
  const tag = document.createElement('style');
  tag.dataset.afComponent = 'card';
  tag.textContent = `
    .af-card { background:var(--surface-card,#fff); border-radius:var(--radius-md,16px);
      transition:transform var(--duration-base,220ms) var(--ease-pop,ease),
                 box-shadow var(--duration-base,220ms) ease, border-color var(--duration-base,220ms) ease; }
    .af-card-soft { border:1px solid var(--af-line); box-shadow:var(--shadow-soft); }
    .af-card-sticker { border:2px solid var(--card-accent, var(--af-ink)); box-shadow:var(--shadow-sticker); }
    .af-card-hover:hover { transform:translateY(-3px); box-shadow:var(--shadow-pop); }
    .af-card-sticker.af-card-hover:hover { box-shadow:var(--shadow-sticker-lg); }
  `;
  document.head.appendChild(tag);
}

/**
 * Surface card. variant="soft" (hairline + soft shadow) or
 * variant="sticker" (2px outline + flat die-cut shadow).
 */
export function Card({
  variant = 'soft',
  accent = 'ink',
  hover = false,
  padding = 'var(--space-5, 24px)',
  children,
  style,
  ...rest
}) {
  injectCardCss();
  const cls = [
    'af-card',
    variant === 'sticker' ? 'af-card-sticker' : 'af-card-soft',
    hover ? 'af-card-hover' : '',
  ].join(' ');
  return (
    <div
      className={cls}
      style={{ '--card-accent': ACCENTS[accent] || ACCENTS.ink, padding, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
