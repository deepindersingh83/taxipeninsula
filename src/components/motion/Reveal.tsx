"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before animating in — use to stagger siblings. */
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Distance travelled, in pixels. */
  distance?: number;
  as?: "div" | "section" | "li" | "article" | "span";
};

const offsets = {
  up: (d: number) => ({ y: d, x: 0 }),
  down: (d: number) => ({ y: -d, x: 0 }),
  left: (d: number) => ({ x: d, y: 0 }),
  right: (d: number) => ({ x: -d, y: 0 }),
  none: () => ({ x: 0, y: 0 }),
};

/**
 * Fades content in as it scrolls into view. Honours `prefers-reduced-motion`
 * by rendering the final state immediately rather than animating.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 24,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];
  const from = offsets[direction](distance);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...from }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}

/** Applies a staggered `delay` to each child automatically. */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  direction = "up",
}: {
  children: ReactNode[];
  className?: string;
  stagger?: number;
  direction?: RevealProps["direction"];
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} delay={i * stagger} direction={direction}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
