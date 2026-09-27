"use client";

import { useState } from "react";
import { Github, Linkedin, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

export function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({
    type: null,
    text: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, text: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({
          type: "error",
          text: data.error || "Something went wrong.",
        });
      } else {
        setStatus({
          type: "success",
          text: data.message || "Message sent successfully.",
        });
        setForm({
          name: "",
          email: "",
          message: "",
        });
      }
    } catch {
      setStatus({
        type: "error",
        text: "Unable to send message right now.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-20">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-card p-8 md:p-10">
        <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-stretch">
          <div className="flex h-full flex-col">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Contact
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              Interested in backend, distributed systems, or AI engineering
              opportunities?
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              Let’s build something scalable. Reach out directly through the
              form or connect through LinkedIn, GitHub, or email.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href={`mailto:${profile.email}`}>
                <Button className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/80">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Me
                </Button>
              </a>

              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                <Button
                  variant="outline"
                  className="rounded-full border-border bg-card px-6 text-foreground hover:bg-muted"
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </Button>
              </a>

              <a href={profile.github} target="_blank" rel="noreferrer">
                <Button
                  variant="outline"
                  className="rounded-full border-border bg-card px-6 text-foreground hover:bg-muted"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </a>
            </div>

            <div className="mt-8 flex-1 rounded-[1.75rem] border border-border bg-muted p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Quick Contact Card
                </h3>
              </div>

              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="rounded-2xl border border-border bg-muted p-4">
                  Email: {profile.email}
                </div>
                <div className="rounded-2xl border border-border bg-muted p-4">
                  LinkedIn:{" "}
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    linkedin.com/in/shivamcp
                  </a>
                </div>
                <div className="rounded-2xl border border-border bg-muted p-4">
                  GitHub:{" "}
                  <a href={profile.github} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    github.com/SHIVAMCP18
                  </a>
                </div>
                <div className="rounded-2xl border border-border bg-muted p-4">
                  Location: {profile.location}
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex h-full flex-col rounded-[1.75rem] border border-border bg-muted p-6"
          >
            <h3 className="text-xl font-semibold text-foreground">Send a message</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Fill this out and submit directly from the portfolio.
            </p>

            <div className="mt-6 flex flex-1 flex-col gap-4">
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />

              <input
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />

              <textarea
                placeholder="Your message"
                rows={10}
                value={form.message}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, message: e.target.value }))
                }
                className="min-h-[260px] w-full flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />

              <Button
                type="submit"
                disabled={loading}
                className="mt-auto w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/80"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>

              {status.type && (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
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
    </section>
  );
}
