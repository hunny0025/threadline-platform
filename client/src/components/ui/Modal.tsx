import { motion, AnimatePresence } from "motion/react";
import { forwardRef, HTMLAttributes, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";
import { X } from "lucide-react";

const modalVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6",
  {
    variants: {
      size: {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[calc(100%-2rem)] md:max-w-6xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title">, VariantProps<typeof modalVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ className, size, isOpen, onClose, title, children, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...motionSafeProps } = props as any;

    // Handle Escape key
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) onClose();
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = ""; // Cleanup
      };
    }, [isOpen]);

    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden="true"
            />
            
            {/* Dialog Panel */}
            <motion.div
              ref={ref}
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }} // Spring-like ease out
              className={cn(
                "relative z-50 w-full rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]",
                {
                  "max-w-sm": size === "sm",
                  "max-w-lg": size === "md",
                  "max-w-2xl": size === "lg",
                  "max-w-4xl": size === "xl",
                  "max-w-[calc(100%-2rem)] md:max-w-6xl": size === "full",
                },
                className
              )}
              {...motionSafeProps}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 shrink-0">
                  <h2 className="text-lg font-display font-semibold text-neutral-900">{title}</h2>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1.5 hover:bg-neutral-100 text-neutral-500 transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-2.5 h-2.5" strokeWidth={2} />
                  </button>
                </div>
              )}
              
              {/* Internal Content (Scrollable if tall) */}
              <div className="overflow-y-auto px-4 py-4 md:px-5 md:py-5 flex-1">
                {children}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }
);

Modal.displayName = "Modal";

export { Modal, modalVariants };
