import OpenAI from "openai";

const apiKey = process.env.OPENROUTER_API_KEY || "";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey,
  defaultHeaders: {
    "HTTP-Referer": "https://careerfit-ai-studio.vercel.app",
    "X-Title": "CareerFit AI Studio",
  },
});

const candidateFreeModels = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemini-2.0-flash-thinking-exp:free",
  "google/gemini-2.0-flash-exp:free",
  "deepseek/deepseek-r1:free",
  "deepseek/deepseek-chat:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "google/gemma-4-31b-it:free",
  "mistralai/mistral-small-24b-instruct-2501:free",
  "qwen/qwen-2.5-coder-32b-instruct:free",
];

async function benchmarkModels() {
  console.log("🔍 Benchmarking OpenRouter Free Models for Critical Career Intelligence...\n");

  const testPrompt = `You are a strict FAANG Bar Raiser technical hiring manager. Evaluate this candidate for a Staff Distributed Systems Engineer role:
Candidate: Recent B.S. CS grad with 1 internship in React/Node, academic projects in MongoDB.
Required: 8+ years leading Raft/Paxos consensus, multi-region failover, 500k RPS.

Provide a calibrated match score (0-10) and 1-sentence brutally honest justification in JSON format: {"score": number, "justification": string}`;

  for (const model of candidateFreeModels) {
    const start = Date.now();
    process.stdout.write(`Testing [${model}]... `);
    try {
      const response = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: testPrompt }],
        temperature: 0.1,
      });
      const duration = ((Date.now() - start) / 1000).toFixed(2);
      const content = response.choices[0]?.message?.content || "";
      console.log(`✅ Success in ${duration}s`);
      console.log(`   Response snippet: ${content.substring(0, 140).replace(/\n/g, " ")}\n`);
    } catch (err: any) {
      const duration = ((Date.now() - start) / 1000).toFixed(2);
      console.log(`❌ Failed (${duration}s): ${err?.message || String(err)}\n`);
    }
  }
}

benchmarkModels();
