# 🌐 Production Deployment & Infrastructure Guide

This step-by-step blueprint details the end-to-end configuration required to deploy **CareerFit AI** to production across **GitHub**, **Supabase (pgvector)**, **Vercel**, **Hugging Face**, and **AI Providers**.

---

## 📑 Table of Contents
1. [GitHub Repository & CI/CD Setup](#1-github-repository--cicd-setup)
2. [Supabase PostgreSQL & pgvector Setup](#2-supabase-postgresql--pgvector-setup)
3. [Hugging Face / Embedding Model Setup](#3-hugging-face--embedding-model-setup)
4. [AI Provider Keys (Gemini & OpenRouter)](#4-ai-provider-keys-gemini--openrouter)
5. [Vercel Production Deployment](#5-vercel-production-deployment)
6. [Post-Deployment Verification Checklist](#6-post-deployment-verification-checklist)

---

## 1. 🐙 GitHub Repository & CI/CD Setup

### Step 1.1: Initialize Git & Commit Code
In your terminal, navigate to the project directory:
```bash
cd /Users/diwakarreddym/MyProjects/careerfit-ai
git init
git add .
git commit -m "feat: initial production-grade CareerFit AI release"
```

### Step 1.2: Create Remote Repository & Push
1. Open [GitHub](https://github.com/new) and create a new repository (e.g. `careerfit-ai`).
2. Link your local project to GitHub:
```bash
git remote add origin https://github.com/<your-github-username>/careerfit-ai.git
git branch -M main
git push -u origin main
```

### Step 1.3: Verify Automated CI Pipeline
- Navigate to the **Actions** tab on your GitHub repository.
- Confirm the `CareerFit AI CI Pipeline` runs and executes:
  - TypeScript Typecheck (`npx tsc --noEmit`)
  - SDET Automated Test Suite (`scripts/test-*.ts`)
  - Next.js Production Build (`npm run build`)

---

## 2. 🗄️ Supabase PostgreSQL & pgvector Setup

### Step 2.1: Create a New Supabase Project
1. Log in to [Supabase](https://supabase.com/dashboard).
2. Click **New Project**.
3. Set:
   - **Name**: `careerfit-ai-prod`
   - **Database Password**: Generate a secure password and save it in a password manager.
   - **Region**: Select a region close to your Vercel deployment (e.g., `us-east-1` / `iad1`).
4. Click **Create new project** (takes $\approx 1\text{ minute}$).

### Step 2.2: Apply PostgreSQL & pgvector Migrations
1. In your Supabase Dashboard, click on the **SQL Editor** tab on the left sidebar.
2. Click **New query**.
3. Copy and paste the entire contents of [`supabase/migrations/20260815_01_init_schema.sql`](./supabase/migrations/20260815_01_init_schema.sql).
4. Click **Run**.
5. Confirm that the following tables and functions were created:
   - Tables: `evaluations`, `documents`, `document_chunks`
   - Function: `match_document_chunks`
   - Extension: `vector`, `uuid-ossp`

### Step 2.3: Retrieve API Credentials
1. Go to **Project Settings** (gear icon) $\rightarrow$ **API**.
2. Note down the following three credentials:
   - **Project URL**: `https://<project-id>.supabase.co` $\rightarrow$ Map to `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Keys (anon / public)**: `eyJhbG...` $\rightarrow$ Map to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Project API Keys (service_role / secret)**: `eyJhbG...` $\rightarrow$ Map to `SUPABASE_SERVICE_ROLE_KEY` *(Never expose this to browser clients)*

---

## 3. 🤗 Hugging Face / Embedding Model Setup

CareerFit AI supports both **Gemini `text-embedding-004` (768-dim)** and **Hugging Face open-source embeddings (384-dim)**.

### Step 3.1: Obtain Hugging Face Token (Optional)
1. Go to [Hugging Face Settings $\rightarrow$ Access Tokens](https://huggingface.co/settings/tokens).
2. Click **Create new token**.
3. Name: `careerfit-ai-embeddings`.
4. Role: `Read`.
5. Copy token: `hf_...` $\rightarrow$ Map to `HUGGINGFACE_API_TOKEN`.

---

## 4. 🤖 AI Provider Keys (Gemini & OpenRouter)

### Step 4.1: Google Gemini API (Recommended)
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **Create API Key**.
3. Select your Google Cloud project.
4. Copy key: `AIzaSy...` $\rightarrow$ Map to `GEMINI_API_KEY`.
*(Gemini 2.5 Flash provides high structured JSON parsing speed and 1M token context).*

### Step 4.2: OpenRouter API (Alternative)
1. Visit [OpenRouter Keys](https://openrouter.ai/keys).
2. Click **Create Key**.
3. Copy key: `sk-or-v1-...` $\rightarrow$ Map to `OPENROUTER_API_KEY`.

---

## 5. ▲ Vercel Production Deployment

### Step 5.1: Import Project to Vercel
1. Log in to [Vercel](https://vercel.com/dashboard).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your `careerfit-ai` GitHub repository.

### Step 5.2: Configure Build & Environment Variables
In the **Configure Project** screen:
1. **Framework Preset**: Next.js (Auto-detected).
2. **Root Directory**: `./`
3. Expand **Environment Variables** and add:

| Variable Name | Environment | Example Value | Description |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Production, Preview | `AIzaSy...` | Primary multi-agent evaluation engine |
| `OPENROUTER_API_KEY` | Production, Preview | `sk-or-v1-...` | Secondary AI provider fallback |
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Dev | `https://xyz.supabase.co` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Dev | `eyJhbGci...` | Public client key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview | `eyJhbGci...` | Server-side database write key |
| `HUGGINGFACE_API_TOKEN` | Production, Preview | `hf_...` | Optional embedding inference key |

### Step 5.3: Deploy
1. Click **Deploy**.
2. Wait $\approx 60\text{ seconds}$ for build completion.
3. Vercel will assign a production URL (e.g. `https://careerfit-ai-studio.vercel.app`).

### Step 5.4: Custom Domain & DNS (Optional)
1. In Vercel Project Settings $\rightarrow$ **Domains**.
2. Add your custom domain (e.g., `careerfit.ai` or `app.careerfit.ai`).
3. Set the CNAME / A records in your DNS provider (Cloudflare, Namecheap, Google Domains).
4. SSL certificate is auto-provisioned within minutes.

---

## 6. ✅ Post-Deployment Verification Checklist

1. [ ] **Homepage Health**: Open your production Vercel URL; verify Swiss aesthetic, pulsing BETA badge, and PII banner load instantly.
2. [ ] **PII Masking**: Upload a test PDF resume; verify names, emails, and phone numbers are scrubbed while `github.com` handles remain visible.
3. [ ] **Evaluation Flow**: Run an evaluation; verify that Candidate-to-Job and Culture Fit radial meters render smoothly.
4. [ ] **Google X-Y-Z Rewriter**: Verify that clicking "Copy Bullet" on any rewrite triggers a toast notification.
5. [ ] **Grounded Chat**: In the chat tab, click a suggested question pill and verify that streaming citations appear.
6. [ ] **Database Persistence**: Check Supabase **Table Editor** $\rightarrow$ `evaluations` and `document_chunks` to confirm records are stored.
