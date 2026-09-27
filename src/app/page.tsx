import { HeroSection } from "@/components/home/hero-section";
import { ExperienceSection } from "@/components/home/experience-section";
import { FeaturedProjectsSection } from "@/components/home/featured-projects-section";
import { ArchitectureSection } from "@/components/home/architecture-section";
import { SupportingSkillsSection } from "@/components/home/supporting-skills-section";
import { EducationSection } from "@/components/home/education-section";
import { CertificatesSection } from "@/components/home/certificates-section";
import { NotesPreviewSection } from "@/components/home/notes-preview-section";
import { GitHubSection } from "@/components/home/github-section";
import { ContactSection } from "@/components/home/contact-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ExperienceSection />
      <FeaturedProjectsSection />
      <ArchitectureSection />
      <SupportingSkillsSection />
      <EducationSection />
      <CertificatesSection />
      <NotesPreviewSection />
      <GitHubSection />
      <ContactSection />
    </>
  );
}
