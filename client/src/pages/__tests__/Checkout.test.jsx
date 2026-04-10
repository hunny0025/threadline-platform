import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Checkout } from '../Checkout';
import * as CartContext from '../../components/CartContext';
import * as cartApi from '../../lib/cartApi';

// Mock routing since Checkout uses useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock hooks and APIs
vi.spyOn(CartContext, 'useCartContext');
vi.mock('../../lib/cartApi', () => ({
  createOrder: vi.fn(),
  createPaymentIntent: vi.fn(),
  confirmPayment: vi.fn()
}));

const mockCartItems = [
  {
    variantId: 'v_1',
    productId: 'p_1',
    title: 'Test Pants',
    price: 100,
    quantity: 1,
    image: 'pants.jpg',
    color: 'Black',
    size: 'M'
  }
];

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Checkout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when cart is loading', () => {
    CartContext.useCartContext.mockReturnValue({
      cartItems: [],
      subtotal: 0,
      isLoading: true,
      refreshCart: vi.fn()
    });

    const { container } = renderWithRouter(<Checkout />);
    // Check if the pulse animation divs are present
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders empty state when cart is empty', () => {
    CartContext.useCartContext.mockReturnValue({
      cartItems: [],
      subtotal: 0,
      isLoading: false,
      refreshCart: vi.fn()
    });

    renderWithRouter(<Checkout />);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue shopping/i })).toBeInTheDocument();
  });

  it('renders checkout form and order summary when cart has items', () => {
    CartContext.useCartContext.mockReturnValue({
      cartItems: mockCartItems,
      subtotal: 100,
      isLoading: false,
      refreshCart: vi.fn()
    });

    renderWithRouter(<Checkout />);
    
    // Form fields
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    
    // Order Summary
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Test Pants')).toBeInTheDocument();
    // Subtotal + Tax (100 * 0.08 = 8) + Shipping (Standard = 0) = 108
    expect(screen.getByText(/Pay \$108\.00/)).toBeInTheDocument();
  });

  it('updates form inputs correctly', () => {
    CartContext.useCartContext.mockReturnValue({
      cartItems: mockCartItems,
      subtotal: 100,
      isLoading: false,
      refreshCart: vi.fn()
    });

    renderWithRouter(<Checkout />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('handles shipping option changes', () => {
    CartContext.useCartContext.mockReturnValue({
      cartItems: mockCartItems,
      subtotal: 100,
      isLoading: false,
      refreshCart: vi.fn()
    });

    renderWithRouter(<Checkout />);
    
    // Change to Express Shipping ($15)
    const expressRadio = screen.getByDisplayValue('express');
    fireEvent.click(expressRadio);
    
    // Total should now be 100 + 15 + 8(tax) = 123
    expect(screen.getByText(/Pay \$123\.00/)).toBeInTheDocument();
  });
});
