"use client";

import { useState } from "react";
import { Check, Copy, Github, Linkedin, Loader2, Mail, MapPin, Send } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { profile } from "@/data/profile";

const MESSAGE_LIMIT = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormState = { name: string; email: string; message: string };
type Status = { type: "success" | "error" | null; text: string };

const inputClass =
  "w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10";

export function ContactSection() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>({ type: null, text: "" });

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status.type === "error") setStatus({ type: null, text: "" });
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: "error", text: "Please fill in all fields." });
      return;
    }
    if (!EMAIL_PATTERN.test(form.email.trim())) {
      setStatus({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    setStatus({ type: null, text: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", text: data.error || "Something went wrong." });
      } else {
        setStatus({ type: "success", text: "Thanks! Your message is on its way — I'll get back to you soon." });
        setForm({ name: "", email: "", message: "" });
      }
    } catch {
      setStatus({
        type: "error",
        text: `Unable to send right now. Please email me directly at ${profile.email}.`,
      });
    } finally {
      setLoading(false);
    }
  }

  const channels = [
    { label: "LinkedIn", value: profile.linkedinHandle, href: profile.linkedin, icon: Linkedin },
    { label: "GitHub", value: `github.com/${profile.githubHandle}`, href: profile.github, icon: Github },
    { label: "Location", value: profile.location, icon: MapPin },
  ];

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-24">
      <Reveal y={24}>
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 md:p-12">
          <div aria-hidden className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl animate-blob" />
          <div
            aria-hidden
            className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl animate-blob"
            style={{ animationDelay: "-6s" }}
          />

          <div className="relative grid gap-10 md:grid-cols-[1fr_1fr]">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Contact</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground text-balance md:text-5xl">
                Let&apos;s build something great together.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-muted-foreground">
                I&apos;m currently looking for software engineering opportunities — backend, full-stack, data, or
                platform roles. Whether you have a role, a question, or just want to say hi, my inbox is open.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-background/60 p-2 pl-4">
                <Mail className="h-4 w-4 text-primary" />
                <a href={`mailto:${profile.email}`} className="min-w-0 flex-1 truncate text-sm font-medium text-foreground hover:text-primary">
                  {profile.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition hover:bg-primary/85"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="mt-4 grid gap-2">
                {channels.map(({ label, value, href, icon: Icon }) => {
                  const content = (
                    <>
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="w-20 text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
                      <span className="truncate text-sm text-foreground">{value}</span>
                    </>
                  );
                  return href ? (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-xl px-4 py-2.5 transition hover:bg-muted"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={label} className="flex items-center gap-3 px-4 py-2.5">
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-[1.5rem] border border-border bg-background/40 p-6 backdrop-blur">
              <h3 className="text-xl font-semibold text-foreground">Send a message</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-medium text-muted-foreground">
                  Name
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-1.5 text-xs font-medium text-muted-foreground">
                  Email
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="jane@company.com"
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="grid flex-1 gap-1.5 text-xs font-medium text-muted-foreground">
                <span className="flex justify-between">
                  Message
                  <span className={form.message.length > MESSAGE_LIMIT * 0.9 ? "text-destructive" : ""}>
                    {form.message.length}/{MESSAGE_LIMIT}
                  </span>
                </span>
                <textarea
                  rows={7}
                  maxLength={MESSAGE_LIMIT}
                  placeholder="Tell me about the role or project…"
                  value={form.message}
                  onChange={(event) => update("message", event.target.value)}
                  className={`${inputClass} min-h-[180px] flex-1 resize-y`}
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <div aria-live="polite">
                {status.type && (
                  <div
                    className={`rounded-xl px-4 py-3 text-sm animate-in fade-in slide-in-from-bottom-1 ${
                      status.type === "success"
                        ? "border border-success/20 bg-success/10 text-success"
                        : "border border-destructive/20 bg-destructive/10 text-destructive"
                    }`}
                  >
                    {status.text}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
