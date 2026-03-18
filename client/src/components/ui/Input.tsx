import { motion } from "motion/react";
import { forwardRef, InputHTMLAttributes, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const inputVariants = cva(
  // Base styles - 8pt grid
  [
    "flex w-full rounded-lg font-display text-sm transition-all duration-300",
    "placeholder:text-neutral-400",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-neutral-50",
    "focus:outline-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-white rounded-lg border-1 border-neutral-200 text-black",
          "hover:border-neutral-300",
          "focus:border-black focus:ring-2 focus:ring-black/5",
        ].join(" "),
        filled: [
          "bg-neutral-50 rounded-lg border-1 border-transparent text-black",
          "hover:bg-neutral-100",
          "focus:bg-white focus:border-black focus:ring-2 focus:ring-black/5",
        ].join(" "),
        flushed: [
          "bg-transparent rounded-lg border-b-1 border-neutral-300 text-black rounded-none",
          "hover:border-neutral-400",
          "focus:border-black focus:ring-2 focus:ring-black/5",
        ].join(" "),
      },
      size: {
        sm: "px-2 py-1 text-sm",
        md: "px-3 py-1.5 text-base",
        lg: "px-3 py-2 text-base",
      },
      state: {
        default: "",
        error: "border-red-500 focus:border-red-600 focus:ring-red-500/10",
        success:
          "border-green-500 focus:border-green-600 focus:ring-green-500/10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "default",
    },
  },
);

export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      state,
      label,
      helperText,
      error,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputState = error ? "error" : state;

    return (
      <div className="w-full">
        {label && (
          <motion.label
            className="block mb-1 text-sm font-display font-medium text-neutral-900"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          >
            {label}
          </motion.label>
        )}

        <motion.div
          initial={{ scale: 1 }}
          animate={{
            scale: isFocused && !disabled ? 1.01 : 1,
          }}
          transition={{
            duration: 0.2,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
        >
          <input
            ref={ref}
            className={cn(
              inputVariants({ variant, size, state: inputState, className }),
            )}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
        </motion.div>

        {helperText && (
          <motion.p
            className={cn(
              "mt-0.5 text-xs",
              error ? "text-red-600" : "text-neutral-500",
            )}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          >
            {helperText}
          </motion.p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants };
