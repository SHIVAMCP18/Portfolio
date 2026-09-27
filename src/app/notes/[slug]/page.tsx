import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock, Layers3, X, Scale } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { notes } from "@/data/notes";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const note = notes.find((item) => item.slug === slug);
  if (!note) return {};
  return { title: note.title, description: note.description };
}

function ListBlock({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: typeof Check; tone: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground">
            <Icon className={`mt-1 h-4 w-4 shrink-0 ${tone}`} /> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function NoteDetailPage({ params }: Params) {
  const { slug } = await params;
  const index = notes.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();

  const note = notes[index];
  const next = notes[(index + 1) % notes.length];

  return (
    <article className="mx-auto max-w-3xl px-6 pb-16">
      <div className="pt-10 md:pt-14">
        <Link href="/notes" className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> All notes
        </Link>
      </div>

      <Reveal y={20} className="mt-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-medium text-primary">{note.category}</span>
          <span className="rounded-full border border-border px-2.5 py-0.5">{note.level}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {note.readTime}
          </span>
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground text-balance md:text-5xl">{note.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{note.description}</p>
      </Reveal>

      <Reveal y={20} delay={80}>
        <div className="mt-10 space-y-6">
          {note.content.map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-foreground/85">
              {paragraph}
            </p>
          ))}
        </div>
      </Reveal>

      <Reveal y={20}>
        <div className="mt-10 rounded-2xl border border-primary/25 bg-primary/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Where I used this</p>
          <p className="mt-3 text-sm leading-7 text-foreground/85">{note.whereUsed}</p>
          <Link
            href={`/projects/${note.relatedProjectSlug}`}
            className="group mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <Layers3 className="h-4 w-4" /> {note.relatedProject}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>

      <Reveal y={20}>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <ListBlock title="Trade-offs" items={note.tradeoffs} icon={Scale} tone="text-amber-500" />
          <ListBlock title="Use when" items={note.useWhen} icon={Check} tone="text-emerald-500" />
          <ListBlock title="Avoid when" items={note.avoidWhen} icon={X} tone="text-destructive" />
        </div>
      </Reveal>

      <nav className="mt-14 border-t border-border pt-8" aria-label="Next note">
        <Link href={`/notes/${next.slug}`} className="group block rounded-2xl border border-border p-5 transition hover:border-primary/40">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            Next note <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
          <p className="mt-1 font-semibold text-foreground group-hover:text-primary">{next.title}</p>
        </Link>
      </nav>
    </article>
  );
}
