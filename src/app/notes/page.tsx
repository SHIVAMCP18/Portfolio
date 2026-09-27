import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Layers3 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/ui/reveal";
import { notes } from "@/data/notes";

export const metadata: Metadata = {
  title: "Engineering Notes",
  description: "Practical notes on distributed systems, data engineering, reliability, and AI — tied to real projects.",
};

export default function NotesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-16">
      <PageHeader
        backHref="/"
        backLabel="Home"
        eyebrow="Engineering Notes"
        title="Notes on building real systems"
        description="Short, practical write-ups on the concepts behind my projects — distributed systems, data pipelines, reliability, security, and AI. Each one covers where I used it, the trade-offs, and when to reach for it."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {notes.map((note, index) => (
          <Reveal key={note.slug} y={20} delay={(index % 3) * 70} className="h-full">
            <Link
              href={`/notes/${note.slug}`}
              className="group flex h-full flex-col rounded-[1.75rem] border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
            >
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 font-medium">{note.category}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {note.readTime}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-bold tracking-tight text-foreground group-hover:text-primary">{note.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{note.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {note.bullets.map((bullet) => (
                  <span key={bullet} className="rounded-md bg-primary/5 px-2 py-0.5 text-[11px] text-foreground/75">
                    {bullet}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-xs">
                <span className="inline-flex min-w-0 items-center gap-1.5 text-muted-foreground">
                  <Layers3 className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="truncate">{note.relatedProject}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
