/**
 * Cubic Bezier Easing Preset Library
 * A curated collection of easing curves for Framer Motion animations.
 *
 * Usage:
 *   import { easings } from '@/src/lib/easings';
 *   <motion.div transition={{ ease: easings.smooth }} />
 */

// Type for cubic bezier control points [x1, y1, x2, y2]
export type CubicBezier = [number, number, number, number];

// =============================================================================
// STANDARD EASINGS
// Classic easing functions following CSS/easing conventions
// =============================================================================

/** Linear - No acceleration (constant speed) */
export const linear: CubicBezier = [0, 0, 1, 1];

/** Ease - Default CSS easing with slight acceleration */
export const ease: CubicBezier = [0.25, 0.1, 0.25, 1];

/** Ease In - Start slow, accelerate */
export const easeIn: CubicBezier = [0.42, 0, 1, 1];

/** Ease Out - Start fast, decelerate */
export const easeOut: CubicBezier = [0, 0, 0.58, 1];

/** Ease In Out - Slow start and end, fast middle */
export const easeInOut: CubicBezier = [0.42, 0, 0.58, 1];

// =============================================================================
// SMOOTH & NATURAL
// Organic feeling easings for UI interactions
// =============================================================================

/** Smooth - Threadline's default UI easing (used across the codebase) */
export const smooth: CubicBezier = [0.43, 0.13, 0.23, 0.96];

/** Silk - Ultra-smooth with gentle deceleration */
export const silk: CubicBezier = [0.16, 1, 0.3, 1];

/** Soft - Gentle and understated transitions */
export const soft: CubicBezier = [0.25, 0.46, 0.45, 0.94];

/** Natural - Mimics physical deceleration */
export const natural: CubicBezier = [0.22, 0.61, 0.36, 1];

// =============================================================================
// ENERGETIC & EXPRESSIVE
// Snappy, dynamic easings with character
// =============================================================================

/** Snap - Quick and decisive */
export const snap: CubicBezier = [0.68, -0.55, 0.27, 1.55];

/** Bounce - Overshoot with spring-back */
export const bounce: CubicBezier = [0.34, 1.56, 0.64, 1];

/** Pop - Quick overshoot for attention */
export const pop: CubicBezier = [0.175, 0.885, 0.32, 1.275];

/** Elastic - Strong overshoot, playful feel */
export const elastic: CubicBezier = [0.68, -0.6, 0.32, 1.6];

// =============================================================================
// DRAMATIC & CINEMATIC
// Bold easings for impactful transitions
// =============================================================================

/** Dramatic - Strong deceleration for emphasis */
export const dramatic: CubicBezier = [0.19, 1, 0.22, 1];

/** Expo - Exponential deceleration */
export const expo: CubicBezier = [0.16, 1, 0.3, 1];

/** Power - Strong acceleration/deceleration */
export const power: CubicBezier = [0.7, 0, 0.3, 1];

/** Cinematic - Film-like timing */
export const cinematic: CubicBezier = [0.86, 0, 0.07, 1];

// =============================================================================
// ENTER & EXIT PAIRS
// Matching easings for symmetrical transitions
// =============================================================================

/** Enter - Optimized for elements appearing */
export const enter: CubicBezier = [0, 0, 0.2, 1];

/** Exit - Optimized for elements disappearing */
export const exit: CubicBezier = [0.4, 0, 1, 1];

/** Enter emphasized - Stronger entrance */
export const enterEmphasized: CubicBezier = [0, 0, 0, 1];

/** Exit emphasized - Stronger exit */
export const exitEmphasized: CubicBezier = [0.3, 0, 1, 1];

// =============================================================================
// PAGE TRANSITIONS
// Specifically tuned for route/page animations
// =============================================================================

/** Page enter - Smooth entry for page content */
export const pageEnter: CubicBezier = [0.35, 0, 0.15, 1];

/** Page exit - Clean exit for page content */
export const pageExit: CubicBezier = [0.45, 0, 0.55, 1];

/** Page crossfade - Balanced for simultaneous in/out */
export const pageCrossfade: CubicBezier = [0.4, 0, 0.2, 1];

// =============================================================================
// MICRO-INTERACTIONS
// Subtle easings for small UI elements
// =============================================================================

/** Button hover - Quick response for hover states */
export const buttonHover: CubicBezier = [0.25, 0.1, 0.25, 1];

/** Button press - Responsive tap/click feedback */
export const buttonPress: CubicBezier = [0.34, 1.2, 0.64, 1];

/** Focus ring - Gentle focus indicator animation */
export const focusRing: CubicBezier = [0.2, 0, 0.38, 0.9];

/** Tooltip - Quick reveal for tooltips */
export const tooltip: CubicBezier = [0.16, 1, 0.3, 1];

// =============================================================================
// LOADING & PROGRESS
// Easings for loading states and progress indicators
// =============================================================================

/** Progress - Smooth progress bar movement */
export const progress: CubicBezier = [0.23, 1, 0.32, 1];

/** Indeterminate - Continuous loop animation */
export const indeterminate: CubicBezier = [0.65, 0, 0.35, 1];

/** Pulse - Gentle breathing animation */
export const pulse: CubicBezier = [0.4, 0, 0.6, 1];

// =============================================================================
// EXPORT COLLECTION
// =============================================================================

export const easings = {
  // Standard
  linear,
  ease,
  easeIn,
  easeOut,
  easeInOut,

  // Smooth & Natural
  smooth,
  silk,
  soft,
  natural,

  // Energetic & Expressive
  snap,
  bounce,
  pop,
  elastic,

  // Dramatic & Cinematic
  dramatic,
  expo,
  power,
  cinematic,

  // Enter & Exit Pairs
  enter,
  exit,
  enterEmphasized,
  exitEmphasized,

  // Page Transitions
  pageEnter,
  pageExit,
  pageCrossfade,

  // Micro-interactions
  buttonHover,
  buttonPress,
  focusRing,
  tooltip,

  // Loading & Progress
  progress,
  indeterminate,
  pulse,
} as const;

// Preset durations that pair well with the easings (in seconds)
export const durations = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.2,
  smooth: 0.3,
  slow: 0.5,
  dramatic: 0.8,
  page: 0.4,
} as const;

// Pre-composed transition presets for common use cases
export const transitions = {
  /** Standard UI transition */
  default: { duration: durations.normal, ease: smooth },

  /** Fast micro-interaction */
  micro: { duration: durations.fast, ease: soft },

  /** Button interaction */
  button: { duration: durations.normal, ease: buttonHover },

  /** Modal/overlay appearance */
  modal: { duration: durations.smooth, ease: silk },

  /** Page transition */
  page: { duration: durations.page, ease: pageCrossfade },

  /** Attention-grabbing */
  attention: { duration: durations.smooth, ease: pop },

  /** Smooth content reveal */
  reveal: { duration: durations.slow, ease: natural },
} as const;
