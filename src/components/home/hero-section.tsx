import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Typewriter } from "@/components/ui/typewriter";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { allProjects } from "@/data/projects";
import { certificates } from "@/data/certificates";
import { education } from "@/data/education";
import { marqueeTech } from "@/data/skills";

const stats = [
  { value: experience.length, label: "Internships", suffix: "" },
  { value: allProjects.length, label: "Projects built", suffix: "+" },
  { value: certificates.length, label: "Certifications", suffix: "+" },
  { value: education[0].gpaValue, label: "CGPA / 10", suffix: "", decimals: 2 },
];

const socials = [
  { href: profile.github, label: "GitHub", icon: Github },
  { href: profile.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: `mailto:${profile.email}`, label: "Email", icon: Mail },
];

export function HeroSection() {
  return (
    <section id="home" className="relative isolate overflow-hidden">
      {/* Animated backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-radial opacity-70" />
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-primary/25 blur-3xl animate-blob" />
        <div
          className="absolute right-0 top-40 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-3xl animate-blob"
          style={{ animationDelay: "-5s" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl animate-blob"
          style={{ animationDelay: "-9s" }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-16 pt-12 md:grid-cols-[1.2fr_0.8fr] md:pb-24 md:pt-20">
        <div>
          <Reveal y={20} duration={700}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {profile.availability}
            </div>
          </Reveal>

          <Reveal y={24} delay={80} duration={700} blur>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
              Hi, I&apos;m <span className="text-gradient">{profile.firstName}</span>
              <span className="inline-block origin-[70%_70%] animate-[wave_2.4s_ease-in-out_1]">👋</span>
            </h1>
          </Reveal>

          <Reveal y={20} delay={160} duration={700}>
            <p className="mt-5 flex min-h-[2.5rem] flex-wrap items-center gap-x-2 text-xl font-medium text-foreground/90 md:text-3xl">
              <span className="text-muted-foreground">I work as a</span>
              <Typewriter words={profile.roles} className="font-semibold text-primary" />
            </p>
          </Reveal>

          <Reveal y={20} delay={240} duration={700}>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground text-pretty md:text-lg">
              {profile.summary}
            </p>
          </Reveal>

          <Reveal y={20} delay={320} duration={700}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#projects">
                <Button size="lg" className="group h-11 rounded-full px-6 shadow-lg shadow-primary/25">
                  View my work
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href={profile.resume} download>
                <Button size="lg" variant="outline" className="h-11 rounded-full px-6">
                  <Download /> Download resume
                </Button>
              </a>
              <Link href="#contact">
                <Button size="lg" variant="ghost" className="h-11 rounded-full px-5">
                  Get in touch
                </Button>
              </Link>
            </div>
          </Reveal>

          <Reveal y={16} delay={400} duration={700}>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" /> {profile.location}
              </span>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <div className="flex items-center gap-2">
                {socials.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/70 transition hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal scale={0.94} y={0} delay={200} duration={900} className="relative mx-auto w-full max-w-sm md:max-w-md">
          <div className="animate-float">
            <div
              aria-hidden
              className="absolute -inset-3 rounded-[2.75rem] bg-[conic-gradient(from_0deg,var(--primary),transparent_30%,oklch(0.66_0.19_350)_55%,transparent_80%,var(--primary))] opacity-60 blur-md animate-spin-slow"
            />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-3 shadow-2xl">
              <div className="relative aspect-square w-full overflow-hidden rounded-[2rem]">
                <Image
                  src={profile.heroImage}
                  alt={profile.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 450px"
                  className="object-cover transition duration-700 hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between px-3 pb-1 pt-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{profile.name}</p>
                  <p className="text-xs text-muted-foreground">{profile.title}</p>
                </div>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[10px] text-primary">
                  {education[0].school}
                </span>
              </div>
            </div>

            {/* Floating code chip */}
            <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-border bg-card/95 px-4 py-3 font-mono text-[11px] leading-5 shadow-xl backdrop-blur sm:block">
              <span className="text-fuchsia-500">const</span> <span className="text-foreground">engineer</span> = {"{"}
              <br />
              &nbsp;&nbsp;<span className="text-sky-500">ships</span>: <span className="text-emerald-500">&quot;reliable systems&quot;</span>,
              <br />
              &nbsp;&nbsp;<span className="text-sky-500">learning</span>: <span className="text-primary">true</span>
              <br />
              {"}"}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-7xl px-6">
        <Reveal y={20}>
          <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-border bg-card/70 backdrop-blur md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`p-6 text-center ${index % 2 === 0 ? "border-r" : ""} ${index < 2 ? "border-b md:border-b-0" : ""} border-border md:border-r md:last:border-r-0`}
              >
                <AnimatedCounter
                  value={stat.value}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                  className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                />
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Tech marquee */}
      <div className="mask-fade-x mt-12 overflow-hidden py-2">
        <div className="flex w-max animate-marquee gap-3">
          {[...marqueeTech, ...marqueeTech].map((tech, index) => (
            <span
              key={`${tech}-${index}`}
              aria-hidden={index >= marqueeTech.length}
              className="whitespace-nowrap rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-medium text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
