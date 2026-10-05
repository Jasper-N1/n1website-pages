const film = document.querySelector('[data-anatomy-film]');
const scene = film?.closest('.insights-scene');

if (film && scene) {
  const phoneLayout = matchMedia('(max-width: 680px)');
  let requestedProgress = 0;
  let ready = false;
  let source = '';

  const seek = progress => {
    requestedProgress = Math.max(0, Math.min(1, Number(progress) || 0));
    if (!ready || !Number.isFinite(film.duration)) return;
    const target = requestedProgress * Math.max(0, film.duration - 1 / 30);
    if (Math.abs(film.currentTime - target) > 1 / 60) film.currentTime = target;
  };

  const setSource = () => {
    const next = phoneLayout.matches ? './media/anatomy-mobile.mp4' : './media/anatomy-desktop.mp4';
    if (next === source) return;
    source = next;
    ready = false;
    film.classList.remove('is-ready');
    film.src = next;
    film.load();
  };

  const showFrame = () => {
    ready = true;
    film.pause();
    seek(parseFloat(getComputedStyle(scene).getPropertyValue('--insight')) || requestedProgress);
    film.classList.add('is-ready');
  };

  film.disablePictureInPicture = true;
  film.addEventListener('loadeddata', showFrame);
  phoneLayout.addEventListener('change', setSource);
  window.n1AnatomyFilm = { seek };
  setSource();
}
