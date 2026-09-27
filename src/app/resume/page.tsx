import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Code2,
  Download,
  FileText,
  Briefcase,
  BrainCircuit,
  Cloud,
  GraduationCap,
  Github,
  Linkedin,
  Mail,
  Layers3,
  Zap,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { profile } from "@/data/profile";
import { education } from "@/data/education";
import { technicalSkillGroups } from "@/data/skills";
import { experience } from "@/data/experience";
import { achievements, leadership } from "@/data/achievements";

const highlightCards = [
  {
    icon: Briefcase,
    title: "Distributed Systems & Workflows",
    text: "Engineered FlowForge (DAG-based distributed workflow engine with Kafka, Go, Redis, and PostgreSQL checkpoints) and fault-tolerant webhook delivery with HMAC verification.",
  },
  {
    icon: Cloud,
    title: "Cloud & Microservices Delivery",
    text: "Shipped 7+ microservices with Python, Flask, and GraphQL at Adani Group with AWS SQS/Lambda/S3, and multi-tier enterprise systems on Azure at Disha Enterprise cutting latency by 50%.",
  },
  {
    icon: BrainCircuit,
    title: "Real-Time Streaming & Applied AI",
    text: "Constructed GCP streaming clickstream pipelines with Pub/Sub & Dataflow (Apache Beam), RAG semantic search in VoiceIQ Enterprise, and Attentive GANs in PyTorch for computer vision.",
  },
];

const resumeSignals = [
  "Built 7+ microservices with Python, Flask, SQL Server, and MongoDB at Adani Group, integrating AWS SQS, Lambda, and S3",
  "Engineered GraphQL aggregation layer at Adani Group unifying multiple data sources to cut frontend retrieval latency",
  "Cut backend API response times by up to 50% at Disha Enterprise through MySQL schema and query optimization",
  "Top 1,500 globally in Google Big Code Challenge & Semi-Finalist in Flipkart GRID 8.0",
  "VoiceIQ Enterprise: full-stack Next.js RAG intelligence platform with Llama 3 and pgvector",
  "Nirma University B.E. in Computer Science & Engineering (8.84/10 CGPA) with minor in Adaptive AI & Computer Vision",
];

