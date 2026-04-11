import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from '../Input';

describe('Input Component', () => {
  it('renders correctly with placeholder', () => {
    render(<Input placeholder="Enter username" />);
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
  });

  it('renders label and helper text', () => {
    render(<Input label="Username" helperText="Make it unique" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Make it unique')).toBeInTheDocument();
  });

  it('can be typed into', () => {
    render(<Input placeholder="Email" />);
    const input = screen.getByPlaceholderText(/email/i);
    fireEvent.change(input, { target: { value: 'test@test.com' } });
    expect(input.value).toBe('test@test.com');
  });

  it('shows error styles when error prop is true', () => {
    render(<Input error helperText="Invalid input" placeholder="Email" />);
    const helperTxt = screen.getByText('Invalid input');
    expect(helperTxt).toHaveClass('text-red-600');
  });
});
