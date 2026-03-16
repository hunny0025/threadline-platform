import { motion } from "motion/react";
import { forwardRef, HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";
import { X } from "lucide-react";

const chipVariants = cva(
  [
    "inline-flex items-center gap-1",
    "rounded-full font-display font-medium",
    "transition-colors duration-200",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-neutral-100 text-neutral-900 border border-transparent hover:bg-neutral-200",
        outline: "bg-transparent text-neutral-900 border border-neutral-300 hover:bg-neutral-50",
        filled: "bg-neutral-900 text-white border border-transparent hover:bg-neutral-800",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px]",
        md: "px-2 py-0.5 text-xs",
      },
      interactive: {
        true: "cursor-pointer",
        false: "cursor-default",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: false,
    },
  }
);

export interface ChipProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  onRemove?: () => void;
  removable?: boolean;
}

const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      className,
      variant,
      size,
      interactive,
      onRemove,
      removable,
      children,
      ...props
    },
    ref,
  ) => {
    const isInteractive = interactive || removable;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...motionSafeProps } = props as any;

    return (
      <motion.div
        ref={ref}
        className={cn(chipVariants({ variant, size, interactive: isInteractive, className }))}
        whileHover={isInteractive ? { scale: 1.05 } : {}}
        whileTap={isInteractive ? { scale: 0.95 } : {}}
        transition={{ duration: 0.15, ease: "easeOut" }}
        {...motionSafeProps}
      >
        <span>{children}</span>
        {removable && onRemove && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-0.5 hover:bg-black/10 rounded-full p-0.5 -mr-0.5"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Remove chip"
          >
            <X className="w-1.5 h-1.5" strokeWidth={2} />
          </motion.button>
        )}
      </motion.div>
    );
  }
);

Chip.displayName = "Chip";

export { Chip, chipVariants };