const strengthBadges = [
  "Distributed Systems",
  "Cloud Architecture (AWS / GCP / Azure)",
  "Real-Time Streaming (Pub/Sub & Beam)",
  "Microservices (Spring Boot / Flask)",
  "Event-Driven Design (Kafka)",
  "RAG & Vector Search (pgvector / Llama 3)",
  "Full-Stack Development (React / Next.js)",
  "Database Optimization (SQL / MongoDB / Redis)",
  "Docker & Kubernetes",
  "CI/CD Automation",
  "Computer Vision & GANs",
];

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to main page
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-primary font-semibold">
              Verified Candidate Profile
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              {profile.name}
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {profile.headline} — 4 software engineering internships across microservices,
              cloud engineering, and data pipelines. Proven problem solver with top global
              rankings in Google Big Code Challenge and Flipkart GRID. Open to relocation to Tokyo, Japan.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {strengthBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href={profile.resume} target="_blank" rel="noreferrer">
                <Button className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90 shadow-md">
                  <FileText className="mr-2 h-4 w-4" />
                  Open Resume PDF
                </Button>
              </a>

              <a href={profile.resume} download>
                <Button
                  variant="outline"
                  className="rounded-full border-border bg-card px-6 text-foreground hover:bg-muted"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </a>
            </div>

            {/* Resume PDF preview iframe */}
            <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm">
              <iframe
                src={`${profile.resume}#view=FitH`}
                title="Shivam Patel Resume"
                className="h-[75vh] w-full"
              />
            </div>

            {/* Core Pillars */}
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {highlightCards.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.title}
                    className="rounded-[1.5rem] border-border bg-card backdrop-blur-xl shadow-sm"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-base font-bold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {item.text}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recruiter Snapshot */}
            <Card className="mt-8 rounded-[2rem] border-border bg-card backdrop-blur-xl shadow-sm">
              <CardContent className="p-8">
                <div className="mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Recruiter Snapshot
                  </p>
                </div>
                <h2 className="mt-1 text-2xl font-bold text-foreground">
                  Why this profile stands out
                </h2>
                <div className="mt-6 space-y-3">
                  {resumeSignals.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-2xl border border-border/80 bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Technical Skills Stack */}
            <Card className="mt-8 rounded-[2rem] border-border bg-card backdrop-blur-xl shadow-sm">
              <CardContent className="p-8">
                <div className="mb-2 flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Technical Skills
                  </p>
                </div>
                <h2 className="mt-1 text-2xl font-bold text-foreground">
                  Complete Technology Coverage
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {technicalSkillGroups.map((group) => (
                    <div
                      key={group.title}
                      className="rounded-2xl border border-border/80 bg-muted/40 p-4"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {group.title}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {group.skills.map((skill) => (
                          <span
                            key={`${group.title}-${skill}`}
                            className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Actions, Internships, Education, Achievements */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="rounded-[2rem] border-border bg-card backdrop-blur-xl shadow-sm">
              <CardContent className="p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Quick Connect
                </p>
                <h2 className="mt-1 text-2xl font-bold text-foreground">
                  Get In Touch
                </h2>

                <div className="mt-6 space-y-3">
                  <a href={profile.resume} target="_blank" rel="noreferrer">
                    <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                      <FileText className="mr-2 h-4 w-4" />
                      Open Full Resume PDF
                    </Button>
                  </a>

                  <a href={profile.resume} download>
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-border bg-card text-foreground hover:bg-muted"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF Document
                    </Button>
                  </a>

                  <a href={`mailto:${profile.email}`}>
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-border bg-card text-foreground hover:bg-muted"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Email ({profile.email})
                    </Button>
                  </a>

                  <a href={profile.linkedin} target="_blank" rel="noreferrer">
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-border bg-card text-foreground hover:bg-muted"
                    >
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn Profile
                    </Button>
                  </a>

                  <a href={profile.github} target="_blank" rel="noreferrer">
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-border bg-card text-foreground hover:bg-muted"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub (@SHIVAMCP18)
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* 4 Internships (NO DATES, NO ROLES) */}
            <Card className="rounded-[2rem] border-border bg-card backdrop-blur-xl shadow-sm">
              <CardContent className="p-8">
                <div className="mb-2 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Internship Experience
                  </p>
                </div>
                <h2 className="mt-1 text-2xl font-bold text-foreground">
                  Industry Internships
                </h2>

                <div className="mt-6 space-y-4">
                  {experience.map((item) => (
                    <div
                      key={item.company}
                      className="rounded-2xl border border-border/80 bg-muted/40 p-5"
                    >
                      <h3 className="text-lg font-bold text-foreground">
                        {item.company}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.summary}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.technologies.slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-border bg-card px-2.5 py-0.5 text-[10px] font-medium text-foreground/80"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="rounded-[2rem] border-border bg-card backdrop-blur-xl shadow-sm">
              <CardContent className="p-8">
                <div className="mb-2 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Education
                  </p>
                </div>
                <h2 className="mt-1 text-2xl font-bold text-foreground">
                  Academic Background
                </h2>

                <div className="mt-6 space-y-4">
                  {education.map((item) => (
                    <div
                      key={`${item.school}-${item.degree}`}
                      className="rounded-2xl border border-border/80 bg-muted/40 p-5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-base font-bold text-foreground">
                          {item.degree}
                        </p>
                        <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                          CGPA: {item.gpa}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-primary">
                        {item.school}, {item.location}
                      </p>
                      <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                        {item.period}
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        <span className="font-semibold text-foreground">Focus:</span> {item.capstone}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="rounded-[2rem] border-border bg-card backdrop-blur-xl shadow-sm">
              <CardContent className="p-8">
                <div className="mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Achievements
                  </p>
                </div>
                <h2 className="mt-1 text-2xl font-bold text-foreground">
                  Competitive Honors
                </h2>

                <div className="mt-6 space-y-3">
                  {achievements.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-border/80 bg-muted/40 p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-foreground">
                          {item.title}
                        </p>
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                          {item.badge}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Leadership */}
            <Card className="rounded-[2rem] border-border bg-card backdrop-blur-xl shadow-sm">
              <CardContent className="p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Leadership
                </p>
                <h2 className="mt-1 text-2xl font-bold text-foreground">
                  Student Bodies &amp; Community
                </h2>

                <div className="mt-6 space-y-3">
                  {leadership.map((item) => (
                    <div
                      key={item.role + item.organization}
                      className="rounded-2xl border border-border/80 bg-muted/40 p-4"
                    >
                      <p className="text-sm font-bold text-foreground">
                        {item.role} — {item.organization}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.location}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Navigation */}
            <Card className="rounded-[2rem] border-border bg-card backdrop-blur-xl shadow-sm">
              <CardContent className="p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Portfolio Navigation
                </p>
                <h2 className="mt-1 text-2xl font-bold text-foreground">
                  Explore More
                </h2>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/projects"
                    className="block rounded-2xl border border-border bg-muted/40 p-4 transition hover:border-primary/40 hover:bg-muted"
                  >
                    <div className="flex items-center gap-3 font-semibold text-foreground">
                      <Layers3 className="h-4 w-4 text-primary" />
                      18 Engineering Projects Archive
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Filter by Distributed Systems, Data Pipelines, AI/ML, Cloud, and Systems.
                    </p>
                  </Link>

                  <Link
                    href="/#systems"
                    className="block rounded-2xl border border-border bg-muted/40 p-4 transition hover:border-primary/40 hover:bg-muted"
                  >
                    <div className="flex items-center gap-3 font-semibold text-foreground">
                      <BrainCircuit className="h-4 w-4 text-primary" />
                      System Architecture Visualizer
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Interactive DAG &amp; Event-Streaming flow diagrams.
                    </p>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
