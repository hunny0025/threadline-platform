import { motion, AnimatePresence } from "motion/react";
import { forwardRef, useState, useCallback, useEffect, FormEvent } from "react";
import { cn } from "@/src/lib/utils";
import { X, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";

// ============================================================
// Types & Interfaces
// ============================================================

type AuthMode = "login" | "signup";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onLogin?: (data: LoginFormData) => Promise<void>;
  onSignup?: (data: SignupFormData) => Promise<void>;
  onGoogleAuth?: () => Promise<void>;
  className?: string;
}

// ============================================================
// Validation Helpers
// ============================================================

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email";
  return undefined;
};

const validatePassword = (
  password: string,
  isSignup = false,
): string | undefined => {
  if (!password) return "Password is required";
  if (isSignup) {
    if (password.length < 6) return "Password must be at least 6 characters";
  }
  return undefined;
};

const validateName = (name: string): string | undefined => {
  if (!name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return undefined;
};

const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string | undefined => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return undefined;
};

// ============================================================
// Google OAuth Button Component
// ============================================================

interface GoogleOAuthButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const GoogleOAuthButton = forwardRef<HTMLButtonElement, GoogleOAuthButtonProps>(
  ({ onClick, isLoading, disabled }, ref) => {
    return (
      <motion.button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled || isLoading}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-4 py-2",
          "bg-white border border-neutral-200 rounded-full",
          "font-display font-medium text-sm text-neutral-700",
          "transition-all duration-200",
          "hover:bg-neutral-50 hover:border-neutral-300",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
        whileHover={!disabled && !isLoading ? { scale: 1.01, y: -1 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.99 } : {}}
        transition={{ duration: 0.15 }}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span>{isLoading ? "Connecting..." : "Continue with Google"}</span>
      </motion.button>
    );
  },
);

GoogleOAuthButton.displayName = "GoogleOAuthButton";

// ============================================================
// Password Input with Toggle
// ============================================================

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

