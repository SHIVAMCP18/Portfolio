import { Award, CheckCircle2, ExternalLink } from "lucide-react";
import type { Certificate } from "@/data/certificates";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  return (
    <a
      href={certificate.file}
      target="_blank"
      rel="noreferrer"
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card p-7 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
    >
      <div aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
          <Award className="h-6 w-6 text-primary" />
        </div>
        <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {certificate.category}
        </span>
      </div>

      <p className="relative mt-5 text-sm font-semibold text-primary">{certificate.issuer}</p>
      <h3 className="relative mt-1 text-xl font-bold tracking-tight text-foreground group-hover:text-primary">
        {certificate.title}
      </h3>
      <p className="relative mt-1 text-xs text-muted-foreground">
        {certificate.provider} · {formatDate(certificate.issueDate)}
      </p>

      <ul className="relative mt-5 flex-1 space-y-2">
        {certificate.skills.map((skill) => (
          <li key={skill} className="flex gap-2 text-sm leading-6 text-muted-foreground">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" /> {skill}
          </li>
        ))}
      </ul>

      <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        View certificate
        <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}
