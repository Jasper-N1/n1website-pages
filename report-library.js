(() => {
  const reportSet = (patient) => [
    { title: 'Health Summary', type: 'Complete record', date: 'Sep 2026', sources: patient.sources[0], summary: patient.summaries[0], href: `report-example.html?patient=${patient.code.toLowerCase()}&report=health-summary` },
    { title: 'Longitudinal Health Report', type: 'Health over time', date: 'Sep 2026', sources: patient.sources[1], summary: patient.summaries[1], href: `report-example.html?patient=${patient.code.toLowerCase()}&report=longitudinal-health-report` },
    { title: 'Supplement Report', type: 'Focused review', date: 'Sep 2026', sources: patient.sources[2], summary: patient.summaries[2], href: `report-example.html?patient=${patient.code.toLowerCase()}&report=supplement-report` }
  ];

  const people = [
    { code: 'A', age: 85, sex: 'male', context: 'Heart and kidney disease with low platelets. The reports track changes in kidney function and review vitamin D and folate support.', focus: ['Cardiovascular', 'Renal', 'Hematology'], sources: [34, 41, 20], summaries: ['Cross-panel findings, current alerts, and clinical priorities in one view.', 'Long-term trajectories across renal, cardiovascular, metabolic, and hematologic findings.', 'Supplement options and safety considerations reviewed against the full record.'] },
    { code: 'B', age: 53, sex: 'male', context: 'Low blood cell counts alongside fatty liver and metabolic risk. The reports review lipid control and a high-dose supplement routine.', focus: ['Hematology', 'Liver health', 'Metabolic'], sources: [34, 36, 22], summaries: ['Major physiological domains, relevant exceptions, and current priorities.', 'Laboratory and clinical changes placed alongside diagnoses and treatment history.', 'A safety-conscious supplement plan informed by liver and platelet findings.'] },
    { code: 'C', age: 39, sex: 'male', context: 'Rising LDL cholesterol with earlier kidney and uric acid changes that later improved. The reports also review vitamin D and hepatitis B immunity.', focus: ['Cardiovascular', 'Renal', 'Preventive care'], sources: [36, 17, 23], summaries: ['The most relevant findings and follow-up questions across the available record.', 'Changes in lipids, renal markers, and other health data over time.', 'A targeted supplement review based on current results and documented history.'] },
    { code: 'D', age: 55, sex: 'male', context: 'Mild coronary plaque and fatty liver, with low copper. The reports also check a large supplement routine for duplication and interaction risks.', focus: ['Cardiovascular', 'Liver health', 'Supplements'], sources: [41, 37, 22], summaries: ['Current priorities across cardiovascular, metabolic, bone, and gastrointestinal health.', 'Clinical events and results organized to show meaningful change over time.', 'Supplement recommendations checked against diagnoses, medications, and safety factors.'] }
  ].map((person) => ({ ...person, id: `patient-${person.code.toLowerCase()}`, label: `Patient ${person.code}`, reports: reportSet(person) }));

  window.N1_REPORT_PEOPLE = people;
  const grid = document.querySelector('[data-grid]');
  if (!grid) return;
  const filters = document.querySelector('[data-filters]');
  const search = document.querySelector('[data-search]');
  const sort = document.querySelector('[data-sort]');
  const count = document.querySelector('[data-count]');
  const more = document.querySelector('[data-more]');
  const visibleCount = document.querySelector('[data-visible-count]');
  const areas = [...new Set(people.flatMap((person) => person.focus))];
  let active = 'All';

  ['All', ...areas].forEach((area) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `filter${area === 'All' ? ' is-active' : ''}`;
    button.textContent = area;
    button.addEventListener('click', () => {
      active = area;
      [...filters.children].forEach((item) => item.classList.toggle('is-active', item === button));
      render();
    });
    filters.appendChild(button);
  });

  const sourceTotal = (person) => person.reports.reduce((total, report) => total + report.sources, 0);
  function current() {
    const query = search?.value.trim().toLowerCase() || '';
    const list = people.filter((person) => (active === 'All' || person.focus.includes(active)) && (!query || [person.label, person.age, person.sex, person.context, ...person.focus, ...person.reports.flatMap((report) => [report.title, report.type, report.summary])].join(' ').toLowerCase().includes(query)));
    return sort?.value === 'reports' ? list.sort((a, b) => b.reports.length - a.reports.length) : sort?.value === 'sources' ? list.sort((a, b) => sourceTotal(b) - sourceTotal(a)) : list;
  }

  function render() {
    const list = current();
    const reportTotal = list.reduce((total, person) => total + person.reports.length, 0);
    count.textContent = `${list.length} ${list.length === 1 ? 'profile' : 'profiles'} · ${reportTotal} ${reportTotal === 1 ? 'report' : 'reports'}`;
    grid.innerHTML = list.map((person) => `<article class="person"><a class="person-select" href="report-profile.html?person=${person.id}" aria-label="Open reports for ${person.label}"><span class="person-head"><span class="person-name"><b>${person.label}</b><span class="person-demographics">${person.age}-year-old ${person.sex}</span><small>Anonymized example</small></span></span><span class="person-context"><p>${person.context}</p></span><span class="person-report-list">${person.reports.map((report) => `<span>${report.title}</span>`).join('')}</span><span class="person-card-foot"><span class="person-tags">${person.focus.map((area) => `<span>${area}</span>`).join('')}</span><span class="report-count">Open 3 reports →</span></span></a></article>`).join('') || '<p class="empty">No profiles or reports match this search.</p>';
    if (visibleCount) visibleCount.textContent = list.length ? `Showing all ${list.length} profiles` : 'No profiles found';
    if (more) more.hidden = true;
  }
  search?.addEventListener('input', render);
  sort?.addEventListener('change', render);
  render();
})();
