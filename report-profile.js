(() => {
  const people = window.N1_REPORT_PEOPLE || [];
  const requested = new URLSearchParams(window.location.search).get('person');
  const person = people.find((item) => item.id === requested) || people[0];
  if (!person) return;

  document.title = `${person.label} reports — n1.care`;
  document.querySelector('[data-profile-hero]').innerHTML = `<div><div class="report-profile-identity"><div><span class="page-kicker">Anonymized example patient</span><h1>${person.label}</h1><p>${person.age}-year-old ${person.sex}</p></div></div><p>${person.context}</p><div class="report-profile-topics">${person.focus.map((area) => `<span>${area}</span>`).join('')}</div></div><div class="report-profile-meta"><b>${person.reports.length}</b><span>reports available</span></div>`;
  document.querySelector('[data-report-count]').textContent = `${person.reports.length} source-linked report${person.reports.length === 1 ? '' : 's'} for this profile`;
  document.querySelector('[data-profile-reports]').innerHTML = person.reports.map((report) => `<article class="report-profile-card"><span>${report.type}</span><h3>${report.title}</h3><p>${report.summary}</p><footer><span>${report.date} · ${report.sources} source records</span><a href="${report.href}" aria-label="Open ${report.title} sample">Open report →</a></footer></article>`).join('');
})();
