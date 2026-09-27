"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Thin reading-progress bar pinned to the top, plus a back-to-top button. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      const progress = max > 0 ? scrollTop / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
      setShowTop(scrollTop > 900);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]">
        <div
          ref={barRef}
          className="h-full origin-left bg-gradient-to-r from-primary via-rose-500 to-fuchsia-500"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 left-6 z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </>
  );
}
