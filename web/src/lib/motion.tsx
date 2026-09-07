"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

// ─── Shared easing ───────────────────────────────────────────────────
export const ease = [0.21, 0.47, 0.32, 0.98] as const;

// ─── Reusable variants ───────────────────────────────────────────────
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease },
  }),
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay, ease },
  }),
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

// ─── FadeIn wrapper ───────────────────────────────────────────────────
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
  /** Optional anchor target — lets a FadeIn double as a scroll destination. */
  id?: string;
}

export function FadeIn({ children, delay = 0, className, once = true, id }: FadeInProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      custom={reduced ? 0 : delay}
      variants={reduced ? fadeInVariants : fadeUpVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger container ────────────────────────────────────────────────
interface StaggerProps {
  children: ReactNode;
  className?: string;
  once?: boolean;
}

export function Stagger({ children, className, once = true }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      variants={staggerContainerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger child (use inside <Stagger>) ─────────────────────────────
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      variants={reduced ? fadeInVariants : fadeUpVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
