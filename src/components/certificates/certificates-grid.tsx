"use client";

import { useState } from "react";
import { Award, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { certificates } from "@/data/certificates";

const categories = ["All", ...new Set(certificates.map((item) => item.category))];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function CertificatesGrid() {
  const [category, setCategory] = useState("All");
  const visible = category === "All" ? certificates : certificates.filter((item) => item.category === category);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              category === item
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((certificate, index) => (
          <Reveal key={`${category}-${certificate.file}`} y={16} delay={Math.min(index, 8) * 40} className="h-full">
            <a
              href={certificate.file}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {certificate.category}
                </span>
              </div>
              <h3 className="mt-4 flex-1 font-semibold leading-snug text-foreground group-hover:text-primary">
                {certificate.title}
              </h3>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{certificate.provider}</span>
                <span className="font-mono">{formatDate(certificate.issueDate)}</span>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                View certificate <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </>
  );
}
