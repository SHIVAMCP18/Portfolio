export const githubConfig = {
  username: "SHIVAMCP18",
  profileUrl: "https://github.com/SHIVAMCP18",
};

// Repos to spotlight in the GitHub activity section
export const featuredRepoNames = [
  "Flowforge",
  "retailflow-microservices-project",
  "Customer-Intelligence-Platform",
  "retailflow-devops",
  "Gaming-Website",
  "CoreInventory",
];

export const githubDescriptionOverrides: Record<string, string> = {
  "retailflow-microservices-project":
    "RetailFlow: five microservices in Python, Node.js, Java, Go and C#, each with its own database, behind Kong + Consul, with a RabbitMQ order saga, Debezium outbox CDC and CQRS.",
  "retailflow-devops":
    "RetailFlow DevOps: an online store delivered with Docker, Kubernetes, Terraform on Render, and a GitHub Actions pipeline with Gitleaks and Trivy security gates.",
  Flowforge:
    "DAG workflow orchestrator: Spring Boot control plane, Go workers leasing tasks from PostgreSQL with SKIP LOCKED, retries, checkpoints, and a live React dashboard.",
  "Customer-Intelligence-Platform":
    "VoiceIQ: AI customer intelligence platform that clusters feedback into themes with pgvector, scores opportunities, and answers questions with a cited RAG chat.",
  "Gaming-Website":
    "Zentry: High-performance gaming multiverse platform built with React, GSAP, FastAPI, and integrated Gemini Live real-time voice assistant.",
  CoreInventory:
    "Full-stack inventory management platform with OTP auth, PostgreSQL (Supabase), 15+ REST APIs, and automated CI/CD.",
  "Mined-Hackthon":
    "ShieldGate: Detects, classifies, and masks sensitive PII data across 7 file formats using SpaCy NLP, OCR, and automated sanitization.",
  DeRaindrop:
    "Computer vision single-image raindrop removal using an attentive GAN in PyTorch with PSNR & SSIM quantitative benchmarks.",
  CNADevOps:
    "Cloud-native architecture and DevOps platform with Docker, Kubernetes, and automated deployment pipelines.",
};
