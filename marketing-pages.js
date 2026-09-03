(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const videos = [...document.querySelectorAll('video[data-autoplay]')];

  videos.forEach((video) => {
    const mobilePoster = video.dataset.posterMobile;
    if (mobilePoster && matchMedia('(max-width: 640px)').matches) video.poster = mobilePoster;
  });

  if (reducedMotion.matches) return;
  const start = (video) => video.play().catch(() => {});
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
