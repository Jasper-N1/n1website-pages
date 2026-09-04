'use strict';

// Settings preview — four concise screens matched to the four workflow choices.
    (function () {
      var section = document.querySelector('.tonal-patterns');
      if (!section) return;
      var points = Array.prototype.slice.call(section.querySelectorAll('[data-settings-step]'));
      var dots = Array.prototype.slice.call(section.querySelectorAll('.settings-screen-dots i'));
      var status = section.querySelector('[data-settings-status]');
      var run = section.querySelector('.settings-run');
      var cursor = section.querySelector('.settings-cursor');
      var rangePanel = section.querySelector('[data-settings-panel="0"]');
      var unitPanel = section.querySelector('[data-settings-panel="1"]');
      var notePanel = section.querySelector('[data-settings-panel="2"]');
      var reportPanel = section.querySelector('[data-settings-panel="3"]');
      var panels = [notePanel, unitPanel, reportPanel, rangePanel].filter(Boolean);
      var unitSystems = unitPanel ? Array.prototype.slice.call(unitPanel.querySelectorAll('[data-unit-system]')) : [];
      var unitValues = unitPanel ? Array.prototype.slice.call(unitPanel.querySelectorAll('[data-unit-value]')) : [];
      var noteOutput = notePanel ? notePanel.querySelector('[data-settings-note]') : null;
      var noteAction = notePanel ? notePanel.querySelector('[data-settings-note-action]') : null;
      var reportPrompt = reportPanel ? reportPanel.querySelector('[data-settings-report-prompt]') : null;
      var reportAction = reportPanel ? reportPanel.querySelector('[data-settings-report-action]') : null;
      var noteField = notePanel ? notePanel.querySelector('[data-settings-note-field]') : null;
      var reportField = reportPanel ? reportPanel.querySelector('[data-settings-report-field]') : null;
      var rangeMinField = rangePanel ? rangePanel.querySelector('[data-settings-range-min-field]') : null;
      var rangeMaxField = rangePanel ? rangePanel.querySelector('[data-settings-range-max-field]') : null;
      var rangeMinOutput = rangePanel ? rangePanel.querySelector('[data-settings-range-min]') : null;
      var rangeMaxOutput = rangePanel ? rangePanel.querySelector('[data-settings-range-max]') : null;
      if (!panels.length) return;
      var active = 0;
      var timer = null;
      var transitionTimer = null;
      var rangeTimers = [];
      var rangeTypingTimers = [];
      var unitTimers = [];
      var noteTimers = [];
      var reportTimers = [];
      var noteTypingTimer = null;
      var reportTypingTimer = null;
      var inView = false;
      function hideCursor() {
        if (!cursor) return;
        cursor.classList.remove('is-visible', 'is-clicking');
      }
      function moveCursor(target) {
        if (!cursor || !run || !target) return;
        var runRect = run.getBoundingClientRect();
        var targetRect = target.getBoundingClientRect();
        var x = Math.round(targetRect.left - runRect.left + targetRect.width * .62);
        var y = Math.round(targetRect.top - runRect.top + targetRect.height * .48);
        cursor.style.setProperty('--settings-cursor-x', x + 'px');
        cursor.style.setProperty('--settings-cursor-y', y + 'px');
        if (!cursor.classList.contains('is-visible')) {
          cursor.style.transform = 'translate(' + Math.max(20, run.clientWidth - 42) + 'px,' + Math.max(20, run.clientHeight - 34) + 'px)';
          cursor.getBoundingClientRect();
          cursor.classList.add('is-visible');
          requestAnimationFrame(function () { cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)'; });
        } else {
          cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        }
      }
      function clickCursor() {
        if (!cursor) return;
        cursor.classList.remove('is-clicking');
        cursor.getBoundingClientRect();
        cursor.classList.add('is-clicking');
        setTimeout(function () { if (cursor) cursor.classList.remove('is-clicking'); }, 500);
      }
      function clearRangeTimers() {
        rangeTimers.forEach(clearTimeout);
        rangeTimers = [];
        rangeTypingTimers.forEach(clearInterval);
        rangeTypingTimers = [];
        if (rangePanel) rangePanel.classList.remove('is-range-opening', 'is-range-form', 'is-range-saving', 'is-range-saved', 'is-range-transitioning', 'is-range-typing-min', 'is-range-typing-max');
        if (rangeMinOutput) rangeMinOutput.textContent = '';
        if (rangeMaxOutput) rangeMaxOutput.textContent = '';
      }
      function typeRangeValue(output, value, className) {
        if (!output || !rangePanel) return;
        var index = 0;
        rangePanel.classList.add(className);
        var typingTimer = setInterval(function () {
          output.textContent = value.slice(0, ++index);
          if (index < value.length) return;
          clearInterval(typingTimer);
          rangeTypingTimers = rangeTypingTimers.filter(function (item) { return item !== typingTimer; });
          rangePanel.classList.remove(className);
        }, 170);
        rangeTypingTimers.push(typingTimer);
      }
      function playRangeSetup() {
        clearRangeTimers();
        hideCursor();
        rangeTimers.push(setTimeout(function () {
          moveCursor(rangePanel.querySelector('[data-settings-range-edit]'));
        }, 550));
        rangeTimers.push(setTimeout(function () {
          clickCursor();
          if (rangePanel) rangePanel.classList.add('is-range-opening');
        }, 1450));
        rangeTimers.push(setTimeout(function () {
          if (rangePanel) rangePanel.classList.remove('is-range-opening');
          if (rangePanel) rangePanel.classList.add('is-range-form');
        }, 1760));
        rangeTimers.push(setTimeout(function () {
          moveCursor(rangeMinField);
        }, 2150));
        rangeTimers.push(setTimeout(function () {
          clickCursor();
        }, 2820));
        rangeTimers.push(setTimeout(function () {
          typeRangeValue(rangeMinOutput, '4.8', 'is-range-typing-min');
        }, 3020));
        rangeTimers.push(setTimeout(function () {
          moveCursor(rangeMaxField);
        }, 3700));
        rangeTimers.push(setTimeout(function () {
          clickCursor();
        }, 4360));
        rangeTimers.push(setTimeout(function () {
          typeRangeValue(rangeMaxOutput, '5.6', 'is-range-typing-max');
        }, 4560));
        rangeTimers.push(setTimeout(function () {
          moveCursor(rangePanel.querySelector('[data-settings-range-save]'));
        }, 5300));
        rangeTimers.push(setTimeout(function () {
          clickCursor();
          if (rangePanel) rangePanel.classList.add('is-range-saving');
        }, 6040));
        rangeTimers.push(setTimeout(function () {
          if (rangePanel) rangePanel.classList.remove('is-range-form', 'is-range-saving');
          if (rangePanel) rangePanel.classList.add('is-range-saved');
          hideCursor();
        }, 6420));
      }
      function clearUnitTimers() {
        unitTimers.forEach(clearTimeout);
        unitTimers = [];
        if (unitPanel) unitPanel.classList.remove('is-unit-switching');
        setUnitMode('conventional');
      }
      function setUnitMode(mode) {
        unitSystems.forEach(function (item) {
          item.classList.toggle('is-selected', item.getAttribute('data-unit-system') === mode);
        });
        unitValues.forEach(function (item) {
          item.textContent = item.getAttribute(mode === 'si' ? 'data-si' : 'data-conventional');
        });
      }
      function playUnitSwitch() {
        clearUnitTimers();
        hideCursor();
        setUnitMode('conventional');
        unitTimers.push(setTimeout(function () {
          moveCursor(unitPanel.querySelector('[data-unit-system="si"]'));
        }, 550));
        unitTimers.push(setTimeout(function () {
          clickCursor();
          if (unitPanel) unitPanel.classList.add('is-unit-switching');
        }, 1420));
        unitTimers.push(setTimeout(function () {
          setUnitMode('si');
          if (unitPanel) unitPanel.classList.remove('is-unit-switching');
        }, 1690));
        unitTimers.push(setTimeout(function () {
          moveCursor(unitPanel.querySelector('[data-unit-system="conventional"]'));
        }, 2600));
        unitTimers.push(setTimeout(function () {
          clickCursor();
          if (unitPanel) unitPanel.classList.add('is-unit-switching');
        }, 3400));
        unitTimers.push(setTimeout(function () {
          setUnitMode('conventional');
          if (unitPanel) unitPanel.classList.remove('is-unit-switching');
        }, 3670));
        unitTimers.push(setTimeout(function () {
          moveCursor(unitPanel.querySelector('[data-unit-system="si"]'));
        }, 4580));
        unitTimers.push(setTimeout(function () {
          clickCursor();
          if (unitPanel) unitPanel.classList.add('is-unit-switching');
        }, 5380));
        unitTimers.push(setTimeout(function () {
          setUnitMode('si');
          if (unitPanel) unitPanel.classList.remove('is-unit-switching');
        }, 5650));
        unitTimers.push(setTimeout(hideCursor, 6200));
      }
      function clearNoteTimers() {
        noteTimers.forEach(clearTimeout);
        noteTimers = [];
        if (noteTypingTimer !== null) clearInterval(noteTypingTimer);
        noteTypingTimer = null;
        if (notePanel) notePanel.classList.remove('is-settings-typing', 'is-settings-pressing', 'is-settings-saved');
        if (noteOutput) noteOutput.textContent = '';
        if (noteAction) noteAction.textContent = 'Save instructions';
      }
      function playNoteSetup() {
        clearNoteTimers();
        hideCursor();
        var text = 'Use clear, neutral language. Prioritize metabolic trends and always keep source links visible.';
        var index = 0;
        noteTimers.push(setTimeout(function () {
          moveCursor(noteField);
        }, 500));
        noteTimers.push(setTimeout(function () {
          clickCursor();
        }, 1320));
        noteTimers.push(setTimeout(function () {
          if (notePanel) notePanel.classList.add('is-settings-typing');
          noteTypingTimer = setInterval(function () {
            if (noteOutput) noteOutput.textContent = text.slice(0, ++index);
            if (index < text.length) return;
            clearInterval(noteTypingTimer);
            noteTypingTimer = null;
            if (notePanel) notePanel.classList.remove('is-settings-typing');
          }, 18);
        }, 1540));
        var completeAt = 1540 + text.length * 18;
        noteTimers.push(setTimeout(function () {
          moveCursor(noteAction);
        }, completeAt + 420));
        noteTimers.push(setTimeout(function () {
          clickCursor();
          if (notePanel) notePanel.classList.add('is-settings-pressing');
          if (noteAction) noteAction.textContent = 'Saving…';
        }, completeAt + 1220));
        noteTimers.push(setTimeout(function () {
          if (notePanel) notePanel.classList.remove('is-settings-pressing');
          if (notePanel) notePanel.classList.add('is-settings-saved');
          if (noteAction) noteAction.textContent = 'Note saved ✓';
        }, completeAt + 1540));
        noteTimers.push(setTimeout(hideCursor, completeAt + 2150));
      }
      function clearReportTimers() {
        reportTimers.forEach(clearTimeout);
        reportTimers = [];
        if (reportTypingTimer !== null) clearInterval(reportTypingTimer);
        reportTypingTimer = null;
        if (reportPanel) reportPanel.classList.remove('is-settings-typing', 'is-settings-pressing', 'is-settings-saved');
        if (reportPrompt) reportPrompt.textContent = '';
        if (reportAction) reportAction.textContent = 'Create report';
      }
      function playReportSetup() {
        clearReportTimers();
        hideCursor();
        var text = 'Create a concise cardiometabolic review for the treating doctor. Highlight meaningful trends in glucose control, lipids, inflammation, and cardiovascular risk; compare results with the previous review and flag values that may need follow-up.';
        var index = 0;
        reportTimers.push(setTimeout(function () {
          moveCursor(reportField);
        }, 500));
        reportTimers.push(setTimeout(function () {
          clickCursor();
        }, 1320));
        reportTimers.push(setTimeout(function () {
          if (reportPanel) reportPanel.classList.add('is-settings-typing');
          reportTypingTimer = setInterval(function () {
            if (reportPrompt) reportPrompt.textContent = text.slice(0, ++index);
            if (index < text.length) return;
            clearInterval(reportTypingTimer);
            reportTypingTimer = null;
            if (reportPanel) reportPanel.classList.remove('is-settings-typing');
          }, 12);
        }, 1540));
        var completeAt = 1540 + text.length * 12;
        reportTimers.push(setTimeout(function () {
          moveCursor(reportAction);
        }, completeAt + 300));
        reportTimers.push(setTimeout(function () {
          clickCursor();
          if (reportPanel) reportPanel.classList.add('is-settings-pressing');
          if (reportAction) reportAction.textContent = 'Creating…';
        }, completeAt + 1100));
        reportTimers.push(setTimeout(function () {
          if (reportPanel) reportPanel.classList.remove('is-settings-pressing');
          if (reportPanel) reportPanel.classList.add('is-settings-saved');
          if (reportAction) reportAction.textContent = 'Report saved ✓';
        }, completeAt + 1420));
        reportTimers.push(setTimeout(hideCursor, completeAt + 2020));
      }
      function render() {
        hideCursor();
        clearRangeTimers();
        clearUnitTimers();
        clearNoteTimers();
        clearReportTimers();
        panels.forEach(function (panel, index) {
          var on = index === active;
          panel.classList.toggle('is-active', on);
          panel.setAttribute('aria-hidden', on ? 'false' : 'true');
        });
        points.forEach(function (point, index) {
          point.classList.toggle('is-settings-active', index === active);
        });
        dots.forEach(function (dot, index) { dot.classList.toggle('is-active', index === active); });
        if (status) status.textContent = (active + 1) + ' of ' + panels.length;
        var activePanel = panels[active];
        if (inView && activePanel === rangePanel) playRangeSetup();
        if (inView && activePanel === unitPanel) playUnitSwitch();
        if (inView && activePanel === notePanel) playNoteSetup();
        if (inView && activePanel === reportPanel) playReportSetup();
      }
      function stop() {
        if (timer !== null) clearTimeout(timer);
        if (transitionTimer !== null) clearTimeout(transitionTimer);
        timer = null;
        transitionTimer = null;
        if (run) run.classList.remove('is-settings-changing');
        hideCursor();
        clearRangeTimers();
        clearUnitTimers();
        clearNoteTimers();
        clearReportTimers();
      }
      function scheduleAdvance() {
        timer = setTimeout(function () {
          hideCursor();
          if (run) run.classList.add('is-settings-changing');
          transitionTimer = setTimeout(function () {
            active = (active + 1) % panels.length;
            render();
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                if (run) run.classList.remove('is-settings-changing');
              });
            });
            transitionTimer = null;
            scheduleAdvance();
          }, 380);
        }, 7600);
      }
      function start() {
        stop();
        if (reduceMotion || !inView || document.hidden) return;
        render();
        scheduleAdvance();
      }
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop();
        else start();
      });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          inView = entries[0].isIntersecting;
          if (inView) start();
          else stop();
        }, {rootMargin: '8% 0px 8% 0px', threshold: .12}).observe(section);
      } else {
        inView = true;
        start();
      }
      render();
    })();
