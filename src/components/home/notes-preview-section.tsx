import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/layout/section-title";
import { notes } from "@/data/notes";

export function NotesPreviewSection() {
  return (
    <section id="notes" className="mx-auto max-w-7xl px-6 py-20">
      <SectionTitle
        eyebrow="Engineering Notes"
        title="Practical write-ups behind the projects"
        description="Short, project-grounded notes on distributed systems, caching, security, testing, and more — written from real engineering decisions, not textbook theory."
      />

      <Card className="rounded-[2rem] border-border bg-card">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              {notes.length}+ notes covering the systems concepts used across
              the projects on this site — each one tied back to where it was
              actually applied, with tradeoffs and when to use it.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {notes.slice(0, 6).map((note) => (
              <Badge
                key={note.slug}
                className="rounded-full border border-border bg-muted text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
              >
                {note.title}
              </Badge>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/notes">
              <Button className="rounded-full">
                More Notes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
