/**
 * Procurement AI Maturity Assessment — BCG × Inverto × Bain Capital
 * Backend server: Node.js + Express, JSON file storage
 * Run: node server.js   (then open http://localhost:3000)
 */

const express   = require('express');
const fs        = require('fs');
const path      = require('path');
const crypto    = require('crypto');
const Anthropic = require('@anthropic-ai/sdk');
const multer    = require('multer');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// File upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'data', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ─── Role definitions ─────────────────────────────────────────────────────────
// company  → read + write own assessment only
// bcg      → read + write any company's assessment (edit rights across portfolio)
// baincap  → read-only on all assessments + portfolio view (no editing)
// admin    → everything + user management view

// ─── Access credentials ───────────────────────────────────────────────────────
// Codes are prefixed + 5-byte hex for unpredictability. Store securely.
const SPECIAL_USERS = [
  {
    id:   'bcg-team',
    name: 'BCG × Inverto Team',
    role: 'bcg',
    code: 'BCG-878C77129C'    // share only with BCG/Inverto project team
  },
  {
    id:   'baincap',
    name: 'Bain Capital',
    role: 'baincap',
    code: 'BAINCAP-99F521655A' // share with Bain Capital (Tommaso & Head of PTF)
  },
  {
    id:   'admin',
    name: 'Admin',
    role: 'admin',
    code: 'ADMIN-BCG-INVERTO-2026'  // server admin only
  }
];

const COMPANIES = [
  { id: 'mkm',       name: 'MKM',             cpo: 'Ian McConville',     sector: 'Distribution',       code: 'MKM-879CF3DEB1'      },
  { id: 'fis',       name: 'FIS',             cpo: 'Gianluca Valente',   sector: 'Financial Services', code: 'FIS-F93FA56EE6'      },
  { id: 'apleona',   name: 'Apleona',         cpo: 'Sascha Kwiatkowski', sector: 'Facilities Mgmt',    code: 'APL-1CBAC1F56A'      },
  { id: 'itp',       name: 'ITP',             cpo: 'Elena Vicente',      sector: 'Technology',         code: 'ITP-F7BE592DAB'      },
  { id: 'fedrigoni', name: 'Fedrigoni',       cpo: 'Alessandro Gaiati',  sector: 'Packaging & Paper',  code: 'FED-17AB69326E'      },
  { id: 'softway',   name: 'Softway',         cpo: 'Bastien Python-Curt',sector: 'Software',           code: 'SFW-001ECF1CAF'      },
  { id: 'namirial',  name: 'Namirial',        cpo: 'Luca Mocerino',      sector: 'Digital Services',   code: 'NAM-61654CA8E6'      },
  { id: 'inetum',    name: 'Inetum',          cpo: 'Norbert Meurgues',   sector: 'IT Services',        code: 'INE-7B565121F6'      },
  { id: 'nexi',      name: 'Nexi',            cpo: 'Paolo Rosato',       sector: 'Payments',           code: 'NEX-F10600199A'      },
  { id: 'kantar',    name: 'Kantar',          cpo: 'Stephen Day',        sector: 'Data & Analytics',   code: 'KAN-56AABB406F'      },
  { id: 'valeo',     name: 'Valeo',           cpo: 'Thibaut Eissautier', sector: 'Automotive',         code: 'VAL-175661FF99'      },
  { id: 'somacis',   name: 'Somacis',         cpo: 'Matteo Fontanella',  sector: 'Electronics',        code: 'SOM-20856A3B76'      },
  { id: 'italmatch', name: 'Italmatch',       cpo: 'Antonio Autuori',    sector: 'Chemicals',          code: 'ITM-BD3B71BB29'      },
  { id: 'tingstad',  name: 'Tingstad',        cpo: 'Johan Larsson',      sector: 'Distribution',       code: 'TIN-BF4A9D35B4'      },
  { id: 'centrient', name: 'Centrient',       cpo: 'Ian Watkins',        sector: 'Pharma',             code: 'CEN-70EEE3F0E8'      },
  { id: 'company16', name: 'Portfolio Co. 16',cpo: '—',                  sector: '—',                  code: 'PC16-8AF0A3137E'     }
];

const app       = express();
const PORT      = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'responses.json');

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Token');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: '5mb' }));
app.use(express.static(__dirname));

// ─── Ensure data dir + file exist ────────────────────────────────────────────
if (!fs.existsSync(path.join(__dirname, 'data'))) fs.mkdirSync(path.join(__dirname, 'data'));
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({}));

// ─── Helpers ──────────────────────────────────────────────────────────────────
function readData() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { return {}; }
}
function writeData(d) { fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2)); }

