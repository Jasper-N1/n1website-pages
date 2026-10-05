const film = document.querySelector('[data-anatomy-film]');
const scene = film?.closest('.insights-scene');

if (film && scene) {
  const phoneLayout = matchMedia('(max-width: 680px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const decomposedFrame = 0.55;
  let ready = false;
  let source = '';
  let targetProgress = 0;
  let animationFrame = 0;
  let transitionId = 0;

  const clamp = value => Math.max(0, Math.min(1, value));
  const videoEnd = () => Math.max(0, film.duration - 1 / 30);
  const currentProgress = () => ready && videoEnd() ? film.currentTime / videoEnd() : targetProgress;
  const setFrame = progress => {
    if (!ready || !Number.isFinite(film.duration)) return;
    const target = clamp(progress) * videoEnd();
    if (Math.abs(film.currentTime - target) > 1 / 120) film.currentTime = target;
  };
  const transitionDuration = (from, to) => {
    const lower = Math.abs(Math.min(from, decomposedFrame) - Math.min(to, decomposedFrame));
    const upper = Math.abs(Math.max(from - decomposedFrame, 0) - Math.max(to - decomposedFrame, 0));
    return Math.max(280, lower / decomposedFrame * 4200 + upper / (1 - decomposedFrame) * 3000);
  };
  const seekTo = (from, next, duration) => {
    const startedAt = performance.now();
    const tick = stamp => {
      const progress = Math.min(1, (stamp - startedAt) / duration);
      const eased = progress * progress * (3 - 2 * progress);
      setFrame(from + (next - from) * eased);
      if (progress < 1) animationFrame = requestAnimationFrame(tick);
      else animationFrame = 0;
    };
    animationFrame = requestAnimationFrame(tick);
  };
  const animateTo = nextProgress => {
    const next = clamp(nextProgress);
    if (Math.abs(next - targetProgress) < 0.001 && animationFrame) return;
    targetProgress = next;
    if (!ready) return;
    const activeTransition = ++transitionId;
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    film.pause();
    const from = currentProgress();
    if (reducedMotion.matches || Math.abs(next - from) < 0.002) {
      setFrame(next);
      return;
    }
    const duration = transitionDuration(from, next);
    if (next < from) {
      seekTo(from, next, duration);
      return;
    }
    const targetTime = next * videoEnd();
    film.playbackRate = Math.max(0.25, Math.min(4, (targetTime - film.currentTime) / (duration / 1000)));
    const watchPlayback = () => {
      if (film.currentTime >= targetTime - 1 / 60) {
        film.pause();
        setFrame(next);
        animationFrame = 0;
      } else animationFrame = requestAnimationFrame(watchPlayback);
    };
    film.play().then(() => {
      if (activeTransition === transitionId) animationFrame = requestAnimationFrame(watchPlayback);
    }).catch(() => {
      if (activeTransition === transitionId) seekTo(from, next, duration);
    });
  };
  const syncStage = () => {
    if (scene.classList.contains('is-heart-focused')) animateTo(1);
    else if (scene.classList.contains('is-decomposed')) animateTo(decomposedFrame);
    else animateTo(0);
  };
  const setSource = () => {
    const next = phoneLayout.matches
      ? './media/anatomy-mobile.mp4?v=20261005-2'
      : './media/anatomy-desktop.mp4?v=20261005-2';
    if (next === source) return;
    source = next;
    ready = false;
    transitionId += 1;
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    film.classList.remove('is-ready');
    film.src = next;
    film.load();
  };
  const showFrame = () => {
    ready = true;
    film.pause();
    setFrame(targetProgress);
    film.classList.add('is-ready');
    syncStage();
  };

  film.disablePictureInPicture = true;
  film.addEventListener('loadeddata', showFrame);
  phoneLayout.addEventListener('change', setSource);
  new MutationObserver(syncStage).observe(scene, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      film.pause();
    } else syncStage();
  });
  syncStage();
  setSource();
}
