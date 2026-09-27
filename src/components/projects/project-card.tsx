import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  maxStack?: number;
  showFlow?: boolean;
};

export function ProjectCard({ project, maxStack = 6, showFlow = false }: ProjectCardProps) {
  const extra = project.stack.length - maxStack;

  return (
    <SpotlightCard className="group flex h-full flex-col p-6">
      <div className="relative z-[2] flex h-full flex-col">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-border bg-muted/70 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {project.category}
          </span>
          <div className="flex items-center gap-2">
            {project.status === "Live" && (
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Live
              </span>
            )}
            <span className="font-mono text-[11px] text-muted-foreground">{project.year}</span>
          </div>
        </div>

        <Link href={`/projects/${project.slug}`} className="mt-4 block">
          <h3 className="flex items-start justify-between gap-3 text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
            {project.title}
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
          </h3>
        </Link>
        <p className="mt-1 text-sm font-medium text-primary/80">{project.tagline}</p>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">{project.engineeringSummary}</p>

        {showFlow && project.dataFlow && (
          <div className="mt-4 break-words rounded-xl border border-border/60 bg-muted/40 px-3 py-2 font-mono text-[11px] leading-5 text-muted-foreground">
            {project.dataFlow}
          </div>
        )}

        {project.metrics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.metrics.map((metric) => (
              <span key={metric} className="rounded-md bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-foreground/80">
                {metric}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, maxStack).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-card px-2.5 py-0.5 font-mono text-[10px] text-foreground/70"
            >
              {tech}
            </span>
          ))}
          {extra > 0 && <span className="self-center text-[10px] text-muted-foreground">+{extra} more</span>}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex h-8 items-center rounded-full bg-primary px-3.5 text-xs font-medium text-primary-foreground transition hover:bg-primary/85"
          >
            Case study
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-muted"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Live
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-muted"
            >
              <Github className="h-3.5 w-3.5" /> Code
            </a>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
}
