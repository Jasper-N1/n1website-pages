const anatomy = document.querySelector('[data-anatomy-viewer]');

if (anatomy) {
  let started = false;
  const load = () => {
    if (started) return;
    started = true;
    import('./anatomy-viewer.js?v=20261013-3').catch(() => {
      const status = anatomy.querySelector('.anatomy-loading');
      if (status) {
        status.textContent = 'The anatomy could not be loaded.';
        status.classList.add('is-error');
      }
    });
  };

  // Preload once the page itself has finished loading and the browser is idle,
  // so the model is ready before the visitor reaches it without competing with
  // the first screen. The observer below still covers a fast scroll.
  const warm = () => {
    if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 2000 });
    else setTimeout(load, 300);
  };
  if (document.readyState === 'complete') warm();
  else addEventListener('load', warm, { once: true });

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
