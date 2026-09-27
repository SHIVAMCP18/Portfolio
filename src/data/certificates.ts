export type Certificate = {
  title: string;
  issuer: string;
  provider: string;
  category: string;
  issueDate: string;
  skills: string[];
  file: string;
};

export const certificates: Certificate[] = [
  {
    title: "Technology Job Simulation",
    issuer: "Deloitte",
    provider: "Deloitte · Forage",
    category: "Software Development",
    issueDate: "2026-08-14",
    skills: ["Coding", "Development"],
    file: "/certificates/Deloitte_Technology_Job_Simulation.pdf",
  },
  {
    title: "Software Engineering Job Simulation",
    issuer: "JPMorgan Chase & Co.",
    provider: "JPMorgan Chase & Co. · Forage",
    category: "Software Engineering",
    issueDate: "2024-08-30",
    skills: [
      "Interfacing with a stock price data feed",
      "JPMorgan Chase & Co. frameworks and tools",
      "Visualizing data for traders",
      "Open source contribution",
    ],
    file: "/certificates/JPMorgan_Software_Engineering_Job_Simulation.pdf",
  },
];
