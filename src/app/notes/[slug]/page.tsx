import Link from "next/link";
import { ArrowLeft, Layers3 } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { notes } from "@/data/notes";

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = notes.find((item) => item.slug === slug);

  if (!note) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to notes
          </Link>
        </div>

        <div className="mb-10">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Engineering Note
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Badge className="rounded-full border border-border bg-card text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {note.category}
            </Badge>
            <Badge className="rounded-full border border-border bg-card text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {note.level}
            </Badge>
            <Badge className="rounded-full border border-border bg-card text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {note.readTime}
            </Badge>
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
            {note.title}
          </h1>

          <p className="mt-5 text-base leading-8 text-muted-foreground">
            {note.description}
          </p>
        </div>

        <Card className="rounded-[2rem] border-border bg-card backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="mb-8 rounded-2xl border border-border bg-muted p-5">
              <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Related Project
              </p>
              <Link
                href={`/projects/${note.relatedProjectSlug}`}
                className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:text-primary"
              >
                <Layers3 className="h-4 w-4" />
                {note.relatedProject}
              </Link>
            </div>

            <div className="space-y-6">
              {note.content.map((paragraph, index) => (
                <p
                  key={`${note.slug}-paragraph-${index}`}
                  className="text-base leading-8 text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-semibold text-foreground">
                Where I Used This
              </h3>
              <p className="mt-3 leading-7 text-muted-foreground">{note.whereUsed}</p>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-semibold text-foreground">Tradeoffs</h3>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                {note.tradeoffs.map((item, i) => (
                  <li key={`${note.slug}-tradeoff-${i}`}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-semibold text-foreground">When to Use</h3>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                {note.useWhen.map((item, i) => (
                  <li key={`${note.slug}-use-${i}`}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-semibold text-foreground">
                When to Avoid
              </h3>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                {note.avoidWhen.map((item, i) => (
                  <li key={`${note.slug}-avoid-${i}`}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {note.bullets.map((bullet, index) => (
                <Badge
                  key={`${note.slug}-tag-${index}`}
                  className="rounded-full border border-border bg-card text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                >
                  {bullet}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}