import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

type PageHeaderProps = {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHeader({ backHref, backLabel, eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <header className="relative pb-10 pt-10 md:pt-14">
      <div aria-hidden className="absolute inset-x-0 -top-24 -z-10 h-72 bg-grid opacity-50 mask-radial" />
      <Link
        href={backHref}
        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> {backLabel}
      </Link>
      <Reveal y={20} className="mt-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground text-balance md:text-6xl">{title}</h1>
        {description && (
          <p className="mt-4 text-base leading-8 text-muted-foreground text-pretty">{description}</p>
        )}
        {children}
      </Reveal>
    </header>
  );
}
