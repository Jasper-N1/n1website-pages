(() => {
  const grid = document.querySelector('[data-grid]');
  const people = [
    { age: 46, sex: 'female', context: 'Tracking cardiometabolic change after a new care plan, with repeat laboratory panels over two years.', focus: ['Metabolic', 'Longitudinal', 'Supplements'], reports: [
      { title: 'Health Summary', type: 'Complete record', date: 'Aug 2026', sources: 14, summary: 'Current findings, history, open questions, and care priorities.' },
      { title: 'Health Over Time', type: 'Longitudinal', date: 'Aug 2026', sources: 11, summary: 'HbA1c, lipids, weight, and treatment changes across 24 months.' },
      { title: 'Supplement Review', type: 'Focused review', date: 'Jul 2026', sources: 7, summary: 'Current regimen, safety checks, and follow-up monitoring.' },
      { title: 'Metabolic Follow-up', type: 'Custom brief', date: 'Jun 2026', sources: 9, summary: 'Response since the care-plan change and remaining data gaps.' }
    ] },
    { age: 55, sex: 'male', context: 'Reviewing blood pressure, lipid markers, medication changes, and cardiovascular risk context.', focus: ['Cardiovascular', 'Longitudinal'], reports: [
      { title: 'Health Summary', type: 'Complete record', date: 'Aug 2026', sources: 18, summary: 'A single view of cardiovascular history and current priorities.' },
      { title: 'Cardiovascular Review', type: 'Focused review', date: 'Jul 2026', sources: 12, summary: 'Risk markers, treatment periods, and clinician-defined targets.' },
      { title: 'Health Over Time', type: 'Longitudinal', date: 'May 2026', sources: 15, summary: 'Blood pressure and lipid change around medication adjustments.' }
    ] },
    { age: 34, sex: 'female', context: 'Connecting iron status, thyroid markers, symptoms, and care events without separating them into different records.', focus: ['Women’s health', 'Endocrine', 'Longitudinal'], reports: [
      { title: 'Health Summary', type: 'Complete record', date: 'Aug 2026', sources: 13, summary: 'Relevant history, recent results, and questions for the next visit.' },
      { title: 'Iron Status Over Time', type: 'Longitudinal', date: 'Aug 2026', sources: 10, summary: 'Ferritin and related markers alongside symptoms and treatment.' },
      { title: 'Thyroid Review', type: 'Focused review', date: 'Jul 2026', sources: 8, summary: 'Thyroid results, ranges, medication history, and source checks.' },
      { title: 'Consultation Brief', type: 'Custom brief', date: 'Jun 2026', sources: 11, summary: 'A concise preparation view for a complex follow-up visit.' }
    ] },
    { age: 42, sex: 'male', context: 'Placing genetic findings beside family history, biomarkers, and the clinical evidence that supports interpretation.', focus: ['Genetics', 'Cardiovascular'], reports: [
      { title: 'Health Summary', type: 'Complete record', date: 'Aug 2026', sources: 16, summary: 'Clinical history and current findings with genetics in context.' },
      { title: 'Genetic Predisposition', type: 'Genetics', date: 'Jul 2026', sources: 6, summary: 'Selected variants, evidence strength, phenotype, and limitations.' },
      { title: 'Family Risk Review', type: 'Focused review', date: 'Jun 2026', sources: 9, summary: 'Family history, cardiovascular markers, and follow-up questions.' }
    ] },
    { age: 53, sex: 'female', context: 'Following thyroid and metabolic markers through changing doses, symptoms, and repeat testing.', focus: ['Endocrine', 'Metabolic', 'Longitudinal'], reports: [
      { title: 'Health Summary', type: 'Complete record', date: 'Aug 2026', sources: 20, summary: 'Current diagnoses, treatment history, and unresolved questions.' },
      { title: 'Endocrine Over Time', type: 'Longitudinal', date: 'Jul 2026', sources: 17, summary: 'Thyroid and metabolic markers aligned to dose changes.' },
      { title: 'Medication Review', type: 'Focused review', date: 'Jun 2026', sources: 12, summary: 'Current and past regimens, response, and monitoring plan.' }
    ] },
    { age: 64, sex: 'male', context: 'Bringing a long record into one view before a complex consultation with several active care priorities.', focus: ['Longitudinal', 'Cardiovascular', 'Metabolic'], reports: [
      { title: 'Health Summary', type: 'Complete record', date: 'Aug 2026', sources: 26, summary: 'A concise orientation to a long and complex patient history.' },
      { title: 'Five-year Timeline', type: 'Longitudinal', date: 'Aug 2026', sources: 22, summary: 'Major results, diagnoses, procedures, and treatment events.' },
      { title: 'Cardiometabolic Review', type: 'Focused review', date: 'Jul 2026', sources: 18, summary: 'Related cardiovascular and metabolic patterns in one report.' },
      { title: 'Consultation Priorities', type: 'Custom brief', date: 'Jul 2026', sources: 20, summary: 'Open questions and source-linked priorities for the next visit.' }
    ] },
    { age: 37, sex: 'female', context: 'Reviewing supplement use against laboratory results, symptoms, and planned follow-up tests.', focus: ['Supplements', 'Women’s health'], reports: [
      { title: 'Health Summary', type: 'Complete record', date: 'Aug 2026', sources: 12, summary: 'Health history, recent findings, and the current care plan.' },
      { title: 'Supplement Review', type: 'Focused review', date: 'Aug 2026', sources: 9, summary: 'Regimen, interactions, evidence, and planned monitoring.' },
      { title: 'Laboratory Follow-up', type: 'Custom brief', date: 'Jun 2026', sources: 8, summary: 'Results to repeat and the questions each test is intended to answer.' }
    ] },
    { age: 58, sex: 'male', context: 'Understanding what changed before and after several medications were started, stopped, or adjusted.', focus: ['Metabolic', 'Cardiovascular', 'Longitudinal'], reports: [
      { title: 'Health Summary', type: 'Complete record', date: 'Aug 2026', sources: 19, summary: 'Current health state with medication periods kept visible.' },
      { title: 'Medication Timeline', type: 'Longitudinal', date: 'Jul 2026', sources: 15, summary: 'Doses, start and stop dates, responses, and monitoring events.' },
      { title: 'Metabolic Review', type: 'Focused review', date: 'Jul 2026', sources: 13, summary: 'Laboratory change around each treatment period.' },
      { title: 'Safety Monitoring', type: 'Custom brief', date: 'May 2026', sources: 10, summary: 'Open monitoring items and source-linked follow-up plan.' }
    ] }
  ];

  const generatedProfileCount = 0;
  const generatedFocus = [
    ['Metabolic', 'Longitudinal'],
    ['Cardiovascular', 'Longitudinal'],
    ['Endocrine', 'Metabolic'],
    ['Supplements', 'Metabolic'],
    ['Women’s health', 'Endocrine'],
    ['Genetics', 'Cardiovascular'],
    ['Longitudinal', 'Supplements']
  ];
  const generatedContexts = [
    'Reviewing recent results alongside an established health history.',
    'Preparing a concise view of changes before the next consultation.',
    'Following related biomarkers, treatments, and open questions over time.',
    'Bringing records from several providers into one source-linked timeline.',
    'Checking current priorities against past results and care events.',
    'Organising a long record around the findings that need follow-up.'
  ];
  const focusedReport = {
    Metabolic: 'Metabolic Review',
    Cardiovascular: 'Cardiovascular Review',
    Endocrine: 'Endocrine Review',
    Supplements: 'Supplement Review',
    'Women’s health': 'Women’s Health Review',
    Genetics: 'Genetic Predisposition',
    Longitudinal: 'Health Over Time'
  };

  Array.from({ length: generatedProfileCount }, (_, index) => index).forEach((index) => {
    const focus = generatedFocus[index % generatedFocus.length];
    const sources = 9 + (index % 15);
    const reports = [
      { title: 'Health Summary', type: 'Complete record', date: 'Aug 2026', sources, summary: 'Current findings, relevant history, open questions, and source-linked priorities.' },
      { title: 'Health Over Time', type: 'Longitudinal', date: index % 2 ? 'Jul 2026' : 'Aug 2026', sources: Math.max(6, sources - 2), summary: 'Important results, treatments, and care events arranged on one timeline.' },
      { title: focusedReport[focus[0]], type: focus[0] === 'Genetics' ? 'Genetics' : 'Focused review', date: 'Jun 2026', sources: Math.max(5, sources - 4), summary: `${focus[0]} findings reviewed with their clinical context and original sources.` }
    ];
    if (index % 3 === 0) reports.push({ title: 'Consultation Brief', type: 'Custom brief', date: 'May 2026', sources: Math.max(5, sources - 5), summary: 'A focused preparation view for the next clinician discussion.' });
    people.push({
      age: 24 + ((index * 7) % 48),
      sex: index % 2 === 0 ? 'female' : 'male',
      context: generatedContexts[index % generatedContexts.length],
      focus,
      reports
    });
  });

  people.forEach((person, index) => {
    person.id = `profile-${String(index + 1).padStart(2, '0')}`;
    person.label = `${person.age}-year-old ${person.sex}`;
  });

  window.N1_REPORT_PEOPLE = people;
  if (!grid) return;

  const areas = [...new Set(people.flatMap((person) => person.focus))];
  const filters = document.querySelector('[data-filters]');
  const search = document.querySelector('[data-search]');
  const sort = document.querySelector('[data-sort]');
  const count = document.querySelector('[data-count]');
  const more = document.querySelector('[data-more]');
  const visibleCount = document.querySelector('[data-visible-count]');
  let active = 'All';
  let shown = 6;

  ['All', ...areas].forEach((area) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `filter${area === 'All' ? ' is-active' : ''}`;
    button.textContent = area;
    button.addEventListener('click', () => {
      active = area;
      shown = 6;
      [...filters.children].forEach((item) => item.classList.toggle('is-active', item === button));
      render();
    });
    filters.appendChild(button);
  });

  const sourceTotal = (person) => person.reports.reduce((total, report) => total + report.sources, 0);
  const current = () => {
    const query = search.value.trim().toLowerCase();
    return people.filter((person) =>
      (active === 'All' || person.focus.includes(active)) &&
      (!query || [person.label, person.age, person.sex, person.context, ...person.focus, ...person.reports.flatMap((report) => [report.title, report.type, report.summary])].join(' ').toLowerCase().includes(query))
    ).sort((a, b) => sort.value === 'reports'
      ? b.reports.length - a.reports.length || a.age - b.age
      : sort.value === 'sources'
        ? sourceTotal(b) - sourceTotal(a)
        : a.age - b.age);
  };

  function render() {
    const list = current();
    const reportTotal = list.reduce((total, person) => total + person.reports.length, 0);
    count.textContent = `${list.length} ${list.length === 1 ? 'profile' : 'profiles'} · ${reportTotal} ${reportTotal === 1 ? 'report' : 'reports'}`;
    grid.innerHTML = '';
    list.slice(0, shown).forEach((person) => {
      const card = document.createElement('article');
      card.className = 'person';
      card.innerHTML = `<a class="person-select" href="report-profile.html?person=${person.id}" aria-label="Open reports for ${person.label}"><span class="person-head"><span class="person-name"><b>${person.label}</b><small>Anonymised patient</small></span></span><span class="person-context"><p>${person.context}</p></span><span class="person-report-list">${person.reports.map((report) => `<span>${report.title}</span>`).join('')}</span><span class="person-card-foot"><span class="person-tags">${person.focus.map((area) => `<span>${area}</span>`).join('')}</span><span class="report-count">Open ${person.reports.length} reports →</span></span></a>`;
      grid.appendChild(card);
    });
    if (!list.length) grid.innerHTML = '<p class="empty">No profiles or reports match this search.</p>';
    if (visibleCount) visibleCount.textContent = list.length ? `Showing ${Math.min(shown, list.length)} of ${list.length} profiles` : 'No profiles found';
    if (more) more.hidden = shown >= list.length;
  }

  search.addEventListener('input', () => { shown = 6; render(); });
  sort.addEventListener('change', () => { shown = 6; render(); });
  more?.addEventListener('click', () => { shown += 6; render(); });
  render();
})();
