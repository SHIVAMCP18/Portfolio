import Image from "next/image";
import Link from "next/link";
import {
  Download,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { profile } from "@/data/profile";

export function HeroSection() {
  return (
    <section
      id="home"
      className="mx-auto grid min-h-[88vh] max-w-7xl items-center gap-12 px-6 py-14 md:grid-cols-[1.15fr_0.85fr] md:py-24"
    >
      <Reveal y={24} duration={600}>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Software Engineer
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-[11px] tracking-wide text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Open to Tokyo, Japan
          </div>
        </div>

        <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Hi, I&apos;m <span className="text-primary">{profile.name}</span>
        </h1>

        <p className="mt-5 max-w-3xl text-lg font-medium leading-relaxed text-foreground md:text-2xl">
          {profile.headline}
        </p>

        <p className="mt-3 text-xs uppercase tracking-[0.28em] text-primary/80">
          {profile.subHeadline}
        </p>

        <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          Specializing in distributed workflow engines, high-concurrency event pipelines,
          cloud microservices across AWS, GCP &amp; Azure, and applied AI/ML systems.
          Track record across 4 engineering internships and competitive algorithmic challenges.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <Link href="/projects">
            <Button className="rounded-full px-6 shadow-md shadow-primary/20">
              Explore 18 Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link href="/resume">
            <Button variant="outline" className="rounded-full px-6">
              Interactive Resume
            </Button>
          </Link>

          <a href={profile.resume} download target="_blank" rel="noreferrer">
            <Button variant="outline" className="rounded-full px-6 border-border">
              <Download className="mr-2 h-4 w-4" /> Download Resume
            </Button>
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> {profile.location}
          </div>

          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 transition hover:text-foreground"
          >
            <Linkedin className="h-4 w-4 text-primary" /> LinkedIn
          </a>

          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 transition hover:text-foreground"
          >
            <Github className="h-4 w-4 text-primary" /> GitHub
          </a>

          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-2 transition hover:text-foreground"
          >
            <Mail className="h-4 w-4 text-primary" /> Email
          </a>

          <a
            href={`tel:${profile.phone}`}
            className="flex items-center gap-2 transition hover:text-foreground"
          >
            <Phone className="h-4 w-4 text-primary" /> {profile.phone}
          </a>
        </div>
      </Reveal>

      <Reveal
        scale={0.95}
        duration={700}
        delay={100}
        className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-lg"
      >
        <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary/25 via-blue-500/10 to-purple-500/20 blur-3xl" />
        <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-border bg-card p-3 shadow-2xl backdrop-blur-xl">
          <div className="relative aspect-square w-full overflow-hidden rounded-[2rem]">
            <Image
              src={profile.heroImage}
              alt={profile.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover"
            />
          </div>
          <div className="mt-3 flex items-center justify-between px-3 py-1">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-foreground">Available for Roles</span>
            </div>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Ahmedabad &amp; Tokyo
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
