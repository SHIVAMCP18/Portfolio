import { ExternalLink, Github, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/layout/section-title";
import { getGitHubRepos, type GitHubRepo } from "@/lib/github";
import { githubConfig, featuredRepoNames } from "@/data/github";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export async function GitHubSection() {
  let repos: GitHubRepo[] = [];

  try {
    repos = await getGitHubRepos();
  } catch {
    repos = [];
  }

  const topRepos = featuredRepoNames
    .map((name) => repos.find((repo) => repo.name === name))
    .filter((repo): repo is GitHubRepo => Boolean(repo));

  return (
    <section id="github" className="mx-auto max-w-7xl px-6 py-20">
      <SectionTitle
        eyebrow="Build Log"
        title="Live GitHub projects and engineering activity"
        description="A dynamic snapshot of your public repositories, recent activity, and project footprint pulled directly from GitHub."
      />

      <div className="mb-8 flex justify-center">
        <a href={githubConfig.profileUrl} target="_blank" rel="noreferrer">
          <Button className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/80">
            <Github className="mr-2 h-4 w-4" />
            View GitHub Profile
          </Button>
        </a>
      </div>

      {topRepos.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {topRepos.map((repo) => (
            <Card
              key={repo.id}
              className="rounded-[2rem] border-border bg-card backdrop-blur-xl"
            >
              <CardContent className="p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                    <Github className="h-5 w-5 text-primary" />
                  </div>

                  {repo.language && (
                    <Badge className="rounded-full border border-border bg-card text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {repo.language}
                    </Badge>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-foreground">{repo.name}</h3>

                <p className="mt-3 min-h-[72px] text-sm leading-6 text-muted-foreground">
                  {repo.description || "Repository description will appear here from GitHub."}
                </p>

                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {repo.stargazers_count}
                  </div>
                  <div>Updated {formatDate(repo.updated_at)}</div>
                </div>

                <div className="mt-6">
                  <a href={repo.html_url} target="_blank" rel="noreferrer">
                    <Button
                      variant="outline"
                      className="rounded-full border-border bg-card text-foreground hover:bg-muted"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Repository
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-[2rem] border-border bg-card backdrop-blur-xl">
          <CardContent className="p-8 text-center text-muted-foreground">
            GitHub repositories could not be loaded right now. The rest of the portfolio is still working correctly.
          </CardContent>
        </Card>
      )}
    </section>
  );
}
