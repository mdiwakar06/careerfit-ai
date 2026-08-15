export interface DocumentChunk {
  chunkIndex: number;
  content: string;
  docType: "resume" | "job_description";
  charCount: number;
  sectionHeader?: string;
}

/**
 * Paragraph-aligned chunker designed for resumes and job descriptions.
 * Preserves semantic coherence and prevents splitting sentences arbitrarily.
 */
export function chunkDocumentText(
  text: string,
  docType: "resume" | "job_description",
  targetChunkChars = 600,
  maxChunkChars = 900
): DocumentChunk[] {
  if (!text || !text.trim()) return [];

  const rawParagraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: DocumentChunk[] = [];
  let currentAccumulator = "";
  let currentHeader = "";
  let chunkIndex = 0;

  for (const para of rawParagraphs) {
    // Check if this paragraph looks like a section header (e.g. ## Experience or SKILLS)
    if (
      para.length < 50 &&
      (/^#+\s+/i.test(para) ||
        /^[A-Z\s,/-]{3,30}:?$/.test(para) ||
        /^(experience|education|skills|projects|requirements|qualifications|responsibilities|about us)/i.test(
          para
        ))
    ) {
      currentHeader = para.replace(/^#+\s*/, "").trim();
    }

    if (
      currentAccumulator.length + para.length <= maxChunkChars ||
      currentAccumulator.length < targetChunkChars / 2
    ) {
      currentAccumulator += (currentAccumulator ? "\n\n" : "") + para;
    } else {
      // Push accumulated chunk
      if (currentAccumulator.trim()) {
        chunks.push({
          chunkIndex: chunkIndex++,
          content: currentAccumulator.trim(),
          docType,
          charCount: currentAccumulator.trim().length,
          sectionHeader: currentHeader || undefined,
        });
      }
      currentAccumulator = para;
    }
  }

  if (currentAccumulator.trim()) {
    chunks.push({
      chunkIndex: chunkIndex++,
      content: currentAccumulator.trim(),
      docType,
      charCount: currentAccumulator.trim().length,
      sectionHeader: currentHeader || undefined,
    });
  }

  return chunks;
}
