import { CandidatePreferences } from "../types/evaluation";

export interface SampleProfile {
  name: string;
  roleTitle: string;
  companyName: string;
  resumeText: string;
  jobDescriptionText: string;
  preferences: CandidatePreferences;
}

export const SAMPLE_BACKEND_PROFILE: SampleProfile = {
  name: "Senior Backend Engineer Sample",
  roleTitle: "Senior Distributed Systems Engineer",
  companyName: "Stripe",
  resumeText: `Alex Mercer
alex.mercer.dev@gmail.com | +1 (415) 892-4910 | San Francisco, CA
GitHub: https://github.com/alexmercer-dev | LinkedIn: https://linkedin.com/in/alexmercer-eng | Portfolio: https://alexmercer.dev

PROFESSIONAL SUMMARY
Senior Software Engineer with 6+ years of experience building high-throughput distributed backend services, event-driven payment pipelines, and high-availability database architectures in Go and TypeScript.

TECHNICAL SKILLS
Languages: Go, TypeScript, Python, SQL, Rust (familiar)
Databases & Storage: PostgreSQL, Redis, DynamoDB, CockroachDB, Kafka
Cloud & Infrastructure: AWS (ECS, Lambda, S3, RDS), Kubernetes, Docker, Terraform, Datadog
Architecture: Distributed Systems, Microservices, Event-Driven Architecture, CQRS, API Gateway

EXPERIENCE
Staff Backend Engineer | FinScale Technologies (2022 - Present)
- Responsible for building backend REST APIs and improving database performance for core ledger systems.
- Worked on migrating payment settlement pipeline to Kafka event streaming.
- Improved CI/CD pipelines and fixed build issues for 30 engineers.
- Designed idempotency layer across multi-region transaction processing services.

Senior Software Engineer | CloudNova Solutions (2019 - 2022)
- Built microservices in Go and Node.js for real-time risk evaluation engine.
- Optimized slow database queries in PostgreSQL to prevent connection starvation.
- Implemented rate limiting and token bucket algorithms at API gateway layer.
- Participated in bi-weekly on-call rotations and resolved production incidents.

EDUCATION
B.S. in Computer Science | University of California, Berkeley (2015 - 2019)
`,
  jobDescriptionText: `Company: Stripe
Role: Senior Distributed Systems Engineer - Payments Platform
Location: San Francisco, CA / Remote

About the Team:
Stripe builds economic infrastructure for the internet. The Payments Infrastructure team is responsible for architecting the core settlement, authorization, and ledger systems that process hundreds of billions of dollars annually.

What You'll Do:
- Design, build, and maintain high-throughput, low-latency distributed services in Go and Java.
- Architect idempotent transaction pipelines with sub-50ms latency SLAs and 99.999% availability.
- Scale our distributed database layers across PostgreSQL, CockroachDB, and Redis.
- Author technical RFCs, collaborate on cross-functional architecture reviews, and mentor engineers.

Qualifications:
- 5+ years of production experience building and operating distributed backend systems.
- Strong proficiency in Go, Java, or C++, with deep knowledge of concurrency and networking.
- Proven experience with distributed consensus, ACID transactions, and high-volume data streams (Kafka).
- Experience with infrastructure-as-code and production telemetry (Prometheus, Datadog).
- B.S. in Computer Science or equivalent practical experience.
`,
  preferences: {
    targetOrgType: "growth_scaleup",
    primaryCareerGoal: "technical_depth",
    redFlagsToAvoid: ["micromanagement", "legacy_tech"],
    customNotes: "Excited about distributed consistency, consensus algorithms, and high-throughput systems.",
  },
};

export const SAMPLE_STAFF_FULLSTACK_PROFILE: SampleProfile = {
  name: "Staff Full-Stack Engineer Sample",
  roleTitle: "Staff Full-Stack AI Product Engineer",
  companyName: "Cognition AI",
  resumeText: `Elena Vance
elena.vance.ai@outlook.com | +1 (206) 431-7788 | Seattle, WA
GitHub: https://github.com/elenavance-code | LinkedIn: https://linkedin.com/in/elenavance-ai | Portfolio: https://elenavance.io

SUMMARY
Staff Full-Stack Engineer with 8+ years leading cross-functional teams building AI-native developer tools, high-performance web applications, and real-time streaming architectures.

SKILLS
Frontend: React, Next.js, TypeScript, TailwindCSS, WebSockets, Web Workers, WASM
Backend: Node.js, Python (FastAPI), Go, GraphQL, PostgreSQL, pgvector, Redis
AI & Agents: OpenAI API, Anthropic SDK, LangChain, semantic embeddings, prompt engineering
DevOps: Docker, AWS, Cloudflare Workers, Vercel, GitHub Actions

WORK EXPERIENCE
Staff Full-Stack Engineer | DevStream AI (2021 - Present)
- Worked with frontend team to modernize legacy components to React and Next.js.
- Implemented streaming LLM chat interface with optimistic updates and local caching.
- Led technical RFC for agentic code execution sandbox using Docker and Firecracker VMs.
- Mentored 6 mid-level engineers across product engineering squads.

Lead Full-Stack Developer | Nexus Labs (2018 - 2021)
- Built interactive analytics dashboards visualizing millions of user events.
- Created real-time collaborative code editor with Operational Transformation and WebSockets.
- Reduced build times with Turborepo and parallelized testing matrices.

EDUCATION
B.S. in Software Engineering | University of Washington (2014 - 2018)
`,
  jobDescriptionText: `Company: Cognition AI
Role: Staff Full-Stack AI Product Engineer
Location: San Francisco, CA / Remote

About Us:
We are building the future of software engineering with autonomous AI colleagues. We iterate with extreme speed, high engineering autonomy, and minimal bureaucracy.

Responsibilities:
- Own end-to-end full-stack architectures from Next.js user interfaces to backend Python/Go orchestration engines.
- Build real-time streaming interfaces, interactive canvas workspaces, and developer tools.
- Optimize client-side rendering performance (LCP, INP) for heavy multi-modal AI interactions.
- Drive rapid 0-to-1 product exploration while maintaining rigorous code quality.

Requirements:
- 7+ years of experience shipping production web applications with Next.js, React, and TypeScript.
- Strong full-stack capabilities with Python or Go backends and relational/vector databases.
- Experience with LLM APIs, prompt engineering, structured JSON generation, and agentic workflows.
- Strong product instinct and track record of driving user-facing features from concept to release.
`,
  preferences: {
    targetOrgType: "product_startup",
    primaryCareerGoal: "rapid_growth",
    redFlagsToAvoid: ["micromanagement", "unclear_strategy"],
    customNotes: "Looking for high autonomy 0-to-1 product impact with modern Next.js and AI tech stacks.",
  },
};
