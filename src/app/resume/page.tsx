import type { Metadata } from "next";
import {
  Award,
  Briefcase,
  Code2,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/ui/reveal";
import { profile } from "@/data/profile";
import { education } from "@/data/education";
import { technicalSkillGroups } from "@/data/skills";
import { experience } from "@/data/experience";
import { achievements, credentials } from "@/data/achievements";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${profile.name}, ${profile.title}.`,
};

function Panel({ icon: Icon, title, children }: { icon: typeof Mail; title: string; children: React.ReactNode }) {
  return (
    <Reveal y={20}>
      <section className="rounded-[1.5rem] border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          <Icon className="h-4 w-4" /> {title}
        </h2>
        {children}
      </section>
    </Reveal>
  );
}

export default function ResumePage() {
  const contacts = [
    { icon: MapPin, label: profile.location },
    { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
    { icon: Linkedin, label: profile.linkedinHandle, href: profile.linkedin },
    { icon: Github, label: `github.com/${profile.githubHandle}`, href: profile.github },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16">
      <PageHeader
        backHref="/"
        backLabel="Home"
        eyebrow="Resume"
        title={profile.name}
        description={profile.summary}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={profile.resume}
            download
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90"
          >
            <Download className="h-4 w-4" /> Download PDF
          </a>
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition hover:border-primary/40"
          >
            <ExternalLink className="h-4 w-4" /> Open in new tab
          </a>
        </div>
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
        <Reveal y={24}>
          <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
                {profile.resume.split("/").pop()}
              </span>
            </div>
            <iframe
              src={`${profile.resume}#view=FitH`}
              title={`${profile.name} resume`}
              className="h-[80vh] w-full bg-white"
            />
          </div>
        </Reveal>

        <div className="space-y-5">
          <Panel icon={Mail} title="Contact">
            <ul className="space-y-2.5 text-sm">
              {contacts.map(({ icon: Icon, label, href }) => (
                <li key={label} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="truncate text-foreground hover:text-primary">
                      {label}
                    </a>
                  ) : (
                    <span className="text-foreground">{label}</span>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {profile.workPreferences.map((item) => (
                <span key={item} className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                  {item}
                </span>
              ))}
            </div>
          </Panel>

          <Panel icon={Briefcase} title="Experience">
            <ol className="space-y-4">
              {experience.map((item) => (
                <li key={item.company} className="border-l-2 border-primary/30 pl-4">
                  <p className="font-semibold text-foreground">{item.role}</p>
                  <p className="text-sm text-primary">{item.company}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{item.period}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.summary}</p>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel icon={GraduationCap} title="Education">
            {education.map((item) => (
              <div key={item.school}>
                <p className="font-semibold text-foreground">{item.degree}</p>
                <p className="text-sm text-primary">{item.school}, {item.location}</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {item.period} · CGPA {item.gpa}
                </p>
              </div>
            ))}
          </Panel>

          <Panel icon={Code2} title="Skills">
            <div className="space-y-3">
              {technicalSkillGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-xs font-semibold text-foreground">{group.title}</p>
                  <p className="mt-0.5 text-sm leading-6 text-muted-foreground">{group.skills.join(" · ")}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel icon={Award} title="Achievements & Certifications">
            <ul className="space-y-2 text-sm">
              {achievements.map((item) => (
                <li key={item.title} className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-foreground">{item.title}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {item.badge}
                  </span>
                </li>
              ))}
              {credentials.map((item) => (
                <li key={item} className="text-muted-foreground">{item}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
