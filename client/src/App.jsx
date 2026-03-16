// ============================================================
// Threadline Platform - Main App Component
// This is the root React component for the frontend.
// Currently displays a landing/placeholder page.
// Team members can build upon this to add routing, pages, etc.
// ============================================================

import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import './App.css';

function App() {
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    // Check backend health on load
    const checkHealth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/health`);
        const data = await res.json();
        setHealthStatus(data.status);
      } catch {
        setHealthStatus('Disconnected');
      }
    };
    checkHealth();
  }, []);

  return (
    <div className="app min-h-screen bg-zinc-50 font-body text-zinc-900 pt-16">
      <Header />
      
      <main>
        {/* Placeholder section to test scrolling */}
        <section className="h-[80vh] flex flex-col items-center justify-center bg-violet-50 text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-violet-950 mb-4 tracking-tight">
            Discover Curated Fashion
          </h1>
          <p className="text-lg text-violet-800 max-w-2xl mb-8">
            Experience the new standard in e-commerce. Built with passion and designed for modern wardrobes.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium text-zinc-600 border border-violet-100">
            <span className={`w-2 h-2 rounded-full ${healthStatus === 'OK' ? 'bg-success' : 'bg-zinc-400'}`}></span>
            API Status: {healthStatus || 'Checking...'}
          </div>
        </section>

        {/* More placeholder content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden group hover:shadow-md transition-shadow">
                <div className="aspect-[4/5] bg-zinc-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-6xl">
                    {['👗', '👚', '👖', '🧥', '🥿', '👜', '👓', '🧣', '👟'][(i - 1) % 9]}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-lg mb-1">Product Sample {i}</h3>
                  <p className="text-zinc-500 text-sm mb-4">Premium quality collection</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-violet-600">${(i * 29.99).toFixed(2)}</span>
                    <button className="text-sm font-medium text-zinc-900 hover:text-violet-600 transition-colors">Add to cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Extra tall section to ensure scrolling */}
        <section className="h-[50vh] bg-zinc-900 text-white flex items-center justify-center flex-col">
          <h2 className="text-3xl font-display font-bold mb-4">Keep Scrolling</h2>
          <p className="text-zinc-400">The header should be hidden when you scroll down here.</p>
        </section>
      </main>

      <footer className="footer bg-white border-t border-zinc-200 py-12 text-center">
        <p className="text-zinc-500 font-body text-sm">&copy; 2026 Threadline. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
