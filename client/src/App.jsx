// ============================================================
// Threadline Platform - Main App Component
// This is the root React component for the frontend.
// Currently displays a landing/placeholder page.
// Team members can build upon this to add routing, pages, etc.
// ============================================================

import { useState } from "react";
import { Header } from "./components/layout/Header";
import "./App.css";
import { HeroVideoBanner } from "./components/home/HeroVideoBanner";
import BannerStrip from "./components/home/BannerStrip";
import SocialProofStrip from "./components/home/SocialProofStrip";
import FeaturedCollections from "./components/home/FeaturedCollections";
import NewArrivals from "./components/home/NewArrivals";
import { Button, Modal } from "@/src/components/ui";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="app min-h-screen bg-white font-body text-zinc-900 pt-16">
      <Header />

      <main>
        <HeroVideoBanner />
        <BannerStrip />
        <SocialProofStrip />
        <FeaturedCollections />
        <NewArrivals />
      </main>

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

      <footer className="footer bg-white border-t border-zinc-200 py-12 text-center">
        <p className="text-zinc-500 font-body text-sm">
          &copy; 2026 Threadline. Functional utility, kinetic attitude.
        </p>
      </footer>
    </div>
  );
}

export default App;
