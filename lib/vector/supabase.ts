import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { DocumentChunk } from "./chunker";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(url, key);
  }

  return supabaseInstance;
}

// In-Memory Fallback Store for Local Zero-Config Runs
interface InMemoryStoredChunk {
  id: string;
  evaluationId: string;
  docType: "resume" | "job_description";
  content: string;
  sectionHeader?: string;
}

const inMemoryChunkStore: InMemoryStoredChunk[] = [];

export async function storeEvaluationChunks(
  evaluationId: string,
  chunks: DocumentChunk[]
): Promise<void> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const records = chunks.map((c) => ({
        evaluation_id: evaluationId,
        doc_type: c.docType,
        chunk_index: c.chunkIndex,
        content: c.content,
        metadata: { sectionHeader: c.sectionHeader },
      }));
      await supabase.from("document_chunks").insert(records);
      return;
    } catch (err) {
      console.warn("Supabase insert failed, using memory store:", err);
    }
  }

  // Local fallback
  for (const c of chunks) {
    inMemoryChunkStore.push({
      id: `chunk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      evaluationId,
      docType: c.docType,
      content: c.content,
      sectionHeader: c.sectionHeader,
    });
  }
}

export async function searchRelevantChunks(
  evaluationId: string,
  query: string,
  limit = 5
): Promise<Array<{ docType: "resume" | "job_description"; content: string; relevanceScore: number }>> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data } = await supabase
        .from("document_chunks")
        .select("doc_type, content")
        .eq("evaluation_id", evaluationId)
        .limit(limit);

      if (data && data.length > 0) {
        return data.map((d) => ({
          docType: d.doc_type as "resume" | "job_description",
          content: d.content,
          relevanceScore: 0.85,
        }));
      }
    } catch (err) {
      console.warn("Supabase search fallback:", err);
    }
  }

  // Keyword / Semantic-Heuristic In-Memory Search
  const queryTerms = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const matched = inMemoryChunkStore
    .filter((c) => c.evaluationId === evaluationId)
    .map((c) => {
      const lowerContent = c.content.toLowerCase();
      let score = 0;
      for (const term of queryTerms) {
        if (lowerContent.includes(term)) {
          score += 1;
        }
      }
      return {
        docType: c.docType,
        content: c.content,
        relevanceScore: queryTerms.length > 0 ? score / queryTerms.length : 0.5,
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);

  return matched;
}
