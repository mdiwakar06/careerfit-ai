# 🚀 CareerFit AI — Privacy-First Bidirectional Career Co-Pilot

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.1-black.svg?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase pgvector](https://img.shields.io/badge/Supabase-pgvector-3ecf8e.svg?logo=supabase)](https://supabase.com/)
[![CI Pipeline](https://img.shields.io/badge/CI-Passing-12715b.svg)]()

> **CareerFit AI** matches software engineers to job descriptions and company operating cultures, delivering dual 0–10 calibrated match scores, honest skill gap breakdowns, and high-leverage resume rewrites using the **Google X-Y-Z formula** (*Accomplished [X], measured by [Y], by doing [Z]*).

---

## ✨ Core Product Capabilities

1. 🛡️ **Zero-Compromise PII Sanitization Engine**:
   - Client- and server-side automated scrubbing of Full Names, Phone Numbers, Email Addresses, and Street Addresses.
   - Strictly preserves developer handles (`github.com/*`, `linkedin.com/in/*`, and custom portfolio domains) for technical evaluation.
   - Real-time transparency badge displaying exact redacted item counts.

2. 🧠 **Multi-Agent 3-Persona Evaluation Panel**:
   - **Senior ATS Architect**: Analyzes taxonomy density, keyword coverage, and section parseability.
   - **Executive Technical Recruiter**: Assesses career progression, narrative coherence, and seniority calibration.
   - **Staff Engineering Hiring Manager**: Evaluates technical decision depth, system scale (RPS, DAU, latency), trade-off awareness, and quantified ROI.

3. ✍️ **Google X-Y-Z Resume Rewriter**:
   - Rewrites weak, passive bullet points into quantified accomplishments without fabricating credentials.
   - Side-by-side Before vs. After comparison with 1-click clipboard copy.

4. 🏢 **Bidirectional Company Culture & Red-Flag Radar**:
   - Evaluates candidate preferences from a 30-second Micro-Quiz (Target Org Model, Core Priority, Dealbreakers) against the realistic operating profile of the target company.
   - Proactive anti-pattern alerts for micromanagement, legacy codebases, and chaotic on-call rotations.

5. 💬 **Grounded Semantic Q&A Workspace (Supabase pgvector)**:
   - Paragraph-aligned vector search over the resume and JD chunks.
   - Allows candidates to interrogate gaps, practice interview answers, and generate tailored cold outreach messages.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT INGESTION LAYER                          │
├────────────────────────────────────┬───────────────────────────────────┤
│ 📄 Resume Upload (PDF/DOCX/MD/TXT) │ 📋 Job Description & Company Name │
│ • Automated Client PII Masking     │ • Text Paste or URL Extraction    │
├────────────────────────────────────┴───────────────────────────────────┤
│ 🎯 30-Second Micro-Quiz: Org Model | Career Priority | Red Lines       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     MULTI-AGENT EVALUATION ENGINE                      │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Senior ATS Parser       │ 2. Executive Recruiter                    │
│ 3. Staff Engineering HM    │ 4. Culture Fit & Red-Flag Synthesizer     │
│ 5. Strict Zod Schema Guard │ 6. Multi-Provider Fallback (Gemini/OpenAI)│
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       ACTIONABLE DASHBOARD HUB                         │
├────────────────────────────────────────────────────────────────────────┤
│ 📊 Dual Match Score (Candidate-to-Job: X/10 | Company Fit: Y/10)       │
│ 🌟 Exceeding Areas & Competitive Moats                                 │
│ ⚠️ Skill Gap Breakdown & Strategic Remedies                            │
│ ✍️ Google X-Y-Z Formula Bullet Rewrites (1-Click Copy)                 │
│ 💬 Grounded pgvector Chat Workspace with Citations                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/careerfit-ai.git
cd careerfit-ai
npm install
```

### 2. Configure Environment Variables (Optional)
Copy the example configuration file:
```bash
cp .env.example .env.local
```
*(Note: CareerFit AI operates with a built-in deterministic evaluation engine if no API keys are provided!)*

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated SDET Testing Quality Gates

Run all unit, parser, and schema tests locally:
```bash
# Run PII sanitization and link preservation test
npx tsx scripts/test-pii.ts

# Run universal document parser test
npx tsx scripts/test-parsers.ts

# Run evaluation engine and Zod schema test
npx tsx scripts/test-eval-schema.ts

# Run strict TypeScript typecheck
npx tsc --noEmit

# Run production build validation
npm run build
```

---

## 📖 Deployment Documentation
See [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) for step-by-step production setup across:
- **Vercel** (Serverless Next.js Hosting)
- **Supabase** (PostgreSQL & `pgvector` extension)
- **Hugging Face / Open Source Embeddings**
- **GitHub** (CI/CD Automations)
