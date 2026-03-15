import { motion } from "motion/react";
import { forwardRef, HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";
import { X } from "lucide-react";

const tagVariants = cva(
  // Base styles - 8pt grid
  [
    "inline-flex items-center gap-1",
    "rounded-full font-display font-medium tracking-wide border",
    "transition-all duration-300",
    "cursor-default",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-neutral-100 text-neutral-900",
          "hover:bg-neutral-200",
        ].join(" "),
        primary: ["bg-black text-white", "hover:bg-neutral-800"].join(" "),
        outline: [
          "bg-white text-neutral-900 border border-neutral-300",
          "hover:border-neutral-400",
        ].join(" "),
        gradient: [
          "bg-gradient-to-r from-neutral-900 to-neutral-700 text-white",
          "hover:from-neutral-800 hover:to-neutral-600",
        ].join(" "),
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-sm",
      },
      interactive: {
        true: "cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: false,
    },
  },
);

export interface TagProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof tagVariants> {
  onRemove?: () => void;
  removable?: boolean;
}

const Tag = forwardRef<HTMLDivElement, TagProps>(
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
        className={cn(
          tagVariants({ variant, size, interactive: isInteractive, className }),
        )}
        initial={{ scale: 1 }}
        whileHover={
          isInteractive
            ? {
              scale: 1.05,
              y: -1,
            }
            : {}
        }
        whileTap={
          isInteractive
            ? {
              scale: 0.95,
            }
            : {}
        }
        transition={{
          duration: 0.2,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
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
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{
              duration: 0.15,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            aria-label="Remove tag"
          >
            <X className="w-1.8 h-1.8" strokeWidth={1.5} />
          </motion.button>
        )}
      </motion.div>
    );
  },
);

Tag.displayName = "Tag";

export { Tag, tagVariants };
