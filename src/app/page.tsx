import { GitHubSection } from "@/components/home/github-section";
import { HomePageClient } from "@/components/home/home-page-client";

export default async function HomePage() {
  const githubSection = await GitHubSection();

  return <HomePageClient githubSection={githubSection} />;
}