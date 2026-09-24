(function(){
const SHEET_CSS_ID="af-sheet";(function(){if(typeof document=="undefined"||document.getElementById(SHEET_CSS_ID))return;const e=document.createElement("style");e.id=SHEET_CSS_ID,e.textContent=`
  .af-sheet-backdrop { position: fixed; inset: 0; z-index: 100; background: rgba(43, 42, 40, .55);
    display: flex; align-items: center; justify-content: center; padding: 32px 24px;
    animation: af-fade 160ms ease-out; }
  .af-sheet { position: relative; width: min(980px, 100%); max-height: calc(100vh - 64px); max-height: calc(100dvh - 64px);
    display: flex; flex-direction: column; background: var(--af-paper); border: 2px solid var(--af-ink);
    border-radius: var(--radius-xl); box-shadow: 0 8px 0 var(--af-ink); overflow: hidden;
    animation: af-pop 220ms var(--ease-pop); }
  .af-sheet-top { display: flex; align-items: center; gap: 8px; padding: 10px 12px 10px 20px;
    border-bottom: 2px solid var(--af-ink); background: #fff; touch-action: none; }
  .af-sheet-grip { display: none; }
  .af-sheet-iconbtn { width: 44px; height: 44px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    background: #fff; color: var(--af-ink); border: 2px solid var(--af-ink); border-radius: 50%; cursor: pointer;
    box-shadow: 0 3px 0 var(--af-ink); font: inherit; }
  .af-sheet-iconbtn:active { transform: translateY(2px); box-shadow: 0 1px 0 var(--af-ink); }
  .af-sheet-iconbtn:disabled { opacity: .35; cursor: default; }
  .af-sheet-iconbtn svg { width: 20px; height: 20px; }
  .af-sheet-scroll { flex: 1; overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; }
  .af-sheet-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: 28px; padding: 24px; align-items: start; }
  .af-sheet-gallery { position: sticky; top: 0; display: flex; flex-direction: column; gap: 10px; }
  .af-sheet-track { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none;
    border: 2px solid var(--af-ink); border-radius: var(--radius-lg); background: #f4ede1; }
  .af-sheet-track::-webkit-scrollbar { display: none; }
  .af-sheet-track img { flex: 0 0 100%; width: 100%; aspect-ratio: 1 / 1; max-height: 58vh; object-fit: contain; background: #fff; scroll-snap-align: center; }
  .af-sheet-thumbs { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding: 4px; margin: -4px; }
  .af-sheet-thumbs::-webkit-scrollbar { display: none; }
  .af-sheet-thumbs button { flex: 0 0 auto; width: 64px; height: 64px; padding: 0; overflow: hidden; cursor: pointer; background: #f4ede1;
    border: 2px solid var(--af-ink); border-radius: var(--radius-sm); opacity: .6; }
  .af-sheet-thumbs button[aria-current="true"] { opacity: 1; outline: 3px solid var(--af-green); outline-offset: 1px; }
  .af-sheet-thumbs img { width: 100%; height: 100%; object-fit: contain; background: #fff; }
  .af-sheet-body { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
  .af-sheet-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .af-sheet-chip { display: inline-flex; align-items: center; gap: 6px; font-size: .78rem; font-weight: 700;
    border-radius: 999px; padding: 6px 12px; border: 1.5px solid; }
  .af-sheet-h { font-family: var(--font-display); font-weight: 800; font-size: .95rem; margin: 0 0 8px; color: var(--af-ink); }
  .af-sheet-variants { display: flex; flex-wrap: wrap; gap: 8px; }
  .af-sheet-variants button { min-height: 40px; padding: 7px 16px; cursor: pointer; font-family: var(--font-display);
    font-weight: 800; font-size: .88rem; color: var(--af-ink); background: #fff; border: 2px solid var(--af-ink); border-radius: 999px; }
  .af-sheet-variants button[aria-pressed="true"] { background: var(--af-ink); color: #fff; box-shadow: 0 3px 0 var(--af-orange); }
  .af-sheet-swatches { display: flex; flex-wrap: wrap; gap: 8px; }
  .af-sheet-swatch { width: 38px; height: 38px; padding: 0; cursor: pointer; border-radius: 50%; border: 2px solid var(--af-ink);
    display: flex; align-items: center; justify-content: center;
    background: repeating-conic-gradient(#dfe4e8 0 25%, #fff 0 50%) 50% / 10px 10px; }
  .af-sheet-swatch[aria-pressed="true"] { outline: 3px solid var(--af-blue); outline-offset: 2px; }
  .af-sheet-swatch svg { width: 16px; height: 16px; }
  .af-sheet-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .af-sheet-spec { background: #fff; border: 2px solid var(--af-ink); border-radius: var(--radius-md); padding: 10px 12px; }
  .af-sheet-foot { display: flex; gap: 10px; align-items: center; padding: 12px 20px; background: #fff;
    border-top: 2px solid var(--af-ink); }
  .af-sheet-foot .af-btn { flex: 1; min-width: 0; }
  @media (max-width: 350px) { .af-sheet-xs-hide { display: none; } }

  @media (max-width: 760px) {
    .af-sheet-backdrop { align-items: flex-end; padding: 0; }
    .af-sheet { width: 100%; max-height: 92vh; max-height: 92dvh; border-radius: 24px 24px 0 0;
      border-bottom: none; box-shadow: none; animation: af-rise 260ms cubic-bezier(.2, .9, .3, 1); }
    .af-sheet-top { position: relative; padding: 18px 12px 10px 16px; }
    .af-sheet-grip { display: block; position: absolute; top: 6px; left: 50%; width: 44px; height: 5px;
      margin-left: -22px; border-radius: 99px; background: var(--af-line, #EADFD2); }
    .af-sheet-grid { gap: 20px; padding: 18px; }
    .af-sheet-thumbs button { width: 52px; height: 52px; }
    .af-sheet-foot { padding: 10px 16px calc(10px + env(safe-area-inset-bottom)); }
    .af-sheet-foot .af-btn { padding: 14px 18px !important; font-size: .95rem !important; }
  }
  /* Portrait phones: photo on top, details below. From 560px up the sheet
     keeps photo and details side by side, so the photo never fills it. */
  @media (max-width: 559px) {
    .af-sheet-grid { grid-template-columns: 1fr; gap: 18px; padding: 16px; }
    .af-sheet-gallery { position: static; }
  }
  /* Landscape phones and short windows: use the whole screen, compact bars,
     photo beside the details and sized to the height that is left. */
  @media (max-height: 520px) {
    .af-sheet-backdrop { padding: 0; align-items: stretch; }
    .af-sheet { width: 100%; height: 100%; max-height: 100%; border: none; border-radius: 0; box-shadow: none;
      animation: af-fade 160ms ease-out; }
    .af-sheet-top { padding: 6px max(12px, env(safe-area-inset-right)) 6px max(16px, env(safe-area-inset-left)); }
    .af-sheet-grip { display: none; }
    .af-sheet-iconbtn { width: 38px; height: 38px; box-shadow: 0 2px 0 var(--af-ink); }
    .af-sheet-grid { grid-template-columns: minmax(0, .85fr) 1fr; gap: 18px;
      padding: 12px max(16px, env(safe-area-inset-right)) 16px max(16px, env(safe-area-inset-left)); }
    .af-sheet-gallery { position: sticky; top: 0; }
    .af-sheet-track img { aspect-ratio: auto; height: calc(100vh - 160px); height: calc(100dvh - 160px); min-height: 150px; max-height: none; }
    .af-sheet-thumbs { display: none; }
    .af-sheet-foot { padding: 6px max(16px, env(safe-area-inset-right)) calc(6px + env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left)); }
    .af-sheet-foot .af-btn { padding: 10px 18px !important; font-size: .92rem !important; }
  }
  @keyframes af-fade { from { opacity: 0; } }
  @keyframes af-pop { from { opacity: 0; transform: scale(.96); } }
  @keyframes af-rise { from { transform: translateY(100%); } }
  @media (prefers-reduced-motion: reduce) {
    .af-sheet, .af-sheet-backdrop { animation: none !important; transition: none !important; }
  }`,document.head.appendChild(e)})();const AfIcon=({d:t})=>React.createElement("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true"},t.map(e=>React.createElement("path",{key:e,d:e})));function afIsLight(t){if(!t)return!0;const e=parseInt(t.slice(1),16);return((e>>16)*299+(e>>8&255)*587+(e&255)*114)/1e3>160}function AfSheet({pos:t,total:e,onClose:i,onStep:o,resetKey:l,footer:a,labelledBy:s="af-sheet-title",children:r}){const p=React.useRef(null),h=React.useRef(null),d=React.useRef(null);React.useEffect(()=>{h.current&&(h.current.scrollTop=0)},[l]),React.useEffect(()=>{const n=document.activeElement,c=document.documentElement,w=c.style.overflow;c.style.overflow="hidden";const g=p.current.querySelector("[data-close]");g&&g.focus({preventScroll:!0});function m(f){if(f.key==="Escape"){f.preventDefault(),i();return}if(f.key!=="Tab")return;const u=[...p.current.querySelectorAll('a[href], button:not([disabled]), input, select, summary, [tabindex="0"]')],b=u[0],v=u[u.length-1];f.shiftKey&&document.activeElement===b?(f.preventDefault(),v.focus()):!f.shiftKey&&document.activeElement===v&&(f.preventDefault(),b.focus())}return document.addEventListener("keydown",m),()=>{document.removeEventListener("keydown",m),c.style.overflow=w,n&&n.focus&&n.focus({preventScroll:!0})}},[]);function y(n){n.pointerType!=="touch"||n.target.closest("button")||(d.current={y:n.clientY,dy:0},n.currentTarget.setPointerCapture(n.pointerId),p.current.style.transition="none")}function k(n){d.current&&(d.current.dy=Math.max(0,n.clientY-d.current.y),p.current.style.transform=`translateY(${d.current.dy}px)`)}function x(){if(!d.current)return;const{dy:n}=d.current;d.current=null;const c=p.current;if(c.style.transition="transform 200ms ease",n>110){i();return}c.style.transform=""}return React.createElement("div",{className:"af-sheet-backdrop",onClick:n=>{n.target===n.currentTarget&&i()}},React.createElement("div",{ref:p,className:"af-sheet",role:"dialog","aria-modal":"true","aria-labelledby":s},React.createElement("div",{className:"af-sheet-top",onPointerDown:y,onPointerMove:k,onPointerUp:x,onPointerCancel:x},React.createElement("span",{className:"af-sheet-grip","aria-hidden":"true"}),React.createElement("span",{style:{fontFamily:"var(--font-display)",fontWeight:800,fontSize:".85rem",color:"var(--text-muted)",marginRight:"auto"}},"Produk ",t+1," dari ",e),React.createElement("button",{type:"button",className:"af-sheet-iconbtn","aria-label":"Produk sebelumnya",disabled:e<2,onClick:()=>o(-1)},React.createElement(AfIcon,{d:["M15 18l-6-6 6-6"]})),React.createElement("button",{type:"button",className:"af-sheet-iconbtn","aria-label":"Produk berikutnya",disabled:e<2,onClick:()=>o(1)},React.createElement(AfIcon,{d:["M9 18l6-6-6-6"]})),React.createElement("button",{type:"button",className:"af-sheet-iconbtn","data-close":!0,"aria-label":"Tutup detail",onClick:i,style:{marginLeft:6}},React.createElement(AfIcon,{d:["M6 6l12 12","M18 6L6 18"]}))),React.createElement("div",{className:"af-sheet-scroll",ref:h},r),React.createElement("div",{className:"af-sheet-foot"},a)))}function AfGallery({imgs:t,slide:e,onSlide:i,fit:o="contain"}){const l=React.useRef(null);return React.useEffect(()=>{const a=l.current;!a||!a.clientWidth||Math.round(a.scrollLeft/a.clientWidth)===e||a.scrollTo({left:e*a.clientWidth,behavior:"smooth"})},[e,t.length&&t[0][0]]),React.createElement("div",{className:"af-sheet-gallery"},React.createElement("div",{style:{position:"relative"}},React.createElement("div",{className:"af-sheet-track",ref:l,onScroll:a=>{const s=a.currentTarget,r=Math.round(s.scrollLeft/s.clientWidth);r!==e&&i(r)}},t.map(([a,s],r)=>React.createElement("img",{key:a,src:a,alt:s,decoding:"async",loading:r?"lazy":"eager",style:o==="cover"?{objectFit:"cover"}:void 0}))),t.length>1?React.createElement("span",{"aria-hidden":"true",style:{position:"absolute",bottom:10,right:10,background:"rgba(43,42,40,.75)",color:"#fff",borderRadius:999,fontSize:12,fontWeight:700,padding:"3px 10px"}},e+1,"/",t.length):null),t.length>1?React.createElement("div",{className:"af-sheet-thumbs"},t.map(([a,s],r)=>React.createElement("button",{key:a,type:"button","aria-label":"Foto "+(r+1)+": "+s,"aria-current":r===e,onClick:()=>i(r)},React.createElement("img",{src:a,alt:"",loading:"lazy",decoding:"async",style:o==="cover"?{objectFit:"cover"}:void 0})))):null)}function AfShareButton({url:t,title:e}){const[i,o]=React.useState(!1);React.useEffect(()=>o(!1),[t]);async function l(){try{if(navigator.share){await navigator.share({title:e,url:t});return}await navigator.clipboard.writeText(t),o(!0)}catch(a){}}return React.createElement("button",{type:"button",className:"af-sheet-iconbtn","aria-label":i?"Link disalin":"Bagikan produk ini",title:i?"Link disalin":"Bagikan",onClick:l},i?React.createElement(AfIcon,{d:["M20 6L9 17l-5-5"]}):React.createElement(AfIcon,{d:["M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7","M16 6l-4-4-4 4","M12 2v13"]}))}Object.assign(window,{AfSheet,AfGallery,AfShareButton,AfIcon,afIsLight});

})();
