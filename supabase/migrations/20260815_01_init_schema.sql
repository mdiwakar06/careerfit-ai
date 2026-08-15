-- CareerFit AI: PostgreSQL & pgvector Schema Initialization
-- Migration: 20260815_01_init_schema.sql

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Evaluations Table
CREATE TABLE IF NOT EXISTS public.evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- Optional for authenticated users, NULL for guest evaluations
    session_id TEXT NOT NULL,
    target_role_title TEXT NOT NULL,
    target_company_name TEXT NOT NULL,
    
    -- Candidate to Job Match
    overall_match_score NUMERIC(3, 1) NOT NULL CHECK (overall_match_score >= 0 AND overall_match_score <= 10),
    technical_skill_score NUMERIC(3, 1) NOT NULL CHECK (technical_skill_score >= 0 AND technical_skill_score <= 10),
    seniority_impact_score NUMERIC(3, 1) NOT NULL CHECK (seniority_impact_score >= 0 AND seniority_impact_score <= 10),
    domain_stack_score NUMERIC(3, 1) NOT NULL CHECK (domain_stack_score >= 0 AND domain_stack_score <= 10),
    ats_score NUMERIC(3, 1) NOT NULL CHECK (ats_score >= 0 AND ats_score <= 10),
    score_justification TEXT NOT NULL,
    
    -- Company to Candidate Culture Fit
    culture_fit_score NUMERIC(3, 1) NOT NULL CHECK (culture_fit_score >= 0 AND culture_fit_score <= 10),
    org_type_alignment JSONB NOT NULL DEFAULT '{}'::jsonb,
    career_goal_alignment JSONB NOT NULL DEFAULT '{}'::jsonb,
    red_flag_risk_analysis JSONB NOT NULL DEFAULT '[]'::jsonb,
    culture_summary TEXT NOT NULL,
    recommendation_verdict TEXT NOT NULL,
    
    -- Deep Breakdowns & Google X-Y-Z Rewrites
    top_strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
    critical_gaps JSONB NOT NULL DEFAULT '[]'::jsonb,
    competitive_moats JSONB NOT NULL DEFAULT '[]'::jsonb,
    google_xyz_rewrites JSONB NOT NULL DEFAULT '[]'::jsonb,
    interview_talking_points JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Metadata
    sanitized_resume_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    candidate_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Documents Table (Sanitized Text Storage)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID REFERENCES public.evaluations(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL CHECK (doc_type IN ('resume', 'job_description')),
    raw_file_name TEXT,
    sanitized_content TEXT NOT NULL,
    redacted_items_count INT DEFAULT 0,
    preserved_links JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Document Chunks Table (pgvector Semantic Storage)
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID REFERENCES public.evaluations(id) ON DELETE CASCADE,
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL CHECK (doc_type IN ('resume', 'job_description')),
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(768), -- Compatible with Gemini text-embedding-004 / 768-dim models
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Vector Search Index (HNSW for fast cosine similarity)
CREATE INDEX IF NOT EXISTS document_chunks_embedding_hnsw_idx 
ON public.document_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS document_chunks_evaluation_id_idx 
ON public.document_chunks(evaluation_id);

CREATE INDEX IF NOT EXISTS evaluations_created_at_idx 
ON public.evaluations(created_at DESC);

-- 6. Match Document Chunks Stored Function
CREATE OR REPLACE FUNCTION public.match_document_chunks (
    query_embedding VECTOR(768),
    target_evaluation_id UUID,
    match_threshold FLOAT DEFAULT 0.5,
    match_count INT DEFAULT 5,
    filter_doc_type TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    doc_type TEXT,
    content TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.id,
        dc.document_id,
        dc.doc_type,
        dc.content,
        1 - (dc.embedding <=> query_embedding) AS similarity
    FROM public.document_chunks dc
    WHERE dc.evaluation_id = target_evaluation_id
      AND (filter_doc_type IS NULL OR dc.doc_type = filter_doc_type)
      AND 1 - (dc.embedding <=> query_embedding) > match_threshold
    ORDER BY dc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 7. Row Level Security (RLS)
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;

-- Allow public read/insert for anonymous demo sessions
CREATE POLICY "Public anonymous insert evaluations" ON public.evaluations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public anonymous select evaluations" ON public.evaluations FOR SELECT USING (true);
CREATE POLICY "Public anonymous insert documents" ON public.documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Public anonymous select documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Public anonymous insert document_chunks" ON public.document_chunks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public anonymous select document_chunks" ON public.document_chunks FOR SELECT USING (true);
