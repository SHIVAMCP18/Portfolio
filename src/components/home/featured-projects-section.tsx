import { ExternalLink, Layers3, FolderOpen, ArrowRight, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/layout/section-title";
import { allProjects, homepageFeaturedSlugs, Project } from "@/data/projects";
import Link from "next/link";

const featuredProjects = homepageFeaturedSlugs
  .map((slug) => allProjects.find((project) => project.slug === slug))
  .filter((project): project is Project => Boolean(project));

export function FeaturedProjectsSection() {
  return (
    <section
      id="projects"
      className="mx-auto w-full max-w-[calc(100vw-3rem)] overflow-x-hidden px-0 py-20 md:max-w-7xl md:px-6"
    >
      <SectionTitle
        eyebrow="Featured Projects"
        title="High-impact systems and distributed engineering"
        description="Flagship projects spanning distributed DAG orchestrators, real-time streaming architectures, AI/RAG platforms, and high-concurrency microservices."
      />

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-2 xl:grid-cols-3">
        {featuredProjects.map((project, idx) => (
          <Reveal
            key={project.slug}
            y={24}
            delay={idx * 70}
            className="w-full"
          >
            <Card className="flex h-full w-[calc(100vw-3rem)] max-w-full min-w-0 flex-col rounded-[2rem] border-border bg-card shadow-sm transition hover:border-primary/40 hover:shadow-lg md:w-full">
              <CardContent className="flex flex-grow flex-col p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                    <Layers3 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-border bg-muted/70 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {project.category}
                    </span>
                    {project.status === "Live" && (
                      <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[9px] uppercase tracking-wider text-emerald-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  {project.title}
                </h3>

                <div className="mt-2 flex min-w-0 flex-wrap gap-2 text-xs font-medium text-primary/80">
                  {project.metrics?.map((metric, metricIdx) => (
                    <span
                      key={`${project.slug}-metric-${metricIdx}`}
                      className="rounded-md bg-muted px-2 py-0.5"
                    >
                      {metric}
                    </span>
                  ))}
                </div>

                {project.dataFlow && (
                  <div className="mt-3 break-words rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-xs leading-5 font-mono text-muted-foreground">
                    {project.dataFlow}
                  </div>
                )}

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {project.engineeringSummary}
                </p>

                <div className="mt-4 flex min-w-0 flex-wrap gap-1.5">
                  {project.stack.map((tech, techIdx) => (
                    <Badge
                      key={`${project.slug}-${tech}-${techIdx}`}
                      variant="outline"
                      className="rounded-full border-border bg-card text-[10px] font-normal tracking-wide text-foreground/75"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-6">
                  <Link href={`/projects/${project.slug}`}>
                    <Button size="sm" className="rounded-full text-xs">
                      Deep Dive Case Study
                    </Button>
                  </Link>

                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-xs"
                      >
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        Live Demo
                      </Button>
                    </a>
                  )}

                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-xs"
                      >
                        <Github className="mr-1.5 h-3.5 w-3.5" />
                        Code
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}

        <Reveal
          y={24}
          delay={featuredProjects.length * 70}
          className="w-full"
        >
          <Card className="flex h-full w-[calc(100vw-3rem)] max-w-full min-w-0 flex-col rounded-[2rem] border-dashed border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-sm md:w-full">
            <CardContent className="flex flex-grow flex-col p-2">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>

              <h3 className="text-xl font-bold tracking-tight text-foreground">
                All 18 Engineering Projects
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Explore the complete technical portfolio archive covering Distributed Schedulers,
                Hardware ML Accelerators, CDC Database Migrations, Compilers &amp; AST Refactoring,
                and IoT Telemetry.
              </p>

              <div className="mt-auto pt-6">
                <Link href="/projects">
                  <Button className="w-full rounded-full">
                    View Complete Project Archive (18)
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
