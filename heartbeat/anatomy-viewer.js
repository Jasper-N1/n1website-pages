const layers = [...document.querySelectorAll('.anatomy-film')];
const scene = layers[0]?.closest('.insights-scene');

if (layers.length === 2 && scene) {
  const phoneLayout = matchMedia('(max-width: 680px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const frameCount = 91;
  const duration = 11050;
  const frameDuration = duration / (frameCount - 1);
  let runId = 0;
  let activeLayer = 0;
  let playing = false;
  let completed = false;
  let frameCache = new Map();

  const frameUrl = index => {
    const layout = phoneLayout.matches ? 'mobile' : 'desktop';
    return `./media/anatomy-${layout}-frames/frame-${String(index).padStart(2, '0')}.webp?v=20261005-1`;
  };
  const finalUrl = () => phoneLayout.matches
    ? './media/anatomy-mobile-final.webp?v=20261005-1'
    : './media/anatomy-desktop-final.webp?v=20261005-1';

  const loadFrame = index => {
    if (frameCache.has(index)) return frameCache.get(index);
    const pending = new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image.currentSrc || image.src);
      image.onerror = reject;
      image.src = frameUrl(index);
    });
    frameCache.set(index, pending);
    return pending;
  };

  const preloadFrom = index => {
    for (let next = index; next < Math.min(frameCount, index + 8); next += 1) {
      loadFrame(next).catch(() => {});
    }
    for (const cached of frameCache.keys()) {
      if (cached < index - 2) frameCache.delete(cached);
    }
  };

  const showFrame = async (index, id) => {
    const src = await loadFrame(index);
    if (id !== runId) return false;
    const nextLayer = 1 - activeLayer;
    layers[nextLayer].src = src;
    if (layers[nextLayer].decode) await layers[nextLayer].decode().catch(() => {});
    if (id !== runId) return false;
    layers[nextLayer].classList.add('is-visible');
    layers[activeLayer].classList.remove('is-visible');
    activeLayer = nextLayer;
    return true;
  };

  const showFinal = () => {
    runId += 1;
    const nextLayer = 1 - activeLayer;
    layers[nextLayer].src = finalUrl();
    layers[nextLayer].classList.add('is-visible');
    layers[activeLayer].classList.remove('is-visible');
    activeLayer = nextLayer;
    playing = false;
    completed = true;
  };

  const showInitial = () => {
    if (playing || scene.classList.contains('is-decomposed')) return;
    runId += 1;
    completed = false;
    frameCache.clear();
    layers.forEach(layer => {
      layer.classList.remove('is-visible');
      layer.removeAttribute('src');
    });
  };

  const playAll = () => new Promise(async resolve => {
    if (completed) {
      resolve();
      return;
    }
    if (reducedMotion.matches) {
      showFinal();
      resolve();
      return;
    }

    playing = true;
    const id = ++runId;
    preloadFrom(0);
    try {
      await showFrame(0, id);
    } catch {
      showFinal();
      resolve();
      return;
    }
    if (id !== runId) return;

    const startedAt = performance.now();
    let shown = 0;
    const advance = async stamp => {
      if (id !== runId) return;
      const wanted = Math.min(frameCount - 1, Math.floor((stamp - startedAt) / frameDuration));
      if (wanted > shown) {
        try {
          await showFrame(wanted, id);
          shown = wanted;
          preloadFrom(wanted + 1);
        } catch {
          showFinal();
          resolve();
          return;
        }
      }
      if (shown < frameCount - 1) requestAnimationFrame(advance);
      else {
        playing = false;
        completed = true;
        resolve();
      }
    };
    requestAnimationFrame(advance);
  });

  window.n1AnatomyFilm = {
    playAll,
    release: () => {
      if (completed) showFinal();
    }
  };

  new MutationObserver(showInitial).observe(scene, {
    attributes: true,
    attributeFilter: ['class']
  });
  phoneLayout.addEventListener('change', () => {
    frameCache.clear();
    if (completed) showFinal();
    else if (!playing) showInitial();
  });
}
