"use client";

import Image from "next/image";
import Link from "next/link";
import { Moon, Sun, FileText } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "Internships", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Systems", href: "/#systems" },
  { label: "Leadership", href: "/#leadership" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 backdrop-blur-md sm:px-6">
      <Link href="/" className="flex min-w-0 items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-primary/30 bg-card shadow-sm">
          <Image
            src={profile.heroImage}
            alt={profile.name}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-wide text-foreground">
            {profile.name}
          </p>
          <p className="hidden text-[10px] uppercase tracking-[0.28em] text-primary sm:block">
            Software Engineer
          </p>
        </div>
      </Link>

      <nav className="hidden items-center gap-6 md:flex">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-xs font-medium text-muted-foreground transition hover:text-foreground"
          >
            {item.label}
          </a>
        ))}
        <Link
          href="/resume"
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
        >
          <FileText className="h-3 w-3" />
          Resume
        </Link>
      </nav>

      <div className="flex items-center gap-2">
        <Link href="/resume" className="md:hidden">
          <Button variant="outline" size="sm" className="rounded-full text-xs">
            Resume
          </Button>
        </Link>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
