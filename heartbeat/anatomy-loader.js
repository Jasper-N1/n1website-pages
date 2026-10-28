const anatomy = document.querySelector('[data-anatomy-viewer]');

/* A lightweight stand-in for the 3D anatomy. The full model is about 31 MB,
   which on a phone over 4G can take half a minute; until it is ready the page
   shows pre-rendered frames of the same animation (about 3-4 MB), scrubbed by
   the scroll position. The 3D canvas takes over as soon as it is ready. */
const startFilm = (host, phone) => {
  const FRAMES = 91;
  const folder = phone ? 'media/anatomy-film-mobile' : 'media/anatomy-film-desktop';
  const urls = Array.from({ length: FRAMES }, (_, index) => `${folder}/frame-${String(index).padStart(2, '0')}.webp?v=20261020-1`);
  /* One <img> shows the frame for the scroll position. Frames are fetched
     one at a time into the browser cache; nothing keeps extra decoded copies,
     so iPhone Safari can free memory as it needs to. (A version that held
     decoded ImageBitmaps ran the tab out of memory on iPhone.) */
  /* Phones draw each frame into one canvas and free the decoded frame at
     once. With an <img>, iPhone Safari kept the decoded pixels of every frame
     it had shown (about 2 MB each, 91 frames) and the tab could run out of
     memory at the body. */
  const drawn = phone && 'createImageBitmap' in window;
  const film = document.createElement(drawn ? 'canvas' : 'img');
  film.className = drawn ? 'anatomy-film is-drawn' : 'anatomy-film';
  film.setAttribute('aria-hidden', 'true');
  if (!drawn) {
    film.alt = '';
    film.decoding = 'async';
  }
  const context = drawn ? film.getContext('2d') : null;
  let drawToken = 0;
  const drawFrame = url => {
    const token = ++drawToken;
    fetch(url).then(response => response.blob()).then(blob => createImageBitmap(blob)).then(bitmap => {
      if (token === drawToken) {
        if (film.width !== bitmap.width || film.height !== bitmap.height) {
          film.width = bitmap.width;
          film.height = bitmap.height;
        }
        context.clearRect(0, 0, film.width, film.height);
        context.drawImage(bitmap, 0, 0);
        host.classList.add('has-film');
      }
      bitmap.close();
    }).catch(() => {});
  };
  host.prepend(film);
  const cached = new Array(FRAMES).fill(false);
  let wanted = 0;
  let shown = -1;
  let frame = 0;
  const show = () => {
    frame = 0;
    if (host.classList.contains('is-ready')) return;
    let index = -1;
    for (let step = 0; step < FRAMES && index < 0; step += 1) {
      if (cached[wanted - step]) index = wanted - step;
      else if (cached[wanted + step]) index = wanted + step;
    }
    if (index < 0 || index === shown) return;
    shown = index;
    if (drawn) drawFrame(urls[index]);
    else {
      film.src = urls[index];
      host.classList.add('has-film');
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(show); };
  /* Every tenth frame first, so the whole animation is roughly there early;
     then the frames in between. */
  const order = [];
  for (let index = 0; index < FRAMES; index += 10) order.push(index);
  for (let index = 0; index < FRAMES; index += 1) if (index % 10) order.push(index);
  let next = 0;
  const fetchNext = () => {
    if (next >= order.length || host.classList.contains('is-ready')) return;
    const index = order[next++];
    fetch(urls[index]).then(response => {
      if (response.ok) { cached[index] = true; schedule(); }
      return response.arrayBuffer();
    }).catch(() => {}).finally(fetchNext);
  };
  fetchNext();
  return value => {
    wanted = Math.round(Math.max(0, Math.min(1, Number(value) || 0)) * (FRAMES - 1));
    schedule();
  };
};

if (anatomy) {
  /* Phones use the frames only: the 3D model is about 31 MB and building it
     on the main thread made scrolling stutter. */
  const phone = matchMedia('(max-width: 680px)').matches;
  const seekFilm = startFilm(anatomy, phone);
  window.n1AnatomyFilm = { seek: seekFilm };
  if (phone) anatomy.querySelector('.anatomy-loading')?.remove();
}

if (anatomy && !matchMedia('(max-width: 680px)').matches) {
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
