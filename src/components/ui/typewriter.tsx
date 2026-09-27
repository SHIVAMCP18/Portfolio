"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pause?: number;
  className?: string;
};

export function Typewriter({
  words,
  typingSpeed = 70,
  deletingSpeed = 35,
  pause = 1800,
  className,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(words[0] ?? "");
  const [deleting, setDeleting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Show the first word fully on load, then start cycling.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setStarted(true), pause);
    return () => clearTimeout(id);
  }, [pause]);

  useEffect(() => {
    if (!started || words.length < 2) return;
    const current = words[index % words.length];

    if (!deleting && text === current) {
      const id = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(id);
    }

    const id = setTimeout(
      () => {
        const nextText = deleting
          ? current.slice(0, text.length - 1)
          : current.slice(0, text.length + 1);
        setText(nextText);
        if (deleting && nextText === "") {
          setDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        }
      },
      deleting ? deletingSpeed : typingSpeed,
    );
    return () => clearTimeout(id);
  }, [started, text, deleting, index, words, typingSpeed, deletingSpeed, pause]);

  return (
    <span className={className} aria-label={words.join(", ")}>
      <span aria-hidden>{text}</span>
      <span aria-hidden className="ml-0.5 inline-block w-[2px] animate-caret self-stretch bg-primary align-middle" style={{ height: "1em" }} />
    </span>
  );
}
