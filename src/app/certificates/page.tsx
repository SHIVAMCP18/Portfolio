import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/ui/reveal";
import { CertificateCard } from "@/components/certificates/certificate-card";
import { certificates } from "@/data/certificates";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Industry job simulation certificates from Deloitte and JPMorgan Chase & Co.",
};

export default function CertificatesPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-16">
      <PageHeader
        backHref="/"
        backLabel="Home"
        eyebrow="Certificates"
        title="Certifications"
        description="Hands-on virtual work experience programs completed with global technology and financial firms."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {certificates.map((certificate, index) => (
          <Reveal key={certificate.file} y={24} delay={index * 90} className="h-full">
            <CertificateCard certificate={certificate} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
