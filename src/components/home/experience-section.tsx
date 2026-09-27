"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, CheckCircle2, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/layout/section-title";
import { experience, InternshipExperience } from "@/data/experience";

export function ExperienceSection() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredExperience =
    activeTab === "all"
      ? experience
      : experience.filter((item) => item.company === activeTab);

  return (
    <section id="experience" className="mx-auto max-w-7xl px-6 py-20">
      <SectionTitle
        eyebrow="Internships"
        title="Engineering impact across 4 industry internships"
        description="Focused on microservices development, cloud infrastructure integration, database performance tuning, and production system reliability."
      />

      {/* Interactive Company Filter Tabs */}
      <div className="mt-8 mb-10 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`cursor-pointer rounded-full px-5 py-2 text-xs font-medium tracking-wide transition-all ${
            activeTab === "all"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
              : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          All 4 Internships
        </button>
        {experience.map((item) => (
          <button
            key={item.company}
            type="button"
            onClick={() => setActiveTab(item.company)}
            className={`cursor-pointer rounded-full px-5 py-2 text-xs font-medium tracking-wide transition-all ${
              activeTab === item.company
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.company}
          </button>
        ))}
      </div>

      {/* Grid of Company Cards */}
      <div className="grid gap-8 md:grid-cols-2">
        {filteredExperience.map((item, idx) => (
          <Reveal key={item.company} y={20} delay={idx * 80}>
            <Card className="h-full rounded-[2rem] border-border bg-card shadow-sm backdrop-blur-xl transition hover:border-primary/40 hover:shadow-lg">
              <CardContent className="p-8">
                {/* Header: Company Name & Icon */}
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block rounded-md border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Internship
                    </span>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                      {item.company}
                    </h3>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-sm">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                </div>

                {/* Summary */}
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>

                {/* Tech Stack Badges */}
                <div className="mb-6 flex flex-wrap gap-1.5">
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-foreground/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Highlights */}
                <div className="space-y-3 border-t border-border/60 pt-5">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <Layers className="h-3.5 w-3.5 text-primary" /> Key Contributions
                  </div>
                  {item.highlights.map((highlight, hIdx) => (
                    <div
                      key={hIdx}
                      className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/40 p-3.5 text-sm leading-relaxed text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          href="/resume"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-muted"
        >
          <span>View Verified Resume &amp; Credentials</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1 text-primary">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
