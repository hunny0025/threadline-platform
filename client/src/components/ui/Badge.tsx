import { motion } from "motion/react";
import { forwardRef, HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const badgeVariants = cva(
  // Base styles - 8pt grid
  [
    "inline-flex items-center justify-center gap-1",
    "rounded-full font-display font-medium tracking-wide border",
    "transition-all duration-200",
    "whitespace-nowrap",
  ].join(" "),
  {
    variants: {
      variant: {
        default: ["bg-black text-white"].join(" "),
        secondary: [
          "bg-neutral-100 text-neutral-900",
          "hover:bg-neutral-200",
        ].join(" "),
        outline: [
          "bg-transparent text-black border border-black/20",
          "hover:border-black/40",
        ].join(" "),
        success: ["bg-green-100 text-green-800 border border-green-200"].join(
          " ",
        ),
        warning: ["bg-amber-100 text-amber-800 border border-amber-200"].join(
          " ",
        ),
        destructive: ["bg-red-100 text-red-800 border border-red-200"].join(
          " ",
        ),
      },
      size: {
        sm: "px-1.5 py-px text-[10px]",
        md: "px-2 py-0.5 text-xs",
        lg: "px-2.5 py-0.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  pulse?: boolean;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, pulse, children, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...motionSafeProps } = props as any;
    return (
      <motion.div
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        initial={{ scale: 1 }}
        whileHover={{
          scale: 1.05,
        }}
        transition={{
          duration: 0.2,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
        {...motionSafeProps}
      >
        {pulse && (
          <motion.span
            className="w-1 h-1 bg-green-400 rounded-full"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          />
        )}
        {children}
      </motion.div>
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
