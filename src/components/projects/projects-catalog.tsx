"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { allProjects } from "@/data/projects";

type SortKey = "featured" | "newest" | "az";

const categories = ["All", ...new Set(allProjects.map((project) => project.category))];

const popularTech = ["Kafka", "Python", "Go", "Java", "React", "PostgreSQL", "GCP", "AWS", "PyTorch", "Redis"];

export function ProjectsCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sort, setSort] = useState<SortKey>("featured");
  const deferredQuery = useDeferredValue(searchQuery);

  const filteredProjects = useMemo(() => {
    const query = deferredQuery.toLowerCase().trim();
    const filtered = allProjects.filter((project) => {
      if (selectedCategory !== "All" && project.category !== selectedCategory) return false;
      if (!query) return true;
      return (
        project.title.toLowerCase().includes(query) ||
        project.tagline.toLowerCase().includes(query) ||
        project.engineeringSummary.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.stack.some((tech) => tech.toLowerCase().includes(query))
      );
    });

    if (sort === "newest") return [...filtered].sort((a, b) => b.year - a.year);
    if (sort === "az") return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    return filtered;
  }, [deferredQuery, selectedCategory, sort]);

  function reset() {
    setSearchQuery("");
    setSelectedCategory("All");
  }

  return (
    <>
      <div className="sticky top-[4.25rem] z-30 -mx-6 mb-10 border-y border-border/60 bg-background/80 px-6 py-4 backdrop-blur-xl md:mx-0 md:rounded-2xl md:border">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by name or technology — e.g. Kafka, PyTorch, GCP"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search projects"
              className="w-full rounded-full border border-border bg-card py-2.5 pl-11 pr-10 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            aria-label="Sort projects"
            className="rounded-full border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          >
            <option value="featured">Featured first</option>
            <option value="newest">Newest first</option>
            <option value="az">A → Z</option>
          </select>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {categories.map((category) => {
            const count =
              category === "All"
                ? allProjects.length
                : allProjects.filter((project) => project.category === category).length;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {category} <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>
          Showing <span className="font-semibold text-foreground">{filteredProjects.length}</span> of{" "}
          {allProjects.length} projects
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          <span>Try:</span>
          {popularTech.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => setSearchQuery(tech)}
              className="rounded-md px-1.5 py-0.5 font-mono text-foreground/70 transition hover:bg-muted hover:text-primary"
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project, index) => (
          <Reveal key={`${project.slug}-${selectedCategory}-${sort}`} y={20} delay={Math.min(index, 5) * 50} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border py-20 text-center text-muted-foreground">
          <p className="text-base">No projects match &ldquo;{searchQuery}&rdquo;.</p>
          <button type="button" onClick={reset} className="mt-3 text-sm font-semibold text-primary underline-offset-4 hover:underline">
            Reset search & filters
          </button>
        </div>
      )}
    </>
  );
}
