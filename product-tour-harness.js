(() => {
  const head = (eyebrow, title, lead, action = '') => `
    <div class="pth-viewhead"><div><span class="pth-eyebrow">${eyebrow}</span><h4>${title}</h4>${lead ? `<p class="pth-viewlead">${lead}</p>` : ''}</div>${action}</div>`;
  const button = (label, quiet = false) => `<span class="pth-button${quiet ? ' is-quiet' : ''}">${label}</span>`;
  const line = (hit = false, text = '') => hit ? `<div class="pth-source-line is-hit">${text}</div>` : '<div class="pth-source-line"></div>';
  const field = (label, value, textarea = false) => `<div class="pth-field"><label>${label}</label><div class="${textarea ? 'pth-textarea' : 'pth-input'}">${value}</div></div>`;

  const tours = {
    upload: {
      label: 'Record upload and processing',
      nav: 'Medical Records',
      steps: [
        {
          label: 'Choose files',
          caption: 'Choose supported records together. n1 shows each file before anything is sent.',
          html: `${head('Medical records · 14 records','Add medical records','PDF clinical documents and supported TXT, CSV or TSV data files.',button('+ Upload records'))}
            <div class="pth-dropzone"><div><b>Drop records here or choose files</b><small>PDF · TXT · CSV · TSV</small></div></div>
            <div class="pth-card pth-upload-list"><div class="pth-file"><i class="pth-filetype">PDF</i><div><b>example-laboratory-01-mar-2025.pdf</b><small>12 pages · 2.4 MB</small></div><span class="pth-file-state">Ready</span></div><div class="pth-file"><i class="pth-filetype">PDF</i><div><b>consult-note-2025.pdf</b><small>6 pages · 1.1 MB</small></div><span class="pth-file-state">Ready</span></div><div class="pth-file"><i class="pth-filetype">CSV</i><div><b>genetics-export.csv</b><small>Supported raw data</small></div><span class="pth-file-state">Ready</span></div></div>`
        },
        {
          label: 'Transfer',
          caption: 'Files are validated and transferred securely. Progress and any duplicate or unsupported file are shown separately.',
          html: `${head('Secure transfer','Three records are uploading','Each file has its own progress and retry state.','<span class="pth-chip">Encrypted transfer</span>')}
            <div class="pth-card pth-upload-list"><div class="pth-file"><i class="pth-filetype">PDF</i><div><b>example-laboratory-01-mar-2025.pdf</b><small>Valid PDF · 12 pages</small><div class="pth-meter"><i style="width:100%"></i></div></div><span class="pth-file-state">Uploaded ✓</span></div><div class="pth-file"><i class="pth-filetype">PDF</i><div><b>consult-note-2025.pdf</b><small>Transferring securely</small><div class="pth-meter"><i style="width:74%"></i></div></div><span class="pth-file-state">74%</span></div><div class="pth-file"><i class="pth-filetype">CSV</i><div><b>genetics-export.csv</b><small>Waiting for transfer</small><div class="pth-meter"><i style="width:18%"></i></div></div><span class="pth-file-state">Queued</span></div></div>`
        },
        {
          label: 'Process',
          caption: 'n1 routes each file by type, reads the content, classifies health data and preserves the source relationship.',
          html: `${head('Processing pipeline','What happens after upload','The original record and extracted data stay visibly connected.')}
            <div class="pth-process"><article class="is-done"><b>1 · Validate</b><span>Confirm file type, size and page structure.</span></article><article class="is-done"><b>2 · Read</b><span>Recognise text, tables, dates and clinical context.</span></article><article class="is-done"><b>3 · Classify</b><span>Sort findings into the correct health data type.</span></article><article><b>4 · Link</b><span>Attach each item to its record and source page.</span></article></div>
            <div class="pth-grid cols-3" style="margin-top:14px"><div class="pth-card pth-type-card"><span>Biomarkers</span><b>31</b><small>29 ready · 2 to review</small></div><div class="pth-card pth-type-card"><span>Diagnoses</span><b>4</b><small>All source-linked</small></div><div class="pth-card pth-type-card"><span>Medications</span><b>7</b><small>1 missing end date</small></div></div>`
        },
        {
          label: 'Review result',
          caption: 'Processing does not silently become truth: the doctor can inspect extracted items, warnings and the exact source.',
          html: `${head('Processing complete','The record is ready for review','Open the extracted data or inspect the source before using it in a report.',button('Review 2 items'))}
            <div class="pth-grid cols-3"><div class="pth-card pth-type-card"><span>Ready</span><b>44</b><small>High-confidence items</small></div><div class="pth-card pth-type-card"><span>Needs review</span><b>2</b><small>Missing or conflicting detail</small></div><div class="pth-card pth-type-card"><span>Source pages</span><b>18</b><small>Available from each finding</small></div></div>
            <div class="pth-card" style="margin-top:12px;padding:13px"><span class="pth-chip amber">Check requested</span><b style="display:block;margin-top:9px;font-size:9px">Metformin has a start date but no end date</b><p class="pth-viewlead">Found on consultation note, page 4. Confirm that it is still active or add the stop date.</p></div>`
        }
      ]
    },
    'data-review': {
      label: 'Patient data review',
      nav: 'All patient data',
      steps: [
        {
          label: 'Overview',
          caption: 'Start with a patient-wide inventory rather than searching through separate documents.',
          html: `${head('John Doe · 14 records','All patient data','See what has been extracted, what changed and what still needs review.','<span class="pth-chip amber">3 items to review</span>')}
            <div class="pth-grid pth-type-grid"><div class="pth-card pth-type-card"><span>Biomarkers</span><b>48</b><small>6 changes</small></div><div class="pth-card pth-type-card"><span>Diagnoses</span><b>6</b><small>1 needs review</small></div><div class="pth-card pth-type-card"><span>Procedures</span><b>3</b><small>Reviewed</small></div><div class="pth-card pth-type-card"><span>Medications</span><b>7</b><small>1 incomplete</small></div><div class="pth-card pth-type-card"><span>Supplements</span><b>4</b><small>Current regimen</small></div><div class="pth-card pth-type-card"><span>Genetics</span><b>12</b><small>Supported findings</small></div></div>`
        },
        {
          label: 'Filter',
          caption: 'Open one data type and filter by source, specialty or review state without changing the underlying record.',
          html: `${head('Clinical data · Biomarkers','Review biomarkers','Latest values, patient ranges and sources stay in one table.',button('+ Add reading'))}
            <div class="pth-toolbar"><div class="pth-search">Search biomarkers…</div><span class="pth-chip">Source: All</span><span class="pth-chip amber">Needs review</span></div>
            <div class="pth-card pth-table"><div class="pth-tr"><span>Biomarker</span><span>Latest</span><span>Patient range</span><span>Source</span></div><div class="pth-tr"><b>Vitamin D</b><span>71 nmol/L</span><span>50–125</span><span>Lab p.2</span></div><div class="pth-tr is-selected"><b>LDL cholesterol</b><span>116 mg/dL</span><span>≤100</span><span>Lab p.3</span></div><div class="pth-tr"><b>HbA1c</b><span>5.8%</span><span>4.0–7.2</span><span>Lab p.1</span></div><div class="pth-tr"><b>Ferritin</b><span>88 µg/L</span><span>30–300</span><span>Lab p.4</span></div></div>`
        },
        {
          label: 'Inspect',
          caption: 'Open the row to compare the extracted value with the source wording and page—not a detached AI summary.',
          html: `${head('Evidence check','LDL cholesterol · 116 mg/dL','Collected 14 Mar 2025 · fasting sample','<span class="pth-chip">Source page 3</span>')}
            <div class="pth-source-drawer"><div class="pth-card pth-source-copy"><b style="font-size:10px">Reading details</b><dl><div><dt>Reference range</dt><dd>≤100 mg/dL</dd></div><div><dt>Laboratory range</dt><dd>≤130 mg/dL</dd></div><div><dt>Fasting</dt><dd>Yes</dd></div><div><dt>Review state</dt><dd>Clinician check</dd></div></dl>${button('Edit patient range',true)}</div><div class="pth-card pth-source-page"><b>Example Laboratory 01</b>${line()}${line(true,'LDL cholesterol &nbsp; 116 mg/dL &nbsp; Reference ≤130')}${line()}${line()}${line()}</div></div>`
        },
        {
          label: 'Correct',
          caption: 'A patient-specific range can be recorded without rewriting the laboratory value or hiding the original range.',
          html: `${head('Patient-specific context','Set the range used for review','The laboratory range remains visible beside the clinician-defined target.',button('Save range'))}
            <div class="pth-modal pth-card"><div class="pth-modal-head"><b>Edit LDL cholesterol range</b><span>×</span></div><div class="pth-modal-body">${field('Lower bound','No lower bound')}${field('Upper bound','100 mg/dL')}<div class="pth-field"><label>Why this range applies</label><div class="pth-textarea">Cardiovascular prevention target agreed at consultation.</div></div><div style="display:flex;justify-content:flex-end;gap:7px;margin-top:12px">${button('Cancel',true)}${button('Save patient range')}</div></div></div>`
        }
      ]
    },
    reports: {
      label: 'Report generation and settings',
      nav: 'Reports',
      steps: [
        {
          label: 'Choose report',
          caption: 'Use a purpose-built report or start a custom brief for a specific clinical question.',
          html: `${head('Reports','Choose the output you need','Each report starts as a draft for clinician review.',button('+ Custom report'))}
            <div class="pth-grid pth-report-tiles"><div class="pth-card pth-report-tile is-selected"><i>H</i><b>Health Summary</b><span>Current history, findings and care plan.</span></div><div class="pth-card pth-report-tile"><i>L</i><b>Health Over Time</b><span>Longitudinal change and linked events.</span></div><div class="pth-card pth-report-tile"><i>S</i><b>Supplement Review</b><span>Regimen, safety checks and monitoring.</span></div></div>`
        },
        {
          label: 'Settings',
          caption: 'Set the report name, audience, units and included records before generation.',
          html: `${head('Generate report','Health Summary','Configure the output before n1 begins.')}
            <div class="pth-modal pth-card"><div class="pth-modal-head"><b>Health Summary</b><span class="pth-chip">Draft</span></div><div class="pth-modal-body">${field('Report name','Consultation preparation · June 2026')}<div class="pth-grid cols-2"><div class="pth-field"><label>Audience</label><div class="pth-segment"><span class="is-active">Doctor</span><span>Patient</span></div></div><div class="pth-field"><label>Units</label><div class="pth-segment"><span class="is-active">SI</span><span>US</span></div></div></div>${field('Included records','12 of 14 records selected')}<div style="display:flex;justify-content:flex-end;margin-top:12px">${button('Continue')}</div></div></div>`
        },
        {
          label: 'Custom brief',
          caption: 'Describe the question, save it as a reusable template, and edit it again for the next patient.',
          html: `${head('Custom report','Write the clinical brief','The brief controls focus; it does not bypass source evidence or approval.')}
            <div class="pth-modal pth-card"><div class="pth-modal-head"><b>Create custom report</b><span>×</span></div><div class="pth-modal-body">${field('Template name','Cardiometabolic medication review')}${field('Clinical brief','Compare LDL, ApoB, HbA1c and weight before and after each medication change. Include dates, doses, source links and unresolved gaps.',true)}<div class="pth-field"><label>Records</label><div class="pth-input">Lab panels (6) · Consultation notes (3) · Medication list (1)</div></div><div style="display:flex;justify-content:space-between;gap:7px;margin-top:12px">${button('Save as template',true)}${button('Generate draft')}</div></div></div>`
        },
        {
          label: 'Generate',
          caption: 'The generation view shows the work in progress instead of leaving the user with an unexplained spinner.',
          html: `${head('Report generation','Building the clinical draft','n1 is working through the selected records and brief.','<span class="pth-chip">4 of 5 steps</span>')}
            <div class="pth-generation"><div class="pth-card pth-thinking"><b style="font-size:9px">Preparing report</b><ul><li>Selected 12 records</li><li>Built patient timeline</li><li>Compared medication periods</li><li>Linked findings to sources</li><li style="opacity:.55">Compose editable draft</li></ul></div><div class="pth-card pth-report-sheet"><span class="pth-eyebrow">Draft · Clinician review required</span><b style="font-family:var(--serif);font-size:17px">Cardiometabolic medication review</b>${line()}${line()}${line(true,'LDL fell from 142 to 116 mg/dL after the March medication adjustment.')}${line()}${line()}${line()}</div></div>`
        },
        {
          label: 'Review draft',
          caption: 'The result remains a draft until the clinician edits, checks evidence and explicitly approves it.',
          html: `${head('Draft ready','Review before sharing','Check source links, edit the language and choose when this version can leave the workspace.',button('Open full draft'))}
            <div class="pth-grid cols-3"><div class="pth-card pth-type-card"><span>Source-linked findings</span><b>18</b><small>Open any source</small></div><div class="pth-card pth-type-card"><span>Review notes</span><b>2</b><small>Need clinician input</small></div><div class="pth-card pth-type-card"><span>Share state</span><b style="font-size:12px">Private</b><small>Not yet approved</small></div></div><div class="pth-card" style="margin-top:12px;padding:13px"><span class="pth-chip amber">Approval required</span><b style="display:block;margin-top:9px;font-size:9px">No report is shared automatically</b><p class="pth-viewlead">Edit the draft, inspect evidence and approve the exact version to send.</p></div>`
        }
      ]
    },
    regimen: {
      label: 'Medication and supplement timing',
      nav: 'Medications',
      steps: [
        {
          label: 'Open plan',
          caption: 'See medications, supplements and monitoring dates on the same time axis.',
          html: `${head('Regimen timeline','Current and past care timing','Schedule · Jan to Jun 2026',button('+ Add item'))}
            <div class="pth-card pth-gantt"><div class="pth-gantt-head"><span></span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div><div class="pth-gantt-row"><div class="pth-gantt-label"><b>Metformin</b><small>500 mg twice daily</small></div><div class="pth-gantt-track"></div><div class="pth-gantt-bar" style="grid-column:2/8">Active</div></div><div class="pth-gantt-row"><div class="pth-gantt-label"><b>Atorvastatin</b><small>20 mg nightly</small></div><div class="pth-gantt-track"></div><div class="pth-gantt-bar" style="grid-column:4/8">Started 12 Mar</div></div><div class="pth-gantt-row"><div class="pth-gantt-label"><b>Vitamin D3</b><small>2,000 IU daily</small></div><div class="pth-gantt-track"></div><div class="pth-gantt-bar supp" style="grid-column:2/8">Active</div></div><div class="pth-gantt-row"><div class="pth-gantt-label"><b>Magnesium</b><small>200 mg daily</small></div><div class="pth-gantt-track"></div><div class="pth-gantt-bar pause" style="grid-column:2/5">Paused</div><div class="pth-gantt-bar supp" style="grid-column:5/8">Restarted</div></div></div>`
        },
        {
          label: 'Adjust timing',
          caption: 'Move the start or stop boundary while retaining the original source and the reason for change.',
          html: `${head('Edit regimen period','Adjust magnesium timing','Drag the period or enter exact dates.','<span class="pth-chip">Source: care plan p.2</span>')}
            <div class="pth-card pth-gantt"><div class="pth-gantt-head"><span></span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div><div class="pth-gantt-row"><div class="pth-gantt-label"><b>Magnesium</b><small>200 mg daily</small></div><div class="pth-gantt-track"></div><div class="pth-gantt-bar pause" style="grid-column:2/4">Paused</div><div class="pth-gantt-bar supp" style="grid-column:4/8">Restart 18 Mar</div></div><div class="pth-date-editor"><div><span>Start</span><b>18 Mar 2026</b></div><div><span>End</span><b>Ongoing</b></div><div><span>Timing</span><b>Evening</b></div></div><div class="pth-gantt-note pth-card"><b>Reason for adjustment</b><br>Restarted after gastrointestinal symptoms resolved; review tolerance at follow-up.</div></div>`
        },
        {
          label: 'Change dose',
          caption: 'A dose change becomes a new dated period rather than overwriting the historical dose.',
          html: `${head('Dose history','Preserve what changed and when','Atorvastatin changes from 10 mg to 20 mg on the confirmed date.',button('Save change'))}
            <div class="pth-card pth-gantt"><div class="pth-gantt-head"><span></span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div><div class="pth-gantt-row"><div class="pth-gantt-label"><b>Atorvastatin</b><small>Dose history</small></div><div class="pth-gantt-track"></div><div class="pth-gantt-bar" style="grid-column:2/4;background:#739996">10 mg</div><div class="pth-gantt-bar" style="grid-column:4/8">20 mg nightly</div></div><div class="pth-date-editor"><div><span>Effective date</span><b>12 Mar 2026</b></div><div><span>New dose</span><b>20 mg</b></div><div><span>Frequency</span><b>Nightly</b></div></div><div class="pth-gantt-note pth-card">The prior 10 mg period remains in the history and in reports covering that date range.</div></div>`
        },
        {
          label: 'Plan follow-up',
          caption: 'Attach monitoring to the regimen change so the next action is visible in the same plan.',
          html: `${head('Monitoring plan','Connect care changes to follow-up','The timeline shows when to recheck and what the clinician expects to review.',button('Add monitoring'))}
            <div class="pth-card pth-gantt"><div class="pth-gantt-head"><span></span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span></div><div class="pth-gantt-row"><div class="pth-gantt-label"><b>Atorvastatin</b><small>20 mg nightly</small></div><div class="pth-gantt-track"></div><div class="pth-gantt-bar" style="grid-column:2/8">Current dose</div></div><div class="pth-gantt-row"><div class="pth-gantt-label"><b>Lipid panel</b><small>Monitoring</small></div><div class="pth-gantt-track"></div><div class="pth-gantt-bar supp" style="grid-column:5/6">12 weeks</div></div><div class="pth-gantt-note pth-card"><b>Follow-up · 6 June 2026</b><br>Recheck LDL, ApoB and liver enzymes; review tolerance before approving the next plan.</div></div>`
        }
      ]
    },
    review: {
      label: 'Clinical data issue review',
      nav: 'Review',
      steps: [
        {
          label: 'See queue',
          caption: 'The queue groups incomplete, conflicting and uncertain data before report approval.',
          html: `${head('Clinical review','Three issues need attention','Prioritised by how the issue could affect the patient history or report.','<span class="pth-chip amber">3 open</span>')}
            <div class="pth-review-layout"><div class="pth-card pth-issue-list"><div class="pth-issue is-selected"><span class="pth-chip amber">Incomplete</span><b style="margin-top:7px">Medication missing end date</b><span>Metformin · started 14 Nov 2024</span></div><div class="pth-issue"><span class="pth-chip red">Conflict</span><b style="margin-top:7px">Two HbA1c units disagree</b><span>Same collection date · two sources</span></div><div class="pth-issue"><span class="pth-chip">Possible duplicate</span><b style="margin-top:7px">Vitamin D reading repeated</b><span>71 nmol/L · 6 Jun 2025</span></div></div><div class="pth-card pth-issue-detail"><h5>Medication missing end date</h5><p class="pth-viewlead">The prescription appears active because no stop date was recorded.</p><div class="pth-evidence"><b>Source context</b><br>“Metformin 500 mg twice daily” · consultation note, page 4.</div></div></div>`
        },
        {
          label: 'Inspect source',
          caption: 'The issue panel shows exactly why it was raised and the evidence available to resolve it.',
          html: `${head('Issue evidence','Was metformin stopped?','Compare the medication entry with the latest source before editing.')}
            <div class="pth-source-drawer"><div class="pth-card pth-source-copy"><span class="pth-chip amber">Missing end date</span><dl><div><dt>Medication</dt><dd>Metformin</dd></div><div><dt>Started</dt><dd>14 Nov 2024</dd></div><div><dt>Stopped</dt><dd>Not recorded</dd></div><div><dt>Latest mention</dt><dd>2 Feb 2026</dd></div></dl></div><div class="pth-card pth-source-page"><b>Consultation note</b>${line()}${line(true,'Medication review: discontinue metformin after the current prescription.')}${line()}${line()}${line()}</div></div>`
        },
        {
          label: 'Resolve',
          caption: 'Confirm the end date, mark it ongoing, or explain why the evidence is insufficient.',
          html: `${head('Resolve issue','Confirm the medication status','The correction updates the timeline while preserving the original extraction.')}
            <div class="pth-modal pth-card"><div class="pth-modal-head"><b>Metformin · missing end date</b><span>×</span></div><div class="pth-modal-body"><div class="pth-segment"><span>Still active</span><span class="is-active">Stopped</span></div>${field('End date','2 Feb 2026')}${field('Review note','Stop date confirmed from consultation note, page 4.',true)}<div style="display:flex;justify-content:flex-end;gap:7px;margin-top:12px">${button('Leave unresolved',true)}${button('Resolve issue')}</div></div></div>`
        },
        {
          label: 'Audit state',
          caption: 'The resolved state records what changed and lets the report show that the issue was checked.',
          html: `${head('Review complete','The history is ready for reporting','One issue was resolved; two lower-priority items remain.')}
            <div class="pth-card pth-resolved"><div><i>✓</i><b>Medication timeline updated</b><p>Metformin now ends on 2 Feb 2026. The source and clinician review note remain attached.</p><span class="pth-chip green" style="margin-top:12px">Resolved by Dr Chen · today</span></div></div>`
        }
      ]
    },
    patients: {
      label: 'Patient management',
      nav: 'Patients',
      steps: [
        {
          label: 'Patient list',
          caption: 'See workload and readiness across the practice before opening an individual workspace.',
          html: `${head('Patient management','Patients','Search, group and move directly to the next task.',button('+ Add patient'))}
            <div class="pth-grid pth-patient-stats"><div class="pth-card pth-stat"><span>Patients</span><b>42</b></div><div class="pth-card pth-stat"><span>Need review</span><b>7</b></div><div class="pth-card pth-stat"><span>Processing</span><b>3</b></div><div class="pth-card pth-stat"><span>Reports ready</span><b>5</b></div></div>
            <div class="pth-toolbar"><div class="pth-search">Search patients…</div><span class="pth-chip">Group: All</span><span class="pth-chip amber">Needs action</span></div><div class="pth-card pth-table pth-patient-table"><div class="pth-tr"><span>Patient</span><span>Records</span><span>Review</span><span>Invite</span><span></span></div><div class="pth-tr is-selected"><span class="pth-patient-name"><i class="pth-mini-avatar">JD</i><b>John Doe</b></span><span>14</span><span>3 issues</span><span>Claimed</span><span>›</span></div><div class="pth-tr"><span class="pth-patient-name"><i class="pth-mini-avatar">AR</i><b>Ana Ruiz</b></span><span>8</span><span>Ready</span><span>Pending</span><span>›</span></div><div class="pth-tr"><span class="pth-patient-name"><i class="pth-mini-avatar">MK</i><b>Malik Khan</b></span><span>21</span><span>1 issue</span><span>Not sent</span><span>›</span></div></div>`
        },
        {
          label: 'Add patient',
          caption: 'Create the clinician workspace first; inviting the patient is an explicit next step, not an automatic side effect.',
          html: `${head('New patient','Create a patient workspace','Start with the minimum identifying details used by the practice.')}
            <div class="pth-card pth-add-patient"><span class="pth-eyebrow">Patient details</span><div class="pth-form-grid">${field('First name','Jamie')}${field('Last name','Rivera')}${field('Date of birth','22 Aug 1984')}${field('Sex','Female')}${field('Practice ID','N1-2048')}${field('Care group','Cardiometabolic')}</div><div style="display:flex;justify-content:flex-end;margin-top:13px">${button('Create patient')}</div></div>`
        },
        {
          label: 'Track status',
          caption: 'Readiness states show whether records are still processing, data needs review or a report can be prepared.',
          html: `${head('Patient created','Jamie Rivera','Workspace created · no invitation sent yet','<span class="pth-chip green">Active workspace</span>')}
            <div class="pth-workspace-summary"><div class="pth-card pth-profile-card"><i class="pth-mini-avatar">JR</i><h5>Jamie Rivera</h5><p>Cardiometabolic group<br>Added today</p>${button('Invite patient',true)}</div><div class="pth-card pth-ready-list"><div class="pth-ready-row"><span>Medical records</span><b>0 · Add records</b></div><div class="pth-ready-row"><span>Structured data</span><b>Waiting for records</b></div><div class="pth-ready-row"><span>Clinical review</span><b>No open issues</b></div><div class="pth-ready-row"><span>Reports</span><b>Not enough data</b></div><div class="pth-ready-row"><span>Patient access</span><b>Not invited</b></div></div></div>`
        },
        {
          label: 'Open workspace',
          caption: 'The selected patient remains visible while the clinician moves between records, data, care and reports.',
          html: `${head('Jamie Rivera · patient workspace','Everything stays patient-scoped','The persistent patient selector prevents work from drifting into another record.',button('+ Upload records'))}
            <div class="pth-grid cols-2"><div class="pth-card pth-type-card"><span>Clinical documents</span><b>6</b><small>1 still processing</small></div><div class="pth-card pth-type-card"><span>Data review</span><b>2</b><small>Items need attention</small></div><div class="pth-card pth-type-card"><span>Care plan</span><b>4</b><small>Active items</small></div><div class="pth-card pth-type-card"><span>Reports</span><b>1</b><small>Draft ready</small></div></div>`
        }
      ]
    },
    invites: {
      label: 'Doctor and patient invitation flows',
      nav: 'Invitations',
      steps: [
        {
          label: 'Doctor invites',
          caption: 'The doctor creates the workspace, enters the patient email and chooses to send the invitation.',
          html: `${head('Doctor → patient','Invite Jamie to n1?','The patient can access their own data for free after claiming the invitation.')}
            <div class="pth-modal pth-card"><div class="pth-modal-head"><b>Invite Jamie Rivera</b><span>×</span></div><div class="pth-modal-body">${field("Patient's email",'jamie.rivera@example.com')}<div class="pth-evidence"><b>Patient ownership notice</b><br>Once connected, Jamie can access their own data. The doctor keeps control of clinician-authored reports and sharing.</div><div style="display:flex;justify-content:flex-end;gap:7px;margin-top:12px">${button('Skip for now',true)}${button('Send invite')}</div></div></div>`
        },
        {
          label: 'Patient claims',
          caption: 'The patient opens the current invitation, creates or signs into their account and confirms the connection.',
          html: `${head('Patient invitation','Jamie receives a secure email','Only the latest pending invitation link remains active.')}
            <div class="pth-invite-flow"><div class="pth-card pth-invite-person"><h5><i class="pth-mini-avatar">DC</i> Dr Chen</h5><p>Created the patient workspace and sent the invitation.</p><div class="pth-invite-status pending">Invite pending</div></div><div class="pth-invite-divider"><span>→</span></div><div class="pth-card pth-invite-person"><h5><i class="pth-mini-avatar">JR</i> Jamie Rivera</h5><div class="pth-mail"><strong>Dr Chen invited you to n1</strong><span>Claim your account to view the data connected to your care.</span>${button('Accept invitation')}</div></div></div>`
        },
        {
          label: 'Connected',
          caption: 'After acceptance, both sides see the connection state and the patient can access their own workspace.',
          html: `${head('Connection active','Doctor and patient are connected','The connection can be managed or revoked without deleting the clinical workspace.')}
            <div class="pth-invite-flow"><div class="pth-card pth-invite-person"><h5><i class="pth-mini-avatar">DC</i> Dr Chen</h5><p>Can manage the clinician workspace and share approved reports.</p><div class="pth-invite-status">Patient connected ✓</div></div><div class="pth-invite-divider"><span>↔</span></div><div class="pth-card pth-invite-person"><h5><i class="pth-mini-avatar">JR</i> Jamie Rivera</h5><p>Can view their own data and reports that have been shared with them.</p><div class="pth-invite-status">Account claimed ✓</div></div></div>`
        },
        {
          label: 'Patient invites',
          caption: 'The reverse flow starts in the patient account: the patient enters the doctor’s email and sends a connection request.',
          html: `${head('Patient → doctor','Invite your doctor','A patient can have one active doctor connection at a time.')}
            <div class="pth-modal pth-card"><div class="pth-modal-head"><b>Doctor invitations</b><span class="pth-chip">Patient view</span></div><div class="pth-modal-body"><p class="pth-viewlead" style="margin-top:0">Invite your doctor to view your health records and shared reports.</p>${field("Doctor's email",'dr.chen@clinic.example')}<div style="display:flex;justify-content:flex-end;margin-top:12px">${button('Invite doctor')}</div><div class="pth-invite-status pending">Pending · Dr Chen must accept</div></div></div>`
        },
        {
          label: 'Doctor accepts',
          caption: 'The doctor sees who initiated the request and explicitly accepts or declines it.',
          html: `${head('Doctor inbox','Jamie invited you as their doctor','The request remains pending until the doctor responds.')}
            <div class="pth-card" style="padding:15px"><div style="display:flex;align-items:center;justify-content:space-between;gap:14px"><div class="pth-patient-name"><i class="pth-mini-avatar">JR</i><div><b style="display:block;font-size:9px">Jamie Rivera</b><span class="pth-muted" style="font-size:7px">Invited you as their doctor · Pending</span></div></div><div style="display:flex;gap:7px">${button('Decline',true)}${button('Accept')}</div></div></div><div class="pth-card pth-resolved" style="margin-top:12px;min-height:180px"><div><i>✓</i><b>Connection accepted</b><p>Jamie now appears in the doctor’s patient list with a visible patient-initiated connection state.</p></div></div>`
        }
      ]
    }
  };

  const sideItems = (active) => {
    const items = [
      ['Dashboard','▦'],['Medical Records','▤'],['All patient data','≋'],['Reports','▥'],['Medications','●'],['Review','✓'],['Patients','◎'],['Invitations','↔']
    ];
    return items.map(([label, icon], index) => `${index === 0 || index === 4 || index === 6 ? `<span class="pth-side-label">${index === 0 ? 'Overview' : index === 4 ? 'Care' : 'Management'}</span>` : ''}<div class="pth-side-item${label === active ? ' is-active' : ''}" data-icon="${icon}">${label}</div>`).join('');
  };

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const instances = [];

  const scrollHero = document.querySelector('[data-product-hero-scroll]');
  if (scrollHero) {
    const sticky = scrollHero.querySelector('.product-hero-sticky');
    const heroWindow = scrollHero.querySelector('.product-hero-window');
    const heroStory = scrollHero.querySelector('.product-hero-story');
    const upload = scrollHero.querySelector('.product-hero-upload');
    const uploadButton = scrollHero.querySelector('.product-hero-upload-button');
    const processingSteps = [...scrollHero.querySelectorAll('[data-upload-state]')];
    const heroApp = scrollHero.querySelector('.product-hero-app');
    const heroRecords = scrollHero.querySelector('.product-hero-records');
    const heroSidebarItems = [...scrollHero.querySelectorAll('.product-hero-sidebar b')];
    const storyKicker = heroStory?.querySelector('.page-kicker');
    const storyTitle = heroStory?.querySelector('h2');
    const storyLead = heroStory?.querySelector('p');
    const storyList = heroStory?.querySelector('ul');
    const heroRecordStatus = (delay) => `<em class="hero-record-live-status" style="--hero-record-delay:${delay}s"><i><u>✓</u></i><span><u class="is-preparing">Preparing</u><u class="is-queued">Queued</u><u class="is-routing">Routing</u><u class="is-parsing">Parsing</u><u class="is-grouping">Grouping</u><u class="is-storing">Storing</u><u class="is-complete">Complete</u></span><b></b></em>`;
    const heroPencilIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>';
    const heroTrashIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 11v6M14 11v6M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
    const heroEditDetails = {
      Procedures: {
        title: 'Edit Procedure',
        description: 'Update the procedure information below.',
        fields: [['Procedure Name','Cardiac CT'],['Date','22 Nov 2024']],
        notes: [['Explanation (Optional)','Coronary risk investigation'],['Outcome (Optional)','No obstructive disease']],
        submit: 'Update Procedure'
      },
      Medications: {
        title: 'Edit Medication',
        description: 'Update the details of this medication below.',
        fields: [['Classification','Medication'],['Name','Metformin'],['Brand Name (Optional)','Glucophage'],['Dosage','500'],['Unit','mg'],['Type','tablet'],['Frequency','Twice daily'],['Started From','22 Nov 2024'],['Stopped On (Optional)','Select date']],
        notes: [['Reason (Optional)','Insulin resistance'],['Note (Optional)','Take with food. Review tolerance at the next consultation.']],
        submit: 'Update'
      },
      Supplements: {
        title: 'Edit Supplement',
        description: 'Update the details of this supplement below.',
        fields: [['Classification','Supplement'],['Name','Magnesium glycinate'],['Brand Name (Optional)','Pure Encapsulations'],['Dosage','200'],['Unit','mg'],['Type','capsule'],['Frequency','Nightly'],['Started From','14 Mar 2025'],['Stopped On (Optional)','Select date']],
        notes: [['Reason (Optional)','Magnesium support'],['Note (Optional)','Separate from morning medication by at least two hours.']],
        submit: 'Update'
      }
    };
    const heroMenuDefinitions = [
      { view: 'dashboard', label: 'Dashboard', kicker: 'Patient dashboard', title: 'See the full record.', lead: 'Start with the key facts. See source files, open checks, new reports and test alerts.', bullets: ['Switch patients without losing your place','Add files or start a report','Open any item that needs a check'], badge: 'John Doe', stats: [['Records','14'],['Biomarkers','48'],['Diagnoses','6'],['Procedures','3']] },
      { view: 'list', label: 'Medical Records', kicker: 'Source record library', title: 'Upload, parse and keep every source.', lead: 'Add the source files, follow each record while n1 parses it, then review the structured data beside the original page.', bullets: ['Upload PDFs together in one secure step','See Preparing, Parsing and Storing progress','Review extracted data beside each source PDF'], badge: '14 records', action: '+ Upload Records', filters: ['Search records…','Status: All','Uploaded ↓'], columns: ['Record Name','Uploaded','Test Date','Pages','Status','Insights'], rows: [['example-laboratory-01-mar-2025.pdf','14 Mar 2025','14 Mar 2025','12',heroRecordStatus(2.15),'View insights'],['consult-note-2025.pdf','11 Mar 2025','11 Mar 2025','6',heroRecordStatus(2.3),'View insights'],['cardiac-ct-2024.pdf','22 Nov 2024','22 Nov 2024','18',heroRecordStatus(2.45),'View insights']] },
      { view: 'reports', label: 'Reports', kicker: 'Report workspace', title: 'Build reports your way.', lead: 'Choose a report type, set its scope and add a short brief. Keep drafts and approved reports in one place.', bullets: ['Use a set report or save your own','Move between Reports and Archive','Check status, access and who it is for'], badge: '4 reports', action: '+ Generate Report', columns: ['Report name','Created','Type','Status'], rows: [['Health Summary','26 Aug 2026','Health Summary','Complete'],['Health Over Time','25 Aug 2026','Longitudinal','Generating'],['Supplement Review','20 Aug 2026','Supplements','Complete']] },
      { view: 'list', label: 'Biomarkers', kicker: 'Biomarker readings', title: 'Track each result over time.', lead: 'Filter tests by source or field. See the latest result, then open past values and ranges.', bullets: ['See the latest value and date','Check the source and trend','Open readings and patient ranges'], badge: '48 biomarkers', filters: ['Search by name…','All Sources','Specialty'], columns: ['Name','Source','Latest','Latest Date','Trend','Insights'], rows: [['LDL cholesterol','Blood','116 mg/dL','14 Mar 2025','↘','View all 4'],['Vitamin D','Blood','71 nmol/L','6 Jun 2025','→','View all 6'],['HbA1c','Blood','5.8%','14 Mar 2025','→','View all 3']] },
      { view: 'list', label: 'Diagnoses', editable: true, kicker: 'Diagnosis history', title: 'See each issue in context.', lead: 'See current and past diagnoses. Check each start date, end date, status, note and source page.', bullets: ['See when each issue began','Check if it is current or resolved','Edit the clinical note'], badge: '6 diagnoses', action: '+ Add Manually', filters: ['Search diagnoses…'], columns: ['Name','Date','Date Resolved','Status','Explanation'], rows: [['Insulin resistance','11 Mar 2025','—','Review','Clinical note requires confirmation'],['Hyperlipidaemia','14 Mar 2025','—','Current','Elevated LDL across two lab records'],['Vitamin D insufficiency','22 Nov 2024','6 Jun 2025','Resolved','Improved following supplementation']] },
      { view: 'list', label: 'Procedures', editable: true, kicker: 'Procedure history', title: 'See care in date order.', lead: 'View each test or procedure by date. Open its explanation, outcome and source file.', bullets: ['Search the full history','Read or edit the explanation and outcome','Open the linked source PDF'], badge: '3 procedures', action: '+ Add Manually', filters: ['Search procedures…'], columns: ['Name','Date','Explanation','Outcome'], rows: [['Cardiac CT','22 Nov 2024','Coronary risk investigation','No obstructive disease'],['DEXA scan','6 Aug 2024','Baseline bone-density assessment','Within expected range'],['Clinical examination','11 Mar 2025','Cardiometabolic review','Follow-up planned']] },
      { view: 'genetics', label: 'Genetics', kicker: 'Genetic findings', title: 'Review findings by evidence tier.', lead: 'Move between raw DNA and lab findings, then expand a gene to see its variants, context and literature.', bullets: ['Separate raw DNA from lab data','Review findings by evidence tier','Expand each gene for variant context'], badge: '12 findings', action: 'Upload Records' },
      { view: 'list', label: 'Medications', editable: true, kicker: 'Medication list', title: 'Check every medicine.', lead: 'See current and past medications in one list. Check the dosage, type, frequency and dates, then open a row to edit it.', bullets: ['See when each drug was used','Edit the real medication fields','Spot a missing stop date'], badge: '7 medications', action: '+ Add', filters: ['Search medications…'], columns: ['Name','Brand Name','Dosage','Type','Frequency','Started','Stopped On'], rows: [['Metformin','Glucophage','500 mg','Tablet','Twice daily','22 Nov 2024','—'],['Rosuvastatin','Crestor','10 mg','Tablet','Daily','14 Mar 2025','—'],['Aspirin','—','81 mg','Tablet','Daily','22 Nov 2024','18 Feb 2025']] },
      { view: 'list', label: 'Supplements', editable: true, kicker: 'Supplement list', title: 'Keep the full plan in view.', lead: 'See the brand, dosage, type, frequency and dates for each supplement. Open a row to change it.', bullets: ['Use one view for supplements','Edit the real supplement fields','Upload a file or add one manually'], badge: '4 supplements', action: '+ Add', filters: ['Search supplements…'], columns: ['Name','Brand Name','Dosage','Type','Frequency','Started','Stopped On'], rows: [['Magnesium glycinate','Pure Encapsulations','200 mg','Capsule','Nightly','14 Mar 2025','—'],['Vitamin D3','Thorne','2,000 IU','Softgel','Daily','6 Jun 2025','—'],['Omega-3','Nordic Naturals','1 g','Softgel','With food','14 Mar 2025','—']] }
    ];
    const clinicianPageSummaries = {
      Dashboard: 'One patient record. One clear view.',
      'Medical Records': 'Upload records. n1 builds the history.',
      Reports: 'Create, review and approve each report.',
      Biomarkers: 'Track results, ranges and sources.',
      Diagnoses: 'Review each diagnosis in context.',
      Procedures: 'See tests and procedures by date.',
      Genetics: 'Review findings, evidence and sources.',
      Medications: 'See every medicine in one list.',
      Supplements: 'See every supplement in one list.'
    };
    const heroMotionPanels = {
      'Medical Records': `<div class="hero-record-upload-card"><header><b><i>↑</i>Upload records</b><span>×</span></header><div class="hero-record-upload-drop">＋ Drop or click to add more files</div><div class="hero-record-upload-file"><i>PDF</i><span><b>example-laboratory-01-mar-2025.pdf</b><small>12 pages · 2.4 MB</small></span><em>×</em></div><div class="hero-record-upload-file"><i>PDF</i><span><b>consult-note-2025.pdf</b><small>6 pages · 1.1 MB</small></span><em>×</em></div><div class="hero-record-upload-file"><i>PDF</i><span><b>cardiac-ct-2024.pdf</b><small>18 pages · 3.8 MB</small></span><em>×</em></div><footer><span>3 files · 36 pages · 7.3 MB</span><strong>↑ Upload 3 records</strong></footer></div><div class="hero-record-complete"><i>✓</i><div><header><b>All record data is ready</b><small>3 documents parsed and linked to their sources</small></header><section><span><b>83</b>Biomarkers</span><span><b>2</b>Diagnoses</span><span><b>1</b>Procedure</span><span><b>5</b>Medications</span><span><b>7</b>Supplements</span><span><b>1</b>Genetics</span></section></div></div>`,
      'Biomarkers': `<div class="product-hero-native-motion is-biomarkers"><div class="hero-native-dropdown"><b>Source: Blood</b><span>All sources</span><span>Blood</span><span>Urine</span></div><div class="hero-native-detail"><b>LDL cholesterol history</b><span>142 → 116 mg/dL · patient target ≤100</span><strong>Example Laboratory 01 · page 3</strong></div></div>`,
      'Diagnoses': `<div class="product-hero-native-motion is-edit"><div><b>Edit diagnosis</b><span>Insulin resistance</span></div><div><span>Status&nbsp; Review</span><span>Date resolved&nbsp; —</span><strong>Save changes</strong></div></div>`,
      'Procedures': `<div class="product-hero-native-motion is-source"><div><b>Cardiac CT</b><span>22 Nov 2024 · No obstructive disease</span></div><strong>Open cardiac-ct-2024.pdf · page 1</strong></div>`,
      'Medications': `<div class="product-hero-native-motion is-edit"><div><b>Edit medication</b><span>Metformin · 500 mg tablet</span></div><div><span>Twice daily</span><span>Started 22 Nov 2024</span><strong>Save changes</strong></div></div>`,
      'Supplements': `<div class="product-hero-native-motion is-schedule"><div><b>Dose and timing</b><span>Magnesium glycinate · 200 mg capsule</span></div><div><span>Morning</span><strong>Night</strong><span>With food</span></div></div>`
    };
    const renderHeroEditModal = (definition) => {
      const detail = heroEditDetails[definition.label];
      if (!detail) return '';
      return `<div class="hero-data-modal"><div class="hero-data-modal-shade"></div><section><header><div><b>${detail.title}</b><span>${detail.description}</span></div><i>×</i></header><div class="hero-data-modal-fields">${detail.fields.map(([label,value]) => `<label><span>${label}</span><strong>${value}</strong></label>`).join('')}</div><div class="hero-data-modal-notes">${detail.notes.map(([label,value]) => `<label class="hero-data-modal-note"><span>${label}</span><strong>${value}</strong></label>`).join('')}</div><footer><div></div><div><b>Cancel</b><strong>${detail.submit}</strong></div></footer></section></div>`;
    };
    const renderHeroTable = (definition) => {
      const columns = definition.editable ? [...definition.columns,''] : definition.columns;
      const rows = definition.rows.map((row, rowIndex) => definition.editable ? [...row,`<button class="hero-data-edit-button" type="button" aria-label="Edit">${heroPencilIcon}</button>`] : row);
      const motion = definition.editable ? renderHeroEditModal(definition) : heroMotionPanels[definition.label] || '';
      return `<div class="product-hero-menu-toolbar">${definition.filters.map((filter, index) => `<span class="${index === 0 ? 'is-search' : index > 0 ? 'is-filter' : ''}">${filter}</span>`).join('')}</div><div class="product-hero-data-table${definition.editable ? ' is-editable' : ''}" style="--hero-columns:${columns.length};--hero-data-columns:${definition.columns.length}"><header>${columns.map((column) => `<b>${column}</b>`).join('')}</header>${rows.map((row, rowIndex) => `<div class="${rowIndex === 0 ? 'is-demo-row' : ''}">${row.map((cell, index) => `<${index === 0 ? 'b' : 'span'}>${cell}</${index === 0 ? 'b' : 'span'}>`).join('')}</div>`).join('')}</div>${motion}`;
    };
    const renderHeroPageBodyBase = (definition) => {
      if (definition.view === 'dashboard') return `<div class="product-hero-dashboard-stats">${definition.stats.map((stat) => `<article><i></i><div><b>${stat[1]}</b><span>${stat[0]}</span></div></article>`).join('')}</div><div class="product-hero-dashboard-body"><section><header><b>Quick Actions</b></header><div class="product-hero-quick-actions"><article><i>↑</i><div><b>Upload Records</b><span>Add PDFs and supported data files</span></div><strong>→</strong></article><article><i>▤</i><div><b>Generate Report</b><span>Choose a report and set its scope</span></div><strong>→</strong></article></div></section><section><header><b>Recent Reports</b><span>View all →</span></header><div class="product-hero-dashboard-list"><article><b>Health Summary</b><span>26 Aug 2026</span><strong>Complete</strong></article><article><b>Health Over Time</b><span>25 Aug 2026</span><strong>Generating</strong></article></div></section><section><header><b>Biomarker Alerts</b><span>2 need review</span></header><div class="product-hero-dashboard-list"><article><b>LDL cholesterol</b><span>116 mg/dL · target ≤100</span><strong>Review</strong></article><article><b>Vitamin D</b><span>71 nmol/L · range 50–125</span><strong>In range</strong></article></div></section></div>`;
      if (definition.view === 'reports') return `<div class="product-hero-report-market"><header><b>Generate a Report</b><span>Choose a report type</span></header><div><article><b>Health Summary</b><small>Current record and care plan</small></article><article><b>Health Over Time</b><small>Longitudinal changes</small></article><article><b>Supplement Review</b><small>Regimen and monitoring</small></article><article><b>Custom Report</b><small>Saved sections and brief</small></article></div></div><div class="product-hero-menu-tabs"><b>Reports</b><span>Archive</span></div>${renderHeroTable({ ...definition, filters: ['Search reports…','Status: All'] })}`;
      if (definition.view === 'genetics') return `<div class="product-hero-menu-tabs hero-genetics-tabs"><b>Raw data <em>8</em></b><span>Lab data <em>4</em></span></div><div class="hero-genetics-tier"><header><div><small>TIER 1</small><b>Strong clinical evidence <em>2</em></b><span>Well-supported findings with potential clinical relevance.</span></div><i>⌃</i></header><section><article><div><b>APOE</b><span>1 variant</span></div><p>Associated with lipid transport and late-onset Alzheimer disease susceptibility.</p><strong>›</strong></article><article><div><b>SLCO1B1</b><span>1 variant</span></div><p>Drug-response finding relevant to statin transport.</p><strong>›</strong></article></section></div><div class="hero-genetics-tier is-secondary"><header><div><small>TIER 2</small><b>Moderate evidence <em>6</em></b><span>Supported associations that may add patient context.</span></div><i>⌄</i></header></div>`;
      return renderHeroTable(definition);
    };
    const renderHeroRecordUpload = () => {
      const records = [
        ['Example Laboratory 01','example-laboratory-01-mar-2025.pdf','Lab report','14 Mar 2025'],
        ['Cardiology consult','consult-note-2025.pdf','Consult note','11 Mar 2025'],
        ['Example Imaging Centre 01','cardiac-ct-2024.pdf','Imaging','22 Nov 2024']
      ];
      const status = `<em class="hero-upload-live"><i></i><span><u>Preparing</u><u>Reading</u><u>Organising</u><u>Complete</u></span></em>`;
      return `<div class="hero-record-upload-demo">
        <div class="hero-record-empty"><i>＋</i><b>No records yet</b><span>Upload the first files to build this patient history.</span></div>
        <aside class="hero-record-upload-modal"><header><b>Upload records</b><span>×</span></header><div>＋ Drop or click to add more files</div>${records.map((record) => `<article><i>PDF</i><span><b>${record[1]}</b><small>${record[0]} · selected</small></span><em>×</em></article>`).join('')}<footer><span>3 files · 36 pages · 7.3 MB</span><b>↑ Upload 3 records</b></footer></aside>
        <div class="hero-record-status"><b><span>Uploading 3 records</span><span>Secure processing</span><span>All 3 records ready</span></b><small>Encrypted in transit</small></div>
        <div class="hero-record-table"><header><b>Record</b><b>Type</b><b>Uploaded</b><b>Status</b></header>${records.map((record) => `<article><span><b>${record[0]}</b><small>${record[1]}</small></span><span>${record[2]}</span><span>${record[3]}</span><span>${status}</span></article>`).join('')}</div>
        <aside class="hero-record-ready"><i>✓</i><div><b>All record data is ready</b><span>3 documents processed and linked to their sources</span><small><b>83</b> Biomarkers　 <b>2</b> Diagnoses　 <b>1</b> Procedure　 <b>5</b> Medications</small></div></aside>
      </div>`;
    };
    const renderHeroReportFlow = () => `<div class="hero-report-demo">
      <div class="hero-report-tabs"><b>Reports</b><span>Archive</span></div>
      <div class="hero-report-toolbar"><span>Search reports…</span><span>Status: All</span></div>
      <div class="hero-report-table"><header><b>Report name</b><b>Created</b><b>Type</b><b>Status</b></header><article><b>Health Over Time</b><span>25 Aug 2026</span><span>Longitudinal</span><em>Complete</em></article><article><b>Supplement Review</b><span>20 Aug 2026</span><span>Supplements</span><em>Complete</em></article><article><b>Cardiometabolic Review</b><span>18 Aug 2026</span><span>Custom</span><em>Complete</em></article><article class="hero-report-new"><b>Health Summary</b><span>27 Aug 2026</span><span>Health Summary</span><em>Complete</em></article><article class="hero-report-custom-new"><b>Metabolic Trend Brief</b><span>27 Aug 2026</span><span>Custom · Chart</span><em>Complete</em></article></div>
      <aside class="hero-report-generator"><header><div><b>Generate a Report</b><span>Choose what to prepare for John Doe</span></div><i>×</i></header><div class="hero-report-types"><article><i>▤</i><b>Health Summary</b><span>Current record and care plan</span></article><article><i>↗</i><b>Health Over Time</b><span>Longitudinal changes</span></article><article><i>●</i><b>Supplement Review</b><span>Regimen and monitoring</span></article></div><footer><span>Health Summary selected</span><b>Generate report</b></footer><div class="hero-report-generating"><i></i><b>Generating Health Summary</b><span>Organising the record and linking every source…</span></div></aside>
      <aside class="hero-report-viewer"><header><span>← Reports</span><b>Health Summary</b><em>Generated 27 Aug 2026</em></header><div class="hero-report-viewer-body"><section><span>Patient overview</span><h3>John Doe</h3><p>A source-linked summary of the current record, important changes and items for review.</p></section><div><article><span>Records reviewed</span><b>3</b></article><article><span>Biomarkers</span><b>83</b></article><article><span>Items for review</span><b>2</b></article></div><footer><b>Ready for clinician review</b><span>Every finding opens its source record.</span></footer></div></aside>
      <aside class="hero-custom-report-generator"><header><div><b>Create a custom report</b><span>Choose the content and visual evidence</span></div><i>×</i></header><div class="hero-custom-report-name"><span>Report name</span><b>Metabolic Trend Brief</b></div><div class="hero-custom-report-layout"><nav><b>Sections</b><span>Patient overview</span><span>Key findings</span><span class="is-selected">＋ Add chart</span></nav><section><header><b>Add a chart</b><span>Biomarker · HbA1c</span></header><div class="hero-custom-chart"><svg viewBox="0 0 300 92" preserveAspectRatio="none"><path d="M8 18 C58 23 86 38 145 43 S245 59 292 72" fill="none" stroke="#376361" stroke-width="3"/><g fill="#fff" stroke="#376361" stroke-width="2"><circle cx="8" cy="18" r="4"/><circle cx="145" cy="43" r="4"/><circle cx="292" cy="72" r="4"/></g></svg><span>7.1% · 2023</span><span>6.8% · 2024</span><span>6.4% · 2025</span></div></section></div><footer><span>1 chart selected · sources included</span><b>Generate custom report</b></footer><div class="hero-custom-report-generating"><i></i><b>Generating custom report</b><span>Building the chart and linking its source readings…</span></div></aside>
    </div>`;
    const renderHeroBiomarkerFlow = () => `<div class="hero-biomarker-demo">
      <div class="hero-bio-toolbar"><span>Search by name…</span><span>All Sources</span><span>Specialty</span></div>
      <div class="hero-bio-table"><header><b>Name</b><b>Source</b><b>Latest</b><b>Latest Date</b><b>Trend</b><b>Insights</b><b></b></header><article class="hero-bio-focus"><span><b>HbA1c</b></span><span>Blood</span><span><b>6.4%</b><small class="hero-bio-lab-range">Range 4.0–5.6%</small><small class="hero-bio-custom-range">Custom range 4.8–5.6%</small></span><span>14 Mar 2025</span><span><svg viewBox="0 0 60 22"><path d="M2 4 C16 7 23 11 35 13 S50 17 58 19" fill="none" stroke="#376361" stroke-width="2"/></svg></span><span><b>View all 3</b></span><span><i>${heroTrashIcon}</i></span></article><article><span><b>LDL cholesterol</b></span><span>Blood</span><span>116 mg/dL</span><span>14 Mar 2025</span><span>↘</span><span>View all 4</span><span><i>${heroTrashIcon}</i></span></article><article><span><b>Vitamin D</b></span><span>Blood</span><span>71 nmol/L</span><span>6 Jun 2025</span><span>→</span><span>View all 6</span><span><i>${heroTrashIcon}</i></span></article></div>
      <aside class="hero-bio-detail"><header><div><b>HbA1c</b><span>Blood · 3 readings</span></div><strong>6.4% <small>Latest · 14 Mar 2025</small></strong><i>×</i></header><section><div class="hero-bio-chart"><header><b>Trend Chart</b><span>Reference range shown where available</span></header><svg viewBox="0 0 420 130" preserveAspectRatio="none"><rect x="0" y="48" width="420" height="40" fill="#dff1e9"/><path d="M15 24 C90 34 133 48 210 59 S344 74 405 82" fill="none" stroke="#376361" stroke-width="3"/><g fill="#fff" stroke="#376361" stroke-width="2"><circle cx="15" cy="24" r="5"/><circle cx="210" cy="59" r="5"/><circle cx="405" cy="82" r="5"/></g></svg><footer><span>7.1% · 2023</span><span>6.8% · 2024</span><span>6.4% · 2025</span></footer></div><div class="hero-bio-review"><header><b>Readings</b><span>Review values and source ranges</span></header><div><span>14 Mar 2025</span><b>6.4%</b><span>Example Laboratory 01 · p.3</span><em>Above range</em></div><div><span>11 Mar 2024</span><b>6.8%</b><span>Cardiology consult · p.6</span><em>Above range</em></div></div></section></aside>
      <aside class="hero-bio-range-modal"><header><div><b>Set Custom Reference Range</b><span>Set a custom range for HbA1c across this patient's readings.</span></div><i>×</i></header><p>Values in %</p><div><label><span>Custom Ref. Range Min</span><b><i class="hero-bio-range-placeholder">Enter minimum</i><i class="hero-bio-range-min">4.8</i><em>%</em></b></label><label><span>Custom Ref. Range Max</span><b><i class="hero-bio-range-placeholder">Enter maximum</i><i class="hero-bio-range-max">5.6</i><em>%</em></b></label></div><footer><span>Cancel</span><b>Save Range</b></footer></aside>
      <div class="hero-bio-saved">✓ Custom reference range saved</div>
    </div>`;
    const renderHeroDiagnosisFlow = () => `<div class="hero-diagnosis-demo">
      <div class="hero-diag-toolbar"><span>Search diagnoses…</span></div>
      <div class="hero-diag-table"><header><b>Name</b><b>Date</b><b>Date Resolved</b><b>Status</b><b>Explanation</b><b></b></header><article class="hero-diag-focus"><span><b>Hyperlipidaemia</b><small>Source linked</small></span><span>14 Mar 2025</span><span><i class="hero-diag-open-date">—</i><i class="hero-diag-resolved-date">24 Aug 2026</i></span><span><i class="hero-diag-current-status">Current</i><i class="hero-diag-resolved-status">Resolved</i></span><span>Elevated LDL across two lab records…</span><span><i>${heroPencilIcon}</i></span></article><article><span><b>Vitamin D insufficiency</b><small>Source linked</small></span><span>22 Nov 2024</span><span>6 Jun 2025</span><span>Resolved</span><span>Improved following supplementation</span><span><i>${heroPencilIcon}</i></span></article><article><span><b>Insulin resistance</b><small>Needs review</small></span><span>11 Mar 2025</span><span>—</span><span>Review</span><span>Clinical note requires confirmation</span><span><i>${heroPencilIcon}</i></span></article></div>
      <aside class="hero-diag-tooltip"><header><b>Hyperlipidaemia</b><span>Current diagnosis</span></header><p>Elevated LDL across two lab records. Monitor response to treatment and repeat the lipid panel at follow-up.</p><footer>Example Laboratory 01 · 14 Mar 2025 · page 3</footer></aside>
      <aside class="hero-diag-edit"><header><b>Edit Diagnosis</b><i>×</i></header><div class="hero-diag-form"><label class="is-wide"><span>Diagnosis Name</span><b>Hyperlipidaemia</b></label><label><span>Diagnosis Date</span><b>14 Mar 2025</b></label><label class="hero-diag-resolved-field"><span>Date Resolved <em>(optional)</em></span><b><i class="hero-diag-date-placeholder">Select date</i><i class="hero-diag-date-value">24 Aug 2026</i><strong>▣</strong></b></label><label class="is-wide"><span>Status</span><b><i class="hero-diag-modal-current">Current</i><i class="hero-diag-modal-resolved">Resolved</i><strong>⌄</strong></b></label><label class="is-wide"><span>Explanation <em>(optional)</em></span><b class="is-textarea">Elevated LDL across two lab records. Monitor response to treatment and repeat the lipid panel at follow-up.</b></label></div><footer><span>Cancel</span><b>Save Changes</b></footer><div class="hero-diag-calendar"><header><b>August 2026</b><span>‹　›</span></header><div><i>M</i><i>T</i><i>W</i><i>T</i><i>F</i><i>S</i><i>S</i><i>17</i><i>18</i><i>19</i><i>20</i><i>21</i><i>22</i><i>23</i><i class="is-picked">24</i><i>25</i><i>26</i><i>27</i><i>28</i><i>29</i><i>30</i></div></div></aside>
      <div class="hero-diag-saved">✓ Diagnosis updated successfully</div>
    </div>`;
    const renderHeroPageBody = (definition) => {
      if (definition.view === 'dashboard') return `<div class="product-hero-dashboard-stats">${definition.stats.map((stat) => `<article><i></i><div><b>${stat[1]}</b><span>${stat[0]}</span></div></article>`).join('')}</div><div class="product-hero-dashboard-body"><section><header><b>Quick Actions</b></header><div class="product-hero-quick-actions"><article><i>↑</i><div><b>Upload Records</b><span>Add PDFs and supported data files</span></div><strong>→</strong></article><article><i>▤</i><div><b>Generate Report</b><span>Choose a report and set its scope</span></div><strong>→</strong></article></div></section><section><header><b>Recent Reports</b><span>View all →</span></header><div class="product-hero-dashboard-list"><article><b>Health Summary</b><span>26 Aug 2026</span><strong>Complete</strong></article><article><b>Health Over Time</b><span>25 Aug 2026</span><strong>Generating</strong></article></div></section><section><header><b>Biomarker Alerts</b><span>2 need review</span></header><div class="product-hero-dashboard-list"><article><b>LDL cholesterol</b><span>116 mg/dL · target ≤100</span><strong>Review</strong></article><article><b>Vitamin D</b><span>71 nmol/L · range 50–125</span><strong>In range</strong></article></div></section></div>`;
      if (definition.label === 'Medical Records') return renderHeroRecordUpload();
      if (definition.label === 'Biomarkers') return renderHeroBiomarkerFlow();
      if (definition.label === 'Diagnoses') return renderHeroDiagnosisFlow();
      if (definition.view === 'reports') return renderHeroReportFlow();
      if (definition.view === 'genetics') return renderHeroPageBodyBase(definition);
      return renderHeroTable(definition);
    };
    const heroMenuStage = document.createElement('div');
    heroMenuStage.className = 'product-hero-menu-stage';
    heroMenuStage.innerHTML = heroMenuDefinitions.map((definition, index) => {
      const isRecords = definition.label === 'Medical Records';
      const isReports = definition.label === 'Reports';
      const badge = isRecords ? '<i>0 records</i><i>3 records</i>' : isReports ? '<i>4 reports</i><i>5 reports</i><i>6 reports</i>' : definition.badge;
      const badgeClass = isRecords ? ' class="hero-record-count"' : isReports ? ' class="hero-report-count"' : '';
      return `<section class="product-hero-menu-page" data-hero-menu-page="${index}" data-hero-page="${definition.label.toLowerCase().replaceAll(' ','-')}"><header class="product-hero-menu-head"><div><small>JOHN DOE · PATIENT RECORD</small><strong>${definition.label}</strong></div><div><span${badgeClass}>${badge}</span>${definition.action ? `<b>${definition.action}</b>` : ''}</div></header>${renderHeroPageBody(definition)}<span class="hero-demo-cursor" aria-hidden="true"></span></section>`;
    }).join('');
    heroRecords?.append(heroMenuStage);
    const heroMenuPages = [...heroMenuStage.children];
    const originalStory = { kicker: storyKicker?.textContent || '', title: storyTitle?.innerHTML || '', lead: storyLead?.textContent || '', list: storyList?.innerHTML || '' };
    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const phase = (progress, start, end) => {
      const value = clamp((progress - start) / (end - start));
      return value * value * (3 - 2 * value);
    };
    let heroFrame = 0;
    let heroProgress = 0;
    let renderedHeroProgress = null;
    let lastHeroFrameTime = 0;
    let heroLayout = null;
    let heroMenuIndex = -1;
    let uploadRunning = false;
    let uploadTimers = [];

    const clearUploadTimers = () => {
      uploadTimers.forEach(clearTimeout);
      uploadTimers = [];
    };
    const resetUploadVisual = () => {
      uploadButton?.classList.remove('is-pressed');
      upload?.classList.remove('is-processing','is-ready');
      processingSteps.forEach((step) => step.classList.remove('is-done'));
    };
    const stopUploadAnimation = () => {
      clearUploadTimers();
      uploadRunning = false;
      resetUploadVisual();
    };
    const setHeroMenu = (index) => {
      if (heroMenuIndex === index) return;
      heroMenuIndex = index;
      const definition = heroMenuDefinitions[index];
      heroMenuStage.classList.add('is-visible');
      heroMenuPages.forEach((page, pageIndex) => {
        const active = pageIndex === index;
        page.classList.toggle('is-active', active);
        if (active) {
          page.classList.remove('is-animating');
          requestAnimationFrame(() => {
            if (heroMenuIndex === index) page.classList.add('is-animating');
          });
        }
      });
      heroSidebarItems.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === index));
      if (scrollHero.classList.contains('clinician-product-hero')) {
        if (storyKicker) storyKicker.textContent = definition.label;
        if (storyTitle) storyTitle.textContent = clinicianPageSummaries[definition.label] || definition.title;
        if (storyLead) storyLead.textContent = '';
        if (storyList) storyList.innerHTML = '';
      }
    };
    const resetHeroMenu = () => {
      heroMenuIndex = -1;
      heroMenuStage.classList.remove('is-visible');
      heroMenuPages.forEach((page) => page.classList.remove('is-active','is-animating'));
      heroSidebarItems.forEach((item) => item.classList.toggle('is-active', item.textContent.trim() === 'Medical Records'));
      if (storyKicker) storyKicker.textContent = originalStory.kicker;
      if (storyTitle) storyTitle.innerHTML = originalStory.title;
      if (storyLead) storyLead.textContent = originalStory.lead;
      if (storyList) storyList.innerHTML = originalStory.list;
    };
    const runUploadAnimation = () => {
      if (reducedMotion || uploadRunning || heroProgress < .27) return;
      clearUploadTimers();
      resetUploadVisual();
      uploadRunning = true;
      const queue = (callback, delay) => uploadTimers.push(setTimeout(callback, delay));
      queue(() => {
        uploadButton?.classList.add('is-pressed');
      }, 260);
      queue(() => {
        uploadButton?.classList.remove('is-pressed');
        upload?.classList.add('is-processing');
      }, 760);
      processingSteps.forEach((step, index) => queue(() => step.classList.add('is-done'), 1350 + index * 560));
      queue(() => upload?.classList.add('is-ready'), 3750);
      queue(() => {
        resetUploadVisual();
        if (heroProgress < .27 || heroProgress >= .34) {
          uploadRunning = false;
          return;
        }
        uploadTimers = [setTimeout(() => {
          uploadRunning = false;
          runUploadAnimation();
        }, 700)];
      }, 6100);
    };

    const renderScrollHero = (timestamp = performance.now()) => {
      heroFrame = 0;
      if (!sticky) return;
      if (reducedMotion) {
        setHeroMenu(0);
        return;
      }
      if (!heroLayout) {
        const scrollDistance = Math.max(1, scrollHero.offsetHeight - innerHeight);
        const mobile = innerWidth <= 720;
        const baseWindowWidth = heroWindow?.offsetWidth || 1180;
        const storyRight = heroStory?.getBoundingClientRect().right || 0;
        const isClinicianHero = scrollHero.classList.contains('clinician-product-hero');
        const heroInnerRight = sticky.querySelector('.product-hero-inner')?.getBoundingClientRect().right || innerWidth;
        const splitRight = isClinicianHero ? heroInnerRight : innerWidth;
        const availableSplitWidth = Math.max(1, splitRight - storyRight - 75);
        const targetScale = mobile ? 1.07 : clamp(availableSplitWidth / baseWindowWidth, .66, .93);
        const initialScale = mobile ? 1 : Math.max(.78, targetScale - .06);
        const splitGap = clamp(innerWidth * .045, 56, 92);
        const edgeGutter = isClinicianHero ? 0 : clamp(innerWidth * .04, 48, 96);
        const splitCenter = (storyRight + splitGap + splitRight - edgeGutter) / 2;
        const targetShift = mobile ? 0 : splitCenter - innerWidth / 2;
        const baseWindowCenter = (heroWindow?.offsetTop || 0) + (heroWindow?.offsetHeight || 0) / 2;
        const fixedWindowY = mobile ? 0 : Math.min(0, innerHeight * .5 - baseWindowCenter);
        heroLayout = { scrollDistance, scrollTop: scrollHero.offsetTop, mobile, targetScale, initialScale, targetShift, fixedWindowY };
      }
      const { scrollDistance, scrollTop, mobile, targetScale, initialScale, targetShift, fixedWindowY } = heroLayout;
      const targetProgress = clamp((scrollY - scrollTop) / scrollDistance);
      if (renderedHeroProgress === null) renderedHeroProgress = targetProgress;
      const elapsed = lastHeroFrameTime ? Math.min(32, timestamp - lastHeroFrameTime) : 16.67;
      const follow = 1 - Math.pow(.002, elapsed / 1000);
      renderedHeroProgress += (targetProgress - renderedHeroProgress) * follow;
      if (Math.abs(targetProgress - renderedHeroProgress) < .0001) renderedHeroProgress = targetProgress;
      lastHeroFrameTime = timestamp;
      const progress = renderedHeroProgress;
      const copyOut = phase(progress, .015, .07);
      const zoom = phase(progress, .05, .18);
      const move = phase(progress, .18, .28);
      const storyIn = phase(progress, .24, .32);
      const modalShift = 0;
      heroProgress = targetProgress;

      sticky.style.setProperty('--hero-copy-opacity', String(1 - copyOut));
      sticky.style.setProperty('--hero-copy-y', `${-24 * copyOut}px`);
      sticky.style.setProperty('--hero-window-scale', String(initialScale + (targetScale - initialScale) * zoom));
      sticky.style.setProperty('--hero-window-x', `${targetShift * move}px`);
      sticky.style.setProperty('--hero-window-y', `${fixedWindowY * move}px`);
      sticky.style.setProperty('--hero-modal-x', `${modalShift * move}px`);
      sticky.style.setProperty('--hero-story-opacity', String(storyIn));
      sticky.style.setProperty('--hero-story-y', `${24 * (1 - storyIn)}px`);
      const menuStart = .24;
      const menuEnd = .96;
      if (!mobile && targetProgress >= menuStart) {
        const menuProgress = clamp((targetProgress - menuStart) / (menuEnd - menuStart));
        const menuIndex = Math.min(heroMenuDefinitions.length - 1, Math.floor(menuProgress * heroMenuDefinitions.length));
        setHeroMenu(menuIndex);
      } else if (!mobile) {
        setHeroMenu(0);
      } else if (targetProgress < .27) {
        setHeroMenu(0);
      } else {
        resetHeroMenu();
      }
      if (mobile && targetProgress >= .27 && targetProgress < menuStart) runUploadAnimation();
      else if (uploadRunning || uploadTimers.length) stopUploadAnimation();
      if (renderedHeroProgress !== targetProgress) heroFrame = requestAnimationFrame(renderScrollHero);
    };
    const scheduleScrollHero = () => {
      if (heroFrame || reducedMotion) return;
      heroFrame = requestAnimationFrame(renderScrollHero);
    };
    addEventListener('scroll', scheduleScrollHero, { passive: true });
    addEventListener('resize', () => {
      heroLayout = null;
      renderedHeroProgress = null;
      lastHeroFrameTime = 0;
      scheduleScrollHero();
    });
    renderScrollHero();
  }

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealItems = [...document.querySelectorAll('.product-tour-feature')].flatMap((feature) => [
      feature.querySelector('.product-tour-copy'),
      feature.querySelector('.product-tour-mount')
    ]).filter(Boolean);
    revealItems.forEach((item, itemIndex) => {
      item.classList.add('pth-scroll-reveal');
      item.style.setProperty('--pth-reveal-delay', `${(itemIndex % 2) * 55}ms`);
    });
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in-view');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '-12% 0px -18% 0px', threshold: .04 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  document.querySelectorAll('[data-product-tour]').forEach((mount) => {
    const definition = tours[mount.dataset.productTour];
    if (!definition) return;
    mount.innerHTML = `
      <div class="pth-player" tabindex="0" role="region" aria-label="${definition.label} walkthrough">
        <div class="pth-appbar"><span class="pth-brand"><b>n1.</b>care</span><div class="pth-patient"><i class="pth-avatar">JD</i><span><strong>John Doe</strong><small>Patient record</small></span></div><span class="pth-appstatus">Encrypted record</span></div>
        <div class="pth-workspace"><aside class="pth-sidebar" aria-hidden="true">${sideItems(definition.nav)}</aside><div class="pth-stage">${definition.steps.map((step, index) => `<section class="pth-view${index === 0 ? ' is-active' : ''}" data-pth-view="${index}" aria-hidden="${index === 0 ? 'false' : 'true'}">${step.html}</section>`).join('')}</div></div>
        <div class="pth-caption" aria-live="polite"></div>
        <div class="pth-controls"><button class="pth-play" type="button" ${reducedMotion ? 'disabled' : ''} aria-label="${reducedMotion ? 'Automatic playback disabled because reduced motion is enabled' : 'Pause walkthrough'}">${reducedMotion ? '—' : 'Ⅱ'}</button><div class="pth-steps"><div class="pth-stepbuttons">${definition.steps.map((step,index) => `<button class="pth-step${index === 0 ? ' is-active' : ''}" type="button" data-pth-step="${index}">${step.label}</button>`).join('')}</div><div class="pth-progress"><i></i></div></div><span class="pth-count"></span></div>
      </div>`;

    const root = mount.querySelector('.pth-player');
    const views = [...root.querySelectorAll('[data-pth-view]')];
    const stepButtons = [...root.querySelectorAll('[data-pth-step]')];
    const play = root.querySelector('.pth-play');
    const caption = root.querySelector('.pth-caption');
    const count = root.querySelector('.pth-count');
    const progress = root.querySelector('.pth-progress i');
    let index = 0;
    let timer = 0;
    let entryTimer = 0;
    let inView = false;
    let paused = reducedMotion;

    const render = (next, userInitiated = false) => {
      index = (next + definition.steps.length) % definition.steps.length;
      views.forEach((view, viewIndex) => {
        const active = viewIndex === index;
        view.classList.toggle('is-active', active);
        view.setAttribute('aria-hidden', String(!active));
      });
      stepButtons.forEach((control, controlIndex) => {
        const active = controlIndex === index;
        control.classList.toggle('is-active', active);
        control.setAttribute('aria-current', active ? 'step' : 'false');
      });
      caption.textContent = definition.steps[index].caption;
      count.textContent = `${String(index + 1).padStart(2,'0')} / ${String(definition.steps.length).padStart(2,'0')}`;
      progress.style.width = `${((index + 1) / definition.steps.length) * 100}%`;
      if (userInitiated) restart();
    };
    const stop = () => { if (timer) clearInterval(timer); timer = 0; };
    const stopEntryTimer = () => { if (entryTimer) clearTimeout(entryTimer); entryTimer = 0; };
    const start = () => {
      stop();
      if (paused || reducedMotion || !inView || document.hidden) return;
      timer = setInterval(() => render(index + 1), 4400);
    };
    const restart = () => { stop(); start(); };
    const setPaused = (next) => {
      paused = next;
      play.textContent = paused ? '▶' : 'Ⅱ';
      play.setAttribute('aria-label', paused ? 'Play walkthrough' : 'Pause walkthrough');
      start();
    };
    play.addEventListener('click', () => setPaused(!paused));
    stepButtons.forEach((control) => control.addEventListener('click', () => render(Number(control.dataset.pthStep), true)));
    root.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); render(index + 1, true); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); render(index - 1, true); }
      if (event.key === ' ') { event.preventDefault(); setPaused(!paused); }
    });
    render(0);
    instances.push({
      root,
      start,
      stop() { stopEntryTimer(); stop(); },
      setInView(value) {
        if (value === inView) return;
        inView = value;
        stopEntryTimer();
        stop();
        if (!inView || paused || reducedMotion || document.hidden) return;
        entryTimer = setTimeout(() => {
          entryTimer = 0;
          render(index + 1);
          start();
        }, 1450);
      }
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const instance = instances.find((candidate) => candidate.root === entry.target);
        if (instance) instance.setInView(entry.isIntersecting && entry.intersectionRatio >= .18);
      });
    }, { threshold: [0,.18,.5], rootMargin: '-8% 0px -12% 0px' });
    instances.forEach((instance) => observer.observe(instance.root));
  } else {
    instances.forEach((instance) => instance.setInView(true));
  }

  const workflow = document.querySelector('[data-workflow-micro]');
  if (workflow) {
    const workflowSteps = [...workflow.querySelectorAll('[data-workflow-step]')];
    const workflowViewSelector = '.micro-patient-view,.micro-upload-view,.micro-data-view,.micro-report-view,.micro-share-view';
    const setWorkflowPhase = (step, phase) => {
      step.dataset.phase = String(phase);
      [...step.querySelectorAll(workflowViewSelector)].forEach((view, index) => {
        const active = index === phase;
        view.hidden = !active;
        view.style.display = active ? 'block' : 'none';
      });
    };
    workflowSteps.forEach((step) => setWorkflowPhase(step, 0));
    const workflowTimers = new Map();
    const visibleWorkflowSteps = new Set();
    const workflowPhaseDuration = 2800;
    const stopWorkflowStep = (step) => {
      const timer = workflowTimers.get(step);
      if (timer) clearInterval(timer);
      workflowTimers.delete(step);
    };
    const playWorkflowStep = (step) => {
      step.classList.add('is-seen');
      if (reducedMotion) {
        step.classList.add('is-active');
        setWorkflowPhase(step, 3);
        return;
      }
      if (step.classList.contains('is-active') && workflowTimers.has(step)) return;
      stopWorkflowStep(step);
      step.classList.remove('is-active');
      setWorkflowPhase(step, 0);
      void step.offsetWidth;
      step.classList.add('is-active');
      let phase = 0;
      workflowTimers.set(step, setInterval(() => {
        if (phase === 3) {
          phase = 0;
          step.classList.add('is-resetting');
          setWorkflowPhase(step, 0);
          requestAnimationFrame(() => requestAnimationFrame(() => step.classList.remove('is-resetting')));
          return;
        }
        phase += 1;
        setWorkflowPhase(step, phase);
      }, workflowPhaseDuration));
    };
    if (reducedMotion) {
      workflowSteps.forEach(playWorkflowStep);
    } else if ('IntersectionObserver' in window) {
      const workflowObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= .3) {
            visibleWorkflowSteps.add(entry.target);
            if (!document.hidden) playWorkflowStep(entry.target);
          }
          else {
            visibleWorkflowSteps.delete(entry.target);
            entry.target.classList.remove('is-active');
            stopWorkflowStep(entry.target);
          }
        });
      }, { threshold: [0,.3,.6], rootMargin: '-5% 0px -10% 0px' });
      workflowSteps.forEach((step) => workflowObserver.observe(step));
    } else {
      workflowSteps.forEach(playWorkflowStep);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) workflowSteps.forEach(stopWorkflowStep);
      else visibleWorkflowSteps.forEach(playWorkflowStep);
    });
  }

  const patientShowcase = document.querySelector('[data-patient-showcase]');
  if (patientShowcase) {
    const views = [...patientShowcase.querySelectorAll('[data-patient-showcase-view]')];
    const progress = [...patientShowcase.querySelectorAll('[data-patient-showcase-step]')];
    const toggle = patientShowcase.querySelector('.patient-showcase-toggle');
    const demoCursor = patientShowcase.querySelector('.patient-showcase-cursor');
    const dwellTimes = [5200,6500,5800,5200];
    let phase = 0;
    let timer = 0;
    let clickTimer = 0;
    let paused = false;
    let inView = false;
    views.forEach((view) => { view.hidden = false; });
    const renderShowcase = (next) => {
      phase = (next + views.length) % views.length;
      patientShowcase.dataset.phase = String(phase);
      views.forEach((view, index) => {
        const active = index === phase;
        view.classList.toggle('is-active', active);
        view.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      progress.forEach((item, index) => {
        item.classList.toggle('is-active', index === phase);
        item.classList.toggle('is-complete', index < phase);
        item.setAttribute('aria-current', index === phase ? 'step' : 'false');
      });
    };
    const stopShowcase = () => {
      if (timer) window.clearTimeout(timer);
      if (clickTimer) window.clearTimeout(clickTimer);
      timer = 0;
      clickTimer = 0;
      patientShowcase.querySelectorAll('.is-demo-click').forEach((item) => item.classList.remove('is-demo-click'));
      demoCursor?.classList.remove('is-clicking');
    };
    const startShowcase = () => {
      stopShowcase();
      if (!inView || paused || reducedMotion || document.hidden) return;
      timer = window.setTimeout(() => {
        timer = 0;
        const action = views[phase]?.querySelector('[data-patient-showcase-next]');
        if (action) action.classList.add('is-demo-click');
        demoCursor?.classList.add('is-clicking');
        clickTimer = window.setTimeout(() => {
          clickTimer = 0;
          if (action) action.classList.remove('is-demo-click');
          demoCursor?.classList.remove('is-clicking');
          renderShowcase(phase + 1);
          startShowcase();
        }, 460);
      }, dwellTimes[phase] || 5600);
    };
    const setShowcasePaused = (next) => {
      paused = next;
      toggle.textContent = paused ? '▶' : 'Ⅱ';
      toggle.setAttribute('aria-label', paused ? 'Play patient management walkthrough' : 'Pause patient management walkthrough');
      startShowcase();
    };
    toggle.addEventListener('click', () => setShowcasePaused(!paused));
    views.forEach((view) => {
      view.querySelector('[data-patient-showcase-next]')?.addEventListener('click', () => {
        renderShowcase(phase + 1);
        startShowcase();
      });
    });
    progress.forEach((control) => control.addEventListener('click', () => {
      renderShowcase(Number(control.dataset.patientShowcaseStep));
      startShowcase();
    }));
    renderShowcase(reducedMotion ? views.length - 1 : 0);
    if ('IntersectionObserver' in window) {
      const showcaseObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          inView = entry.isIntersecting && entry.intersectionRatio >= .22;
          if (inView) startShowcase();
          else stopShowcase();
        });
      }, { threshold: [0,.22,.5], rootMargin: '-7% 0px -10% 0px' });
      showcaseObserver.observe(patientShowcase);
    } else {
      inView = true;
      startShowcase();
    }
    document.addEventListener('visibilitychange', () => document.hidden ? stopShowcase() : startShowcase());
  }

  const whiteLabelDemo = document.querySelector('[data-whitelabel-demo]');
  if (whiteLabelDemo) {
    const controls = [...whiteLabelDemo.querySelectorAll('[data-whitelabel-step]')];
    const toggle = whiteLabelDemo.querySelector('.whitelabel-demo-toggle');
    const cursor = whiteLabelDemo.querySelector('.whitelabel-demo-cursor');
    const shareLayer = whiteLabelDemo.querySelector('.whitelabel-share-layer');
    const dwellTimes = [3600,4300,5200,3600];
    let phase = reducedMotion ? 1 : 0;
    let timer = 0;
    let clickTimer = 0;
    let paused = false;
    let inView = false;

    const renderWhiteLabel = (next) => {
      phase = (next + controls.length) % controls.length;
      whiteLabelDemo.dataset.phase = String(phase);
      controls.forEach((control, index) => {
        control.classList.toggle('is-active', index === phase);
        control.classList.toggle('is-complete', index < phase);
        control.setAttribute('aria-current', index === phase ? 'step' : 'false');
      });
      shareLayer?.setAttribute('aria-hidden', phase >= 2 ? 'false' : 'true');
    };
    const stopWhiteLabel = () => {
      if (timer) window.clearTimeout(timer);
      if (clickTimer) window.clearTimeout(clickTimer);
      timer = 0;
      clickTimer = 0;
      cursor?.classList.remove('is-clicking');
      whiteLabelDemo.querySelectorAll('.is-demo-click').forEach((item) => item.classList.remove('is-demo-click'));
    };
    const startWhiteLabel = () => {
      stopWhiteLabel();
      if (!inView || paused || reducedMotion || document.hidden) return;
      timer = window.setTimeout(() => {
        timer = 0;
        const action = phase === 1
          ? whiteLabelDemo.querySelector('.whitelabel-report-footer [data-whitelabel-next]')
          : phase === 2
            ? whiteLabelDemo.querySelector('.whitelabel-share-dialog [data-whitelabel-next]')
            : null;
        action?.classList.add('is-demo-click');
        cursor?.classList.add('is-clicking');
        clickTimer = window.setTimeout(() => {
          clickTimer = 0;
          action?.classList.remove('is-demo-click');
          cursor?.classList.remove('is-clicking');
          renderWhiteLabel(phase + 1);
          startWhiteLabel();
        }, 430);
      }, dwellTimes[phase]);
    };
    const setWhiteLabelPaused = (next) => {
      paused = next;
      toggle.textContent = paused ? '▶' : 'Ⅱ';
      toggle.setAttribute('aria-label', paused ? 'Play white-label walkthrough' : 'Pause white-label walkthrough');
      startWhiteLabel();
    };

    toggle?.addEventListener('click', () => setWhiteLabelPaused(!paused));
    controls.forEach((control) => control.addEventListener('click', () => {
      renderWhiteLabel(Number(control.dataset.whitelabelStep));
      startWhiteLabel();
    }));
    whiteLabelDemo.querySelectorAll('[data-whitelabel-next]').forEach((action) => action.addEventListener('click', () => {
      renderWhiteLabel(phase + 1);
      startWhiteLabel();
    }));
    renderWhiteLabel(phase);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting && entry.intersectionRatio >= .25;
        if (inView) startWhiteLabel();
        else stopWhiteLabel();
      }, { threshold: [0,.25,.5], rootMargin: '-6% 0px -8% 0px' });
      observer.observe(whiteLabelDemo);
    } else {
      inView = true;
      startWhiteLabel();
    }
    document.addEventListener('visibilitychange', () => document.hidden ? stopWhiteLabel() : startWhiteLabel());
  }

  const revealFooter = document.querySelector('.product-footer-reveal')?.closest('.marketing-footer');
  if (revealFooter && 'IntersectionObserver' in window) {
    const footerObserver = new IntersectionObserver(([entry]) => {
      document.body.classList.toggle('is-footer-revealing', entry.isIntersecting);
    });
    footerObserver.observe(revealFooter);
  }
  document.addEventListener('visibilitychange', () => instances.forEach((instance) => document.hidden ? instance.stop() : instance.start()));
})();
