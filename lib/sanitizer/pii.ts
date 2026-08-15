import { PiiSanitizationResult } from "../types/evaluation";

/**
 * Robust, privacy-first PII Sanitizer.
 * Redacts personal identifiers (Email, Phone, Names, Physical Address)
 * while strictly preserving developer credentials (GitHub, LinkedIn, Portfolio links).
 */
export function sanitizeResumePII(rawText: string): PiiSanitizationResult {
  if (!rawText || typeof rawText !== "string") {
    return {
      sanitizedText: "",
      redactedCount: 0,
      detectedEntities: [],
      preservedLinks: [],
    };
  }

  const detectedEntities: Array<{
    type: "email" | "phone" | "name" | "address";
    originalMasked: string;
  }> = [];
  const preservedLinks: string[] = [];

  // Step 1: Temporarily protect developer links with safe placeholders
  const linkPlaceholders: Map<string, string> = new Map();
  let linkCounter = 0;

  // Regex to match URLs and developer links
  const urlPattern =
    /\bhttps?:\/\/[^\s<>"{}|\\^`]+|\b(?:github\.com|linkedin\.com\/in|gitlab\.com|bitbucket\.org|twitter\.com|x\.com)\/[^\s<>"{}|\\^`]+|\b[a-zA-Z0-9-]+\.(?:dev|io|tech|me|app|portfolio)\b/gi;

  let text = rawText.replace(urlPattern, (match) => {
    const placeholder = `__PRESERVED_LINK_${linkCounter++}__`;
    linkPlaceholders.set(placeholder, match);
    if (!preservedLinks.includes(match)) {
      preservedLinks.push(match);
    }
    return placeholder;
  });

  // Step 2: Redact Emails
  const emailPattern =
    /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;
  text = text.replace(emailPattern, (email) => {
    const masked = email.length > 4 ? `${email.slice(0, 2)}***@***` : "***@***";
    detectedEntities.push({ type: "email", originalMasked: masked });
    return "[REDACTED_EMAIL]";
  });

  // Step 3: Redact Phone numbers (international, domestic, parentheses, dashes, dots)
  const phonePattern =
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b|\b\+?\d{1,4}[-.\s]?\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g;
  text = text.replace(phonePattern, (phone) => {
    // Avoid false-positive matching single numbers or years like 2020-2024
    if (/^\d{4}[-–]\d{4}$/.test(phone.trim())) {
      return phone; // Year range like 2021-2024
    }
    const cleanDigits = phone.replace(/\D/g, "");
    if (cleanDigits.length < 7 || cleanDigits.length > 15) {
      return phone;
    }
    const masked = phone.length > 4 ? `${phone.slice(0, 3)}****${phone.slice(-2)}` : "******";
    detectedEntities.push({ type: "phone", originalMasked: masked });
    return "[REDACTED_PHONE]";
  });

  // Step 4: Redact Physical Street Addresses / Postal lines
  const addressPattern =
    /\b\d{1,5}\s+[A-Za-z0-9.\s]{3,25}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Apartment|Apt|Suite|Ste)\b[^\n,]*?(?:,\s*[A-Za-z\s]+)?(?:\s+\d{5}(?:-\d{4})?)?/gi;
  text = text.replace(addressPattern, (addr) => {
    detectedEntities.push({ type: "address", originalMasked: "[STREET_ADDRESS]" });
    return "[REDACTED_ADDRESS]";
  });

  // Step 5: Heuristic Name Masking in Resume Headers
  // Often the first non-empty line or "Name: John Doe" is the candidate name
  const lines = text.split("\n");
  let headerScanned = 0;
  for (let i = 0; i < lines.length && headerScanned < 5; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    headerScanned++;

    // "Name: Jane Doe" format
    if (/^name\s*:\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/i.test(line)) {
      lines[i] = line.replace(/^name\s*:\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/i, "Name: [CANDIDATE_NAME]");
      detectedEntities.push({ type: "name", originalMasked: "Candidate Name" });
      continue;
    }

    // First line standalone Name (e.g. "Alex Mercer" or "Sarah J. Connor")
    if (
      headerScanned === 1 &&
      /^[A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?$/.test(line) &&
      !/^(resume|curriculum|cv|summary|objective|software|engineer|developer|profile)$/i.test(line)
    ) {
      lines[i] = "[CANDIDATE_NAME]";
      detectedEntities.push({ type: "name", originalMasked: "Header Name" });
    }
  }
  text = lines.join("\n");

  // Step 6: Restore preserved developer links
  for (const [placeholder, originalUrl] of linkPlaceholders.entries()) {
    text = text.replaceAll(placeholder, originalUrl);
  }

  return {
    sanitizedText: text,
    redactedCount: detectedEntities.length,
    detectedEntities,
    preservedLinks,
  };
}
