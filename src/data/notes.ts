export type Note = {
  slug: string;
  title: string;
  category: string;
  level: string;
  readTime: string;
  relatedProject: string;
  relatedProjectSlug: string;
  description: string;
  content: string[];
  bullets: string[];
  whereUsed: string;
  tradeoffs: string[];
  useWhen: string[];
  avoidWhen: string[];
};

export const notes: Note[] = [
  {
    slug: "distributed-systems-fundamentals",
    title: "Distributed Systems Fundamentals",
    category: "Systems Design",
    level: "Intermediate",
    readTime: "6 min read",
    relatedProject: "FlowForge: Distributed Workflow Orchestration Platform",
    relatedProjectSlug: "flowforge",
    description:
      "The core ideas behind building scalable, fault-tolerant systems out of independent services.",
    content: [
      "A distributed system is a set of independent processes that cooperate over a network to behave like one system. Instead of a single monolith, responsibilities are split into services that communicate through APIs or message queues.",
      "The payoff is independent scaling and fault isolation: a slow worker pool does not have to take down the API that accepts jobs. The cost is that every network call can now be slow, duplicated, reordered, or lost — and partial failure becomes the normal case rather than the exception.",
      "Good designs accept those failure modes up front: they make operations idempotent, persist state at clear boundaries, use timeouts everywhere, and make it cheap to observe what the system is actually doing.",
    ],
    bullets: ["Partial failure is normal", "Idempotency everywhere", "Persist at boundaries"],
    whereUsed:
      "FlowForge splits DAG scheduling from task execution: the scheduler publishes task envelopes to Kafka, Go/Java workers consume them, Redis leases prevent duplicate execution, and PostgreSQL checkpoints each node so a crashed workflow resumes instead of restarting.",
    tradeoffs: [
      "Much higher operational complexity than a monolith",
      "Debugging requires tracing across process boundaries",
      "Consistency must be designed explicitly rather than assumed",
    ],
    useWhen: [
      "Components have very different scaling profiles",
      "Failure in one area must not cascade",
      "Work is naturally asynchronous or long-running",
    ],
    avoidWhen: [
      "A single process comfortably handles the load",
      "The team can't yet support the operational overhead",
      "Strong, simple transactional consistency is the main requirement",
    ],
  },
  {
    slug: "kafka-event-driven-architecture",
    title: "Kafka & Event-Driven Architecture",
    category: "Backend Architecture",
    level: "Intermediate",
    readTime: "7 min read",
    relatedProject: "Distributed Webhook Delivery Platform",
    relatedProjectSlug: "distributed-webhook-delivery",
    description:
      "Using a durable log to decouple producers from consumers and absorb traffic spikes.",
    content: [
      "In an event-driven system, services publish facts (\"order created\", \"webhook requested\") instead of calling each other directly. Kafka stores those events in partitioned, replicated, append-only logs that consumers read at their own pace.",
      "Because the log is durable, a consumer that falls behind or restarts simply resumes from its last committed offset. Partitioning by a key (such as a tenant or endpoint ID) preserves ordering where it matters while still allowing horizontal scale.",
      "The main design questions are delivery semantics (at-least-once is the practical default, so consumers must be idempotent), partition key choice, and what to do with poison messages that keep failing.",
    ],
    bullets: ["Durable, replayable log", "Partition for ordering", "At-least-once + idempotency"],
    whereUsed:
      "The webhook platform accepts events on the API, signs them, and writes them to Kafka. Dispatch workers consume by partition, deliver over HTTP, and push failures to a retry topic with exponential backoff, so a slow customer endpoint never blocks the ingestion path. FlowForge uses the same pattern to distribute DAG tasks to worker pools.",
    tradeoffs: [
      "Eventual consistency between services",
      "Operating Kafka (or paying for a managed service) is non-trivial",
      "Harder to reason about end-to-end flows without tracing",
    ],
    useWhen: [
      "Producers and consumers scale independently",
      "You need buffering for bursty traffic",
      "Multiple consumers need the same stream of events",
    ],
    avoidWhen: [
      "A simple synchronous request/response is enough",
      "Low volume where a database-backed queue works fine",
      "Strict global ordering across all events is required",
    ],
  },
  {
    slug: "retries-backoff-and-idempotency",
    title: "Retries, Backoff & Idempotency",
    category: "Reliability",
    level: "Intermediate",
    readTime: "5 min read",
    relatedProject: "Distributed Webhook Delivery Platform",
    relatedProjectSlug: "distributed-webhook-delivery",
    description:
      "How to retry failed work safely without creating duplicate side effects or retry storms.",
    content: [
      "Retries are the simplest way to survive transient failures, but naive retries cause two problems: duplicate side effects when the first attempt actually succeeded, and retry storms that hammer an already-struggling dependency.",
      "Exponential backoff with jitter spaces attempts out and spreads them across time so many clients don't retry in lockstep. A maximum attempt count plus a dead-letter queue keeps permanently failing work from looping forever.",
      "Idempotency makes retries safe. An idempotency key (for example, event ID) is recorded with the result of the first successful attempt; later attempts with the same key return the stored result instead of repeating the side effect.",
    ],
    bullets: ["Backoff + jitter", "Dead-letter queues", "Idempotency keys"],
    whereUsed:
      "In the webhook platform every delivery carries an event ID stored in Redis with a TTL; duplicate deliveries short-circuit, failed deliveries are re-scheduled with exponential backoff, and exhausted events land in a DLQ for inspection and manual replay.",
    tradeoffs: [
      "Extra storage and a lookup on every request for idempotency keys",
      "Backoff increases worst-case latency",
      "DLQs need tooling and ownership or they silently fill up",
    ],
    useWhen: [
      "Calling external or unreliable dependencies",
      "Operations have side effects (payments, emails, webhooks)",
      "Consumers use at-least-once delivery",
    ],
    avoidWhen: [
      "Errors are clearly permanent (validation, 4xx)",
      "The operation is already naturally idempotent and cheap",
      "Latency budgets can't absorb backoff delays",
    ],
  },
  {
    slug: "caching-with-redis",
    title: "Caching with Redis",
    category: "Performance Engineering",
    level: "Beginner",
    readTime: "5 min read",
    relatedProject: "Customer Intelligence Platform (VoiceIQ Enterprise)",
    relatedProjectSlug: "voiceiq-enterprise",
    description:
      "Reducing latency and database load with an in-memory cache — and handling invalidation.",
    content: [
      "A cache stores the result of expensive work (database queries, aggregations, model calls) in fast memory so repeated requests skip that work. Redis is the common choice because it is fast, supports TTLs, and offers useful data structures beyond simple key/value.",
      "Cache-aside is the usual pattern: read from the cache, fall back to the source on a miss, then populate the cache. TTLs bound staleness; explicit invalidation on writes keeps hot keys accurate.",
      "The hard parts are choosing keys that reflect every input to the result, avoiding stampedes when a hot key expires, and deciding how stale is acceptable for each piece of data.",
    ],
    bullets: ["Cache-aside pattern", "TTL-bounded staleness", "Avoid stampedes"],
    whereUsed:
      "The Customer Intelligence Platform caches dashboard aggregations and repeated semantic-search results in Redis so interactive views stay responsive while the underlying pgvector queries and LLM summaries run only when data actually changes.",
    tradeoffs: [
      "Stale data is possible between writes and invalidation",
      "Another piece of infrastructure to operate",
      "Memory is more expensive than disk",
    ],
    useWhen: [
      "Read-heavy workloads with repeated queries",
      "Results are expensive to compute",
      "Slight staleness is acceptable",
    ],
    avoidWhen: [
      "Data must always be strongly consistent",
      "Access patterns are mostly unique keys (low hit rate)",
      "The source is already fast enough",
    ],
  },
  {
    slug: "rag-and-llm-system-design",
    title: "RAG & LLM System Design",
    category: "AI / ML Engineering",
    level: "Intermediate",
    readTime: "7 min read",
    relatedProject: "Customer Intelligence Platform (VoiceIQ Enterprise)",
    relatedProjectSlug: "voiceiq-enterprise",
    description:
      "Grounding LLM answers in your own data with retrieval-augmented generation.",
    content: [
      "Retrieval-Augmented Generation (RAG) combines a retriever with a language model. Documents are chunked, embedded into vectors, and stored; at query time the most relevant chunks are retrieved and inserted into the prompt so the model answers from real data instead of memory.",
      "Quality depends far more on retrieval than on the model: chunk size and overlap, metadata filters, embedding choice, and re-ranking all shape what context the model sees. Keeping vectors next to relational data (for example, with pgvector in PostgreSQL) simplifies filtering by tenant, date, or source.",
      "Production RAG also needs guardrails: limiting context size, citing sources, caching repeated queries, and evaluating answers against a fixed set of test questions whenever the pipeline changes.",
    ],
    bullets: ["Chunk → embed → retrieve", "Retrieval quality first", "Evaluate continuously"],
    whereUsed:
      "The Customer Intelligence Platform embeds survey responses, reviews, support tickets, and CSV uploads into pgvector, clusters them into themes, and uses Llama 3 over retrieved context to summarize sentiment and emerging product issues. The Gaming Multiverse Platform uses a RAG pipeline behind its real-time voice assistant.",
    tradeoffs: [
      "More moving parts than calling an LLM directly",
      "Answers are only as good as retrieval",
      "Embedding and inference costs scale with data volume",
    ],
    useWhen: [
      "Answers must reflect private or frequently changing data",
      "You need traceable, source-grounded responses",
      "Fine-tuning is too slow or expensive to keep current",
    ],
    avoidWhen: [
      "The task doesn't depend on external knowledge",
      "A keyword search or SQL query answers the question",
      "Latency budgets can't absorb retrieval + generation",
    ],
  },
  {
    slug: "rest-api-design",
    title: "Designing Clean REST APIs",
    category: "Backend Architecture",
    level: "Beginner",
    readTime: "5 min read",
    relatedProject: "CoreInventory: Inventory Management System",
    relatedProjectSlug: "coreinventory",
    description:
      "Resource modeling, validation, error handling, and versioning for APIs other people depend on.",
    content: [
      "A good REST API models resources (products, warehouses, stock movements) rather than actions, uses HTTP methods and status codes consistently, and returns predictable, well-documented shapes.",
      "Validation belongs at the edge: reject malformed input early with clear 4xx errors, and keep business rules in a service layer separate from controllers and data access. Consistent error envelopes make clients simpler.",
      "Once others depend on an API, change becomes the hard part. Additive changes, explicit versioning, and contract tests keep old clients working while the API evolves.",
    ],
    bullets: ["Model resources, not verbs", "Validate at the edge", "Version deliberately"],
    whereUsed:
      "CoreInventory exposes 15+ REST endpoints over a normalized PostgreSQL schema with request validation on every route. The same practices — layered services, input validation, and consistent error handling — were applied to Node.js/Express services during internships at Disha Enterprise and Maruti Enterprise.",
    tradeoffs: [
      "Chatty clients may need many round-trips",
      "Versioning adds maintenance burden",
      "Strict validation can slow early prototyping",
    ],
    useWhen: [
      "Public or cross-team APIs",
      "CRUD-heavy domains",
      "Clients benefit from HTTP caching",
    ],
    avoidWhen: [
      "Clients need highly flexible, nested queries (consider GraphQL)",
      "Real-time bidirectional communication (consider WebSockets)",
      "Internal high-throughput RPC (consider gRPC)",
    ],
  },
  {
    slug: "database-indexing-and-optimization",
    title: "Database Indexing & Query Optimization",
    category: "Performance Engineering",
    level: "Intermediate",
    readTime: "6 min read",
    relatedProject: "CoreInventory: Inventory Management System",
    relatedProjectSlug: "coreinventory",
    description:
      "Finding slow queries, reading query plans, and choosing indexes that actually help.",
    content: [
      "Most application performance problems are database problems. The first step is measurement: find the slowest and most frequent queries, then read their execution plans (EXPLAIN / EXPLAIN ANALYZE) to see whether they scan whole tables.",
      "Indexes matched to real access patterns are the biggest lever: composite indexes ordered by the columns used in filters and sorts, covering indexes that satisfy a query without touching the table, and partial indexes for hot subsets.",
      "Every index slows writes and consumes space, so indexes should be justified by workload. Schema normalization, avoiding N+1 queries, and pagination often matter as much as indexing.",
    ],
    bullets: ["Measure first", "Index for access patterns", "Watch write cost"],
    whereUsed:
      "At Disha Enterprise, tuning MySQL indexes for the heaviest API queries cut query response time by 30%. CoreInventory applies the same approach with a normalized PostgreSQL schema and indexes on stock-lookup and movement-history queries.",
    tradeoffs: [
      "Indexes slow inserts and updates",
      "Extra storage and maintenance",
      "Over-indexing confuses the planner",
    ],
    useWhen: [
      "Queries filter or sort on the same columns repeatedly",
      "Read latency is user-facing",
      "Tables are large enough for scans to hurt",
    ],
    avoidWhen: [
      "Write-heavy tables with rare reads",
      "Very small tables",
      "Columns with very low selectivity",
    ],
  },
  {
    slug: "auth-jwt-and-rbac",
    title: "Authentication, JWT & RBAC",
    category: "Security",
    level: "Intermediate",
    readTime: "6 min read",
    relatedProject: "ShieldGate: Secure Document Sanitization Platform",
    relatedProjectSlug: "shieldgate",
    description:
      "Stateless authentication with tokens and permission models that scale with your product.",
    content: [
      "Authentication answers who the user is; authorization answers what they may do. JSON Web Tokens (JWTs) carry signed claims so any service can verify identity without a round-trip to a central session store.",
      "Short-lived access tokens with refresh tokens balance security and convenience. Tokens should be verified on every request, stored carefully on the client, and never trusted for anything the server hasn't signed.",
      "Role-Based Access Control (RBAC) assigns permissions to roles rather than individual users, which keeps policy manageable. Enforcing it in middleware — and in the database with row-level security where possible — prevents one missed check from exposing data.",
    ],
    bullets: ["AuthN vs AuthZ", "Short-lived tokens", "Enforce in depth"],
    whereUsed:
      "ShieldGate combines RBAC, Supabase session management, row-level security, and audit logging so only authorized users can view or download sanitized documents. At Nexus Software, full-stack apps used JWT authentication with role-based route protection.",
    tradeoffs: [
      "JWTs are hard to revoke before expiry",
      "Role explosion as products grow",
      "Defense-in-depth adds implementation effort",
    ],
    useWhen: [
      "Multiple services must verify identity",
      "Users have clearly different permission sets",
      "Sensitive data needs auditable access",
    ],
    avoidWhen: [
      "Permissions depend on complex attributes (consider ABAC)",
      "Immediate session revocation is critical (prefer server sessions)",
      "A single simple app where sessions suffice",
    ],
  },
  {
    slug: "stream-processing-and-windowing",
    title: "Stream Processing & Windowing",
    category: "Data Engineering",
    level: "Advanced",
    readTime: "7 min read",
    relatedProject: "Real-Time Streaming Analytics Pipeline",
    relatedProjectSlug: "streaming-analytics-pipeline",
    description:
      "Computing aggregates over unbounded data with windows, watermarks, and late-data handling.",
    content: [
      "Batch jobs process a finite dataset; stream processors handle unbounded data as it arrives. To aggregate an infinite stream you group events into windows — fixed (tumbling), overlapping (sliding), or activity-based (session).",
      "Events rarely arrive in order. Watermarks estimate how complete the data is for a point in event time, and triggers decide when to emit results and how to update them when late data shows up.",
      "Operationally, a streaming pipeline needs schema validation, dead-letter outputs for bad records, deduplication, and sinks matched to how the data will be read — for example, an analytical warehouse for SQL plus a low-latency key/value store for serving.",
    ],
    bullets: ["Event time vs processing time", "Watermarks & triggers", "Dead-letter outputs"],
    whereUsed:
      "The streaming pipeline ingests clickstream events through GCP Pub/Sub, applies tumbling and sliding windows in Apache Beam on Dataflow, routes malformed events to a dead-letter topic, and writes to both BigQuery (analytics) and Bigtable (low-latency serving).",
    tradeoffs: [
      "More complex than scheduled batch jobs",
      "Correctness depends on watermark and lateness settings",
      "Always-on infrastructure cost",
    ],
    useWhen: [
      "Decisions depend on data from the last seconds or minutes",
      "Continuous monitoring or alerting",
      "Event volume makes large batches slow",
    ],
    avoidWhen: [
      "Daily or hourly freshness is sufficient",
      "Data arrives in naturally bounded files",
      "The team lacks capacity to operate streaming systems",
    ],
  },
  {
    slug: "etl-and-data-quality",
    title: "ETL Pipelines & Data Quality",
    category: "Data Engineering",
    level: "Intermediate",
    readTime: "6 min read",
    relatedProject: "CDC Database Migration Pipeline",
    relatedProjectSlug: "cdc-database-migration",
    description:
      "Building pipelines that move data reliably — and prove the data is still right when it lands.",
    content: [
      "ETL (extract, transform, load) pipelines move data from operational systems into places optimized for reporting and analysis. The mechanics are straightforward; the hard part is trust — ensuring the numbers in a dashboard are complete and correct.",
      "Data quality checks belong inside the pipeline: row counts and reconciliations between source and target, null and range checks, uniqueness constraints, and schema validation. Failing loudly on a bad load beats silently publishing wrong numbers.",
      "Idempotent loads (so reruns don't duplicate data), incremental extraction, and change data capture (CDC) keep pipelines fast and recoverable as volumes grow.",
    ],
    bullets: ["Validate inside the pipeline", "Idempotent loads", "Reconcile source vs target"],
    whereUsed:
      "At Adani Group, ETL workflows and SQL transformations prepared large operational datasets for business reporting, with validation steps and automated Power BI dashboards. The CDC migration project uses GCP Datastream to replicate PostgreSQL changes into AlloyDB and BigQuery with reconciliation before cutover.",
    tradeoffs: [
      "Quality checks add runtime and maintenance",
      "Strict checks can block loads on minor issues",
      "CDC adds operational dependencies on source databases",
    ],
    useWhen: [
      "Business decisions depend on the data",
      "Multiple sources must be combined",
      "Reports run on a schedule and must be reproducible",
    ],
    avoidWhen: [
      "Ad-hoc, one-off analysis",
      "Querying the source directly is cheap and safe",
      "Real-time requirements call for streaming instead",
    ],
  },
  {
    slug: "cicd-and-infrastructure-as-code",
    title: "CI/CD & Infrastructure as Code",
    category: "DevOps",
    level: "Intermediate",
    readTime: "5 min read",
    relatedProject: "IaC & CI/CD for GCP Data Platform",
    relatedProjectSlug: "iac-cicd-gcp",
    description:
      "Automating tests, builds, and environments so every change ships the same way.",
    content: [
      "Continuous integration runs linting, type checks, and tests on every change so problems surface in minutes instead of in production. Continuous delivery then builds an artifact once and promotes it through environments.",
      "Infrastructure as Code (Terraform, for example) describes cloud resources declaratively and version-controls them. Changes are reviewed like application code, planned before they are applied, and reproducible across dev, staging, and production.",
      "Together they make deployments boring: small, frequent, reversible changes with least-privilege service accounts instead of manual console edits.",
    ],
    bullets: ["Build once, promote", "Plan before apply", "Least-privilege automation"],
    whereUsed:
      "The GCP data platform provisions every environment with Terraform and deploys through multi-stage Cloud Build pipelines. CoreInventory runs automated tests and deployments through GitHub Actions.",
    tradeoffs: [
      "Upfront investment before the first deploy",
      "Terraform state must be stored and locked carefully",
      "Slow pipelines hurt developer productivity",
    ],
    useWhen: [
      "More than one person ships to the same system",
      "Multiple environments must stay in sync",
      "Compliance requires auditable change history",
    ],
    avoidWhen: [
      "Throwaway prototypes",
      "One-off experiments in a sandbox account",
      "The tooling cost outweighs a truly tiny project",
    ],
  },
  {
    slug: "observability-metrics-logs-traces",
    title: "Observability: Metrics, Logs & Traces",
    category: "Reliability",
    level: "Intermediate",
    readTime: "6 min read",
    relatedProject: "Telemetry & Observability Pipeline",
    relatedProjectSlug: "telemetry-observability-pipeline",
    description:
      "Knowing what a production system is doing — and why — before users tell you.",
    content: [
      "Metrics show aggregate behaviour over time (request rate, error rate, latency percentiles), logs record discrete events with context, and traces follow a single request across service boundaries. Each answers different questions.",
      "OpenTelemetry standardizes how applications emit all three, so instrumentation isn't tied to a vendor. Correlating them — a trace ID in every log line, exemplars on latency metrics — is what turns data into fast diagnosis.",
      "Alerts should be based on user-facing symptoms defined as SLIs and SLOs (for example, 99% of requests under 300 ms), not on every CPU spike, so on-call attention goes to what actually matters.",
    ],
    bullets: ["Metrics, logs, traces", "Correlate by trace ID", "Alert on SLOs"],
    whereUsed:
      "The telemetry pipeline instruments Go and Python services with OpenTelemetry, ships signals through Kafka, stores metrics in Prometheus, and visualizes SLIs with Grafana dashboards and SLO-based alerts. Debugging 30+ production issues at Nexus Software reinforced how much good logs shorten diagnosis.",
    tradeoffs: [
      "Telemetry volume and storage costs",
      "Instrumentation effort across services",
      "Noisy alerts cause fatigue if not tuned",
    ],
    useWhen: [
      "Any system with real users",
      "Requests cross multiple services",
      "You need to prove reliability targets",
    ],
    avoidWhen: [
      "Local prototypes (basic logging is enough)",
      "Short-lived scripts",
      "When you can't act on the data you'd collect",
    ],
  },
];
