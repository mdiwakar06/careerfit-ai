import { CandidatePreferences } from "../types/evaluation";

export interface PresetScenario {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  roleTitle: string;
  companyName: string;
  preferences: CandidatePreferences;
  resumeText: string;
  jobDescriptionText: string;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "senior_backend",
    name: "Senior Backend → High Scaleup",
    badge: "Standard Match",
    badgeColor: "bg-[#e8f4f1] text-[#12715b] border-[#12715b]/30",
    description: "Senior Distributed Engineer matching well on stack and seniority.",
    roleTitle: "Senior Distributed Systems Engineer",
    companyName: "CloudScale Technologies",
    preferences: {
      targetOrgType: "growth_scaleup",
      primaryCareerGoal: "technical_depth",
      redFlagsToAvoid: ["micromanagement", "legacy_tech"],
      customNotes: "Interested in high-throughput data pipelines and mentoring junior engineers.",
    },
    resumeText: `John Doe
Email: john.doe@email.com | Phone: 415-555-0199
GitHub: https://github.com/johndoe | LinkedIn: https://linkedin.com/in/johndoe

Summary:
Senior Software Engineer with 7+ years of experience designing and scaling fault-tolerant distributed backends, microservices, and high-throughput real-time APIs.

Experience:
Senior Software Engineer | HighThroughput Cloud Inc (2021 - Present)
- Designed and maintained distributed microservices serving 4.2M daily requests using Go, TypeScript, and PostgreSQL.
- Optimized database query indexing and caching layers, cutting P99 latency from 180ms to 42ms.
- Authored 12 RFCs and spearheaded the migration from monolith to Kubernetes-orchestrated services.
- Mentored 5 mid-level engineers through system design and code quality reviews.

Software Engineer | Apex FinTech Labs (2018 - 2021)
- Built real-time ledger settlement pipelines processing $12M daily transaction volume using Node.js and Redis.
- Implemented Kafka event streaming pipelines with guaranteed exactly-once processing semantics.
- Streamlined CI/CD deployment pipelines using GitHub Actions, reducing build duration by 35%.

Skills:
Languages: Go, TypeScript, Python, SQL
Infrastructure: Kubernetes, Docker, AWS (ECS, RDS, S3), Kafka, Redis, PostgreSQL
Methodologies: Distributed System Design, Microservices, CI/CD, Observability (OpenTelemetry, Prometheus)`,
    jobDescriptionText: `Company: CloudScale Technologies
Position: Senior Distributed Systems Engineer
Location: Remote (US / Global)

About the Role:
CloudScale Technologies is looking for a Senior Distributed Systems Engineer to scale our next-generation data infrastructure. You will own mission-critical services that ingest billions of events weekly.

Requirements:
- 5+ years of production experience building distributed backend systems in Go, TypeScript, or Rust.
- Deep expertise in PostgreSQL performance optimization, indexing strategies, and caching layers (Redis).
- Hands-on experience with Kafka or distributed message queues.
- Strong track record of technical ownership, writing architectural RFCs, and mentoring team members.
- Experience with Kubernetes and cloud environments (AWS/GCP).

Culture & Benefits:
- High engineering autonomy and blameless post-mortem culture.
- Async-first communication with flexible working hours.
- Competitive compensation, equity, and comprehensive health coverage.`,
  },
  {
    id: "fresher_to_staff",
    name: "Junior Fresher → Staff Architect",
    badge: "Seniority Deficit Gap",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    description: "Entry-level college grad applying for a Staff Lead Architect role.",
    roleTitle: "Staff Distributed Systems Architect",
    companyName: "Enterprise Global Infra",
    preferences: {
      targetOrgType: "tech_enterprise",
      primaryCareerGoal: "rapid_growth",
      redFlagsToAvoid: ["legacy_tech"],
      customNotes: "Recent graduate eager to take on massive scale and architectural leadership.",
    },
    resumeText: `Alex Smith
Email: alex.smith.grad@gmail.com | Phone: 206-555-8765
GitHub: https://github.com/alexsmith-dev | LinkedIn: https://linkedin.com/in/alexsmith-cs

Education:
B.S. Computer Science, University of Washington (Graduated June 2025) - GPA: 3.8

Projects & Internships:
Software Engineering Intern | Campus Tech Services (Summer 2024)
- Built an academic course registration portal using React, Node.js, and MongoDB.
- Created REST endpoints for student login and class enrollment for 2,500 active campus users.
- Wrote basic unit tests using Jest achieving 70% code coverage.

Capstone Project | ChatWave Real-Time Messenger (2025)
- Developed a web chat application using Next.js, WebSockets, and Tailwind CSS.
- Implemented user authentication with Firebase Auth.
- Hosted on Vercel free tier with 50 test users.

Skills:
JavaScript, TypeScript, React, Node.js, Express, HTML/CSS, Git, MongoDB, Firebase`,
    jobDescriptionText: `Company: Enterprise Global Infra
Position: Staff Distributed Systems Architect
Location: Seattle, WA / Hybrid

Role Overview:
We are seeking a Staff Distributed Systems Architect with 8-12+ years of battle-tested engineering leadership. You will define the multi-year architecture across 40+ engineering squads, overseeing systems that handle 500,000 requests per second with strict five-nines (99.999%) SLA availability.

Key Responsibilities:
- Lead cross-org technical RFCs, multi-region failover protocols, and consensus engine architectures (Raft, Paxos).
- Partner with VP of Engineering and Principal Architects on global infrastructure roadmaps.
- Conduct deep kernel, network, and database latency profiling at ultra-high concurrency.
- Drive engineering mentorship and promotion calibration across 120+ senior engineers.

Required Qualifications:
- 8+ years of production experience leading distributed systems architectures.
- Proven track record designing multi-region active-active cloud topologies.
- Deep expertise in distributed databases (Cassandra, Spanner, CockroachDB), Linux kernel tuning, and hardware optimization.
- Recognized industry leadership or significant open-source contributions.`,
  },
  {
    id: "staff_to_junior",
    name: "Staff Principal → Junior Web Dev",
    badge: "Overqualification Risk",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    description: "12-year Principal Architect applying for Junior Frontend Web Developer.",
    roleTitle: "Junior Frontend Web Developer",
    companyName: "Local Creative Agency",
    preferences: {
      targetOrgType: "services_consulting",
      primaryCareerGoal: "work_life_balance",
      redFlagsToAvoid: ["chaotic_oncall", "unclear_strategy"],
      customNotes: "Looking for low-stress execution work without leadership or on-call responsibilities.",
    },
    resumeText: `Sarah Jenkins
Email: sarah.jenkins.staff@enterprise.io | Phone: 650-555-4321
GitHub: https://github.com/sjenkins-arch | LinkedIn: https://linkedin.com/in/sarahjenkins-staff

Summary:
Principal Architect & Staff Technical Lead with 12+ years designing distributed cloud architectures, leading organizations of 80+ engineers, and optimizing $14M annual AWS infrastructure budgets.

Experience:
Principal Systems Architect | MegaCloud Enterprise (2019 - Present)
- Directed global multi-cloud architecture across 18 data centers, ensuring 99.999% uptime for 60M daily active users.
- Re-architected company-wide streaming telemetry, saving $3.2M in annual cloud infrastructure compute.
- Chaired the Architecture Review Board, reviewing 150+ company-wide RFCs per year.

Senior Staff Engineer | Nexus Distributed Networks (2014 - 2019)
- Led a 25-person core infrastructure engineering org building distributed key-value storage engines.
- Authored foundational microservice frameworks in Go, Java, and TypeScript used by 400+ developers.

Skills:
Distributed Architecture, Kubernetes, Go, TypeScript, React, Multi-Region Cloud, Rust, System Design, Executive Strategy`,
    jobDescriptionText: `Company: Local Creative Agency
Position: Junior Frontend Web Developer
Experience Level: Entry-Level (0-2 years)

About the Job:
We are looking for a Junior Frontend Web Developer to help build client landing pages, update WordPress themes, and implement simple UI components using HTML, CSS, and basic JavaScript.

Responsibilities:
- Convert Figma mockups into clean, responsive HTML/CSS/JavaScript.
- Fix minor layout bugs across client marketing websites.
- Assist senior developers with simple React components.

Requirements:
- 0-2 years of experience with HTML, CSS, and JavaScript.
- Familiarity with Git, responsive web design, and Figma.
- Strong willingness to learn and follow established junior task guidelines.`,
  },
  {
    id: "ds_to_swe",
    name: "Data Scientist → Backend Lead",
    badge: "Cross-Domain Pivot",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    description: "Senior ML/Data Scientist pivoting to Production Backend & DevOps Lead.",
    roleTitle: "Backend Infrastructure & DevOps Lead",
    companyName: "DataGrid Systems",
    preferences: {
      targetOrgType: "product_startup",
      primaryCareerGoal: "technical_depth",
      redFlagsToAvoid: ["legacy_tech"],
      customNotes: "Transitioning from statistical modeling into high-throughput production infrastructure engineering.",
    },
    resumeText: `Dr. Marcus Vance
Email: marcus.vance.phd@datascience.org | Phone: 617-555-9012
GitHub: https://github.com/mvance-ml | LinkedIn: https://linkedin.com/in/marcusvance-phd

Summary:
Senior Data Scientist with 6 years experience building predictive machine learning models, statistical ETL pipelines, and NLP algorithms in Python, PyTorch, and SQL.

Experience:
Senior Data Scientist | BioMetric Analytics (2021 - Present)
- Developed deep learning predictive models using PyTorch, scikit-learn, and XGBoost on 100M+ medical records.
- Built automated data analysis pipelines in Jupyter Notebooks and pandas.
- Collaborated with business stakeholders to present statistical insights and KPI dashboards in Tableau.

Data Scientist | FinMetric Labs (2018 - 2021)
- Formulated fraud detection algorithms using Python and SQL, improving anomaly detection precision by 18%.
- Processed batch data transformations using PySpark and AWS EMR.

Skills:
Python, PyTorch, TensorFlow, Pandas, NumPy, SQL, Jupyter, Tableau, Statistics, Machine Learning, A/B Testing`,
    jobDescriptionText: `Company: DataGrid Systems
Position: Backend Infrastructure & DevOps Lead
Location: Austin, TX / Remote

About the Role:
DataGrid is looking for a Backend Infrastructure & DevOps Lead to architect our real-time streaming ingestion pipeline and automate multi-cloud Kubernetes deployments.

Key Requirements:
- 5+ years building high-throughput production backend services in Go or Rust.
- Deep expertise in Kubernetes cluster administration, Helm charts, and Terraform Infrastructure-as-Code.
- Production experience with PostgreSQL database query optimization, connection pooling (PgBouncer), and distributed locks.
- Mastery of CI/CD pipeline automation, Docker container security, and Prometheus/Grafana alerting.
- On-call rotation leadership and incident post-mortem governance.`,
  },
  {
    id: "culture_mismatch",
    name: "Senior SWE → Micromanaged Agency",
    badge: "Culture Mismatch Radar",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
    description: "High-autonomy engineer with exact tech match applying to a rigid, 24/7 on-call agency.",
    roleTitle: "Senior Full-Stack Engineer",
    companyName: "RapidFire Client Agency",
    preferences: {
      targetOrgType: "growth_scaleup",
      primaryCareerGoal: "work_life_balance",
      redFlagsToAvoid: ["micromanagement", "chaotic_oncall", "legacy_tech"],
      customNotes: "I prioritize healthy work-life balance, high autonomy, and sustainable engineering sprints.",
    },
    resumeText: `David Kim
Email: david.kim.dev@gmail.com | Phone: 212-555-7890
GitHub: https://github.com/dkim-fullstack | LinkedIn: https://linkedin.com/in/davidkim-tech

Summary:
Senior Full-Stack Engineer with 6 years building modern React, TypeScript, and Node.js applications. Strong advocate for clean architecture, automated testing, and autonomous sprint ownership.

Experience:
Senior Full-Stack Engineer | CalmTech SaaS (2020 - Present)
- Built web applications using Next.js, React, Node.js, and PostgreSQL.
- Maintained 90%+ unit and integration test coverage with zero off-hours emergencies.
- Championed 2-week predictable sprint cycles with asynchronous standups.

Skills:
React, Next.js, TypeScript, Node.js, PostgreSQL, GraphQL, Docker, Tailwind CSS, Jest`,
    jobDescriptionText: `Company: RapidFire Client Agency
Position: Senior Full-Stack Engineer

Job Description:
RapidFire Agency builds mission-critical applications for demanding global clients with aggressive daily turnarounds. We are looking for an ultra-hardworking engineer ready to grind and ship fast.

Responsibilities:
- Log exact hourly time tracking across 6-8 concurrent client projects daily.
- Attend mandatory 9:00 AM, 1:00 PM, and 6:00 PM daily progress status check-ins with client account managers.
- Participate in continuous 24/7 client emergency on-call paging with required 15-minute response times including weekends.
- Maintain legacy PHP and jQuery client systems alongside new React components.

Requirements:
- 5+ years experience in React, TypeScript, Node.js, and PostgreSQL.
- Extreme resilience under high stress and ability to work 55-65 hours weekly during launch crunch.`,
  },
];
