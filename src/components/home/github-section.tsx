import { ArrowUpRight, Github, Star } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/layout/section-title";
import { getGitHubRepos, type GitHubRepo } from "@/lib/github";
import { githubConfig, featuredRepoNames, githubDescriptionOverrides } from "@/data/github";

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  "C++": "#f34b7d",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "Jupyter Notebook": "#DA5B0B",
  Shell: "#89e051",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

type RepoCard = {
  name: string;
  url: string;
  description: string;
  language: string | null;
  stars: number | null;
  updated: string | null;
};

function toCard(repo: GitHubRepo): RepoCard {
  return {
    name: repo.name,
    url: repo.html_url,
    description: repo.description ?? "",
    language: repo.language,
    stars: repo.stargazers_count,
    updated: repo.updated_at,
  };
}

// Used when the GitHub API is unavailable (e.g. rate limited at build time).
const fallbackCards: RepoCard[] = featuredRepoNames.map((name) => ({
  name,
  url: `${githubConfig.profileUrl}/${name}`,
  description: githubDescriptionOverrides[name] ?? "",
  language: null,
  stars: null,
  updated: null,
}));

export async function GitHubSection() {
  let repos: GitHubRepo[] = [];
  try {
    repos = await getGitHubRepos();
  } catch {
    repos = [];
  }

  const live = featuredRepoNames
    .map((name) => repos.find((repo) => repo.name === name))
    .filter((repo): repo is GitHubRepo => Boolean(repo))
    .map(toCard);
  const cards = live.length > 0 ? live : fallbackCards;

  return (
    <section id="github" className="mx-auto max-w-7xl px-6 py-24">
      <SectionTitle
        eyebrow="Open Source"
        title="Code on GitHub"
        description={
          repos.length > 0
            ? `${repos.length} public repositories — here are a few highlights, synced live from GitHub.`
            : "A few highlighted repositories. Browse the full list on my GitHub profile."
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((repo, index) => (
          <Reveal key={repo.name} y={20} delay={(index % 3) * 70} className="h-full">
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex min-w-0 items-center gap-2 font-mono text-sm font-semibold text-foreground">
                  <Github className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate group-hover:text-primary">{repo.name}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{repo.description}</p>
              {(repo.language || repo.stars !== null) && (
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  {repo.language && (
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: languageColors[repo.language] ?? "var(--primary)" }}
                      />
                      {repo.language}
                    </span>
                  )}
                  {repo.stars !== null && (
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" /> {repo.stars}
                    </span>
                  )}
                  {repo.updated && <span>Updated {formatDate(repo.updated)}</span>}
                </div>
              )}
            </a>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <a
          href={githubConfig.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
        >
          <Github className="h-4 w-4" /> @{githubConfig.username}
        </a>
      </div>
    </section>
  );
}
