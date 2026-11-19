export interface InternshipExperience {
  company: string;
  technologies: string[];
  highlights: string[];
  summary: string;
}

// Ordered most recent first.
export const experience: InternshipExperience[] = [
  {
    company: "Adani Group",
    technologies: ["Java", "Spring Boot", "Spring Cache", "ExecutorService", "AWS S3", "Firebase", "PostgreSQL", "REST APIs"],
    summary:
      "Cut latency on production REST APIs by 60%+ with caching and concurrency, and built image-storage and real-time notification services.",
    highlights: [
      "Optimized production REST APIs using Spring Cache and Java ExecutorService, reducing latency by 60%+ for frequently accessed requests through caching and concurrent processing.",
      "Developed a scalable Spring Boot + AWS S3 microservice for image upload and storage, and built real-time notification services with Firebase and PostgreSQL, increasing user engagement by 30%.",
      "Enhanced production APIs with bulk request support, resolved critical defects, and integrated Amazon SmartBiz APIs to extend end-to-end product capabilities.",
    ],
  },
  {
    company: "Maruti Enterprise",
    technologies: ["REST APIs", "SQL", "Relational Databases", "Postman", "Git", "Code Review"],
    summary:
      "Delivered 50 REST APIs across API, service, integration and persistence layers, with thorough testing and peer-reviewed releases.",
    highlights: [
      "Delivered 50 REST APIs connecting application features with relational databases and service integrations, implementing validation, business logic, and structured error handling.",
      "Supported end-to-end application workflows across API, service, integration, and persistence layers, investigating behaviour through Postman, SQL, logs, and request/response payloads.",
      "Designed positive, negative, boundary, edge, and integration tests; reproduced defects and shipped validated fixes through Git pull requests and peer code reviews.",
    ],
  },
  {
    company: "Disha Enterprise",
    technologies: ["React", "REST APIs", "JWT", "OAuth", "RBAC", "LLMs", "Agentic AI", "Monitoring"],
    summary:
      "Built full-stack features with secure JWT/OAuth and RBAC access control, and agentic AI workflows with human-in-the-loop approvals.",
    highlights: [
      "Built end-to-end features using React, REST APIs, and backend services, integrating responsive UI workflows with databases, input validation, error handling, and asynchronous client-server communication.",
      "Implemented secure authentication and authorization using JWT/OAuth and role-based access control (RBAC), enforcing protected routes, permission checks, and least-privilege access across frontend and backend workflows.",
      "Developed agentic AI workflows with human-in-the-loop approvals, integrated LLM-powered functionality into application flows, and added logging, metrics, and monitoring to evaluate reliability and troubleshoot failures.",
    ],
  },
];
