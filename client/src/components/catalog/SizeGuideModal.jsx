import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ruler, Info } from 'lucide-react';
import './SizeGuideModal.css';

/* ── Size Data ─────────────────────────────────────────────── */
const SIZE_CHART_CM = {
  XS: { chest: [78, 84],  waist: [62, 68],  hips: [84, 90]  },
  S:  { chest: [84, 90],  waist: [68, 74],  hips: [90, 96]  },
  M:  { chest: [90, 96],  waist: [74, 80],  hips: [96, 102] },
  L:  { chest: [96, 104], waist: [80, 88],  hips: [102, 110]},
  XL: { chest: [104, 112],waist: [88, 96],  hips: [110, 118]},
};

const SIZES = Object.keys(SIZE_CHART_CM);
const CM_PER_INCH = 2.54;

const toInches = (cm) => +(cm / CM_PER_INCH).toFixed(1);
const toCm     = (inch) => +(inch * CM_PER_INCH).toFixed(1);

/* Convert the chart for display in inches */
const SIZE_CHART_IN = Object.fromEntries(
  SIZES.map((s) => [
    s,
    {
      chest: SIZE_CHART_CM[s].chest.map(toInches),
      waist: SIZE_CHART_CM[s].waist.map(toInches),
      hips:  SIZE_CHART_CM[s].hips.map(toInches),
    },
  ]),
);

/* ── Recommendation Engine ─────────────────────────────────── */
function recommendSize(chestCm, waistCm, hipsCm) {
  if (!chestCm && !waistCm && !hipsCm) return null;

  let bestSize = null;
  let bestScore = Infinity;

  for (const size of SIZES) {
    const ranges = SIZE_CHART_CM[size];
    let score = 0;
    let measured = 0;

    const check = (val, range) => {
      if (!val) return;
      measured++;
      const mid = (range[0] + range[1]) / 2;
      // Distance from midpoint, penalise being outside range
      const diff = Math.abs(val - mid);
      const outside = val < range[0] ? range[0] - val : val > range[1] ? val - range[1] : 0;
      score += diff + outside * 2;
    };

    check(chestCm, ranges.chest);
    check(waistCm, ranges.waist);
    check(hipsCm,  ranges.hips);

    if (measured === 0) continue;
    const avg = score / measured;

    if (avg < bestScore) {
      bestScore = avg;
      bestSize = size;
    }
  }

  return bestSize;
}

