"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Layers3, Search, Github, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { allProjects } from "@/data/projects";

const categories = [
  "All",
  "Distributed Systems",
  "Data Engineering",
  "Full-Stack / AI",
  "Full-Stack",
  "Cloud / DevOps",
  "AI / Vision",
  "Compilers & Systems",
  "Systems & Hardware",
  "Data & Analytics",
];

export function ProjectsCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" ||
        project.category.toLowerCase().includes(selectedCategory.toLowerCase());

      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.engineeringSummary.toLowerCase().includes(query) ||
        project.stack.some((tech) => tech.toLowerCase().includes(query)) ||
        project.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background px-6 py-16 text-foreground">
      <div className="mx-auto w-full max-w-[calc(100vw-3rem)] min-w-0 md:max-w-7xl">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to main page
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Engineering Portfolio
          </div>
          <h1 className="mx-auto max-w-4xl text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Engineering Project Archive
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Complete catalog of 18 technical projects covering distributed workflow engines,
            real-time streaming pipelines, RAG systems, hardware accelerators, and cloud infrastructure.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mb-10 space-y-4">
          <div className="relative mx-auto max-w-xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by technology (e.g. Kafka, Python, Go, GCP, PyTorch)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-center text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredProjects.length}</span> of{" "}
            {allProjects.length} projects
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card
              key={project.slug}
              className="flex h-full w-[calc(100vw-3rem)] max-w-full min-w-0 flex-col rounded-[2rem] border-border bg-card shadow-sm transition hover:border-primary/40 hover:shadow-lg md:w-full"
            >
              <CardContent className="flex flex-grow flex-col p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                    <Layers3 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
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

                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {project.title}
                </h2>

                {project.metrics && project.metrics.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-primary/80">
                    {project.metrics.map((metric, idx) => (
                      <span key={idx} className="rounded-md bg-muted px-2 py-0.5">
                        {metric}
                      </span>
                    ))}
                  </div>
                )}

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {project.engineeringSummary}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 5).map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="rounded-full border-border bg-card text-[10px] font-normal text-foreground/75"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {project.stack.length > 5 && (
                    <span className="text-[10px] text-muted-foreground self-center">
                      +{project.stack.length - 5} more
                    </span>
                  )}
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-6">
                  <Link href={`/projects/${project.slug}`}>
                    <Button size="sm" className="rounded-full text-xs">
                      Case Study
                    </Button>
                  </Link>

                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="outline" className="rounded-full text-xs">
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        Live
                      </Button>
                    </a>
                  )}

                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="outline" className="rounded-full text-xs">
                        <Github className="mr-1.5 h-3.5 w-3.5" />
                        Code
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-base">No projects matched &quot;{searchQuery}&quot;.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-3 text-xs font-semibold text-primary underline"
            >
              Reset search &amp; filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return <ProjectsCatalog />;
}
