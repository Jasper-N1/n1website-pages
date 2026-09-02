// When motion is unwelcome the video is
// simply never started and its poster frame stands in, which is why every band
// carries one. play() rejects under some autoplay policies; the poster is the
// fallback there too, so the rejection is nothing to handle.
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('video[data-autoplay]').forEach((video) => video.play().catch(() => {}));
})();
