import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { allProjects } from "@/data/projects";
import { notes } from "@/data/notes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.siteUrl;
  const staticRoutes = ["", "/projects", "/notes", "/certificates"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  return [
    ...staticRoutes,
    ...allProjects.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...notes.map((note) => ({
      url: `${base}/notes/${note.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