function makeToken(code) {
  return crypto.createHmac('sha256', 'bcg-inverto-baincap-2026-secret')
               .update(code.trim().toUpperCase())
               .digest('hex');
}

function resolveIdentity(token) {
  // Check special users first
  for (const u of SPECIAL_USERS) {
    if (makeToken(u.code) === token) return { ...u, isSpecial: true };
  }
  // Check companies
  for (const c of COMPANIES) {
    if (makeToken(c.code) === token) return { ...c, role: 'company', isSpecial: false };
  }
  return null;
}

// ─── Auth middleware ──────────────────────────────────────────────────────────
function auth(req, res, next) {
  const token = req.headers['x-token'];
  if (!token) return res.status(401).json({ error: 'No token' });
  const identity = resolveIdentity(token);
  if (!identity) return res.status(401).json({ error: 'Invalid token' });
  req.identity = identity;
  next();
}

function requireWrite(req, res, next) {
  const role = req.identity.role;
  if (role === 'baincap') return res.status(403).json({ error: 'Read-only access' });
  next();
}

function requireAdmin(req, res, next) {
  if (req.identity.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
}

// ─── POST /api/login ──────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const code = (req.body.code || '').trim().toUpperCase();
  if (!code) return res.status(400).json({ error: 'No code provided' });

  // Check special users
  const special = SPECIAL_USERS.find(u => u.code.toUpperCase() === code);
  if (special) {
    const token = makeToken(special.code);
    return res.json({
      token,
      role: special.role,
      identity: { id: special.id, name: special.name, role: special.role }
    });
  }

  // Check companies
  const company = COMPANIES.find(c => c.code.toUpperCase() === code);
  if (company) {
    const token = makeToken(company.code);
    return res.json({
      token,
      role: 'company',
      identity: { id: company.id, name: company.name, cpo: company.cpo, sector: company.sector, role: 'company' }
    });
  }

  return res.status(401).json({ error: 'Invalid access code' });
});

// ─── GET /api/me ──────────────────────────────────────────────────────────────
app.get('/api/me', auth, (req, res) => {
  const data = readData();
  const id   = req.identity;
  if (id.role === 'company') {
    return res.json({ identity: id, response: data[id.id] || {} });
  }
  // BCG / BainCap / admin → return all data
  const allResponses = COMPANIES.map(c => ({
    company: { id: c.id, name: c.name, cpo: c.cpo, sector: c.sector },
    response: data[c.id] || null,
    submitted: !!(data[c.id]?._submitted),
    savedAt: data[c.id]?._savedAt || null
  }));
  res.json({ identity: id, allResponses });
});

// ─── GET /api/my-response ─────────────────────────────────────────────────────
app.get('/api/my-response', auth, (req, res) => {
  const data = readData();
  if (req.identity.role === 'company') {
    return res.json(data[req.identity.id] || {});
  }
  // BCG editing a specific company: pass ?companyId=nexi
  const cid = req.query.companyId;
  if (cid && (req.identity.role === 'bcg' || req.identity.role === 'admin')) {
    return res.json(data[cid] || {});
  }
  res.json({});
});

// ─── POST /api/save ───────────────────────────────────────────────────────────
app.post('/api/save', auth, requireWrite, (req, res) => {
  const data = readData();
  // Company saves their own; BCG can save any via ?companyId=
  const targetId = (req.identity.role === 'company')
    ? req.identity.id
    : (req.body._targetCompany || req.identity.id);

  data[targetId] = {
    ...data[targetId],
    ...req.body,
    _company:  targetId,
    _savedBy:  req.identity.role,
    _savedAt:  new Date().toISOString()
  };
  writeData(data);
  res.json({ ok: true });
});

// ─── POST /api/submit ─────────────────────────────────────────────────────────
app.post('/api/submit', auth, requireWrite, (req, res) => {
  const data = readData();
  const targetId = (req.identity.role === 'company')
    ? req.identity.id
    : (req.body.companyId || req.identity.id);
  if (!data[targetId]) return res.status(400).json({ error: 'No data saved yet' });
  data[targetId]._submitted    = true;
  data[targetId]._submittedAt  = new Date().toISOString();
  data[targetId]._submittedBy  = req.identity.role;
  writeData(data);
  res.json({ ok: true });
});

