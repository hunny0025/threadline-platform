import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";
import { easings, durations } from "@/src/lib/easings";

const routeLoadingBarVariants = cva(
  "fixed top-0 left-0 right-0 z-[9999] pointer-events-none",
  {
    variants: {
      variant: {
        primary: "",
        accent: "",
        neutral: "",
      },
      size: {
        sm: "h-0.5",
        md: "h-1",
        lg: "h-1.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  },
);

const barColorClasses = {
  primary: "bg-gradient-to-r from-violet-500 via-violet-400 to-violet-600",
  accent: "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600",
  neutral: "bg-gradient-to-r from-zinc-600 via-zinc-500 to-zinc-700",
};

export interface RouteLoadingBarProps extends VariantProps<
  typeof routeLoadingBarVariants
> {
  /** Duration of the loading animation in ms */
  duration?: number;
  /** Show shadow beneath the bar */
  showShadow?: boolean;
  /** Show shimmer effect */
  showShimmer?: boolean;
  /** Custom className */
  className?: string;
}

export function RouteLoadingBar({
  variant = "primary",
  size = "sm",
  duration = 400,
  showShadow = true,
  showShimmer = true,
  className,
}: RouteLoadingBarProps) {
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const previousPath = React.useRef(location.pathname);

  React.useEffect(() => {
    // Detect route change
    if (location.pathname !== previousPath.current) {
      previousPath.current = location.pathname;

      // Start loading
      setIsLoading(true);
      setProgress(0);

      // Animate progress in steps
      const steps = [
        { progress: 30, delay: 0 },
        { progress: 60, delay: duration * 0.3 },
        { progress: 85, delay: duration * 0.6 },
        { progress: 100, delay: duration * 0.9 },
      ];

      const timeouts: NodeJS.Timeout[] = [];

      steps.forEach(({ progress: p, delay }) => {
        const timeout = setTimeout(() => setProgress(p), delay);
        timeouts.push(timeout);
      });

      // Complete and hide
      const completeTimeout = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, duration);

      timeouts.push(completeTimeout);

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [location.pathname, duration]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className={cn(routeLoadingBarVariants({ variant, size }), className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: durations.fast, ease: easings.soft }}
        >
          {/* Background track */}
          <div className="absolute inset-0 bg-zinc-100/50" />

          {/* Progress bar */}
          <motion.div
            className={cn(
              "absolute top-0 left-0 h-full",
              barColorClasses[variant || "primary"],
            )}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: durations.smooth,
              ease: easings.progress,
            }}
          />

          {/* Shimmer effect */}
          {showShimmer && (
            <motion.div
              className="absolute top-0 h-full w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "400%" }}
              transition={{
                duration: 1.5,
                ease: easings.linear,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
              style={{ left: 0 }}
            />
          )}

          {/* Glow head */}
          <motion.div
            className={cn(
              "absolute top-0 h-full w-24 blur-sm",
              barColorClasses[variant || "primary"],
            )}
            style={{ right: `${100 - progress}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
          />

          {/* Shadow */}
          {showShadow && (
            <motion.div
              className={cn(
                "absolute top-full left-0 h-1 blur-sm",
                variant === "primary" && "bg-violet-500/30",
                variant === "accent" && "bg-amber-500/30",
                variant === "neutral" && "bg-zinc-500/30",
              )}
              style={{ width: `${progress}%` }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { routeLoadingBarVariants };
