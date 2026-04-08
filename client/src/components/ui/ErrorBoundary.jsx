import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * React Error Boundary — catches render-time errors in its subtree and
 * displays a polished fallback instead of a blank screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 *
 * You can also pass a `fallback` prop to customise the error UI.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Allow a custom fallback
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback({ error: this.state.error, reset: this.handleReset })
          : this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

/**
 * Default error fallback — styled consistently with the Threadline design system.
 */
export function ErrorFallback({ error, onReset }) {
  const statusCode = error?.status || null;
  const is404 = statusCode === 404;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <AlertTriangle size={28} className="text-red-500" />
      </div>

      <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight mb-2">
        {is404 ? 'Not Found' : 'Something went wrong'}
      </h2>

      <p className="text-sm sm:text-base text-zinc-500 max-w-md mb-8 leading-relaxed">
        {is404
          ? "We couldn't find what you're looking for. It may have been removed or the link is incorrect."
          : error?.message ||
            'An unexpected error occurred. Please try again.'}
      </p>

      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm active:scale-[0.98]"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
}

/**
 * Inline error message for SWR-level errors inside components
 * (not full-page — used beside skeleton placeholders etc.)
 */
export function InlineError({ error, onRetry, className = '' }) {
  return (
    <div
      className={`border border-red-200 bg-red-50 rounded-xl p-5 flex flex-col items-center text-center gap-3 ${className}`}
    >
      <AlertTriangle size={22} className="text-red-500" />
      <p className="text-sm text-red-700">
        {error?.message || 'Failed to load data'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-medium text-red-600 hover:text-red-800 underline transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * Reusable empty-state component.
 * Shows when a query is successful but no results are returned.
 */
export function EmptyState({
  icon: Icon,
  title = 'No results found',
  description = 'Try adjusting your filters or come back later.',
  action,
  className = '',
}) {
  return (
    <div
      className={`border border-dashed border-zinc-300 rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center ${className}`}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mb-5">
          <Icon size={24} className="text-zinc-400" />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-zinc-800 mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 max-w-sm mb-5">{description}</p>
      {action}
    </div>
  );
}
