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
    badge: "Top 1,500 Nationwide",
    description:
      "Ranked among the top 1,500 participants nationwide in Google's competitive coding and algorithmic problem-solving challenge.",
  },
  {
    title: "NASA Space Apps Challenge 2024",
    organization: "NASA",
    badge: "Top Team",
    description:
      "Selected among the top teams at Nirma University for building a technical solution to a real-world space science challenge.",
  },
  {
    title: "Flipkart GRID 8.0",
    organization: "Flipkart",
    badge: "Semi-Finalist",
    description:
      "Reached the semi-final round of Flipkart's national engineering campus challenge.",
  },
];

export const leadership: LeadershipRole[] = [
  {
    role: "Board Member",
    organization: "IEEE Signal Processing Society (SPS) Student Chapter",
    location: "Nirma University",
    highlights: [
      "Organized hands-on technical workshops, hackathons, and guest lectures with industry experts.",
      "Coordinated curriculum planning and mentors for learning tracks reaching 300+ students.",
    ],
  },
  {
    role: "Technical Head",
    organization: "Association of Computer Engineering Students (ACES)",
    location: "Nirma University",
    highlights: [
      "Led university-wide coding contests, hackathons, and workshops on topics like EDA and System Design.",
      "Mentored junior students in data structures, algorithms, and full-stack development.",
    ],
  },
];
