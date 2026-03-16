// ============================================================
// Threadline Platform - Main App Component
// This is the root React component for the frontend.
// Currently displays a landing/placeholder page.
// Team members can build upon this to add routing, pages, etc.
// ============================================================

import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
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

      <footer className="footer bg-white border-t border-zinc-200 py-12 text-center">
        <p className="text-zinc-500 font-body text-sm">&copy; 2026 Threadline. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
