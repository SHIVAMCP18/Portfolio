export interface InternshipExperience {
  company: string;
  technologies: string[];
  highlights: string[];
  summary: string;
}

export const experience: InternshipExperience[] = [
  {
    company: "Adani Group",
    technologies: [
      "Python",
      "Flask",
      "AWS (SQS, Lambda, S3)",
      "GraphQL",
      "SQL Server",
      "MongoDB",
      "Power BI",
      "SQL",
    ],
    summary:
      "Engineered microservices, cloud integrations, ETL pipelines, and data validation layers for enterprise operations.",
    highlights: [
      "Built 7+ Python and Flask microservices for internal business applications handling high-throughput data ingestion, validation, and automated reporting.",
      "Integrated AWS cloud services including SQS for asynchronous queue processing, S3 for scalable asset storage, and Lambda for serverless workflows.",
      "Developed an optimized GraphQL aggregation layer unifying SQL Server and MongoDB data, drastically cutting frontend data retrieval latency.",
      "Engineered robust ETL workflows and SQL stored procedures to process large-scale operational datasets, paired with Power BI KPI dashboards for real-time tracking.",
      "Constructed automated data validation scripts and monitoring workflows to detect inconsistencies and ensure continuous data integrity.",
    ],
  },
  {
    company: "Disha Enterprise",
    technologies: [
      "Java",
      "Spring Boot",
      "React.js",
      "Node.js",
      "Express.js",
      "MySQL",
      "Azure",
    ],
    summary:
      "Architected multi-tier enterprise web systems and cut backend latency by 50% through database and query optimization.",
    highlights: [
      "Designed and deployed scalable multi-tier enterprise web applications with Java and Spring Boot backends and modern React.js client interfaces on Azure.",
      "Reduced backend API response times by up to 50% through systematic MySQL schema refactoring, index tuning, and query plan optimizations.",
      "Diagnosed and resolved critical production issues using Azure monitoring tools, server application logs, and structured debugging methodologies.",
    ],
  },
  {
    company: "Nexus Software",
    technologies: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT Auth",
      "RBAC",
    ],
    summary:
      "Constructed secure full-stack web applications with role-based access control and resolved 30+ production issues.",
    highlights: [
      "Engineered secure, responsive full-stack applications using React, Node.js, Express.js, and MongoDB featuring JWT authentication and Role-Based Access Control.",
      "Diagnosed, debugged, and resolved over 30 production incidents via rigorous log inspection, regression testing, and code quality enhancements.",
      "Collaborated with frontend and backend developers to structure reusable components, clean API contracts, and predictable state management.",
    ],
  },
  {
    company: "Maruti Enterprise",
    technologies: ["Linux", "SQL", "Postman", "Service Validation", "Root Cause Analysis"],
    summary:
      "Conducted system-level diagnostics, service behavior validation, and root cause analysis across databases and APIs.",
    highlights: [
      "Troubleshot and diagnosed complex application, API, and database anomalies by analyzing runtime logs, query executions, and service dependencies.",
      "Utilized Linux CLI tools and Postman to validate RESTful service behaviors, simulate edge-case network payloads, and diagnose failed endpoints.",
      "Documented root causes and recommended preventative architectural fixes to improve service uptime and operational reliability.",
    ],
  },
];
