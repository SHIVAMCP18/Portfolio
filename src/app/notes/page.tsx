import Link from "next/link";
import { ArrowRight, ArrowLeft, BookOpen, Layers3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notes } from "@/data/notes";

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to main page
          </Link>
        </div>

        <div className="mb-12 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">
            System Design Notes
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Engineering Notes & Architecture Thinking
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            A curated knowledge section covering distributed systems, backend
            architecture, performance engineering, and practical security ideas
            tied to the projects in this portfolio.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <Link key={note.slug} href={`/notes/${note.slug}`}>
              <Card className="h-full rounded-[2rem] border-border bg-card backdrop-blur-xl">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>

                    <Badge className="rounded-full border border-border bg-card text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {note.category}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground">
                    {note.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {note.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{note.level}</span>
                    <span>•</span>
                    <span>{note.readTime}</span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {note.bullets.map((bullet, index) => (
                      <Badge
                        key={`${note.slug}-bullet-${index}`}
                        className="rounded-full border border-border bg-card text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                      >
                        {bullet}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-border bg-muted p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      Related Project
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-foreground">
                      <Layers3 className="h-4 w-4 text-primary" />
                      {note.relatedProject}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 flex items-center text-sm text-primary">
                    Read note <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
