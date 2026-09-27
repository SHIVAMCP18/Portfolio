"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Search, Sun, X, FileText } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { OPEN_PALETTE_EVENT } from "@/components/layout/command-palette";
import { profile } from "@/data/profile";

const navItems = [
  { label: "About", id: "home" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Systems", id: "systems" },
  { label: "Skills", id: "skills" },
  { label: "Contact", id: "contact" },
];

export function Navbar() {
  const { toggleTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view (home page only).
  useEffect(() => {
    if (pathname !== "/") return;
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isHome = pathname === "/";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled || menuOpen
          ? "border-b border-border/60 bg-background/75 shadow-sm backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-3" onClick={() => setMenuOpen(false)}>
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-primary/30 bg-card shadow-sm transition group-hover:scale-105">
            <Image src={profile.heroImage} alt={profile.name} fill sizes="40px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-wide text-foreground">{profile.name}</p>
            <p className="hidden text-[10px] uppercase tracking-[0.28em] text-primary sm:block">{profile.title}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-card/50 p-1 backdrop-blur lg:flex">
          {navItems.map((item) => {
            const active = isHome && activeId === item.id;
            return (
              <a
                key={item.id}
                href={`/#${item.id}`}
                className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            className="hidden items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground sm:flex"
            aria-label="Open command palette"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="rounded border border-border bg-muted px-1 font-mono text-[10px]">⌘K</kbd>
          </button>

          <Link
            href="/resume"
            className="hidden items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary hover:text-primary-foreground md:inline-flex"
          >
            <FileText className="h-3.5 w-3.5" />
            Resume
          </Link>

          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-card/60 text-foreground transition hover:border-primary/40"
          >
            <Sun className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
            <Moon className="absolute h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
          </button>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/60 text-foreground lg:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-border/60 px-4 pb-5 pt-2 animate-in fade-in slide-in-from-top-2 duration-200 lg:hidden">
          <div className="grid gap-1">
            {navItems.map((item, index) => (
              <a
                key={item.id}
                href={`/#${item.id}`}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted animate-in fade-in slide-in-from-left-2"
                style={{ animationDelay: `${index * 30}ms`, animationFillMode: "both" }}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href="/resume"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground"
              >
                Resume
              </Link>
              <Link
                href="/projects"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl border border-border px-3 py-2.5 text-center text-sm font-medium text-foreground"
              >
                All projects
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
