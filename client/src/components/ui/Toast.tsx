import { motion, AnimatePresence } from "motion/react";
import { forwardRef, HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";
import { CheckCircle2, AlertCircle, Info, XCircle, X } from "lucide-react";

const toastVariants = cva(
  "pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl shadow-lg ring-1 ring-black/5 flex items-start p-3 md:p-4",
  {
    variants: {
      variant: {
        default: "bg-white text-neutral-900",
        info: "bg-blue-50 text-blue-900 ring-blue-500/20",
        success: "bg-green-50 text-green-900 ring-green-500/20",
        warning: "bg-amber-50 text-amber-900 ring-amber-500/20",
        error: "bg-red-50 text-red-900 ring-red-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ToastProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  title: string;
  description?: string;
  onClose?: () => void;
  isVisible?: boolean;
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, title, description, onClose, isVisible = true, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...motionSafeProps } = props as any;

    const Icon = {
      default: Info,
      info: Info,
      success: CheckCircle2,
      warning: AlertCircle,
      error: XCircle,
    }[variant || "default"];

    const iconColor = {
      default: "text-neutral-400",
      info: "text-blue-500",
      success: "text-green-500",
      warning: "text-amber-500",
      error: "text-red-500",
    }[variant || "default"];

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} // Spring-like ease out
            className={cn(toastVariants({ variant, className }))}
            role="alert"
            {...motionSafeProps}
          >
            <div className="flex-shrink-0 pt-0.5">
              <Icon className={cn("w-3 h-3", iconColor)} />
            </div>
            <div className="ml-2.5 w-0 flex-1">
              <p className="text-sm font-display font-semibold">{title}</p>
              {description && (
                <p className="mt-0.5 text-sm opacity-90 leading-relaxed">{description}</p>
              )}
            </div>
            {onClose && (
              <div className="ml-3 flex shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md p-1 opacity-60 hover:opacity-100 hover:bg-black/5 focus:outline-none transition-all"
                >
                  <span className="sr-only">Close</span>
                  <X className="w-2.5 h-2.5" strokeWidth={2} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

Toast.displayName = "Toast";

export { Toast, toastVariants };
