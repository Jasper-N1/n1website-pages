(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const videos = [...document.querySelectorAll('video[data-autoplay]')];

  videos.forEach((video) => {
    const mobilePoster = video.dataset.posterMobile;
    if (mobilePoster && matchMedia('(max-width: 640px)').matches) video.poster = mobilePoster;
  });

  if (reducedMotion.matches) return;

  /* iOS only honours autoplay when the element is muted and inline, and it
     checks the DOM *properties*, not just the attributes — a video parsed
     before this runs can already have muted=false. Setting them here, and
     retrying once on the first touch, is what makes these actually play on a
     phone rather than sitting on the poster. Low Power Mode still blocks
     autoplay outright; the poster is the fallback there. */
  const pending = new Set();
  const start = (video) => {
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    const played = video.play();
    if (played && played.catch) played.catch(() => pending.add(video));
  };
  const retry = () => {
    pending.forEach((video) => { const p = video.play(); if (p && p.catch) p.catch(() => {}); });
    pending.clear();
  };
  ['touchstart', 'pointerdown', 'visibilitychange'].forEach((event) =>
    addEventListener(event, retry, { passive: true }));

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const video = entry.target;
          video.preload = 'auto';
          start(video);
          observer.unobserve(video);
        });
      }, { rootMargin: '300px 0px', threshold: 0 })
    : null;

  videos.forEach((video) => {
    if (video.getBoundingClientRect().top < innerHeight * 1.25) {
      video.preload = 'auto';
      start(video);
    } else if (observer) {
      observer.observe(video);
    } else {
      start(video);
    }
  });
})();
