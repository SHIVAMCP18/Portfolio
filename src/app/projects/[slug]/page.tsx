import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Layers3, Github, CheckCircle2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { allProjects, Project } from "@/data/projects";

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = allProjects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background px-6 py-16 text-foreground">
      <div className="mx-auto w-full max-w-[calc(100vw-3rem)] min-w-0 md:max-w-7xl">
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all projects
          </Link>
        </div>

        {/* Header Hero */}
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge className="rounded-full border border-primary/30 bg-primary/10 text-[10px] uppercase tracking-wider text-primary">
                {project.category}
              </Badge>
              <Badge
                className={`rounded-full border text-[10px] uppercase tracking-wider ${
                  project.status === "Live"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {project.status}
              </Badge>
              <Badge className="rounded-full border border-border bg-card text-[10px] uppercase tracking-wider text-muted-foreground">
                {project.year}
              </Badge>
            </div>

            <h1 className="mt-5 break-words text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              {project.title}
            </h1>

            <p className="mt-3 text-base font-medium text-primary">
              {project.tagline}
            </p>

            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {project.overview}
            </p>

            {/* Metrics */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2.5">
                {project.metrics.map((metric, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg border border-border bg-muted/60 px-3 py-1 text-xs font-semibold text-foreground/90"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            )}

            {/* Stack Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="rounded-full border-border bg-card text-[11px] font-medium text-foreground/80"
                >
                  {tech}
                </Badge>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  <Button className="min-h-11 rounded-full px-6 shadow-md shadow-primary/20">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Live Deployment
                  </Button>
                </a>
              )}

              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer">
                  <Button
                    variant="outline"
                    className="min-h-11 rounded-full px-6 border-border"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    View Repository
                  </Button>
                </a>
              )}

              <Link href="/resume">
                <Button
                  variant="outline"
                  className="min-h-11 rounded-full border-border bg-card px-6 text-foreground hover:bg-muted"
                >
                  View Experience
                </Button>
              </Link>
            </div>
          </div>

          {/* System Data Flow Card */}
          <Card className="overflow-hidden rounded-[2rem] border-border bg-card shadow-sm backdrop-blur-xl">
            <CardContent className="p-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <Badge className="rounded-full border border-primary/20 bg-primary/10 text-[10px] uppercase tracking-wider text-primary">
                  System Architecture Flow
                </Badge>
                <Layers3 className="h-5 w-5 text-primary" />
              </div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                Execution Pipeline
              </p>
              <div className="mt-3 rounded-xl border border-border/80 bg-muted/40 p-4 font-mono text-xs leading-relaxed text-foreground/90">
                {project.dataFlow || project.engineeringSummary}
              </div>

              <div className="mt-6 border-t border-border/60 pt-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Engineering Scope
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {project.engineeringSummary}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Problem / Solution Grid */}
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Card className="rounded-[2rem] border-border bg-card shadow-sm backdrop-blur-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Challenge &amp; Problem Statement
              </h2>
              <div className="mt-5 rounded-2xl border border-border/80 bg-muted/40 p-5 text-sm leading-relaxed text-muted-foreground">
                {project.problem}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-border bg-card shadow-sm backdrop-blur-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Engineering Solution
              </h2>
              <div className="mt-5 rounded-2xl border border-border/80 bg-muted/40 p-5 text-sm leading-relaxed text-muted-foreground">
                {project.solution}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Architecture Details & Highlights */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-[2rem] border-border bg-card shadow-sm backdrop-blur-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Architecture Breakdown
              </h2>
              <div className="mt-6 space-y-3.5">
                {project.architecture.map((step, index) => (
                  <div
                    key={`${project.slug}-architecture-${index}`}
                    className="flex items-start gap-3 rounded-2xl border border-border/80 bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="rounded-[2rem] border-border bg-card shadow-sm backdrop-blur-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Key Technical Highlights
                </h2>
                <div className="mt-6 space-y-3">
                  {project.highlights.map((item, index) => (
                    <div
                      key={`${project.slug}-highlight-${index}`}
                      className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-muted/40 p-3.5 text-sm leading-relaxed text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {project.engineeringDecisions && project.engineeringDecisions.length > 0 && (
              <Card className="rounded-[2rem] border-border bg-card shadow-sm backdrop-blur-xl">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Engineering Decisions
                  </h2>
                  <div className="mt-6 space-y-3">
                    {project.engineeringDecisions.map((item, index) => (
                      <div
                        key={`${project.slug}-decision-${index}`}
                        className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-muted/40 p-3.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
