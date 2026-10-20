const anatomy = document.querySelector('[data-anatomy-viewer]');

/* A lightweight stand-in for the 3D anatomy. The full model is about 31 MB,
   which on a phone over 4G can take half a minute; until it is ready the page
   shows pre-rendered frames of the same animation (about 3-4 MB), scrubbed by
   the scroll position. The 3D canvas takes over as soon as it is ready. */
const startFilm = (host, phone) => {
  const FRAMES = 91;
  const KEEP = 10;
  const folder = phone ? 'media/anatomy-film-mobile' : 'media/anatomy-film-desktop';
  const urls = Array.from({ length: FRAMES }, (_, index) => `${folder}/frame-${String(index).padStart(2, '0')}.webp?v=20261020-1`);
  /* Frames are drawn on a canvas. Each one is downloaded once and kept
     encoded; only the few frames around the scroll position are decoded
     (off the main thread, by createImageBitmap), so a swap never decodes
     during a scroll frame and memory stays small on a phone. */
  const canvas = document.createElement('canvas');
  canvas.className = 'anatomy-film';
  canvas.setAttribute('aria-hidden', 'true');
  host.prepend(canvas);
  const context = canvas.getContext('2d');
  const blobs = new Array(FRAMES).fill(null);
  const bitmaps = new Map();
  const decoding = new Set();
  let wanted = 0;
  let drawn = -1;
  let frame = 0;
  const resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(host.clientWidth * ratio));
    canvas.height = Math.max(1, Math.round(host.clientHeight * ratio));
    drawn = -1;
    schedule();
  };
  const draw = () => {
    frame = 0;
    if (host.classList.contains('is-ready')) return;
    let index = -1;
    for (let step = 0; step < FRAMES && index < 0; step += 1) {
      if (bitmaps.has(wanted - step)) index = wanted - step;
      else if (bitmaps.has(wanted + step)) index = wanted + step;
    }
    if (index < 0 || index === drawn) return;
    const bitmap = bitmaps.get(index);
    const scale = Math.min(canvas.width / bitmap.width, canvas.height / bitmap.height);
    const width = bitmap.width * scale;
    const height = bitmap.height * scale;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
    drawn = index;
    host.classList.add('has-film');
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
  const decode = index => {
    if (!blobs[index] || bitmaps.has(index) || decoding.has(index)) return;
    decoding.add(index);
    createImageBitmap(blobs[index]).then(bitmap => {
      decoding.delete(index);
      bitmaps.set(index, bitmap);
      /* Keep only the frames nearest the scroll position. */
      if (bitmaps.size > KEEP) {
        const far = [...bitmaps.keys()].sort((x, y) => Math.abs(y - wanted) - Math.abs(x - wanted));
        far.slice(0, bitmaps.size - KEEP).forEach(key => { if (key !== drawn) { bitmaps.get(key).close?.(); bitmaps.delete(key); } });
      }
      schedule();
    }).catch(() => decoding.delete(index));
  };
  const decodeAround = () => {
    for (let step = 0; step <= 3; step += 1) { decode(wanted + step); decode(wanted - step); }
    if (!bitmaps.size) for (let index = 0; index < FRAMES; index += 10) decode(index);
  };
  /* Every tenth frame first, so the whole animation is roughly there early;
     then the frames in between, a few requests at a time. */
  const order = [];
  for (let index = 0; index < FRAMES; index += 10) order.push(index);
  for (let index = 0; index < FRAMES; index += 1) if (index % 10) order.push(index);
  let next = 0;
  const fetchNext = () => {
    if (next >= order.length) return;
    const index = order[next++];
    fetch(urls[index]).then(response => response.ok ? response.blob() : null).then(blob => {
      blobs[index] = blob;
      if (Math.abs(index - wanted) <= 3 || !bitmaps.size) decode(index);
    }).catch(() => {}).finally(fetchNext);
  };
  for (let lane = 0; lane < 3; lane += 1) fetchNext();
  new ResizeObserver(resize).observe(host);
  resize();
  return value => {
    wanted = Math.round(Math.max(0, Math.min(1, Number(value) || 0)) * (FRAMES - 1));
    decodeAround();
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
