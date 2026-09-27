import { NextRequest, NextResponse } from "next/server";
import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { allProjects, type Project } from "@/data/projects";
import { technicalSkillGroups } from "@/data/skills";
import { education } from "@/data/education";
import { achievements, leadership } from "@/data/achievements";
import { certificates } from "@/data/certificates";

const MAX_MESSAGE_LENGTH = 500;

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

// Short, distinctive name for each project, e.g. "FlowForge" from "FlowForge: Distributed ...".
function projectKeywords(project: Project) {
  const head = project.title.split(/[:(–]| - /)[0].trim().toLowerCase();
  const paren = project.title.match(/\(([^)]+)\)/)?.[1]?.toLowerCase();
  return [head, project.slug.replace(/-/g, " "), paren].filter(
    (value): value is string => Boolean(value) && value!.length > 3,
  );
}

const STOP_WORDS = new Set(["platform", "system", "engine", "with", "and", "the", "pipeline", "tell", "about"]);

// Fallback: pick the project whose title shares the most significant words with the question.
function findProjectByOverlap(text: string) {
  const words = new Set(text.split(/[^a-z0-9]+/).filter((word) => word.length > 3 && !STOP_WORDS.has(word)));
  let best: { project: Project; score: number } | null = null;
  for (const project of allProjects) {
    const titleWords = new Set(project.title.toLowerCase().split(/[^a-z0-9]+/));
    const score = [...words].filter((word) => titleWords.has(word)).length;
    if (score >= 2 && (!best || score > best.score)) best = { project, score };
  }
  return best?.project;
}

function describeProject(project: Project) {
  const links = [
    `/projects/${project.slug}`,
    project.github ? `code: ${project.github}` : null,
    project.liveUrl ? `live: ${project.liveUrl}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return `${project.title} — ${project.engineeringSummary} Stack: ${project.stack.join(", ")}. (${links})`;
}

function findProjectsByTech(text: string) {
  const techs = new Set(allProjects.flatMap((project) => project.stack));
  const matched = [...techs].filter((tech) => {
    const core = tech.toLowerCase().split(/[ (/]/)[0];
    return core.length > 2 && new RegExp(`\\b${core.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(text);
  });
  if (matched.length === 0) return null;
  const projects = allProjects.filter((project) =>
    project.stack.some((tech) => matched.includes(tech)),
  );
  return projects.length > 0 ? { matched, projects } : null;
}

function getAssistantReply(raw: string) {
  const text = raw.toLowerCase().trim();
  const name = profile.firstName;

  if (!text) {
    return "Ask me anything about " + name + "'s experience, projects, skills, or how to get in touch.";
  }

  if (includesAny(text, ["hello", "hi ", "hey"]) && text.length < 12) {
    return `Hi! I can tell you about ${name}'s internships, projects, tech stack, education, or availability. What would you like to know?`;
  }

  // A specific company.
  const company = experience.find((item) =>
    text.includes(item.company.split(" ")[0].toLowerCase()),
  );
  if (company) {
    return `${company.role} at ${company.company} (${company.period}). ${company.highlights.join(" ")} Tech: ${company.technologies.join(", ")}.`;
  }

  // A specific project.
  const project =
    allProjects.find((item) => projectKeywords(item).some((keyword) => text.includes(keyword))) ??
    findProjectByOverlap(text);
  if (project) return describeProject(project);

  if (includesAny(text, ["contact", "email", "phone", "reach", "linkedin", "github", "connect"])) {
    return `Email: ${profile.email} · LinkedIn: ${profile.linkedin} · GitHub: ${profile.github}. You can also use the contact form at the bottom of the home page.`;
  }

  if (includesAny(text, ["hire", "available", "availability", "open to", "relocat", "remote", "location", "where", "based", "notice"])) {
    return `${name} is based in ${profile.location}. ${profile.availability} — open to ${profile.workPreferences.join(", ").toLowerCase()} opportunities, and happy to discuss relocation for the right role.`;
  }

  if (includesAny(text, ["resume", "cv"])) {
    return `You can view or download the resume at /resume (direct PDF: ${profile.resume}).`;
  }

  if (includesAny(text, ["educat", "degree", "college", "university", "cgpa", "gpa", "nirma", "study", "graduat"])) {
    const edu = education[0];
    return `${edu.degree} at ${edu.school}, ${edu.location} (${edu.period}), CGPA ${edu.gpa}. Coursework includes ${edu.coursework.join(", ")}.`;
  }

  if (includesAny(text, ["certif", "credential", "simulation", "deloitte", "jpmorgan", "jp morgan", "forage"])) {
    return `Certifications: ${certificates
      .map((item) => `${item.issuer} ${item.title} (${item.provider})`)
      .join("; ")}. See /certificates.`;
  }

  if (includesAny(text, ["achiev", "award", "rank", "hackathon", "competition", "google", "nasa", "flipkart"])) {
    return achievements.map((item) => `${item.title} — ${item.badge}.`).join(" ");
  }

  if (includesAny(text, ["leader", "ieee", "aces", "club", "mentor", "volunteer"])) {
    return leadership.map((item) => `${item.role}, ${item.organization}: ${item.highlights[0]}`).join(" ");
  }

  // "Do you know Kafka?" / "Which projects use Redis?"
  const techMatch = findProjectsByTech(text);
  if (techMatch) {
    const list = techMatch.projects.slice(0, 5).map((item) => item.title).join("; ");
    return `Yes — ${name} has used ${techMatch.matched.join(", ")} in: ${list}. Ask about any of them for details.`;
  }

  if (includesAny(text, ["skill", "stack", "tech", "language", "framework", "tool", "know"])) {
    return technicalSkillGroups
      .map((group) => `${group.title}: ${group.skills.join(", ")}.`)
      .join(" ");
  }

  if (includesAny(text, ["project", "built", "portfolio", "work on", "side"])) {
    const featured = allProjects.slice(0, 6).map((item) => item.title.split(":")[0]).join(", ");
    return `${name} has ${allProjects.length} projects in the archive, including ${featured}. Ask about any one by name, or browse /projects.`;
  }

  if (includesAny(text, ["intern", "experience", "work", "job", "company", "companies"])) {
    return `${experience.length} internships: ${experience
      .map((item) => `${item.role} at ${item.company} (${item.period})`)
      .join("; ")}.`;
  }

  if (includesAny(text, ["who", "about", "yourself", "intro", "summary", name.toLowerCase()])) {
    return `${profile.name} — ${profile.title}. ${profile.summary}`;
  }

  return `I can answer questions about ${name}'s internships, ${allProjects.length} projects, tech stack, education, achievements, and contact details. Try "What did you do at Adani?" or "Which projects use Kafka?"`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = String(body?.message ?? "").slice(0, MAX_MESSAGE_LENGTH);
    return NextResponse.json({ reply: getAssistantReply(message) });
  } catch {
    return NextResponse.json(
      { reply: "Something went wrong while answering that question." },
      { status: 500 },
    );
  }
}
