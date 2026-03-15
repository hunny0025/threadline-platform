import { motion, MotionProps } from "motion/react";
import { forwardRef, ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  // Base styles - following 8pt grid
  [
    "inline-flex items-center justify-center gap-1",
    "rounded-full font-display font-medium tracking-wide",
    "transition-all duration-300",
    "disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-black text-white",
          "hover:bg-neutral-800",
          "active:bg-neutral-900",
        ].join(" "),
        secondary: [
          "bg-white text-black border-1 border-black/10",
          "hover:border-black/30 hover:bg-neutral-50",
          "active:bg-neutral-100",
        ].join(" "),
        outline: [
          "bg-transparent text-black border-1 border-black",
          "hover:bg-black hover:text-white",
          "active:bg-neutral-900",
        ].join(" "),
        ghost: [
          "bg-transparent text-black",
          "hover:bg-black/5",
          "active:bg-black/10",
        ].join(" "),
        destructive: [
          "bg-red-600 text-white",
          "hover:bg-red-700",
          "active:bg-red-800",
        ].join(" "),
      },
      size: {
        sm: "px-4 py-1 text-xs",
        md: "px-5 py-2 text-sm",
        lg: "px-8 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
  ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, disabled, children, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...motionSafeProps } = props as any;
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled}
        whileHover={
          !disabled
            ? {
              scale: 1.02,
              y: -2,
            }
            : {}
        }
        whileTap={
          !disabled
            ? {
              scale: 0.98,
            }
            : {}
        }
        transition={{
          duration: 0.2,
          ease: [0.43, 0.13, 0.23, 0.96], // Cubic bezier
        }}
        {...motionSafeProps}
      >
        {children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
