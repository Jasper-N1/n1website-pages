/* The scroll driver for the home header. Lifted whole from the heartbeat
   build: every block that belongs to a section this page does not have is
   already guarded, so only the header runs here. */

    /* Every pinned stage is one --stage-h tall, and that is the box the whole
       animation has to fill and be measured against - not innerHeight.

       On a phone the two are different things. innerHeight is the area you can
       actually see, which grows by the height of the address bar the moment
       that bar slides away. A sticky element pins against the layout viewport,
       which does not move. Sizing the stage from innerHeight left a strip of
       the next section showing under it - a pale band on the way into the chat
       - and made a stage that fills nothing look like it had scrolled rather
       than animated. A desktop window has no address bar to lose, which is why
       none of this shows up there. */
    const stageProbe = document.createElement('div');
    stageProbe.setAttribute('aria-hidden', 'true');
    stageProbe.style.cssText =
      'position:absolute;top:0;left:0;width:0;height:var(--stage-h);visibility:hidden;pointer-events:none';
    document.documentElement.appendChild(stageProbe);
    let stageHeight = stageProbe.offsetHeight || innerHeight;
    const measureStage = () => { stageHeight = stageProbe.offsetHeight || innerHeight; };

    const cards = [...document.querySelectorAll('.float-card')];
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const singularity = document.querySelector('.singularity');
    const focal = document.querySelector('.focal');
    let gatherCharge = 0;
    let gatherRelease = 0;
    const cardField = document.querySelector('.card-field');
    const zoomCopy = document.querySelector('.zoom-copy');
    const zoomLayer = document.querySelector('.patient-zoom');
    let zoomStart = null;
    let targetProgress = 0;
    let easedProgress = 0;
    let running = false;
    let gatherAnimations = [];
    let outerCards = [];
    const randomiseCardField = () => {
      /* This used to bail out below 1100px, which left every card sitting on
         positions tuned for a desktop hero - the field on a phone was a handful
         of oversized cards hanging off the edges. It lays out at any width now;
         only the scale changes. */
      const narrow = innerWidth <= 1100;
      const padding = narrow ? 8 : 14;
      /* Below 1100 the stylesheet used to hide all but a handful of cards,
         because they were sitting on desktop coordinates. They are placed by
         script now, so the field comes back - budgeted by width so a phone gets
         a field rather than a crowd. */
      const budget = innerWidth < 560 ? 34 : innerWidth <= 1100 ? 48 : cards.length;
      cards.forEach((card, index) => { card.style.display = index < budget ? '' : 'none'; });
      const occupied = [];
      cards.forEach(card => {
        /* Hidden at this breakpoint - no size, so nothing to place. */
        if (!card.offsetWidth) return;
        const scale = narrow
          ? .34 + Math.random() * .16
          : .68 + Math.random() * .24;
        const width = card.offsetWidth * scale;
        const height = card.offsetHeight * scale;
        let best = null;
        let bestClearance = -Infinity;
        for (let attempt = 0; attempt < 180; attempt += 1) {
          const left = padding + Math.random() * Math.max(1, innerWidth - width - padding * 2);
          const top = padding + Math.random() * Math.max(1, innerHeight - height - padding * 2);
          const candidate = { left, top, right: left + width, bottom: top + height };
          const clearance = occupied.reduce((nearest, item) => {
            const horizontal = Math.max(item.left - candidate.right, candidate.left - item.right, 0);
            const vertical = Math.max(item.top - candidate.bottom, candidate.top - item.bottom, 0);
            const overlap = horizontal === 0 && vertical === 0;
            return Math.min(nearest, overlap ? -1 : Math.hypot(horizontal, vertical));
          }, Infinity);
          if (clearance > bestClearance) { best = candidate; bestClearance = clearance; }
          if (clearance >= 7) break;
        }
        occupied.push(best);
        /* The box we packed is the SCALED size, but left/top position the
           unscaled element, which then scales about its own centre - so it
           spills half the difference past the box on each side and clips at the
           viewport edge. Offset by that half. */
        card.style.left = `${best.left - (card.offsetWidth - width) / 2}px`;
        card.style.top = `${best.top - (card.offsetHeight - height) / 2}px`;
        card.style.setProperty('--layout-scale', scale.toFixed(3));
        card.style.setProperty('--layout-rotate', `${(-6 + Math.random() * 12).toFixed(2)}deg`);
        card.style.zIndex = String(2 + Math.floor(Math.random() * 7));
      });

      /* Four more fields' worth of the real cards, parked in a ring beyond the
         edges of the screen. These are the cards themselves, not stand-ins: a
         sprite that only approximates a card reads as a swap the moment the two
         are the same size. What made this expensive was backdrop-filter, and
         that is gone. */
      outerCards.forEach(clone => clone.remove());
      outerCards = [];
      const onScreen = cards.filter(card => card.offsetWidth);
      if (!onScreen.length || reducedMotion.matches) return;
      const reach = Math.hypot(innerWidth, innerHeight) / 2;
      for (let i = 0; i < onScreen.length * 4; i += 1) {
        const clone = onScreen[i % onScreen.length].cloneNode(true);
        const angle = Math.random() * Math.PI * 2;
        const radius = reach * (1.15 + Math.random() * 1.15);
        const scale = (narrow ? .3 : .6) + Math.random() * .22;
        clone.classList.add('is-outer');
        clone.style.left = `${innerWidth / 2 + Math.cos(angle) * radius}px`;
        clone.style.top = `${innerHeight / 2 + Math.sin(angle) * radius}px`;
        clone.style.setProperty('--layout-scale', scale.toFixed(3));
        clone.style.setProperty('--layout-rotate', `${(-14 + Math.random() * 28).toFixed(2)}deg`);
        clone.style.zIndex = '1';
        cardField.appendChild(clone);
        outerCards.push(clone);
      }
    };
    randomiseCardField();

    const prepareZoomTarget = () => {
      /* Everything converges on one point in the middle of the screen, and the
         image is born out of that same point rather than being one of the
         cards - so nothing in the field gives the ending away. */
      const targetX = innerWidth / 2;
      const targetY = stageHeight / 2;
      zoomStart = { left: targetX - 6, top: targetY - 6, width: 12, height: 12 };
      gatherAnimations.forEach(({ animation }) => animation.cancel());
      gatherAnimations = [];
      if (reducedMotion.matches) return;
      [...cards, ...outerCards].forEach((card, index) => {
        if (!card.offsetWidth) return;
        const outer = card.classList.contains('is-outer');
        const rect = card.getBoundingClientRect();
        const x = targetX - (rect.left + rect.width / 2);
        const y = targetY - (rect.top + rect.height / 2);
        const distance = Math.max(1, Math.hypot(x, y));
        /* A card enters from the corner of the quadrant it belongs to, so a
           card that lives top-right comes in from top-right. Nothing crosses
           the screen to reach its place. */
        const cornerX = rect.left + rect.width / 2 > targetX ? 1 : -1;
        const cornerY = rect.top + rect.height / 2 > targetY ? 1 : -1;
        /* One direction of swirl for every card, not alternating: the
           tangential offset has to agree across the whole field or it reads as
           cards wandering rather than as one vortex. It decays as the radius
           does, which is what makes the path a spiral instead of an arc. */
        const swirl = Math.min(300, distance * .82);
        const tangentX = (-y / distance) * swirl;
        const tangentY = (x / distance) * swirl;
        const entry = outer
          /* Outer cards take no part in the arrival - they hold station, unseen,
             until the vortex starts, and are lit the instant it does. */
          ? [{ translate: '0 0', scale: '1', rotate: '0deg', opacity: 0, offset: 0 },
             { translate: '0 0', scale: '1', rotate: '0deg', opacity: 0, offset: .49 },
             { translate: '0 0', scale: '1', rotate: '0deg', opacity: .95, offset: .5 }]
          : [{ translate: `${cornerX * innerWidth * .8}px ${cornerY * innerHeight * .8}px`, scale: '.5', rotate: `${cornerX * 14}deg`, opacity: 0, offset: 0 },
             { translate: '0 0', scale: '1', rotate: '0deg', opacity: 1, offset: .5 }];
        const animation = card.animate([
          ...entry,
          { translate: `${x * .34 + tangentX}px ${y * .34 + tangentY}px`, scale: '.8', rotate: '20deg', opacity: 1, offset: .68 },
          { translate: `${x * .68 + tangentX * .55}px ${y * .68 + tangentY * .55}px`, scale: '.5', rotate: '58deg', opacity: 1, offset: .84 },
          { translate: `${x * .92 + tangentX * .2}px ${y * .92 + tangentY * .2}px`, scale: '.18', rotate: '104deg', opacity: .85, offset: .95 },
          { translate: `${x}px ${y}px`, scale: '.02', rotate: '146deg', opacity: 0, offset: 1 }
        ], { duration: 2000, fill: 'both', easing: 'linear' });
        animation.pause();
        animation.currentTime = 0;
        /* Latest possible finish: .03 + .072 + .08 + .335 = .517, which is
           what the image start below is keyed to. Change one, change both. */
        /* Outer cards have several screens to cross, so they get the whole
           collapse to do it in. Given the on-screen window they covered that
           distance in a third of the time and simply blurred past. */
        const distanceDelay = Math.min(.08, distance / Math.hypot(innerWidth, innerHeight) * .1);
        const start = outer
          ? .015 + (index % 9) * .008
          : .03 + (index % 7) * .012 + distanceDelay;
        const duration = outer
          ? .42 + (index % 5) * .018
          : .26 + (index % 5) * .015;
        gatherAnimations.push({ animation, start, end: start + duration });
      });
    };
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    scrollTo(0, 0);
    const clamp = value => Math.max(0, Math.min(1, value));
    const mix = (from, to, progress) => from + (to - from) * progress;
    const smooth = progress => progress * progress * (3 - 2 * progress);
    const renderImageZoom = progress => {
      if (!zoomStart) return;
      gatherAnimations.forEach(({ animation, start, end }) => {
        animation.currentTime = 1000 + smooth(clamp((progress - start) / (end - start))) * 1000;
      });
      /* The dot brightens as the cards arrive, then hands over: it is gone by
         the time the image has opened out of it. */
      const collapsing = smooth(clamp((progress - .12) / .4));
      const handover = smooth(clamp((progress - .52) / .09));
      gatherCharge = collapsing;
      gatherRelease = handover;

      /* Opens while the last cards are still on their way in, so the image
         is already coming out of the point rather than waiting for silence. */
      const rawZoom = clamp((progress - .42) / .28);
      const zoom = smooth(rawZoom);
      const frameW = mix(zoomStart.width, innerWidth, zoom);
      const frameH = mix(zoomStart.height, stageHeight, zoom);
      zoomLayer.style.left = `${mix(zoomStart.left, 0, zoom)}px`;
      zoomLayer.style.top = `${mix(zoomStart.top, 0, zoom)}px`;
      zoomLayer.style.width = `${frameW}px`;
      zoomLayer.style.height = `${frameH}px`;
      /* A px corner stays a rounded rectangle at every size; a percentage
         turns into an ellipse as the frame widens. Round while it is small
         enough to read as a dot, then a steady corner it keeps all the way
         out, squaring off only as it fills the screen. */
      const corner = Math.min(Math.min(frameW, frameH) / 2, 30);
      zoomLayer.style.borderRadius = `${corner * (1 - smooth(clamp((rawZoom - .88) / .12)))}px`;
      zoomLayer.style.setProperty('--overlay-opacity', zoom);
      zoomLayer.style.opacity = zoom > .001 ? '1' : '0';
      cardField.style.setProperty('--field-fade', clamp((progress - .52) / .06));
      /* Open by .72, copy settled by .80, then .80-1.0 is a hold on the
         picture before the journey lets the page move on. */
      const copyProgress = smooth(clamp((progress - .7) / .1));
      zoomCopy.style.opacity = String(copyProgress);
      zoomCopy.style.transform = `translateY(${mix(24, 0, copyProgress)}px)`;
    };
    prepareZoomTarget();
    const journey = document.querySelector('.zoom-journey');
    const heartAct = document.querySelector('.heart-act');
    /* The journey is scrubbed by the scrollbar rather than played on a timer.
       The opening copy holds the start, the card field fades up behind it,
       and the original gather-and-zoom sequence owns the rest. */
    const SEQUENCE_START = .49;
    const paint = progress => {
      /* Title out, then the three blobs run together into the point, then the
         record field comes up out of it. */
      const titleOut = smooth(clamp((progress - .04) / .11));
      heartAct.style.opacity = String(1 - titleOut);
      heartAct.style.transform = `translateY(${mix(0, -28, titleOut)}px)`;

      const pull = smooth(clamp((progress - .055) / .185));
      focal.style.setProperty('--pull', pull.toFixed(4));

      const cardsIn = smooth(clamp((progress - .24) / .2));
      cardField.style.setProperty('--intro', String(cardsIn));

      renderImageZoom(clamp((progress - SEQUENCE_START) / (1 - SEQUENCE_START)));

      /* Before the sequence proper, the field comes OUT of the point: the same
         gather animations, scrubbed backwards. Runs after renderImageZoom
         because both write currentTime and this one has to win. */
      if (progress < SEQUENCE_START && gatherAnimations.length) {
        /* Half again as much scroll as the collapse, so the field arrives
           at an unhurried pace. */
        const emerge = smooth(clamp((progress - .24) / .25));
        const last = Math.max(1, gatherAnimations.length - 1);
        gatherAnimations.forEach(({ animation }, index) => {
          const local = smooth(clamp((emerge - (index / last) * .34) / .58));
          animation.currentTime = local * 1000;
        });
      }

      /* The dot is lit twice - once by the blobs arriving, once by the cards -
         so whichever phase is brighter owns it. */
      /* Two quantities, not one: how much has fallen in, and the moment it lets
         go. Charge tightens and brightens the core - energy concentrating, not
         a blob swelling - and release fires the ring and the streak. */
      singularity.style.setProperty('--charge', Math.max(pull * (1 - cardsIn), gatherCharge).toFixed(4));
      singularity.style.setProperty('--release', gatherRelease.toFixed(4));
      /* The thread is scrubbed the same way; each message carries the scroll
         position it arrives at as --s, and CSS does the rest. */
    };
    /* One scroll listener and one frame loop for the whole page.

       Every scene used to listen to scroll itself and measure inside the
       handler, so a single trackpad flick - which fires scroll far more often
       than once a frame - forced a layout per scene per event, and four rAF
       loops then competed for the same frame. Scrolling fast, scrolling slow
       and stopping all behaved differently because the work was tied to event
       frequency rather than to frames.

       Now: scroll only marks the page dirty, and once a frame every scene is
       measured and written in a fixed order. */
    const scenes = [];
    let reportBuild = 0;   /* how far the report has written itself */
    let scrollDirty = true;
    let loopOn = false;
    let lastStamp = 0;

    /* Geometry only changes when the page is laid out again, but the loop was
       measuring it every frame - and measuring after the previous scene had
       already written meant the browser re-ran layout once per scene, per
       frame. The offsets are cached and thrown away on resize instead, so a
       scroll frame is writes only. -rect.top is the same number as
       scrollY - absoluteTop for an untransformed block in flow, which is what
       every one of these sections is. */
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
    const trackProgress = element => {
      const box = geometryOf(element);
      const travel = box.height - stageHeight;
      return travel > 0 ? clamp((scrollY - box.top) / travel) : 0;
    };
    const readTarget = () => {
      targetProgress = trackProgress(journey);
    };
    /* The sequence eases toward the scroll position on its own frame loop.
       Scheduling a frame per scroll event instead lets a fast gesture cancel
       its own pending frame over and over, so the whole change lands in one
       jump when the gesture stops; this moves on every frame either way. */
    /* Frame-rate independent easing. The old `gap * .14 per frame` ran twice as
       fast on a 120Hz screen and slowed down under load, which is why the
       header felt different depending on the machine and on how busy the frame
       was. A time constant gives the same curve at any refresh rate. */
    const EASE_MS = 110;
    const runFrame = stamp => {
      const dt = lastStamp ? Math.min(64, stamp - lastStamp) : 16;
      lastStamp = stamp;

      if (scrollDirty) {
        scrollDirty = false;
        readTarget();
        scenes.forEach(scene => scene());
      }

      const gap = targetProgress - easedProgress;
      easedProgress = Math.abs(gap) < .0002
        ? targetProgress
        : easedProgress + gap * (1 - Math.exp(-dt / EASE_MS));
      paint(easedProgress);

      loopOn = scrollDirty || easedProgress !== targetProgress;
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
    addEventListener('resize', wake);
    readTarget();
    easedProgress = targetProgress;
    paint(easedProgress);
    let frame = 0;
    const moveCards = event => {
      if (reducedMotion.matches) return;
      const x = event.clientX / innerWidth - .5;
      const y = event.clientY / innerHeight - .5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => cards.forEach(card => {
        const depth = Number(card.dataset.depth || 1);
        card.style.setProperty('--mouse-x', `${x * depth * 18}px`);
        card.style.setProperty('--mouse-y', `${y * depth * 14}px`);
      }));
    };

    /* The timeline reveals on each entry's own position rather than on a scroll
       ratio, once each and for good: arriving on a ratio rather than on where
       the entry actually is - and un-writing itself when you scroll back up -
       is what made it feel unsteady. The spine lights to the last revealed dot,
       so line and dots always agree. */
    /* Scroll-scrubbed, with the typing pauses kept. Every thread, not just the
       first: querySelector returns one node, which is why the second thread sat
       empty once it existed. */
    const chatStages = [...document.querySelectorAll('.chat-scene')].map(scene => ({
      scene,
      stage: scene.querySelector('.chat-stage'),
    }));
    if (chatStages.length) {
      let chatFrame = 0;
      const drawChats = () => {
        chatStages.forEach(({ scene, stage }) => {
          if (stage) stage.style.setProperty('--chat', trackProgress(scene).toFixed(4));
        });
      };
      scenes.push(drawChats);
      drawChats();
    }

    /* The timeline runs sideways now: vertical scroll drives the track past a
       fixed focal marker, and whichever entry is nearest it is the live one.
       Position is continuous rather than snapped, so it glides; the highlight
       is discrete, so there is always exactly one entry being read. */
    /* The two moments where N1 is working: scrubbed like everything else, so
       the lines land as you arrive at them rather than on a timer you missed. */
    /* An autoplaying loop is motion the visitor did not ask for. */
    if (reducedMotion.matches) {
      document.querySelectorAll('.trust-animation video').forEach(video => {
        video.autoplay = false;
        video.pause();
      });
    }


    /* The loader stands in for the content rather than sitting in a section of
       its own: you arrive, N1 is working, and a couple of seconds later the
       thing it was working on is there instead.

       Two ways out, because the timer alone was not enough. A fast scroll can
       carry you past a threshold without the observer ever reporting it, and a
       0.25 threshold made that easy - so it fires on any intersection at all,
       and the scroll driver below hands over the moment you are actually into
       the section. Whichever comes first wins; the loader can never outlast the
       content it is standing in for. */
    let timelineReady = () => {};
    document.querySelectorAll('.ai-load').forEach(load => {
      const host = load.closest('.tl-stage');
      if (!host) return;
      host.style.setProperty('--ready', '0');
      let handoverTimer = 0;
      let handedOver = false;
      timelineReady = () => {
        if (handedOver) return;
        handedOver = true;
        clearTimeout(handoverTimer);
        host.style.setProperty('--ready', '1');
      };
      new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          /* The stream starts when you arrive, not when the page loaded. A
             CSS animation begins the moment its element is rendered, so left
             alone the whole chain had already run itself by the time anyone
             scrolled this far - which is why it read as arriving complete. */
          load.classList.add('is-running');
          handoverTimer = setTimeout(timelineReady, reducedMotion.matches ? 0 : 4600);
        });
      }, { threshold: 0 }).observe(host);
    });

    const tlScene = document.querySelector('.timeline-scene');
    const tlTrack = document.querySelector('.tl-list');
    const tlItems = [...document.querySelectorAll('.tl-entry')];
    if (tlScene && tlTrack && tlItems.length) {
      let tlFrame = 0;
      let lastActive = -1;
      const tlDeeps = [...document.querySelectorAll('.tl-deep')];
      const deepFor = new Set(tlDeeps.map(panel => Number(panel.dataset.for)));
      /* The track does not move at a constant rate. Each entry gets a beat to be
         read, and two of them open out into the record behind them - the travel
         holds while that happens, so the detour costs scroll rather than
         skipping the timeline forward. */
      const segments = [];
      tlItems.forEach((item, index) => {
        /* The first entry holds far longer than the rest. The loader clears on
           a scroll threshold, and with an even hold the track had already
           travelled a third of the way to the second card by the time you could
           see it - so the timeline appeared to open on the wrong entry. This
           gives the first card the room to be the one you land on. */
        segments.push({ kind: 'hold', index, len: index === 0 ? 3 : .8 });
        if (deepFor.has(index)) segments.push({ kind: 'deep', index, len: 5.2 });
        if (index < tlItems.length - 1) segments.push({ kind: 'move', index, len: 1.2 });
      });
      segments.push({ kind: 'report', index: tlItems.length - 1, len: 10 });
      const totalLen = segments.reduce((sum, seg) => sum + seg.len, 0);

      const drawTimeline = () => {
        const progress = trackProgress(tlScene);
        /* Past the first sliver of the section the line is what you came for. */
        if (progress > .055) timelineReady();
        const at = progress * totalLen;
        let acc = 0;
        let pos = 0;
        let deepIndex = -1;
        let zoom = 0;
        let flip = 0;
        let build = 0;
        for (const seg of segments) {
          if (at <= acc + seg.len || seg === segments[segments.length - 1]) {
            const t = clamp((at - acc) / seg.len);
            pos = seg.kind === 'move' ? seg.index + t : seg.index;
            if (seg.kind === 'report') build = t;
            if (seg.kind === 'deep') {
              deepIndex = seg.index;
              /* A third of the detour is spent coming in, so the card grows into
                 the screen rather than snapping to it. */
              zoom = t < .34 ? smooth(t / .34) : t > .76 ? 1 - smooth((t - .76) / .24) : 1;
              flip = smooth(clamp((t - .44) / .26));
            }
            break;
          }
          acc += seg.len;
          pos = seg.kind === 'move' ? seg.index + 1 : seg.index;
        }
        tlTrack.style.setProperty('--pos', pos.toFixed(4));
        /* Each card is written just before it lands on the focus point, so the
           line reads as the record being assembled rather than retrieved. The
           backs are not generated - those are the sources it was built from. */
        tlItems.forEach((item, index) => {
          const gen = clamp((pos - index + 1.15) / .55).toFixed(2);
          if (item.dataset.gen !== gen) {
            item.dataset.gen = gen;
            item.style.setProperty('--gen', gen);
          }
        });
        tlScene.style.setProperty('--deep', zoom.toFixed(4));
        reportBuild = build;
        /* Once the report has covered them, the line's seventeen cards and the
           scatter of ticks behind it are still being painted at zero opacity.
           Taking them out of rendering is what the beat costs back. */
        const covered = build > .07;
        if (covered !== tlScene.classList.contains('is-report')) {
          tlScene.classList.toggle('is-report', covered);
        }
        tlScene.style.setProperty('--build', build.toFixed(4));
        tlDeeps.forEach(panel => {
          const on = Number(panel.dataset.for) === deepIndex;
          panel.style.setProperty('--zoom', on ? zoom.toFixed(4) : '0');
          panel.style.setProperty('--flip', on ? flip.toFixed(4) : '0');
          panel.style.visibility = on && zoom > .001 ? 'visible' : 'hidden';
        });
        const active = Math.round(pos);
        if (active === lastActive) return;
        lastActive = active;
        tlItems.forEach((item, index) => item.classList.toggle('is-active', index === active));
      };
      scenes.push(drawTimeline);
      drawTimeline();

      /* The report is a fixed composition that has to be read whole, and its
         finished state is taller than a phone screen. Rather than let the
         stage crop it, measure the tallest block once layout has settled and
         scale the whole thing down to the room available. The clearance is
         taken from the nav, so the report keeps out from under it, and it is
         applied equally top and bottom because the report is centred - an
         uneven margin would pull it off centre as it scaled. */
      const tlReport = tlScene.querySelector('.tl-report');
      const tlStage = tlScene.querySelector('.tl-stage');
      if (tlReport && tlStage) {
        const nav = document.querySelector('.floating-nav');
        const fitReport = () => {
          /* Enough to clear the nav, but never so much that a short screen
             spends a quarter of itself on margin - which is what pushed the
             report down to a thumbnail on the smallest phones. */
          const clearance = Math.min((nav ? nav.getBoundingClientRect().bottom : 56) + 14,
            Math.max(24, tlStage.clientHeight * .09));
          const room = tlStage.clientHeight - clearance * 2;
          const tallest = Math.max(...[...tlReport.children].map(block => block.offsetHeight));
          tlReport.style.setProperty('--fit',
            tallest > room && room > 0 ? (room / tallest).toFixed(3) : '1');
        };
        fitReport();
        addEventListener('resize', fitReport);
        /* Web fonts land after first layout and change the block's height. */
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitReport);
      }
    }

    /* The ink-line video autoplays in a loop, which means it keeps decoding
       frames the whole way down a twenty-thousand pixel page for a section
       nobody is looking at yet. It runs only while it is on screen. */
    document.querySelectorAll('.trust-animation video').forEach(video => {
      new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      }, { threshold: 0 }).observe(video);
    });

    const replyStage = document.querySelector('.reply-stage');
    if (replyStage) {
      const replyScene = replyStage.closest('.reply-scene');
      const replyThread = replyStage.querySelector('.chat-thread');
      const replyMsgs = [...replyThread.children].map(node => ({
        node, at: parseFloat(node.style.getPropertyValue('--s')) || 0, bottom: 0 }));
      /* A thread with a whole report in it is taller than the screen, so it
         behaves like a thread: it scrolls up to keep the newest thing in view.
         Heights only change on resize, so they are measured there, not per
         frame. */
      const measureReply = () => {
        replyMsgs.forEach(m => { m.bottom = m.node.offsetTop + m.node.offsetHeight; });
      };
      let replyRoom = 0;
      const measureRoom = () => { replyRoom = replyThread.clientHeight; };
      const drawReply = () => {
        const at = trackProgress(replyScene);
        replyStage.style.setProperty('--chat', at.toFixed(4));
        let reach = 0;
        replyMsgs.forEach(m => { if (m.at <= at) reach = Math.max(reach, m.bottom); });
        const shift = Math.max(0, reach - stageHeight * .74);
        replyThread.style.translate = '0 ' + (-shift).toFixed(1) + 'px';
      };
      measureReply(); measureRoom();
      addEventListener('resize', () => { measureReply(); measureRoom(); });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureReply);
      scenes.push(drawReply);
      drawReply();
    }

    /* iOS paints its own status bar and toolbar with theme-color, and this page
       has five different backgrounds under it. One fixed colour matched the
       hero and clashed with everything after it - a dark teal band above and
       below a cream section, which is not the stage failing to fill but the
       browser's own chrome disagreeing with the page. The meta follows
       whichever section the viewport is actually on. Geometry comes from the
       cache, so this costs no layout. */
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      const tinted = [...document.querySelectorAll(
        '.zoom-journey, .chat-scene, .timeline-scene, .reply-scene, .cta-scene')]
        .map(el => ({ el, colour: getComputedStyle(el).backgroundColor }));
      let lastTint = '';
      const drawTheme = () => {
        const middle = scrollY + stageHeight / 2;
        let colour = tinted.length ? tinted[0].colour : '';
        for (const section of tinted) {
          const box = geometryOf(section.el);
          if (middle >= box.top && middle < box.top + box.height) {
            colour = section.colour;
            break;
          }
        }
        if (colour && colour !== lastTint) {
          lastTint = colour;
          themeMeta.setAttribute('content', colour);
        }
      };
      scenes.push(drawTheme);
      drawTheme();
    }

    /* One line, from the last thing the doctor says in the first conversation
       to the end of the reply. It is fixed to the centre of the viewport
       rather than living inside any section, because the four segments it
       replaces each sat in a sticky stage and so could never meet across a
       boundary - one had already scrolled away before the next arrived.

       The dot starts inside that last message bubble. The bubble is the same
       teal, so at first there is only a line; as you scroll it comes out of
       the message and rides down to the centre, where it stays while the
       record runs past it. */
    /* One line, from the bottom edge of the doctor's last message.

       It sits flush on that edge, so along the message it is not really a line
       at all - it is the underside of the bubble. It leaves on a quarter turn
       and holds the centre. Only the part behind the ball is ever drawn, so
       the line is something being laid down rather than something already
       there, and the ball only shows once it is clear of the message.

       The shape is a path and the ball is placed by asking that path for a
       point at a distance along it, so it is on the line by construction. */
    const threadLine = document.querySelector('.thread-line');
    const threadPath = document.querySelector('.thread-path');
    const threadDot = document.querySelector('.thread-dot');
    const lineStart = document.querySelector('.chat-scene .chat-thread > .msg:last-of-type');
    const lineEnd = document.querySelector('.reply-scene');
    if (threadLine && threadPath && threadDot && lineStart && lineEnd) {
      const chatScene = document.querySelector('.chat-scene');
      const tlScene2 = document.querySelector('.timeline-scene');
      const railEl = document.querySelector('.tl-rail');
      let unpin = 0, endY = 0, restY = 0, park = null;

      const measureLine = () => {
        const chatBox = geometryOf(chatScene);
        unpin = chatBox.top + chatBox.height - stageHeight;
        endY = geometryOf(lineEnd).top + geometryOf(lineEnd).height;
        restY = railEl ? railEl.offsetTop : stageHeight * .5;
        const box = lineStart.getBoundingClientRect();
        park = { left: box.left, right: box.right, bottom: box.bottom, top: box.top };
      };

      const msgNow = () => {
        if (scrollY <= unpin + stageHeight) {
          const box = lineStart.getBoundingClientRect();
          return { left: box.left, right: box.right, bottom: box.bottom, top: box.top };
        }
        const up = scrollY - unpin;
        return { left: park.left, right: park.right,
                 bottom: park.bottom - up, top: park.top - up };
      };

      const hide = () => {
        threadLine.style.opacity = '0';
        threadDot.style.opacity = '0';
      };

      const drawLine = () => {
        const msg = msgNow();
        const centre = innerWidth / 2;
        const tail = Math.min(endY - scrollY, stageHeight);
        /* The timeline draws its own line, and two of them crossing is one too
           many. */
        const tlBox = tlScene2 ? geometryOf(tlScene2) : null;
        const middle = scrollY + stageHeight / 2;
        const overTimeline = tlBox && middle >= tlBox.top && middle < tlBox.top + tlBox.height;
        if (scrollY < unpin - stageHeight * .55 || tail < 0 || overTimeline) return hide();
        threadLine.style.opacity = '1';

        const y0 = msg.bottom;                   /* flush with the message */
        const x0 = msg.left + 26;
        /* A quarter turn: the same distance across as down, so it reads as one
           curve rather than a corner with a tail. */
        const room = Math.max(40, centre - (msg.right + 26));
        const R = Math.min(130, room);
        const turnAt = centre - R;
        const y1 = y0 + R;

        if (y0 < -40) {
          threadPath.setAttribute('d',
            'M' + centre.toFixed(1) + ',-40L' + centre.toFixed(1) + ',' + tail.toFixed(1));
          const restOn = Math.max(-40, Math.min(restY, tail));
          /* The same rule holds once the message is gone: nothing ahead of the
             ball. */
          threadPath.style.strokeDasharray =
            (restOn + 40).toFixed(1) + ' ' + (tail + 82).toFixed(1);
          threadDot.style.opacity = restOn < -8 || restOn > stageHeight + 8 ? '0' : '1';
          threadDot.style.left = centre.toFixed(1) + 'px';
          threadDot.style.top = restOn.toFixed(1) + 'px';
          return;
        }

        const d = 'M' + x0.toFixed(1) + ',' + y0.toFixed(1)
                + 'L' + turnAt.toFixed(1) + ',' + y0.toFixed(1)
                + 'C' + (turnAt + R * .5522).toFixed(1) + ',' + y0.toFixed(1)
                + ' ' + centre.toFixed(1) + ',' + (y1 - R * .5522).toFixed(1)
                + ' ' + centre.toFixed(1) + ',' + y1.toFixed(1)
                + 'L' + centre.toFixed(1) + ',' + Math.max(y1, tail).toFixed(1);
        threadPath.setAttribute('d', d);

        /* The ball simply travels the line as you scroll - a distance along
           the path, not a height on the screen. Aiming it at a fixed height
           was the mistake: the rail sits above the message for most of this
           stretch, so the ball had nowhere to go and never left. */
        const past = Math.max(0, scrollY - unpin + stageHeight * .42);
        const total = threadPath.getTotalLength();
        const reached = Math.min(past * 1.25, total);
        const at = threadPath.getPointAtLength(reached);

        /* Only what the ball has already passed. */
        threadPath.style.strokeDasharray = reached.toFixed(1) + ' ' + (total + 1).toFixed(1);

        /* And the ball itself only once it is out from under the message. */
        const insideMsg = at.x >= msg.left - 2 && at.x <= msg.right + 2
                       && at.y >= msg.top - 2 && at.y <= msg.bottom + 2;
        threadDot.style.opacity =
          insideMsg || at.y < -8 || at.y > stageHeight + 8 ? '0' : '1';
        threadDot.style.left = at.x.toFixed(1) + 'px';
        threadDot.style.top = at.y.toFixed(1) + 'px';
      };

      measureLine();
      addEventListener('resize', measureLine);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureLine);
      scenes.push(drawLine);
      drawLine();
    }

    addEventListener('pointermove', moveCards, { passive: true });
    addEventListener('resize', () => {
      geometry.clear();
      measureStage();
      randomiseCardField();
      prepareZoomTarget();
      readTarget();
      paint(easedProgress);
    });
  