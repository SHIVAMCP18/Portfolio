"use client";

import { useState } from "react";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m Shivam’s AI assistant. Ask me about his internships at Adani Group, Disha, Nexus, or Maruti, his 18 projects (FlowForge, VoiceIQ, Streaming Pipeline, etc.), tech stack, competitive achievements, or contact details!",
    },
  ]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "No response received." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong while contacting the assistant.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg backdrop-blur-xl transition hover:bg-muted"
      >
        {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[60] w-[22rem] overflow-hidden rounded-[1.5rem] border border-border bg-popover shadow-xl backdrop-blur-xl">
          <div className="border-b border-border px-4 py-4">
            <p className="text-sm font-semibold text-foreground">Ask Aryan</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ask about experience, projects, skills, or certifications
            </p>
          </div>

          <div className="max-h-[22rem] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-auto bg-primary/20 text-primary"
                    : "bg-card text-foreground"
                }`}
              >
                {message.content}
              </div>
            ))}

            {loading && (
              <div className="max-w-[85%] rounded-2xl bg-card px-4 py-3 text-sm text-muted-foreground">
                Thinking...
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Ask about Kafka, projects, or experience..."
              className="flex-1 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleSend}
              disabled={loading}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/80"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}