(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const intentSelect = form.querySelector('#contact-intent');
  const title = document.querySelector('#contact-title');
  const intro = document.querySelector('#contact-intro');
  const status = document.querySelector('#contact-status');
  const success = document.querySelector('#contact-success');
  const successCopy = document.querySelector('#contact-success-copy');
  const resetButton = document.querySelector('#contact-reset');
  const submitButton = form.querySelector('button[type="submit"]');

  const intents = {
    walkthrough: {
      label: 'Product walkthrough',
      title: 'Tell us what <em>you’re evaluating.</em>',
      intro: 'We’ll reply by email with the most useful next step: an answer, a relevant example, or a product walkthrough.',
    },
    pricing: {
      label: 'Plans and expected use',
      title: 'Estimate from <em>your expected use.</em>',
      intro: 'Share your expected monthly page and report volume. We’ll confirm the current commercial terms.',
    },
    labs: {
      label: 'Lab or diagnostic workflow',
      title: 'Discuss a lab or <em>diagnostic workflow.</em>',
      intro: 'Tell us about the report file, the patient-identification process, and the clinician handoff you need to support.',
    },
    reports: {
      label: 'Reporting workflow',
      title: 'Discuss the reports <em>your practice needs.</em>',
      intro: 'Tell us which clinical task the report supports, who reviews it, and how the final version needs to be shared.',
    },
    patients: {
      label: 'Patient sharing',
      title: 'Ask how patient sharing <em>works.</em>',
      intro: 'Tell us which report a patient should receive, and which access controls your workflow requires.',
    },
    compliance: {
      label: 'Security and data handling',
      title: 'Ask about security, <em>data handling, or governance.</em>',
      intro: 'Share the requirement—not patient information—and we’ll respond directly or arrange a focused review.',
    },
    governance: {
      label: 'Governance requirements',
      title: 'Ask about clinical <em>governance requirements.</em>',
      intro: 'Share the requirement—not patient information—and we’ll respond directly or arrange a focused review.',
    },
    workflow: {
      label: 'Clinical workflow',
      title: 'Map a clinical workflow <em>with us.</em>',
      intro: 'Tell us what records arrive, what the clinician needs to review, and what output is required.',
    },
  };

  const requestedIntent = new URLSearchParams(window.location.search).get('intent');
  const activeIntent = Object.hasOwn(intents, requestedIntent) ? requestedIntent : 'walkthrough';
  intentSelect.value = activeIntent;
  title.innerHTML = intents[activeIntent].title;
  intro.textContent = intents[activeIntent].intro;

  form.addEventListener('invalid', (event) => {
    event.target.setAttribute('aria-invalid', 'true');
  }, true);

  form.addEventListener('input', (event) => {
    if (event.target.matches('input, select, textarea')) event.target.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';
    status.className = 'contact-status';

    if (!form.checkValidity()) {
      form.reportValidity();
      form.querySelector(':invalid')?.focus();
      return;
    }

    const fields = new FormData(form);
    const selectedIntent = Object.hasOwn(intents, fields.get('intent')) ? fields.get('intent') : 'walkthrough';
    const organisation = String(fields.get('organisation') || '').trim();
    const message = String(fields.get('message') || '').trim();
    const payload = {
      name: String(fields.get('name') || '').trim(),
      email: String(fields.get('email') || '').trim(),
      type: String(fields.get('type') || ''),
      message: `Enquiry: ${intents[selectedIntent].label}\nOrganisation: ${organisation || 'Not provided'}\n\n${message}`,
      website: String(fields.get('website') || ''),
    };

    const originalLabel = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending enquiry…';
    status.textContent = 'Sending your enquiry.';

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch('https://api.n1.care/support/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Contact request failed with ${response.status}`);

      form.hidden = true;
      success.hidden = false;
      successCopy.textContent = `We’ll reply to ${payload.email}. If that address is incorrect, send another enquiry.`;
      success.focus();
    } catch (_error) {
      status.className = 'contact-status error';
      status.innerHTML = 'We could not send the form. Your details are still here—try again, or email <a href="mailto:hello@n1.care">hello@n1.care</a> without patient information.';
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
    } finally {
      window.clearTimeout(timeout);
    }
  });

  resetButton?.addEventListener('click', () => {
    form.reset();
    intentSelect.value = activeIntent;
    form.hidden = false;
    success.hidden = true;
    submitButton.disabled = false;
    submitButton.textContent = 'Send enquiry';
    status.textContent = '';
    form.querySelector('#contact-name')?.focus();
  });
})();
