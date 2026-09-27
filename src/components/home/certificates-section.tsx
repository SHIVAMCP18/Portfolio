import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/layout/section-title";
import { CertificateCard } from "@/components/certificates/certificate-card";
import { certificates } from "@/data/certificates";

export function CertificatesSection() {
  return (
    <section id="certifications" className="mx-auto max-w-5xl px-6 py-24">
      <SectionTitle
        eyebrow="Certifications"
        title="Industry job simulations"
        description="Hands-on virtual work experience programs completed with global technology and financial firms."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {certificates.map((certificate, index) => (
          <Reveal key={certificate.file} y={24} delay={index * 90} className="h-full">
            <CertificateCard certificate={certificate} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
