import { Reveal } from "@/components/ui/reveal";

type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
};

export function SectionTitle({ eyebrow, title, description, align = "center" }: SectionTitleProps) {
  const centered = align === "center";
  return (
    <Reveal className={`mb-12 max-w-3xl ${centered ? "mx-auto text-center" : ""}`}>
      <p
        className={`mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary ${
          centered ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-6 bg-primary/60" />
        {eyebrow}
        <span className="h-px w-6 bg-primary/60" />
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-foreground text-balance md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-sm leading-7 text-muted-foreground text-pretty md:text-base">
          {description}
        </p>
      )}
    </Reveal>
  );
}
