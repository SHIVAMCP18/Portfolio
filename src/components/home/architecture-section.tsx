"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Pause, Play } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/layout/section-title";

type SystemNode = {
  title: string;
  tech: string;
  detail: string;
};

type SystemBlueprint = {
  id: string;
  label: string;
  heading: string;
  projectSlug: string;
  nodes: SystemNode[];
  rationale: { title: string; text: string }[];
};

const systems: SystemBlueprint[] = [
  {
    id: "flowforge",
    label: "DAG Orchestration",
    heading: "FlowForge — distributed workflow engine",
    projectSlug: "flowforge",
    nodes: [
      { title: "DAG Validation", tech: "Spring Boot", detail: "A level-by-level topological sort rejects cycles and unknown dependencies and computes which tasks can run in parallel." },
      { title: "READY Queue", tech: "PostgreSQL", detail: "Tasks whose dependencies have all succeeded become READY rows — the queue is just an indexed table, no broker needed." },
      { title: "Lease", tech: "SKIP LOCKED", detail: "Workers claim one READY row with FOR UPDATE SKIP LOCKED, so any number of workers and replicas poll without ever double-leasing." },
      { title: "Worker Pool", tech: "Go · K8s HPA", detail: "Go workers run the task's shell command with a hard timeout and its upstream outputs injected as environment variables." },
      { title: "Checkpoint", tech: "PostgreSQL", detail: "Output is persisted on success and downstream tasks are promoted; failed or cancelled runs resume from here." },
    ],
    rationale: [
      { title: "One database, no broker", text: "Postgres row locking replaces Kafka or Redis for task distribution, keeping operations simple." },
      { title: "Resume, don't restart", text: "Checkpointed outputs let a failed run skip every task that already succeeded." },
      { title: "Crash-safe by design", text: "A lease reaper reclaims work from dead workers, and late callbacks on reclaimed leases get a 409." },
    ],
  },
  {
    id: "streaming",
    label: "Real-Time Streaming",
    heading: "Clickstream analytics on GCP",
    projectSlug: "streaming-analytics-pipeline",
    nodes: [
      { title: "Event Ingress", tech: "Pub/Sub", detail: "Absorbs bursty clickstream traffic from web and mobile clients with durable, at-least-once delivery." },
      { title: "Windowing", tech: "Apache Beam", detail: "Dataflow applies tumbling and sliding windows with watermarks to handle late mobile events." },
      { title: "Dead-Letter", tech: "Pub/Sub DLQ", detail: "Malformed or schema-drifted events are routed aside so the main stream never stalls." },
      { title: "Serving Store", tech: "Bigtable", detail: "Low-latency key/value lookups for live session and profile aggregates." },
      { title: "Analytics", tech: "BigQuery", detail: "Partitioned warehouse tables for SQL analytics and dashboards." },
    ],
    rationale: [
      { title: "Dual sinks", text: "Bigtable serves real-time reads; BigQuery handles historical analytics — each optimized for its access pattern." },
      { title: "Event-time correctness", text: "Watermarks and triggers keep aggregates accurate even when events arrive late." },
      { title: "Failure isolation", text: "Bad records go to a DLQ for replay instead of blocking healthy traffic." },
    ],
  },
  {
    id: "webhooks",
    label: "Webhook Delivery",
    heading: "Reliable webhook dispatch at scale",
    projectSlug: "distributed-webhook-delivery",
    nodes: [
      { title: "Event API", tech: "Go", detail: "Accepts events from producers, validates payloads, and assigns an idempotency key." },
      { title: "HMAC Signer", tech: "SHA-256", detail: "Signs each payload so receivers can verify authenticity and integrity." },
      { title: "Delivery Queue", tech: "Kafka", detail: "Partitioned by endpoint to preserve per-customer ordering while scaling out." },
      { title: "Dispatchers", tech: "Go workers", detail: "Deliver over HTTP with timeouts; Redis idempotency keys stop duplicate sends." },
      { title: "Retry + DLQ", tech: "Backoff", detail: "Failures retry with exponential backoff and jitter, then land in a DLQ for replay." },
    ],
    rationale: [
      { title: "Slow receivers stay isolated", text: "Per-endpoint partitions mean one failing customer never delays others." },
      { title: "Safe retries", text: "Idempotency keys make at-least-once delivery behave like exactly-once for receivers." },
      { title: "Verifiable payloads", text: "HMAC signatures let consumers reject forged or tampered requests." },
    ],
  },
];

