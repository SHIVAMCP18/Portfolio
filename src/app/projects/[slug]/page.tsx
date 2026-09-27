import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Github,
  Lightbulb,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { allProjects } from "@/data/projects";
import { notes } from "@/data/notes";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return allProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = allProjects.find((item) => item.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
  };
}

function SectionCard({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon: typeof Target;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Reveal y={24} delay={delay} className="h-full">
      <div className="h-full rounded-[1.75rem] border border-border bg-card p-7 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
        </div>
        {children}
      </div>
    </Reveal>
  );
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const index = allProjects.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();

  const project = allProjects[index];
  const previous = allProjects[(index - 1 + allProjects.length) % allProjects.length];
  const next = allProjects[(index + 1) % allProjects.length];
  const relatedNotes = notes.filter((note) => note.relatedProjectSlug === project.slug);
  const flowSteps = project.dataFlow?.split("→").map((step) => step.trim());

  return (
    <article className="mx-auto max-w-6xl px-6 pb-16">
      <div className="pt-10 md:pt-14">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> All projects
        </Link>
      </div>

      {/* Header */}
      <Reveal y={20} className="mt-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            {project.category}
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
              project.status === "Live"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            {project.status}
          </span>
          <span className="rounded-full border border-border bg-card px-3 py-1 font-mono text-[11px] text-muted-foreground">
            {project.year}
          </span>
        </div>

        <h1 className="mt-5 max-w-4xl text-3xl font-bold tracking-tight text-foreground text-balance md:text-5xl">
          {project.title}
        </h1>
        <p className="mt-3 text-lg font-medium text-primary">{project.tagline}</p>
        <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">{project.overview}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition hover:opacity-90"
            >
              <Github className="h-4 w-4" /> View source
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90"
            >
              <ExternalLink className="h-4 w-4" /> Live demo
            </a>
          )}
        </div>
      </Reveal>

      {/* Metrics */}
      {project.metrics.length > 0 && (
        <Reveal y={20} delay={80}>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {project.metrics.map((metric) => (
              <div key={metric} className="rounded-2xl border border-border bg-card px-5 py-4 text-sm font-semibold text-foreground">
                {metric}
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {/* Data flow */}
      {flowSteps && flowSteps.length > 1 && (
        <Reveal y={20} delay={120}>
          <div className="mt-6 rounded-[1.75rem] border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Data flow</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {flowSteps.map((step, stepIndex) => (
                <div key={step} className="flex items-center gap-2">
                  <span
                    className="rounded-xl border border-primary/25 bg-primary/5 px-3 py-2 font-mono text-xs text-foreground animate-in fade-in zoom-in-95"
                    style={{ animationDelay: `${stepIndex * 120}ms`, animationFillMode: "both" }}
                  >
                    {step}
                  </span>
                  {stepIndex < flowSteps.length - 1 && <ArrowRight className="h-4 w-4 text-primary" />}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Stack */}
      <Reveal y={20} delay={140}>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span key={tech} className="rounded-full border border-border bg-muted/50 px-3 py-1 font-mono text-xs text-foreground/80">
              {tech}
            </span>
          ))}
        </div>
      </Reveal>

      {/* Problem / Solution */}
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <SectionCard icon={Target} title="The problem">
          <p className="text-sm leading-7 text-muted-foreground">{project.problem}</p>
        </SectionCard>
        <SectionCard icon={Lightbulb} title="The solution" delay={80}>
          <p className="text-sm leading-7 text-muted-foreground">{project.solution}</p>
        </SectionCard>
      </div>

      {/* Architecture */}
      <div className="mt-6">
        <SectionCard icon={BookOpen} title="Architecture">
          <ol className="relative space-y-4 border-l border-border pl-6">
            {project.architecture.map((step, stepIndex) => (
              <li key={step} className="relative text-sm leading-7 text-muted-foreground">
                <span className="absolute -left-[2.15rem] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-primary/30 bg-card font-mono text-[11px] font-bold text-primary">
                  {stepIndex + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {project.engineeringDecisions.length > 0 && (
          <SectionCard icon={ShieldCheck} title="Key decisions & trade-offs">
            <ul className="space-y-3">
              {project.engineeringDecisions.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                  <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-primary" /> {item}
                </li>
              ))}
            </ul>
          </SectionCard>
        )}
        <SectionCard icon={CheckCircle2} title="Highlights" delay={80}>
          <ul className="space-y-3">
            {project.highlights.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" /> {item}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {project.scalingStrategy && project.scalingStrategy.length > 0 && (
        <div className="mt-6">
          <SectionCard icon={TrendingUp} title="Scaling strategy">
            <ul className="space-y-3">
              {project.scalingStrategy.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                  <TrendingUp className="mt-1 h-4 w-4 shrink-0 text-primary" /> {item}
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}

      {relatedNotes.length > 0 && (
        <Reveal y={20}>
          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Related notes</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {relatedNotes.map((note) => (
                <Link
                  key={note.slug}
                  href={`/notes/${note.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40"
                >
                  <span>
                    <span className="block text-sm font-semibold text-foreground group-hover:text-primary">{note.title}</span>
                    <span className="text-xs text-muted-foreground">{note.readTime}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Prev / next */}
      <nav className="mt-14 grid gap-4 border-t border-border pt-8 sm:grid-cols-2" aria-label="More projects">
        <Link href={`/projects/${previous.slug}`} className="group rounded-2xl border border-border p-5 transition hover:border-primary/40">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Previous
          </span>
          <p className="mt-1 font-semibold text-foreground group-hover:text-primary">{previous.title}</p>
        </Link>
        <Link href={`/projects/${next.slug}`} className="group rounded-2xl border border-border p-5 text-right transition hover:border-primary/40">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            Next <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
          <p className="mt-1 font-semibold text-foreground group-hover:text-primary">{next.title}</p>
        </Link>
      </nav>
    </article>
  );
}