// ─── GET /api/portfolio ───────────────────────────────────────────────────────
// Peer data is returned for all roles; visibility differs in the frontend
app.get('/api/portfolio', auth, (req, res) => {
  const data      = readData();
  const myId      = req.identity.role === 'company' ? req.identity.id : null;
  const submitted = Object.entries(data).filter(([, d]) => d._submitted);

  const STEPS = ['s-01','s-02','s-03','s-04','s-05','s-06','s-07','s-08','s-09','s-ai'];
  const DIMS  = ['D1','D2','D3','D4'];

  // Peer scores: exclude the requesting company from the average
  const peerScores = {};
  STEPS.forEach(step => {
    peerScores[step] = {};
    DIMS.forEach(dim => {
      const vals = submitted
        .filter(([id]) => id !== myId)
        .map(([, d]) => d.scores?.[step]?.[dim])
        .filter(v => typeof v === 'number');
      peerScores[step][dim] = vals.length
        ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2))
        : null;
    });
  });

  // All use cases from submitted companies (anonymised for company role)
  const allUseCases = [];
  submitted.forEach(([id, d]) => {
    const isOwn  = id === myId;
    const coName = COMPANIES.find(c => c.id === id)?.name || 'Portfolio Company';
    if (d.useCases) {
      Object.entries(d.useCases).forEach(([step, ucs]) => {
        (['existing', 'potential']).forEach(type => {
          (ucs[type] || []).filter(u => u?.name).forEach(u => {
            allUseCases.push({
              step, type,
              name:        u.name,
              description: u.description || '',
              horizon:     u.horizon || '',
              // All roles see actual company names for transparency
              company: coName,
              isOwn
            });
          });
        });
      });
    }
  });

  // Per-company CMI summary for BCG/BainCap/admin
  const companyScores = (req.identity.role !== 'company')
    ? COMPANIES.map(c => ({
        id: c.id, name: c.name, sector: c.sector,
        cmi:       data[c.id]?.cmi || null,
        submitted: !!(data[c.id]?._submitted),
        scores:    data[c.id]?.scores || null
      }))
    : null;

  const submittedCMIs = submitted.map(([, d]) => d.cmi).filter(Boolean);
  res.json({
    peerScores,
    allUseCases,
    companyScores,
    portfolioStats: {
      totalCompanies: COMPANIES.length,
      submitted:      submitted.length,
      avgCMI: submittedCMIs.length
        ? parseFloat((submittedCMIs.reduce((a, b) => a + b, 0) / submittedCMIs.length).toFixed(2))
        : null,
      submittedCMIs
    }
  });
});

// ─── POST /api/upload-file ───────────────────────────────────────────────────
app.post('/api/upload-file', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ ok: true, filename: req.file.filename, original: req.file.originalname });
});

