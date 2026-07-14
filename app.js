// ─── State ────────────────────────────────────────────────────────────────────
let STATE = {
  token:          null,
  role:           null,   // 'company' | 'bcg' | 'baincap' | 'admin'
  identity:       null,   // { id, name, cpo, sector, role }
  scores:         {},
  rawScores:      {},
  useCases:       {},
  notes:          {},
  general:        {},
  cmi:            null,
  portfolio:      null,
  currentSection: 's-cover'
};

// ─── Computed helpers ─────────────────────────────────────────────────────────
const canEdit   = () => STATE.role === 'company' || STATE.role === 'bcg' || STATE.role === 'admin';
const canViewAll= () => STATE.role === 'bcg' || STATE.role === 'baincap' || STATE.role === 'admin';
const isCompany = () => STATE.role === 'company';

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('pam_session');
  if (saved) {
    try {
      const s = JSON.parse(saved);
      STATE.token    = s.token;
      STATE.role     = s.role;
      STATE.identity = s.identity;
      applyRestoredState(s.data || {});
      showApp();
      return;
    } catch {}
  }
  showLogin();
});

function applyRestoredState(data) {
  STATE.scores    = data.scores    || {};
  STATE.rawScores = data.rawScores || {};
  STATE.useCases  = data.useCases  || {};
  STATE.notes     = data.notes     || {};
  STATE.general   = data.general   || {};
  STATE.cmi       = data.cmi       || null;
}

// ─── Login ────────────────────────────────────────────────────────────────────
function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app-screen').style.display   = 'none';
}

async function doLogin() {
  const code  = document.getElementById('login-code').value.trim().toUpperCase();
  const errEl = document.getElementById('login-error');
  errEl.textContent = '';
  if (!code) { errEl.textContent = 'Please enter your access code.'; return; }

  try {
    const r = await api('POST', '/api/login', { code });
    STATE.token    = r.token;
    STATE.role     = r.role;
    STATE.identity = r.identity;

    // Load existing data if company
    if (r.role === 'company') {
      try {
        const existing = await api('GET', '/api/my-response');
        applyRestoredState(existing);
      } catch {}
    }

    // Fetch portfolio data (available to all roles)
    try { STATE.portfolio = await api('GET', '/api/portfolio'); } catch {}

    saveSession();
    showApp();
  } catch (e) {
    errEl.textContent = 'Invalid access code. Contact your BCG project team.';
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('login-screen').style.display !== 'none') doLogin();
});

function logout() {
  localStorage.removeItem('pam_session');
  location.reload();
}

// ─── Show app ─────────────────────────────────────────────────────────────────
function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app-screen').style.display   = 'flex';

  const role = STATE.role;
  if (role === 'admin') { showAdminDashboard(); return; }
  if (role === 'baincap') { showBainCapDashboard(); return; }

  // BCG or company → full assessment UI
  applyRoleUI();
  populateCompanyDetails();
  renderAllSteps();
  updateSidebar();
  showSection(STATE.currentSection || (role === 'bcg' ? 's-cmi' : 's-cover'));
}

function applyRoleUI() {
  // BCG: show company picker in header; hide submit button for read-only
  const role = STATE.role;
  const headerName = document.getElementById('header-co-name');
  if (headerName) {
    if (role === 'bcg') {
      headerName.textContent = 'BCG × Inverto';
      headerName.style.background = 'rgba(0,168,89,.25)';
    } else {
      headerName.textContent = STATE.identity?.name || '—';
    }
  }
  // Hide save/submit if read-only (baincap handled separately)
  if (!canEdit()) {
    document.querySelectorAll('.btn-green,.btn-submit').forEach(b => b.style.display = 'none');
  }
  // BCG role badge
  if (role === 'bcg') {
    const badge = document.createElement('div');
    badge.style.cssText = 'background:#00A859;color:white;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;';
    badge.textContent = 'BCG EDIT ACCESS';
    document.querySelector('.header-right')?.prepend(badge);
  }
}

// ─── API ──────────────────────────────────────────────────────────────────────
async function api(method, url, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Token': STATE.token || '' }
  };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || r.statusText); }
  return r.json();
}

// ─── Session ──────────────────────────────────────────────────────────────────
function saveSession() {
  localStorage.setItem('pam_session', JSON.stringify({
    token: STATE.token, role: STATE.role, identity: STATE.identity,
    data: {
      scores: STATE.scores, rawScores: STATE.rawScores,
      useCases: STATE.useCases, notes: STATE.notes,
      general: STATE.general, cmi: STATE.cmi
    }
  }));
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add('active');
  const nav = document.getElementById('nav-' + id);
  if (nav) nav.classList.add('active');
  STATE.currentSection = id;
  window.scrollTo(0, 0);
  updateProgress();
  if (id === 's-cmi') renderCMI();
  if (id === 's-inv') renderInventory();
  saveSession();
}

