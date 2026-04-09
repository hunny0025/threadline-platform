import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, User } from "lucide-react";
import { useScrollDirection } from "../../hooks/useScrollDirection";
import { SearchBar } from "../ui/SearchBar";
import { AuthModal, Button } from "../ui";
import { CartDrawer } from "./CartDrawer";

export function Header() {
  const scrollDirection = useScrollDirection();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Mock Cart State
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      title: "Heavyweight Boxy Tee",
      price: 45,
      quantity: 1,
      size: "L",
      color: "Washed Black",
      image:
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80",
    },
    {
      id: "2",
      title: "Nylon Cargo Pants",
      price: 120,
      quantity: 1,
      size: "M",
      color: "Olive",
      image:
        "https://images.unsplash.com/photo-1624378441864-6da7c44422e1?w=500&q=80",
    },
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

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
    const response = await fetch("/api/auth/login", {
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
    const response = await fetch("/api/auth/register", {
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
    window.location.href = "/api/auth/google";
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Mock search results
    const mockResults = [
      {
        id: "1",
        title: `${query} - Trending Now`,
        subtitle: "Popular items matching your search",
        thumbnail:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&h=100&fit=crop",
      },
      {
        id: "2",
        title: `${query} - New Arrivals`,
        subtitle: "Latest collection items",
        thumbnail:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
      },
      {
        id: "3",
        title: `${query} - Best Sellers`,
        subtitle: "Most popular items",
        thumbnail:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop",
      },
      {
        id: "4",
        title: `${query} - Sale Items`,
        subtitle: "Discounted prices",
        thumbnail:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop",
      },
    ];

    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const handleResultSelect = (result) => {
    console.log("Header search selected:", result);
    setIsSearchOpen(false);
    // Add navigation logic here
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchResults([]);
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
            <nav className="hidden md:flex flex-shrink-0 space-x-8">
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
              {/* Search Button */}
              <button
                onClick={openSearch}
                className="relative p-1.5 text-zinc-600 hover:text-violet-600 transition-colors focus:outline-none"
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
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1 -translate-y-1 bg-violet-600 rounded-full">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
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
              className="fixed top-16 left-0 right-0 z-60 bg-white border-b border-zinc-200 shadow-xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
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
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />
    </>
  );
}
