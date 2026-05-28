import { useReducedMotion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;

export const fadeUp = (duration = 0.55, delay = 0) => ({
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration, delay, ease: EASE } },
});

export const stagger = (staggerChildren = 0.11, delayChildren = 0.05) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

export function useMotionConfig() {
  const reduced = useReducedMotion() ?? false;
  const t = (duration: number, delay = 0) =>
    reduced ? { duration: 0, delay: 0 } : { duration, delay, ease: EASE };
  return { reduced, t };
}
