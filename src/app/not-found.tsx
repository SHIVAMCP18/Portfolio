import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-50 mask-radial" />
      <p className="font-mono text-sm text-primary">404 · route not found</p>
      <h1 className="mt-4 text-7xl font-bold tracking-tight text-gradient md:text-9xl">404</h1>
      <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
        This page doesn&apos;t exist — it may have moved, or the link might be mistyped.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25"
        >
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
        <Link
          href="/projects"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground"
        >
          <Search className="h-4 w-4" /> Browse projects
        </Link>
      </div>
    </div>
  );
}
