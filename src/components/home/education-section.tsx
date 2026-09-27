import { GraduationCap, Layers3, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/layout/section-title";
import { education } from "@/data/education";

export function EducationSection() {
  return (
    <section id="education" className="mx-auto max-w-7xl px-6 py-20">
      <SectionTitle
        eyebrow="Education"
        title="Academic foundation in Computer Science & Engineering"
        description="Rigorous engineering curriculum at Nirma University, paired with specialized minor coursework in Adaptive AI and Deep Learning."
      />

      <div className="grid gap-6">
        {education.map((item) => (
          <Card
            key={`${item.school}-${item.degree}`}
            className="rounded-[2rem] border-border bg-card shadow-sm backdrop-blur-xl"
          >
            <CardContent className="p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{item.school}</p>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">
                      {item.degree}
                    </h3>
                  </div>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-3 text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
                    CGPA
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {item.gpa}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {item.location} • {item.period}
              </p>

              <div className="mt-5 rounded-2xl border border-border/80 bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Specialization &amp; Focus:</span>{" "}
                {item.capstone}
              </div>

              <div className="mt-4 rounded-2xl border border-border/80 bg-muted/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Layers3 className="h-4 w-4 text-primary" />
                  Key Academic Coursework
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.coursework.map((course) => (
                    <span
                      key={course}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-foreground/80"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
