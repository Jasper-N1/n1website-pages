const paths = {
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="4" rx="1"/><rect x="14" y="11" width="7" height="10" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  note: '<path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h5"/>',
  file: '<path d="M6 2h8l4 4v16H6zM14 2v5h5M9 12h6M9 16h6"/>',
  reports: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  activity: '<path d="M2 12h4l2-7 4 14 3-7h7"/>',
  diagnosis: '<path d="M6 3v6a5 5 0 0 0 10 0V3M4 3h4M14 3h4M11 14a5 5 0 0 0 10 0v-2"/><circle cx="21" cy="10" r="2"/>',
  procedure: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6"/>',
  genetics: '<path d="M5 3c8 5 8 13 14 18M19 3C11 8 11 16 5 21M8 6h8M8 18h8M10 10h4M10 14h4"/>',
  medication: '<path d="M10 4a5 5 0 0 1 7 7l-6 6a5 5 0 0 1-7-7zM7 7l10 10"/>',
  supplement: '<path d="M20 4C10 4 4 9 4 16c0 3 2 4 4 4 7 0 12-6 12-16ZM4 20c4-5 8-8 14-12"/>',
  patient: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19 14.5l2 1-2 3.5-2-1a8 8 0 0 1-3 1.8V22h-4v-2.2A8 8 0 0 1 7 18l-2 1-2-3.5 2-1a8 8 0 0 1 0-5l-2-1L5 5l2 1a8 8 0 0 1 3-1.8V2h4v2.2A8 8 0 0 1 17 6l2-1 2 3.5-2 1a8 8 0 0 1 0 5Z"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  upload: '<path d="M12 16V3M7 8l5-5 5 5M4 15v6h16v-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chevron: '<path d="m8 10 4 4 4-4"/>',
  spark: '<path d="m12 3 1.3 4.2L18 9l-4.7 1.8L12 15l-1.3-4.2L6 9l4.7-1.8zM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z"/>',
  edit: '<path d="m4 16-1 5 5-1L20 8l-4-4zM14 6l4 4"/>',
  arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/>',
}

