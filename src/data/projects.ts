export interface Project {
  slug: string;
  title: string;
  type: string;
  category: string;
  status: "Live" | "Completed";
  year: number;
  tagline: string;
  engineeringSummary: string;
  metrics: string[];
  dataFlow?: string;
  stack: string[];
  github?: string;
  liveUrl?: string;
  overview: string;
  problem: string;
  solution: string;
  architecture: string[];
  engineeringDecisions: string[];
  scalingStrategy?: string[];
  highlights: string[];
}

export const allProjects: Project[] = [
  {
    slug: "flowforge",
    title: "FlowForge: Distributed Workflow Orchestration Platform",
    type: "Layer A",
    category: "Distributed Systems",
    status: "Live",
    year: 2026,
    tagline: "DAG workflow engine with crash-safe Postgres leasing, retries, and resumable checkpoints",
    engineeringSummary:
      "Built a DAG workflow orchestrator: a Spring Boot control plane validates and schedules multi-step jobs, and horizontally scaled Go workers lease tasks from PostgreSQL with FOR UPDATE SKIP LOCKED — no separate message broker — with retries, timeouts, and durable checkpoints.",
    metrics: ["🔒 SKIP LOCKED Leasing", "♻️ Resume From Checkpoints", "📈 41 runs/s Local Load Test"],
    dataFlow: "DAG Definition → Validator (Kahn) → PostgreSQL READY Queue → Go Worker Lease → Checkpoint → Promote Downstream",
    stack: ["Java 21", "Spring Boot", "Go", "PostgreSQL", "React", "Docker", "Kubernetes"],
    github: "https://github.com/SHIVAMCP18/Flowforge",
    liveUrl: "https://flowforge-eosin.vercel.app",
    overview:
      "FlowForge runs multi-step jobs defined as dependency graphs (DAGs). A stateless Java control plane owns scheduling state in PostgreSQL; Go workers pull tasks, run them as shell commands with their upstream outputs injected as environment variables, and report back. A React dashboard visualizes runs live, and a built-in simulator lets the demo run entirely in the browser.",
    problem:
      "Job pipelines need to survive worker crashes, retries, and partial failures without losing state or re-running expensive completed steps — and adding a broker like Kafka or Redis just for task distribution adds infrastructure to operate.",
    solution:
      "Kept PostgreSQL as the single source of truth: workers lease READY tasks with FOR UPDATE SKIP LOCKED, every state transition is a transactional write, a lease reaper reclaims tasks from dead workers, and each task's output is checkpointed so failed or cancelled runs can resume without redoing succeeded tasks.",
    architecture: [
      "Control plane validates each DAG with a level-by-level Kahn's topological sort, rejecting cycles, unknown dependencies, and duplicates, and returns an execution plan of parallel stages.",
      "Starting a run materialises one task row per node; tasks without dependencies become READY, the rest wait as PENDING.",
      "Go workers poll `/lease`; the control plane claims a READY row with FOR UPDATE SKIP LOCKED so concurrent workers and replicas never double-lease.",
      "Workers run the command with a hard timeout (killing the whole process group) and expose run context and upstream outputs as FLOWFORGE_* environment variables.",
      "Completion checkpoints the output and promotes downstream tasks; failures retry with backoff, then cascade SKIPPED to dependents.",
      "A scheduled lease reaper reclaims tasks from crashed workers; late callbacks on reclaimed leases are rejected with 409.",
      "React dashboard renders the live DAG, a Gantt timeline, and a workflow builder with instant validation.",
    ],
    engineeringDecisions: [
      "Used Postgres row locking (SKIP LOCKED) instead of Kafka or Redis for task distribution, keeping the infrastructure to one database while staying safe under concurrent workers.",
      "Made the control plane stateless so replicas scale behind a load balancer and a crashed instance loses nothing.",
      "Checkpointed every task's output so runs can be resumed from the point of failure rather than restarted.",
      "Chose pull-based leasing so worker pods scale via a Kubernetes HPA with zero coordination.",
    ],
    highlights: [
      "Crash-safe leasing with FOR UPDATE SKIP LOCKED and a lease reaper",
      "Retries with backoff, timeouts, cascade skip, cancel, and resume-from-checkpoint",
      "Upstream task outputs passed to commands as environment variables",
      "Live DAG dashboard with animated data flow, timeline, and workflow builder",
      "Scheduler integration tests against real PostgreSQL and a Go load-test harness",
    ],
  },
  {
    slug: "streaming-analytics-pipeline",
    title: "Real-Time Streaming Analytics Pipeline",
    type: "Layer A",
    category: "Data Engineering",
    status: "Live",
    year: 2026,
    tagline: "Ultra-low latency clickstream ingestion & real-time analytics with Apache Beam",
    engineeringSummary:
      "Engineered an enterprise streaming pipeline on GCP processing e-commerce event streams via Pub/Sub, Dataflow (Apache Beam), BigQuery for analytical queries, and Bigtable for millisecond serving.",
    metrics: ["⚡ 50k+ Events/sec", "⏱️ <100ms Ingestion", "📊 Dual-Sink Architecture"],
    dataFlow: "Clickstream Source → GCP Pub/Sub → Dataflow (Beam Windowing) → BigQuery (OLAP) & Bigtable (KV)",
    stack: ["GCP Pub/Sub", "Dataflow (Apache Beam)", "BigQuery", "Bigtable", "Python", "Java"],
    github: "https://github.com/SHIVAMCP18/realtime-streaming-pipeline",
    overview:
      "A scalable cloud streaming data pipeline tailored for high-volume e-commerce user behavior analysis, live metric aggregation, and anomaly alerting.",
    problem:
      "Batch processing creates delayed intelligence for critical metrics like inventory exhaustion, dynamic pricing shifts, and user fraud spikes.",
    solution:
      "Built a continuous event-streaming architecture utilizing Apache Beam on Google Cloud Dataflow with tumbling and sliding windows, late-arriving data triggers, and dead-letter queues.",
    architecture: [
      "Pub/Sub acts as the fronting buffer capable of ingesting bursty clickstream traffic.",
      "Dataflow executes stateful stream computations, event deduplication, and schema validation.",
      "Bigtable serves sub-10ms user-profile and session aggregations for live personalization.",
      "BigQuery partitions long-term streaming data for BI dashboards and historical analysis.",
      "Dead-letter queues isolate malformed payloads for automated review without stalling the stream.",
    ],
    engineeringDecisions: [
      "Split outputs across Bigtable (low-latency lookup) and BigQuery (SQL analytics) for optimal cost and performance.",
      "Configured allowed lateness and watermark tracking in Apache Beam to handle out-of-order mobile events.",
    ],
    highlights: [
      "End-to-end stream windowing and aggregation",
      "Dead-letter queue isolation for schema drift",
      "Integrated with GCP monitoring & alerting",
    ],
  },
  {
    slug: "voiceiq-enterprise",
    title: "Customer Intelligence Platform (VoiceIQ Enterprise)",
    type: "Layer A",
    category: "Full-Stack / AI",
    status: "Live",
    year: 2026,
    tagline: "Enterprise feedback aggregation with RAG semantic search using Llama 3 & pgvector",
    engineeringSummary:
      "Full-stack Next.js and TypeScript application centralizing surveys, customer reviews, and support tickets into an AI-powered intelligence workflow featuring pgvector semantic search and Llama 3 synthesis.",
    metrics: ["🧠 Llama 3 + pgvector", "⚡ Sub-second Search", "📈 Automated Sentiment"],
    dataFlow: "Feedback Feeds → Chunking & Embedding → PostgreSQL + pgvector → RAG Context Assembly → Llama 3 Summary",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "Redis", "Llama 3", "pgvector", "Tailwind CSS"],
    github: "https://github.com/SHIVAMCP18/Customer-Intelligence-Platform",
    liveUrl: "https://frontend-production-b159.up.railway.app",
    overview:
      "VoiceIQ unifies fragmented customer interactions from multiple channels into a single actionable dashboard, utilizing vector search and Large Language Models to diagnose sentiment trends and feature requests.",
    problem:
      "Customer sentiment data is scattered across ZenDesk tickets, App Store reviews, and Typeform surveys, making root-cause diagnosis of customer dissatisfaction slow and manual.",
    solution:
      "Built an automated ingestion platform that embeds customer feedback into PostgreSQL with pgvector, retrieves contextual clusters, and generates concise executive summaries via Llama 3.",
    architecture: [
      "Next.js App Router powers the reactive dashboard with server actions and streaming responses.",
      "pgvector performs cosine similarity indexing across high-dimensional text embeddings.",
      "Redis provides caching for frequent similarity queries and hot customer segments.",
      "Supabase provides granular row-level security (RLS) for multi-tenant data isolation.",
    ],
    engineeringDecisions: [
      "Used pgvector inside existing PostgreSQL infrastructure to eliminate the overhead of managing a separate vector database.",
      "Implemented asynchronous queue processing for embedding generation so user imports never stall the UI.",
    ],
    highlights: [
      "Context-aware RAG summarization engine",
      "Interactive semantic cluster exploration",
      "Real-time sentiment score trendlines",
    ],
  },
  {
    slug: "distributed-webhook-delivery",
    title: "Distributed Webhook Delivery Platform",
    type: "Layer A",
    category: "Distributed Systems",
    status: "Live",
    year: 2026,
    tagline: "High-concurrency webhook dispatcher with HMAC signing and exponential backoff",
    engineeringSummary:
      "Engineered an enterprise-grade webhook delivery infrastructure in Go and Java with Kafka event queues, Redis idempotency caching, and cryptographically verified payload delivery.",
    metrics: ["🔒 HMAC-SHA256 Signed", "⏱️ Exponential Backoff", "⚡ 10k+ Deliveries/min"],
    dataFlow: "Event Ingestion → Signature Generation → Kafka Queue → Dispatch Worker → HTTP Endpoint → Retry Scheduler",
    stack: ["Go", "Java", "Kafka", "PostgreSQL", "Redis", "Kubernetes", "Docker"],
    github: "https://github.com/SHIVAMCP18/distributed-webhook-platform",
    overview:
      "A mission-critical event delivery platform ensuring reliable, ordered, and authenticated webhook deliveries to external third-party consumer endpoints.",
    problem:
      "External subscriber servers experience intermittent downtime, rate limits, and slow response times, which can overwhelm dispatcher services and cause cascading failures.",
    solution:
      "Constructed a multi-tier delivery architecture with partitioned Kafka topics, non-blocking asynchronous HTTP dispatchers, HMAC-SHA256 signing, and Redis idempotency keys.",
    architecture: [
      "Ingestion API generates cryptographic HMAC signatures and assigns globally unique event IDs.",
      "Dispatch worker pools in Go utilize non-blocking connection pools and strict per-target rate limiting.",
      "Failed deliveries automatically schedule into staged exponential backoff delay queues.",
      "Redis records idempotency tokens to prevent duplicate deliveries during network retries.",
    ],
    engineeringDecisions: [
      "Utilized Go goroutines for lightweight concurrent HTTP clients handling thousands of active connections.",
      "Adopted tiered retry queues in Kafka rather than in-memory sleeps to guarantee resilience across node reboots.",
    ],
    highlights: [
      "Tamper-proof HMAC signature verification",
      "Dead-letter archiving with manual replay capability",
      "Granular delivery status telemetry",
    ],
  },
  {
    slug: "zentry-gaming-multiverse",
    title: "Zentry Gaming Multiverse Platform",
    type: "Layer A",
    category: "Full-Stack / AI",
    status: "Live",
    year: 2026,
    tagline: "Full-stack interactive gaming ecosystem with real-time AI voice assistant",
    engineeringSummary:
      "Developed a full-stack gaming hub featuring persistent player progression, interactive quests, WebSocket-based live interactions, and a real-time conversational voice assistant via Gemini Live API.",
    metrics: ["🎮 Real-time WebSockets", "🎙️ Gemini Live AI", "⚡ Sub-100ms Audio Stream"],
    dataFlow: "Browser Audio/Input → WebSocket Stream → FastAPI Hub → Gemini Live API → Dynamic Game State Updates",
    stack: ["React", "Tailwind CSS", "FastAPI", "Supabase", "WebSockets", "Gemini Live API", "Python"],
    github: "https://github.com/SHIVAMCP18/Gaming-Website",
    liveUrl: "https://gaming-we.netlify.app",
    overview:
      "An immersive gaming ecosystem bridging interactive WebGL animations, real-time multiplayer updates, and conversational AI companions that respond with voice and context-aware advice.",
    problem:
      "Most gaming portals lack responsive real-time multiplayer interactions and offer static text FAQs rather than immersive in-game intelligence.",
    solution:
      "Integrated full-duplex WebSocket streaming with FastAPI and Gemini Live API to enable instantaneous voice interaction with an in-game AI guide while synchronizing quest progression in Supabase.",
    architecture: [
      "React frontend delivers smooth 60fps animations with Tailwind styling and audio capture.",
      "FastAPI server acts as the orchestration gateway routing WebSocket streams to Gemini Live API.",
      "Supabase stores player profiles, quest completions, inventory states, and achievements.",
    ],
    engineeringDecisions: [
      "Used binary WebSockets for streaming bidirectional audio chunks to minimize latency.",
      "Implemented client-side optimistic UI updates for instant quest progression feedback.",
    ],
    highlights: [
      "Real-time bidirectional AI voice assistant",
      "Persistent quest progression and inventory engine",
      "Ultra-responsive interactive UI",
    ],
  },
  {
    slug: "lakehouse-platform",
    title: "Lakehouse Platform (Serverless Spark & Iceberg)",
    type: "Layer A",
    category: "Data Engineering",
    status: "Completed",
    year: 2025,
    tagline: "Scalable modern lakehouse using Apache Iceberg, Dataproc, and Cloud Composer",
    engineeringSummary:
      "Architected an automated Lakehouse processing petabyte-scale data lakes with Dataproc Serverless Spark, converting raw object storage into ACID-compliant Apache Iceberg tables governed by Dataplex.",
    metrics: ["🧊 Apache Iceberg", "⚡ Dataproc Serverless", "🔄 Automated DAGs"],
    dataFlow: "Cloud Storage Raw → Dataproc Spark Transformation → Apache Iceberg Tables → BigLake → BI Analytics",
    stack: ["Dataproc Serverless Spark", "Apache Iceberg", "BigLake", "Dataplex", "Cloud Composer", "GCP"],
    github: "https://github.com/SHIVAMCP18/gcp-lakehouse-iceberg",
    overview:
      "A next-generation cloud lakehouse architecture uniting the cost-efficiency of object storage with the transactional consistency and schema evolution capabilities of relational databases.",
    problem:
      "Raw data lakes in Cloud Storage suffer from lack of ACID transactions, difficult schema evolution, slow metadata queries, and high operational costs for standing compute clusters.",
    solution:
      "Implemented Apache Iceberg format on Google Cloud, orchestrated via Cloud Composer (Airflow) with ephemeral Dataproc Serverless Spark jobs that automatically spin up, process data, and shut down.",
    architecture: [
      "Cloud Composer executes scheduled DAG pipelines managing the ingest-to-publish lifecycle.",
      "Dataproc Serverless runs distributed Spark jobs without managing fixed VM infrastructure.",
      "Apache Iceberg provides ACID transactions, snapshot isolation, and partition pruning.",
      "Dataplex manages unified governance, cataloging, and data quality checks.",
    ],
    engineeringDecisions: [
      "Adopted Apache Iceberg over Parquet files to support in-place schema evolution and fast time-travel queries.",
      "Used Serverless Spark compute to reduce idle infrastructure costs to zero.",
    ],
    highlights: [
      "Zero-maintenance serverless compute architecture",
      "ACID transactional guarantees on cloud storage",
      "Granular data governance with Google Dataplex",
    ],
  },
  {
    slug: "coreinventory",
    title: "CoreInventory: Inventory Management System",
    type: "Layer B",
    category: "Full-Stack",
    status: "Completed",
    year: 2025,
    tagline: "Multi-tier warehouse inventory operations with 15+ REST APIs and CI/CD",
    engineeringSummary:
      "Designed and delivered a full-stack inventory platform featuring normalized PostgreSQL schemas, 15+ secure RESTful APIs, role-based access, and automated GitHub Actions CI/CD workflows.",
    metrics: ["📦 15+ REST APIs", "🛡️ RBAC Auth", "🚀 CI/CD Automated"],
    stack: ["Node.js", "Express.js", "React", "PostgreSQL", "REST APIs", "GitHub Actions"],
    github: "https://github.com/SHIVAMCP18/CoreInventory",
    liveUrl: "https://celadon-dusk-3e21f4.netlify.app",
    overview:
      "A comprehensive warehouse operations and stock tracking solution providing automated reordering alerts, transaction auditing, and detailed inventory reports.",
    problem:
      "Disjointed spreadsheets and manual counting lead to stock-outs, inventory discrepancies, and lack of real-time auditability across multiple warehouse locations.",
    solution:
      "Engineered a centralized system with transactional integrity in PostgreSQL, automated inventory reconciliation endpoints, and role-based permissions for warehouse staff.",
    architecture: [
      "Express.js backend with controller-service-repository pattern and input validation.",
      "PostgreSQL normalized database with foreign key constraints, indexes, and audit logs.",
      "React web portal with dynamic stock filtering, reporting charts, and batch updates.",
    ],
    engineeringDecisions: [
      "Enforced database-level transactions for all stock adjustments to eliminate race conditions.",
      "Integrated automated linting and integration testing via GitHub Actions on every pull request.",
    ],
    highlights: [
      "Real-time stock level alerts and replenishment triggers",
      "Normalized relational schema preventing orphaned records",
      "Full automated testing suite with GitHub Actions",
    ],
  },
  {
    slug: "shieldgate",
    title: "ShieldGate: Secure Document Sanitization Platform",
    type: "Layer B",
    category: "AI / Security",
    status: "Completed",
    year: 2025,
    tagline: "Automated PII detection and redaction across 7 file formats using NLP and OCR",
    engineeringSummary:
      "Engineered an automated document sanitization pipeline that inspects 7 file types (PDF, DOCX, CSV, etc.) for sensitive personally identifiable information (PII) using SpaCy NLP, Regex, and Tesseract OCR.",
    metrics: ["📄 7 File Formats", "🔍 NLP + OCR Redaction", "🔒 Zero-Leakage Pipeline"],
    stack: ["Python", "SpaCy NLP", "Tesseract OCR", "Supabase", "REST APIs", "FastAPI"],
    github: "https://github.com/SHIVAMCP18/Mined-Hackthon",
    liveUrl: "https://hackpro-edgzvyx3ogrbcavazubtpz.streamlit.app",
    overview:
      "ShieldGate automates data privacy compliance by scrubbing confidential customer records, social security numbers, medical identifiers, and contact details from legacy document archives.",
    problem:
      "Manual document redaction is error-prone, labor-intensive, and impractical when handling tens of thousands of legacy scanned files and text documents.",
    solution:
      "Built a hybrid extraction and redaction engine utilizing optical character recognition (OCR) for scanned images and deep-learning NER models (SpaCy) for unstructured text.",
    architecture: [
      "File parser determines MIME type and routes to specialized decoders (PDF, Word, Plaintext, Images).",
      "Tesseract extracts textual coordinates from scanned image layers.",
      "SpaCy and custom Regex patterns locate PII entities (names, emails, phone numbers, SSNs).",
      "Redaction engine overlays opaque bounding boxes and produces sanitised export files.",
    ],
    engineeringDecisions: [
      "Combined rules-based Regex with statistical NER to achieve both high precision on structured identifiers and high recall on context-dependent names.",
      "Processed documents in isolated sandboxes to prevent temporary data leaks.",
    ],
    highlights: [
      "Multi-format document parsing (PDF, DOCX, XLSX, images)",
      "High-accuracy PII identification with SpaCy NLP",
      "Audit trail tracking all sanitization operations in Supabase",
    ],
  },
  {
    slug: "campaign-analytics",
    title: "Campaign Experimentation and Engagement Analytics",
    type: "Layer B",
    category: "Data & Analytics",
    status: "Completed",
    year: 2025,
    tagline: "Hypothesis testing and conversion lift analysis across 588K randomized users",
    engineeringSummary:
      "Conducted large-scale A/B testing analysis on a 588K-user randomized experiment to evaluate campaign lift, statistical significance, and customer segmentation, paired with Power BI executive dashboards.",
    metrics: ["👥 588K Users Evaluated", "📊 Statistical Lift Analysis", "📈 Power BI KPI Suite"],
    stack: ["Python", "SQL", "Power BI", "Statistics / Hypothesis Testing", "Pandas", "SciPy"],
    github: "https://github.com/SHIVAMCP18/campaign-experimentation-analytics",
    overview:
      "A rigorous statistical study measuring customer response to targeted marketing promotions, validating incremental revenue lift, and detecting cohort-specific variances.",
    problem:
      "Marketing campaigns frequently claim conversion gains without controlling for sample bias, seasonality, or establishing statistical significance.",
    solution:
      "Formulated two-tailed hypothesis tests, calculated p-values and confidence intervals, and constructed automated metric reconciliation scripts across 588,000 user interactions.",
    architecture: [
      "SQL scripts cleansed raw user action logs and established matched treatment and control groups.",
      "Python scripts computed chi-square tests, t-tests, and bootstrapping confidence intervals.",
      "Power BI models provided interactive filtering across user demographics and purchase categories.",
    ],
    engineeringDecisions: [
      "Validated sample ratio mismatch (SRM) checks before computing conversion metrics to prevent misleading test evaluations.",
      "Standardized data pipelines to allow marketing teams to run recurring cohort segmentations.",
    ],
    highlights: [
      "Rigorous statistical significance validation (p < 0.01)",
      "Interactive executive reporting with Power BI",
      "Quantified exact incremental revenue per marketing dollar",
    ],
  },
  {
    slug: "cdc-database-migration",
    title: "CDC Database Migration Pipeline (PostgreSQL to AlloyDB & BigQuery)",
    type: "Layer B",
    category: "Data Engineering",
    status: "Completed",
    year: 2025,
    tagline: "Zero-downtime database replication and dual-write cutover with GCP Datastream",
    engineeringSummary:
      "Engineered a continuous Change Data Capture (CDC) replication architecture streaming PostgreSQL OLTP transactions simultaneously into Google Cloud AlloyDB and BigQuery using Datastream.",
    metrics: ["⚡ Sub-second Lag", "🛡️ Zero-Downtime Cutover", "🔄 Dual-Sink Replication"],
    stack: ["PostgreSQL", "GCP Datastream", "BigQuery", "AlloyDB", "GCP"],
    github: "https://github.com/SHIVAMCP18/cdc-migration-pipeline",
    overview:
      "A production-grade database migration blueprint transitioning high-volume transactional databases to managed cloud databases without application downtime.",
    problem:
      "Standard database migrations require scheduled maintenance windows and prolonged service downtime, disrupting critical business operations.",
    solution:
      "Leveraged logical replication and GCP Datastream to capture live WAL changes from source PostgreSQL and stream updates concurrently to AlloyDB for transactional cutover and BigQuery for analytics.",
    architecture: [
      "PostgreSQL logical decoding slot publishes committed database transactions.",
      "GCP Datastream reads the replication slot with minimal overhead on the source database.",
      "BigQuery receives change events into staging tables with merge queries for deduplication.",
      "AlloyDB continuously catches up to current state for seamless DNS cutover.",
    ],
    engineeringDecisions: [
      "Used CDC instead of ETL snapshotting to ensure zero data loss during high-traffic transactional hours.",
      "Documented step-by-step dual-write verification tests and rollback procedures.",
    ],
    highlights: [
      "Continuous streaming replication with minimal latency",
      "Zero-downtime cutover strategy with rollback safety",
      "Unified source for operational OLTP and analytical OLAP",
    ],
  },
  {
    slug: "iac-cicd-gcp",
    title: "IaC & CI/CD for GCP Data Platform",
    type: "Layer B",
    category: "Cloud / DevOps",
    status: "Completed",
    year: 2025,
    tagline: "Automated multi-environment infrastructure provisioning with Terraform & Cloud Build",
    engineeringSummary:
      "Authored reusable Terraform modules provisioning BigQuery datasets, IAM roles, Pub/Sub topics, and Cloud Storage buckets, integrated with Cloud Build pipelines for dev, test, and production deployments.",
    metrics: ["🏗️ 100% Terraform IaC", "🚀 Multi-Stage CI/CD", "🔐 Least-Privilege IAM"],
    stack: ["Terraform", "Cloud Build", "GCP", "Bash", "GitHub"],
    github: "https://github.com/SHIVAMCP18/gcp-data-platform-iac",
    overview:
      "An automated cloud infrastructure management solution enforcing git-ops standards, repeatable environment creation, and strict cloud security controls.",
    problem:
      "Manual cloud console configuration leads to environment drift, unversioned permission escalations, and fragile multi-region setups.",
    solution:
      "Structured modular Terraform templates version-controlled in Git with automated Cloud Build dry-run checks on pull requests and gated approvals for production applies.",
    architecture: [
      "Terraform state files stored securely in encrypted Google Cloud Storage buckets with object versioning.",
      "Cloud Build triggers perform `terraform fmt`, `tflint`, and `terraform plan` on feature branches.",
      "Separated environment variables and service accounts for dev, test, and production isolates environments.",
    ],
    engineeringDecisions: [
      "Enforced granular least-privilege IAM service account bindings per data pipeline component.",
      "Parameterized all module inputs to allow launching brand-new cloud environments in under 5 minutes.",
    ],
    highlights: [
      "Automated pull-request plan validation in Cloud Build",
      "Zero manual console modifications",
      "Modular and extensible GCP architecture",
    ],
  },
  {
    slug: "pricing-elasticity-engine",
    title: "Pricing Elasticity Engine",
    type: "Layer B",
    category: "Data & Analytics",
    status: "Completed",
    year: 2025,
    tagline: "Econometric price elasticity estimation on 100K+ e-commerce transactions",
    engineeringSummary:
      "Built an econometric pricing optimization engine applying instrumental variable regression on 100K+ e-commerce transactions to estimate price elasticity, deployed as an interactive Streamlit dashboard.",
    metrics: ["📈 100K+ Transactions", "📊 Instrumental Variable 2SLS", "🎯 Streamlit GUI"],
    stack: ["Python", "SQL", "Econometrics", "Streamlit", "Statsmodels", "Pandas"],
    github: "https://github.com/SHIVAMCP18/pricing-elasticity-engine",
    overview:
      "An analytical decision-support tool helping e-commerce pricing managers identify optimal price points that maximize gross margin without damaging sales volume.",
    problem:
      "Standard price elasticity estimates suffer from simultaneity bias because price and demand are determined simultaneously in equilibrium markets.",
    solution:
      "Applied Two-Stage Least Squares (2SLS) instrumental variable regression to isolate exogenous price variations, providing accurate product-level price elasticities.",
    architecture: [
      "Data extraction and feature engineering scripts built in SQL and Pandas.",
      "Econometric modeling pipeline using Python Statsmodels for 2SLS and OLS benchmarking.",
      "Streamlit web interface allowing interactive scenario simulation and profit curve plotting.",
    ],
    engineeringDecisions: [
      "Used supply-side cost shocks as instruments to overcome endogeneity in price-quantity relationships.",
      "Delivered interactive sensitivity sliders in Streamlit to give commercial teams immediate actionable scenarios.",
    ],
    highlights: [
      "Robust econometric identification strategy",
      "Automated product category clustering",
      "Interactive profit maximization simulation",
    ],
  },
  {
    slug: "ml-accelerator-core",
    title: "ML Accelerator Core & Verification",
    type: "Layer B",
    category: "Systems & Hardware",
    status: "Completed",
    year: 2025,
    tagline: "Systolic-array hardware accelerator for matrix multiplication with UVM verification",
    engineeringSummary:
      "Designed a parameterizable systolic-array hardware accelerator in SystemVerilog (RTL) for tensor matrix operations, with an automated UVM verification testbench and PPA benchmarking against Vitis HLS.",
    metrics: ["⚡ Systolic Array RTL", "🧪 UVM Testbench", "📊 PPA Optimized"],
    stack: ["Verilog / SystemVerilog (RTL)", "UVM", "C++ / Vitis HLS", "ModelSim"],
    github: "https://github.com/SHIVAMCP18/ml-accelerator-core",
    overview:
      "A high-throughput custom digital hardware design built to accelerate deep learning matrix multiplication operations with minimal energy consumption and high memory reuse.",
    problem:
      "General-purpose CPUs and GPUs spend significant energy transporting weight matrices back and forth between memory hierarchies during inference.",
    solution:
      "Architected a 2D systolic array of processing elements (PEs) that stream data directly between adjacent units, drastically cutting SRAM read cycles.",
    architecture: [
      "Parameterizable N x N processing element array written in synthesizable SystemVerilog.",
      "Local multiply-accumulate (MAC) units with configurable bit-width precision.",
      "Universal Verification Methodology (UVM) testbench generating randomized transaction stimuli.",
      "C++ Golden model comparing output matrices for cycle-accurate correctness.",
    ],
    engineeringDecisions: [
      "Adopted output-stationary dataflow to maximize weight reuse inside individual processing elements.",
      "Constructed reusable UVM scoreboards and monitors to achieve 100% functional coverage.",
    ],
    highlights: [
      "Synthesizable SystemVerilog RTL implementation",
      "Complete UVM verification suite with assertions",
      "Benchmarked against high-level synthesis (Vitis HLS) designs",
    ],
  },
  {
    slug: "api-versioning-platform",
    title: "API Versioning Platform",
    type: "Layer B",
    category: "Backend & Systems",
    status: "Completed",
    year: 2025,
    tagline: "High-performance versioned REST gateway with dynamic payload transformations",
    engineeringSummary:
      "Designed an extensible API versioning gateway in Java and Spring Boot that routes requests across evolving schema versions while transparently transforming legacy client payloads without breaking contracts.",
    metrics: ["🔀 Multi-Version Support", "🛡️ Zero Breaking Changes", "📋 OpenAPI Validated"],
    stack: ["Java", "Spring Boot", "PostgreSQL", "OpenAPI", "Docker"],
    github: "https://github.com/SHIVAMCP18/api-versioning-platform",
    overview:
      "A robust enterprise gateway pattern that enables continuous backend API development without stranding legacy client applications or mobile users.",
    problem:
      "Deploying breaking API changes forces client applications to update simultaneously, creating deployment bottlenecks and customer outages.",
    solution:
      "Constructed a bidirectional transformation gateway that intercepts versioned headers, applies migration transformers to requests, and adapts downstream responses back to expected client schemas.",
    architecture: [
      "Spring Boot interceptors extract semantic version headers or URL prefixes.",
      "Dynamic mapper registry evaluates schema deltas and applies transformations in memory.",
      "PostgreSQL stores version catalog rules, migration maps, and endpoint usage metrics.",
      "OpenAPI 3.0 specs generated dynamically per active version.",
    ],
    engineeringDecisions: [
      "Implemented declarative transformation pipelines rather than branching controller logic to keep codebase maintainable.",
      "Added telemetry tracking deprecated endpoint calls to inform deprecation schedules.",
    ],
    highlights: [
      "Bidirectional request/response schema transformation",
      "Automated OpenAPI documentation per version",
      "Zero client downtime during breaking schema rollouts",
    ],
  },
  {
    slug: "weather-monitoring-system",
    title: "Weather Monitoring System (IoT Edge & Cloud)",
    type: "Layer B",
    category: "Cloud / IoT",
    status: "Completed",
    year: 2024,
    tagline: "Real-time edge IoT telemetry platform using Raspberry Pi, MQTT & AWS Lambda",
    engineeringSummary:
      "Engineered an IoT environmental sensing pipeline collecting edge telemetry via Raspberry Pi, streaming secure MQTT payloads into AWS IoT Core, and triggering automated alert notifications with AWS Lambda.",
    metrics: ["📡 MQTT Telemetry", "☁️ AWS IoT Core", "⚡ Sub-second Alerts"],
    stack: ["Raspberry Pi", "MQTT", "AWS IoT Core", "AWS Lambda", "Python", "Amazon SNS"],
    github: "https://github.com/SHIVAMCP18/weather-monitoring-iot",
    overview:
      "An edge-to-cloud environmental monitoring station streaming live temperature, humidity, and barometric pressure data with automated anomaly alerting.",
    problem:
      "Remote monitoring stations need reliable data delivery despite intermittent network connectivity and must trigger urgent alerts without running expensive standing servers.",
    solution:
      "Configured lightweight MQTT clients with TLS encryption on Raspberry Pi, streaming to AWS IoT Core rule engines that trigger serverless AWS Lambda functions and Amazon SNS notifications.",
    architecture: [
      "Raspberry Pi connects to DHT22 and BMP280 sensors via I2C/GPIO.",
      "Python edge client packages readings into JSON packets and publishes via MQTT over TLS.",
      "AWS IoT Core rules engine filters anomalies (e.g. rapid temperature spikes).",
      "AWS Lambda executes serverless processing and logs historical metrics in DynamoDB.",
    ],
    engineeringDecisions: [
      "Utilized MQTT Quality of Service (QoS 1) to ensure sensor packets are never dropped during network fluctuations.",
      "Leveraged serverless Lambda triggers to eliminate fixed 24/7 cloud server costs.",
    ],
    highlights: [
      "Secure edge-to-cloud TLS encrypted transmission",
      "Automated SMS/Email notification dispatch via SNS",
      "Low-power edge device optimization",
    ],
  },
  {
    slug: "source-code-refactoring-engine",
    title: "Source-to-Source Code Refactoring & Migration Engine",
    type: "Layer B",
    category: "Compilers & Systems",
    status: "Completed",
    year: 2025,
    tagline: "AST-driven code refactoring engine parsing source files with Tree-sitter & LLVM",
    engineeringSummary:
      "Built a compiler transformation engine in C++ and Python parsing source code into concrete syntax trees (CST) and ASTs, executing pattern matching rules to automate deprecated API migrations safely.",
    metrics: ["🌳 Tree-sitter AST", "⚙️ C++ & LLVM", "🛡️ Semantic-Preserving"],
    stack: ["C++", "Tree-sitter", "LLVM", "Python", "CMake"],
    github: "https://github.com/SHIVAMCP18/source-refactoring-engine",
    overview:
      "An automated program analysis and rewriting system that eliminates manual codebase migrations across major library updates and deprecated method calls.",
    problem:
      "Regex-based search and replace is dangerous for complex code refactoring because it ignores scope, variable shadowing, types, and syntax context.",
    solution:
      "Engineered an AST-based rewriting engine that parses C++ and Python syntax trees using Tree-sitter and LLVM tooling, executing semantic rewrite rules while preserving formatting and comments.",
    architecture: [
      "Tree-sitter parser creates resilient, error-tolerant syntax trees from raw source files.",
      "Pattern matcher searches for target function signatures, class heirarchies, and deprecated imports.",
      "Transformation engine applies surgical edits to AST nodes and serializes clean diffs.",
    ],
    engineeringDecisions: [
      "Used concrete syntax trees to retain comments, whitespace, and formatting during automated rewriting.",
      "Generated git diff previews before writing changes to disk to ensure developer verification.",
    ],
    highlights: [
      "Syntactic and semantic code validation",
      "Automated test suite verifying equivalence of transformations",
      "Support for multi-file cross-reference refactorings",
    ],
  },
  {
    slug: "telemetry-observability-pipeline",
    title: "Telemetry & Observability Pipeline",
    type: "Layer B",
    category: "DevOps & SRE",
    status: "Completed",
    year: 2025,
    tagline: "End-to-end distributed tracing, metrics, and logs with OpenTelemetry & Kafka",
    engineeringSummary:
      "Constructed a distributed observability pipeline instrumenting microservices with OpenTelemetry, streaming telemetry through Kafka into Prometheus and Grafana with SLI/SLO threshold alerting.",
    metrics: ["📊 Prometheus & Grafana", "📡 OpenTelemetry Traces", "🔔 SLI/SLO Alerting"],
    stack: ["OpenTelemetry", "Kafka", "Prometheus", "Grafana", "Docker", "Go", "Python"],
    github: "https://github.com/SHIVAMCP18/telemetry-observability-pipeline",
    overview:
      "A centralized platform providing real-time visibility into microservice latency, request journeys, error rates, and resource utilization across distributed nodes.",
    problem:
      "Debugging microservice latency bottlenecks without correlated traces, logs, and metrics requires guessing across isolated server logs.",
    solution:
      "Standardized OpenTelemetry instrumentation across microservices to inject trace contexts, streaming high-cardinality telemetry into Kafka buffers before indexing in Prometheus and visualizing in Grafana.",
    architecture: [
      "OpenTelemetry agents automatically collect trace IDs, spans, and metric counters.",
      "Kafka topic acts as a shock absorber buffering high-volume metrics during traffic spikes.",
      "Prometheus scrapes aggregated endpoints and stores time-series data.",
      "Grafana dashboards visualize P95/P99 latencies, error budgets, and system health.",
    ],
    engineeringDecisions: [
      "Decoupled telemetry ingestion with Kafka to prevent metric logging from slowing down critical service paths.",
      "Defined actionable SLI/SLO alerts to minimize on-call alert fatigue.",
    ],
    highlights: [
      "Correlated distributed tracing across microservices",
      "Production-grade Grafana operational dashboards",
      "Automated alerts for error budget depletion",
    ],
  },
  {
    slug: "deraindrop-image-restoration",
    title: "DeRaindrop: Image Restoration System",
    type: "Layer B",
    category: "AI / Vision",
    status: "Completed",
    year: 2024,
    tagline: "Attentive GAN in PyTorch for single-image raindrop removal and quality restoration",
    engineeringSummary:
      "Implemented an attentive Generative Adversarial Network (Attentive GAN) in PyTorch to detect and remove raindrops from single images, evaluating visual quality with PSNR and SSIM benchmarks.",
    metrics: ["👁️ PyTorch Attentive GAN", "📸 PSNR & SSIM Evaluated", "⚡ OpenCV Pipeline"],
    stack: ["Python", "PyTorch", "OpenCV", "NumPy", "Matplotlib"],
    github: "https://github.com/SHIVAMCP18/DeRaindrop",
    overview:
      "A deep learning computer vision model restoring degraded images contaminated with water droplets on camera lenses or vehicle windshields.",
    problem:
      "Raindrops occlude background information and introduce refractive optical distortions, causing downstream autonomous navigation and object detection models to fail.",
    solution:
      "Built a two-stage Attentive GAN featuring an attention-guided generator that identifies droplet regions and a multi-scale contextual discriminator that synthesizes realistic background textures.",
    architecture: [
      "Visual attention subnet produces an attention map highlighting distorted droplet pixels.",
      "Autoencoder generator reconstructs background textures using feature maps guided by attention.",
      "Dual discriminator checks both global structural coherence and local detail realism.",
    ],
    engineeringDecisions: [
      "Trained with a composite perceptual loss function (VGG feature loss + L1 loss + adversarial loss) to eliminate blurriness.",
      "Optimized inference pipelines with OpenCV preprocessing for rapid image evaluation.",
    ],
    highlights: [
      "Attentive deep GAN architecture for image inpainting",
      "Evaluated against standard benchmarks (PSNR > 31 dB, SSIM > 0.92)",
      "Applications in autonomous driving vision safety",
    ],
  },
];

export const homepageFeaturedSlugs = [
  "flowforge",
  "streaming-analytics-pipeline",
  "voiceiq-enterprise",
  "distributed-webhook-delivery",
  "zentry-gaming-multiverse",
  "lakehouse-platform",
];

export const layerAProjects = allProjects.filter((p) => p.type === "Layer A");
export const layerBProjects = allProjects.filter((p) => p.type === "Layer B");