// ─── POST /api/analyze ────────────────────────────────────────────────────────
// AI scores all answers for a company
app.post('/api/analyze', auth, requireWrite, async (req, res) => {
  const { answers, rubrics, targetCompany } = req.body;
  const companyId = req.identity.role === 'company' ? req.identity.id : (targetCompany || req.identity.id);

  try {
    const aiScores    = {};
    const aiReasoning = {};

    // Score each answer with Claude
    for (const [stepId, stepAnswers] of Object.entries(answers || {})) {
      aiScores[stepId]    = {};
      aiReasoning[stepId] = {};
      for (const [qId, answer] of Object.entries(stepAnswers || {})) {
        const rubric = rubrics?.[stepId]?.[qId];
        if (!rubric || !answer?.text?.trim()) { aiScores[stepId][qId] = null; continue; }

        const prompt = `You are an expert procurement AI maturity assessor scoring a CPO's self-assessment.

Question: ${rubric.text}

Scoring rubric:
1 – None: ${rubric.scores[0]}
2 – Piloting: ${rubric.scores[1]}
3 – Deployed: ${rubric.scores[2]}
4 – Scaled: ${rubric.scores[3]}

CPO's answer: "${answer.text}"

Score this answer strictly against the rubric. Be objective — the CPO cannot see the score during the assessment.
Respond ONLY with valid JSON: {"score": <integer 1-4>, "reasoning": "<one concise sentence explaining the score>"}`;

        const msg = await anthropic.messages.create({
          model: 'claude-opus-4-5',
          max_tokens: 150,
          messages: [{ role: 'user', content: prompt }]
        });

        try {
          const parsed = JSON.parse(msg.content[0].text.trim());
          aiScores[stepId][qId]    = Math.min(4, Math.max(1, Math.round(parsed.score)));
          aiReasoning[stepId][qId] = parsed.reasoning;
        } catch {
          aiScores[stepId][qId] = 1;
          aiReasoning[stepId][qId] = 'Could not parse AI response.';
        }
      }
    }

    // Aggregate step scores: D1=Foundation(avg q1,q2), D2=InPlace(avg q3,q4), D3=Frontier(q5)
    const scores = {};
    for (const [stepId, qScores] of Object.entries(aiScores)) {
      const vals = Object.values(qScores).filter(v => v !== null);
      if (!vals.length) continue;
      const n = vals.length;
      const foundation = vals.slice(0, Math.ceil(n * 0.4));
      const inPlace    = vals.slice(Math.ceil(n * 0.4), Math.ceil(n * 0.7));
      const frontier   = vals.slice(Math.ceil(n * 0.7));
      const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
      scores[stepId] = {
        D1: avg(foundation) || avg(vals),
        D2: avg(inPlace)    || avg(vals),
        D3: avg(frontier)   || avg(vals)
      };
    }

    // Compute CMI
    const stepCMIs = Object.values(scores).map(s => {
      const w = { D1: 0.30, D2: 0.45, D3: 0.25 };
      return (s.D1||0)*w.D1 + (s.D2||0)*w.D2 + (s.D3||0)*w.D3;
    });
    const cmi = stepCMIs.length ? +(stepCMIs.reduce((a,b)=>a+b,0)/stepCMIs.length).toFixed(2) : null;

    // Persist
    const data = readData();
    data[companyId] = {
      ...data[companyId],
      answers,
      aiScores,
      aiReasoning,
      scores,
      cmi,
      _analyzedAt: new Date().toISOString(),
      _company: companyId,
      _savedBy: req.identity.role,
      _savedAt: new Date().toISOString()
    };
    writeData(data);

    res.json({ ok: true, scores, cmi, aiScores, aiReasoning });
  } catch (err) {
    console.error('Analyze error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/override ───────────────────────────────────────────────────────
// BCG/admin overrides an AI score for a specific question
app.post('/api/override', auth, (req, res) => {
  if (!['bcg', 'admin'].includes(req.identity.role)) {
    return res.status(403).json({ error: 'BCG/Admin only' });
  }
  const { companyId, stepId, qId, score, reasoning } = req.body;
  const data = readData();
  if (!data[companyId]) return res.status(404).json({ error: 'No data for company' });

  data[companyId].aiScores                     = data[companyId].aiScores || {};
  data[companyId].aiScores[stepId]             = data[companyId].aiScores[stepId] || {};
  data[companyId].aiScores[stepId][qId]        = Math.min(4, Math.max(1, score));
  data[companyId].aiReasoning                  = data[companyId].aiReasoning || {};
  data[companyId].aiReasoning[stepId]          = data[companyId].aiReasoning[stepId] || {};
  data[companyId].aiReasoning[stepId][qId]     = `[BCG Override] ${reasoning}`;

  // Re-aggregate scores
  const aiScores = data[companyId].aiScores;
  const scores   = {};
  for (const [sid, qScores] of Object.entries(aiScores)) {
    const vals = Object.values(qScores).filter(v => v !== null);
    if (!vals.length) continue;
    const n = vals.length;
    const avg = arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : null;
    scores[sid] = {
      D1: avg(vals.slice(0, Math.ceil(n*0.4))) || avg(vals),
      D2: avg(vals.slice(Math.ceil(n*0.4), Math.ceil(n*0.7))) || avg(vals),
      D3: avg(vals.slice(Math.ceil(n*0.7))) || avg(vals)
    };
  }
  const stepCMIs = Object.values(scores).map(s=>(s.D1||0)*0.30+(s.D2||0)*0.45+(s.D3||0)*0.25);
  data[companyId].scores = scores;
  data[companyId].cmi    = stepCMIs.length ? +(stepCMIs.reduce((a,b)=>a+b,0)/stepCMIs.length).toFixed(2) : null;
  data[companyId]._overriddenAt = new Date().toISOString();
  data[companyId]._overriddenBy = req.identity.name;
  writeData(data);

  res.json({ ok: true, scores: data[companyId].scores, cmi: data[companyId].cmi });
});

// ─── GET /api/admin/all  (admin only) ─────────────────────────────────────────
app.get('/api/admin/all', auth, requireAdmin, (req, res) => {
  const data = readData();
  res.json(COMPANIES.map(c => ({
    ...c,
    code:      undefined,           // never expose codes via API
    response:  data[c.id] || null,
    submitted: !!(data[c.id]?._submitted),
    savedAt:   data[c.id]?._savedAt || null
  })));
});

// ─── POST /api/admin/reset/:id  (admin only) ─────────────────────────────────
app.post('/api/admin/reset/:id', auth, requireAdmin, (req, res) => {
  const data = readData();
  delete data[req.params.id];
  writeData(data);
  res.json({ ok: true });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅  BCG × Inverto · Procurement AI Assessment — 2026`);
  console.log(`    http://localhost:${PORT}\n`);
  console.log('  ROLE          CODE');
  console.log('  ──────────────────────────────────────────');
  SPECIAL_USERS.forEach(u => console.log(`  ${u.role.padEnd(13)} ${u.code}`));
  console.log('  ──────────────────────────────────────────');
  COMPANIES.forEach(c => console.log(`  ${c.name.padEnd(13)} ${c.code}`));
  console.log('');
});
