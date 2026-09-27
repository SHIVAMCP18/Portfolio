import { BadgeCheck, Brain, CheckCircle2, Cloud, Code2, Database, Layers, Trophy, Users, Wrench } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionTitle } from "@/components/layout/section-title";
import { technicalSkillGroups, coreCompetencies, type SkillGroup } from "@/data/skills";
import { achievements, credentials, leadership } from "@/data/achievements";

const icons: Record<SkillGroup["icon"], typeof Code2> = {
  code: Code2,
  layers: Layers,
  cloud: Cloud,
  database: Database,
  brain: Brain,
  wrench: Wrench,
};

export function SupportingSkillsSection() {
  return (
    <section id="skills" className="mx-auto max-w-7xl px-6 py-24">
      <SectionTitle
        eyebrow="Skills & Recognition"
        title="The toolkit behind the work"
        description="Languages, frameworks, and platforms I've used in internships and projects — plus the competitions and communities that shaped how I build."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {technicalSkillGroups.map((group, index) => {
          const Icon = icons[group.icon];
          return (
            <Reveal key={group.title} y={24} delay={(index % 3) * 80} className="h-full">
              <SpotlightCard className="group h-full p-6">
                <div className="relative z-[2]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">{group.title}</h3>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>

      <Reveal y={16} delay={100}>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {coreCompetencies.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> {item}
            </span>
          ))}
        </div>
      </Reveal>

      <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal y={24} className="h-full">
          <SpotlightCard className="h-full p-7">
            <div className="relative z-[2]">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">Achievements & Credentials</h3>
              </div>

              <div className="space-y-3">
                {achievements.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-border bg-muted/40 p-4 transition hover:border-primary/40">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {item.badge}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {credentials.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/85"
                  >
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" /> {item}
                  </span>
                ))}
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        <Reveal y={24} delay={100} className="h-full">
          <SpotlightCard className="h-full p-7">
            <div className="relative z-[2]">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">Leadership & Community</h3>
              </div>

              <div className="space-y-4">
                {leadership.map((item) => (
                  <div key={item.role + item.organization} className="border-l-2 border-primary/40 pl-4">
                    <h4 className="font-semibold text-foreground">{item.role}</h4>
                    <p className="text-xs font-medium text-primary">
                      {item.organization} · {item.location}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {item.highlights.map((highlight) => (
                        <li key={highlight} className="text-sm leading-6 text-muted-foreground">
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}
