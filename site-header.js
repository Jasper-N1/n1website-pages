(() => {
  const script = document.currentScript;
  if (!script || document.querySelector('[data-n1-site-header]')) return;

  const path = location.pathname.split('/').pop() || 'index.html';
  const current = path;
  const pricingIsCurrent = current === 'pricing.html' || current === 'pricing-patients.html';
  const signupRole = current === 'patients.html' || current === 'pricing-patients.html'
    ? 'patient'
    : current === 'clinicians.html' || current === 'pricing.html'
      ? 'doctor'
      : null;
  const signupHref = `https://app.n1.care/signup${signupRole ? `?role=${signupRole}` : ''}`;
  const links = [
    ['clinicians.html', 'For clinicians'],
    ['patients.html', 'For patients'],
    ['reports.html', 'Reports'],
    ['compliance.html', 'Compliance'],
    ['about.html', 'About'],
  ];
  const linkMarkup = links.map(([href, label], index) => {
    const link = `<a href="${href}"${current === href ? ' aria-current="page"' : ''}>${label}</a>`;
    if (index !== 2) return link;
    return `${link}<div class="nav-dropdown${pricingIsCurrent ? ' is-current' : ''}">
      <button class="nav-dropdown-toggle" type="button" aria-expanded="false" aria-controls="pricing-menu">Pricing<svg class="nav-dropdown-chevron" viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1 5 5 5-5"/></svg></button>
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
        <div class="nav-actions"><a class="login" href="https://app.n1.care/login">Log in</a><a class="button" href="${signupHref}">Start free trial</a></div>
      </div>
    </div>`;
  script.insertAdjacentElement('afterend', nav);

  const hasMediaHero = document.body.classList.contains('media-hero-page');
  const homeHero = document.body.classList.contains('home-trust-header')
    ? document.querySelector('[data-exam-home]')
    : null;
  const syncScrollState = () => {
    const isPastHero = !hasMediaHero
      || (homeHero ? homeHero.getBoundingClientRect().bottom <= innerHeight + 1 : scrollY > 24);
    nav.classList.toggle('is-past-hero', isPastHero);
  };
  if (hasMediaHero) {
    addEventListener('scroll', syncScrollState, { passive: true });
    addEventListener('resize', syncScrollState);
  }
  syncScrollState();

  const toggle = nav.querySelector('.nav-toggle');
  const menu = nav.querySelector('.nav-menu');
  const pricingDropdown = nav.querySelector('.nav-dropdown');
  const pricingToggle = nav.querySelector('.nav-dropdown-toggle');
  const setPricingMenu = (open) => {
    pricingDropdown.classList.toggle('is-open', open);
    pricingToggle.setAttribute('aria-expanded', String(open));
  };
  const desktopNav = matchMedia('(min-width: 1024px)');
  const syncMenuInert = () => {
    if (desktopNav.matches || menu.classList.contains('is-open')) menu.removeAttribute('inert');
    else menu.setAttribute('inert', '');
  };
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menu.classList.toggle('is-open', open);
    if (!open) setPricingMenu(false);
    syncMenuInert();
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
  desktopNav.addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
    else syncMenuInert();
  });
  syncMenuInert();

  const mockupSelector = [
    '.product-hero-window',
    '.prepared-story-ui',
    '.projected-screen',
    '.pth-workspace',
    '.patient-platform-app',
    '.hero-custom-report-generator',
    '.hero-bio-detail',
    '.hero-bio-range-modal'
  ].join(',');
  const decorateMockup = (root) => {
    root.setAttribute('inert', '');
    root.setAttribute('aria-hidden', 'true');
  };
  document.querySelectorAll(mockupSelector).forEach(decorateMockup);

})();