// ─── Company details ──────────────────────────────────────────────────────────
function populateCompanyDetails() {
  if (!STATE.identity) return;
  const f = id => document.getElementById(id);
  if (f('co-name'))   { f('co-name').value = STATE.identity.name || ''; }
  if (f('co-cpo'))    { f('co-cpo').value  = STATE.identity.cpo  || ''; }
  if (f('co-sector')) { f('co-sector').value = STATE.identity.sector || ''; }
  if (f('co-date'))   { f('co-date').value  = new Date().toISOString().split('T')[0]; }
  // Restore saved company meta
  if (STATE.general['co-spend']   && f('co-spend'))   f('co-spend').value   = STATE.general['co-spend'];
  if (STATE.general['co-ftes']    && f('co-ftes'))    f('co-ftes').value    = STATE.general['co-ftes'];
  if (STATE.general['co-ftes-fo'] && f('co-ftes-fo')) f('co-ftes-fo').value = STATE.general['co-ftes-fo'];
  if (STATE.general['co-erp']     && f('co-erp'))     f('co-erp').value     = STATE.general['co-erp'];
  // Restore general open answers
  Object.keys(STATE.general).forEach(k => {
    const el = document.getElementById(k);
    if (el && k.startsWith('q-00-')) el.value = STATE.general[k];
  });
  updateSidebar();
  if (!canEdit()) lockAllInputs();
}

function lockAllInputs() {
  document.querySelectorAll('input,textarea,select').forEach(el => {
    el.disabled = true;
    el.style.background = '#f8fafc';
  });
}

function updateSidebar() {
  const id = STATE.identity;
  document.getElementById('sidebarName').textContent   = id?.name   || '—';
  document.getElementById('sidebarSector').textContent = id?.sector || '—';
  if (document.getElementById('header-co-name') && isCompany()) {
    document.getElementById('header-co-name').textContent = id?.name || '—';
  }
  const cmi  = STATE.cmi;
  const peer = STATE.portfolio?.portfolioStats;
  if (cmi) {
    document.getElementById('sidebarCMI').textContent  = cmi.toFixed(2);
    const band = getBand(cmi);
    document.getElementById('sidebarBand').textContent = band?.label || '';
    if (band) document.getElementById('sidebarCMI').style.color = band.color;
  }
  if (peer?.avgCMI) {
    const box = document.getElementById('sb-peer-box');
    if (box) {
      box.style.display = 'block';
      document.getElementById('sb-peer-cmi').textContent = peer.avgCMI;
      if (cmi) {
        const diff = (cmi - parseFloat(peer.avgCMI)).toFixed(2);
        const diffEl = document.getElementById('sb-peer-diff');
        if (diffEl) {
          diffEl.textContent = (diff > 0 ? '+' : '') + diff + ' vs avg';
          diffEl.style.color = diff > 0 ? '#00A859' : '#ef4444';
        }
      }
    }
  }
}

