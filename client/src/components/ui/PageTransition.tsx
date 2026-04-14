import * as React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useLocation } from "react-router-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";
import { easings, durations } from "@/src/lib/easings";

// =============================================================================
// PAGE TRANSITION VARIANTS
// =============================================================================

export type PageTransitionPreset =
  | "fade"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scale"
  | "scaleUp"
  | "reveal"
  | "none";

const createVariants = (
  preset: PageTransitionPreset,
  distance: number = 20,
): Variants => {
  const variants: Record<PageTransitionPreset, Variants> = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: distance },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -distance / 2 },
    },
    slideDown: {
      initial: { opacity: 0, y: -distance },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: distance / 2 },
    },
    slideLeft: {
      initial: { opacity: 0, x: distance },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -distance / 2 },
    },
    slideRight: {
      initial: { opacity: 0, x: -distance },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: distance / 2 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.96 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.02 },
    },
    scaleUp: {
      initial: { opacity: 0, scale: 0.92, y: 10 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.98, y: -5 },
    },
    reveal: {
      initial: { opacity: 0, y: 30, filter: "blur(4px)" },
      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      exit: { opacity: 0, y: -15, filter: "blur(2px)" },
    },
    none: {
      initial: {},
      animate: {},
      exit: {},
    },
  };

  return variants[preset];
};

// =============================================================================
// COMPONENT VARIANTS
// =============================================================================

const pageTransitionVariants = cva("", {
  variants: {
    layout: {
      default: "",
      fullHeight: "min-h-screen",
      flex: "flex flex-col",
    },
  },
  defaultVariants: {
    layout: "default",
  },
});

// =============================================================================
// TYPES
// =============================================================================

export interface PageTransitionProps extends VariantProps<
  typeof pageTransitionVariants
> {
  children: React.ReactNode;
  /** Animation preset to use */
  preset?: PageTransitionPreset;
  /** Animation duration in seconds */
  duration?: number;
  /** Custom enter easing (cubic bezier array) */
  enterEase?: number[];
  /** Custom exit easing (cubic bezier array) */
  exitEase?: number[];
  /** Distance for slide animations */
  slideDistance?: number;
  /** AnimatePresence mode */
  mode?: "sync" | "wait" | "popLayout";
  /** Callback when enter animation completes */
  onAnimationComplete?: () => void;
  /** Custom className */
  className?: string;
}

// =============================================================================
// ANIMATED ROUTES COMPONENT
// Wraps children with AnimatePresence and motion for page transitions
// =============================================================================

export function PageTransition({
  children,
  preset = "slideUp",
  duration = durations.page,
  enterEase = easings.pageEnter,
  exitEase = easings.pageExit,
  slideDistance = 20,
  mode = "wait",
  layout = "default",
  onAnimationComplete,
  className,
}: PageTransitionProps) {
  const location = useLocation();
  const variants = createVariants(preset, slideDistance);

  return (
    <AnimatePresence mode={mode}>
      <motion.div
        key={location.pathname}
        className={cn(pageTransitionVariants({ layout }), className)}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration,
          ease: enterEase,
          exit: {
            duration: Math.max(duration * 0.85, durations.fast),
            ease: exitEase,
          },
        }}
        onAnimationComplete={onAnimationComplete}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// =============================================================================
// PAGE WRAPPER COMPONENT
// For wrapping individual page content with custom transitions
// =============================================================================

export interface PageWrapperProps {
  children: React.ReactNode;
  /** Animation preset to use */
  preset?: PageTransitionPreset;
  /** Animation duration in seconds */
  duration?: number;
  /** Delay before animation starts */
  delay?: number;
  /** Custom className */
  className?: string;
}

export function PageWrapper({
  children,
  preset = "slideUp",
  duration = durations.page,
  delay = 0,
  className,
}: PageWrapperProps) {
  const variants = createVariants(preset);

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      transition={{
        duration,
        delay,
        ease: easings.pageEnter,
      }}
    >
      {children}
    </motion.div>
  );
}

// =============================================================================
// TRANSITION PRESETS EXPORT
// For use in custom implementations
// =============================================================================

export const pageTransitionPresets = {
  fade: createVariants("fade"),
  slideUp: createVariants("slideUp"),
  slideDown: createVariants("slideDown"),
  slideLeft: createVariants("slideLeft"),
  slideRight: createVariants("slideRight"),
  scale: createVariants("scale"),
  scaleUp: createVariants("scaleUp"),
  reveal: createVariants("reveal"),
} as const;

export { pageTransitionVariants };
