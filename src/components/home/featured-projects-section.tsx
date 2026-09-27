import Link from "next/link";
import { ArrowRight, FolderOpen } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/layout/section-title";
import { ProjectCard } from "@/components/projects/project-card";
import { allProjects, homepageFeaturedSlugs, type Project } from "@/data/projects";

const featuredProjects = homepageFeaturedSlugs
  .map((slug) => allProjects.find((project) => project.slug === slug))
  .filter((project): project is Project => Boolean(project));

const categories = [...new Set(allProjects.map((project) => project.category))];

export function FeaturedProjectsSection() {
  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 py-24">
      <SectionTitle
        eyebrow="Featured Projects"
        title="Things I've designed and built"
        description="A selection of systems spanning distributed backends, real-time data pipelines, AI-powered products, and full-stack applications. Each links to a case study covering the problem, architecture, and trade-offs."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featuredProjects.map((project, index) => (
          <Reveal key={project.slug} y={28} delay={(index % 3) * 90} className="h-full">
            <ProjectCard project={project} showFlow />
          </Reveal>
        ))}
      </div>

      <Reveal y={20} delay={100}>
        <Link
          href="/projects"
          className="group mt-10 flex flex-col items-start justify-between gap-6 rounded-[1.75rem] border border-dashed border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 p-8 transition hover:border-primary md:flex-row md:items-center"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
              <FolderOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Explore all {allProjects.length} projects
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Search and filter the full archive by technology or domain — {categories.slice(0, 6).join(", ")}, and more.
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
            Open archive
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </Reveal>
    </section>
  );
}
