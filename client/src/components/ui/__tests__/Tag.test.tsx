import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Tag } from '../Tag';

describe('Tag Component', () => {
  it('renders children correctly', () => {
    render(<Tag>Fashion</Tag>);
    expect(screen.getByText('Fashion')).toBeInTheDocument();
  });

  it('shows remove button and triggers callback when removable is passed', () => {
    const onRemoveMock = vi.fn();
    render(<Tag removable onRemove={onRemoveMock}>Fashion</Tag>);
    
    const removeBtn = screen.getByRole('button', { name: /remove tag/i });
    expect(removeBtn).toBeInTheDocument();
    
    fireEvent.click(removeBtn);
    expect(onRemoveMock).toHaveBeenCalledTimes(1);
  });
});