// ─── Render all step sections ─────────────────────────────────────────────────
function renderAllSteps() {
  STEP_IDS.forEach(stepId => {
    const def = QUESTIONS[stepId];
    if (!def) return;
    const sec = document.getElementById(stepId);
    if (!sec) return;

    let html = `<div class="sec-header">
      <div class="sec-tag">${def.tag}</div>
      <div class="sec-title">${def.title}</div>
      <div class="sec-desc">${def.desc}</div>
    </div>`;

    if (def.D1?.length) {
      html += `<div class="card"><div class="card-hdr"><span class="dim-badge d1">D1 · Organisational Maturity</span><div class="card-title">Process &amp; People</div></div>`;
      def.D1.forEach((q, i) => { html += renderQuestion(q, i + 1); });
      html += `</div>`;
    }
    if (def.D2?.length) {
      html += `<div class="card"><div class="card-hdr"><span class="dim-badge d2">D2 · Technology</span><div class="card-title">Digital &amp; Systems</div></div>`;
      def.D2.forEach((q, i) => { html += renderQuestion(q, i + 1); });
      html += `</div>`;
    }

    if (stepId !== 's-ai') {
      // D3 — existing AI use cases + summary score
      html += renderUseCaseBlock(stepId, 'existing', 'D3 · AI in Place', 'Document existing AI use cases at this process step');
      html += `<div class="card"><div class="card-hdr"><span class="dim-badge d3">D3 Score</span><div class="card-title">Overall AI adoption at this step (1–5)</div></div>
        <div class="q-block">${renderScaleRow(stepId + '-D3', stepId, 'D3', [
          'No AI in use at this step.',
          'Isolated AI experiments; nothing in production.',
          'One or more AI pilots underway with measurable early outcomes.',
          'Multiple AI use cases in production with tracked value.',
          'AI deeply embedded; multiple production use cases with continuous improvement.'
        ])}</div></div>`;

      // D4 — potential AI use cases + summary score
      html += renderUseCaseBlock(stepId, 'potential', 'D4 · AI Opportunity', 'Potential AI use cases to develop at this step');
      html += `<div class="card"><div class="card-hdr"><span class="dim-badge d4">D4 Score</span><div class="card-title">Strategic AI opportunity at this step (1–5)</div></div>
        <div class="q-block">${renderScaleRow(stepId + '-D4', stepId, 'D4', [
          'No identified opportunity; low priority.',
          'Low priority relative to other steps.',
          'Moderate opportunity; some use cases identified.',
          'High opportunity; multiple high-value use cases with clear business case.',
          'Critical opportunity; AI here could be transformational.'
        ])}</div></div>`;
    }

    if (stepId === 's-ai') {
      if (def.D3?.length) {
        html += `<div class="card"><div class="card-hdr"><span class="dim-badge d3">D3 · AI in Place</span><div class="card-title">Current AI Deployment — Cross-cutting</div></div>`;
        def.D3.forEach((q, i) => { html += renderQuestion(q, i + 1); });
        html += `</div>`;
      }
      if (def.D4?.length) {
        html += `<div class="card"><div class="card-hdr"><span class="dim-badge d4">D4 · AI Opportunity &amp; Governance</span><div class="card-title">AI Advancement &amp; Portfolio Management</div></div>`;
        def.D4.forEach((q, i) => { html += renderQuestion(q, i + 1); });
        html += `</div>`;
      }
    }

    // Pain points
    if (stepId !== 's-ai') {
      html += `<div class="card"><div class="card-hdr"><div class="card-title">Step context</div></div>
        <div class="field-group">
          <label class="field-label">Main pain points / unmet needs at this process step</label>
          <textarea class="text-field" id="pain-${stepId}" onchange="savePain('${stepId}',this.value)" placeholder="What are the biggest challenges the CPO faces at this step?"></textarea>
        </div></div>`;
    }

    // Navigation
    const allSections = ['s-cover','s-00','s-01','s-02','s-03','s-04','s-05','s-06','s-07','s-08','s-09','s-ai','s-cmi','s-inv'];
    const idx  = allSections.indexOf(stepId);
    const prev = allSections[idx - 1] || 's-cover';
    const next = allSections[idx + 1] || 's-cmi';
    html += `<div class="nav-btns">
      <button class="btn-back" onclick="showSection('${prev}')">← Back</button>
      <button class="btn-next" onclick="showSection('${next}')">Next →</button>
    </div>`;

    sec.innerHTML = html;
    restoreStepValues(stepId);
    if (!canEdit()) lockAllInputs();
  });
}

// ─── Question renderer ────────────────────────────────────────────────────────
function renderQuestion(q, num) {
  const names  = ['Initial','Developing','Defined','Advanced','Pioneer'];
  const colors = ['so1','so2','so3','so4','so5'];
  let html = `<div class="q-block">
    <div class="q-text"><span class="q-num">${num}.</span> ${q.text}</div>
    <div class="scale">`;
  for (let i = 1; i <= 5; i++) {
    const desc  = q.scores[i - 1] || '';
    const short = desc.length > 65 ? desc.substring(0, 63) + '…' : desc;
    html += `<div class="scale-opt ${colors[i-1]}">
      <input type="radio" name="${q.id}" id="${q.id}-${i}" value="${i}" onchange="onScoreChange('${q.id}',${i})">
      <label class="scale-lbl" for="${q.id}-${i}" title="${desc.replace(/"/g,'&quot;')}">
        <span class="sc">${i}</span>
        <span class="sn">${names[i-1]}</span>
        <span class="sd">${short}</span>
      </label>
    </div>`;
  }
  html += `</div>
    <span class="note-toggle" onclick="toggleNote('${q.id}')">+ Add note</span>
    <div class="note-area" id="note-${q.id}">
      <textarea class="text-field" style="min-height:56px;margin-top:6px" placeholder="Evidence or context for this score…" onchange="saveNote('${q.id}',this.value)" id="note-t-${q.id}"></textarea>
    </div>
  </div>`;
  return html;
}

