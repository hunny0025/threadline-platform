// ============================================================
// Threadline Platform — Tailwind CSS Configuration
// Phase 1: Global Design Token System
//
// This file is the SINGLE SOURCE OF TRUTH for all design tokens.
// Every value here is also mirrored as a CSS custom property in
// src/index.css so both Tailwind utilities and vanilla CSS
// can consume them consistently.
//
// Design system principles:
//  • 8pt spacing grid (1 unit = 8px)
//  • Violet brand palette (fashion-forward, modern)
//  • Type scale on 1.25 ratio (Major Third)
//  • All semantic tokens reference primitives
// ============================================================

/** @type {import('tailwindcss').Config} */
export default {
  // Scan all source files for class names
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],

  theme: {
    // ─────────────────────────────────────────────────────────
    // SPACING — 8pt Grid
    // Base unit = 8px. Every spacing value is a multiple of 8.
    // Usage: p-1 → 8px, p-2 → 16px, gap-3 → 24px, etc.
    // ─────────────────────────────────────────────────────────
    spacing: {
      px: '1px',
      0:  '0px',
      0.5: '4px',   // half-unit (use sparingly)
      1:  '8px',
      1.5: '12px',
      2:  '16px',
      2.5: '20px',
      3:  '24px',
      4:  '32px',
      5:  '40px',
      6:  '48px',
      7:  '56px',
      8:  '64px',
      9:  '72px',
      10: '80px',
      12: '96px',
      14: '112px',
      16: '128px',
      20: '160px',
      24: '192px',
      32: '256px',
      40: '320px',
      48: '384px',
      64: '512px',
    },

    // ─────────────────────────────────────────────────────────
    // COLORS
    // Primitives first, then semantic aliases at the bottom.
    // ─────────────────────────────────────────────────────────
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',

      // ── Brand: Violet (primary purple) ──────────────────────
      violet: {
        50:  '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',   // ← brand primary
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
        950: '#2e1065',
      },

      // ── Accent: Amber (complementary warm tone) ─────────────
      amber: {
        50:  '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',   // ← accent
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
        950: '#451a03',
      },

      // ── Neutrals: Zinc (backgrounds, surfaces, text) ────────
      zinc: {
        50:  '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        850: '#1e1e24',   // custom surface level
        900: '#18181b',
        950: '#0f0f13',   // ← deepest bg
      },

      // ── Semantic Status Colors ───────────────────────────────
      success: {
        DEFAULT: '#22c55e',
        light:   '#86efac',
        dark:    '#15803d',
        subtle:  'rgba(34, 197, 94, 0.12)',
      },
      danger: {
        DEFAULT: '#ef4444',
        light:   '#fca5a5',
        dark:    '#b91c1c',
        subtle:  'rgba(239, 68, 68, 0.12)',
      },
      warning: {
        DEFAULT: '#f59e0b',
        light:   '#fcd34d',
        dark:    '#b45309',
        subtle:  'rgba(245, 158, 11, 0.12)',
      },
      info: {
        DEFAULT: '#3b82f6',
        light:   '#93c5fd',
        dark:    '#1d4ed8',
        subtle:  'rgba(59, 130, 246, 0.12)',
      },
    },

    // ─────────────────────────────────────────────────────────
    // BORDER RADIUS
    // ─────────────────────────────────────────────────────────
    borderRadius: {
      none: '0px',
      xs:   '2px',
      sm:   '4px',
      md:   '8px',
      lg:   '12px',
      xl:   '16px',
      '2xl':'20px',
      '3xl':'24px',
      full: '9999px',
    },

    // ─────────────────────────────────────────────────────────
    // BOX SHADOWS
    // ─────────────────────────────────────────────────────────
    boxShadow: {
      none: 'none',
      xs:   '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      sm:   '0 2px 4px 0 rgba(0, 0, 0, 0.4)',
      md:   '0 4px 12px 0 rgba(0, 0, 0, 0.5)',
      lg:   '0 8px 24px 0 rgba(0, 0, 0, 0.55)',
      xl:   '0 16px 40px 0 rgba(0, 0, 0, 0.6)',
      'inset-sm': 'inset 0 1px 3px rgba(0, 0, 0, 0.4)',

      // Glow shadows (brand violet)
      'glow-sm': '0 0 12px rgba(139, 92, 246, 0.25)',
      'glow':    '0 0 24px rgba(139, 92, 246, 0.35)',
      'glow-lg': '0 0 48px rgba(139, 92, 246, 0.45)',

      // Coloured card hover glows
      'glow-violet': '0 8px 32px rgba(139, 92, 246, 0.2)',
      'glow-amber':  '0 8px 32px rgba(245, 158, 11, 0.2)',
    },

    // ─────────────────────────────────────────────────────────
    // TYPOGRAPHY
    // ─────────────────────────────────────────────────────────
    fontFamily: {
      // Display headings — DM Sans (geometric, fashion-forward)
      display: ['"DM Sans"', 'system-ui', 'sans-serif'],
      // Body & UI text — Inter (legible, neutral)
      body:    ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      // Code / mono
      mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
    },

    // Font sizes — Major Third scale (×1.25), 16px base
    // Format: [font-size, { lineHeight, letterSpacing }]
    fontSize: {
      '2xs': ['10px', { lineHeight: '1.4', letterSpacing: '0.04em'  }],
      xs:    ['12px', { lineHeight: '1.5', letterSpacing: '0.02em'  }],
      sm:    ['14px', { lineHeight: '1.5', letterSpacing: '0.01em'  }],
      base:  ['16px', { lineHeight: '1.6', letterSpacing: '0em'     }],
      md:    ['18px', { lineHeight: '1.55',letterSpacing: '-0.01em' }],
      lg:    ['20px', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
      xl:    ['24px', { lineHeight: '1.4', letterSpacing: '-0.02em' }],
      '2xl': ['30px', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
      '3xl': ['36px', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
      '4xl': ['44px', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
      '5xl': ['56px', { lineHeight: '1.0', letterSpacing: '-0.04em' }],
    },

    fontWeight: {
      light:     '300',
      regular:   '400',
      medium:    '500',
      semibold:  '600',
      bold:      '700',
      extrabold: '800',
    },

    lineHeight: {
      none:    '1',
      tight:   '1.2',
      snug:    '1.375',
      normal:  '1.6',
      relaxed: '1.75',
      loose:   '2',
    },

    letterSpacing: {
      tightest: '-0.04em',
      tighter:  '-0.02em',
      tight:    '-0.01em',
      normal:   '0em',
      wide:     '0.02em',
      wider:    '0.04em',
      widest:   '0.1em',
    },

    // ─────────────────────────────────────────────────────────
    // TRANSITIONS
    // ─────────────────────────────────────────────────────────
    transitionDuration: {
      fast:   '100ms',
      base:   '200ms',
      slow:   '300ms',
      slower: '500ms',
    },
    transitionTimingFunction: {
      DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in:      'cubic-bezier(0.4, 0, 1, 1)',
      out:     'cubic-bezier(0, 0, 0.2, 1)',
      bounce:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },

    // ─────────────────────────────────────────────────────────
    // BREAKPOINTS (standard, mobile-first)
    // ─────────────────────────────────────────────────────────
    screens: {
      xs:  '375px',
      sm:  '640px',
      md:  '768px',
      lg:  '1024px',
      xl:  '1280px',
      '2xl':'1536px',
    },

    extend: {},
  },

  plugins: [],
};
