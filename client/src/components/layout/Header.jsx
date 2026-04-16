import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../../lib/api";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, User, AlertCircle, Menu } from "lucide-react";
import { useScrollDirection } from "../../hooks/useScrollDirection";
import { SearchBar } from "../ui/SearchBar";
import { AuthModal, Button } from "../ui";
import { CartDrawer } from "./CartDrawer";
import { useCartContext } from "../CartContext";
import { useSearch } from "../../hooks/useSearch";
import { useDebounce } from "../../hooks/useDebounce";

export function Header() {
  const scrollDirection = useScrollDirection();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const searchModalRef = useRef(null);

  // ── Focus trap for search modal ────────────────────────────
  useEffect(() => {
    if (!isSearchOpen) return;
    const modal = searchModalRef.current;
    if (!modal) return;
    const focusableEls = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusableEls[0];
    const last = focusableEls[focusableEls.length - 1];
    const handleTrap = (e) => {
      if (e.key === 'Escape') { closeSearch(); return; }
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    modal.addEventListener('keydown', handleTrap);
    // Auto-focus first element
    setTimeout(() => first?.focus(), 100);
    return () => modal.removeEventListener('keydown', handleTrap);
  }, [isSearchOpen]);

  // ── Live Search via API ────────────────────────────────────
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const {
    results: searchResults,
    isLoading: isSearching,
    isError: isSearchError,
    error: searchError,
  } = useSearch(debouncedSearchQuery);

  // ── Live Cart State from API ──────────────────────────────
  const { cartItems, itemCount, updateItem, removeItem } = useCartContext();

  // Auth handlers
  const openLogin = () => {
    setAuthMode("login");
    setIsAuthOpen(true);
  };

  const openSignup = () => {
    setAuthMode("signup");
    setIsAuthOpen(true);
  };

  const handleLogin = async (data) => {
    const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Invalid email or password");
    }

    const user = await response.json();
    console.log("Logged in:", user);
  };

  const handleSignup = async (data) => {
    const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Could not create account");
    }

    const user = await response.json();
    console.log("Signed up:", user);
  };

  const handleGoogleAuth = async () => {
    window.location.href = `${API_BASE}/api/v1/auth/google`;
  };

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleResultSelect = useCallback(
    (result) => {
      setIsSearchOpen(false);
      setSearchQuery("");
      navigate(`/product/${result.id}`);
    },
    [navigate],
  );

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 transition-all duration-300 ${
          scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-1 flex justify-start">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <span className="text-2xl">🧵</span>
                <span className="font-display font-bold text-xl tracking-tight text-zinc-900">
                  Threadline
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-shrink-0 space-x-8" aria-label="Main navigation">
              <Link
                to="/shop"
                className="font-body text-sm font-medium text-zinc-600 hover:text-violet-600 transition-colors"
              >
                Shop
              </Link>
              <Link
                to="/collections"
                className="font-body text-sm font-medium text-zinc-600 hover:text-violet-600 transition-colors"
              >
                Collections
              </Link>
              <Link
                to="/about"
                className="font-body text-sm font-medium text-zinc-600 hover:text-violet-600 transition-colors"
              >
                About
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex-1 flex items-center justify-end space-x-3">
              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="md:hidden relative p-1.5 text-zinc-600 hover:text-violet-600 transition-colors focus:outline-none"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Search Button */}
              <button
                onClick={openSearch}
                className="relative p-1.5 text-zinc-600 hover:text-violet-600 transition-colors focus:outline-none"
                aria-label="Search products"
              >
                <span className="sr-only">Search</span>
                <Search className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-zinc-600 hover:text-violet-600 transition-colors focus:outline-none"
              >
                <span className="sr-only">Cart</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1 -translate-y-1 bg-violet-600 rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Sign In Button */}
              <Button
                size="sm"
                onClick={openLogin}
                className="hidden sm:inline-flex"
              >
                <User className="mr-1 h-3.5 w-3.5" />
                Sign In
              </Button>

              {/* Mobile Sign In Icon */}
              <Button
                size="sm"
                variant="ghost"
                onClick={openLogin}
                className="sm:hidden p-1.5"
              >
                <span className="sr-only">Sign In</span>
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeSearch}
            />

            {/* Search Modal */}
            <motion.div
              ref={searchModalRef}
              className="fixed top-16 left-0 right-0 z-60 bg-white border-b border-zinc-200 shadow-xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
              role="search"
              aria-label="Product search"
            >
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-display font-semibold text-zinc-900">
                    Search Products
                  </h2>
                  <button
                    onClick={closeSearch}
                    className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors rounded-lg hover:bg-zinc-100"
                    aria-label="Close search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="mb-4">
                  <SearchBar
                    placeholder="Search for products, brands, categories..."
                    size="lg"
                    results={searchResults}
                    isLoading={isSearching}
                    onSearch={handleSearch}
                    onSelect={handleResultSelect}
                    showHistory={true}
                    className="shadow-sm border-zinc-300"
                    autoFocus
                  />
                </div>

                {/* Search Error */}
                {isSearchError && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{searchError?.message || 'Search failed. Please try again.'}</span>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="border-t border-zinc-100 pt-4">
                  <p className="text-sm text-zinc-500 mb-3">Quick searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "New Arrivals",
                      "Sale Items",
                      "Bestsellers",
                      "Accessories",
                      "Dresses",
                      "Shoes",
                    ].map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="px-3 py-1.5 text-sm bg-zinc-100 text-zinc-700 rounded-full hover:bg-zinc-200 transition-colors"
                        aria-label={`Search for ${term}`}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onGoogleAuth={handleGoogleAuth}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={(variantId, newQty) => updateItem(variantId, newQty)}
        removeItem={(variantId) => removeItem(variantId)}
      />

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileNavOpen(false)}
            />
            <motion.nav
              className="fixed top-0 left-0 h-full w-72 bg-white z-[110] shadow-2xl flex flex-col md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: [0.43, 0.13, 0.23, 0.96], duration: 0.4 }}
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200">
                <span className="font-display font-bold text-lg tracking-tight text-zinc-900">Menu</span>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 px-5 py-6 space-y-1">
                {[{to:"/shop",label:"Shop"},{to:"/collections",label:"Collections"},{to:"/about",label:"About"},{to:"/faq",label:"FAQ"},{to:"/returns",label:"Returns"}].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileNavOpen(false)}
                    className="block py-3 px-3 text-base font-medium text-zinc-700 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-zinc-200">
                <Button variant="primary" className="w-full" onClick={() => { setIsMobileNavOpen(false); openLogin(); }}>
                  <User className="mr-2 h-4 w-4" /> Sign In
                </Button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