const PasswordInput = ({
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        label={label}
        error={!!error}
        helperText={error}
        disabled={disabled}
        variant="default"
        size="sm"
        className="pr-8"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className={cn(
          "absolute right-2 text-neutral-400 hover:text-neutral-600 transition-colors",
          label ? "top-[26px]" : "top-1/2 -translate-y-1/2",
        )}
        tabIndex={-1}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="w-3.5 h-3.5" />
        ) : (
          <Eye className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
};

// ============================================================
// Auth Modal Component
// ============================================================

const AuthModal = forwardRef<HTMLDivElement, AuthModalProps>(
  (
    {
      isOpen,
      onClose,
      initialMode = "login",
      onLogin,
      onSignup,
      onGoogleAuth,
      className,
    },
    ref,
  ) => {
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Reset form when mode changes or modal closes
    const resetForm = useCallback(() => {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
      setTouched({});
      setIsLoading(false);
      setIsGoogleLoading(false);
    }, []);

    const handleModeSwitch = useCallback((newMode: AuthMode) => {
      setMode(newMode);
      setErrors({});
      setTouched({});
    }, []);

    const handleClose = useCallback(() => {
      resetForm();
      onClose();
    }, [onClose, resetForm]);

    // Handle Escape key
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) handleClose();
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, handleClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen]);

    // Validate field on blur
    const handleBlur = useCallback(
      (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));

        const newErrors: FormErrors = { ...errors };

        switch (field) {
          case "name":
            newErrors.name = validateName(name);
            break;
          case "email":
            newErrors.email = validateEmail(email);
            break;
          case "password":
            newErrors.password = validatePassword(password, mode === "signup");
            break;
          case "confirmPassword":
            newErrors.confirmPassword = validateConfirmPassword(
              password,
              confirmPassword,
            );
            break;
        }

        setErrors(newErrors);
      },
      [errors, name, email, password, confirmPassword, mode],
    );

    // Full form validation
    const validateForm = useCallback((): boolean => {
      const newErrors: FormErrors = {};

      if (mode === "signup") {
        newErrors.name = validateName(name);
      }
      newErrors.email = validateEmail(email);
      newErrors.password = validatePassword(password, mode === "signup");
      if (mode === "signup") {
        newErrors.confirmPassword = validateConfirmPassword(
          password,
          confirmPassword,
        );
      }

      setErrors(newErrors);
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      });

      return !Object.values(newErrors).some((error) => error !== undefined);
    }, [mode, name, email, password, confirmPassword]);

    // Handle form submission
    const handleSubmit = useCallback(
      async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
          if (mode === "login" && onLogin) {
            await onLogin({ email, password });
          } else if (mode === "signup" && onSignup) {
            await onSignup({ name, email, password, confirmPassword });
          }
          handleClose();
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "An error occurred";
          setErrors({ general: message });
        } finally {
          setIsLoading(false);
        }
      },
      [
        mode,
        email,
        password,
        name,
        confirmPassword,
        onLogin,
        onSignup,
        validateForm,
        handleClose,
      ],
    );

    // Handle Google OAuth
    const handleGoogleAuth = useCallback(async () => {
      if (!onGoogleAuth) return;

      setIsGoogleLoading(true);
      setErrors({});

      try {
        await onGoogleAuth();
        handleClose();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Google sign-in failed";
        setErrors({ general: message });
      } finally {
        setIsGoogleLoading(false);
      }
    }, [onGoogleAuth, handleClose]);

    // Animation variants
    const formVariants = {
      enter: { opacity: 0, x: mode === "login" ? -20 : 20 },
      center: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: mode === "login" ? 20 : -20 },
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleClose}
              aria-hidden="true"
            />

            {/* Modal Panel */}
            <motion.div
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-labelledby="auth-modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={cn(
                "relative z-50 w-full max-w-sm",
                "bg-white rounded-2xl shadow-2xl overflow-hidden",
                className,
              )}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 z-10 rounded-full p-1.5 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="px-6 pt-6 pb-3 text-center">
                <motion.h2
                  id="auth-modal-title"
                  key={mode}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-display font-bold text-neutral-900"
                >
                  {mode === "login" ? "Welcome back" : "Create an account"}
                </motion.h2>
                <motion.p
                  key={`${mode}-subtitle`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                  className="mt-1 text-xs text-neutral-500"
                >
                  {mode === "login"
                    ? "Sign in to access your account"
                    : "Join Threadline for exclusive access"}
                </motion.p>
              </div>

              {/* Form Content */}
              <div className="px-6 pb-5">
                {/* General Error Alert */}
                <AnimatePresence mode="wait">
                  {errors.general && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mb-3 flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700">{errors.general}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Google OAuth */}
                {onGoogleAuth && (
                  <>
                    <GoogleOAuthButton
                      onClick={handleGoogleAuth}
                      isLoading={isGoogleLoading}
                      disabled={isLoading}
                    />

                    {/* Divider */}
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white text-neutral-400 font-medium">
                          or continue with email
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Form */}
                <AnimatePresence mode="wait">
                  <motion.form
                    key={mode}
                    variants={formVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-3"
                  >
                    {/* Name Field (Signup only) */}
                    {mode === "signup" && (
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => handleBlur("name")}
                        placeholder="Your name"
                        label="Name"
                        error={touched.name && !!errors.name}
                        helperText={touched.name ? errors.name : undefined}
                        disabled={isLoading}
                        variant="default"
                        size="md"
                      />
                    )}

                    {/* Email Field */}
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="you@example.com"
                      label="Email"
                      error={touched.email && !!errors.email}
                      helperText={touched.email ? errors.email : undefined}
                      disabled={isLoading}
                      variant="default"
                      size="md"
                    />

                    {/* Password Field */}
                    <PasswordInput
                      value={password}
                      onChange={setPassword}
                      placeholder={
                        mode === "signup"
                          ? "Create a password"
                          : "Enter your password"
                      }
                      label="Password"
                      error={touched.password ? errors.password : undefined}
                      disabled={isLoading}
                    />

                    {/* Confirm Password Field (Signup only) */}
                    {mode === "signup" && (
                      <PasswordInput
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        placeholder="Confirm your password"
                        label="Confirm Password"
                        error={
                          touched.confirmPassword
                            ? errors.confirmPassword
                            : undefined
                        }
                        disabled={isLoading}
                      />
                    )}

                    {/* Forgot Password Link (Login only) */}
                    {mode === "login" && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="text-xs text-neutral-500 hover:text-black transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={isLoading || isGoogleLoading}
                      className="w-full mt-4"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {mode === "login"
                            ? "Signing in..."
                            : "Creating account..."}
                        </span>
                      ) : mode === "login" ? (
                        "Sign in"
                      ) : (
                        "Create account"
                      )}
                    </Button>
                  </motion.form>
                </AnimatePresence>

                {/* Mode Toggle */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-neutral-500">
                    {mode === "login"
                      ? "Don't have an account?"
                      : "Already have an account?"}{" "}
                    <button
                      type="button"
                      onClick={() =>
                        handleModeSwitch(mode === "login" ? "signup" : "login")
                      }
                      disabled={isLoading || isGoogleLoading}
                      className="font-medium text-black hover:text-neutral-700 transition-colors disabled:opacity-50"
                    >
                      {mode === "login" ? "Sign up" : "Sign in"}
                    </button>
                  </p>
                </div>

                {/* Terms (Signup only) */}
                {mode === "signup" && (
                  <p className="mt-3 text-[10px] text-neutral-400 text-center leading-relaxed">
                    By creating an account, you agree to our{" "}
                    <a
                      href="/terms"
                      className="underline hover:text-neutral-600"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="underline hover:text-neutral-600"
                    >
                      Privacy Policy
                    </a>
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  },
);

AuthModal.displayName = "AuthModal";

export { AuthModal, GoogleOAuthButton };
export type { AuthMode, LoginFormData, SignupFormData, FormErrors };
