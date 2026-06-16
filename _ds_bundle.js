/* @ds-bundle: {"format":3,"namespace":"AgathaFelixDesignSystem_3557c1","components":[{"name":"FAQItem","sourcePath":"components/content/FAQItem.jsx"},{"name":"ProductCard","sourcePath":"components/content/ProductCard.jsx"},{"name":"SectionHeader","sourcePath":"components/content/SectionHeader.jsx"},{"name":"Stat","sourcePath":"components/content/Stat.jsx"},{"name":"Step","sourcePath":"components/content/Step.jsx"},{"name":"TestimonialCard","sourcePath":"components/content/TestimonialCard.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Input.jsx"},{"name":"Textarea","sourcePath":"components/forms/Input.jsx"}],"sourceHashes":{"components/content/FAQItem.jsx":"7d7bb43c7b81","components/content/ProductCard.jsx":"27132ed875ca","components/content/SectionHeader.jsx":"68e27df69ad0","components/content/Stat.jsx":"247680ee0731","components/content/Step.jsx":"e59a8a840ebc","components/content/TestimonialCard.jsx":"6281c52acc27","components/core/Badge.jsx":"bf255fc8964e","components/core/Button.jsx":"adc369138e11","components/core/Card.jsx":"676d3e038e05","components/core/Chip.jsx":"afba0fa9f277","components/forms/Input.jsx":"9d53f2f65c2e","ui_kits/website/Header.jsx":"8d9c06f8996e","ui_kits/website/Sections.jsx":"e5d3a5805de5","ui_kits/website_v2/BerandaSections.jsx":"cacdffe240ba","ui_kits/website_v2/HeroMap.jsx":"170886f54aca","ui_kits/website_v2/Portfolio.jsx":"f4ffa331c88a","ui_kits/website_v2/ProdukCustomSections.jsx":"9c59936c2ef8","ui_kits/website_v2/ProdukStandarSections.jsx":"d7e0ffb695b6","ui_kits/website_v2/Shell.jsx":"715503eb6407","ui_kits/website_v2/Simulator.jsx":"73e679fec2a1"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AgathaFelixDesignSystem_3557c1 = window.AgathaFelixDesignSystem_3557c1 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/FAQItem.jsx
try { (() => {
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
function FAQItem({
  question,
  children,
  defaultOpen = false,
  style
}) {
  injectFaqCss();
  return /*#__PURE__*/React.createElement("details", {
    className: "af-faq",
    open: defaultOpen,
    style: style
  }, /*#__PURE__*/React.createElement("summary", null, question, /*#__PURE__*/React.createElement("span", {
    className: "af-faq-icon"
  }, "+")), /*#__PURE__*/React.createElement("div", {
    className: "af-faq-body"
  }, children));
}
Object.assign(__ds_scope, { FAQItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/FAQItem.jsx", error: String((e && e.message) || e) }); }

// components/content/Stat.jsx
try { (() => {
const STAT_COLORS = {
  orange: 'var(--af-orange)',
  green: 'var(--af-green)',
  yellow: 'var(--af-yellow-deep)',
  purple: 'var(--af-purple)',
  blue: 'var(--af-blue)',
  ink: 'var(--af-ink)'
};

/**
 * Big playful number + small label, e.g. "500+ / Institusi Dilayani".
 */
function Stat({
  value,
  label,
  color = 'orange',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card, #fff)',
      border: '1px solid var(--af-line)',
      borderRadius: 'var(--radius-md, 16px)',
      padding: '14px 18px',
      boxShadow: 'var(--shadow-soft)',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      ...style
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '1.9rem',
      lineHeight: 1,
      fontWeight: 800,
      color: STAT_COLORS[color] || STAT_COLORS.orange,
      letterSpacing: '-0.02em'
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '0.74rem',
      color: 'var(--text-muted)',
      fontWeight: 600
    }
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Stat.jsx", error: String((e && e.message) || e) }); }

// components/content/Step.jsx
try { (() => {
const STEP_COLORS = {
  orange: ['var(--af-orange)', 'var(--af-orange-deep)'],
  green: ['var(--af-green)', 'var(--af-green-deep)'],
  purple: ['var(--af-purple)', 'var(--af-purple-deep)'],
  blue: ['var(--af-blue)', 'var(--af-blue-deep)']
};

/**
 * Numbered process step — candy circle number + title + description.
 */
function Step({
  num,
  title,
  children,
  color = 'orange',
  style
}) {
  const [bg, deep] = STEP_COLORS[color] || STEP_COLORS.orange;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '0 8px',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      borderRadius: '50%',
      background: bg,
      color: '#fff',
      fontFamily: 'var(--font-display)',
      fontSize: '1.5rem',
      fontWeight: 800,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 18px',
      boxShadow: `0 4px 0 ${deep}`
    }
  }, num), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--text-lg, 1.45rem)',
      marginBottom: 8
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm, 0.84rem)',
      color: 'var(--text-body)'
    }
  }, children));
}
Object.assign(__ds_scope, { Step });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Step.jsx", error: String((e && e.message) || e) }); }

// components/content/TestimonialCard.jsx
try { (() => {
const AVATAR_COLORS = ['var(--af-orange)', 'var(--af-green)', 'var(--af-purple)', 'var(--af-blue)'];

/**
 * Customer quote card: ★ stars, italic quote, initials avatar + name/role.
 */
function TestimonialCard({
  quote,
  name,
  role,
  avatarColor = 0,
  style
}) {
  const initials = name.split(' ').filter(w => w.length > 1).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card, #fff)',
      border: '1px solid var(--af-line)',
      borderRadius: 'var(--radius-lg, 24px)',
      padding: 'var(--space-5, 24px)',
      boxShadow: 'var(--shadow-soft)',
      fontFamily: 'var(--font-body)',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--af-yellow-deep)',
      fontSize: '0.95rem',
      letterSpacing: 3
    }
  }, "\u2605\u2605\u2605\u2605\u2605"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '0.88rem',
      lineHeight: 1.75,
      fontStyle: 'italic',
      color: 'var(--text-body)'
    }
  }, "\u201C", quote, "\u201D"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      borderTop: '1px solid var(--af-line)',
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      flexShrink: 0,
      background: AVATAR_COLORS[avatarColor % AVATAR_COLORS.length],
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: '0.8rem'
    }
  }, initials), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.86rem',
      fontWeight: 700,
      color: 'var(--text-heading)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.74rem',
      color: 'var(--text-muted)'
    }
  }, role))));
}
Object.assign(__ds_scope, { TestimonialCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/TestimonialCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const BADGE_COLORS = {
  orange: ['var(--af-orange-soft)', 'var(--af-orange-deep)'],
  green: ['var(--af-green-soft)', 'var(--af-green-deep)'],
  yellow: ['var(--af-yellow-soft)', 'var(--af-yellow-deep)'],
  purple: ['var(--af-purple-soft)', 'var(--af-purple-deep)'],
  blue: ['var(--af-blue-soft)', 'var(--af-blue-deep)'],
  ink: ['var(--af-paper-2)', 'var(--af-ink-2)']
};

/**
 * Uppercase eyebrow label pill — sits above section headings.
 */
function Badge({
  color = 'orange',
  dot = false,
  children,
  style,
  ...rest
}) {
  const [bg, fg] = BADGE_COLORS[color] || BADGE_COLORS.orange;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      background: bg,
      color: fg,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-xs, 0.75rem)',
      fontWeight: 700,
      letterSpacing: 'var(--tracking-caps, 0.08em)',
      textTransform: 'uppercase',
      padding: '6px 14px',
      borderRadius: 'var(--radius-pill, 999px)',
      ...style
    }
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'currentColor',
      flexShrink: 0
    }
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/content/SectionHeader.jsx
try { (() => {
/**
 * Centered (or left-aligned) section intro: eyebrow Badge + display
 * heading (one optional colored word) + short description.
 */
function SectionHeader({
  eyebrow,
  eyebrowColor = 'orange',
  title,
  highlight,
  highlightColor = 'orange',
  description,
  align = 'center',
  style
}) {
  const colors = {
    orange: 'var(--af-orange)',
    green: 'var(--af-green)',
    yellow: 'var(--af-yellow-deep)',
    purple: 'var(--af-purple)',
    blue: 'var(--af-blue)'
  };
  const parts = highlight && title.includes(highlight) ? title.split(highlight) : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      maxWidth: 640,
      margin: align === 'center' ? '0 auto var(--space-7, 48px)' : '0 0 var(--space-7, 48px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3, 12px)',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      ...style
    }
  }, eyebrow ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    color: eyebrowColor
  }, eyebrow) : null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-xl, 1.95rem)'
    }
  }, parts ? /*#__PURE__*/React.createElement(React.Fragment, null, parts[0], /*#__PURE__*/React.createElement("span", {
    style: {
      color: colors[highlightColor] || colors.orange
    }
  }, highlight), parts[1]) : title), description ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm, 0.84rem)',
      color: 'var(--text-body)'
    }
  }, description) : null);
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const BTN_COLORS = {
  orange: ['var(--af-orange)', 'var(--af-orange-deep)'],
  wa: ['var(--af-wa)', 'var(--af-wa-deep)'],
  green: ['var(--af-green)', 'var(--af-green-deep)'],
  purple: ['var(--af-purple)', 'var(--af-purple-deep)'],
  blue: ['var(--af-blue)', 'var(--af-blue-deep)']
};
const BTN_SIZES = {
  sm: {
    padding: '8px 18px',
    fontSize: '0.82rem'
  },
  md: {
    padding: '12px 24px',
    fontSize: '0.9rem'
  },
  lg: {
    padding: '15px 32px',
    fontSize: '1rem'
  }
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
function Button({
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
  const mergedStyle = {
    '--btn': bg,
    '--btn-deep': deep,
    ...sz,
    ...style
  };
  const Tag = href ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    href: href,
    disabled: disabled,
    style: mergedStyle
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ACCENTS = {
  orange: 'var(--af-orange)',
  green: 'var(--af-green)',
  yellow: 'var(--af-yellow-deep)',
  purple: 'var(--af-purple)',
  blue: 'var(--af-blue)',
  ink: 'var(--af-ink)'
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
function Card({
  variant = 'soft',
  accent = 'ink',
  hover = false,
  padding = 'var(--space-5, 24px)',
  children,
  style,
  ...rest
}) {
  injectCardCss();
  const cls = ['af-card', variant === 'sticker' ? 'af-card-sticker' : 'af-card-soft', hover ? 'af-card-hover' : ''].join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls,
    style: {
      '--card-accent': ACCENTS[accent] || ACCENTS.ink,
      padding,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CHIP_COLORS = {
  orange: ['var(--af-orange-tint)', 'var(--af-orange-deep)', 'var(--af-orange-soft)'],
  green: ['var(--af-green-tint)', 'var(--af-green-deep)', 'var(--af-green-soft)'],
  yellow: ['var(--af-yellow-tint)', 'var(--af-yellow-deep)', 'var(--af-yellow-soft)'],
  purple: ['var(--af-purple-tint)', 'var(--af-purple-deep)', 'var(--af-purple-soft)'],
  blue: ['var(--af-blue-tint)', 'var(--af-blue-deep)', 'var(--af-blue-soft)']
};

/**
 * Small metadata tag pill, e.g. "Kantor · Sekolah" on product cards.
 */
function Chip({
  color = 'blue',
  children,
  style,
  ...rest
}) {
  const [bg, fg, border] = CHIP_COLORS[color] || CHIP_COLORS.blue;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      background: bg,
      color: fg,
      border: `1.5px solid ${border}`,
      fontFamily: 'var(--font-body)',
      fontSize: '0.72rem',
      fontWeight: 600,
      padding: '3px 12px',
      borderRadius: 'var(--radius-pill, 999px)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/content/ProductCard.jsx
try { (() => {
const PC_ACCENTS = {
  orange: 'var(--af-orange)',
  green: 'var(--af-green)',
  purple: 'var(--af-purple)',
  blue: 'var(--af-blue)'
};
const PC_TINTS = {
  orange: 'var(--af-orange-tint)',
  green: 'var(--af-green-tint)',
  purple: 'var(--af-purple-tint)',
  blue: 'var(--af-blue-tint)'
};

/**
 * Product card: tinted media area (photo or icon), tag, title, description,
 * audience chip + price hint. featured = sticker outline in the accent color.
 */
function ProductCard({
  tag,
  title,
  description,
  image,
  icon,
  chip,
  price,
  accent = 'blue',
  featured = false,
  style
}) {
  const accentColor = PC_ACCENTS[accent] || PC_ACCENTS.blue;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card, #fff)',
      overflow: 'hidden',
      borderRadius: 'var(--radius-lg, 24px)',
      fontFamily: 'var(--font-body)',
      border: featured ? `2px solid ${accentColor}` : '1px solid var(--af-line)',
      boxShadow: featured ? 'var(--shadow-sticker)' : 'var(--shadow-soft)',
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 140,
      background: PC_TINTS[accent] || PC_TINTS.blue,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: accentColor,
      borderBottom: '1px solid var(--af-line)'
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: title,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      width: 48,
      height: 48
    }
  }, icon)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px 14px',
      flex: 1
    }
  }, tag ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.65rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: featured ? accentColor : 'var(--text-muted)',
      display: 'block',
      marginBottom: 8
    }
  }, tag) : null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.25rem',
      marginBottom: 6
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '0.82rem',
      lineHeight: 1.6,
      color: 'var(--text-body)'
    }
  }, description)), chip || price ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px 16px',
      borderTop: '1px solid var(--af-line)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 8
    }
  }, chip ? /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    color: accent
  }, chip) : null, price ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.74rem',
      color: 'var(--text-muted)'
    }
  }, "Mulai ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: accentColor
    }
  }, price), "/pcs") : null) : null);
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Field({
  label,
  hint,
  error,
  children
}) {
  injectInputCss();
  return /*#__PURE__*/React.createElement("label", {
    className: `af-field${error ? ' af-field-error' : ''}`
  }, label ? /*#__PURE__*/React.createElement("span", {
    className: "af-field-label"
  }, label) : null, children, hint || error ? /*#__PURE__*/React.createElement("span", {
    className: "af-field-hint"
  }, error || hint) : null);
}

