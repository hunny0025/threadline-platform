import { motion } from "motion/react";
import { forwardRef, HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";
import { Loader2 } from "lucide-react";

const spinnerVariants = cva("animate-spin", {
  variants: {
    variant: {
      current: "text-current",
      primary: "text-black",
      neutral: "text-neutral-500",
    },
    size: {
      sm: "w-3 h-3", // 24px
      md: "w-4 h-4", // 32px
      lg: "w-6 h-6", // 48px
    },
  },
  defaultVariants: {
    variant: "current",
    size: "md",
  },
});

export interface SpinnerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, variant, size, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...motionSafeProps } = props as any;
    
    return (
      <motion.div
        ref={ref}
        role="status"
        className={cn("inline-flex items-center justify-center", className)}
        {...motionSafeProps}
      >
        <Loader2 className={cn(spinnerVariants({ variant, size }))} />
        <span className="sr-only">Loading...</span>
      </motion.div>
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
