import { motion, useReducedMotion } from "framer-motion";
import { forwardRef, HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const skeletonVariants = cva("relative overflow-hidden bg-neutral-200/65", {
  variants: {
    variant: {
      text: "rounded-md",
      circular: "rounded-full",
      rectangular: "rounded-lg",
    },
  },
  defaultVariants: {
    variant: "text",
  },
});

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...motionSafeProps } = props as any;
    return (
      <motion.div
        ref={ref}
        className={cn(skeletonVariants({ variant, className }))}
        initial={{ opacity: 0.65 }}
        animate={{
          opacity: shouldReduceMotion ? 0.85 : [0.65, 0.9, 0.65],
        }}
        transition={{
          duration: 1.8,
          ease: [0.4, 0, 0.6, 1],
          repeat: Infinity,
        }}
        {...motionSafeProps}
      >
        {!shouldReduceMotion && (
          <motion.div
            aria-hidden
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
            animate={{ x: ["-120%", "120%"] }}
            transition={{
              duration: 1.5,
              ease: [0.65, 0, 0.35, 1],
              repeat: Infinity,
              repeatDelay: 0.2,
            }}
          />
        )}
      </motion.div>
    );
  }
);

Skeleton.displayName = "Skeleton";

export { Skeleton, skeletonVariants };