/** Labeled text input. */
function Input({
  label,
  hint,
  error,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(Field, {
    label: label,
    hint: hint,
    error: error
  }, /*#__PURE__*/React.createElement("input", _extends({
    className: "af-field-control",
    style: style
  }, rest)));
}

/** Labeled select with custom chevron. Pass options=[...] or <option> children. */
function Select({
  label,
  hint,
  error,
  options,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(Field, {
    label: label,
    hint: hint,
    error: error
  }, /*#__PURE__*/React.createElement("select", _extends({
    className: "af-field-control",
    style: style
  }, rest), options ? options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o)) : children));
}

/** Labeled multiline textarea. */
function Textarea({
  label,
  hint,
  error,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(Field, {
    label: label,
    hint: hint,
    error: error
  }, /*#__PURE__*/React.createElement("textarea", _extends({
    className: "af-field-control",
    style: style
  }, rest)));
}
Object.assign(__ds_scope, { Input, Select, Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
// Agatha Felix website UI kit — header, footer, floating WhatsApp bubble.
// Loads after _ds_bundle.js; exports to window for Sections.jsx / index.html.
const DS = window.AgathaFelixDesignSystem_3557c1;
const WaGlyph = ({
  size = 18
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "currentColor",
  style: {
    width: size,
    height: size,
    flexShrink: 0
  }
}, /*#__PURE__*/React.createElement("path", {
  d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
}));
const NAV_LINKS = [['#hero', 'Home'], ['#produk', 'Produk Standar'], ['#sekolah', 'Produk Custom'], ['#cara-pesan', 'Cara Pesan'], ['#faq', 'FAQ']];
function SiteHeader({
  active = '#hero'
}) {
  const {
    Button
  } = DS;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      height: 66,
      background: 'rgba(255,248,238,.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--af-line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      height: '100%',
      padding: '0 var(--container-pad)',
      display: 'flex',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#hero",
    style: {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/logo-agatha-felix.png",
    alt: "Agatha Felix",
    style: {
      height: 44
    }
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      marginLeft: 'auto'
    },
    "aria-label": "Navigasi"
  }, NAV_LINKS.map(([href, label]) => /*#__PURE__*/React.createElement("a", {
    key: href,
    href: href,
    style: {
      fontSize: '0.84rem',
      fontWeight: 600,
      textDecoration: 'none',
      color: href === active ? 'var(--af-orange-deep)' : 'var(--text-body)',
      background: href === active ? 'var(--af-orange-tint)' : 'transparent',
      padding: '7px 13px',
      borderRadius: 'var(--radius-pill)'
    }
  }, label))), /*#__PURE__*/React.createElement(Button, {
    color: "wa",
    size: "sm"
  }, /*#__PURE__*/React.createElement(WaGlyph, {
    size: 15
  }), " Chat WhatsApp")));
}
function FloatingWA() {
  return /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/6282219472613",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "Chat WhatsApp",
    style: {
      position: 'fixed',
      right: 22,
      bottom: 22,
      zIndex: 60,
      width: 58,
      height: 58,
      borderRadius: '50%',
      background: 'var(--af-wa)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 0 var(--af-wa-deep), var(--shadow-pop)'
    }
  }, /*#__PURE__*/React.createElement(WaGlyph, {
    size: 28
  }));
}
function SiteFooter() {
  const colHead = {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '0.95rem',
    color: '#fff',
    marginBottom: 14
  };
  const link = {
    display: 'block',
    color: 'rgba(255,255,255,.72)',
    fontSize: '0.82rem',
    textDecoration: 'none',
    lineHeight: 2.1
  };
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--af-ink)',
      color: 'rgba(255,255,255,.72)',
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '56px var(--container-pad) 28px',
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "/assets/logo-mark-white.png",
    alt: "Agatha Felix",
    style: {
      height: 48,
      marginBottom: 14
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      lineHeight: 1.8,
      margin: 0,
      maxWidth: 260
    }
  }, "Spesialist Product Custom Stationery. Produsen map plastik \u2014 langsung dari pabrik, bukan reseller.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: colHead
  }, "Produk"), /*#__PURE__*/React.createElement("a", {
    href: "#produk",
    style: link
  }, "Clear Holder"), /*#__PURE__*/React.createElement("a", {
    href: "#produk",
    style: link
  }, "Map L"), /*#__PURE__*/React.createElement("a", {
    href: "#produk",
    style: link
  }, "Map Executive"), /*#__PURE__*/React.createElement("a", {
    href: "#sekolah",
    style: link
  }, "Rapor & Map Custom")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: colHead
  }, "Perusahaan"), /*#__PURE__*/React.createElement("a", {
    href: "#keunggulan",
    style: link
  }, "Keunggulan"), /*#__PURE__*/React.createElement("a", {
    href: "#cara-pesan",
    style: link
  }, "Cara Pesan"), /*#__PURE__*/React.createElement("a", {
    href: "#testimoni",
    style: link
  }, "Testimoni"), /*#__PURE__*/React.createElement("a", {
    href: "#faq",
    style: link
  }, "FAQ")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: colHead
  }, "Hubungi Kami"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      lineHeight: 2,
      margin: 0
    }
  }, "WhatsApp: +62 822-1947-2613", /*#__PURE__*/React.createElement("br", null), "Senin\u2013Sabtu, 08.00\u201317.00 WIB", /*#__PURE__*/React.createElement("br", null), "Melayani seluruh Indonesia"))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,.14)',
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '18px var(--container-pad)',
      fontSize: '0.74rem',
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Agatha Felix Stationery. Semua hak dilindungi."), /*#__PURE__*/React.createElement("span", null, "Langsung dari Pabrik \u2014 Bukan Reseller")));
}
Object.assign(window, {
  SiteHeader,
  SiteFooter,
  FloatingWA,
  WaGlyph
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Sections.jsx
try { (() => {
// Agatha Felix website UI kit — homepage sections.
const DSx = window.AgathaFelixDesignSystem_3557c1;
const sectionWrap = (extra = {}) => ({
  maxWidth: 'var(--container-max)',
  margin: '0 auto',
  padding: 'var(--space-9) var(--container-pad)',
  ...extra
});

// Confetti dots — the brand's only ornament.
function Confetti({
  style
}) {
  const dots = [['var(--af-orange)', 10, '4%', '12%'], ['var(--af-green)', 7, '12%', '78%'], ['var(--af-yellow)', 12, '78%', '6%'], ['var(--af-purple)', 8, '66%', '90%'], ['var(--af-blue)', 9, '88%', '64%']];
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      ...style
    }
  }, dots.map(([c, s, top, left], i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: 'absolute',
      top,
      left,
      width: s,
      height: s,
      borderRadius: '50%',
      background: c,
      opacity: 0.55
    }
  })));
}
function Hero() {
  const {
    Button,
    Badge,
    Stat
  } = DSx;
  return /*#__PURE__*/React.createElement("section", {
    id: "hero",
    style: {
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(Confetti, null), /*#__PURE__*/React.createElement("div", {
    style: sectionWrap({
      display: 'grid',
      gridTemplateColumns: '1.15fr 1fr',
      gap: 48,
      alignItems: 'center',
      paddingTop: 72,
      paddingBottom: 72
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    color: "orange",
    dot: true
  }, "\uD83C\uDFED Produsen Langsung \u2014 Bukan Reseller"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-3xl)'
    }
  }, "Spesialis ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--af-orange)'
    }
  }, "Map Plastik ATK"), " untuk Kantor, Sekolah & Lebih"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-md)',
      maxWidth: 520
    }
  }, "Kami pabriknya langsung. ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-heading)'
    }
  }, "Clear Holder, Map L, Map Executive"), ", hingga", ' ', /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-heading)'
    }
  }, "rapor custom untuk sekolah & tempat les"), ". Tidak ada perantara \u2014 harga langsung dari sumbernya."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    color: "wa",
    size: "lg"
  }, /*#__PURE__*/React.createElement(window.WaGlyph, null), " Minta Penawaran Gratis"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg",
    href: "#produk"
  }, "Lihat Produk \u2193")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12,
      width: '100%',
      maxWidth: 460,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: "20M+",
    label: "Unit Diproduksi",
    color: "orange"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "500+",
    label: "Institusi Dilayani",
    color: "green"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "4",
    label: "Varian Utama",
    color: "purple"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '2px solid var(--af-ink)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-sticker-lg)',
      padding: 18,
      transform: 'rotate(1.5deg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/hero-products.png",
    alt: "Map Executive Agatha Felix",
    style: {
      width: '100%',
      borderRadius: 'var(--radius-lg)'
    }
  }))));
}
function PathChooser() {
  const {
    SectionHeader,
    Card,
    Chip
  } = DSx;
  const paths = [{
    accent: 'blue',
    title: 'Produk Standar',
    chip: 'Kantor · Arsip · Retail',
    desc: 'Clear Holder, Map L, Business File siap kirim. Beli per lusin atau grosir.',
    cta: 'Lihat Katalog Standar →'
  }, {
    accent: 'orange',
    title: 'Produk Custom',
    chip: 'Sekolah · Les · Notaris · Korporat',
    desc: 'Rapor sekolah, map berlogo untuk kantor hukum & institusi. Desain dibantu gratis.',
    cta: 'Lihat Custom Order →'
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "path",
    style: {
      background: 'var(--surface-band)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: sectionWrap()
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "Pilih Kebutuhan Anda",
    eyebrowColor: "blue",
    title: "Kami Melayani Dua Jenis Pelanggan",
    highlight: "Dua",
    highlightColor: "blue",
    description: "Pilih kategori yang sesuai untuk melihat produk dan harga yang relevan."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20
    }
  }, paths.map(p => /*#__PURE__*/React.createElement(Card, {
    key: p.title,
    variant: "sticker",
    accent: p.accent,
    hover: true,
    padding: "28px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    color: p.accent
  }, p.chip), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--text-lg)'
    }
  }, p.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '0.88rem'
    }
  }, p.desc), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: '0.86rem',
      color: `var(--af-${p.accent}-deep)`
    }
  }, p.cta)))))));
}
const FolderIcon = ({
  d
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: {
    width: '100%',
    height: '100%'
  }
}, d.map((p, i) => /*#__PURE__*/React.createElement("path", {
  key: i,
  d: p
})));
const ICONS = {
  clearHolder: ['M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z', 'M8 10h8', 'M8 14h5'],
  mapL: ['M14 3v4a1 1 0 0 0 1 1h4', 'M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z'],
  mapExec: ['M2 7a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z', 'M7 13h10'],
  mapCustom: ['M12 20h9', 'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z']
};
function Products() {
  const {
    SectionHeader,
    ProductCard
  } = DSx;
  return /*#__PURE__*/React.createElement("section", {
    id: "produk"
  }, /*#__PURE__*/React.createElement("div", {
    style: sectionWrap()
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "Produk Kami",
    eyebrowColor: "green",
    title: "Empat Produk Utama",
    highlight: "Empat",
    highlightColor: "green",
    description: "Semua diproduksi in-house dengan kontrol kualitas langsung dari lantai produksi."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(ProductCard, {
    tag: "Standar",
    title: "Clear Holder",
    description: "Map plastik berkantong untuk arsip dokumen \u2014 20 hingga 100 pocket.",
    icon: /*#__PURE__*/React.createElement(FolderIcon, {
      d: ICONS.clearHolder
    }),
    chip: "Kantor \xB7 Arsip",
    price: "Rp [TBD]",
    accent: "blue"
  }), /*#__PURE__*/React.createElement(ProductCard, {
    tag: "Standar",
    title: "Map L",
    description: "Map plastik bentuk L, transparan dan berwarna. Dokumen cepat masuk-keluar.",
    icon: /*#__PURE__*/React.createElement(FolderIcon, {
      d: ICONS.mapL
    }),
    chip: "Kantor \xB7 Sekolah",
    price: "Rp [TBD]",
    accent: "green"
  }), /*#__PURE__*/React.createElement(ProductCard, {
    tag: "Premium",
    title: "Map Executive",
    description: "Document keeper premium dengan kancing \u2014 rapi untuk proposal & kontrak.",
    image: "/assets/hero-products.png",
    chip: "Notaris \xB7 Korporat",
    price: "Rp [TBD]",
    accent: "purple"
  }), /*#__PURE__*/React.createElement(ProductCard, {
    tag: "Best Seller",
    title: "Map Custom",
    description: "Cetak logo, warna, dan ukuran bebas pilih. Untuk sekolah, les, hingga kantor hukum.",
    icon: /*#__PURE__*/React.createElement(FolderIcon, {
      d: ICONS.mapCustom
    }),
    chip: "Sekolah \xB7 Les \xB7 Korporat",
    price: "Rp [TBD]",
    accent: "orange",
    featured: true
  }))));
}
function SchoolSection() {
  const {
    Badge,
    Button,
    Stat,
    Card
  } = DSx;
  return /*#__PURE__*/React.createElement("section", {
    id: "sekolah",
    style: {
      background: 'var(--af-purple-tint)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(Confetti, null), /*#__PURE__*/React.createElement("div", {
    style: sectionWrap({
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: 48,
      alignItems: 'center'
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    color: "purple",
    dot: true
  }, "Khusus Institusi Pendidikan"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-xl)'
    }
  }, "Rapor & Map Custom untuk ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--af-purple)'
    }
  }, "Sekolah dan Tempat Les")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '0.95rem',
      maxWidth: 480
    }
  }, "Sampul rapor dengan logo dan warna khas sekolah Anda. Desain dibantu gratis, melayani dari 1 kelas hingga seluruh sekolah."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12,
      width: '100%',
      maxWidth: 460
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: "30+",
    label: "MOQ Rapor (pcs)",
    color: "purple"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "500+",
    label: "Sekolah & Bimbel",
    color: "orange"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "5\u201314",
    label: "Hari Kerja",
    color: "green"
  })), /*#__PURE__*/React.createElement(Button, {
    color: "purple",
    size: "lg"
  }, /*#__PURE__*/React.createElement(window.WaGlyph, null), " Konsultasi untuk Sekolah / Les")), /*#__PURE__*/React.createElement(Card, {
    variant: "sticker",
    accent: "purple",
    padding: "26px",
    style: {
      transform: 'rotate(-1.5deg)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.2rem',
      marginBottom: 12
    }
  }, "Yang Anda dapatkan:"), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      fontSize: '0.88rem'
    }
  }, ['Desain sampul dibantu gratis', 'Logo & warna khas institusi Anda', 'Bahan tebal, jilid rapi, awet bertahun-tahun', 'Harga pabrik — tanpa margin reseller'].map(t => /*#__PURE__*/React.createElement("li", {
    key: t,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: 'var(--af-green)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      fontWeight: 800,
      flexShrink: 0
    }
  }, "\u2713"), t))))));
}
function Steps() {
  const {
    SectionHeader,
    Step
  } = DSx;
  return /*#__PURE__*/React.createElement("section", {
    id: "cara-pesan"
  }, /*#__PURE__*/React.createElement("div", {
    style: sectionWrap()
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "Mudah & Cepat",
    eyebrowColor: "orange",
    title: "Pesan dalam 3 Langkah",
    highlight: "3 Langkah",
    highlightColor: "orange",
    description: "Chat kami, diskusikan kebutuhan, dan produk siap dikirim ke seluruh Indonesia."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Step, {
    num: 1,
    title: "Chat & Konsultasi",
    color: "orange"
  }, "Hubungi via WhatsApp. Ceritakan produk apa, berapa jumlah, dan apakah butuh custom logo."), /*#__PURE__*/React.createElement(Step, {
    num: 2,
    title: "Approve Desain & DP",
    color: "green"
  }, "Kami kirim mockup desain. Setelah Anda setuju, produksi dimulai dengan DP."), /*#__PURE__*/React.createElement(Step, {
    num: 3,
    title: "Produksi & Kirim",
    color: "blue"
  }, "5\u201314 hari kerja, lalu produk dikirim ke alamat Anda di seluruh Indonesia."))));
}
function Testimonials() {
  const {
    SectionHeader,
    TestimonialCard
  } = DSx;
  return /*#__PURE__*/React.createElement("section", {
    id: "testimoni",
    style: {
      background: 'var(--surface-band)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: sectionWrap()
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "Testimoni",
    eyebrowColor: "yellow",
    title: "Yang Mereka Katakan"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(TestimonialCard, {
    quote: "Map custom dengan logo sekolah kami hasilnya sangat rapi. Harganya jauh lebih murah karena langsung dari pabrik.",
    name: "Bu Rahma Susanti",
    role: "Kepala Sekolah, SDN 04 Bekasi",
    avatarColor: 0
  }), /*#__PURE__*/React.createElement(TestimonialCard, {
    quote: "Pesan map kancing custom untuk kantor notaris. Prosesnya cepat dan hasilnya profesional.",
    name: "Pak Hendra Wijaya",
    role: "Notaris & PPAT, Jakarta",
    avatarColor: 2
  }), /*#__PURE__*/React.createElement(TestimonialCard, {
    quote: "Rapor bimbel kami jadi kebanggaan murid. Desainnya dibantu sampai kami puas.",
    name: "Pak Andri Setiawan",
    role: "Owner Bimbel Cerdas Ceria",
    avatarColor: 3
  }))));
}
function FAQ() {
  const {
    Badge,
    Button,
    FAQItem
  } = DSx;
  return /*#__PURE__*/React.createElement("section", {
    id: "faq"
  }, /*#__PURE__*/React.createElement("div", {
    style: sectionWrap({
      display: 'grid',
      gridTemplateColumns: '1fr 1.4fr',
      gap: 48,
      alignItems: 'start'
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    color: "blue"
  }, "FAQ"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-xl)'
    }
  }, "Pertanyaan yang Sering Ditanyakan"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '0.88rem'
    }
  }, "Masih ada pertanyaan lain? Langsung chat kami via WhatsApp."), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Tanya Langsung \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(FAQItem, {
    question: "Berapa minimum order untuk produk custom?",
    defaultOpen: true
  }, "MOQ custom print mulai 100 pcs. Khusus rapor sekolah dan tempat les bisa mulai 30\u201340 pcs \u2014 cukup untuk satu kelas."), /*#__PURE__*/React.createElement(FAQItem, {
    question: "Berapa lama waktu produksinya?"
  }, "5\u201314 hari kerja tergantung jumlah dan kerumitan desain, dihitung setelah desain disetujui."), /*#__PURE__*/React.createElement(FAQItem, {
    question: "Apakah desain dibantu?"
  }, "Ya, gratis. Kirim logo dan preferensi warna Anda, tim kami buatkan mockup sampai Anda setuju."), /*#__PURE__*/React.createElement(FAQItem, {
    question: "Apakah bisa kirim ke luar kota?"
  }, "Bisa \u2014 kami mengirim ke seluruh Indonesia via ekspedisi. Ongkir dihitung saat penawaran."))));
}
function CTABand() {
  const {
    Badge,
    Button
  } = DSx;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--af-orange)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: sectionWrap({
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      paddingTop: 72,
      paddingBottom: 72
    })
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/logo-mark-white.png",
    alt: "",
    style: {
      height: 56
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-xl)',
      color: '#fff',
      maxWidth: 560
    }
  }, "Dapatkan Penawaran Langsung dari Pabrik"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'rgba(255,255,255,.9)',
      fontSize: '0.95rem',
      maxWidth: 460
    }
  }, "Ceritakan kebutuhan Anda dan kami buatkan penawaran terbaik \u2014 gratis, tanpa komitmen."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    color: "wa",
    size: "lg"
  }, /*#__PURE__*/React.createElement(window.WaGlyph, null), " Chat WhatsApp Sekarang"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg",
    style: {
      borderColor: '#fff',
      color: '#fff'
    }
  }, "Kirim Email"))));
}
Object.assign(window, {
  Hero,
  PathChooser,
  Products,
  SchoolSection,
  Steps,
  Testimonials,
  FAQ,
  CTABand,
  Confetti
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Sections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website_v2/BerandaSections.jsx
try { (() => {
// Website v2 — Beranda sections (below hero).
const DS2b = window.AgathaFelixDesignSystem_3557c1;
const wrapV2 = (extra = {}) => ({
  maxWidth: 'var(--container-max)',
  margin: '0 auto',
  position: 'relative',
  zIndex: 1,
  padding: '72px var(--container-pad)',
  ...extra
});

// --- Produk teaser: 4 chunky tilted cards -------------------------------
const TEASERS = [{
  title: 'Clear Holder',
  desc: 'Buku display isi 20–80 kantong bening. Dokumen langsung rapi.',
  color: 'blue',
  emoji: null,
  rot: -2,
  img: '/assets/products/clear-holder.png'
}, {
  title: 'Business File',
  desc: 'Map kancing PP tebal, banyak warna. Klik, simpan, bawa.',
  color: 'orange',
  rot: 1.5,
  img: '/assets/products/business-file.png'
}, {
  title: 'Map Executive',
  desc: 'Document keeper premium, gagah buat proposal & kontrak.',
  color: 'purple',
  rot: -1,
  img: '/assets/products/map-executive.png'
}, {
  title: 'Rapor & Map Custom',
  desc: 'Logo sekolahmu, warna pilihanmu. Paling laris!',
  color: 'orange',
  rot: 2,
  img: null,
  featured: true
}];
const TEASER_ICONS = {
  'Clear Holder': ['M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z', 'M8 10h8', 'M8 14h5'],
  'Map L & Kancing': ['M14 3v4a1 1 0 0 0 1 1h4', 'M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z'],
  'Rapor & Map Custom': ['M12 20h9', 'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z']
};
function TeaserCard({
  t
}) {
  const deep = `var(--af-${t.color}-deep)`;
  return /*#__PURE__*/React.createElement("a", {
    href: t.featured ? 'produk-custom.html' : 'produk-standar.html',
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      textDecoration: 'none',
      background: '#fff',
      border: '2px solid var(--af-ink)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 5px 0 var(--af-ink)',
      overflow: 'hidden',
      transform: `rotate(${t.rot}deg)`,
      transition: 'transform 220ms var(--ease-pop), box-shadow 220ms ease'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'rotate(0deg) translateY(-5px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = `rotate(${t.rot}deg)`;
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 150,
      background: t.img ? '#f4ede1' : `var(--af-${t.color})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      borderBottom: '2px solid var(--af-ink)',
      position: 'relative'
    }
  }, t.img ? /*#__PURE__*/React.createElement("img", {
    src: t.img,
    alt: t.title,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      width: 52,
      height: 52
    }
  }, (TEASER_ICONS[t.title] || []).map((d, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: d
  }))), t.featured ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 10,
      right: 10,
      background: 'var(--af-yellow)',
      border: '2px solid var(--af-ink)',
      borderRadius: 999,
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 11,
      padding: '3px 10px',
      color: 'var(--af-ink)'
    }
  }, "PALING LARIS \u2B50") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px 18px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.3rem',
      marginBottom: 6
    }
  }, t.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 10px',
      fontSize: '0.84rem',
      lineHeight: 1.6,
      color: 'var(--text-body)'
    }
  }, t.desc), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: '0.85rem',
      color: deep
    }
  }, "Intip yuk \u2192")));
}
function ProdukTeaserV2() {
  const {
    SectionHeader
  } = DS2b;
  return /*#__PURE__*/React.createElement("section", {
    id: "produk",
    style: {
      background: 'var(--af-paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wrapV2()
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "Isi Lemari Kami",
    eyebrowColor: "green",
    title: "Mau Map yang Mana?",
    highlight: "Mana?",
    highlightColor: "green",
    description: "Semua dibuat sendiri di pabrik kami \u2014 bukan ambil dari gudang orang."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 20
    }
  }, TEASERS.map(t => /*#__PURE__*/React.createElement(TeaserCard, {
    key: t.title,
    t: t
  })))));
}

// --- Sekolah focus -------------------------------------------------------
function SekolahV2() {
  const {
    Badge,
    Button
  } = DS2b;
  const colors = ['var(--af-orange)', 'var(--af-green)', 'var(--af-purple)', 'var(--af-blue)'];
  return /*#__PURE__*/React.createElement("section", {
    id: "sekolah",
    style: {
      background: 'var(--af-purple)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(window.Wave, {
    fill: "var(--af-paper)",
    flip: true
  }), /*#__PURE__*/React.createElement("div", {
    style: wrapV2({
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      alignItems: 'center'
    })
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 320
    }
  }, colors.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c,
    style: {
      position: 'absolute',
      left: 40 + i * 56,
      top: 30 + i % 2 * 26,
      width: 180,
      height: 250,
      background: c,
      border: '2px solid var(--af-ink)',
      borderRadius: 14,
      boxShadow: '0 5px 0 var(--af-ink)',
      transform: `rotate(${(i - 1.5) * 5}deg)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      zIndex: i
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/logo-mark-white.png",
    alt: "",
    style: {
      height: 44,
      opacity: .95
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      color: '#fff',
      fontSize: 13,
      textAlign: 'center',
      lineHeight: 1.3
    }
  }, "RAPOR", /*#__PURE__*/React.createElement("br", null), "SISWA"), /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#fff',
      border: '2px solid var(--af-ink)',
      borderRadius: 999,
      fontSize: 9,
      fontWeight: 700,
      padding: '2px 10px',
      color: 'var(--af-ink)'
    }
  }, "LOGO SEKOLAHMU"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    color: "yellow",
    dot: true
  }, "Spesial Sekolah & Tempat Les"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-xl)',
      color: '#fff'
    }
  }, "Rapor Kerennya, ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--af-yellow)'
    }
  }, "Biar Kami yang Bikin!")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '0.95rem',
      color: 'rgba(255,255,255,.92)',
      maxWidth: 440
    }
  }, "Sampul rapor dengan logo dan warna khas sekolahmu \u2014 bahan tebal, jilid rapi, awet sampai lulus. Mulai dari ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--af-yellow)'
    }
  }, "30 pcs saja"), " (satu kelas juga kami layani!), desain dibantu gratis sampai kamu bilang \"nah, ini dia!\"."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    color: "wa",
    size: "lg"
  }, /*#__PURE__*/React.createElement(window.WaGlyph2, null), " Konsultasi Gratis"), /*#__PURE__*/React.createElement(Button, {
    color: "orange",
    size: "lg",
    href: "produk-custom.html#simulator"
  }, "\uD83C\uDFA8 Desain Sendiri di Simulator")))), /*#__PURE__*/React.createElement(window.Wave, {
    fill: "var(--af-paper)"
  }));
}

