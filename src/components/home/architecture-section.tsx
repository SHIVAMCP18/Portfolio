"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/layout/section-title";

interface NodeData {
  id: string;
  title: string;
  subtitle: string;
  x: string;
  y: string;
  tech: string;
}

const flowforgeNodes: NodeData[] = [
  {
    id: "api",
    title: "DAG Ingestion",
    subtitle: "Job payload & dependency validation.",
    x: "10%",
    y: "62%",
    tech: "REST / gRPC",
  },
  {
    id: "kafka",
    title: "Kafka Bus",
    subtitle: "Partitioned event queues.",
    x: "30%",
    y: "28%",
    tech: "Apache Kafka",
  },
  {
    id: "workers",
    title: "Worker Cluster",
    subtitle: "Concurrent Go & Java daemons.",
    x: "50%",
    y: "62%",
    tech: "Go / Kubernetes",
  },
  {
    id: "redis",
    title: "Redis Lease",
    subtitle: "Distributed locks & idempotency.",
    x: "70%",
    y: "28%",
    tech: "Redis Cluster",
  },
  {
    id: "db",
    title: "State Checkpoint",
    subtitle: "Durable DAG atomic history.",
    x: "90%",
    y: "62%",
    tech: "PostgreSQL",
  },
];

const streamingNodes: NodeData[] = [
  {
    id: "pubsub",
    title: "Clickstream",
    subtitle: "High-throughput ingress buffer.",
    x: "10%",
    y: "62%",
    tech: "GCP Pub/Sub",
  },
  {
    id: "beam",
    title: "Dataflow (Beam)",
    subtitle: "Tumbling & sliding windows.",
    x: "32%",
    y: "28%",
    tech: "Apache Beam",
  },
  {
    id: "dlq",
    title: "Dead-Letter Queue",
    subtitle: "Schema drift & error isolation.",
    x: "52%",
    y: "62%",
    tech: "Pub/Sub DLQ",
  },
  {
    id: "bigtable",
    title: "Bigtable KV",
    subtitle: "Sub-10ms profile serving.",
    x: "72%",
    y: "28%",
    tech: "Cloud Bigtable",
  },
  {
    id: "bigquery",
    title: "BigQuery",
    subtitle: "Real-time SQL OLAP analytics.",
    x: "90%",
    y: "62%",
    tech: "Google BigQuery",
  },
];

export function ArchitectureSection() {
  const [activeSystem, setActiveSystem] = useState<"flowforge" | "streaming">("flowforge");

  const nodes = activeSystem === "flowforge" ? flowforgeNodes : streamingNodes;

  return (
    <section id="systems" className="mx-auto max-w-7xl px-6 py-20">
      <SectionTitle
        eyebrow="System Architecture"
        title="Interactive distributed architecture blueprints"
        description="Visualizing high-concurrency event pipelines, asynchronous decoupling, and fault-tolerant state orchestration."
      />

      {/* Mode Switcher */}
      <div className="mt-8 mb-10 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => setActiveSystem("flowforge")}
          className={`cursor-pointer rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all ${
            activeSystem === "flowforge"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
              : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          FlowForge: DAG Orchestration Engine
        </button>
        <button
          type="button"
          onClick={() => setActiveSystem("streaming")}
          className={`cursor-pointer rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all ${
            activeSystem === "streaming"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
              : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Real-Time Streaming Analytics Pipeline
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden rounded-[2rem] border-border bg-card shadow-sm backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {activeSystem === "flowforge" ? "DAG Workflow Orchestration" : "GCP Stream Processing"}
                </p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                  {activeSystem === "flowforge"
                    ? "Distributed Execution Pipeline"
                    : "Low-Latency Event Streaming Flow"}
                </h3>
              </div>

              <Badge className="rounded-full border border-border bg-muted/60 text-[10px] uppercase tracking-wider text-muted-foreground">
                Live Dataflow Visualizer
              </Badge>
            </div>

            {/* Interactive Graph */}
            <div className="relative h-[26rem] overflow-hidden rounded-[1.75rem] border border-border bg-muted/30">
              <svg
                className="absolute inset-0 h-full w-full text-primary"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M10 62 C20 50, 24 32, 31 28 S43 48, 51 62 S61 42, 71 28 S81 48, 90 62"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.4"
                  strokeDasharray="2 2"
                  className="opacity-40 animate-pulse"
                />
              </svg>

              {nodes.map((node, index) => (
                <div
                  key={`${activeSystem}-${node.id}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                  style={{ left: node.x, top: node.y }}
                >
                  <div className="h-32 w-28 overflow-hidden rounded-[1.2rem] border border-border bg-card/95 p-3 shadow-md backdrop-blur hover:border-primary/50 hover:shadow-lg transition">
                    <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-[10px] font-bold text-primary">
                      0{index + 1}
                    </div>
                    <h4 className="text-[12px] font-bold leading-tight text-foreground">
                      {node.title}
                    </h4>
                    <p className="mt-1 text-[10px] leading-3.5 text-muted-foreground line-clamp-2">
                      {node.subtitle}
                    </p>
                    <span className="mt-2 block text-[9px] font-mono font-medium text-primary/80">
                      {node.tech}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Rationale Card */}
        <Card className="rounded-[2rem] border-border bg-card shadow-sm backdrop-blur-xl">
          <CardContent className="p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Engineering Rationale
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              Production-Grade System Thinking
            </h3>

            <div className="mt-6 space-y-3.5 text-sm leading-relaxed text-muted-foreground">
              {activeSystem === "flowforge" ? (
                <>
                  <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                    <strong className="text-foreground font-semibold">Decoupled Ingestion &amp; Execution:</strong> Kafka buffers task messages so burst submissions never overload execution workers.
                  </div>
                  <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                    <strong className="text-foreground font-semibold">Atomic Checkpoints:</strong> PostgreSQL stores persistent node states after every dependency resolution, allowing crash recovery without re-executing completed DAG stages.
                  </div>
                  <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                    <strong className="text-foreground font-semibold">Distributed Locking:</strong> Redis manages worker lease heartbeats and avoids duplicate task execution across multiple Kubernetes pods.
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                    <strong className="text-foreground font-semibold">Dual-Sink Separation:</strong> Bigtable serves real-time low-latency customer lookups, while BigQuery captures long-term data for analytics.
                  </div>
                  <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                    <strong className="text-foreground font-semibold">Windowing &amp; Late Data:</strong> Apache Beam on Dataflow applies tumbling windows with watermark tracking to handle delayed mobile events reliably.
                  </div>
                  <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                    <strong className="text-foreground font-semibold">Schema Drift Isolation:</strong> Unrecognized or malformed payloads route to dead-letter queues without stalling active data streams.
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
