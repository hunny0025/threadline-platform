// ============================================================
// Threadline Platform - Main App Component
// This is the root React component for the frontend.
// Currently displays a landing/placeholder page.
// Team members can build upon this to add routing, pages, etc.
// ============================================================

import { useState, useEffect } from 'react';
import './App.css';
import { Button, Badge, Input, Tag, Textarea, Chip, Skeleton, Spinner, Modal, Toast } from '@/src/components/ui';

function App() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(true);

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

      <section className="components-showcase" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto', width: '100%', backgroundColor: 'white', color: 'black', borderRadius: '16px', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>UI Components</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Button Section */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Buttons</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Delete</Button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <Button size="sm" variant="primary">Small</Button>
              <Button size="md" variant="primary">Medium</Button>
              <Button size="lg" variant="primary">Large</Button>
            </div>
          </section>

          {/* Badge Section */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Badges</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success" pulse>Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="destructive">Error</Badge>
            </div>
          </section>

          {/* Tag & Chip Section */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Tags & Chips</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Tag variant="default">Fashion</Tag>
              <Tag variant="primary">Premium</Tag>
              <Tag variant="outline">New</Tag>
              <Tag variant="gradient">Trending</Tag>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Chip variant="default" size="md">Default Chip</Chip>
              <Chip variant="filled" size="md">Filled Chip</Chip>
              <Chip variant="outline" size="sm" removable onRemove={() => alert('Removed')}>Small Outline</Chip>
            </div>
          </section>

          {/* Input Section */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Inputs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input variant="default" placeholder="Default input" label="Email" />
              <Input variant="filled" placeholder="Filled input" label="Username" />
            </div>
          </section>

          {/* Feedback & Loading Section */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Loading & Feedback</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Spinner size="sm" variant="primary" />
              <Spinner size="md" variant="current" />
              <Spinner size="lg" variant="neutral" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              <Skeleton variant="text" style={{ width: '80%', height: '20px' }} />
              <Skeleton variant="text" style={{ width: '60%', height: '20px' }} />
              <Skeleton variant="rectangular" style={{ width: '100%', height: '60px' }} />
            </div>
          </section>

          {/* Modal & Toast Section */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Overlays</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Button onClick={() => setIsModalOpen(true)} variant="outline">Open Modal</Button>
              <Button onClick={() => setToastVisible(true)} variant="secondary">Reset Toast</Button>
            </div>
            
            <div style={{ marginTop: '1rem', position: 'relative', height: '100px' }}>
              <Toast 
                variant="success" 
                title="Components loaded" 
                description="The UI has been successfully rendered." 
                isVisible={toastVisible}
                onClose={() => setToastVisible(false)}
                style={{ position: 'absolute', top: 0, left: 0 }}
              />
            </div>
          </section>

          {/* Textarea Section */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: '1 / -1' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Textareas</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <Textarea variant="default" placeholder="Write something..." label="Description" helperText="Tell us more about your product" maxLength={200} showCount />
              <Textarea variant="filled" placeholder="Write your feedback..." label="Feedback" minRows={4} />
            </div>
          </section>
        </div>
      </section>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Example Modal"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-neutral-600">This modal is part of the Threadline UI design system. It traps focus, prevents body scrolling, and can be closed via the backdrop or Escape key.</p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>Confirm</Button>
          </div>
        </div>
      </Modal>

      <footer className="footer">
        <p>&copy; 2026 Threadline. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