const STEP_MS = 2200;

export function ArchitectureSection() {
  const [systemIndex, setSystemIndex] = useState(0);
  const [activeNode, setActiveNode] = useState(0);
  const [playing, setPlaying] = useState(true);

  const system = systems[systemIndex];

  useEffect(() => {
    if (!playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % system.nodes.length);
    }, STEP_MS);
    return () => clearInterval(id);
  }, [playing, system.nodes.length]);

  function selectSystem(index: number) {
    setSystemIndex(index);
    setActiveNode(0);
  }

  const node = system.nodes[activeNode];

  return (
    <section id="systems" className="relative py-24">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-40 mask-radial" />
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          eyebrow="System Design"
          title="How I think about architecture"
          description="Interactive blueprints of systems I've built. Watch a request flow through each component, or click any node to see why it's there."
        />

        <Reveal y={16}>
          <div role="tablist" aria-label="Choose a system" className="mb-8 flex flex-wrap justify-center gap-2">
            {systems.map((item, index) => (
              <button
                key={item.id}
                role="tab"
                type="button"
                aria-selected={index === systemIndex}
                onClick={() => selectSystem(index)}
                className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all ${
                  index === systemIndex
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal y={24} delay={80}>
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card/80 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>
                <p className="font-mono text-xs text-muted-foreground">{system.heading}</p>
              </div>
              <button
                type="button"
                onClick={() => setPlaying((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:text-foreground"
                aria-label={playing ? "Pause flow animation" : "Play flow animation"}
              >
                {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {playing ? "Pause" : "Play"}
              </button>
            </div>

            {/* Flow diagram */}
            <div key={system.id} className="flex flex-col items-stretch gap-0 p-6 md:flex-row md:items-center md:p-10">
              {system.nodes.map((item, index) => {
                const isActive = index === activeNode;
                const isDone = index < activeNode;
                return (
                  <div key={item.title} className="flex flex-col items-center md:flex-1 md:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNode(index);
                        setPlaying(false);
                      }}
                      className={`relative w-full rounded-2xl border p-4 text-left transition-all duration-500 animate-in fade-in zoom-in-95 md:w-auto md:min-w-[9.5rem] ${
                        isActive
                          ? "scale-[1.04] border-primary bg-primary/10 shadow-lg shadow-primary/20"
                          : isDone
                            ? "border-primary/30 bg-card"
                            : "border-border bg-card hover:border-primary/40"
                      }`}
                      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
                    >
                      {isActive && (
                        <span className="absolute -right-1 -top-1 flex h-3 w-3">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                          <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-primary">0{index + 1}</span>
                      <p className="mt-1 text-sm font-bold text-foreground">{item.title}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{item.tech}</p>
                    </button>

                    {index < system.nodes.length - 1 && (
                      <div className="relative flex h-10 w-px items-center justify-center md:h-px md:w-auto md:flex-1 md:min-w-6">
                        <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
                          <line
                            x1="0"
                            y1="0"
                            x2="100%"
                            y2="100%"
                            className={`${isDone || isActive ? "stroke-primary" : "stroke-border"} animate-dash`}
                            strokeWidth="2"
                            strokeDasharray="4 6"
                          />
                        </svg>
                        {isActive && playing && (
                          <span className="packet absolute h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Detail + rationale */}
            <div className="grid gap-6 border-t border-border bg-muted/30 p-6 md:grid-cols-[1fr_1.2fr] md:p-8">
              <div key={`${system.id}-${activeNode}`} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Step {activeNode + 1} · {node.tech}
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground">{node.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{node.detail}</p>
                <Link
                  href={`/projects/${system.projectSlug}`}
                  className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary"
                >
                  Read the full case study
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="grid gap-3">
                {system.rationale.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
