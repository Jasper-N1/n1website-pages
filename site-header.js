(() => {
  const script = document.currentScript;
  if (!script || document.querySelector('[data-n1-site-header]')) return;

  const path = location.pathname.split('/').pop() || 'index.html';
  const current = path.startsWith('clinician-interview-')
    ? 'clinicians.html'
    : path === 'report-library.html'
      ? 'reports.html'
      : path;
  const pricingIsCurrent = current === 'pricing.html' || current === 'pricing-patients.html';
  const links = [
    ['clinicians.html', 'For clinicians'],
    ['patients.html', 'For patients'],
    ['reports.html', 'Reports'],
    ['about.html', 'About'],
  ];
  const linkMarkup = links.map(([href, label], index) => {
    const link = `<a href="${href}"${current === href ? ' aria-current="page"' : ''}>${label}</a>`;
    if (index !== 2) return link;
    return `${link}<div class="nav-dropdown${pricingIsCurrent ? ' is-current' : ''}">
      <button class="nav-dropdown-toggle" type="button" aria-expanded="false" aria-controls="pricing-menu">Pricing<span aria-hidden="true"></span></button>
      <div class="nav-dropdown-menu" id="pricing-menu">
        <a href="pricing.html"${current === 'pricing.html' ? ' aria-current="page"' : ''}>Clinician</a>
        <a href="pricing-patients.html"${current === 'pricing-patients.html' ? ' aria-current="page"' : ''}>Patient</a>
      </div>
    </div>`;
  }).join('');

  const nav = document.createElement('nav');
  nav.className = 'nav site-nav-v2';
  nav.setAttribute('aria-label', 'Primary navigation');
  nav.setAttribute('data-n1-site-header', '');
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" aria-label="n1.care home"><span class="logo" aria-hidden="true"></span></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-menu" aria-label="Open navigation"><span></span></button>
      <div class="nav-menu" id="primary-menu">
        <div class="nav-links">${linkMarkup}</div>
        <div class="nav-actions"><a class="login" href="https://app.n1.care/login">Log in</a><a class="button" href="https://app.n1.care/signup">Start free trial</a></div>
      </div>
    </div>`;
  script.insertAdjacentElement('afterend', nav);

  const toggle = nav.querySelector('.nav-toggle');
  const menu = nav.querySelector('.nav-menu');
  const pricingDropdown = nav.querySelector('.nav-dropdown');
  const pricingToggle = nav.querySelector('.nav-dropdown-toggle');
  const setPricingMenu = (open) => {
    pricingDropdown.classList.toggle('is-open', open);
    pricingToggle.setAttribute('aria-expanded', String(open));
  };
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menu.classList.toggle('is-open', open);
    if (!open) setPricingMenu(false);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  pricingToggle.addEventListener('click', () => setPricingMenu(pricingToggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', (event) => {
    if (!pricingDropdown.contains(event.target)) setPricingMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
    if (event.key === 'Escape' && pricingDropdown.classList.contains('is-open')) {
      setPricingMenu(false);
      pricingToggle.focus();
    }
  });
  matchMedia('(min-width: 1281px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });

})();
