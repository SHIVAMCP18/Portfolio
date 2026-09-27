"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  scale?: number;
  className?: string;
  style?: CSSProperties;
};

export function Reveal({
  children,
  delay = 0,
  duration = 450,
  y,
  scale,
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
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenTransform = [
    y !== undefined ? `translateY(${y}px)` : "",
    scale !== undefined ? `scale(${scale})` : "",
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const style: CSSProperties = {
    ...externalStyle,
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0) scale(1)" : hiddenTransform,
    transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