function renderScaleRow(qid, stepId, dim, scores) {
  const names  = ['Initial','Developing','Defined','Advanced','Pioneer'];
  const colors = ['so1','so2','so3','so4','so5'];
  let html = `<div class="scale">`;
  for (let i = 1; i <= 5; i++) {
    const desc  = scores[i - 1] || '';
    const short = desc.length > 65 ? desc.substring(0, 63) + '…' : desc;
    html += `<div class="scale-opt ${colors[i-1]}">
      <input type="radio" name="${qid}" id="${qid}-${i}" value="${i}" onchange="onDimScore('${stepId}','${dim}',${i})">
      <label class="scale-lbl" for="${qid}-${i}" title="${desc.replace(/"/g,'&quot;')}">
        <span class="sc">${i}</span><span class="sn">${names[i-1]}</span><span class="sd">${short}</span>
      </label>
    </div>`;
  }
  return html + `</div>`;
}

function renderUseCaseBlock(stepId, type, dimLabel, title) {
  const colorClass = type === 'existing' ? 'd3' : 'd4';
  return `<div class="card">
    <div class="card-hdr"><span class="dim-badge ${colorClass}">${dimLabel}</span><div class="card-title">${title}</div></div>
    <div class="uc-grid">
      ${[1,2].map(n => `<div class="uc-card">
        <div class="uc-title">Use Case ${n}</div>
        <div class="field-group">
          <label class="field-label">Name</label>
          <input class="input-f" id="uc-${stepId}-${type}-${n}-name" placeholder="e.g. AI spend classification" onchange="saveUC('${stepId}','${type}',${n},'name',this.value)">
        </div>
        <div class="field-group">
          <label class="field-label">Description / Expected benefit</label>
          <textarea class="text-field" style="min-height:64px" id="uc-${stepId}-${type}-${n}-desc" placeholder="Brief description…" onchange="saveUC('${stepId}','${type}',${n},'description',this.value)"></textarea>
        </div>
        ${type === 'potential' ? `<div class="field-group">
          <label class="field-label">Horizon</label>
          <select class="input-f" id="uc-${stepId}-${type}-${n}-horizon" onchange="saveUC('${stepId}','${type}',${n},'horizon',this.value)">
            <option value="">Select…</option>
            <option>Quick Win (0–6 months)</option>
            <option>Medium Term (6–18 months)</option>
            <option>Strategic (18+ months)</option>
          </select>
        </div>` : ''}
      </div>`).join('')}
    </div>
  </div>`;
}

// ─── Score handlers ───────────────────────────────────────────────────────────
function onScoreChange(qid, val) {
  if (!canEdit()) return;
  STATE.rawScores[qid] = val;
  const parts  = qid.split('-');           // q-01-d1-01
  const stepId = 's-' + parts[1];
  const dim    = parts[2].toUpperCase();
  recalcDimFromRaw(stepId, dim);
  updateNavBadge(stepId);
  recalcCMI();
  saveSession();
}

function onDimScore(stepId, dim, val) {
  if (!canEdit()) return;
  if (!STATE.scores[stepId]) STATE.scores[stepId] = {};
  STATE.scores[stepId][dim] = val;
  updateNavBadge(stepId);
  recalcCMI();
  saveSession();
}

function recalcDimFromRaw(stepId, dim) {
  const qs = QUESTIONS[stepId]?.[dim];
  if (!qs) return;
  const vals = qs.map(q => STATE.rawScores[q.id]).filter(v => v);
  if (!vals.length) return;
  if (!STATE.scores[stepId]) STATE.scores[stepId] = {};
  STATE.scores[stepId][dim] = parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
  updateNavScore(stepId);
}

function recalcCMI() {
  const stepAvgs = STEP_IDS.map(sid => {
    const s   = STATE.scores[sid] || {};
    const wts = DIM_WEIGHTS;
    let w = 0, tw = 0;
    Object.entries(wts).forEach(([d, wt]) => { if (s[d]) { w += s[d] * wt; tw += wt; } });
    return tw > 0 ? w / tw : null;
  }).filter(Boolean);

  STATE.cmi = stepAvgs.length
    ? parseFloat((stepAvgs.reduce((a, b) => a + b, 0) / stepAvgs.length).toFixed(2))
    : null;
  updateSidebar();
  updateProgress();
}

function recalcAllDimAvgs() {
  const out = {};
  ['D1','D2','D3','D4'].forEach(d => {
    const vals = STEP_IDS.map(sid => STATE.scores[sid]?.[d]).filter(Boolean);
    out[d] = vals.length ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)) : null;
  });
  return out;
}

// ─── Notes / pain points / use cases ─────────────────────────────────────────
function toggleNote(qid) { document.getElementById('note-' + qid)?.classList.toggle('open'); }
function saveNote(qid, val) { STATE.notes[qid] = val; saveSession(); }
function savePain(stepId, val) { STATE.general['pain-' + stepId] = val; saveSession(); }
function saveGeneralAnswer(qid, val) { STATE.general[qid] = val; saveSession(); }
function saveUC(stepId, type, n, field, val) {
  if (!STATE.useCases[stepId]) STATE.useCases[stepId] = {};
  if (!STATE.useCases[stepId][type]) STATE.useCases[stepId][type] = [];
  while (STATE.useCases[stepId][type].length < n) STATE.useCases[stepId][type].push({});
  STATE.useCases[stepId][type][n - 1][field] = val;
  saveSession();
}

