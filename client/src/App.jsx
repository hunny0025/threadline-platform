// ============================================================
// Threadline Platform - Main App Component
// This is the root React component for the frontend.
// ============================================================

import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";

// Eagerly-loaded lightweight pages
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { FAQ } from "./pages/FAQ";
import { Returns } from "./pages/Returns";

// Lazy-loaded heavy pages — code-split into separate chunks
const Catalog = lazy(() => import("./pages/Catalog").then(m => ({ default: m.Catalog })));
const ProductDetail = lazy(() => import("./pages/ProductDetail").then(m => ({ default: m.ProductDetail })));
const Checkout = lazy(() => import("./pages/Checkout").then(m => ({ default: m.Checkout })));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation").then(m => ({ default: m.OrderConfirmation })));
const Landing = lazy(() => import("./pages/Landing").then(m => ({ default: m.Landing })));

import {
  Button,
  Modal,
  RouteLoadingBar,
  PageTransition,
  ErrorBoundary,
} from "@/src/components/ui";
import { SWRProvider } from "./components/SWRProvider";
import { CartProvider } from "./components/CartContext";
import "./App.css";

import { useEffect } from "react";

// Skeleton loader for lazy-loaded pages
function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-zinc-200 border-t-violet-600 rounded-full animate-spin" />
        <p className="text-sm text-zinc-400 tracking-wide">Loading…</p>
      </div>
    </div>
  );
}

// Animated routes component that uses location for AnimatePresence
function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <PageTransition preset="slideUp" duration={0.4}>
      <Suspense fallback={<PageFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/shop" element={<Catalog />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
      </Suspense>
    </PageTransition>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SWRProvider>
      <CartProvider>
        <BrowserRouter>
        <ErrorBoundary>
          <div className="app min-h-screen bg-white font-body text-zinc-900 pt-16 flex flex-col">
            {/* Skip Navigation Link */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
            >
              Skip to main content
            </a>
            <RouteLoadingBar variant="primary" size="sm" showShimmer />
            <Header />

            <main id="main-content" className="flex-1">
              <AnimatedRoutes />
            </main>

            <Footer />

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Priority Access"
              size="md"
            >
              <div className="space-y-4">
                <p className="text-neutral-600">
                  Get first access to every low-volume drop and private capsule
                  release before public launch.
                </p>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Not now
                  </Button>
                  <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                    Reserve Spot
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        </ErrorBoundary>
      </BrowserRouter>
      </CartProvider>
    </SWRProvider>
  );
}

export default App;

