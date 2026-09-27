"use client";

import { useState } from "react";
import { Briefcase, CalendarDays, CheckCircle2, ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionTitle } from "@/components/layout/section-title";
import { experience } from "@/data/experience";

export function ExperienceSection() {
  const [expanded, setExpanded] = useState<string | null>(experience[0]?.company ?? null);

  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-24">
      <SectionTitle
        eyebrow="Experience"
        title="Where I've shipped production work"
        description="Internships across data engineering, backend services, and full-stack product development — each one focused on reliability, performance, and clean delivery."
      />

      <ol className="relative">
        {/* Timeline rail */}
        <span
          aria-hidden
          className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-border to-transparent md:left-1/2"
        />

        {experience.map((item, index) => {
          const isOpen = expanded === item.company;
          const alignRight = index % 2 === 1;
          return (
            <li key={item.company} className="relative mb-10 last:mb-0 md:grid md:grid-cols-2 md:gap-12">
              {/* Node */}
              <span
                aria-hidden
                className="absolute left-2.5 top-7 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-background md:left-1/2 md:-translate-x-1/2"
              >
                <span className={`h-2 w-2 rounded-full bg-primary ${index === 0 ? "animate-ping" : ""}`} />
              </span>

              {/* Period label on the opposite side (desktop) */}
              <div
                className={`hidden items-start pt-6 md:flex ${
                  alignRight ? "md:order-1 md:justify-end" : "md:order-2 md:justify-start"
                }`}
              >
                <Reveal x={alignRight ? -20 : 20} y={0}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5 text-primary" />
                    {item.period}
                  </span>
                </Reveal>
              </div>

              <Reveal
                x={alignRight ? 24 : -24}
                y={0}
                delay={80}
                className={`pl-12 md:pl-0 ${alignRight ? "md:order-2" : "md:order-1"}`}
              >
                <SpotlightCard className="p-6">
                  <div className="relative z-[2]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{item.role}</p>
                        <h3 className="mt-1 text-xl font-bold tracking-tight text-foreground">{item.company}</h3>
                        <p className="mt-1 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground md:hidden">
                          <CalendarDays className="h-3.5 w-3.5" /> {item.period}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.summary}</p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-foreground/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : item.company)}
                      aria-expanded={isOpen}
                      className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
                    >
                      {isOpen ? "Hide details" : "Show key contributions"}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    <div
                      className={`grid transition-all duration-500 ease-out ${
                        isOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <ul className="space-y-2.5 overflow-hidden">
                        {item.highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