// ─── Restore saved values ─────────────────────────────────────────────────────
function restoreStepValues(stepId) {
  const def = QUESTIONS[stepId];
  if (!def) return;
  ['D1','D2','D3','D4'].forEach(dim => {
    (def[dim] || []).forEach(q => {
      const v = STATE.rawScores[q.id];
      if (v) { const r = document.getElementById(q.id + '-' + v); if (r) r.checked = true; }
      const note = STATE.notes[q.id];
      if (note) {
        const nt = document.getElementById('note-t-' + q.id);
        if (nt) { nt.value = note; document.getElementById('note-' + q.id)?.classList.add('open'); }
      }
    });
  });
  if (stepId !== 's-ai') {
    ['D3','D4'].forEach(dim => {
      const v = STATE.scores[stepId]?.[dim];
      if (v) { const r = document.getElementById(stepId + '-' + dim + '-' + Math.round(v)); if (r) r.checked = true; }
    });
  }
  ['existing','potential'].forEach(type => {
    [1,2].forEach(n => {
      const uc = STATE.useCases[stepId]?.[type]?.[n-1];
      if (!uc) return;
      ['name','description','horizon'].forEach(f => {
        const el = document.getElementById(`uc-${stepId}-${type}-${n}-${f}`);
        if (el && uc[f]) el.value = uc[f];
      });
    });
  });
  const pain = STATE.general?.['pain-' + stepId];
  const painEl = document.getElementById('pain-' + stepId);
  if (painEl && pain) painEl.value = pain;
}

// ─── Nav badges / scores ──────────────────────────────────────────────────────
function updateNavBadge(stepId) {
  const badge  = document.getElementById('badge-' + stepId);
  if (!badge) return;
  const s      = STATE.scores[stepId] || {};
  const filled = ['D1','D2','D3','D4'].filter(d => s[d]).length;
  badge.className = 'nav-badge ' + (filled === 4 ? 'nb-done' : filled > 0 ? 'nb-partial' : 'nb-empty');
  updateNavScore(stepId);
}

function updateNavScore(stepId) {
  const el = document.getElementById('score-' + stepId);
  if (!el) return;
  const s = STATE.scores[stepId] || {};
  const vals = ['D1','D2','D3','D4'].map(d => s[d]).filter(Boolean);
  if (!vals.length) { el.textContent = '—'; el.className = 'nav-score'; return; }
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  el.textContent = avg.toFixed(1);
  el.className = 'nav-score ' + (avg >= 4.3 ? 'ns5' : avg >= 3.5 ? 'ns4' : avg >= 2.7 ? 'ns3' : avg >= 1.9 ? 'ns2' : 'ns1');
}

function updateProgress() {
  const done = STEP_IDS.filter(sid => ['D1','D2'].some(d => STATE.scores[sid]?.[d])).length;
  document.getElementById('progressBar').style.width = Math.round((done / STEP_IDS.length) * 100) + '%';
}

