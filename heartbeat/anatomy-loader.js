const anatomy = document.querySelector('[data-anatomy-viewer]');

if (anatomy) {
  let started = false;
  const load = () => {
    if (started) return;
    started = true;
    import('./anatomy-viewer.js?v=20261013-1').catch(() => {
      const status = anatomy.querySelector('.anatomy-loading');
      if (status) {
        status.textContent = 'The anatomy could not be loaded.';
        status.classList.add('is-error');
      }
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      load();
    }, { rootMargin: '2400px 0px' });
    observer.observe(anatomy);
  } else {
    load();
  }
}
