"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { profile } from "@/data/profile";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "What's your experience?",
  "Which projects use Kafka?",
  "What's your tech stack?",
  "Are you open to new roles?",
];

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm ${profile.firstName}'s portfolio assistant. Ask me about experience, projects, skills, education, or how to get in touch.`,
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const userMessage = text.trim();
    if (!userMessage || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? "No response received." }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong while contacting the assistant." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const showSuggestions = messages.length <= 1 && !loading;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close assistant" : "Open portfolio assistant"}
        aria-expanded={open}
        className="group fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 transition hover:scale-105"
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-20" />}
        <span className={`transition-transform duration-300 ${open ? "rotate-90" : ""}`}>
          {open ? <X className="h-5 w-5" /> : <Bot className="h-6 w-6" />}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Portfolio assistant"
          className="fixed bottom-24 right-4 z-[60] flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-border bg-popover shadow-2xl animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-300 sm:right-6"
        >
          <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-primary/10 to-transparent px-4 py-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Ask about {profile.firstName}</p>
              <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Answers from this portfolio
              </p>
            </div>
          </div>

          <div ref={scrollRef} className="max-h-[22rem] min-h-[14rem] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-6 animate-in fade-in slide-in-from-bottom-1 ${
                  message.role === "user"
                    ? "ml-auto rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md border border-border bg-card text-foreground"
                }`}
              >
                {message.content}
              </div>
            ))}

            {loading && (
              <div className="flex w-16 items-center justify-center gap-1 rounded-2xl rounded-bl-md border border-border bg-card px-3 py-3.5">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            )}

            {showSuggestions && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs text-primary transition hover:bg-primary/15"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={500}
              placeholder="Ask a question…"
              aria-label="Your question"
              className="flex-1 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/85 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
