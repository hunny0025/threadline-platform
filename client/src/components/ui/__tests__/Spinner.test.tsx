import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Spinner } from '../Spinner';

describe('Spinner Component', () => {
  it('renders correctly', () => {
    render(<Spinner />);
    // Testing library standard rule: query elements by status role
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders screen reader text', () => {
    render(<Spinner />);
    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
  });
});
