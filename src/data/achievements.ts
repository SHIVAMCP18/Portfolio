export interface Achievement {
  title: string;
  organization: string;
  badge: string;
  description: string;
}

export interface LeadershipRole {
  role: string;
  organization: string;
  location: string;
  highlights: string[];
}

export const achievements: Achievement[] = [
  {
    title: "Google Big Code Challenge",
    organization: "Google",
    badge: "Top 1,500 Global",
    description:
      "Ranked among the top 1,500 globally in Google's competitive coding and algorithmic optimization challenge.",
  },
  {
    title: "Flipkart GRID 8.0",
    organization: "Flipkart",
    badge: "Semi-Finalist",
    description:
      "Reached the national semi-finals of Flipkart's premier engineering campus challenge, solving high-concurrency systems problems.",
  },
  {
    title: "NASA Space Apps Challenge 2024",
    organization: "NASA",
    badge: "Top Team",
    description:
      "Recognized as a Top Team for architecting innovative technical solutions tackling complex scientific challenges.",
  },
];

export const leadership: LeadershipRole[] = [
  {
    role: "Board Member",
    organization: "IEEE Signal Processing Society (SPS) Student Chapter",
    location: "Nirma University, Ahmedabad",
    highlights: [
      "Organized and executed hands-on technical workshops, hackathons, and guest lectures featuring industry experts.",
      "Spearheaded technical curriculum planning, mentor coordination, and interactive learning tracks for 300+ students.",
    ],
  },
  {
    role: "Technical Head",
    organization: "Association of Computer Engineering Students (ACES)",
    location: "Nirma University, Ahmedabad",
    highlights: [
      "Led high-impact university-wide technical initiatives, including competitive coding contests, algorithmic hackathons, and deep-dive workshops (e.g. Exploratory Data Analysis & System Design).",
      "Mentored junior engineers in data structures, algorithms, and practical full-stack software development practices.",
    ],
  },
];
