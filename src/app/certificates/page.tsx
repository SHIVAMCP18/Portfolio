import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CertificatesGrid } from "@/components/certificates/certificates-grid";
import { certificates } from "@/data/certificates";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Certifications across cloud, backend engineering, testing, DevOps, security, and AI.",
};

export default function CertificatesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-16">
      <PageHeader
        backHref="/"
        backLabel="Home"
        eyebrow="Certificates"
        title="Certification archive"
        description={`${certificates.length} certificates across cloud, backend engineering, Java, testing, DevOps, security, AI, and professional development.`}
      />
      <CertificatesGrid />
    </div>
  );
}