/* ── Body Diagram SVG ──────────────────────────────────────── */
function BodyDiagram({ focusedField }) {
  return (
    <div className="sg-diagram">
      <svg viewBox="0 0 140 260" xmlns="http://www.w3.org/2000/svg">
        {/* Body silhouette */}
        <path
          className="sg-diagram__body"
          d="M70 20
             C58 20, 50 28, 50 38
             C50 48, 56 52, 56 56
             L44 66 C36 72, 28 78, 22 98
             L18 120 C16 126, 20 128, 24 126
             L40 108 C42 106, 44 108, 44 112
             L42 138
             C38 148, 36 160, 36 174
             L32 220 C32 226, 36 228, 40 228
             L54 228 C58 228, 60 226, 58 220
             L60 180 C62 176, 66 174, 70 174
             C74 174, 78 176, 80 180
             L82 220 C80 226, 82 228, 86 228
             L100 228 C104 228, 108 226, 108 220
             L104 174
             C104 160, 102 148, 98 138
             L96 112 C96 108, 98 106, 100 108
             L116 126 C120 128, 124 126, 122 120
             L118 98 C112 78, 104 72, 96 66
             L84 56 C84 52, 90 48, 90 38
             C90 28, 82 20, 70 20Z"
        />

        {/* Head */}
        <circle cx="70" cy="14" r="12" className="sg-diagram__body" />

        {/* Chest measurement line */}
        <line
          x1="30" y1="80" x2="110" y2="80"
          className={`sg-diagram__line ${focusedField === 'chest' ? 'sg-diagram__line--active' : ''}`}
        />
        <circle
          cx="30" cy="80" r="3"
          className={`sg-diagram__dot ${focusedField === 'chest' ? 'sg-diagram__dot--active' : ''}`}
        />
        <circle
          cx="110" cy="80" r="3"
          className={`sg-diagram__dot ${focusedField === 'chest' ? 'sg-diagram__dot--active' : ''}`}
        />
        <text
          x="132" y="84"
          className={`sg-diagram__label ${focusedField === 'chest' ? 'sg-diagram__label--active' : ''}`}
        >
          Chest
        </text>

        {/* Waist measurement line */}
        <line
          x1="30" y1="108" x2="110" y2="108"
          className={`sg-diagram__line ${focusedField === 'waist' ? 'sg-diagram__line--active' : ''}`}
        />
        <circle
          cx="30" cy="108" r="3"
          className={`sg-diagram__dot ${focusedField === 'waist' ? 'sg-diagram__dot--active' : ''}`}
        />
        <circle
          cx="110" cy="108" r="3"
          className={`sg-diagram__dot ${focusedField === 'waist' ? 'sg-diagram__dot--active' : ''}`}
        />
        <text
          x="132" y="112"
          className={`sg-diagram__label ${focusedField === 'waist' ? 'sg-diagram__label--active' : ''}`}
        >
          Waist
        </text>

        {/* Hips measurement line */}
        <line
          x1="28" y1="140" x2="112" y2="140"
          className={`sg-diagram__line ${focusedField === 'hips' ? 'sg-diagram__line--active' : ''}`}
        />
        <circle
          cx="28" cy="140" r="3"
          className={`sg-diagram__dot ${focusedField === 'hips' ? 'sg-diagram__dot--active' : ''}`}
        />
        <circle
          cx="112" cy="140" r="3"
          className={`sg-diagram__dot ${focusedField === 'hips' ? 'sg-diagram__dot--active' : ''}`}
        />
        <text
          x="132" y="144"
          className={`sg-diagram__label ${focusedField === 'hips' ? 'sg-diagram__label--active' : ''}`}
        >
          Hips
        </text>
      </svg>
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────── */
export function SizeGuideModal({ isOpen, onClose, onSelectSize }) {
  const [activeTab, setActiveTab] = useState('finder'); // 'finder' | 'chart'
  const [unit, setUnit] = useState('cm');               // 'cm' | 'in'
  const [focusedField, setFocusedField] = useState(null);
  const [measurements, setMeasurements] = useState({ chest: '', waist: '', hips: '' });
  const [recommended, setRecommended] = useState(null);
  const firstInputRef = useRef(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setMeasurements({ chest: '', waist: '', hips: '' });
      setRecommended(null);
      setActiveTab('finder');
      setFocusedField(null);
      // Focus first input after animation
      setTimeout(() => firstInputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Recalculate recommendation whenever measurements change
  useEffect(() => {
    const toCmVal = (v) => {
      const n = parseFloat(v);
      if (!n || n <= 0) return 0;
      return unit === 'in' ? toCm(n) : n;
    };

    const c = toCmVal(measurements.chest);
    const w = toCmVal(measurements.waist);
    const h = toCmVal(measurements.hips);

    setRecommended(recommendSize(c, w, h));
  }, [measurements, unit]);

  const handleInputChange = useCallback((field, value) => {
    // Allow only numbers and one decimal
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;
    setMeasurements((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleApply = () => {
    if (recommended && onSelectSize) {
      onSelectSize(recommended);
    }
    onClose();
  };

  const chart = unit === 'cm' ? SIZE_CHART_CM : SIZE_CHART_IN;
  const suffix = unit === 'cm' ? 'cm' : 'in';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Size guide"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-50 w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* ── Header ──────────────────────────────────────── */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 shrink-0">
              <div className="flex items-center gap-2">
                <Ruler size={18} className="text-violet-500" />
                <h2 className="text-base font-semibold text-zinc-900 tracking-tight font-display">
                  Size Guide
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-zinc-100 text-zinc-400 transition-colors"
                aria-label="Close size guide"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            {/* ── Tabs ────────────────────────────────────────── */}
            <div className="sg-tabs shrink-0">
              <button
                className={`sg-tab ${activeTab === 'finder' ? 'sg-tab--active' : ''}`}
                onClick={() => setActiveTab('finder')}
              >
                Find Your Size
              </button>
              <button
                className={`sg-tab ${activeTab === 'chart' ? 'sg-tab--active' : ''}`}
                onClick={() => setActiveTab('chart')}
              >
                Size Chart
              </button>
            </div>

            {/* ── Scrollable Content ──────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {activeTab === 'finder' ? (
                /* ──────────── FIND YOUR SIZE TAB ──────────── */
                <div className="flex flex-col gap-5">
                  {/* Unit Toggle */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Your Measurements
                    </p>
                    <div className="sg-unit-toggle">
                      <button
                        className={`sg-unit-btn ${unit === 'cm' ? 'sg-unit-btn--active' : ''}`}
                        onClick={() => setUnit('cm')}
                      >
                        CM
                      </button>
                      <button
                        className={`sg-unit-btn ${unit === 'in' ? 'sg-unit-btn--active' : ''}`}
                        onClick={() => setUnit('in')}
                      >
                        IN
                      </button>
                    </div>
                  </div>

                  {/* Two-column layout: diagram + inputs */}
                  <div className="sg-finder-grid">
                    <BodyDiagram focusedField={focusedField} />

                    <div className="flex flex-col gap-4">
                      {['chest', 'waist', 'hips'].map((field, i) => (
                        <div className="sg-input-group" key={field}>
                          <label className="sg-input-label" htmlFor={`sg-${field}`}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          <div className="sg-input-wrapper">
                            <input
                              ref={i === 0 ? firstInputRef : undefined}
                              id={`sg-${field}`}
                              type="text"
                              inputMode="decimal"
                              placeholder={unit === 'cm' ? 'e.g. 88' : 'e.g. 34.5'}
                              className={`sg-input ${focusedField === field ? 'sg-input--highlighted' : ''}`}
                              value={measurements[field]}
                              onChange={(e) => handleInputChange(field, e.target.value)}
                              onFocus={() => setFocusedField(field)}
                              onBlur={() => setFocusedField(null)}
                              autoComplete="off"
                            />
                            <span className="sg-input-suffix">{suffix}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* How to measure tip */}
                  <div className="sg-how-to">
                    <Info size={14} />
                    <span>
                      Measure around the fullest part of your chest, the narrowest part of your natural waist,
                      and the widest part of your hips. Keep the tape snug but not tight.
                    </span>
                  </div>

                  {/* Result */}
                  <AnimatePresence mode="wait">
                    {recommended && (
                      <motion.div
                        key={recommended}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="sg-result"
                      >
                        <div className="sg-result__size">{recommended}</div>
                        <div className="sg-result__text">
                          <span className="sg-result__label">
                            We recommend size {recommended}
                          </span>
                          <span className="sg-result__hint">
                            Based on your measurements
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* ──────────── SIZE CHART TAB ──────────────── */
                <div className="flex flex-col gap-4">
                  {/* Unit Toggle */}
                  <div className="flex items-center justify-end">
                    <div className="sg-unit-toggle">
                      <button
                        className={`sg-unit-btn ${unit === 'cm' ? 'sg-unit-btn--active' : ''}`}
                        onClick={() => setUnit('cm')}
                      >
                        CM
                      </button>
                      <button
                        className={`sg-unit-btn ${unit === 'in' ? 'sg-unit-btn--active' : ''}`}
                        onClick={() => setUnit('in')}
                      >
                        IN
                      </button>
                    </div>
                  </div>

                  <div className="sg-table-wrap">
                    <table className="sg-table">
                      <thead>
                        <tr>
                          <th>Size</th>
                          <th>Chest ({suffix})</th>
                          <th>Waist ({suffix})</th>
                          <th>Hips ({suffix})</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SIZES.map((size) => (
                          <tr key={size}>
                            <td className={recommended === size ? 'sg-table__highlight' : ''}>
                              {size}
                            </td>
                            <td className={recommended === size ? 'sg-table__highlight' : ''}>
                              {chart[size].chest[0]}–{chart[size].chest[1]}
                            </td>
                            <td className={recommended === size ? 'sg-table__highlight' : ''}>
                              {chart[size].waist[0]}–{chart[size].waist[1]}
                            </td>
                            <td className={recommended === size ? 'sg-table__highlight' : ''}>
                              {chart[size].hips[0]}–{chart[size].hips[1]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* ── Footer ──────────────────────────────────────── */}
            <div className="shrink-0 border-t border-zinc-100 px-5 py-4 bg-white">
              <button
                className="sg-apply-btn"
                disabled={!recommended}
                onClick={handleApply}
              >
                {recommended ? `Apply Size ${recommended}` : 'Enter measurements above'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
