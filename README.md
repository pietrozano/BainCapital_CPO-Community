# Procurement AI Maturity Assessment
### BCG × Inverto × Bain Capital · 2026

A web application for running the Procurement AI Maturity Assessment across Bain Capital's 16 portfolio companies.

---

## What it does

- Each portfolio company logs in with a unique access code and fills a structured assessment covering 9 procurement process steps × 4 maturity dimensions
- Scores are automatically aggregated into a **Composite Maturity Index (CMI)**
- Each company sees their score benchmarked against the anonymised portfolio average
- All AI use cases documented across the portfolio are visible in a shared library
- BCG team has edit rights across all assessments; Bain Capital has view-only access

## Access roles

| Role | Rights | Code |
|---|---|---|
| Portfolio company | Fill own assessment | Per-company code (see server.js) |
| BCG × Inverto | Edit any assessment | `BCG-878C77129C` |
| Bain Capital | View-only portfolio dashboard | `BAINCAP-99F521655A` |
| Admin | Full admin dashboard | `ADMIN-BCG-INVERTO-2026` |

---

## Running locally

```bash
npm install
node server.js
# → http://localhost:3000
```

## Deploying to Railway

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select this repo — Railway auto-detects Node.js
4. Set start command: `node server.js`
5. Share the generated URL with the 16 CPOs

## Stack

- **Backend:** Node.js + Express, JSON file storage (`data/responses.json`)
- **Frontend:** Vanilla JS + CSS, single-page app (`index.html`)
- **Auth:** HMAC-SHA256 token per access code, role-based (company / bcg / baincap / admin)

## Assessment structure

| Step | Process Area | Type |
|---|---|---|
| 00 | General context | Qualitative |
| 01 | Strategy & Governance | S2C |
| 02 | Category Management | S2C |
| 03 | Supplier Management | S2C |
| 04 | Strategic Sourcing (RFx) | S2C |
| 05 | Contract Management | S2C |
| 06 | PR & Requisition | P2P |
| 07 | PO Management | P2P |
| 08 | Invoice & Accounts Payable | P2P |
| 09 | Reporting & Analytics | P2P |
| AI | AI & Tech Deep Dive | Cross-cutting |

**4 dimensions scored 1–5:**
- D1 Organisational Maturity · weight 35%
- D2 Technology · weight 30%
- D3 AI in Place · weight 20%
- D4 AI Opportunity · weight 15%
