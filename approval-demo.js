var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Clinician edit demo — ask AI for a small sourced rewrite, preview it, then accept it.
(function () {
  var editor = document.querySelector('.approval-edit');
  var selection = document.getElementById('approvalSelection');
  if (!editor || !selection) return;
  var summary = document.getElementById('approvalSummary');
  var prompt = editor.querySelector('[data-approval-prompt]');
  var promptBox = editor.querySelector('.approval-ai-prompt');
  var result = editor.querySelector('[data-approval-result]');
  var resultBox = editor.querySelector('.approval-edit-result');
  var status = editor.querySelector('[data-approval-status]');
  var apply = editor.querySelector('.approval-apply');
  var report = document.querySelector('.approval-report');
  var demo = report ? report.closest('.approval-demo') : null;
  var reportState = report ? report.querySelector(':scope > header > i') : null;
  var shareButton = report ? report.querySelector('.approval-share-button') : null;
  var shareModal = document.querySelector('.approval-share-modal');
  var shareNote = shareModal ? shareModal.querySelector('[data-approval-share-note]') : null;
  var sendButton = shareModal ? shareModal.querySelector('.approval-send-button') : null;
  var patientMessage = 'Hi John, I’ve reviewed your latest results. Please read the summary before our next appointment, and send me any questions.';
  var scenarios = [
    { selected: 'LDL cholesterol remains above the patient-specific target despite improvement since the previous review.', prompt: 'Add the previous and latest LDL values and dates from the source.', ai: 'LDL cholesterol fell from 142 mg/dL (2024-Nov-22) to 116 mg/dL (2025-Mar-14), but remains above the patient-specific target.', final: 'LDL cholesterol fell from 142 mg/dL (2024-Nov-22) to 116 mg/dL (2025-Mar-14), but remains above the patient-specific target. Review alongside ApoB and overall cardiovascular risk.' },
    { selected: 'HbA1c is moving in the right direction, with a steady fall across the latest three results.', prompt: 'Add the first and latest HbA1c values and dates from the source.', ai: 'HbA1c fell from 7.1% (2024-Jan-12) to 6.1% (2026-Aug-14) across the latest three results.', final: 'HbA1c fell from 7.1% (2024-Jan-12) to 6.1% (2026-Aug-14) across the latest three results. Continue the current plan and repeat in 12 weeks.' },
    { selected: 'Vitamin D has improved with supplementation but remains below the patient-specific target.', prompt: 'Add the latest vitamin D value, unit, and result date.', ai: 'Vitamin D increased to 71 nmol/L but remains below the patient-specific target (2025-Mar-14).', final: 'Vitamin D increased to 71 nmol/L but remains below the patient-specific target (2025-Mar-14). Continue the current dose and recheck in 12 weeks.' },
    { selected: 'Homocysteine remains elevated and should be reviewed in its wider clinical context.', prompt: 'Add the latest homocysteine measurement and result date.', ai: 'Homocysteine is 14.2 µmol/L, above the patient-specific target (2025-Mar-14).', final: 'Homocysteine is 14.2 µmol/L, above the patient-specific target (2025-Mar-14). Review vitamin B12, folate, and renal function.' },
    { selected: 'hs-CRP remains mildly raised and is more useful as a trend than as a single result.', prompt: 'Add the latest hs-CRP result and date without overstating it.', ai: 'hs-CRP is mildly raised at 1.8 mg/L (2025-Mar-14) and should be followed as part of the wider trend.', final: 'hs-CRP is mildly raised at 1.8 mg/L (2025-Mar-14) and should be followed as part of the wider trend. Interpret alongside recent illness and cardiovascular risk.' },
    { selected: 'Ferritin remains within the laboratory range, with no clear upward or downward trend.', prompt: 'Add the previous and latest ferritin values and dates.', ai: 'Ferritin changed from 78 µg/L (2024-Jan-12) to 84 µg/L (2024-Nov-22) and remains within the laboratory range.', final: 'Ferritin changed from 78 µg/L (2024-Jan-12) to 84 µg/L (2024-Nov-22) and remains within the laboratory range. No change to the current monitoring plan.' },
    { selected: 'TSH remains stable across the latest results, with no source-linked sign of a marked shift.', prompt: 'Add the latest TSH result and date while keeping the wording neutral.', ai: 'TSH is 2.1 mIU/L (2025-Mar-14) and remains stable across the latest source-linked results.', final: 'TSH is 2.1 mIU/L (2025-Mar-14) and remains stable across the latest source-linked results. Review sooner if thyroid symptoms change.' },
    { selected: 'Fasting glucose remains within the stated range and should be read with the HbA1c trend.', prompt: 'Add the latest fasting glucose value and result date.', ai: 'Fasting glucose is 5.2 mmol/L (2025-Mar-14), within the stated range.', final: 'Fasting glucose is 5.2 mmol/L (2025-Mar-14), within the stated range. Interpret alongside the HbA1c trend.' },
    { selected: 'LDL cholesterol has improved, though it remains above the agreed target for this patient.', prompt: 'Make this patient-friendly and retain the current LDL value and date.', ai: 'Your LDL cholesterol has fallen, but the latest result of 116 mg/dL remains above your agreed target (2025-Mar-14).', final: 'Your LDL cholesterol has fallen, but the latest result of 116 mg/dL remains above your agreed target (2025-Mar-14). We will review this together at your next visit.' },
    { selected: 'The latest HbA1c finding is supported by the linked laboratory report and can be checked at its source.', prompt: 'Name the HbA1c value, date, laboratory, and source page.', ai: 'HbA1c is 6.1% (2026-Aug-14), linked to Example Laboratory 01, Page 3, for source review.', final: 'HbA1c is 6.1% (2026-Aug-14), linked to Example Laboratory 01, Page 3, for source review. Source checked during clinician review.' }
  ];
  var scenarioIndex = 0;
  var timers = [];
  var typingTimer = null;
  var inView = false;

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
    if (typingTimer !== null) clearInterval(typingTimer);
    typingTimer = null;
  }
  function later(callback, delay) { timers.push(setTimeout(callback, delay)); }
  function currentScenario() { return scenarios[scenarioIndex]; }
  function reserveSummaryHeight() {
    if (!summary) return;
    var current = selection.textContent;
    var currentPrompt = prompt.textContent;
    var currentResult = result.textContent;
    summary.style.minHeight = '';
    promptBox.style.minHeight = '';
    resultBox.style.minHeight = '';
    var maxHeight = 0;
    var maxPromptHeight = 0;
    var maxResultHeight = 0;
    scenarios.forEach(function (scenario) {
      [scenario.selected, scenario.final].forEach(function (text) {
        selection.textContent = text;
        maxHeight = Math.max(maxHeight, summary.scrollHeight);
      });
      [scenario.ai, scenario.final].forEach(function (text) {
        result.textContent = text;
        maxResultHeight = Math.max(maxResultHeight, resultBox.scrollHeight);
      });
      prompt.textContent = scenario.prompt;
      maxPromptHeight = Math.max(maxPromptHeight, promptBox.scrollHeight);
    });
    selection.textContent = current;
    prompt.textContent = currentPrompt;
    result.textContent = currentResult;
    summary.style.minHeight = Math.ceil(maxHeight) + 'px';
    promptBox.style.minHeight = Math.ceil(maxPromptHeight + 2) + 'px';
    resultBox.style.minHeight = Math.ceil(maxResultHeight + 2) + 'px';
    if (demo && report) {
      demo.style.height = '';
      report.classList.add('is-measuring-edit');
      var expandedHeight = Math.ceil(report.scrollHeight + 2);
      report.classList.remove('is-measuring-edit');
      demo.style.height = expandedHeight + 'px';
    }
  }
  function reset() {
    var scenario = currentScenario();
    editor.classList.remove('is-prompting', 'is-manual-editing', 'has-ai-result', 'is-scenario-changing');
    selection.classList.remove('is-changing', 'is-selected');
    selection.textContent = scenario.selected;
    prompt.textContent = '';
    result.textContent = 'Waiting for an instruction…';
    status.textContent = 'Only the highlighted sentence will change';
    apply.classList.remove('is-pressing');
    apply.textContent = 'Accept change';
    apply.disabled = false;
    if (report) report.classList.remove('is-editing', 'is-accepted', 'is-share-ready', 'is-sharing-click');
    if (reportState) reportState.textContent = 'In review';
    if (shareButton) {
      shareButton.classList.remove('is-pressing');
      shareButton.setAttribute('aria-expanded', 'false');
    }
    if (shareModal) {
      shareModal.classList.remove('is-open', 'is-typing-note', 'is-sent');
      shareModal.setAttribute('aria-hidden', 'true');
    }
    if (shareNote) shareNote.textContent = '';
    if (sendButton) {
      sendButton.classList.remove('is-pressing');
      sendButton.innerHTML = '✉&nbsp; Send';
    }
  }
  function typePrompt() {
    var promptText = currentScenario().prompt;
    var index = 0;
    prompt.textContent = '';
    editor.classList.add('is-prompting');
    status.textContent = 'Asking AI to add the source value';
    typingTimer = setInterval(function () {
      prompt.textContent = promptText.slice(0, ++index);
      if (index >= promptText.length) {
        clearInterval(typingTimer);
        typingTimer = null;
        editor.classList.remove('is-prompting');
      }
    }, 24);
  }
  function typeManualTweak() {
    var scenario = currentScenario();
    var from = scenario.ai;
    var to = scenario.final;
    var typed = from.length;
    editor.classList.add('is-manual-editing');
    status.textContent = 'Doctor adding clinical context';
    result.textContent = from;
    typingTimer = setInterval(function () {
      typed++;
      result.textContent = to.slice(0, typed);
      if (typed < to.length) return;
      clearInterval(typingTimer);
      typingTimer = null;
      editor.classList.remove('is-manual-editing');
      status.textContent = 'Clinical context added';
    }, 42);
  }
  function applyResult() {
    selection.textContent = currentScenario().final;
    apply.classList.remove('is-pressing');
    apply.textContent = 'Accepted ✓';
    apply.disabled = true;
    status.textContent = 'Highlighted sentence updated';
    if (report) report.classList.add('is-accepted');
    if (reportState) reportState.textContent = 'Accepted';
  }
  function typePatientMessage() {
    if (!shareModal || !shareNote) return;
    var typed = 0;
    shareNote.textContent = '';
    shareModal.classList.add('is-typing-note');
    typingTimer = setInterval(function () {
      typed++;
      shareNote.textContent = patientMessage.slice(0, typed);
      if (typed < patientMessage.length) return;
      clearInterval(typingTimer);
      typingTimer = null;
      shareModal.classList.remove('is-typing-note');
    }, 20);
  }
  function openShareModal() {
    if (!shareModal || !report || !report.classList.contains('is-share-ready')) return;
    shareModal.classList.add('is-open');
    shareModal.setAttribute('aria-hidden', 'false');
    if (shareButton) shareButton.setAttribute('aria-expanded', 'true');
  }
  function play() {
    clearTimers();
    reset();
    var scenario = currentScenario();
    if (reduceMotion) {
      prompt.textContent = scenario.prompt;
      result.textContent = scenario.final;
      editor.classList.add('has-ai-result');
      applyResult();
      selection.classList.remove('is-selected');
      if (report) report.classList.add('is-share-ready');
      if (reportState) reportState.textContent = 'Ready to share';
      return;
    }
    later(function () { selection.classList.add('is-selected'); }, 900);
    later(function () { if (report) report.classList.add('is-editing'); }, 1500);
    later(typePrompt, 2100);
    later(function () {
      editor.classList.remove('is-prompting');
      editor.classList.add('has-ai-result');
      prompt.textContent = scenario.prompt;
      result.textContent = scenario.ai;
      status.textContent = 'AI preview generated';
    }, 4000);
    var manualStart = 4850;
    var manualDuration = Math.max(0, scenario.final.length - scenario.ai.length) * 42;
    var pressAt = manualStart + manualDuration + 650;
    var applyAt = pressAt + 220;
    var reportAt = applyAt + 900;
    var shareReadyAt = reportAt + 650;
    var shareClickAt = shareReadyAt + 700;
    var sharePressAt = shareClickAt + 680;
    var modalAt = sharePressAt;
    var noteAt = modalAt + 500;
    var sendAt = noteAt + patientMessage.length * 20 + 500;
    var sentAt = sendAt + 380;
    var transitionAt = sentAt + 2200;
    later(typeManualTweak, manualStart);
    later(function () {
      apply.classList.add('is-pressing');
      apply.textContent = 'Accepting…';
    }, pressAt);
    later(applyResult, applyAt);
    later(function () {
      selection.classList.remove('is-selected');
      if (report) report.classList.remove('is-editing');
    }, reportAt);
    later(function () {
      if (report) report.classList.add('is-share-ready');
      if (reportState) reportState.textContent = 'Ready to share';
    }, shareReadyAt);
    later(function () {
      if (report) report.classList.add('is-sharing-click');
    }, shareClickAt);
    later(function () {
      if (shareButton) {
        shareButton.classList.add('is-pressing');
        shareButton.click();
      } else {
        openShareModal();
      }
    }, sharePressAt);
    later(function () {
      if (shareButton) shareButton.classList.remove('is-pressing');
      if (report) report.classList.remove('is-sharing-click');
    }, modalAt + 180);
    later(typePatientMessage, noteAt);
    later(function () {
      if (shareModal) shareModal.classList.remove('is-typing-note');
      if (sendButton) {
        sendButton.classList.add('is-pressing');
        sendButton.textContent = 'Sending…';
      }
    }, sendAt);
    later(function () {
      if (sendButton) sendButton.classList.remove('is-pressing');
      if (shareModal) shareModal.classList.add('is-sent');
      if (reportState) reportState.textContent = 'Shared';
    }, sentAt);
    later(function () {
      if (shareModal) {
        shareModal.classList.remove('is-open');
        shareModal.setAttribute('aria-hidden', 'true');
      }
      if (shareButton) shareButton.setAttribute('aria-expanded', 'false');
      if (report) report.classList.remove('is-accepted', 'is-share-ready', 'is-sharing-click');
      if (reportState) reportState.textContent = 'In review';
      editor.classList.add('is-scenario-changing');
      selection.classList.add('is-changing');
    }, transitionAt);
    later(function () {
      scenarioIndex = (scenarioIndex + 1) % scenarios.length;
      var next = currentScenario();
      editor.classList.remove('is-prompting', 'is-manual-editing', 'has-ai-result');
      selection.textContent = next.selected;
      prompt.textContent = '';
      result.textContent = 'Waiting for an instruction…';
      status.textContent = 'Only the highlighted sentence will change';
      apply.classList.remove('is-pressing');
      apply.textContent = 'Accept change';
      apply.disabled = false;
    }, transitionAt + 280);
    later(function () {
      editor.classList.remove('is-scenario-changing');
      selection.classList.remove('is-changing');
    }, transitionAt + 360);
    later(function () { if (inView && !document.hidden) play(); }, transitionAt + 800);
  }
  function stop() { clearTimers(); }
  function start() { if (inView && !document.hidden) play(); }

  apply.addEventListener('click', function () {
    clearTimers();
    var scenario = currentScenario();
    prompt.textContent = scenario.prompt;
    result.textContent = scenario.final;
    editor.classList.remove('is-prompting', 'is-manual-editing');
    editor.classList.add('has-ai-result');
    applyResult();
    later(function () {
      selection.classList.remove('is-selected');
      if (report) report.classList.remove('is-editing');
    }, 700);
    later(function () {
      if (report) report.classList.add('is-share-ready');
      if (reportState) reportState.textContent = 'Ready to share';
    }, 1250);
  });
  if (shareButton) shareButton.addEventListener('click', openShareModal);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else start();
  });
  addEventListener('resize', reserveSummaryHeight, {passive: true});
  reserveSummaryHeight();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(reserveSummaryHeight);
  reset();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView) start();
      else { stop(); reset(); }
    }, {rootMargin: '0px 0px -8% 0px', threshold: .28}).observe(report || editor);
  } else {
    inView = true;
    start();
  }
})();