// ─── CMI Dashboard ────────────────────────────────────────────────────────────
function renderCMI() {
  const dims  = recalcAllDimAvgs();
  const cmi   = STATE.cmi;
  const band  = getBand(cmi);
  const peer  = STATE.portfolio?.portfolioStats;
  const peerS = STATE.portfolio?.peerScores;

  // Hero box
  const heroBox = document.getElementById('cmi-total-box');
  if (heroBox && band) {
    heroBox.style.background = `linear-gradient(135deg,${band.color}dd,${band.color}88)`;
  }
  document.getElementById('cmi-total-score').textContent = cmi ? cmi.toFixed(2) : '—';
  document.getElementById('cmi-total-band').textContent  = band?.label || 'Not started';
  document.getElementById('cmi-total-desc').textContent  = band?.desc  || 'Complete the assessment to generate your CMI score.';

  // Peer comparison
  if (peer?.avgCMI) {
    const sec = document.getElementById('cmi-peer-section');
    if (sec) sec.style.display = '';
    document.getElementById('cmi-peer-avg').textContent       = peer.avgCMI;
    document.getElementById('cmi-peer-submitted').textContent = peer.submitted + ' / ' + peer.totalCompanies + ' submitted';
    const diff = cmi ? (cmi - parseFloat(peer.avgCMI)).toFixed(2) : null;
    if (diff) {
      const el = document.getElementById('cmi-peer-diff');
      if (el) { el.textContent = (diff > 0 ? '+' : '') + diff + ' vs portfolio avg'; }
    }
  }

  // Dim cards
  const dimNames  = { D1:'Org Maturity', D2:'Technology', D3:'AI in Place', D4:'AI Opportunity' };
  const dimColors = { D1:'#1e40af', D2:'#9d174d', D3:'#166534', D4:'#92400e' };
  const dimCards  = document.getElementById('cmi-dim-cards');
  if (dimCards) {
    dimCards.innerHTML = ['D1','D2','D3','D4'].map(d => {
      const sc = dims[d]; const b = getBand(sc);
      return `<div class="dim-card">
        <div class="dim-card-label" style="color:${dimColors[d]}">${d} · ${dimNames[d]}</div>
        <div class="dim-card-score" style="color:${b?.color||'#94a3b8'}">${sc?.toFixed(2)||'—'}</div>
        <div class="dim-card-wt">Weight ${Math.round(DIM_WEIGHTS[d]*100)}%</div>
        ${b ? `<span class="dim-card-band" style="background:${b.bg};color:${b.color}">${b.label}</span>` : ''}
      </div>`;
    }).join('');
  }

  // Bar chart (my score vs peer avg per step)
  renderBarChart(peerS);

  // Step table
  const tbody = document.getElementById('cmi-step-table');
  if (tbody) {
    tbody.innerHTML = STEP_IDS.map(sid => {
      const s    = STATE.scores[sid] || {};
      const vals = ['D1','D2','D3','D4'].map(d => s[d]).filter(Boolean);
      const avg  = vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : null;
      const b    = getBand(avg);
      const pill = (sc, dim) => {
        const bb = getBand(sc);
        return sc ? `<span class="sc-pill" style="background:${bb?.bg||'#f1f5f9'};color:${bb?.color||'#94a3b8'}">${sc.toFixed(1)}</span>` : '—';
      };
      return `<tr>
        <td style="font-weight:600;font-size:11px">${STEP_LABELS[sid]}</td>
        <td>${pill(s.D1)}</td><td>${pill(s.D2)}</td><td>${pill(s.D3)}</td><td>${pill(s.D4)}</td>
        <td><strong style="color:${b?.color||'#94a3b8'}">${avg?.toFixed(2)||'—'}</strong></td>
        <td>${b ? `<span class="band-pill" style="background:${b.bg};color:${b.color}">${b.label}</span>` : '—'}</td>
      </tr>`;
    }).join('');
  }
}

function renderBarChart(peerS) {
  const el = document.getElementById('cmi-bar-chart');
  if (!el) return;
  el.innerHTML = STEP_IDS.map(sid => {
    const s     = STATE.scores[sid] || {};
    const vals  = ['D1','D2','D3','D4'].map(d=>s[d]).filter(Boolean);
    const my    = vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : null;
    const pVals = peerS ? ['D1','D2','D3','D4'].map(d=>peerS[sid]?.[d]).filter(Boolean) : [];
    const peer  = pVals.length ? pVals.reduce((a,b)=>a+b,0)/pVals.length : null;
    const band  = getBand(my);
    const myPct = my   ? (my/5)*100   : 0;
    const pPct  = peer ? (peer/5)*100 : 0;
    const label = STEP_LABELS[sid].replace(/^\d+ · /,'');
    return `<div class="bar-row">
      <div class="bar-row-label" title="${STEP_LABELS[sid]}">${label}</div>
      <div class="bar-track">
        ${peer ? `<div class="bar-fill-peer" style="width:${pPct}%;background:var(--g400)"></div>` : ''}
        ${my   ? `<div class="bar-fill-mine" style="width:${myPct}%;background:${band?.color||'var(--dark)'}"></div>` : ''}
      </div>
      <div class="bar-row-score" style="color:${band?.color||'var(--g400)'}">${my?my.toFixed(1):'—'}</div>
    </div>`;
  }).join('');
}

