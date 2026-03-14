// ============================================================
// Threadline Platform - Main App Component
// This is the root React component for the frontend.
// Currently displays a landing/placeholder page.
// Team members can build upon this to add routing, pages, etc.
// ============================================================

import { useState, useEffect } from 'react';
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
    <div className="app">
      <header className="hero">
        <div className="hero-content">
          <h1 className="logo">
            <span className="logo-icon">🧵</span> Threadline
          </h1>
          <p className="tagline">Fashion E-Commerce Platform</p>
          <p className="subtitle">
            Discover curated fashion. Built with passion.
          </p>
          <div className="status-badge">
            <span className={`dot ${healthStatus === 'OK' ? 'online' : 'offline'}`}></span>
            API Status: {healthStatus || 'Checking...'}
          </div>
        </div>
      </header>

      <main className="features">
        <div className="feature-card">
          <span className="feature-icon">👗</span>
          <h3>Browse Products</h3>
          <p>Explore our curated fashion collection</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🛒</span>
          <h3>Easy Ordering</h3>
          <p>Seamless checkout experience</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">👤</span>
          <h3>User Accounts</h3>
          <p>Personalized shopping experience</p>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2026 Threadline. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
