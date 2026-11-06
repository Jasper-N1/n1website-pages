/* Heartbeat timeline, ported whole from the Heartbeat page
   (n1website-pages/heartbeat/index.html). The helpers at the top are the
   Heartbeat frame loop and layout helpers the timeline needs; the timeline
   block below them is the Heartbeat code. Changes for n1.care: the menu
   height comes from the n1.care nav, the scene ends once the saved records
   have stacked into a deck (SCENE_END), and the deck then goes down into
   the homepage cards in the next section (the hand-off, built like the
   Heartbeat sign-off deck). The Heartbeat processing step is removed. */
(() => {
  if (!document.querySelector('.timeline-scene.is-port')) return;

  /* Every pinned stage is one --stage-h tall (set in home-header.css). */
  const stageProbe = document.createElement('div');
  stageProbe.setAttribute('aria-hidden', 'true');
  stageProbe.style.cssText =
    'position:absolute;top:0;left:0;width:0;height:var(--stage-h);visibility:hidden;pointer-events:none';
  document.documentElement.appendChild(stageProbe);
  let stageHeight = stageProbe.offsetHeight || innerHeight;
  const measureStage = () => { stageHeight = stageProbe.offsetHeight || innerHeight; };

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = progress => progress * progress * (3 - 2 * progress);

  /* The bottom of the floating n1.care nav, in place of the Heartbeat menu bar. */
  const menuBottom = () => {
    const nav = document.querySelector('.site-nav-v2');
    return nav ? Math.round(nav.getBoundingClientRect().bottom) : 0;
  };

  const scenes = [];
  const activeSceneElements = new WeakSet();
  const registerScene = (draw, element = null) => scenes.push({ draw, element });
  const sceneObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) activeSceneElements.add(entry.target);
      else activeSceneElements.delete(entry.target);
    });
    wake();
  }, { rootMargin: '100% 0px' }) : null;
  const layoutTasks = [];
  const registerLayoutTask = task => layoutTasks.push(task);
  const sharedContent = { timeline: 0, findings: 0 };
  const sharedRefit = {};
  const sharedLayout = (stageH, menuH, titleH) => {
    const gap = Math.max(12, (stageH - menuH - titleH - (sharedContent.findings || sharedContent.timeline)) / 3);
    return { titleTop: menuH + gap, contentTop: menuH + gap * 2 + titleH };
  };
  const reportContent = (section, height) => {
    if (sharedContent[section] === height) return;
    sharedContent[section] = height;
  };

  const geometry = new Map();
  const geometryOf = element => {
    let box = geometry.get(element);
    if (!box) {
      let top = 0;
      for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
      box = { top, height: element.offsetHeight };
      geometry.set(element, box);
    }
    return box;
  };
  /* Phones follow a smoothed scroll position (about 0.2s), as on Heartbeat. */
  const smoothScroll = matchMedia('(max-width: 680px)');
  const SMOOTH_MS = 190;
  let sceneY = scrollY;
  const trackProgress = element => {
    const box = geometryOf(element);
    const travel = box.height - stageHeight;
    return travel > 0 ? clamp((sceneY - box.top) / travel) : 0;
  };

  let scrollDirty = true;
  let loopOn = false;
  let lastStamp = 0;
  const runFrame = stamp => {
    const dt = lastStamp ? Math.min(64, stamp - lastStamp) : 16;
    lastStamp = stamp;
    let smoothing = false;
    if (smoothScroll.matches && !reducedMotion.matches) {
      const gapY = scrollY - sceneY;
      if (Math.abs(gapY) < .5) sceneY = scrollY;
      else {
        sceneY += gapY * (1 - Math.exp(-dt / SMOOTH_MS));
        smoothing = true;
        scrollDirty = true;
      }
    } else sceneY = scrollY;
    if (scrollDirty) {
      scrollDirty = false;
      scenes.forEach(scene => {
        if (!scene.element || !sceneObserver || activeSceneElements.has(scene.element)) scene.draw();
      });
    }
    loopOn = scrollDirty || smoothing;
    if (loopOn) requestAnimationFrame(runFrame);
    else lastStamp = 0;
  };
  const wake = () => {
    scrollDirty = true;
    if (loopOn) return;
    loopOn = true;
    requestAnimationFrame(runFrame);
  };
  addEventListener('scroll', wake, { passive: true });
  let layoutWidth = innerWidth;
  addEventListener('resize', () => {
    const widthChanged = innerWidth !== layoutWidth;
    if (!widthChanged && Math.abs(stageProbe.offsetHeight - stageHeight) < 1) return;
    layoutWidth = innerWidth;
    geometry.clear();
    measureStage();
    layoutTasks.forEach(task => task());
    wake();
  }, { passive: true });
  /* Content above the scene can change height after load (images, the
     header); measure again once everything has loaded. */
  addEventListener('load', () => {
    geometry.clear();
    measureStage();
    layoutTasks.forEach(task => task());
    wake();
  });



  const tlScene = document.querySelector('.timeline-scene');
  const tlTrack = document.querySelector('.tl-list');
  /* The source now contains the meaningful stops plus the same evenly spaced
     routine records. Do not construct and discard another 121 cards here. */
  const tlItems = [...document.querySelectorAll('.tl-entry')];
  tlItems.forEach((item, index) => {
    item.style.setProperty('--i', index);
    item.classList.toggle('is-saved', item.hasAttribute('data-stop'));
  });
  if (tlScene && tlTrack && tlItems.length) {
    const tlFocus = tlScene.querySelector('.tl-focus');
    /* The timeline is read first. Its final slice hands the stage to the
       processing sequence, which is scrubbed by scroll before the report. */
    const workHost = tlScene.querySelector('.tl-stage');
    const TIMELINE_TRAVEL_END = .372;
    const STACK_END = .62;
    const TIMELINE_END = .67;
    const VEIL_START = .65;
    const VEIL_END = .68;
    const PROCESS_START = .662;
    const PROCESS_IN_END = .71;
    /* n1.care: the scene ends once the saved records have stacked into a
       deck (STACK_END). The deck then goes on into the cards in the next
       section (the hand-off below). The Heartbeat processing step is not
       used. Scroll progress is scaled to keep the Heartbeat timing. */
    const SCENE_END = STACK_END;
    workHost?.style.setProperty('--ready', '1');
    let tlFrame = 0;
    let lastActive = -1;
    let settledTo = 0;

    /* Keep the statement at the top and centre the final card body in the
       viewport. Measuring the rendered card avoids viewport-specific nudges. */
    const tlStageEl = tlScene.querySelector('.tl-stage');
    const tlHeadEl = tlScene.querySelector('.tl-head');
    const savedShelf = document.createElement('aside');
    savedShelf.className = 'tl-saved-stack';
    savedShelf.setAttribute('aria-hidden', 'true');
    const savedShelfLabel = document.createElement('span');
    savedShelfLabel.className = 'tl-saved-label';
    savedShelfLabel.textContent = 'Selected records';
    savedShelf.append(savedShelfLabel);
    const savedSnapshots = tlItems.reduce((snapshots, item, index) => {
      if (!item.classList.contains('is-saved') || index === tlItems.length - 1) return snapshots;
      const body = item.querySelector('.tl-body')?.cloneNode(true);
      if (!body) return snapshots;
      body.style.setProperty('--gen', '1');
      body.querySelector('.tl-skel')?.remove();
      body.querySelectorAll('a').forEach(link => link.removeAttribute('href'));
      const snapshot = document.createElement('div');
      snapshot.className = 'tl-saved-card';
      snapshot.style.setProperty('--saved-i', snapshots.length);
      /* A loose pile rather than a neat deck: each card keeps its own small
         turn and offset. Fixed values, so the pile looks the same each visit. */
      const mess = [[-3.2, -6, 4], [2.6, 8, -3], [-1.4, -3, -6], [3.8, 5, 5], [-2.4, -8, 2], [1.6, 4, -4]][snapshots.length % 6];
      snapshot.style.setProperty('--rot', `${mess[0]}deg`);
      snapshot.style.setProperty('--mx', `${mess[1]}px`);
      snapshot.style.setProperty('--my', `${mess[2]}px`);
      snapshot.append(body);
      savedShelf.append(snapshot);
      snapshots.push({ index, node: snapshot });
      return snapshots;
    }, []);
    if (savedSnapshots.length) savedSnapshots[savedSnapshots.length - 1].node.classList.add('is-top-saved');
    const finalSnapshot = document.createElement('div');
    finalSnapshot.className = 'tl-final-card';
    finalSnapshot.setAttribute('aria-hidden', 'true');
    finalSnapshot.style.setProperty('--gen', '1');
    const finalBody = tlItems[tlItems.length - 1].querySelector('.tl-body')?.cloneNode(true);
    if (finalBody) {
      finalBody.querySelector('.tl-skel')?.remove();
      finalSnapshot.append(finalBody);
    }
    savedShelf.style.setProperty('--saved-n', savedSnapshots.length);
    const savedSlot = document.createElement('div');
    savedSlot.className = 'tl-saved-slot';
    savedSlot.setAttribute('aria-hidden', 'true');
    savedSlot.style.setProperty('--saved-n', savedSnapshots.length);
    savedSlot.innerHTML = '<span>Saved records</span>';
    tlStageEl?.append(savedSlot, savedShelf, finalSnapshot);
    /* Reduced motion: the MRI slices stay on the poster frame. */
    const patientSummary = tlScene.querySelector('.tl-patient-summary');
    const summaryHome = document.createComment('patient summary');
    patientSummary?.before(summaryHome);
    const fitTimeline = () => {
      if (!tlStageEl || !tlHeadEl) return;
      const stageH = tlStageEl.clientHeight;
      const mainBody = tlItems[tlItems.length - 1].querySelector('.tl-body');
      const bodyTop = mainBody?.offsetTop || 0;
      const bodyHeight = mainBody?.offsetHeight || tlItems[tlItems.length - 1].offsetHeight;
      const menuH = menuBottom();
      const placeRail = railY => {
        tlScene.style.setProperty('--rail-y', `${Math.round(railY)}px`);
        /* The title sits halfway between the menu bar and the timeline line. */
        tlScene.style.setProperty('--tl-head-top', `${Math.round((menuH + railY - 8 - tlHeadEl.offsetHeight) / 2)}px`);
        /* The final card copy sits exactly on the real last card (the list is
           raised 5px), so the hand-over to the stack does not move it. */
        tlScene.style.setProperty('--card-top', `${Math.round(railY - 5 + bodyTop)}px`);
      };
      placeRail(stageH / 2 - bodyTop - bodyHeight / 2 + 6);
      /* One deck height for the saved cards and the final card: the final
         card's natural height, never less than a stop card. */
      const finalCardBody = finalSnapshot.querySelector('.tl-body');
      if (finalCardBody) {
        tlScene.style.removeProperty('--deck-h');
        const deckH = finalCardBody.offsetHeight;
        if (deckH) tlScene.style.setProperty('--deck-h', `${deckH}px`);
      }
      /* The saved cards keep their real size in the slot whenever the space
         beside the focused card allows it; on narrower screens they scale
         down just enough to fit. Phones use their own small slot (CSS). */
      const cardWidth = finalCardBody?.offsetWidth || 400;
      if (innerWidth > 680) {
        const room = (innerWidth - cardWidth) / 2 - 24 - 24;
        const pile = cardWidth + savedSnapshots.length * 6;
        const fit = Math.max(.4, Math.min(1, (room - 2 * 30) / pile));
        savedSlot.style.setProperty('--S', fit.toFixed(3));
        savedShelf.style.setProperty('--S', fit.toFixed(3));
        savedSlot.style.removeProperty('--Sw');
        savedShelf.style.removeProperty('--Sw');
        /* The patient portrait heads the saved-records slot. */
        if (patientSummary && patientSummary.parentNode !== savedSlot) savedSlot.append(patientSummary);
      } else {
        savedSlot.style.removeProperty('--S');
        savedShelf.style.removeProperty('--S');
        /* Phones: no slot beside the card, so the portrait goes back next to the title. */
        if (patientSummary && patientSummary.parentNode === savedSlot) summaryHome.after(patientSummary);
      }
      /* Desktop: the shared layout with the findings. The content starts at
         the top of the line's dot, 8px above the line, and ends at the lowest
         of the card with the link under it and the saved records. */
      if (innerWidth > 900) {
        const cta = tlScene.querySelector('.tl-cta');
        const below = Math.max(
          bodyTop - 5 + (finalCardBody?.offsetHeight || bodyHeight) + (cta?.offsetHeight ? cta.offsetHeight + 30 : 0),
          29 + savedSlot.offsetHeight);
        const titleEl = tlHeadEl.querySelector('h2') || tlHeadEl;
        reportContent('timeline', 8 + below);
        const { titleTop, contentTop } = sharedLayout(stageH, menuH, titleEl.offsetHeight);
        placeRail(contentTop + 8);
        tlScene.style.setProperty('--tl-head-top', `${Math.round(titleTop - titleEl.offsetTop)}px`);
        /* The saved records also scale down to end one gap above the bottom
           of the screen, the same space the findings leave under their link. */
        const S = parseFloat(savedSlot.style.getPropertyValue('--S')) || 1;
        const deckPart = ((finalCardBody?.offsetHeight || 0) + savedSnapshots.length * 6) * S;
        const room = stageH - (titleTop - menuH) - (contentTop + 8 + 29);
        if (deckPart && savedSlot.offsetHeight > room) {
          const fitV = Math.max(.4, S * (room - (savedSlot.offsetHeight - deckPart)) / deckPart);
          /* Only the cards shrink; the slot keeps its width for the patient header. */
          savedSlot.style.setProperty('--Sw', S.toFixed(3));
          savedShelf.style.setProperty('--Sw', S.toFixed(3));
          savedSlot.style.setProperty('--S', fitV.toFixed(3));
          savedShelf.style.setProperty('--S', fitV.toFixed(3));
        }
      }
    };
    sharedRefit.timeline = fitTimeline;
    fitTimeline();
    registerLayoutTask(fitTimeline);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTimeline);
    /* content-visibility means an off-screen card reports its
       contain-intrinsic-size rather than its real height, and at load every
       card is off screen - so the first measurement was 160px short and the
       statement was placed over the bottom of the card. Measure again once
       the section is actually rendered. */
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { fitTimeline(); io.disconnect(); }
      }, { rootMargin: '200px' });
      io.observe(tlScene);
    }
    /* The track does not move at a constant rate. Each entry gets a beat to be
       read, and two of them open out into the record behind them - the travel
       holds while that happens, so the detour costs scroll rather than
       skipping the timeline forward. */
    /* The line does not stop at everything it passes. A record this long is
       mostly routine - boosters, a clear X-ray, a repeat prescription - and
       holding on each of them cost scroll without telling you anything. Only
       the entries marked data-stop are landed on; the rest stream past inside
       the move that carries you to the next one, so the record reads as long
       while taking a fraction of the travel. */
    const marks = tlItems.reduce((keep, item, index) => {
      if (item.hasAttribute('data-stop')) keep.push(index);
      return keep;
    }, []);
    if (!marks.length) tlItems.forEach((_, index) => marks.push(index));

    const segments = [];
    marks.forEach((index, n) => {
      /* Each stop holds for a beat; the scroll stop below makes sure every
         scroll lands on it. The moves between stops are long enough for the
         routine entries to be seen streaming past. */
      /* The first card holds for half the scroll it had before (.48 here,
         because the timeline has two stops less), so the record moves sooner. */
      segments.push({ kind: 'hold', index, len: n === 0 ? .48 : 1.5 });
      const next = marks[n + 1];
      if (next !== undefined) {
        /* A move across four skipped cards costs more than one across none,
           but nowhere near four times as much - that is where the time goes. */
        segments.push({ kind: 'move', index, to: next, len: 1 + (next - index - 1) * .085 });
      }
    });
    const totalLen = segments.reduce((sum, seg) => sum + seg.len, 0);
    /* Desktop: one scroll gesture, one card. Inside the timeline a wheel or
       key scroll down glides to the next stop card (up rewinds to the first), so every card
       is landed on and the entries between them stream past. The rest of
       the gesture's momentum is ignored; a new gesture moves on. Before the
       first card and after the last one the page scrolls as normal. Phones
       keep native scrolling. */
    let stopMids = [];
    const placeTimelineStops = () => {
      const travel = (tlScene.offsetHeight - stageHeight) / SCENE_END;
      const top = geometryOf(tlScene).top;
      stopMids = [];
      let acc = 0;
      segments.forEach(seg => {
        if (seg.kind === 'hold') stopMids.push(Math.round(top + (acc + seg.len / 2) / totalLen * TIMELINE_TRAVEL_END * travel));
        acc += seg.len;
      });
    };
    placeTimelineStops();
    registerLayoutTask(placeTimelineStops);
    let gliding = false;
    let lastWheelAt = 0;
    let lastWheelDelta = 0;
    let glideEndAt = 0;
    const glideTo = target => {
      gliding = true;
      const from = scrollY;
      const span = Math.abs(target - from);
      const duration = Math.min(620, 360 + span * .28);
      const start = performance.now();
      const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const step = now => {
        const t = Math.min(1, (now - start) / duration);
        scrollTo({ top: from + (target - from) * ease(t), behavior: 'instant' });
        if (t < 1) requestAnimationFrame(step);
        else {
          gliding = false;
          glideEndAt = performance.now();
        }
      };
      requestAnimationFrame(step);
    };
    /* The stop to glide to for a scroll in direction dir from y, or null to
       let the page scroll on its own. */
    const nextStop = (y, dir) => {
      if (stopMids.length < 2) return null;
      const first = stopMids[0];
      const last = stopMids[stopMids.length - 1];
      if (dir > 0) {
        if (y >= last - 2) return null;
        if (y < first - stageHeight) return null;
        return stopMids.find(mid => mid > y + 2);
      }
      /* Scrolling up rewinds to the first card in one brief move, and the
         next upward scroll leaves the timeline as normal. */
      if (y <= first + 2) return null;
      if (y > last + stageHeight) return null;
      return first;
    };
    const timelineSteps = () => !reducedMotion.matches && !smoothScroll.matches;
    addEventListener('wheel', event => {
      if (!timelineSteps() || event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      const now = performance.now();
      const delta = Math.abs(event.deltaY);
      /* A new gesture: after a pause, a swipe stronger than the fading
         momentum of the last one, or scrolling that speeds up again more
         than a fifth of a second after landing on a card. */
      const fresh = now - lastWheelAt > 180 || delta > lastWheelDelta * 1.6 + 4 || (now - glideEndAt > 220 && delta > lastWheelDelta + 2);
      lastWheelAt = now;
      lastWheelDelta = delta;
      const dir = Math.sign(event.deltaY);
      const target = nextStop(scrollY, dir);
      if (target === null || target === undefined) {
        if (gliding) event.preventDefault();
        return;
      }
      event.preventDefault();
      if (gliding || !fresh) return;
      glideTo(target);
    }, { passive: false });
    addEventListener('keydown', event => {
      if (!timelineSteps() || event.target.closest?.('input, textarea, select, [contenteditable]')) return;
      const dir = ['ArrowDown', 'PageDown', ' '].includes(event.key) ? (event.shiftKey && event.key === ' ' ? -1 : 1)
        : ['ArrowUp', 'PageUp'].includes(event.key) ? -1 : 0;
      if (!dir) return;
      const target = nextStop(scrollY, dir);
      if (target === null || target === undefined) return;
      event.preventDefault();
      if (!gliding) glideTo(target);
    });

    const drawTimeline = () => {
      const rawProgress = trackProgress(tlScene) * SCENE_END;
      const progress = clamp(rawProgress / TIMELINE_TRAVEL_END);
      const stackBase = smooth(clamp(
        (rawProgress - TIMELINE_TRAVEL_END) / (STACK_END - TIMELINE_TRAVEL_END)
      ));
      const stackProgress = stackBase;
      tlScene.style.setProperty('--stack', stackProgress.toFixed(4));
        savedShelf.style.setProperty('--saved-stack', stackProgress.toFixed(4));
      savedShelf.style.setProperty('--saved-content', smooth(clamp((stackProgress - .08) / .22)).toFixed(4));
      tlScene.classList.toggle('is-stacking', stackProgress > .001);
      const cardsExit = smooth(clamp((rawProgress - STACK_END) / (TIMELINE_END - STACK_END)));
      tlScene.style.setProperty('--cards-exit', cardsExit.toFixed(4));
      savedShelf.style.setProperty('--saved-exit', cardsExit.toFixed(4));
      const processVisible = smooth(clamp((rawProgress - PROCESS_START) / (.672 - PROCESS_START)));
      const processGrow = smooth(clamp((rawProgress - TIMELINE_END) / (PROCESS_IN_END - TIMELINE_END)));
      const processOut = smooth(clamp((rawProgress - .94) / (.985 - .94)));
      tlScene.style.setProperty('--process-intro', (processVisible * (1 - processOut)).toFixed(4));
      tlScene.style.setProperty('--process-grow', processGrow.toFixed(4));
      tlScene.style.setProperty('--process-spin', clamp(
        (rawProgress - PROCESS_START) / (1 - PROCESS_START)
      ).toFixed(4));
      const statusWindow = (start, hold, end) => (
        smooth(clamp((rawProgress - start) / (hold - start))) *
        (1 - smooth(clamp((rawProgress - hold) / (end - hold))))
      );
      tlScene.style.setProperty('--status-thinking', statusWindow(.705, .76, .795).toFixed(4));
      tlScene.style.setProperty('--status-reviewing', statusWindow(.775, .83, .865).toFixed(4));
      tlScene.style.setProperty('--status-synthesizing', smooth(clamp(
        (rawProgress - .845) / (.90 - .845)
      )).toFixed(4));
      const ready = 1 - smooth(clamp((rawProgress - VEIL_START) / (VEIL_END - VEIL_START)));
      workHost?.style.setProperty('--ready', ready.toFixed(4));
      const at = progress * totalLen;
      let acc = 0;
      let pos = 0;
      let rushAt = 0;
      for (const seg of segments) {
        if (at <= acc + seg.len || seg === segments[segments.length - 1]) {
          const t = clamp((at - acc) / seg.len);
          pos = seg.kind === 'move' ? seg.index + (seg.to - seg.index) * smooth(t) : seg.index;
          if (seg.kind === 'move') rushAt = clamp((seg.to - seg.index) * 6 * t * (1 - t) / 10);
          break;
        }
        acc += seg.len;
        pos = seg.kind === 'move' ? seg.to : seg.index;
      }
      tlTrack.style.setProperty('--pos', pos.toFixed(4));
      let savedAny = 0;
      let topSaved = null;
      savedSnapshots.forEach(({ index, node }) => {
        const savedIn = smooth(clamp((pos - index - .12) / .55));
        node.style.setProperty('--saved-in', savedIn.toFixed(4));
        savedAny = Math.max(savedAny, savedIn);
        if (savedIn > .001) topSaved = node;
      });
      /* The newest saved record is the top of the pile and shows its
         content; the ones under it are only edges. It stays on top while
         the pile merges into the stack. */
      savedSnapshots.forEach(({ node }) => node.classList.toggle('is-current', node === topSaved));
      savedShelf.style.setProperty('--saved-any', savedAny.toFixed(4));
      /* Each card is written just before it lands on the focus point, so the
         line reads as the record being assembled rather than retrieved. The
         backs are not generated - those are the sources it was built from. */
      /* Only the cards near the focus can be mid-generation; the rest are
         settled at 0 or 1 and are off screen anyway. Walking all of them was
         fine at seventeen and is not at a hundred and sixty-five. */
      const from = Math.max(0, Math.floor(pos) - 4);
      const to = Math.min(tlItems.length, Math.ceil(pos) + 5);
      for (let index = from; index < to; index++) {
        const item = tlItems[index];
        const gen = clamp((pos - index + 1.15) / .55).toFixed(2);
        if (item.dataset.gen !== gen) {
          item.dataset.gen = gen;
          item.style.setProperty('--gen', gen);
          /* Charts draw in once the card is written (CSS transitions). */
          item.classList.toggle('is-undrawn', gen < 1);
        }
      }
      /* Everything behind the window is written, everything ahead is not. */
      if (settledTo < from) {
        for (let index = settledTo; index < from; index++) {
          if (tlItems[index].dataset.gen !== '1.00') {
            tlItems[index].dataset.gen = '1.00';
            tlItems[index].style.setProperty('--gen', '1.00');
            tlItems[index].classList.remove('is-undrawn');
          }
        }
        settledTo = from;
      }
      /* How fast the track is travelling. Thirty-five of the forty cards are
         only ever seen in passing, and this is what makes them read as
         streaming by rather than as a row that happens to move.

         Taken from the easing curve rather than from the change since the
         last frame: these run on scroll events, so a frame-to-frame delta
         freezes at whatever it last saw when you stop scrolling, leaving the
         card you just landed on smeared. The derivative of smooth() is
         6t(1-t), which is zero at both ends of a move and zero on a hold. */
      tlScene.style.setProperty('--rush', rushAt.toFixed(3));
      const active = Math.round(pos);
      if (active === lastActive) return;
      if (lastActive >= 0) tlItems[lastActive]?.classList.remove('is-active');
      tlItems[active]?.classList.add('is-active');
      /* The focus marker pings each time a card lands on it. Two classes
         with the same keyframes restart the animation without a reflow. */
      if (tlFocus && lastActive >= 0) {
        const ping = tlFocus.classList.contains('is-ping-a') ? 'is-ping-b' : 'is-ping-a';
        tlFocus.classList.remove('is-ping-a', 'is-ping-b');
        tlFocus.classList.add(ping);
      }
      lastActive = active;
    };

    /* n1.care hand-off, built like the Heartbeat sign-off deck. The card
       section starts where this scene stops being pinned and lies over its
       last screen. At that moment a copy of the deck takes over in the same
       place, inside the cards' pinned stage, and the original hides, so the
       deck stays put while the timeline scrolls away under it. Then it drops
       down into the first card as that card rises in, and goes behind it. */
    const story = document.querySelector('#clinician-prepared .prepared-story');
    const storySteps = story?.querySelector('.prepared-story-steps');
    const firstCard = story?.querySelector('.prepared-story-card');
    if (story && storySteps && firstCard && finalBody) {
      const handoff = document.createElement('div');
      handoff.className = 'tl-handoff';
      handoff.setAttribute('aria-hidden', 'true');
      handoff.innerHTML = '<i></i><i></i>';
      const handoffCard = finalSnapshot.cloneNode(true);
      handoffCard.querySelectorAll('video').forEach(video => video.remove());
      handoff.append(handoffCard);
      storySteps.append(handoff);
      let start = null;
      const drawHandoff = () => {
        const sceneBox = geometryOf(tlScene);
        const handAt = sceneBox.top + sceneBox.height - stageHeight;
        if (sceneY < handAt - 1) {
          /* Still pinned: remember where the deck sits on screen. */
          const box = finalSnapshot.getBoundingClientRect();
          if (box.width) start = { left: box.left, top: box.top, width: box.width, height: box.height };
          tlScene.classList.remove('is-handed');
          handoff.style.opacity = '0';
          return;
        }
        if (!start) return;
        tlScene.classList.add('is-handed');
        const stepsBox = storySteps.getBoundingClientRect();
        const storyBox = geometryOf(story);
        const introDistance = Math.max(1, (storyBox.height - innerHeight) * .22);
        const intro = clamp((sceneY - storyBox.top) / introDistance);
        /* The first card rises from 58% of a screen below (prepared-story.js). */
        const cardCentre = stepsBox.top + firstCard.parentElement.offsetTop + firstCard.offsetTop
          + firstCard.offsetHeight / 2 + (1 - smooth(intro)) * innerHeight * .58;
        const fall = smooth(clamp(intro / .45));
        const startCentre = start.top + start.height / 2;
        const centre = startCentre + (cardCentre - startCentre) * fall;
        handoff.style.width = `${start.width}px`;
        handoff.style.left = `${(start.left - stepsBox.left).toFixed(1)}px`;
        handoff.style.top = `${(centre - start.height / 2 - stepsBox.top).toFixed(1)}px`;
        handoff.style.scale = (1 - fall * .08).toFixed(4);
        handoff.style.opacity = (1 - smooth(clamp((intro - .55) / .35))).toFixed(3);
      };
      registerScene(drawHandoff);
      registerLayoutTask(() => { start = null; });
    }
    sceneObserver?.observe(tlScene);
    registerScene(drawTimeline, tlScene);
    drawTimeline();
  }

  /* Reduced motion: the MRI clip stays on its poster frame. */
  if (reducedMotion.matches) for (const video of document.querySelectorAll('.tl-scan video')) { video.removeAttribute('autoplay'); video.pause(); }
  /* Phones only, to save memory: the copies of the cards show the poster,
     and the live clip plays only while on screen. */
  if (matchMedia('(max-width: 680px)').matches) {
    for (const video of document.querySelectorAll('.tl-saved-card video, .tl-final-card video')) {
      const still = document.createElement('img');
      still.src = video.poster;
      still.alt = '';
      still.decoding = 'async';
      still.className = 'is-still';
      video.replaceWith(still);
    }
    const clips = [...document.querySelectorAll('.tl-scan video')];
    for (const video of clips) {
      video.removeAttribute('autoplay');
      video.preload = 'none';
    }
    if (!reducedMotion.matches && 'IntersectionObserver' in window) {
      const clipObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.play().catch(() => {});
          else entry.target.pause();
        }
      });
      clips.forEach(video => clipObserver.observe(video));
    }
  }
  wake();
})();