// ─── AI Inventory ─────────────────────────────────────────────────────────────
function renderInventory() {
  // My use cases
  let myRows = '';
  STEP_IDS.forEach(sid => {
    ['existing','potential'].forEach(type => {
      (STATE.useCases[sid]?.[type]||[]).filter(u=>u?.name).forEach(u => {
        const tag = type === 'existing' ? '<span class="inv-tag inv-tag-in">In Place</span>' : '<span class="inv-tag inv-tag-opp">Opportunity</span>';
        myRows += `<tr><td style="font-size:11px">${STEP_LABELS[sid]}</td><td>${tag}</td>
          <td style="font-weight:600">${u.name}</td>
          <td>${u.description||'—'}</td>
          <td>${u.horizon||'—'}</td></tr>`;
      });
    });
  });
  document.getElementById('inv-my-rows').innerHTML = myRows || '<tr><td colspan="5" class="inv-empty">No use cases documented yet.</td></tr>';

  // Portfolio use cases
  const portUCs = STATE.portfolio?.allUseCases || [];
  let portRows = '';
  portUCs.filter(u => !u.isOwn).forEach(u => {
    const tag = u.type === 'existing' ? '<span class="inv-tag inv-tag-in">In Place</span>' : '<span class="inv-tag inv-tag-opp">Opportunity</span>';
    portRows += `<tr><td style="font-size:11px">${STEP_LABELS[u.step]||u.step}</td><td>${tag}</td>
      <td style="font-weight:600">${u.name}</td>
      <td>${u.description||'—'}</td>
      <td><span class="inv-tag inv-tag-peer">${u.company}</span></td></tr>`;
  });
  document.getElementById('inv-port-rows').innerHTML = portRows || '<tr><td colspan="5" class="inv-empty">No peer use cases available yet — visible once other companies submit their assessments.</td></tr>';

  // Stats
  renderInvStats(portUCs);
}

function renderInvStats(portUCs) {
  const el = document.getElementById('inv-stats');
  if (!el) return;
  const myTotal  = STEP_IDS.flatMap(sid => [...(STATE.useCases[sid]?.existing||[]),...(STATE.useCases[sid]?.potential||[])]).filter(u=>u?.name).length;
  const inPlace  = portUCs.filter(u=>u.type==='existing'&&!u.isOwn).length;
  const opps     = portUCs.filter(u=>u.type==='potential'&&!u.isOwn).length;
  const subs     = STATE.portfolio?.portfolioStats?.submitted || 0;
  el.innerHTML = [
    {label:'My Use Cases',    val:myTotal, color:'#1a2e4a', bg:'white'},
    {label:'Portfolio In Place', val:inPlace, color:'#166534', bg:'#dcfce7'},
    {label:'Portfolio Opportunities', val:opps, color:'#92400e', bg:'#fef3c7'},
    {label:'Companies Submitted', val:subs,   color:'#1e40af', bg:'#dbeafe'}
  ].map(s=>`<div style="background:${s.bg};border-radius:10px;padding:16px;border:1px solid var(--g200);text-align:center">
    <div style="font-size:10px;font-weight:700;color:${s.color};text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">${s.label}</div>
    <div style="font-size:36px;font-weight:800;color:${s.color};line-height:1">${s.val}</div>
  </div>`).join('');
}

// ─── Save to server ───────────────────────────────────────────────────────────
async function saveProgress() {
  if (!canEdit()) { showToast('Read-only access — cannot save', 'warn'); return; }
  // Save company meta fields
  ['co-spend','co-ftes','co-ftes-fo','co-erp'].forEach(f => {
    const el = document.getElementById(f);
    if (el) STATE.general[f] = el.value;
  });
  const payload = {
    scores: STATE.scores, rawScores: STATE.rawScores,
    useCases: STATE.useCases, notes: STATE.notes,
    general: STATE.general, cmi: STATE.cmi,
    _targetCompany: STATE.identity?.id
  };
  try {
    await api('POST', '/api/save', payload);
    try { STATE.portfolio = await api('GET', '/api/portfolio'); } catch {}
    updateSidebar();
    showToast('Saved ✓');
  } catch { showToast('Saved locally (server offline)', 'warn'); }
  saveSession();
}

async function submitAssessment() {
  if (!canEdit()) { showToast('Read-only access', 'warn'); return; }
  if (!confirm('Submit your final assessment? You can still edit and resubmit afterwards.')) return;
  await saveProgress();
  try {
    await api('POST', '/api/submit', { companyId: STATE.identity?.id });
    showToast('Assessment submitted ✓');
    try { STATE.portfolio = await api('GET', '/api/portfolio'); } catch {}
  } catch { showToast('Saved locally', 'warn'); }
}

