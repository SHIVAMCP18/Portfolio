import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectsCatalog } from "@/components/projects/projects-catalog";
import { allProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: `Case studies for ${allProjects.length} software projects spanning distributed systems, data engineering, cloud, full-stack, and AI.`,
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-16">
      <PageHeader
        backHref="/"
        backLabel="Home"
        eyebrow="Project Archive"
        title="Everything I've built"
        description={`${allProjects.length} projects covering distributed backends, real-time data pipelines, cloud infrastructure, full-stack products, and applied AI. Search by technology or filter by domain.`}
      />
      <ProjectsCatalog />
    </div>
  );
}