const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.file}</svg>`
const badge = (label, kind = 'neutral') => `<span class="badge ${kind}">${label}</span>`
const primaryCell = (title, detail = '', iconName = 'file', iconClass = '') => `<div class="cell-main"><i class="cell-icon ${iconClass}">${icon(iconName)}</i><span class="cell-copy"><b>${title}</b>${detail ? `<small>${detail}</small>` : ''}</span></div>`
const sparkline = (points, tone = '') => {
  const pairs = points.trim().split(' ')
  const [lastX,lastY] = pairs[pairs.length - 1].split(',')
  return `<span class="sparkline ${tone}"><svg viewBox="0 0 64 24" role="img" aria-label="Biomarker trend"><rect class="spark-band" x="0" y="8" width="64" height="8" rx="3"/><polyline points="${points}"/><circle cx="${lastX}" cy="${lastY}" r="2.2"/></svg></span>`
}

const navGroups = [
  ['OVERVIEW', [['dashboard','Dashboard','dashboard'],['patient-notes','Patient Notes','note']]],
  ['DOCUMENTS', [['medical-records','Medical Records','file'],['reports','Reports','reports']]],
  ['CLINICAL DATA', [['biomarkers','Biomarkers','activity'],['diagnoses','Diagnoses','diagnosis'],['procedures','Procedures','procedure'],['genetics','Genetics','genetics']]],
  ['TREATMENT', [['medications','Medications','medication'],['supplements','Supplements','supplement']]],
  ['PATIENT MANAGEMENT', [['patient-settings','Patient Settings','patient']]],
]

const tablePages = {
  'medical-records': {
    title: 'Medical Records', titleIcon: 'file', count: 14, icon: 'upload', action: 'Upload Records', search: 'Search records...', total: 14,
    columns: [['Record Name',true],['Uploaded'],['Test Date'],['Pages'],['Status'],['Insights'],['']],
    rows: [
      [primaryCell('Cardiology consult — March 2025.pdf','Cardiology','file','file'),'Today','14 Mar 2025','8',badge('Complete','complete'),badge('Insights','neutral'),'•••'],
      [primaryCell('Comprehensive metabolic panel.pdf','Laboratory','file','file'),'Today','12 Mar 2025','4',badge('42% · ~3 min','processing'),badge('Parsing...','generating'),'•••'],
      [primaryCell('DEXA scan report.pdf','Imaging','file','file'),'10 Aug 2025','6 Aug 2025','3',badge('Complete','complete'),badge('Insights','neutral'),'•••'],
      [primaryCell('Functional medicine intake.pdf','Clinical note','file','file'),'2 Aug 2025','1 Aug 2025','12',badge('Process','neutral'),badge('—','neutral'),'•••'],
      [primaryCell('Annual laboratory results 2024.pdf','Laboratory','file','file'),'28 Jul 2025','22 Nov 2024','6',badge('Complete','complete'),badge('Insights','neutral'),'•••'],
    ],
  },
  reports: {
    title: 'Reports', count: 8, icon: 'plus', action: 'Generate Report', search: 'Search reports...', total: 8,
    columns: [['Report name',true],['Created'],['Type'],['Status'],['']],
    rows: [
      [primaryCell('Health Summary','14 source records','reports','purple'),'26 Aug 2026','Clinical',badge('Complete','complete'),'•••'],
      [primaryCell('Longitudinal Health Review','36 biomarkers','reports','purple'),'25 Aug 2026','Clinical',badge('Generating','generating'),'•••'],
      [primaryCell('Cardiometabolic Review','Approved by Dr Miller','reports','purple'),'19 Aug 2026','Custom',badge('Complete','complete'),'•••'],
      [primaryCell('Biological Age Trajectory','12 source records','reports','purple'),'12 Aug 2026','Visualization',badge('Complete','complete'),'•••'],
      [primaryCell('Supplement Assessment','7 active supplements','reports','purple'),'5 Aug 2026','Clinical',badge('Complete','complete'),'•••'],
    ],
  },
  biomarkers: {
    title: 'Biomarkers', titleIcon: 'activity', count: 48, search: 'Search by name...', total: 48,
    filters: ['All Sources','Specialty'],
    columns: [['Name',true],['Source'],['Latest'],['Latest Date'],['Trend'],['Insights'],['']],
    rows: [
      [primaryCell('LDL Cholesterol','Cardiovascular'),'Lab report','116 mg/dL','12 Aug 2026',sparkline('2,18 13,17 24,14 35,15 46,10 62,5','alert'),badge('High','error'),'•••'],
      [primaryCell('HbA1c','Metabolic'),'Lab report','6.4%','12 Aug 2026',sparkline('2,5 13,8 24,7 35,12 46,14 62,18'),badge('Review','pending'),'•••'],
      [primaryCell('Vitamin D','Vitamins'),'Lab report','71 nmol/L','12 Aug 2026',sparkline('2,13 13,11 24,12 35,10 46,12 62,11'),badge('In range','complete'),'•••'],
      [primaryCell('Apolipoprotein B','Cardiovascular'),'Lab report','92 mg/dL','12 Aug 2026',sparkline('2,6 13,9 24,8 35,13 46,12 62,17'),badge('Review','pending'),'•••'],
      [primaryCell('hs-CRP','Inflammation'),'Lab report','0.8 mg/L','12 Aug 2026',sparkline('2,4 13,7 24,11 35,9 46,15 62,19'),badge('In range','complete'),'•••'],
    ],
  },
  diagnoses: {
    title: 'Diagnoses', titleIcon: 'diagnosis', count: 6, icon: 'plus', action: 'Add Manually', search: 'Search diagnoses...', total: 6,
    columns: [['Name',true],['Date'],['Date Resolved'],['Status'],['Explanation'],['']],
    rows: [
      [primaryCell('Essential hypertension','Cardiovascular','diagnosis'),'11 Mar 2025','—',badge('Chronic','chronic'),'Managed with lifestyle and medication','•••'],
      [primaryCell('Insulin resistance','Metabolic','diagnosis'),'14 Jan 2025','—',badge('Active','active'),'Elevated fasting insulin and HbA1c','•••'],
      [primaryCell('Vitamin D insufficiency','Nutritional','diagnosis'),'22 Nov 2024','6 Aug 2025',badge('Resolved','resolved'),'Improved following supplementation','•••'],
      [primaryCell('Hyperlipidemia','Cardiovascular','diagnosis'),'22 Nov 2024','—',badge('Chronic','chronic'),'Elevated LDL cholesterol and ApoB','•••'],
      [primaryCell('Seasonal allergic rhinitis','Immunologic','diagnosis'),'2 Apr 2023','—',badge('Active','active'),'Seasonal symptoms documented','•••'],
    ],
  },
  procedures: {
    title: 'Procedures', titleIcon: 'procedure', count: 3, icon: 'plus', action: 'Add Manually', search: 'Search procedures...', total: 3,
    columns: [['Name',true],['Date'],['Explanation'],['Outcome'],['']],
    rows: [
      [primaryCell('Cardiac CT','Imaging','procedure'),'22 Nov 2024','Coronary risk investigation','No obstructive disease','•••'],
      [primaryCell('DEXA scan','Imaging','procedure'),'6 Aug 2025','Baseline bone-density assessment','Within expected range','•••'],
      [primaryCell('Clinical examination','Consultation','procedure'),'11 Mar 2025','Cardiometabolic review','Follow-up planned','•••'],
    ],
  },
  medications: {
    title: 'Medications', titleIcon: 'medication', count: 5, icon: 'plus', action: 'Add', search: 'Search medications...', total: 5, viewSwitcher: true,
    columns: [['Name',true],['Brand Name'],['Dosage'],['Type'],['Frequency'],['Started'],['Stopped On'],['Status'],['']],
    rows: [
      [primaryCell('Metformin','Prescription','medication'),'Glucophage','500 mg','Tablet','Twice daily','14 Jan 2025','—',badge('Active','active'),'•••'],
      [primaryCell('Rosuvastatin','Prescription','medication'),'Crestor','10 mg','Tablet','Once daily','20 Nov 2024','—',badge('Active','active'),'•••'],
      [primaryCell('Lisinopril','Prescription','medication'),'Zestril','10 mg','Tablet','Once daily','11 Mar 2025','—',badge('Active','active'),'•••'],
      [primaryCell('Cetirizine','Over the counter','medication'),'Zyrtec','10 mg','Tablet','As needed','2 Apr 2023','—',badge('Active','active'),'•••'],
      [primaryCell('Atorvastatin','Prescription','medication'),'Lipitor','20 mg','Tablet','Once daily','10 Jun 2022','20 Nov 2024',badge('Stopped','stopped'),'•••'],
    ],
  },
  supplements: {
    title: 'Supplements', titleIcon: 'supplement', count: 6, icon: 'plus', action: 'Add', search: 'Search supplements...', total: 6, viewSwitcher: true,
    columns: [['Name',true],['Brand Name'],['Dosage'],['Type'],['Frequency'],['Started'],['Stopped On'],['Status'],['']],
    rows: [
      [primaryCell('Vitamin D3','Vitamin','supplement'),'Thorne','2,000 IU','Capsule','Once daily','22 Nov 2024','—',badge('Active','active'),'•••'],
      [primaryCell('Magnesium glycinate','Mineral','supplement'),'Pure Encapsulations','240 mg','Capsule','Evening','14 Jan 2025','—',badge('Active','active'),'•••'],
      [primaryCell('Omega-3 fish oil','Fatty acid','supplement'),'Nordic Naturals','1,280 mg','Softgel','Once daily','14 Jan 2025','—',badge('Active','active'),'•••'],
      [primaryCell('Coenzyme Q10','Antioxidant','supplement'),'Life Extension','100 mg','Softgel','Once daily','20 Nov 2024','—',badge('Active','active'),'•••'],
      [primaryCell('Berberine','Botanical','supplement'),'Integrative Therapeutics','500 mg','Capsule','Twice daily','14 Jan 2025','—',badge('Active','active'),'•••'],
    ],
  },
  patients: {
    title: 'Patients', titleIcon: 'users', count: 24, icon: 'plus', action: 'Actions', search: 'Search by name or email…', total: 24,
    pageSizeLabel: 'Patients Per Page', columns: [['Patient',true],['Last activity'],['Age'],['Sex'],['']],
    rows: [
      [primaryCell('John Doe','● On platform','patient'),'Today','52','Male','•••'],
      [primaryCell('Maria Garcia','Invitation pending','patient'),'Yesterday','44','Female','•••'],
      [primaryCell('Robert Chen','● On platform','patient'),'12 Aug 2026','58','Male','•••'],
      [primaryCell('Sarah Williams','Not invited','patient'),'4 Aug 2026','38','Female','•••'],
      [primaryCell('Michael Brown','● On platform','patient'),'28 Jul 2026','50','Male','•••'],
    ],
  },
}

function topPagination(total = 25) {
  return `<div class="pagination top"><span class="showing">Showing 1-${Math.min(25,total)} of ${total}</span><span class="per-page-label">Items Per Page</span><select><option>25</option><option>50</option></select><nav class="page-nav"><button disabled>«</button><button disabled>‹</button><select><option>1</option></select><span>/ ${Math.max(1,Math.ceil(total/25))}</span><button ${total <= 25 ? 'disabled' : ''}>›</button><button ${total <= 25 ? 'disabled' : ''}>»</button></nav></div>`
}

function bottomPagination(total = 25) {
  return `<div class="pagination"><span class="per-page-label">Items Per Page</span><select><option>25</option><option>50</option></select><nav class="page-nav"><button disabled>«</button><button disabled>‹</button><select><option>1</option></select><span>/ ${Math.max(1,Math.ceil(total/25))}</span><button ${total <= 25 ? 'disabled' : ''}>›</button><button ${total <= 25 ? 'disabled' : ''}>»</button></nav></div>`
}

function pageHeader(title, count, action, iconName, description = '', titleIconName = '') {
  const resolvedTitleIcon = titleIconName || ({'Medical Records':'file','Reports':'reports','Biomarkers':'activity','Diagnoses':'diagnosis','Procedures':'procedure','Genetics':'genetics','Medications':'medication','Supplements':'supplement','Patients':'users'})[title] || ''
  return `<header class="page-header"><div><div class="page-title-row">${resolvedTitleIcon ? `<i class="page-title-icon">${icon(resolvedTitleIcon)}</i>` : ''}<h1>${title}</h1>${count ? `<span class="count">${count}</span>` : ''}</div>${description ? `<p class="page-description ${resolvedTitleIcon ? 'with-title-icon' : ''}">${description}</p>` : ''}</div>${action ? `<button class="button">${icon(iconName)}${action}</button>` : ''}</header>`
}

function renderTablePage(config) {
  const headers = config.columns.map(([name,primary]) => `<th class="${primary?'primary':''}">${name ? `<span class="sort">${name}</span>` : ''}</th>`).join('')
  const rows = config.rows.map(row => `<tr><td class="check-cell"><span class="checkbox"></span></td>${row.map((cell,i) => `<td class="${i===0?'primary':''} ${i===row.length-1?'actions':''}">${i===row.length-1?`<button aria-label="Row actions">${cell}</button>`:cell}</td>`).join('')}</tr>`).join('')
  const filters = config.filters ? `<div class="filters">${config.filters.map((x,i)=>`<select class="select"><option>${x}</option></select>`).join('')}</div>` : ''
  const viewSwitcher = config.viewSwitcher ? `<div class="inner-tabs"><button class="active">Table</button><button>Timeline</button></div>` : ''
  return `<div class="page stack">${pageHeader(config.title,config.count,config.action,config.icon)}${viewSwitcher}<div class="list-controls"><div style="display:flex;align-items:center;gap:10px;min-width:0"><label class="search">${icon('search')}<input placeholder="${config.search}"></label>${filters}</div>${topPagination(config.total)}</div><section class="table-frame"><div class="table-scroll"><table class="data-table"><thead><tr><th class="check-cell"><span class="checkbox"></span></th>${headers}</tr></thead><tbody>${rows}</tbody></table></div></section><footer class="bottom-controls"><span class="muted">Showing 1-${config.rows.length} of ${config.total}</span>${bottomPagination(config.total)}</footer></div>`
}

function renderDashboard() {
  const stat = (n,label,ic,href,tone='') => `<a class="stat-card" href="#${href}"><i class="cell-icon ${tone}">${icon(ic)}</i><span><b>${n}</b><span>${label}</span></span></a>`
  const quickActions = `<section class="dashboard-quick"><header class="section-title"><h2>Quick Actions</h2></header><div class="quick-grid"><a class="quick" href="#medical-records"><i class="cell-icon">${icon('upload')}</i><span class="cell-copy"><b>Upload Records</b><small>Add medical records and laboratory files</small></span>${badge('1 processing','processing')}${icon('arrow')}</a><a class="quick" href="#reports"><i class="cell-icon purple">${icon('reports')}</i><span class="cell-copy"><b>Generate Report</b><small>Create a report from the selected patient data</small></span>${icon('arrow')}</a></div></section>`
  const profile = `<section class="card dashboard-profile"><header class="card-head"><h2>Patient Profile</h2><button class="button ghost">${icon('edit')}Edit</button></header><div class="card-body"><div class="profile-grid"><div class="field"><label>First name</label><strong>John</strong></div><div class="field"><label>Last name</label><strong>Doe</strong></div><div class="field"><label>Date of birth</label><strong>14 May 1974</strong></div><div class="field"><label>Gender</label><strong>Male</strong></div><div class="field"><label>Weight</label><strong>79.8 kg</strong></div><div class="field"><label>Height</label><strong>175 cm</strong></div></div></div></section>`
  const reports = `<section class="card dashboard-reports"><header class="card-head"><h2>Recent Reports</h2><a class="button ghost" href="#reports">View All ${icon('arrow')}</a></header><div class="card-body"><table class="data-table" style="min-width:0"><tbody><tr><td>${primaryCell('Health Summary','26 Aug 2026','reports','purple')}</td><td>${badge('Generating','generating')}</td></tr><tr><td>${primaryCell('Longitudinal Health Report','25 Aug 2026','reports','purple')}</td><td>${badge('Queued','neutral')}</td></tr><tr><td>${primaryCell('Cardiometabolic Review','19 Aug 2026','reports','purple')}</td><td>${badge('Failed','error')}</td></tr><tr><td>${primaryCell('Supplement Report','12 Aug 2026','reports','purple')}</td><td>${badge('Complete','complete')}</td></tr></tbody></table></div></section>`
  const alertGroup = (name,count,content='',open=false) => `<details class="alert-group" ${open?'open':''}><summary><b>${name}</b><span>(${count})</span>${icon('chevron')}</summary>${content}</details>`
  const alertFinding = `<a class="alert-finding" href="#biomarkers"><span class="alert-arrow">↑</span><span><b>High Sensitivity C-Reactive Protein</b><small>3.4 mg/L <em>(ref: ≤ 3)</em></small></span></a>`
  const alerts = `<section class="card dashboard-alerts"><header class="card-head"><h2>Biomarker Alerts</h2><a class="button ghost" href="#biomarkers">View All (8) ${icon('arrow')}</a></header><div class="alert-groups">${alertGroup('Inflammatory',1,alertFinding,true)}${alertGroup('Lipid',4)}${alertGroup('Metabolic',2)}${alertGroup('Nutrient/Vitamin',1)}</div></section>`
  const overview = `<div class="dashboard-overview"><section class="stats">${stat(14,'Records','file','medical-records')}${stat(48,'Biomarkers','activity','biomarkers')}${stat(6,'Diagnoses','diagnosis','diagnoses','amber')}${stat(3,'Procedures','procedure','procedures','rose')}</section>${quickActions}</div>`
  return `<div class="page stack"><header class="patient-heading"><div><h1>John Doe</h1><p>52 years old <span>•</span> Male <span>•</span> <em>On platform</em></p></div><div class="patient-id"><span>Patient ID</span><code>patient_01JDOE74</code><button class="icon-btn" aria-label="Copy patient ID">${icon('copy')}</button></div></header><div class="dashboard-grid">${overview}${profile}${reports}${alerts}</div></div>`
}

function renderNotes() {
  return `<div class="page stack notes-page">${pageHeader('Patient Notes',null,null,null,'Note about John Doe')}<section class="card editable-note"><header class="card-head card-head-copy"><span><h2>Patient Note</h2><small>Taken into account by the report generator when creating this patient’s reports</small></span><button class="button outline">${icon('edit')}Edit</button></header><div class="card-body"><p>Patient prefers conservative treatment approaches and would like lifestyle measures discussed before medication changes. Allergic to penicillin. Review lipid response and repeat ApoB at the next laboratory panel.</p><div class="note-meta">Last updated today by Dr Jane Miller</div></div></section></div>`
}

function renderReports() {
  const rows = [
    [primaryCell('Health Summary','John Doe','reports','purple'),'Patient','26 Aug 2026','Health Summary',badge('Complete','complete'),'•••'],
    [primaryCell('Longitudinal Health Report','John Doe','reports','purple'),'Patient','25 Aug 2026','Longitudinal',badge('Generating','generating'),'•••'],
    [primaryCell('Supplement Report','John Doe','reports','purple'),'Patient','19 Aug 2026','Supplement',badge('Complete','complete'),'•••'],
    [primaryCell('Cardiovascular risk review','John Doe','reports','purple'),'Clinician','12 Aug 2026','Custom Report',badge('Complete','complete'),'•••'],
  ]
  const headers = ['Report name','Audience','Created','Type','Status',''].map((h,i)=>`<th class="${i===0?'primary':''}">${h?`<span class="sort">${h}</span>`:''}</th>`).join('')
  const body = rows.map(row=>`<tr><td class="check-cell"><span class="checkbox"></span></td>${row.map((cell,i)=>`<td class="${i===0?'primary':''} ${i===row.length-1?'actions':''}">${i===row.length-1?`<button>${cell}</button>`:cell}</td>`).join('')}</tr>`).join('')
  return `<div class="page stack">${pageHeader('Reports',8,'Generate Report','plus')}<section class="reports-list stack"><div class="list-controls"><label class="search">${icon('search')}<input placeholder="Search reports..."></label>${topPagination(8)}</div><section class="table-frame"><div class="table-scroll"><table class="data-table"><thead><tr><th class="check-cell"><span class="checkbox"></span></th>${headers}</tr></thead><tbody>${body}</tbody></table></div></section><footer class="bottom-controls">${bottomPagination(8)}</footer></section></div>`
}

function renderGenetics() {
  const gene = (name, count, domain, summary) => `<details class="gene-group"><summary class="gene-row"><span class="gene-name">${name}</span><span class="gene-count">${count} ${count === 1 ? 'variant' : 'variants'}</span><span class="domain-chip">${domain}</span><span class="gene-summary">${summary}</span><span class="round-chevron">${icon('chevron')}</span></summary></details>`
  const variant = (id, genotype, copies, frequency, significance, evidence, description) => `<article class="variant-card"><div class="variant-heading"><div><a href="#genetics">${id}</a><span>${significance}</span></div><span class="evidence-chip">${evidence}</span></div><div class="variant-facts"><div><small>Genotype</small><strong>${genotype}</strong></div><div><small>Variant copies</small><strong>${copies}</strong></div><div><small>Population frequency</small><strong>${frequency}</strong></div></div><p>${description}</p><div class="source-chips"><span>ClinVar</span><span>PharmGKB</span></div></article>`
  return `<div class="page stack genetics-page">${pageHeader('Genetics',29,'Upload Records','upload')}<nav class="genetics-tabs" aria-label="Genetics data type"><a class="active" href="#genetics">Raw data <span>29</span></a><a href="#genetics">Lab data <span>8</span></a></nav><section class="genetics-content"><header class="matched-heading"><div><h2>Matched variants</h2><p>Genetic findings matched from this patient’s uploaded raw DNA data.</p></div><span class="count">29</span></header><section class="tier"><header class="tier-head"><div class="tier-number strong">1</div><div><div class="tier-title-row"><h3>Strong evidence</h3><span>4 variants</span></div><p>ClinVar expert-panel pathogenic or PharmGKB level 1A. Review individually before clinical action.</p></div><span class="tier-chevron">${icon('chevron')}</span></header><div class="tier-list"><details class="gene-group"><summary class="gene-row"><span class="gene-name">CYP2C19</span><span class="gene-count">2 variants</span><span class="domain-chip">Drug response</span><span class="gene-summary">May affect clopidogrel activation and response.</span><span class="round-chevron">${icon('chevron')}</span></summary><div class="gene-expanded"><section class="gene-about"><h4>About CYP2C19</h4><p>CYP2C19 helps metabolize several commonly prescribed medicines. The detected variants may alter enzyme activity and can inform medication review.</p><div class="reference-links"><a href="#genetics">ClinGen ↗</a><a href="#genetics">PharmGKB ↗</a><a href="#genetics">NCBI Gene ↗</a></div></section><section><div class="subsection-heading"><h4>Variants in this patient</h4><span>2</span></div><div class="variant-grid">${variant('rs4244285','A / G','1 of 2','22.4%','Loss of function','Level 1A','One reduced-function allele is present. This finding may be associated with decreased CYP2C19 activity and reduced response to clopidogrel.')}${variant('rs12248560','C / T','1 of 2','18.0%','Increased function','Expert reviewed','One increased-function allele is present. Interpret the combined haplotype before making a prescribing decision.')}</div></section><section class="literature"><div class="subsection-heading"><h4>Literature</h4><span>3 references</span></div><a href="#genetics"><b>CPIC guideline for CYP2C19 and clopidogrel therapy</b><span>Clinical Pharmacology &amp; Therapeutics · 2022 ↗</span></a><a href="#genetics"><b>CYP2C19 genotype and antiplatelet response</b><span>Pharmacogenomics · 2021 ↗</span></a></section></div></details>${gene('APOE',1,'Disease','Associated with lipid transport and Alzheimer disease risk.')}${gene('F5',1,'Disease','Pathogenic thrombophilia finding requiring clinical review.')}</div></section><section class="tier"><header class="tier-head"><div class="tier-number moderate">2</div><div><div class="tier-title-row"><h3>Moderate evidence</h3><span>7 variants</span></div><p>PharmGKB level 2 or expert-reviewed ClinVar with lower per-variant effect. Use as supporting context.</p></div><span class="tier-chevron">${icon('chevron')}</span></header><div class="tier-list">${gene('MTHFR',2,'Trait','Variants associated with folate metabolism.')}${gene('SLCO1B1',1,'Drug response','May affect simvastatin exposure and myopathy risk.')}${gene('CYP2D6',2,'Drug response','Potential altered metabolism across several medications.')}${gene('VKORC1',2,'Drug response','May contribute to warfarin dose requirements.')}</div></section><details class="tier tier-collapsed"><summary class="tier-head"><div class="tier-number limited">3</div><div><div class="tier-title-row"><h3>Limited or conflicting evidence</h3><span>18 variants</span></div><p>Limited, speculative, conflicting, or unknown evidence. Surfaced for research-grade context only.</p></div><span class="tier-chevron">${icon('chevron')}</span></summary></details></section></div>`
}

function renderPatientSettings() {
  const row = (label,value,description='') => `<div class="settings-row"><span><b>${label}</b>${description?`<small>${description}</small>`:''}</span><strong>${value}</strong>${icon('edit')}</div>`
  return `<div class="page stack">${pageHeader('Patient Settings',null,null,null,'Manage data and settings for John Doe')}<section class="card"><header class="card-head"><h2>Patient ID</h2></header><div class="card-body id-row"><code>patient_01JDOE74</code><button class="button outline">${icon('copy')}Copy</button></div></section><section class="card"><header class="card-head card-head-copy"><span><h2>Profile</h2><small>Click any field to edit</small></span></header><div class="settings-rows">${row('First Name','John')}${row('Last Name','Doe')}${row('Email','john.doe@example.com','Managed by the patient')}${row('Date of Birth','14 May 1974')}${row('Gender','Male')}${row('Weight (kg)','79.8')}${row('Height (cm)','175')}</div></section><section class="card"><header class="card-head card-head-copy"><span><h2>Export Data</h2><small>Download John Doe’s biomarkers, diagnoses, procedures, medications, supplements, and records as a ZIP of CSV or Excel files.</small></span></header><div class="card-body"><a class="button outline" href="#export">${icon('download')}Export Patient Data</a></div></section><section class="card danger-card"><header class="card-head card-head-copy"><span><h2>Critical Actions</h2><small>This patient has set up their account. You can only remove your association with them.</small></span></header><div class="card-body critical-action"><div><b>Remove from My Patients</b><p>Remove John Doe from your patient list. Their account and all their data will remain intact.</p></div><button class="button danger">Remove Patient</button></div></section></div>`
}

function renderSettings() {
  const row = (label,value,description='') => `<div class="settings-row"><span><b>${label}</b>${description?`<small>${description}</small>`:''}</span><strong>${value}</strong>${icon('edit')}</div>`
  return `<div class="page stack">${pageHeader('Settings',null,null,null,'Manage your account settings and preferences')}<nav class="tabs-strip"><a class="active">${icon('patient')}Profile</a><a>${icon('file')}Report Instructions</a><a>${icon('settings')}Preferences</a><a>${icon('spark')}Branding</a><a>Security</a><a>API Keys</a><a>Verification</a><a>About</a></nav><div class="settings-content"><section class="card"><header class="card-head"><h2>Doctor ID</h2></header><div class="card-body id-row"><code>doctor_01JMILLER</code><button class="button outline">${icon('copy')}Copy</button></div></section><section class="card"><header class="card-head card-head-copy"><span><h2>Profile</h2><small>Click any field to edit</small></span></header><div class="settings-rows">${row('First Name','Jane')}${row('Last Name','Miller')}${row('Email Address','jane@n1.care','Email address cannot be changed')}${row('Role','Doctor')}</div></section><section class="card"><header class="card-head card-head-copy"><span><h2>Patient Connections & Invitations</h2><small>Patients who invited you to view their health records and shared reports.</small></span></header><div class="card-body empty-inline">No pending invitations</div></section></div></div>`
}

function renderBilling() {
  return `<div class="page narrow stack">${pageHeader('Billing',null,null,null,'Your plan, usage, and subscription details.')}<section class="card"><header class="card-head"><span><h2>Professional</h2><small>Your current plan and subscription.</small></span>${badge('Active','complete')}</header><div class="card-body usage-grid"><div><span>Pages still available this period</span><b>382</b></div><div><span>Reports still available this period</span><b>17</b></div><div><span>Billing period</span><b>1–30 September</b></div></div></section><section><header class="section-title"><h2>Plans</h2></header><div class="plan-grid"><article class="card plan"><span class="eyebrow">STARTER</span><h3>$39 <small>/ month</small></h3><p>For getting started with structured patient data.</p><button class="button outline">Choose Starter</button></article><article class="card plan selected"><span class="eyebrow">PROFESSIONAL</span><h3>$99 <small>/ month</small></h3><p>Reports, clinical intelligence, and larger patient limits.</p><button class="button">Current plan</button></article><article class="card plan"><span class="eyebrow">PRACTICE</span><h3>$249 <small>/ month</small></h3><p>Advanced tools for growing clinical teams.</p><button class="button outline">Choose Practice</button></article></div></section><section class="card"><header class="card-head card-head-copy"><span><h2>Pay-as-you-go</h2><small>Continue processing pages and generating reports after the included allowance is used.</small></span></header><div class="card-body toggle-row"><span>Allow usage above plan limits</span><span class="toggle"></span></div></section><section class="card"><header class="card-head card-head-copy"><span><h2>White-labeling add-on</h2><small>Use your own branding for patient-facing experiences.</small></span></header><div class="card-body billing-summary"><div><b>$49 / month</b><p>Custom logo, brand name, colours, and patient portal domain.</p></div><button class="button outline">Add white-labeling</button></div></section><section class="card"><header class="card-head card-head-copy"><span><h2>Manage billing</h2><small>Update your payment method, subscription, and billing details.</small></span></header><div class="card-body"><button class="button outline">Open billing portal</button></div></section><section class="card"><header class="card-head card-head-copy"><span><h2>Billing history</h2><small>Invoices and payment receipts for this subscription.</small></span></header><div class="settings-rows"><div class="settings-row"><span><b>August 2026</b><small>Professional plan</small></span><strong>$99.00</strong><button class="button ghost">${icon('download')}PDF</button></div><div class="settings-row"><span><b>July 2026</b><small>Professional plan</small></span><strong>$99.00</strong><button class="button ghost">${icon('download')}PDF</button></div></div></section></div>`
}

function renderExport() {
  const option = (label,checked=true) => `<label class="option-row"><span class="checkbox ${checked?'checked':''}">${checked?'✓':''}</span>${label}</label>`
  return `<div class="page stack">${pageHeader('Export data',null,'John Doe','patient','Generate a ZIP of CSV or Excel files for analysis tools.')}<div class="export-grid"><div class="column"><section><header class="section-title"><h2>Format</h2></header><p class="field-hint">CSV opens anywhere; Excel bundles one sheet per data type.</p><div class="segmented"><button class="active">CSV</button><button>Excel</button></div></section><section class="card"><header class="card-head"><h2>Data types &amp; filters</h2><span class="muted">6 of 6 types · all time</span></header><div class="card-body"><div class="option-grid">${option('Biomarkers')}${option('Diagnoses')}${option('Procedures')}${option('Medications')}${option('Supplements')}${option('Records')}</div><div class="export-window"><label>Date window</label><div class="inner-tabs"><button>90d</button><button>6 mo</button><button>12 mo</button><button class="active">All time</button></div></div>${option('Include data dictionary')}</div></section></div><aside class="export-summary"><label class="summary-label">Bundle preview</label><section class="card"><div class="card-body"><dl><dt>Scope</dt><dd>John Doe</dd><dt>Patients</dt><dd>1</dd><dt>Data types</dt><dd>6 of 6</dd><dt>Date window</dt><dd>All time</dd><dt>Format</dt><dd>CSV</dd></dl><div class="file-preview"><b>Files</b><span>john-doe/biomarkers.csv</span><span>john-doe/diagnoses.csv</span><span>john-doe/records.csv</span><span>data_dictionary.csv</span><span>manifest.json</span></div></div></section><button class="button wide">${icon('download')}Generate export</button></aside></div></div>`
}

function sidebar(active) {
  const groups = navGroups.map(([label,items]) => `<div class="nav-group"><span class="nav-label">${label}</span>${items.map(([id,text,ic])=>`<a class="nav-link ${active===id?'active':''}" href="#${id}">${icon(ic)}<span>${text}</span></a>`).join('')}</div>`).join('')
  return `<aside class="sidebar"><a class="logo" href="#dashboard"><b>n1.</b><span>care</span></a><nav class="nav">${groups}</nav><div class="sidebar-bottom"><details class="account-menu"><summary class="account"><i class="avatar">JM</i><span><b>Dr Jane Miller</b><small>Professional plan</small></span>${icon('chevron')}</summary><div class="account-popover"><a href="#export">${icon('download')}Export data</a><a class="${active==='settings'?'active':''}" href="#settings">${icon('settings')}Settings</a><a class="${active==='billing'?'active':''}" href="#billing">${icon('card')}Billing</a><hr><a>Support & Feedback</a><a>Privacy Policy</a><a>Terms of Service</a></div></details></div></aside>`
}

function shell(active, content) {
  const patientControls = ['settings','billing'].includes(active) ? '' : `<button class="patient-picker"><i class="avatar">JD</i><span><small>PATIENT</small><b>John Doe</b></span>${icon('chevron')}</button><a class="header-action" href="#patients" aria-label="All patients">${icon('users')}<span class="label">All patients</span><span class="count-dot">24</span></a><button class="header-action" aria-label="Add patient">${icon('plus')}<span class="label">Add patient</span></button>`
  return `<div class="shell">${sidebar(active)}<section class="workspace"><header class="topbar"><div class="topbar-left"><button class="mobile-menu" aria-label="Open menu">${icon('menu')}</button>${patientControls}</div><div class="top-actions"><button class="icon-btn notification" aria-label="Notifications">${icon('bell')}</button><button class="measurement-toggle" aria-label="Measurement system">SI units ${icon('chevron')}</button></div></header><main class="main" id="main-content">${content}</main></section></div><nav class="mobile-tabs"><a class="${active==='dashboard'?'active':''}" href="#dashboard">${icon('dashboard')}Home</a><a class="${active==='medical-records'?'active':''}" href="#medical-records">${icon('file')}Records</a><a class="${active==='reports'?'active':''}" href="#reports">${icon('reports')}Reports</a><a class="${active==='settings'?'active':''}" href="#settings">${icon('settings')}Settings</a></nav>`
}

function currentPage() {
  const hash = location.hash.replace('#','')
  return hash || 'dashboard'
}

function render() {
  const page = currentPage()
  let content
  if (page === 'reports') content = renderReports()
  else if (tablePages[page]) content = renderTablePage(tablePages[page])
  else if (page === 'dashboard') content = renderDashboard()
  else if (page === 'patient-notes') content = renderNotes()
  else if (page === 'genetics') content = renderGenetics()
  else if (page === 'patient-settings') content = renderPatientSettings()
  else if (page === 'settings') content = renderSettings()
  else if (page === 'billing') content = renderBilling()
  else if (page === 'export') content = renderExport()
  else content = renderDashboard()
  document.getElementById('app').innerHTML = shell(page,content)
  document.title = `${tablePages[page]?.title || {'dashboard':'Dashboard','patient-notes':'Patient Notes','genetics':'Genetics','patient-settings':'Patient Settings','settings':'Settings','billing':'Billing','export':'Export data'}[page] || 'Dashboard'} — n1.care mock`
  document.getElementById('main-content')?.scrollTo(0,0)
}

window.addEventListener('hashchange',render)
render()
