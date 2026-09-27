import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { ExperienceSection } from "@/components/home/experience-section";
import { EducationSection } from "@/components/home/education-section";
import { FeaturedProjectsSection } from "@/components/home/featured-projects-section";
import { ArchitectureSection } from "@/components/home/architecture-section";
import { SupportingSkillsSection } from "@/components/home/supporting-skills-section";
import { ContactSection } from "@/components/home/contact-section";
import { AIAssistant } from "@/components/home/ai-assistant";

type Props = {
  githubSection: React.ReactNode;
};

export function HomePageClient({ githubSection }: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main>
        <HeroSection />
        <ExperienceSection />
        <EducationSection />
        <FeaturedProjectsSection />
        <ArchitectureSection />
        <SupportingSkillsSection />
        {githubSection}
        <ContactSection />
        <Footer />
      </main>
      <AIAssistant />
    </div>
  );
}
