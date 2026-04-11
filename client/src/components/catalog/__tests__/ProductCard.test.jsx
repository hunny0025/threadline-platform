import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '../ProductCard';

const mockProduct = {
  id: 'prod_1',
  title: 'Test Shirt',
  price: 45.00,
  image: 'test-image.jpg',
  isNew: true,
  lowStock: false,
  sizes: ['S', 'M', 'L']
};

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('ProductCard', () => {
  it('renders product details correctly', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Shirt')).toBeInTheDocument();
    expect(screen.getByText('$45')).toBeInTheDocument();
    expect(screen.getByText('NEW')).toBeInTheDocument();
    expect(screen.getByAltText('Test Shirt')).toHaveAttribute('src', 'test-image.jpg');
  });

  it('handles wishlist toggle', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    
    const wishlistBtn = screen.getByRole('button', { name: /add to wishlist/i });
    fireEvent.click(wishlistBtn);
    
    // Heart icon changes color on click (wishlisted state)
    // We can just verify it doesn't crash, or check the DOM if needed.
    expect(wishlistBtn.querySelector('svg')).toHaveClass('fill-red-500');
  });

  it('calls onQuickLook when quick look button is clicked', () => {
    const onQuickLookMock = vi.fn();
    renderWithRouter(<ProductCard product={mockProduct} onQuickLook={onQuickLookMock} />);
    
    const quickLookBtn = screen.getByRole('button', { name: /quick look/i });
    fireEvent.click(quickLookBtn);
    
    expect(onQuickLookMock).toHaveBeenCalledWith(mockProduct);
  });
  
  it('renders size options if available', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    
    expect(screen.getByRole('button', { name: /select size s/i })).toBeInTheDocument();
  });
});
