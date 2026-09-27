import Link from "next/link";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div>
          <p className="text-base font-semibold text-foreground">{profile.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Distributed Systems • Cloud-Native Architecture • Applied AI & ML • Data Pipelines
          </p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            Ahmedabad, India • Open to relocation to Tokyo, Japan
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground">
          <Link href="/resume" className="transition hover:text-foreground">
            <span className="inline-flex items-center gap-2">
              <FileText className="h-4 w-4" /> Resume
            </span>
          </Link>
          <Link href="/projects" className="transition hover:text-foreground">
            <span className="inline-flex items-center gap-2">
              Projects Archive
            </span>
          </Link>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="transition hover:scale-110 hover:text-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <Github className="h-4 w-4" /> GitHub
            </span>
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="transition hover:scale-110 hover:text-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </span>
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="transition hover:scale-110 hover:text-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
