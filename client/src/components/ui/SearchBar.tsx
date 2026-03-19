import { motion, AnimatePresence } from "motion/react";
import {
  forwardRef,
  InputHTMLAttributes,
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Search, X, Clock, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useDebounce } from "@/src/hooks/useDebounce";
import {
  useSearchHistory,
  SearchHistoryItem,
} from "@/src/hooks/useSearchHistory";

const searchBarVariants = cva(
  [
    "flex w-full items-center gap-2 rounded-lg font-display text-sm transition-all duration-300",
    "bg-white border border-neutral-200 text-black",
    "hover:border-neutral-300",
    "focus-within:border-black focus-within:ring-2 focus-within:ring-black/5",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "px-2 py-1.5",
        md: "px-3 py-2",
        lg: "px-4 py-3",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  thumbnail?: string;
}

export interface SearchBarProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "size" | "onChange" | "results" | "onSelect"
    >,
    VariantProps<typeof searchBarVariants> {
  results?: SearchResult[];
  isLoading?: boolean;
  debounceMs?: number;
  showHistory?: boolean;
  onSearch?: (query: string) => void;
  onSelect?: (result: SearchResult) => void;
  onHistorySelect?: (item: SearchHistoryItem) => void;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      size,
      results = [],
      isLoading = false,
      debounceMs = 300,
      showHistory = true,
      onSearch,
      onSelect,
      onHistorySelect,
      placeholder = "Search...",
      ...props
    },
    ref,
  ) => {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedQuery = useDebounce(query, debounceMs);
    const { history, addToHistory, removeFromHistory } = useSearchHistory();

    const showDropdown =
      isFocused && (query.length > 0 || (showHistory && history.length > 0));
    const showResults = query.length > 0 && results.length > 0;
    const showHistoryItems =
      query.length === 0 && showHistory && history.length > 0;

    const totalItems = showResults
      ? results.length
      : showHistoryItems
        ? history.length
        : 0;

    useEffect(() => {
      if (debouncedQuery) {
        onSearch?.(debouncedQuery);
      }
    }, [debouncedQuery, onSearch]);

    useEffect(() => {
      setSelectedIndex(-1);
    }, [query, results]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsFocused(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (!showDropdown) return;

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
            break;
          case "ArrowUp":
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
            break;
          case "Enter":
            e.preventDefault();
            if (selectedIndex >= 0) {
              if (showResults) {
                const result = results[selectedIndex];
                addToHistory(result.title, result.thumbnail);
                onSelect?.(result);
                setQuery("");
                setIsFocused(false);
              } else if (showHistoryItems) {
                const item = history[selectedIndex];
                setQuery(item.query);
                onHistorySelect?.(item);
              }
            } else if (query.trim()) {
              addToHistory(query);
              onSearch?.(query);
            }
            break;
          case "Escape":
            setIsFocused(false);
            inputRef.current?.blur();
            break;
        }
      },
      [
        showDropdown,
        totalItems,
        selectedIndex,
        showResults,
        showHistoryItems,
        results,
        history,
        query,
        addToHistory,
        onSelect,
        onHistorySelect,
        onSearch,
      ],
    );

    const handleResultClick = (result: SearchResult) => {
      addToHistory(result.title, result.thumbnail);
      onSelect?.(result);
      setQuery("");
      setIsFocused(false);
    };

    const handleHistoryClick = (item: SearchHistoryItem) => {
      setQuery(item.query);
      onHistorySelect?.(item);
    };

    const clearQuery = () => {
      setQuery("");
      inputRef.current?.focus();
    };

    return (
      <div ref={containerRef} className="relative w-full">
        <motion.div
          className={cn(searchBarVariants({ size, className }))}
          initial={{ scale: 1 }}
          animate={{ scale: isFocused ? 1.01 : 1 }}
          transition={{ duration: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <Search className="h-4 w-4 text-neutral-400 shrink-0" />
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none placeholder:text-neutral-400"
            {...props}
          />
          <AnimatePresence>
            {query && (
              <motion.button
                type="button"
                onClick={clearQuery}
                className="p-0.5 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-neutral-200 shadow-lg overflow-hidden z-50"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              {isLoading && (
                <div className="px-4 py-3 text-sm text-neutral-500 flex items-center gap-2">
                  <motion.div
                    className="h-4 w-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  Searching...
                </div>
              )}

              {!isLoading && showResults && (
                <ul className="max-h-80 overflow-y-auto">
                  {results.map((result, index) => (
                    <motion.li
                      key={result.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <button
                        type="button"
                        onClick={() => handleResultClick(result)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                          selectedIndex === index
                            ? "bg-neutral-100"
                            : "hover:bg-neutral-50",
                        )}
                      >
                        {result.thumbnail ? (
                          <img
                            src={result.thumbnail}
                            alt=""
                            className="h-10 w-10 rounded-md object-cover shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-neutral-100 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {result.title}
                          </p>
                          {result.subtitle && (
                            <p className="text-xs text-neutral-500 truncate">
                              {result.subtitle}
                            </p>
                          )}
                        </div>
                        {selectedIndex === index && (
                          <span className="text-xs text-neutral-400 shrink-0">
                            Press Enter
                          </span>
                        )}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}

              {!isLoading && showHistoryItems && (
                <div>
                  <div className="px-4 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wide border-b border-neutral-100">
                    Recent Searches
                  </div>
                  <ul className="max-h-60 overflow-y-auto">
                    {history.map((item, index) => (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <div
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 transition-colors",
                            selectedIndex === index
                              ? "bg-neutral-100"
                              : "hover:bg-neutral-50",
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => handleHistoryClick(item)}
                            className="flex-1 flex items-center gap-3 text-left min-w-0"
                          >
                            <Clock className="h-4 w-4 text-neutral-400 shrink-0" />
                            {item.thumbnail ? (
                              <img
                                src={item.thumbnail}
                                alt=""
                                className="h-8 w-8 rounded object-cover shrink-0"
                              />
                            ) : null}
                            <span className="text-sm text-neutral-700 truncate">
                              {item.query}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromHistory(item.id);
                            }}
                            className="p-1 rounded hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600 transition-colors shrink-0"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {!isLoading && query && results.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-neutral-500">
                  No results found for "{query}"
                </div>
              )}

              <div className="px-4 py-2 border-t border-neutral-100 flex items-center justify-end gap-4 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  <ArrowDown className="h-3 w-3" />
                  to navigate
                </span>
                <span>Enter to select</span>
                <span>Esc to close</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

SearchBar.displayName = "SearchBar";

export { SearchBar, searchBarVariants };
