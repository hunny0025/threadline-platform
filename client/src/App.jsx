// ============================================================
// Threadline Platform - Main App Component
// This is the root React component for the frontend.
// ============================================================

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Home, Landing, About, FAQ, Returns } from "./pages";
import { Button, Modal } from "@/src/components/ui";
import "./App.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app min-h-screen bg-white font-body text-zinc-900 pt-16 flex flex-col">
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/returns" element={<Returns />} />
          </Routes>
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
