/* Styles the ClickTerm iframe pasted directly above this <script> tag so the
   framed document (served from static.clickterm.com) matches the legal pages.
   Kept external because _headers pins every inline script to a sha256 hash.
   The CSS string is applied inside the frame via postMessage; it never styles
   this page. The hook classes (.ct-*) are ClickTerm's stable styling API. */
(function () {
  var frame = document.currentScript && document.currentScript.previousElementSibling;
  if (!frame || frame.tagName !== 'IFRAME') frame = document.querySelector('iframe.clickterm-embed');
  if (!frame) return;
  var origin = new URL(frame.src).origin;

  /* n1.care legal-page theme. Mirrors legal.css. */
  var css = `
    @font-face { font-family: "Inter"; src: url("https://n1.care/assets/fonts/inter-400.woff2") format("woff2"); font-weight: 400; font-display: swap; }
    @font-face { font-family: "Inter"; src: url("https://n1.care/assets/fonts/inter-600.woff2") format("woff2"); font-weight: 600; font-display: swap; }
    @font-face { font-family: "Inter"; src: url("https://n1.care/assets/fonts/inter-700.woff2") format("woff2"); font-weight: 700; font-display: swap; }

    .ct-page     { background: #F7FAFB; color: #4D5E65; font-family: "Inter", ui-sans-serif, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
    .ct-document { background: transparent; max-width: 760px; margin: 0 auto; padding: 8px 0 48px; }

    .ct-brand    { background: #F7FAFB; color: #5C6C72; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; border-bottom: 1px solid #D4DEE3; }
    .ct-brand a  { color: #005F7D; }

    .ct-header   { padding: 0 0 28px; margin: 0 0 32px; border-bottom: 1px solid #D4DEE3; }
    .ct-document .ct-title { color: #223C47; font-weight: 400; font-size: clamp(34px, 4vw, 50px); line-height: 1; letter-spacing: -.035em; margin: 0 0 18px; }
    .ct-meta     { color: #4D5E65; font-size: 12px; line-height: 1.5; }
    .ct-version-button { color: #005F7D; background: transparent; border: 1px solid #7FC5E1; border-radius: 999px; padding: 6px 14px; font: 600 12px/1.2 "Inter", ui-sans-serif, system-ui, sans-serif; letter-spacing: .02em; cursor: pointer; }
    .ct-version-button:hover { background: #EFF2F4; color: #004E68; }

    .ct-body     { color: #4D5E65; font-size: 14px; line-height: 1.76; }
    .ct-body h1  { color: #223C47; font-weight: 400; font-size: clamp(34px, 4vw, 50px); line-height: 1; letter-spacing: -.035em; margin: 0 0 20px; }
    .ct-body h2  { color: #223C47; font-weight: 400; font-size: clamp(30px, 3.4vw, 42px); line-height: 1; letter-spacing: -.035em; margin: 46px 0 20px; padding-top: 46px; border-top: 1px solid #D4DEE3; }
    .ct-body h2:first-child { margin-top: 0; padding-top: 0; border-top: 0; }
    .ct-body h3  { color: #004E68; font-weight: 600; font-size: 15px; line-height: 1.3; margin: 28px 0 9px; }
    .ct-body h4  { color: #004E68; font-weight: 600; font-size: 14px; margin: 20px 0 8px; }
    .ct-body p   { margin: 0 0 14px; }
    .ct-body ul, .ct-body ol { margin: 14px 0 14px; padding-left: 22px; }
    .ct-body li + li { margin-top: 8px; }
    .ct-body a   { color: #005F7D; text-decoration: underline; text-underline-offset: 3px; }
    .ct-body a:hover { color: #004E68; }
    .ct-body strong { color: #142830; font-weight: 700; }
    .ct-body blockquote { margin: 0 0 48px; padding: 24px 26px; border: 1px solid #7FC5E1; border-radius: 14px; background: #EFF2F4; color: #4D5E65; }
    .ct-body blockquote p:last-child { margin-bottom: 0; }
    .ct-body blockquote strong { color: #005F7D; }
    .ct-body table { width: 100%; border-collapse: collapse; margin: 14px 0 20px; font-size: 13px; }
    .ct-body th, .ct-body td { text-align: left; vertical-align: top; padding: 10px 12px; border-bottom: 1px solid #D4DEE3; }
    .ct-body th  { color: #004E68; font-weight: 600; }
    .ct-body hr  { border: 0; border-top: 1px solid #D4DEE3; margin: 32px 0; }
    .ct-body code { font-size: 13px; background: #E7EBED; border-radius: 4px; padding: 1px 5px; }
    .ct-body [style*="color"] { color: inherit !important; }

    .ct-divider  { border: 0; border-top: 1px solid #D4DEE3; margin: 40px 0 24px; }
    .ct-legal    { color: #4D5E65; font-size: 12px; line-height: 1.6; }
    .ct-legal-title { color: #004E68; font-weight: 600; font-size: 12px; letter-spacing: .02em; margin-bottom: 6px; }
    .ct-legal-text  { color: #4D5E65; }
    .ct-legal a  { color: #005F7D; }

    .ct-modal    { background: #F7FAFB; color: #223C47; border: 1px solid #D4DEE3; border-radius: 14px; font-family: "Inter", ui-sans-serif, system-ui, sans-serif; }
    .ct-version-card { background: #ffffff; border: 1px solid #D4DEE3; border-radius: 10px; color: #4D5E65; }
  `;

  function send() {
    frame.contentWindow.postMessage(
      { type: 'clickterm:configure', protocolVersion: 1, css: css },
      origin
    );
  }

  window.addEventListener('message', function (e) {
    if (e.origin !== origin) return;
    if (e.source !== frame.contentWindow) return;
    if (!e.data || e.data.type !== 'clickterm:ready') return;
    if (e.data.protocolVersion !== 1) return;
    send();
  });

  frame.addEventListener('load', send);
})();
