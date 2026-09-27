import { CalendarDays, GraduationCap, MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/layout/section-title";
import { education } from "@/data/education";

export function EducationSection() {
  return (
    <section id="education" className="mx-auto max-w-5xl px-6 py-24">
      <SectionTitle eyebrow="Education" title="Academic foundation" />

      {education.map((item) => (
        <Reveal key={item.school} y={24}>
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-sm md:p-10">
            <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative flex flex-wrap items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                  <GraduationCap className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">{item.school}</p>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground">{item.degree}</h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {item.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" /> {item.period}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-primary/25 bg-primary/5 px-6 py-4 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">CGPA</p>
                <p className="text-3xl font-bold text-foreground">{item.gpa}</p>
              </div>
            </div>

            <p className="relative mt-6 text-sm leading-7 text-muted-foreground">{item.focus}</p>

            <div className="relative mt-5 flex flex-wrap gap-2">
              {item.coursework.map((course) => (
                <span
                  key={course}
                  className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground/80"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
    </section>
  );
}