// --- Cara pesan ----------------------------------------------------------
function CaraPesanV2() {
  const {
    SectionHeader,
    Step
  } = DS2b;
  return /*#__PURE__*/React.createElement("section", {
    id: "cara-pesan",
    style: {
      background: 'var(--af-paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wrapV2()
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "Gampang Banget",
    eyebrowColor: "orange",
    title: "Pesan dalam 3 Langkah",
    highlight: "3 Langkah",
    highlightColor: "orange",
    description: "Nggak pakai ribet \u2014 semua lewat WhatsApp."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Step, {
    num: 1,
    title: "Cerita Dulu",
    color: "orange"
  }, "Chat WhatsApp kami. Mau map apa, berapa banyak, ada logo atau belum?"), /*#__PURE__*/React.createElement(Step, {
    num: 2,
    title: "Lihat Desainnya",
    color: "green"
  }, "Kami kirim mockup gratis. Revisi sampai cocok, baru bayar DP."), /*#__PURE__*/React.createElement(Step, {
    num: 3,
    title: "Tunggu di Rumah",
    color: "blue"
  }, "5\u201314 hari kerja, paket meluncur ke alamatmu di mana pun di Indonesia."))));
}

// --- Testimoni + FAQ + CTA ------------------------------------------------
function TestimoniV2() {
  const {
    SectionHeader,
    TestimonialCard
  } = DS2b;
  return /*#__PURE__*/React.createElement("section", {
    id: "testimoni",
    style: {
      background: 'var(--af-green-tint)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wrapV2()
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "Kata Mereka",
    eyebrowColor: "green",
    title: "Sudah Dicoba 500+ Sekolah & Kantor",
    highlight: "500+",
    highlightColor: "green"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(TestimonialCard, {
    quote: "Rapor custom logo sekolah kami hasilnya rapi banget. Murid-murid sampai pamer ke orang tuanya!",
    name: "Bu Rahma Susanti",
    role: "Kepala Sekolah, SDN 04 Bekasi",
    avatarColor: 0
  }), /*#__PURE__*/React.createElement(TestimonialCard, {
    quote: "Pesan map kancing custom untuk kantor notaris. Cepat, profesional, dan kliennya langsung notice.",
    name: "Pak Hendra Wijaya",
    role: "Notaris & PPAT, Jakarta",
    avatarColor: 2
  }), /*#__PURE__*/React.createElement(TestimonialCard, {
    quote: "Desainnya dibantu sampai kami puas. Rapor bimbel kami sekarang jadi kebanggaan murid.",
    name: "Pak Andri Setiawan",
    role: "Owner Bimbel Cerdas Ceria",
    avatarColor: 3
  }))));
}
function FAQV2() {
  const {
    Badge,
    Button,
    FAQItem
  } = DS2b;
  return /*#__PURE__*/React.createElement("section", {
    id: "faq",
    style: {
      background: 'var(--af-paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wrapV2({
      display: 'grid',
      gridTemplateColumns: '1fr 1.4fr',
      gap: 48,
      alignItems: 'start'
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    color: "blue"
  }, "Masih Penasaran?"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-xl)'
    }
  }, "Tanya-Tanya Dulu, Boleh Banget"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '0.88rem'
    }
  }, "Belum ketemu jawabannya? Langsung saja chat kami \u2014 dibalas manusia, bukan robot."), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Tanya via WhatsApp \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(FAQItem, {
    question: "Minimal pesan berapa, sih?",
    defaultOpen: true
  }, "Custom print mulai 100 pcs. Khusus rapor sekolah & tempat les bisa mulai 30\u201340 pcs \u2014 cukup untuk satu kelas."), /*#__PURE__*/React.createElement(FAQItem, {
    question: "Berapa lama jadinya?"
  }, "5\u201314 hari kerja setelah desain kamu setujui, tergantung jumlah dan tingkat kerumitan."), /*#__PURE__*/React.createElement(FAQItem, {
    question: "Aku nggak bisa desain. Gimana dong?"
  }, "Tenang! Kirim logo dan warna kesukaanmu, tim kami yang buatkan mockup \u2014 gratis, revisi sampai cocok."), /*#__PURE__*/React.createElement(FAQItem, {
    question: "Kirim ke luar pulau bisa?"
  }, "Bisa! Kami kirim ke seluruh Indonesia via ekspedisi. Ongkir dihitung transparan saat penawaran."))));
}
function CTAV2() {
  const {
    Button
  } = DS2b;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--af-orange)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(window.ConfettiV2, {
    density: 1
  }), /*#__PURE__*/React.createElement("div", {
    style: wrapV2({
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    })
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/logo-mark-white.png",
    alt: "",
    style: {
      height: 60
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-xl)',
      color: '#fff',
      maxWidth: 560
    }
  }, "Yuk, Bikin Map Versi Kamu!"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'rgba(255,255,255,.92)',
      fontSize: '0.95rem',
      maxWidth: 440
    }
  }, "Cerita kebutuhanmu, kami buatkan penawaran terbaik \u2014 gratis, tanpa komitmen, langsung dari pabriknya."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    color: "wa",
    size: "lg"
  }, /*#__PURE__*/React.createElement(window.WaGlyph2, null), " Chat WhatsApp Sekarang"), /*#__PURE__*/React.createElement(Button, {
    color: "purple",
    size: "lg",
    href: "produk-custom.html#simulator"
  }, "\uD83C\uDFA8 Main ke Simulator Rapor"))));
}
Object.assign(window, {
  ProdukTeaserV2,
  SekolahV2,
  CaraPesanV2,
  TestimoniV2,
  FAQV2,
  CTAV2
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website_v2/BerandaSections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website_v2/HeroMap.jsx
try { (() => {
// Website v2 — giant interactive Map Kancing hero.
// Colorful documents slide INTO the folder; replays on hover / click.
const DS2h = window.AgathaFelixDesignSystem_3557c1;
const HERO_DOCS = [{
  label: 'Rapor SD Ceria',
  bar: 'var(--af-purple)',
  rot: -10,
  x: -130,
  y: -210
}, {
  label: 'Sertifikat Les Piano',
  bar: 'var(--af-green)',
  rot: 6,
  x: 30,
  y: -250
}, {
  label: 'Akta Notaris',
  bar: 'var(--af-blue)',
  rot: 14,
  x: 160,
  y: -190
}];
function DocSheet({
  doc,
  stage,
  index
}) {
  // stage: 'out' → floating above; 'in' → tucked inside the folder
  const isIn = stage === 'in';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '52%',
      width: 150,
      height: 190,
      marginLeft: -75,
      background: '#fff',
      border: '2px solid var(--af-ink)',
      borderRadius: 12,
      boxShadow: 'var(--shadow-sticker)',
      padding: 12,
      boxSizing: 'border-box',
      transform: isIn ? `translate(${doc.x * 0.18}px, 26px) rotate(${doc.rot * 0.25}deg) scale(.92)` : `translate(${doc.x}px, ${doc.y}px) rotate(${doc.rot}deg)`,
      transition: `transform 900ms ${260 * index}ms var(--ease-pop)`,
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 14,
      borderRadius: 6,
      background: doc.bar,
      marginBottom: 10
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 7,
      borderRadius: 4,
      background: 'var(--af-line)',
      marginBottom: 6,
      width: '85%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 7,
      borderRadius: 4,
      background: 'var(--af-line)',
      marginBottom: 6
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 7,
      borderRadius: 4,
      background: 'var(--af-line)',
      marginBottom: 12,
      width: '60%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 11,
      color: 'var(--af-ink)',
      lineHeight: 1.25
    }
  }, doc.label));
}
function GiantMap() {
  const [stage, setStage] = React.useState('out');
  const timer = React.useRef(null);
  const play = React.useCallback(() => {
    setStage('out');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStage('in'), 700);
  }, []);
  React.useEffect(() => {
    timer.current = setTimeout(() => setStage('in'), 1100);
    return () => clearTimeout(timer.current);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: play,
    onClick: play,
    role: "img",
    "aria-label": "Dokumen warna-warni masuk ke dalam map kancing raksasa Agatha Felix",
    style: {
      position: 'relative',
      height: 560,
      cursor: 'pointer',
      userSelect: 'none'
    }
  }, HERO_DOCS.map((d, i) => /*#__PURE__*/React.createElement(DocSheet, {
    key: d.label,
    doc: d,
    stage: stage,
    index: i
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '46%',
      width: 340,
      height: 250,
      marginLeft: -170,
      background: 'var(--af-orange-deep)',
      border: '2px solid var(--af-ink)',
      borderRadius: '18px 18px 0 0',
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '54%',
      width: 360,
      height: 230,
      marginLeft: -180,
      background: 'var(--af-orange)',
      border: '2px solid var(--af-ink)',
      borderRadius: '14px 14px 22px 22px',
      zIndex: 3,
      boxShadow: '0 8px 0 rgba(43,42,40,.18)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      transform: 'rotate(-1.2deg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -34,
      left: '50%',
      marginLeft: -80,
      width: 160,
      height: 56,
      background: 'var(--af-orange)',
      border: '2px solid var(--af-ink)',
      borderRadius: '16px 16px 0 0',
      borderBottom: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: '50%',
      background: 'var(--af-yellow)',
      border: '2px solid var(--af-ink)',
      boxShadow: 'inset 0 -3px 0 rgba(43,42,40,.25)',
      transform: stage === 'in' ? 'scale(1)' : 'scale(.78)',
      transition: 'transform 300ms var(--ease-pop) 1600ms'
    }
  })), /*#__PURE__*/React.createElement("img", {
    src: "/assets/logo-mark-white.png",
    alt: "",
    style: {
      height: 64
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      color: '#fff',
      fontSize: 18,
      letterSpacing: '0.04em'
    }
  }, "MAP KANCING \xB7 A4"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 11,
      color: 'var(--af-orange)',
      background: '#fff',
      border: '2px solid var(--af-ink)',
      borderRadius: 999,
      padding: '4px 12px',
      opacity: stage === 'in' ? 1 : 0,
      transform: stage === 'in' ? 'translateY(0)' : 'translateY(8px)',
      transition: 'all 350ms var(--ease-pop) 1800ms'
    }
  }, "Aman tersimpan! \u2713")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 4,
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap'
    }
  }, "\u2728 sentuh map-nya untuk ulang"));
}
function HeroV2() {
  const {
    Button,
    Badge
  } = DS2h;
  return /*#__PURE__*/React.createElement("section", {
    id: "hero",
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--af-blue-tint)'
    }
  }, /*#__PURE__*/React.createElement(window.ConfettiV2, null), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
      padding: '64px var(--container-pad) 24px',
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 32,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    color: "orange",
    dot: true
  }, "Halo! Kami Pabrik Map \uD83C\uDFED"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-3xl)'
    }
  }, "Dokumen ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--af-purple)'
    }
  }, "Penting"), ", Masuk Map yang ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--af-orange)'
    }
  }, "Keren!")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-md)',
      maxWidth: 500
    }
  }, "Dari rapor TK sampai akta notaris \u2014 Agatha Felix membuat map plastik & rapor custom langsung dari pabrik.", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-heading)'
    }
  }, " Warna-warni boleh, harga tetap ramah.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    color: "wa",
    size: "lg"
  }, /*#__PURE__*/React.createElement(window.WaGlyph2, null), " Minta Penawaran Gratis"), /*#__PURE__*/React.createElement(Button, {
    color: "purple",
    size: "lg",
    href: "produk-custom.html#simulator"
  }, "\uD83C\uDFA8 Coba Simulator Rapor")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      flexWrap: 'wrap',
      marginTop: 4
    }
  }, [['20 juta+', 'map sudah kami buat'], ['500+', 'sekolah & kantor'], ['30 pcs', 'minimal pesan rapor']].map(([v, l]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: '1.45rem',
      color: 'var(--text-heading)'
    }
  }, v), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      color: 'var(--text-muted)',
      fontWeight: 600
    }
  }, l))))), /*#__PURE__*/React.createElement(GiantMap, null)), /*#__PURE__*/React.createElement(window.Wave, {
    fill: "var(--af-paper)"
  }));
}
Object.assign(window, {
  HeroV2,
  GiantMap
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website_v2/HeroMap.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website_v2/Portfolio.jsx
try { (() => {
// Website v2 — real custom-work portfolio + factory proof band.
const DS2pf = window.AgathaFelixDesignSystem_3557c1;
const PF = '/assets/portfolio/';
const PORTFOLIO = [{
  img: PF + 'rapor-penabur-jahit-1.png',
  client: 'SMPK Penabur Bintaro Jaya',
  teknik: 'Rapor Jahit',
  seg: 'Sekolah',
  color: 'purple'
}, {
  img: PF + 'rapor-penabur-jahit-2.png',
  client: 'SMAK 6 Penabur Jakarta',
  teknik: 'Rapor Jahit · Foil Emas',
  seg: 'Sekolah',
  color: 'purple'
}, {
  img: PF + 'rapor-penabur-cordura.png',
  client: 'SMPK Penabur Kota Modern',
  teknik: 'Map Cordura',
  seg: 'Sekolah',
  color: 'green'
}, {
  img: PF + 'rapor-press-evergreen.png',
  client: 'SMP Evergreen Education',
  teknik: 'Map Press · Foil Emas',
  seg: 'Sekolah',
  color: 'orange'
}, {
  img: PF + 'rapor-press-bekasi.png',
  client: 'SMP Negeri 5 Kota Bekasi',
  teknik: 'Map Press',
  seg: 'Sekolah',
  color: 'orange'
}, {
  img: PF + 'zipperbag-robotics.png',
  client: 'Robotics Education Center',
  teknik: 'Zipper Bag + Tali',
  seg: 'Tempat Les',
  color: 'orange'
}, {
  img: PF + 'clearholder-symphonia.png',
  client: 'Symphonia · Summarecon Serpong',
  teknik: 'Clear Holder Custom',
  seg: 'Developer',
  color: 'blue'
}, {
  img: PF + 'clearholder-permata.png',
  client: 'PermataBank KPR',
  teknik: 'Clear Holder Custom',
  seg: 'Korporat',
  color: 'blue'
}];
function PortfolioCard({
  p,
  rot
}) {
  return /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0,
      background: '#fff',
      border: '2px solid var(--af-ink)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 5px 0 var(--af-ink)',
      overflow: 'hidden',
      transform: `rotate(${rot}deg)`,
      transition: 'transform 220ms var(--ease-pop)',
      display: 'flex',
      flexDirection: 'column'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'rotate(0deg) translateY(-5px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = `rotate(${rot}deg)`;
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#f4ede1',
      borderBottom: '2px solid var(--af-ink)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.img,
    alt: 'Map custom ' + p.client,
    style: {
      width: '100%',
      height: 230,
      objectFit: 'cover',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 10,
      left: 10,
      background: `var(--af-${p.color})`,
      color: '#fff',
      border: '2px solid var(--af-ink)',
      borderRadius: 999,
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 10,
      padding: '3px 10px'
    }
  }, p.seg)), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      padding: '13px 16px 15px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: '1rem',
      color: 'var(--text-heading)',
      lineHeight: 1.25
    }
  }, p.client), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      marginTop: 7,
      alignItems: 'center',
      gap: 6,
      fontSize: '0.72rem',
      fontWeight: 600,
      color: `var(--af-${p.color}-deep)`,
      background: `var(--af-${p.color}-tint)`,
      border: `1.5px solid var(--af-${p.color}-soft)`,
      padding: '3px 11px',
      borderRadius: 999
    }
  }, p.teknik)));
}
function PortfolioCustom() {
  const {
    Badge,
    SectionHeader
  } = DS2pf;
  const rots = [-1.5, 1, -0.8, 1.4, -1.2, 0.9, -1, 1.3];
  return /*#__PURE__*/React.createElement("section", {
    id: "karya",
    style: {
      background: 'var(--af-paper)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(window.ConfettiV2, null), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
      padding: '72px var(--container-pad)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "Karya Kami",
    eyebrowColor: "purple",
    title: "Sudah Dipercaya Sekolah & Brand Besar",
    highlight: "Dipercaya",
    highlightColor: "purple",
    description: "Dari rapor sekolah jahit & press sampai map korporat berlogo \u2014 ini sebagian yang sudah kami produksi."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 20
    }
  }, PORTFOLIO.map((p, i) => /*#__PURE__*/React.createElement(PortfolioCard, {
    key: p.client,
    p: p,
    rot: rots[i % rots.length]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 12,
      flexWrap: 'wrap',
      marginTop: 32
    }
  }, ['Jahit', 'Press', 'Cordura', 'Clear Holder Custom', 'Zipper Bag'].map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      fontSize: '0.78rem',
      fontWeight: 700,
      color: 'var(--text-body)',
      background: '#fff',
      border: '2px solid var(--af-ink)',
      borderRadius: 999,
      padding: '7px 16px',
      boxShadow: '0 3px 0 var(--af-ink)'
    }
  }, ['🪡', '🔥', '🧵', '🎨', '👜'][i], " ", t)))));
}

