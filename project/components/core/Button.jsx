import React from 'react';

const BTN_COLORS = {
  orange: ['var(--af-orange)', 'var(--af-orange-deep)'],
  wa:     ['var(--af-wa)',     'var(--af-wa-deep)'],
  green:  ['var(--af-green)',  'var(--af-green-deep)'],
  purple: ['var(--af-purple)', 'var(--af-purple-deep)'],
  blue:   ['var(--af-blue)',   'var(--af-blue-deep)'],
};

const BTN_SIZES = {
  sm: { padding: '8px 18px',  fontSize: '0.82rem' },
  md: { padding: '12px 24px', fontSize: '0.9rem'  },
  lg: { padding: '15px 32px', fontSize: '1rem'    },
};

let btnCssInjected = false;
function injectBtnCss() {
  if (btnCssInjected || typeof document === 'undefined') return;
  btnCssInjected = true;
  const css = `
    .af-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px;
      font-family:var(--font-body); font-weight:700; border-radius:var(--radius-pill,999px);
      cursor:pointer; border:none; white-space:nowrap; text-decoration:none;
      transition:transform var(--duration-fast,140ms) var(--ease-smooth,ease),
                 box-shadow var(--duration-fast,140ms) var(--ease-smooth,ease),
                 background var(--duration-fast,140ms) ease; }
    .af-btn-solid { background:var(--btn); color:#fff; box-shadow:0 4px 0 var(--btn-deep); }
    .af-btn-solid:hover { transform:translateY(-1px); box-shadow:0 5px 0 var(--btn-deep); filter:brightness(1.04); }
    .af-btn-solid:active { transform:translateY(3px); box-shadow:0 1px 0 var(--btn-deep); filter:none; }
    .af-btn-ghost { background:transparent; color:var(--af-ink); border:2px solid var(--af-ink); box-shadow:none; }
    .af-btn-ghost:hover { background:var(--surface-card,#fff); transform:translateY(-1px); box-shadow:var(--shadow-sticker); }
    .af-btn-ghost:active { transform:translateY(2px); box-shadow:none; }
    .af-btn[disabled] { opacity:.45; pointer-events:none; }
    .af-btn svg { width:1.2em; height:1.2em; flex-shrink:0; }
  `;
  const tag = document.createElement('style');
  tag.dataset.afComponent = 'button';
  tag.textContent = css;
  document.head.appendChild(tag);
}

/**
 * Pill button with the Agatha Felix "candy edge" (flat offset shadow that
 * collapses when pressed). variant="solid" + color, or variant="ghost".
 */
export function Button({
  variant = 'solid',
  color = 'orange',
  size = 'md',
  href,
  children,
  disabled,
  style,
  ...rest
}) {
  injectBtnCss();
  const [bg, deep] = BTN_COLORS[color] || BTN_COLORS.orange;
  const sz = BTN_SIZES[size] || BTN_SIZES.md;
  const cls = `af-btn ${variant === 'ghost' ? 'af-btn-ghost' : 'af-btn-solid'}`;
  const mergedStyle = { '--btn': bg, '--btn-deep': deep, ...sz, ...style };
  const Tag = href ? 'a' : 'button';
  return (
    <Tag className={cls} href={href} disabled={disabled} style={mergedStyle} {...rest}>
      {children}
    </Tag>
  );
}
