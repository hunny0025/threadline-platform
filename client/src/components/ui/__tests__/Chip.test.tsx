import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Chip } from '../Chip';

describe('Chip Component', () => {
  it('renders correctly', () => {
    render(<Chip>Apple</Chip>);
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('renders remove button when removable is true', () => {
    render(<Chip removable onRemove={() => {}}>Apple</Chip>);
    expect(screen.getByRole('button', { name: /remove chip/i })).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const handleRemove = vi.fn();
    render(<Chip removable onRemove={handleRemove}>Apple</Chip>);
    
    fireEvent.click(screen.getByRole('button', { name: /remove chip/i }));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });
});
