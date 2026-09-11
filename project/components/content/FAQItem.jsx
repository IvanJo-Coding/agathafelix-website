import React from 'react';

let faqCssInjected = false;
function injectFaqCss() {
  if (faqCssInjected || typeof document === 'undefined') return;
  faqCssInjected = true;
  const tag = document.createElement('style');
  tag.dataset.afComponent = 'faqitem';
  tag.textContent = `
    .af-faq { background:var(--surface-card,#fff); border:1px solid var(--af-line);
      border-radius:var(--radius-md,16px); overflow:hidden; transition:border-color 200ms ease, box-shadow 200ms ease;
      font-family:var(--font-body); }
    .af-faq[open] { border:2px solid var(--af-blue); box-shadow:var(--shadow-sticker); }
    .af-faq summary { display:flex; justify-content:space-between; align-items:center; gap:12px;
      padding:17px 20px; cursor:pointer; font-weight:700; font-size:0.92rem; color:var(--text-heading); list-style:none; }
    .af-faq summary::-webkit-details-marker { display:none; }
    .af-faq-icon { flex-shrink:0; width:26px; height:26px; border-radius:50%; background:var(--af-blue-soft);
      color:var(--af-blue-deep); display:flex; align-items:center; justify-content:center;
      font-weight:800; transition:transform 250ms var(--ease-pop,ease); }
    .af-faq[open] .af-faq-icon { transform:rotate(45deg); background:var(--af-blue); color:#fff; }
    .af-faq-body { padding:0 20px 18px; font-size:0.86rem; line-height:1.75; color:var(--text-body); }
  `;
  document.head.appendChild(tag);
}

/**
 * FAQ accordion row (native <details>) — blue sticker outline when open.
 */
export function FAQItem({ question, children, defaultOpen = false, style }) {
  injectFaqCss();
  return (
    <details className="af-faq" open={defaultOpen} style={style}>
      <summary>
        {question}
        <span className="af-faq-icon">+</span>
      </summary>
      <div className="af-faq-body">{children}</div>
    </details>
  );
}
