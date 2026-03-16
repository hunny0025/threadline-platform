import { useScrollDirection } from '../../hooks/useScrollDirection';

export function Header() {
  const scrollDirection = useScrollDirection();
  
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 transition-all duration-300 ${
        scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <span className="text-2xl">🧵</span>
            <span className="font-display font-bold text-xl tracking-tight text-zinc-900">
              Threadline
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="font-body text-sm font-medium text-zinc-600 hover:text-violet-600 transition-colors">Shop</a>
            <a href="#" className="font-body text-sm font-medium text-zinc-600 hover:text-violet-600 transition-colors">Collections</a>
            <a href="#" className="font-body text-sm font-medium text-zinc-600 hover:text-violet-600 transition-colors">About</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-zinc-600 hover:text-violet-600 transition-colors focus:outline-none">
              <span className="sr-only">Cart</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"/>
                <circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1 -translate-y-1 bg-violet-600 rounded-full">
                3
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
