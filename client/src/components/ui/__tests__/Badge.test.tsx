import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../Badge';

describe('Badge Component', () => {
  it('renders content', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies success variant', () => {
    render(<Badge variant="success">Completed</Badge>);
    const badge = screen.getByText('Completed');
    expect(badge).toHaveClass('bg-green-100');
  });

  it('renders pulse dot when pulse is true', () => {
    const { container } = render(<Badge pulse>Live</Badge>);
    // Look for the span that represents the pulse dot
    const pulseDot = container.querySelector('.bg-green-400');
    expect(pulseDot).toBeInTheDocument();
  });
});
