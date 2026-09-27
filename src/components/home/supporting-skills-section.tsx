"use client";

import { Code2, Trophy, Users, Award, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/layout/section-title";
import { technicalSkillGroups, coreCompetencies } from "@/data/skills";
import { achievements, leadership } from "@/data/achievements";

export function SupportingSkillsSection() {
  return (
    <section id="leadership" className="mx-auto max-w-7xl px-6 py-20">
      <SectionTitle
        eyebrow="Skills & Leadership"
        title="Technical mastery, achievements & leadership"
        description="Comprehensive toolkit backed by global competitive programming achievements and active leadership in engineering student bodies."
      />

      {/* Technical Skills Matrix */}
      <Card className="rounded-[2rem] border-border bg-card shadow-sm backdrop-blur-xl">
        <CardContent className="p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Technical Stack
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                Verified Engineering Toolkit
              </h3>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {technicalSkillGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-border/80 bg-muted/40 p-5 transition hover:border-primary/40 hover:bg-muted/60"
              >
                <p className="text-sm font-bold text-foreground">
                  {group.title}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <span
                      key={`${group.title}-${skill}`}
                      className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Core Competencies Pills */}
          <div className="mt-6 border-t border-border/60 pt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Core Systems &amp; Architectural Strengths
            </p>
            <div className="flex flex-wrap gap-2">
              {coreCompetencies.map((comp) => (
                <span
                  key={comp}
                  className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                >
                  ✓ {comp}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements & Leadership Grid */}
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Achievements Card */}
        <Card className="rounded-[2rem] border-border bg-card shadow-sm backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Honors &amp; Recognition
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                  Key Achievements
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {achievements.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border/80 bg-muted/40 p-5 transition hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-bold text-foreground">
                      {item.title}
                    </h4>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {item.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground/80 font-medium">
                    {item.organization}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leadership Card */}
        <Card className="rounded-[2rem] border-border bg-card shadow-sm backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Community &amp; Mentorship
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                  Engineering Leadership
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {leadership.map((item) => (
                <div
                  key={item.role + item.organization}
                  className="rounded-2xl border border-border/80 bg-muted/40 p-5 transition hover:border-primary/40"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-base font-bold text-foreground">
                      {item.role}
                    </h4>
                    <span className="text-xs text-muted-foreground font-medium">
                      {item.location}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs font-semibold text-primary">
                    {item.organization}
                  </p>
                  <div className="mt-3 space-y-2">
                    {item.highlights.map((h, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
