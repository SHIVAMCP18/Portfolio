import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/layout/section-title";
import { notes } from "@/data/notes";

export function NotesPreviewSection() {
  return (
    <section id="notes" className="mx-auto max-w-7xl px-6 py-24">
      <SectionTitle
        eyebrow="Engineering Notes"
        title="Writing about what I build"
        description="Short, practical write-ups on the concepts behind my projects — each tied to where I applied it, with trade-offs and when (not) to use it."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {notes.slice(0, 3).map((note, index) => (
          <Reveal key={note.slug} y={24} delay={index * 90} className="h-full">
            <Link
              href={`/notes/${note.slug}`}
              className="group flex h-full flex-col rounded-[1.75rem] border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 font-medium">{note.category}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {note.readTime}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground group-hover:text-primary">{note.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{note.description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Read note <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal y={16} delay={120}>
        <div className="mt-8 flex justify-center">
          <Link
            href="/notes"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/40"
          >
            <BookOpen className="h-4 w-4 text-primary" />
            All {notes.length} notes
            <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
