(() => {
  document.body.classList.add('has-report-site-shell');
  const shell = document.createElement('header');
  shell.className = 'report-site-shell';
  if (window.self !== window.top || new URLSearchParams(location.search).has('theme')) shell.classList.add('is-embedded');
  shell.innerHTML = `
    <div class="report-site-shell-inner">
      <a class="report-site-brand" href="index.html" aria-label="n1.care home"><span>n1.</span>care</a>
      <nav class="report-site-links" id="report-site-links" aria-label="Report navigation">
        <a href="clinicians.html">For clinicians</a>
        <a href="patients.html">For patients</a>
        <a href="reports.html">Reports</a>
        <a href="about.html">About</a>
        <a class="report-site-back" href="reports.html"><span aria-hidden="true">←</span> Back to reports</a>
      </nav>
      <a class="report-site-back report-site-back-desktop" href="reports.html"><span aria-hidden="true">←</span> Back to reports</a>
      <button class="report-site-menu" type="button" aria-expanded="false" aria-controls="report-site-links" aria-label="Open navigation"><span></span></button>
    </div>`;
  document.body.prepend(shell);
  const button = shell.querySelector('.report-site-menu');
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    shell.classList.toggle('is-open', open);
  });
  shell.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    button.setAttribute('aria-expanded', 'false');
    shell.classList.remove('is-open');
  }));
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !shell.classList.contains('is-open')) return;
    shell.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    button.focus();
  });
})();
