import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { CartDrawer } from '../CartDrawer';

const mockItems = [
  {
    variantId: 'v_1',
    productId: 'p_1',
    title: 'Blue Jeans',
    price: 50,
    quantity: 2,
    image: 'jeans.jpg',
    color: 'Blue',
    size: '32'
  }
];

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('CartDrawer', () => {
  it('does not render when isOpen is false', () => {
    renderWithRouter(<CartDrawer isOpen={false} onClose={vi.fn()} cartItems={mockItems} />);
    
    expect(screen.queryByText('Your Cart')).not.toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    renderWithRouter(<CartDrawer isOpen={true} onClose={vi.fn()} cartItems={[]} />);
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue shopping/i })).toBeInTheDocument();
  });

  it('renders cart items and calculates totals', () => {
    renderWithRouter(<CartDrawer isOpen={true} onClose={vi.fn()} cartItems={mockItems} updateQuantity={vi.fn()} removeItem={vi.fn()} />);
    
    expect(screen.getByText('Blue Jeans')).toBeInTheDocument();
    expect(screen.getByText('$50.00')).toBeInTheDocument();
    
    // Subtotal: $100
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    // Shipping: $15
    expect(screen.getByText('$15.00')).toBeInTheDocument();
    // Tax: $8
    expect(screen.getByText('$8.00')).toBeInTheDocument();
    // Total: $123 (100 + 15 + 8)
    expect(screen.getByText('$123.00')).toBeInTheDocument();
  });

  it('calls updateQuantity on plus/minus click', () => {
    const updateSpy = vi.fn();
    renderWithRouter(<CartDrawer isOpen={true} onClose={vi.fn()} cartItems={mockItems} updateQuantity={updateSpy} removeItem={vi.fn()} />);
    
    const incBtn = screen.getByRole('button', { name: /increase quantity/i });
    fireEvent.click(incBtn);
    expect(updateSpy).toHaveBeenCalledWith('v_1', 3);
    
    updateSpy.mockClear();
    
    const decBtn = screen.getByRole('button', { name: /decrease quantity/i });
    fireEvent.click(decBtn);
    expect(updateSpy).toHaveBeenCalledWith('v_1', 1);
  });

  it('calls removeItem on trash click', () => {
    const removeSpy = vi.fn();
    renderWithRouter(<CartDrawer isOpen={true} onClose={vi.fn()} cartItems={mockItems} updateQuantity={vi.fn()} removeItem={removeSpy} />);
    
    const removeBtn = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeBtn);
    
    expect(removeSpy).toHaveBeenCalledWith('v_1');
  });
});
