"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Award,
  Briefcase,
  Copy,
  FileText,
  FolderGit2,
  Github,
  Home,
  Linkedin,
  Mail,
  Moon,
  Search,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { profile } from "@/data/profile";
import { allProjects } from "@/data/projects";

type Command = {
  id: string;
  label: string;
  group: "Navigate" | "Projects" | "Actions";
  icon: typeof Home;
  keywords?: string;
  run: () => void;
};

export const OPEN_PALETTE_EVENT = "open-command-palette";

export function CommandPalette() {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => router.push(href);
    const external = (href: string) => () => window.open(href, "_blank", "noopener,noreferrer");

    return [
      { id: "home", label: "Home", group: "Navigate", icon: Home, run: go("/") },
      { id: "experience", label: "Experience", group: "Navigate", icon: Briefcase, keywords: "internships work", run: go("/#experience") },
      { id: "projects", label: "All projects", group: "Navigate", icon: FolderGit2, run: go("/projects") },
      { id: "resume", label: "Resume", group: "Navigate", icon: FileText, keywords: "cv", run: go("/resume") },
      { id: "notes", label: "Engineering notes", group: "Navigate", icon: BookOpen, keywords: "blog articles", run: go("/notes") },
      { id: "certificates", label: "Certificates", group: "Navigate", icon: Award, run: go("/certificates") },
      { id: "contact", label: "Contact", group: "Navigate", icon: Mail, run: go("/#contact") },
      ...allProjects.map<Command>((project) => ({
        id: `project-${project.slug}`,
        label: project.title,
        group: "Projects",
        icon: FolderGit2,
        keywords: `${project.category} ${project.stack.join(" ")}`,
        run: go(`/projects/${project.slug}`),
      })),
      {
        id: "copy-email",
        label: "Copy email address",
        group: "Actions",
        icon: Copy,
        run: () => {
          navigator.clipboard?.writeText(profile.email).then(
            () => setToast("Email copied to clipboard"),
            () => setToast(profile.email),
          );
        },
      },
      { id: "theme", label: "Toggle dark / light theme", group: "Actions", icon: Moon, run: toggleTheme },
      { id: "github", label: "Open GitHub", group: "Actions", icon: Github, run: external(profile.github) },
      { id: "linkedin", label: "Open LinkedIn", group: "Actions", icon: Linkedin, run: external(profile.linkedin) },
      { id: "download", label: "Download resume (PDF)", group: "Actions", icon: FileText, run: external(profile.resume) },
    ];
  }, [router, toggleTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands.filter((command) => command.group !== "Projects").concat(commands.filter((c) => c.group === "Projects").slice(0, 4));
    return commands.filter((command) =>
      `${command.label} ${command.keywords ?? ""}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function runCommand(command: Command | undefined) {
    if (!command) return;
    close();
    command.run();
  }

  function onInputKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      runCommand(filtered[active]);
    } else if (event.key === "Escape") {
      close();
    }
  }

  let lastGroup = "";

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-background/60 px-4 pt-[12vh] backdrop-blur-sm animate-in fade-in duration-150"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl animate-in zoom-in-95 slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Search pages, projects, or actions…"
                className="h-14 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                aria-label="Search commands"
              />
              <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
                ESC
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No results for &ldquo;{query}&rdquo;
                </p>
              )}
              {filtered.map((command, index) => {
                const Icon = command.icon;
                const showHeader = command.group !== lastGroup;
                lastGroup = command.group;
                return (
                  <div key={command.id}>
                    {showHeader && (
                      <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {command.group}
                      </p>
                    )}
                    <button
                      type="button"
                      data-index={index}
                      onMouseMove={() => setActive(index)}
                      onClick={() => runCommand(command)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                        index === active ? "bg-primary/10 text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${index === active ? "text-primary" : ""}`} />
                      <span className="flex-1 truncate">{command.label}</span>
                      {index === active && <ArrowRight className="h-3.5 w-3.5 text-primary" />}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
              <span>↑↓ to navigate · ↵ to select</span>
              <span>⌘K / Ctrl K</span>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-[100] -translate-x-1/2 rounded-full border border-border bg-popover px-4 py-2 text-sm text-foreground shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </>
  );
}
