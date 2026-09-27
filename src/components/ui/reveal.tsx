"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
  blur?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Reveal({
  children,
  delay = 0,
  duration = 600,
  y = 16,
  x,
  scale,
  blur = false,
  className,
  style: externalStyle,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenTransform =
    [
      x !== undefined ? `translateX(${x}px)` : "",
      y ? `translateY(${y}px)` : "",
      scale !== undefined ? `scale(${scale})` : "",
    ]
      .filter(Boolean)
      .join(" ") || "none";

  const easing = "cubic-bezier(0.22, 1, 0.36, 1)";
  const style: CSSProperties = {
    ...externalStyle,
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : hiddenTransform,
    filter: blur ? (visible ? "blur(0)" : "blur(8px)") : undefined,
    transition: `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms, filter ${duration}ms ${easing} ${delay}ms`,
    willChange: visible ? undefined : "opacity, transform",
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
