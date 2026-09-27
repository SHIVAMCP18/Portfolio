import Link from "next/link";
import { ArrowRight, Award, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/layout/section-title";
import { certificates } from "@/data/certificates";

const featured = certificates.slice(0, 6);

export function CertificatesSection() {
  const categoryCount = new Set(certificates.map((item) => item.category)).size;

  return (
    <section id="certifications" className="mx-auto max-w-7xl px-6 py-24">
      <SectionTitle
        eyebrow="Certifications"
        title="Always learning"
        description={`${certificates.length} certificates across ${categoryCount} areas — cloud, Java, testing, DevOps, security, AI, and more.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((certificate, index) => (
          <Reveal key={certificate.file} y={20} delay={(index % 3) * 70}>
            <a
              href={certificate.file}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {certificate.category}
                </p>
                <h3 className="mt-1 font-semibold leading-snug text-foreground group-hover:text-primary">
                  {certificate.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{certificate.provider}</p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal y={16} delay={120}>
        <div className="mt-8 flex justify-center">
          <Link
            href="/certificates"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/40"
          >
            View all {certificates.length} certificates
            <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
