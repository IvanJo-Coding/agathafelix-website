import React from 'react';

let inputCssInjected = false;
function injectInputCss() {
  if (inputCssInjected || typeof document === 'undefined') return;
  inputCssInjected = true;
  const tag = document.createElement('style');
  tag.dataset.afComponent = 'input';
  tag.textContent = `
    .af-field { display:flex; flex-direction:column; gap:6px; font-family:var(--font-body); }
    .af-field-label { font-size:0.84rem; font-weight:700; color:var(--text-heading); }
    .af-field-control { font-family:var(--font-body); font-size:0.95rem; color:var(--text-heading);
      background:var(--surface-card,#fff); border:2px solid var(--af-line);
      border-radius:var(--radius-sm,10px); padding:11px 16px; outline:none; width:100%;
      box-sizing:border-box; transition:border-color 140ms ease, box-shadow 140ms ease; }
    .af-field-control::placeholder { color:var(--text-muted); }
    .af-field-control:hover { border-color:var(--af-ink-3); }
    .af-field-control:focus { border-color:var(--af-blue); box-shadow:0 0 0 4px var(--af-blue-soft); }
    .af-field-hint { font-size:0.75rem; color:var(--text-muted); }
    .af-field-error .af-field-control { border-color:var(--af-orange-deep); }
    .af-field-error .af-field-hint { color:var(--af-orange-deep); font-weight:600; }
    select.af-field-control { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235C574F' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:40px; }
    textarea.af-field-control { resize:vertical; min-height:96px; line-height:1.6; }
  `;
  document.head.appendChild(tag);
}

function Field({ label, hint, error, children }) {
  injectInputCss();
  return (
    <label className={`af-field${error ? ' af-field-error' : ''}`}>
      {label ? <span className="af-field-label">{label}</span> : null}
      {children}
      {hint || error ? <span className="af-field-hint">{error || hint}</span> : null}
    </label>
  );
}

/** Labeled text input. */
export function Input({ label, hint, error, style, ...rest }) {
  return (
    <Field label={label} hint={hint} error={error}>
      <input className="af-field-control" style={style} {...rest} />
    </Field>
  );
}

/** Labeled select with custom chevron. Pass options=[...] or <option> children. */
export function Select({ label, hint, error, options, children, style, ...rest }) {
  return (
    <Field label={label} hint={hint} error={error}>
      <select className="af-field-control" style={style} {...rest}>
        {options ? options.map((o) => <option key={o} value={o}>{o}</option>) : children}
      </select>
    </Field>
  );
}

/** Labeled multiline textarea. */
export function Textarea({ label, hint, error, style, ...rest }) {
  return (
    <Field label={label} hint={hint} error={error}>
      <textarea className="af-field-control" style={style} {...rest}></textarea>
    </Field>
  );
}
