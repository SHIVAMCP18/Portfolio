export type SkillGroup = {
  title: string;
  icon: "code" | "layers" | "cloud" | "database" | "brain" | "wrench";
  skills: string[];
};

export const technicalSkillGroups: SkillGroup[] = [
  {
    title: "Languages",
    icon: "code",
    skills: ["Java", "Python", "C++", "C", "JavaScript", "TypeScript", "Go", "SQL", "HTML / CSS", "Bash"],
  },
  {
    title: "Backend & Web",
    icon: "layers",
    skills: [
      "Node.js",
      "Express.js",
      "React",
      "Next.js",
      "FastAPI",
      "Django",
      "Spring Boot",
      "REST APIs",
      "GraphQL",
      "WebSockets / Socket.io",
    ],
  },
  {
    title: "Cloud & DevOps",
    icon: "cloud",
    skills: [
      "AWS (Lambda, S3, DynamoDB, IoT, SNS, SES)",
      "GCP (Pub/Sub, Dataflow, BigQuery)",
      "Docker",
      "Kubernetes",
      "Terraform",
      "GitHub Actions (CI/CD)",
      "Linux",
    ],
  },
  {
    title: "Data & Storage",
    icon: "database",
    skills: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "DynamoDB",
      "Redis",
      "Supabase",
      "Apache Kafka",
      "ETL Pipelines",
      "Power BI",
      "Tableau",
    ],
  },
  {
    title: "AI / ML",
    icon: "brain",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "PyTorch",
      "NLP (SpaCy)",
      "Computer Vision (OpenCV)",
      "LLMs & RAG",
      "pgvector",
      "MLflow",
    ],
  },
  {
    title: "Engineering Practice",
    icon: "wrench",
    skills: [
      "System Design",
      "Object-Oriented Design",
      "Testing & Debugging",
      "Observability (Prometheus, Grafana)",
      "Git & Code Review",
      "Postman",
      "Agile / Scrum",
    ],
  },
];

export const coreCompetencies = [
  "Backend APIs & Microservices",
  "Data Engineering & ETL",
  "Distributed & Event-Driven Systems",
  "Full-Stack Product Development",
  "Cloud-Native Deployment",
  "Applied AI, LLMs & RAG",
];

// Shown in the scrolling marquee under the hero.
export const marqueeTech = [
  "Java",
  "Python",
  "TypeScript",
  "Go",
  "Node.js",
  "React",
  "Next.js",
  "FastAPI",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Kafka",
  "Docker",
  "Kubernetes",
  "AWS",
  "GCP",
  "Terraform",
  "PyTorch",
  "LLMs & RAG",
  "GitHub Actions",
];
