const anatomy = document.querySelector('[data-anatomy-viewer]');

/* A lightweight stand-in for the 3D anatomy. The full model is about 31 MB,
   which on a phone over 4G can take half a minute; until it is ready the page
   shows pre-rendered frames of the same animation (about 3-4 MB), scrubbed by
   the scroll position. The 3D canvas takes over as soon as it is ready. */
const startFilm = host => {
  const FRAMES = 91;
  const phone = matchMedia('(max-width: 680px)').matches;
  const folder = phone ? 'media/anatomy-film-mobile' : 'media/anatomy-film-desktop';
  const film = document.createElement('img');
  film.className = 'anatomy-film';
  film.alt = '';
  film.setAttribute('aria-hidden', 'true');
  film.decoding = 'async';
  host.prepend(film);
  const loaded = new Array(FRAMES).fill(false);
  const urls = Array.from({ length: FRAMES }, (_, index) => `${folder}/frame-${String(index).padStart(2, '0')}.webp?v=20261020-1`);
  let wanted = 0;
  let shown = -1;
  const nearestLoaded = index => {
    for (let step = 0; step < FRAMES; step += 1) {
      if (loaded[index - step]) return index - step;
      if (loaded[index + step]) return index + step;
    }
    return -1;
  };
  const show = () => {
    if (host.classList.contains('is-ready')) return;
    const index = nearestLoaded(wanted);
    if (index < 0 || index === shown) return;
    shown = index;
    film.src = urls[index];
    host.classList.add('has-film');
  };
  /* Every tenth frame first, so the whole animation is roughly there early;
     then the frames in between. One request at a time keeps the 3D model's
     download moving. */
  const order = [];
  for (let index = 0; index < FRAMES; index += 10) order.push(index);
  for (let index = 0; index < FRAMES; index += 1) if (index % 10) order.push(index);
  let next = 0;
  const fetchNext = () => {
    if (next >= order.length || host.classList.contains('is-ready')) return;
    const index = order[next++];
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => { loaded[index] = true; show(); fetchNext(); };
    image.onerror = fetchNext;
    image.src = urls[index];
  };
  fetchNext();
  return value => {
    wanted = Math.round(Math.max(0, Math.min(1, Number(value) || 0)) * (FRAMES - 1));
    show();
  };
};

if (anatomy) {
  const seekFilm = startFilm(anatomy);
  window.n1AnatomyFilm = { seek: seekFilm };
  let started = false;
  const load = () => {
    if (started) return;
    started = true;
    import('./anatomy-viewer.js?v=20261020-1').catch(() => {
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
