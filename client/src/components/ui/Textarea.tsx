import { motion } from "motion/react";
import { forwardRef, TextareaHTMLAttributes, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const textareaVariants = cva(
  // Base styles - 8pt grid
  [
    "flex w-full rounded-md font-display text-sm transition-all duration-300",
    "placeholder:text-neutral-400",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-neutral-50",
    "focus:outline-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-white border-1 border-neutral-200 text-black",
          "hover:border-neutral-300",
          "focus:border-black focus:ring-2 focus:ring-black/5",
        ].join(" "),
        filled: [
          "bg-neutral-50 border-1 border-transparent text-black",
          "hover:bg-neutral-100",
          "focus:bg-white focus:border-black focus:ring-2 focus:ring-black/5",
        ].join(" "),
      },
      size: {
        sm: "px-2 py-1 text-sm min-h-[64px]",
        md: "px-3 py-1.5 text-base min-h-[96px]",
        lg: "px-3 py-2 text-base min-h-[128px]",
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

export interface TextareaProps
  extends
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
  VariantProps<typeof textareaVariants> {
  label?: string;
  helperText?: string;
  error?: boolean;
  showCount?: boolean;
  maxLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      size,
      state,
      label,
      helperText,
      error,
      showCount,
      maxLength,
      disabled,
      value,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(
      value ? String(value).length : 0,
    );
    const textareaState = error ? "error" : state;

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
          <textarea
            ref={ref}
            className={cn(
              textareaVariants({
                variant,
                size,
                state: textareaState,
                className,
              }),
            )}
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            onChange={(e) => {
              setCharCount(e.target.value.length);
              props.onChange?.(e);
            }}
            {...props}
          />
        </motion.div>

        <div className="flex items-center justify-between mt-0.5">
          {helperText && (
            <motion.p
              className={cn(
                "text-xs",
                error ? "text-red-600" : "text-neutral-500",
              )}
              style={{}}
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

          {showCount && maxLength && (
            <motion.span
              className={cn(
                "text-xs ml-auto",
                charCount > maxLength * 0.9
                  ? "text-amber-600"
                  : "text-neutral-400",
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
            >
              {charCount}/{maxLength}
            </motion.span>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
