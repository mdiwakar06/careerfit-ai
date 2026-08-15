import { parseDocumentBuffer } from "../lib/parsers/document";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runParserTests() {
  console.log("\n🧪 Running SDET Test Suite: Document Parsers & Error Boundaries\n");

  // Test 1: Markdown text extraction
  const mdBuffer = Buffer.from("# Senior Engineer Resume\n\n- Built scalable REST APIs in TypeScript.");
  const mdResult = await parseDocumentBuffer(mdBuffer, "resume.md");
  assert(mdResult.fileType === "markdown", "Correctly identified markdown file type");
  assert(mdResult.text.includes("Senior Engineer Resume"), "Extracted markdown content accurately");
  assert(mdResult.wordCount > 5, "Word count computed accurately");

  // Test 2: Plain text extraction
  const txtBuffer = Buffer.from("Software Engineer with 4 years experience.");
  const txtResult = await parseDocumentBuffer(txtBuffer, "resume.txt");
  assert(txtResult.fileType === "text", "Correctly identified text file type");
  assert(txtResult.charCount === txtBuffer.length, "Accurate character count");

  // Test 3: Empty buffer error boundary
  let emptyErrorCaught = false;
  try {
    await parseDocumentBuffer(Buffer.from(""), "empty.txt");
  } catch {
    emptyErrorCaught = true;
  }
  assert(emptyErrorCaught, "Gracefully rejected empty document buffer");

  console.log("\n🎉 ALL DOCUMENT PARSER TESTS PASSED!\n");
}

runParserTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
