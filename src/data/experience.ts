export interface InternshipExperience {
  company: string;
  role: string;
  period: string;
  technologies: string[];
  highlights: string[];
  summary: string;
}

// Ordered most recent first. Roles, dates and bullets mirror the resume PDF.
export const experience: InternshipExperience[] = [
  {
    company: "Adani Group",
    role: "Data Engineer Intern",
    period: "Jun 2026 – Jul 2026",
    technologies: ["Python", "SQL", "ETL", "Power BI", "Data Validation"],
    summary:
      "Built ETL workflows and automated reporting for large-scale operational datasets.",
    highlights: [
      "Built ETL workflows and complex SQL queries to extract, transform, and validate large-scale operational datasets for business reporting.",
      "Automated recurring reporting with Python scripts and interactive Power BI dashboards, improving processing efficiency.",
      "Collaborated with cross-functional teams to optimize SQL queries and improve internal reporting systems and data applications.",
    ],
  },
  {
    company: "Codveda Technologies",
    role: "Full-Stack Development Intern",
    period: "May 2025 – Jun 2025",
    technologies: ["React", "Node.js", "Express.js", "REST APIs", "Git"],
    summary:
      "Built and integrated RESTful APIs end-to-end and improved database reliability and performance.",
    highlights: [
      "Built and integrated RESTful APIs across frontend and backend; optimized database operations to improve reliability and performance.",
      "Collaborated using Git-based workflows while debugging, testing, and enhancing application functionality.",
      "Built scalable, maintainable software components following software engineering best practices.",
    ],
  },
  {
    company: "Disha Enterprise",
    role: "Software Development Engineer Intern",
    period: "May 2024 – Jul 2024",
    technologies: ["Node.js", "Express.js", "MySQL", "REST APIs", "Agile"],
    summary:
      "Designed backend services and REST APIs; cut query response time by 30% through MySQL index tuning.",
    highlights: [
      "Designed scalable backend services and RESTful APIs in Node.js / Express.js; optimized MySQL indexing, cutting query response time by 30%.",
      "Implemented request validation and secure coding practices; collaborated via Git-based code reviews in an agile team.",
      "Built robust error handling across services, improving system reliability under production traffic.",
    ],
  },
  {
    company: "Nexus Software",
    role: "Full Stack Developer Intern",
    period: "Dec 2023 – Mar 2024",
    technologies: ["React", "Node.js", "Express.js", "MongoDB", "JWT", "RBAC"],
    summary:
      "Shipped full-stack applications with JWT auth and RBAC, and resolved 30+ production issues.",
    highlights: [
      "Built full-stack applications (React, Node.js, Express.js, MongoDB) with JWT authentication and Role-Based Access Control.",
      "Diagnosed and resolved 30+ production issues, improving application stability through Git-based collaboration.",
      "Designed scalable architecture following software engineering best practices for maintainable, production-ready code.",
    ],
  },
];
