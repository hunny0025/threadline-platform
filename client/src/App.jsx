// ============================================================
// Threadline Platform - Main App Component
// This is the root React component for the frontend.
// ============================================================

import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Home, Landing, About, FAQ, Returns, Catalog, ProductDetail } from "./pages";
import {
  Button,
  Modal,
  RouteLoadingBar,
  PageTransition,
} from "@/src/components/ui";
import "./App.css";

// Animated routes component that uses location for AnimatePresence
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <PageTransition preset="slideUp" duration={0.4}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/shop" element={<Catalog />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/returns" element={<Returns />} />
      </Routes>
    </PageTransition>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app min-h-screen bg-white font-body text-zinc-900 pt-16 flex flex-col">
        <RouteLoadingBar variant="primary" size="sm" showShimmer />
        <Header />

        <main className="flex-1">
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
    </BrowserRouter>
  );
}

export default App;
