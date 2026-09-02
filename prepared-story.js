(() => {
  document.querySelectorAll('.story-change-chart').forEach((chart) => {
    const tooltip = chart.querySelector('.story-chart-tooltip');
    const points = [...chart.querySelectorAll('.story-chart-point')];
    if (!tooltip || !points.length) return;
    chart.querySelector('svg')?.removeAttribute('aria-hidden');

    const showPoint = (point) => {
      const chartRect = chart.getBoundingClientRect();
      const pointRect = point.getBoundingClientRect();
      const x = pointRect.left + pointRect.width / 2 - chartRect.left;
      const y = pointRect.top + pointRect.height / 2 - chartRect.top;
      tooltip.querySelector('b').textContent = `${point.dataset.value} HbA1c`;
      tooltip.querySelector('small').textContent = `${point.dataset.date} · ${point.dataset.source}`;
      tooltip.style.setProperty('--tip-x', `${x}px`);
      tooltip.style.setProperty('--tip-y', `${y}px`);
      tooltip.classList.toggle('is-below', y < 54);
      tooltip.classList.add('is-visible');
      tooltip.setAttribute('aria-hidden', 'false');
    };

    const hidePoint = () => {
      tooltip.classList.remove('is-visible');
      tooltip.setAttribute('aria-hidden', 'true');
    };

    points.forEach((point) => {
      point.addEventListener('pointerenter', () => showPoint(point));
      point.addEventListener('pointerleave', hidePoint);
      point.addEventListener('focus', () => showPoint(point));
      point.addEventListener('blur', hidePoint);
      point.addEventListener('click', () => showPoint(point));
      point.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') hidePoint();
      });
    });
  });

  document.querySelectorAll('.story-report-window').forEach((windowElement) => {
    const scroller = windowElement.querySelector('.story-report-scroll');
    if (!scroller) return;
    scroller.addEventListener('scroll', () => {
      windowElement.classList.toggle('is-scrolled', scroller.scrollTop > 8);
    }, { passive: true });

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const storyStep = windowElement.closest('.prepared-story-step');
    const holdAtStart = 900;
    const travelTime = 7000;
    const holdAtEnd = 1500;
    const cycleTime = holdAtStart + travelTime + holdAtEnd;
    let cycleStartedAt = 0;
    let pauseStartedAt = 0;
    let isHovered = false;
    let isFocused = false;
    let manualPauseUntil = 0;

    const pauseForInteraction = () => {
      manualPauseUntil = performance.now() + 4000;
    };
    scroller.addEventListener('pointerenter', () => { isHovered = true; });
    scroller.addEventListener('pointerleave', () => { isHovered = false; });
    scroller.addEventListener('focusin', () => { isFocused = true; });
    scroller.addEventListener('focusout', () => { isFocused = false; });
    scroller.addEventListener('pointerdown', pauseForInteraction, { passive: true });
    scroller.addEventListener('wheel', pauseForInteraction, { passive: true });

    const autoScroll = (time) => {
      const isActive = storyStep?.classList.contains('is-active');
      if (!isActive || document.hidden) {
        cycleStartedAt = 0;
        pauseStartedAt = 0;
        if (scroller.scrollTop > 0) scroller.scrollTop = 0;
        requestAnimationFrame(autoScroll);
        return;
      }

      const isPaused = isHovered || isFocused || time < manualPauseUntil;
      if (isPaused) {
        if (!pauseStartedAt) pauseStartedAt = time;
        requestAnimationFrame(autoScroll);
        return;
      }
      if (pauseStartedAt && cycleStartedAt) cycleStartedAt += time - pauseStartedAt;
      pauseStartedAt = 0;
      if (!cycleStartedAt) cycleStartedAt = time;

      const elapsed = (time - cycleStartedAt) % cycleTime;
      const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      if (elapsed < holdAtStart) {
        scroller.scrollTop = 0;
      } else if (elapsed < holdAtStart + travelTime) {
        const linear = (elapsed - holdAtStart) / travelTime;
        const eased = linear < .5 ? 2 * linear * linear : 1 - Math.pow(-2 * linear + 2, 2) / 2;
        scroller.scrollTop = maxScroll * eased;
      } else {
        scroller.scrollTop = maxScroll;
      }
      requestAnimationFrame(autoScroll);
    };
    requestAnimationFrame(autoScroll);
  });

  const story = document.querySelector('.prepared-story');
  if (!story) return;

  const steps = [...story.querySelectorAll('.prepared-story-step')];
  const titleCopies = steps.map((step) => step.querySelector('.prepared-story-copy'));
  let activeTitleIndex = 0;
  titleCopies.forEach((copy, index) => copy.setAttribute('aria-hidden', String(index !== activeTitleIndex)));
  steps.forEach((step, index) => step.classList.toggle('is-active', index === activeTitleIndex));
  let storyTop = 0;
  let storyDistance = 1;
  let ticking = false;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const measure = () => {
    storyTop = story.getBoundingClientRect().top + window.scrollY;
    storyDistance = Math.max(1, story.offsetHeight - window.innerHeight);
  };

  const render = () => {
    const progress = clamp((window.scrollY - storyTop) / storyDistance, 0, 1);
    const position = progress * (steps.length - 1);
    const lift = window.innerHeight * 1.18;
    const transitionProgress = position < steps.length - 1 ? position % 1 : 0;
    const fanProgress = clamp(transitionProgress / .45, 0, 1);
    const fan = Math.sin(fanProgress * Math.PI);
    const depthOffset = (window.innerWidth <= 820 ? 14 : 16) + fan * (window.innerWidth <= 820 ? 5 : 6);
    const depthScale = .018 + fan * .006;

    const nextTitleIndex = clamp(Math.round(position), 0, steps.length - 1);
    if (nextTitleIndex !== activeTitleIndex) {
      titleCopies.forEach((copy, index) => {
        const isCurrent = index === nextTitleIndex;
        copy.classList.toggle('is-current', isCurrent);
        copy.setAttribute('aria-hidden', String(!isCurrent));
        steps[index].classList.toggle('is-active', isCurrent);
      });
      activeTitleIndex = nextTitleIndex;
    }

    steps.forEach((step, index) => {
      const card = step.querySelector('.prepared-story-card');
      const phase = position - index;
      let y;
      let scale;

      if (phase >= 0) {
        const exitPhase = clamp((phase - .18) / .82, 0, 1.25);
        y = -exitPhase * lift;
        scale = 1;
      } else {
        const depth = clamp(-phase, 0, 2);
        y = depth * depthOffset;
        scale = 1 - depth * depthScale;
      }

      card.style.setProperty('--story-y', `${y.toFixed(2)}px`);
      card.style.setProperty('--story-scale', scale.toFixed(4));
    });

    ticking = false;
  };

  const requestRender = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(render);
  };

  const remeasure = () => {
    measure();
    requestRender();
  };

  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', remeasure);
  measure();
  render();
})();