// ─── Export ───────────────────────────────────────────────────────────────────
function exportJSON() {
  const blob = new Blob([JSON.stringify({
    company: STATE.identity, generatedAt: new Date().toISOString(),
    cmi: STATE.cmi, scores: STATE.scores, useCases: STATE.useCases,
    notes: STATE.notes, general: STATE.general
  }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `procurement-ai-assessment-${STATE.identity?.id||'export'}-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg, type = 'ok') {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:8px;font-size:13px;font-weight:700;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.2);background:${type==='warn'?'#f97316':'#00A859'};color:white;transition:opacity .3s`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2500);
}

// ─── General answers (step 00) ────────────────────────────────────────────────
document.addEventListener('change', e => {
  if (e.target.id?.startsWith('q-00-') && canEdit()) {
    STATE.general[e.target.id] = e.target.value;
    saveSession();
  }
});

// ─── BainCap dashboard (read-only portfolio overview) ─────────────────────────
async function showBainCapDashboard() {
  // BainCap sees the full portfolio — go straight to CMI/inventory view
  // Reuse the same app UI but lock all inputs and skip to results
  applyRoleUI();
  renderAllSteps();      // render (locked)
  updateSidebar();

  // Add BainCap badge in sidebar
  const sbTop = document.querySelector('.sb-company');
  if (sbTop) {
    const badge = document.createElement('div');
    badge.style.cssText = 'background:#1e40af;color:white;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:700;margin-top:8px;display:inline-block';
    badge.textContent = 'VIEW ONLY · Bain Capital';
    sbTop.appendChild(badge);
  }

  // Load portfolio data and go straight to results
  try { STATE.portfolio = await api('GET', '/api/portfolio'); } catch {}
  showSection('s-cmi');
}

// ─── Admin dashboard ──────────────────────────────────────────────────────────
async function showAdminDashboard() {
  try {
    const data = await api('GET', '/api/admin/all');
    const rows = data.map(c => {
      const r    = c.response;
      const band = getBand(r?.cmi);
      return `<tr>
        <td style="font-weight:700">${c.name}</td>
        <td style="font-size:11px;color:var(--g600)">${c.cpo||'—'}</td>
        <td style="font-size:11px">${c.sector||'—'}</td>
        <td><span style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;background:${c.submitted?'#dcfce7':'#f1f5f9'};color:${c.submitted?'#166534':'#94a3b8'}">${c.submitted?'✓ Submitted':'In progress'}</span></td>
        <td style="font-weight:700;color:${band?.color||'#94a3b8'}">${r?.cmi?.toFixed?.(2)||'—'}${band?` <span style="font-size:10px;font-weight:600;padding:1px 7px;background:${band.bg};color:${band.color};border-radius:10px">${band.label}</span>`:''}</td>
        <td style="font-size:11px;color:var(--g400)">${c.savedAt?new Date(c.savedAt).toLocaleDateString('en-GB'):'—'}</td>
      </tr>`;
    }).join('');

    const submitted = data.filter(c=>c.submitted);
    const avgCMI   = submitted.length
      ? (submitted.map(c=>c.response?.cmi||0).reduce((a,b)=>a+b,0)/submitted.length).toFixed(2)
      : '—';

    document.getElementById('app-screen').innerHTML = `
      <div style="width:100%;padding:40px;max-width:1100px;margin:0 auto">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px">
          <div>
            <div style="font-size:22px;font-weight:800;color:#1a2e4a">Admin Dashboard</div>
            <div style="font-size:13px;color:#64748b;margin-top:2px">BCG × Inverto · Bain Capital Portfolio Assessment · 2026</div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-ghost" style="background:#1a2e4a;color:white;padding:8px 16px;border-radius:7px;font-weight:700;cursor:pointer;border:none" onclick="exportAdminData()">⬇ Export All</button>
            <button style="background:#ef4444;color:white;padding:8px 16px;border-radius:7px;font-weight:700;cursor:pointer;border:none" onclick="logout()">Logout</button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px">
          ${[{l:'Total Companies',v:data.length,c:'#1a2e4a'},{l:'Submitted',v:submitted.length,c:'#166534'},{l:'In Progress',v:data.length-submitted.length,c:'#92400e'},{l:'Portfolio Avg CMI',v:avgCMI,c:'#1e40af'}]
            .map(s=>`<div style="background:white;border-radius:10px;padding:16px;border:1px solid #e2e8f0;text-align:center">
              <div style="font-size:10px;font-weight:700;color:${s.c};text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">${s.l}</div>
              <div style="font-size:36px;font-weight:800;color:${s.c};line-height:1">${s.v}</div>
            </div>`).join('')}
        </div>
        <div style="background:white;border-radius:10px;border:1px solid #e2e8f0;overflow:hidden">
          <table style="width:100%;border-collapse:collapse">
            <thead style="background:#f8fafc">
              <tr>${['Company','CPO','Sector','Status','CMI','Last saved'].map(h=>`<th style="padding:10px 14px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;text-align:left;border-bottom:1px solid #e2e8f0">${h}</th>`).join('')}</tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
    window._adminData = data;
  } catch (e) {
    document.getElementById('app-screen').innerHTML = `<div style="padding:40px;color:#ef4444">Error: ${e.message} — <button onclick="logout()">Logout</button></div>`;
  }
}

function exportAdminData() {
  const blob = new Blob([JSON.stringify(window._adminData, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `baincap-portfolio-assessment-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
}

// Auto-save every 90s
setInterval(() => { if (STATE.token && canEdit()) saveProgress(); }, 90000);
