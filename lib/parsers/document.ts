import { extractText } from "unpdf";
import mammoth from "mammoth";

export interface ParsedDocumentResult {
  text: string;
  charCount: number;
  wordCount: number;
  fileName: string;
  fileType: "pdf" | "docx" | "markdown" | "text" | "unknown";
  detectedEncoding: string;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

/**
 * Universal document parsing engine for PDF, DOCX, Markdown, and TXT files.
 * Provides safe buffer handling and descriptive error boundaries.
 */
export async function parseDocumentBuffer(
  buffer: Buffer,
  fileName: string
): Promise<ParsedDocumentResult> {
  if (!buffer || buffer.length === 0) {
    throw new Error("Uploaded document buffer is empty.");
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File size exceeds 10MB limit. Uploaded file size is ${(
        buffer.length /
        (1024 * 1024)
      ).toFixed(2)}MB.`
    );
  }

  const lowerName = fileName.toLowerCase();
  let extractedText = "";
  let fileType: ParsedDocumentResult["fileType"] = "unknown";

  try {
    if (lowerName.endsWith(".pdf")) {
      fileType = "pdf";
      const uint8 = new Uint8Array(buffer);
      const parsed = await extractText(uint8);
      extractedText = Array.isArray(parsed.text)
        ? parsed.text.join("\n\n")
        : parsed.text || "";
    } else if (lowerName.endsWith(".docx")) {
      fileType = "docx";
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value || "";
    } else if (lowerName.endsWith(".md") || lowerName.endsWith(".markdown")) {
      fileType = "markdown";
      extractedText = buffer.toString("utf-8");
    } else if (lowerName.endsWith(".txt") || lowerName.endsWith(".rtf")) {
      fileType = "text";
      extractedText = buffer.toString("utf-8");
    } else {
      // Fallback: Attempt UTF-8 text decode
      fileType = "text";
      extractedText = buffer.toString("utf-8");
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Failed to parse ${fileType.toUpperCase()} file "${fileName}": ${errorMsg}. Please ensure the file is not password-protected or corrupted.`
    );
  }

  // Normalize Unicode, remove null characters, trim whitespace
  const normalizedText = extractedText
    .replace(/\0/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();

  if (normalizedText.length === 0) {
    throw new Error(
      `No readable text could be extracted from "${fileName}". If this is a scanned PDF image, please provide a text-based PDF or copy-paste the text directly.`
    );
  }

  const words = normalizedText.split(/\s+/).filter(Boolean);

  return {
    text: normalizedText,
    charCount: normalizedText.length,
    wordCount: words.length,
    fileName,
    fileType,
    detectedEncoding: "utf-8",
  };
}
