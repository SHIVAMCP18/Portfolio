"use client";

import { useRef, type ComponentProps, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

/** A card surface with a soft glow that follows the cursor. */
export function SpotlightCard({ className, children, onMouseMove, ...props }: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--x", `${event.clientX - rect.left}px`);
      el.style.setProperty("--y", `${event.clientY - rect.top}px`);
    }
    onMouseMove?.(event);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        "spotlight rounded-[1.75rem] border border-border bg-card text-card-foreground shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