// --- Factory proof band --------------------------------------------------
const FACT = '/assets/factory/';
const FACTORY = [{
  img: FACT + 'factory-floor.png',
  cap: 'Lantai produksi'
}, {
  img: FACT + 'factory-press.png',
  cap: 'Mesin press foil'
}, {
  img: FACT + 'factory-forklift.png',
  cap: 'Gudang & ekspedisi'
}];
function FactoryBand() {
  const {
    Badge,
    Button
  } = DS2pf;
  return /*#__PURE__*/React.createElement("section", {
    id: "pabrik",
    style: {
      background: 'var(--af-ink)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(window.Wave, {
    fill: "var(--af-paper)",
    flip: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
      padding: '72px var(--container-pad)',
      display: 'grid',
      gridTemplateColumns: '1fr 1.3fr',
      gap: 44,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    color: "yellow",
    dot: true
  }, "\uD83C\uDFED Bukan Reseller"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-xl)',
      color: '#fff'
    }
  }, "Semua Dibuat di ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--af-yellow)'
    }
  }, "Pabrik Kami Sendiri")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '0.95rem',
      color: 'rgba(255,255,255,.82)',
      maxWidth: 420
    }
  }, "Press, jahit, sablon, sampai packing \u2014 semua satu atap. Itu kenapa harga kami harga pabrik, dan kualitasnya kami pegang dari awal sampai akhir."), /*#__PURE__*/React.createElement(Button, {
    color: "wa",
    size: "lg"
  }, /*#__PURE__*/React.createElement(window.WaGlyph2, null), " Tanya Kapasitas Produksi")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 14
    }
  }, FACTORY.map((f, i) => /*#__PURE__*/React.createElement("figure", {
    key: f.cap,
    style: {
      margin: 0,
      transform: `rotate(${(i - 1) * 1.5}deg)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '2px solid rgba(255,255,255,.3)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      boxShadow: '0 5px 0 rgba(0,0,0,.4)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: f.img,
    alt: f.cap,
    style: {
      width: '100%',
      height: 200,
      objectFit: 'cover',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      color: 'rgba(255,255,255,.7)',
      fontSize: '0.74rem',
      fontWeight: 600,
      textAlign: 'center',
      marginTop: 8
    }
  }, f.cap))))), /*#__PURE__*/React.createElement(window.Wave, {
    fill: "var(--af-paper)"
  }));
}
Object.assign(window, {
  PortfolioCustom,
  FactoryBand
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website_v2/Portfolio.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website_v2/ProdukCustomSections.jsx
try { (() => {
// Website v2 — Produk Custom page (school pitch, simulator, professionals, process).
const DS2c = window.AgathaFelixDesignSystem_3557c1;
const wrapPC = (extra = {}) => ({
  maxWidth: 'var(--container-max)',
  margin: '0 auto',
  position: 'relative',
  zIndex: 1,
  padding: '72px var(--container-pad)',
  ...extra
});
function ProdukCustomPage() {
  const {
    Badge,
    Button,
    Step,
    Chip
  } = DS2c;
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "Produk Custom"
  }, /*#__PURE__*/React.createElement(window.HeaderV2, {
    active: "produk-custom.html"
  }), /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--af-orange-tint)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(window.ConfettiV2, null), /*#__PURE__*/React.createElement("div", {
    style: wrapPC({
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      paddingBottom: 40
    })
  }, /*#__PURE__*/React.createElement(Badge, {
    color: "orange",
    dot: true
  }, "\u270F\uFE0F Custom Order"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-2xl)',
      maxWidth: 700
    }
  }, "Logo Kamu, Warna Kamu, ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--af-orange)'
    }
  }, "Map Kamu!")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-md)',
      maxWidth: 540
    }
  }, "Rapor sekolah, map les, sampai file kantor notaris \u2014 kami cetak sesuai identitasmu. Desain dibantu gratis, mulai dari 30 pcs."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    color: "purple"
  }, "Sekolah & TK"), /*#__PURE__*/React.createElement(Chip, {
    color: "green"
  }, "Bimbel & Les"), /*#__PURE__*/React.createElement(Chip, {
    color: "blue"
  }, "Universitas"), /*#__PURE__*/React.createElement(Chip, {
    color: "orange"
  }, "Notaris \xB7 Lawyer \xB7 Korporat"))), /*#__PURE__*/React.createElement(window.Wave, {
    fill: "var(--af-yellow-tint)"
  })), /*#__PURE__*/React.createElement(window.SimulatorRapor, null), /*#__PURE__*/React.createElement(window.PortfolioCustom, null), /*#__PURE__*/React.createElement("section", {
    id: "profesional",
    style: {
      background: 'var(--af-ink)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(window.Wave, {
    fill: "var(--af-paper)",
    flip: true
  }), /*#__PURE__*/React.createElement("div", {
    style: wrapPC({
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      alignItems: 'center'
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '2px solid rgba(255,255,255,.25)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      transform: 'rotate(-1.2deg)',
      boxShadow: '0 8px 0 rgba(0,0,0,.35)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/document-keeper-green.png",
    alt: "Document Keeper Executive Agatha Felix dengan foil emas",
    style: {
      width: '100%',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    color: "yellow",
    dot: true
  }, "Untuk yang Serius-Serius"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-xl)',
      color: '#fff'
    }
  }, "Notaris, Lawyer, Kantor \u2014 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--af-yellow)'
    }
  }, "Kami Juga Bisa Kalem")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '0.95rem',
      color: 'rgba(255,255,255,.85)',
      maxWidth: 440
    }
  }, "Di balik warna-warni kami, ada lini executive: document keeper kulit sintetis dengan", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#fff'
    }
  }, " emboss foil emas nama firma Anda"), ". Akta, kontrak, dan sertifikat klien tersimpan rapi \u2014 dan terlihat semahal isinya."), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontSize: '0.88rem',
      color: 'rgba(255,255,255,.85)'
    }
  }, ['Foil emas / perak nama & logo firma', 'Pilihan warna formal: hijau, hitam, maroon, navy', 'Kapasitas 20–100 dokumen', 'MOQ mulai 100 pcs'].map(t => /*#__PURE__*/React.createElement("li", {
    key: t,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: 'var(--af-yellow)',
      color: 'var(--af-ink)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 11,
      fontWeight: 800,
      flexShrink: 0
    }
  }, "\u2713"), t))), /*#__PURE__*/React.createElement(Button, {
    color: "wa",
    size: "lg"
  }, /*#__PURE__*/React.createElement(window.WaGlyph2, null), " Konsultasi Lini Executive"))), /*#__PURE__*/React.createElement(window.Wave, {
    fill: "var(--af-paper)"
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--af-paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wrapPC()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      maxWidth: 620,
      margin: '0 auto 44px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    color: "blue"
  }, "Dari Chat Sampai Paket Datang"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-xl)'
    }
  }, "Prosesnya Begini")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Step, {
    num: 1,
    title: "Cerita & Brief",
    color: "orange"
  }, "Chat WA: produk, jumlah, logo, warna kesukaan. Atau bawa hasil simulatormu!"), /*#__PURE__*/React.createElement(Step, {
    num: 2,
    title: "Mockup Gratis",
    color: "green"
  }, "Tim desain buatkan pratinjau. Revisi sampai kamu bilang oke."), /*#__PURE__*/React.createElement(Step, {
    num: 3,
    title: "Produksi",
    color: "purple"
  }, "DP masuk, mesin jalan. 5\u201314 hari kerja di pabrik kami sendiri."), /*#__PURE__*/React.createElement(Step, {
    num: 4,
    title: "Kirim!",
    color: "blue"
  }, "Paket meluncur ke seluruh Indonesia. Foto produk dikirim sebelum ekspedisi.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--af-purple)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(window.ConfettiV2, null), /*#__PURE__*/React.createElement("div", {
    style: wrapPC({
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    })
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/logo-mark-white.png",
    alt: "",
    style: {
      height: 56
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-xl)',
      color: '#fff',
      maxWidth: 560
    }
  }, "Siap Bikin yang Versi Kamu?"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'rgba(255,255,255,.9)',
      fontSize: '0.95rem',
      maxWidth: 440
    }
  }, "Kirim logo dan ceritamu \u2014 penawaran & mockup gratis, tanpa komitmen."), /*#__PURE__*/React.createElement(Button, {
    color: "wa",
    size: "lg"
  }, /*#__PURE__*/React.createElement(window.WaGlyph2, null), " Mulai dari WhatsApp")))), /*#__PURE__*/React.createElement(window.FooterV2, null), /*#__PURE__*/React.createElement(window.FloatingWAV2, null));
}
Object.assign(window, {
  ProdukCustomPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website_v2/ProdukCustomSections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website_v2/ProdukStandarSections.jsx
try { (() => {
// Website v2 — Produk Standar: playful catalogue with audience filter.
const DS2p = window.AgathaFelixDesignSystem_3557c1;
const wrapPS = (extra = {}) => ({
  maxWidth: 'var(--container-max)',
  margin: '0 auto',
  position: 'relative',
  zIndex: 1,
  padding: '72px var(--container-pad)',
  ...extra
});
const IMG = '/assets/products/';
const KATALOG = [{
  name: 'Business File',
  desc: 'Map kancing bahan PP tebal — klik, simpan, bawa. Banyak warna ceria, bisa cetak logo.',
  color: 'orange',
  aud: ['sekolah', 'kantor'],
  badge: 'Favorit',
  img: IMG + 'business-file.png'
}, {
  name: 'Clear Holder A4',
  desc: 'Buku display isi 20–80 kantong bening. Dokumen tersusun rapi, gampang dibolak-balik.',
  color: 'blue',
  aud: ['kantor', 'sekolah'],
  badge: 'A4 Populer',
  img: IMG + 'clear-holder.png'
}, {
  name: 'Map L / Clear Sleeves',
  desc: 'Lembar L transparan tipis — aman & gampang dipakai. Warna-warni buat ngelompokin tugas.',
  color: 'green',
  aud: ['sekolah', 'kantor'],
  badge: null,
  img: IMG + 'map-l.png'
}, {
  name: 'Map Executive',
  desc: 'Document keeper premium: jahitan rapi, poly emas, slot name card. Buat yang serius.',
  color: 'purple',
  aud: ['premium', 'kantor'],
  badge: 'Premium',
  img: IMG + 'map-executive.png'
}, {
  name: 'Carry File Kancing',
  desc: 'File PP dengan kancing kuat & handle. Dokumen aman dibawa ke mana-mana.',
  color: 'blue',
  aud: ['kantor', 'sekolah'],
  badge: null,
  img: IMG + 'carry-file-kancing.png'
}, {
  name: 'Carry File Capslock',
  desc: 'Caps lock kokoh plus handle bag. Gampang dipakai, dokumen nggak tumpah.',
  color: 'orange',
  aud: ['kantor'],
  badge: 'Best Seller',
  img: IMG + 'carry-file-capslock.png'
}, {
  name: 'Expanding File',
  desc: 'Map akordion bersekat banyak, tali elastis, tebal & awet. Arsip rapi per kategori.',
  color: 'green',
  aud: ['kantor', 'sekolah'],
  badge: null,
  img: IMG + 'expanding-file.png'
}, {
  name: 'Zipper Bag + Nametag',
  desc: 'Tas resleting jaring dengan slot name card & handle. Bawa berkas plus alat tulis.',
  color: 'purple',
  aud: ['sekolah', 'kantor'],
  badge: null,
  img: IMG + 'zipper-kancing.png'
}, {
  name: 'Zipper Bag Setengah Jaring',
  desc: 'Resleting setengah jaring, isi kelihatan separuh. Ringan dengan warna ceria.',
  color: 'orange',
  aud: ['sekolah'],
  badge: null,
  img: IMG + 'zipper-jaring.png'
}];
const FILTERS = [['semua', 'Semua 🗂️'], ['sekolah', 'Buat Sekolah 🎒'], ['kantor', 'Buat Kantor 💼'], ['premium', 'Premium ✨']];
const PS_ICONS = {
  blue: ['M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z', 'M8 10h8', 'M8 14h5'],
  green: ['M14 3v4a1 1 0 0 0 1 1h4', 'M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z'],
  orange: ['M2 7a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z', 'M12 11v4', 'M12 11a1.5 1.5 0 1 0 0-.01'],
  purple: ['M2 7a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z', 'M7 13h10']
};
function KatalogCard({
  p
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '2px solid var(--af-ink)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 5px 0 var(--af-ink)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 220ms var(--ease-pop)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-5px) rotate(-.6deg)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'none';
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 150,
      background: '#f4ede1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      borderBottom: '2px solid var(--af-ink)',
      position: 'relative'
    }
  }, p.img ? /*#__PURE__*/React.createElement("img", {
    src: p.img,
    alt: p.name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : null, p.badge ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 8,
      right: 8,
      background: 'var(--af-yellow)',
      border: '2px solid var(--af-ink)',
      borderRadius: 999,
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 10,
      padding: '2px 9px',
      color: 'var(--af-ink)'
    }
  }, p.badge) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px 16px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.1rem'
    }
  }, p.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '0.8rem',
      lineHeight: 1.55,
      color: 'var(--text-body)',
      flex: 1
    }
  }, p.desc), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: '0.72rem',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: `var(--af-${p.color})`,
      flexShrink: 0
    }
  }), "Chat untuk ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: `var(--af-${p.color}-deep)`
    }
  }, "harga grosir"))));
}
function ProdukStandarPage() {
  const {
    Badge,
    Button,
    SectionHeader
  } = DS2p;
  const [filter, setFilter] = React.useState('semua');
  const shown = KATALOG.filter(p => filter === 'semua' || p.aud.includes(filter));
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "Produk Standar"
  }, /*#__PURE__*/React.createElement(window.HeaderV2, {
    active: "produk-standar.html"
  }), /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--af-green-tint)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(window.ConfettiV2, null), /*#__PURE__*/React.createElement("div", {
    style: wrapPS({
      paddingBottom: 28,
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    })
  }, /*#__PURE__*/React.createElement(Badge, {
    color: "green",
    dot: true
  }, "Siap Kirim Hari Ini"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-2xl)',
      maxWidth: 640
    }
  }, "Katalog Map ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--af-green)'
    }
  }, "Siap Pakai")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-md)',
      maxWidth: 520
    }
  }, "Tanpa minimum desain, tanpa nunggu produksi \u2014 pilih, pesan, kirim. Beli per lusin atau grosir."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: 8
    }
  }, FILTERS.map(([key, label]) => {
    const isOn = filter === key;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      onClick: () => setFilter(key),
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: '0.88rem',
        cursor: 'pointer',
        background: isOn ? 'var(--af-green)' : '#fff',
        color: isOn ? '#fff' : 'var(--af-ink)',
        border: '2px solid var(--af-ink)',
        borderRadius: 999,
        padding: '9px 20px',
        boxShadow: isOn ? '0 3px 0 var(--af-ink)' : 'none',
        transition: 'all 160ms var(--ease-pop)'
      }
    }, label);
  }))), /*#__PURE__*/React.createElement(window.Wave, {
    fill: "var(--af-paper)"
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--af-paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wrapPS({
      paddingTop: 36
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 18
    }
  }, shown.map(p => /*#__PURE__*/React.createElement(KatalogCard, {
    key: p.name,
    p: p
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontSize: '0.82rem',
      color: 'var(--text-muted)',
      marginTop: 28
    }
  }, "Harga menyusul setelah konfirmasi jumlah \u2014 chat kami untuk daftar harga grosir terbaru \uD83D\uDC47"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    color: "wa",
    size: "lg"
  }, /*#__PURE__*/React.createElement(window.WaGlyph2, null), " Tanya Katalog & Harga")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--af-blue-tint)'
    }
  }, /*#__PURE__*/React.createElement(window.Wave, {
    fill: "var(--af-paper)",
    flip: true
  }), /*#__PURE__*/React.createElement("div", {
    style: wrapPS({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      flexWrap: 'wrap',
      paddingTop: 40,
      paddingBottom: 56
    })
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-lg)'
    }
  }, "Butuh yang ada logo-nya?"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: '0.9rem'
    }
  }, "Semua produk di atas bisa dicetak custom dengan logo & warna institusimu.")), /*#__PURE__*/React.createElement(Button, {
    color: "purple",
    size: "lg",
    href: "produk-custom.html"
  }, "Lihat Custom & Rapor \u2192")))), /*#__PURE__*/React.createElement(window.FooterV2, null), /*#__PURE__*/React.createElement(window.FloatingWAV2, null));
}
Object.assign(window, {
  ProdukStandarPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website_v2/ProdukStandarSections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website_v2/Shell.jsx
try { (() => {
// Website v2 — shared shell: header, footer, floating WA, decorations.
const DS2 = window.AgathaFelixDesignSystem_3557c1;

// --- Responsive layer (inline-styled components → overridden via !important) ---
(function injectV2Responsive() {
  if (typeof document === 'undefined' || document.getElementById('af-v2-responsive')) return;
  const css = `
  /* Tablet & below: collapse 2-col text/feature sections + 4-col grids */
  @media (max-width: 900px) {
    [style*="grid-template-columns: 1.1fr 1fr"],
    [style*="grid-template-columns: 1.2fr 1fr"],
    [style*="grid-template-columns: 1fr 1.1fr"],
    [style*="grid-template-columns: 1fr 1.3fr"],
    [style*="grid-template-columns: 1fr 1.4fr"],
    [style*="grid-template-columns: 1fr 1fr"] {
      grid-template-columns: 1fr !important;
      gap: 28px !important;
    }
    [style*="grid-template-columns: repeat(4, 1fr)"] {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    /* Center hero / simulator text when stacked */
    #hero > div > div:first-child,
    #simulator [style*="flex-direction: column"] { align-items: flex-start; }
    /* Rapor cover stack is decorative + fixed-positioned → scale to fit */
    #sekolah [style*="height: 320px"] { transform: scale(.82); transform-origin: top left; }
    /* Factory photos: even 3-up strip, no squashing */
    #pabrik [style*="grid-template-columns: repeat(3, 1fr)"] { gap: 12px !important; }
    #pabrik figure img { height: 150px !important; }
  }
  /* Phone: single column everywhere, tighter rhythm */
  @media (max-width: 680px) {
    [style*="grid-template-columns: repeat(4, 1fr)"],
    [style*="grid-template-columns: repeat(3, 1fr)"] {
      grid-template-columns: 1fr 1fr !important;
    }
    [style*="grid-template-columns: 1.4fr 1fr 1fr 1.2fr"] {
      grid-template-columns: 1fr 1fr !important;
      gap: 24px !important;
    }
    /* section vertical padding eased */
    main section > div { padding-top: 48px !important; padding-bottom: 48px !important; }
    /* Factory photos: full-width stacked, BIG & clear on phones */
    #pabrik [style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; gap: 18px !important; }
    #pabrik figure { transform: none !important; }
    #pabrik figure img { height: 300px !important; }
    /* swap desktop nav + CTA for the hamburger */
    header nav[aria-label="Navigasi"] { display: none !important; }
    header .af-desktop-cta { display: none !important; }
    header .af-burger { display: flex !important; }
    /* giant hero map shrinks so it never clips */
    #hero [role="img"] { transform: scale(.8); transform-origin: top center; height: 460px !important; }
  }
  @media (max-width: 460px) {
    [style*="grid-template-columns: repeat(4, 1fr)"],
    [style*="grid-template-columns: repeat(3, 1fr)"],
    [style*="grid-template-columns: 1.4fr 1fr 1fr 1.2fr"] {
      grid-template-columns: 1fr !important;
    }
  }`;
  const tag = document.createElement('style');
  tag.id = 'af-v2-responsive';
  tag.textContent = css;
  document.head.appendChild(tag);
})();
const WaGlyph2 = ({
  size = 18
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "currentColor",
  style: {
    width: size,
    height: size,
    flexShrink: 0
  }
}, /*#__PURE__*/React.createElement("path", {
  d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
}));
const V2_LINKS = [['index.html', 'Beranda'], ['produk-standar.html', 'Produk Standar'], ['produk-custom.html', 'Custom & Rapor']];
function HeaderV2({
  active
}) {
  const {
    Button
  } = DS2;
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255,248,238,.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '2px solid var(--af-ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      height: 72,
      padding: '0 var(--container-pad)',
      display: 'flex',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "index.html",
    style: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/logo-agatha-felix.png",
    alt: "Agatha Felix",
    style: {
      height: 48
    }
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginLeft: 'auto'
    },
    "aria-label": "Navigasi"
  }, V2_LINKS.map(([href, label]) => {
    const isActive = href === active;
    return /*#__PURE__*/React.createElement("a", {
      key: href,
      href: href,
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: '0.95rem',
        fontWeight: 700,
        textDecoration: 'none',
        color: isActive ? '#fff' : 'var(--af-ink)',
        background: isActive ? 'var(--af-orange)' : 'transparent',
        border: '2px solid ' + (isActive ? 'var(--af-ink)' : 'transparent'),
        boxShadow: isActive ? 'var(--shadow-sticker)' : 'none',
        padding: '7px 16px',
        borderRadius: 'var(--radius-pill)',
        whiteSpace: 'nowrap'
      }
    }, label);
  })), /*#__PURE__*/React.createElement("div", {
    className: "af-desktop-cta",
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    color: "wa",
    size: "sm"
  }, /*#__PURE__*/React.createElement(WaGlyph2, {
    size: 15
  }), " Chat Kami")), /*#__PURE__*/React.createElement("button", {
    className: "af-burger",
    "aria-label": open ? 'Tutup menu' : 'Buka menu',
    "aria-expanded": open,
    onClick: () => setOpen(v => !v),
    style: {
      display: 'none',
      marginLeft: 'auto',
      width: 46,
      height: 46,
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      background: open ? 'var(--af-orange)' : '#fff',
      color: open ? '#fff' : 'var(--af-ink)',
      border: '2px solid var(--af-ink)',
      borderRadius: 'var(--radius-sm)',
      boxShadow: '0 3px 0 var(--af-ink)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    style: {
      width: 24,
      height: 24
    }
  }, open ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 6L6 18"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M3 6h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 12h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 18h18"
  }))))), open ? /*#__PURE__*/React.createElement("div", {
    className: "af-mobile-menu",
    style: {
      borderTop: '2px solid var(--af-ink)',
      background: 'var(--af-paper)',
      padding: '16px var(--container-pad) 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, V2_LINKS.map(([href, label]) => {
    const isActive = href === active;
    return /*#__PURE__*/React.createElement("a", {
      key: href,
      href: href,
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: '1.1rem',
        fontWeight: 800,
        textDecoration: 'none',
        color: isActive ? '#fff' : 'var(--af-ink)',
        background: isActive ? 'var(--af-orange)' : '#fff',
        border: '2px solid var(--af-ink)',
        boxShadow: '0 3px 0 var(--af-ink)',
        padding: '13px 18px',
        borderRadius: 'var(--radius-md)'
      }
    }, label);
  }), /*#__PURE__*/React.createElement(Button, {
    color: "wa",
    size: "lg",
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(WaGlyph2, {
    size: 17
  }), " Chat Kami via WhatsApp")) : null);
}

// Wavy section divider — flips with `flip`, colored by `fill`.
function Wave({
  fill = 'var(--af-paper)',
  flip = false
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 1440 56",
    preserveAspectRatio: "none",
    "aria-hidden": "true",
    style: {
      display: 'block',
      width: '100%',
      height: 44,
      transform: flip ? 'scaleY(-1)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0,28 C120,52 240,4 360,22 C480,40 600,52 720,34 C840,16 960,8 1080,24 C1200,40 1320,48 1440,26 L1440,56 L0,56 Z",
    fill: fill
  }));
}
function ConfettiV2({
  density = 1,
  style
}) {
  const dots = [['var(--af-orange)', 12, '6%', '8%', 0], ['var(--af-green)', 9, '14%', '82%', 12], ['var(--af-yellow)', 14, '74%', '4%', -8], ['var(--af-purple)', 10, '60%', '92%', 20], ['var(--af-blue)', 11, '86%', '60%', 0], ['var(--af-orange)', 8, '40%', '95%', 0]].slice(0, Math.round(6 * density));
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 0,
      ...style
    }
  }, dots.map(([c, s, top, left, rot], i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: 'absolute',
      top,
      left,
      width: s,
      height: s,
      borderRadius: i % 2 === 0 ? '50%' : 4,
      background: c,
      opacity: 0.6,
      transform: `rotate(${rot}deg)`
    }
  })));
}

// Scrolling marquee strip of product names.
function MarqueeV2() {
  const items = ['MAP KANCING', 'CLEAR HOLDER', 'RAPOR CUSTOM', 'MAP L', 'BUSINESS FILE', 'MAP EXECUTIVE'];
  const colors = ['var(--af-orange)', 'var(--af-green)', 'var(--af-yellow)', 'var(--af-purple)', 'var(--af-blue)', '#fff'];
  const run = [...items, ...items, ...items];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--af-ink)',
      overflow: 'hidden',
      padding: '13px 0',
      borderTop: '2px solid var(--af-ink)',
      borderBottom: '2px solid var(--af-ink)'
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes af-marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
      @media (prefers-reduced-motion: reduce) { .af-marquee-track { animation: none !important; } }`), /*#__PURE__*/React.createElement("div", {
    className: "af-marquee-track",
    style: {
      display: 'flex',
      gap: 38,
      width: 'max-content',
      animation: 'af-marquee 24s linear infinite'
    }
  }, run.map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 38,
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: '0.95rem',
      letterSpacing: '0.06em',
      color: colors[i % colors.length],
      whiteSpace: 'nowrap'
    }
  }, t, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: colors[(i + 1) % colors.length]
    }
  })))));
}
function FloatingWAV2() {
  return /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/6282219472613",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "Chat WhatsApp",
    style: {
      position: 'fixed',
      right: 22,
      bottom: 22,
      zIndex: 60,
      width: 60,
      height: 60,
      borderRadius: '50%',
      background: 'var(--af-wa)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid var(--af-ink)',
      boxShadow: '0 4px 0 var(--af-ink)'
    }
  }, /*#__PURE__*/React.createElement(WaGlyph2, {
    size: 28
  }));
}
function FooterV2() {
  const link = {
    display: 'block',
    color: 'rgba(255,255,255,.75)',
    fontSize: '0.84rem',
    textDecoration: 'none',
    lineHeight: 2.2
  };
  const head = {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '1rem',
    color: '#fff',
    marginBottom: 12
  };
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--af-ink)',
      color: 'rgba(255,255,255,.75)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '56px var(--container-pad) 28px',
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "/assets/logo-mark-white.png",
    alt: "Agatha Felix",
    style: {
      height: 52,
      marginBottom: 14
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.84rem',
      lineHeight: 1.8,
      margin: 0,
      maxWidth: 260
    }
  }, "Pabrik map plastik yang bikin dokumen penting jadi kelihatan keren. Langsung dari pabrik \u2014 bukan reseller.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: head
  }, "Produk"), /*#__PURE__*/React.createElement("a", {
    href: "produk-standar.html",
    style: link
  }, "Clear Holder"), /*#__PURE__*/React.createElement("a", {
    href: "produk-standar.html",
    style: link
  }, "Map L & Map Kancing"), /*#__PURE__*/React.createElement("a", {
    href: "produk-standar.html",
    style: link
  }, "Map Executive"), /*#__PURE__*/React.createElement("a", {
    href: "produk-custom.html",
    style: link
  }, "Rapor & Map Custom")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: head
  }, "Jelajahi"), /*#__PURE__*/React.createElement("a", {
    href: "index.html",
    style: link
  }, "Beranda"), /*#__PURE__*/React.createElement("a", {
    href: "produk-custom.html#simulator",
    style: link
  }, "Simulator Rapor"), /*#__PURE__*/React.createElement("a", {
    href: "index.html#cara-pesan",
    style: link
  }, "Cara Pesan"), /*#__PURE__*/React.createElement("a", {
    href: "index.html#faq",
    style: link
  }, "FAQ")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: head
  }, "Hubungi Kami"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.84rem',
      lineHeight: 2,
      margin: 0
    }
  }, "WhatsApp: +62 822-1947-2613", /*#__PURE__*/React.createElement("br", null), "Senin\u2013Sabtu, 08.00\u201317.00 WIB", /*#__PURE__*/React.createElement("br", null), "Pengiriman ke seluruh Indonesia"))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,.14)',
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '18px var(--container-pad)',
      fontSize: '0.76rem',
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Agatha Felix Stationery"), /*#__PURE__*/React.createElement("span", null, "Langsung dari Pabrik \u2014 Bukan Reseller \uD83C\uDFED")));
}
Object.assign(window, {
  HeaderV2,
  FooterV2,
  FloatingWAV2,
  WaGlyph2,
  Wave,
  ConfettiV2,
  MarqueeV2
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website_v2/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website_v2/Simulator.jsx
try { (() => {
// Website v2 — Simulator Rapor: pick color + accent + name + logo → live mockup.
const DS2s = window.AgathaFelixDesignSystem_3557c1;
const SIM_COLORS = [['Oranye', 'var(--af-orange)', 'var(--af-orange-deep)'], ['Hijau', 'var(--af-green)', 'var(--af-green-deep)'], ['Ungu', 'var(--af-purple)', 'var(--af-purple-deep)'], ['Biru', 'var(--af-blue)', 'var(--af-blue-deep)'], ['Hitam Elegan', '#2B2A28', '#141413'], ['Hijau Eksekutif', '#1E3B2F', '#10241B']];
const SIM_ACCENTS = [['Kuning', 'var(--af-yellow)'], ['Putih', '#FFFFFF'], ['Emas', '#D4A93C']];
function SimulatorRapor() {
  const {
    Button,
    Input
  } = DS2s;
  const [color, setColor] = React.useState(0);
  const [accent, setAccent] = React.useState(0);
  const [nama, setNama] = React.useState('SD Ceria Nusantara');
  const [logo, setLogo] = React.useState(null);
  const [, base, deep] = SIM_COLORS[color];
  const [, accentColor] = SIM_ACCENTS[accent];
  const onLogo = e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => setLogo(ev.target.result);
    reader.readAsDataURL(f);
  };
  const pesanWA = `Halo Agatha Felix! Saya mau pesan rapor custom: warna ${SIM_COLORS[color][0]}, aksen ${SIM_ACCENTS[accent][0]}, untuk "${nama}".`;
  const swatchStyle = (bg, isOn) => ({
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: bg,
    cursor: 'pointer',
    border: '2px solid var(--af-ink)',
    boxShadow: isOn ? '0 0 0 4px var(--af-yellow)' : '0 3px 0 rgba(43,42,40,.16)',
    transform: isOn ? 'scale(1.1)' : 'none',
    transition: 'all 160ms var(--ease-pop)',
    padding: 0
  });
  return /*#__PURE__*/React.createElement("section", {
    id: "simulator",
    style: {
      background: 'var(--af-yellow-tint)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(window.ConfettiV2, null), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
      padding: '72px var(--container-pad)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      maxWidth: 620,
      margin: '0 auto 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      background: 'var(--af-yellow)',
      border: '2px solid var(--af-ink)',
      color: 'var(--af-ink)',
      fontFamily: 'var(--font-display)',
      fontSize: '0.8rem',
      fontWeight: 800,
      padding: '6px 16px',
      borderRadius: 999
    }
  }, "\uD83C\uDFA8 SIMULATOR RAPOR"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-xl)'
    }
  }, "Coba Desain Rapormu di Sini!"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '0.9rem'
    }
  }, "Pilih warna, tulis nama sekolah, pasang logo \u2014 langsung kelihatan jadinya. Suka? Kirim ke kami lewat WhatsApp.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.1fr',
      gap: 40,
      alignItems: 'center',
      maxWidth: 940,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '2px solid var(--af-ink)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 5px 0 var(--af-ink)',
      padding: 26,
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: '0.95rem',
      color: 'var(--text-heading)',
      marginBottom: 10
    }
  }, "1 \xB7 Warna sampul"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, SIM_COLORS.map(([label, bg], i) => /*#__PURE__*/React.createElement("button", {
    key: label,
    title: label,
    "aria-label": label,
    onClick: () => setColor(i),
    style: swatchStyle(bg, color === i)
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: '0.95rem',
      color: 'var(--text-heading)',
      marginBottom: 10
    }
  }, "2 \xB7 Warna tulisan"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, SIM_ACCENTS.map(([label, bg], i) => /*#__PURE__*/React.createElement("button", {
    key: label,
    title: label,
    "aria-label": label,
    onClick: () => setAccent(i),
    style: swatchStyle(bg, accent === i)
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: '0.95rem',
      color: 'var(--text-heading)',
      marginBottom: 10
    }
  }, "3 \xB7 Nama sekolah / les"), /*#__PURE__*/React.createElement(Input, {
    placeholder: "cth: SD Ceria Nusantara",
    value: nama,
    onChange: e => setNama(e.target.value)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: '0.95rem',
      color: 'var(--text-heading)',
      marginBottom: 10
    }
  }, "4 \xB7 Logo sekolah (opsional)"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      cursor: 'pointer',
      border: '2px dashed var(--af-ink-3)',
      borderRadius: 'var(--radius-sm)',
      padding: '14px 16px',
      fontSize: '0.84rem',
      fontWeight: 600,
      color: 'var(--text-body)',
      background: 'var(--af-paper)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: onLogo,
    style: {
      display: 'none'
    }
  }), logo ? '✓ Logo terpasang — klik untuk ganti' : '⬆ Unggah logo (PNG/JPG)')), /*#__PURE__*/React.createElement(Button, {
    color: "wa",
    size: "lg",
    href: 'https://wa.me/6282219472613?text=' + encodeURIComponent(pesanWA)
  }, /*#__PURE__*/React.createElement(window.WaGlyph2, null), " Pesan Desain Ini via WA")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 300,
      height: 410,
      background: base,
      border: '2px solid var(--af-ink)',
      borderRadius: '14px 22px 22px 14px',
      boxShadow: '0 8px 0 var(--af-ink)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: 28,
      boxSizing: 'border-box',
      transform: 'rotate(1.5deg)',
      transition: 'background 300ms ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 10,
      top: 10,
      bottom: 10,
      width: 5,
      borderRadius: 4,
      background: deep,
      transition: 'background 300ms ease'
    }
  }), logo ? /*#__PURE__*/React.createElement("img", {
    src: logo,
    alt: "Logo sekolah",
    style: {
      width: 84,
      height: 84,
      objectFit: 'contain',
      background: '#fff',
      borderRadius: 14,
      border: '2px solid var(--af-ink)',
      padding: 8,
      boxSizing: 'border-box'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 84,
      height: 84,
      borderRadius: 14,
      border: '2px dashed rgba(255,255,255,.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(255,255,255,.75)',
      fontSize: 11,
      fontWeight: 700,
      textAlign: 'center',
      padding: 6,
      boxSizing: 'border-box'
    }
  }, "LOGO", /*#__PURE__*/React.createElement("br", null), "SEKOLAH"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 26,
      color: accentColor,
      lineHeight: 1.1,
      transition: 'color 300ms ease'
    }
  }, "RAPOR"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 12,
      color: accentColor,
      letterSpacing: '0.14em',
      marginTop: 4,
      transition: 'color 300ms ease'
    }
  }, "LAPORAN HASIL BELAJAR")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 130,
      height: 2,
      background: accentColor,
      opacity: .7,
      transition: 'background 300ms ease'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 16,
      color: accentColor,
      textAlign: 'center',
      lineHeight: 1.3,
      transition: 'color 300ms ease',
      minHeight: 42
    }
  }, nama || 'Nama Sekolahmu'), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 16,
      fontSize: 9,
      fontWeight: 700,
      color: accentColor,
      opacity: .75,
      letterSpacing: '0.1em'
    }
  }, "DIPRODUKSI OLEH AGATHA FELIX"))))), /*#__PURE__*/React.createElement(window.Wave, {
    fill: "var(--af-paper)"
  }));
}
Object.assign(window, {
  SimulatorRapor
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website_v2/Simulator.jsx", error: String((e && e.message) || e) }); }

__ds_ns.FAQItem = __ds_scope.FAQItem;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Step = __ds_scope.Step;

__ds_ns.TestimonialCard = __ds_scope.TestimonialCard;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Textarea = __ds_scope.Textarea;

})();
