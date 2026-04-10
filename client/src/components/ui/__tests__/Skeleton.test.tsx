import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from '../Skeleton';

describe('Skeleton Component', () => {
  it('renders with default class', () => {
    const { container } = render(<Skeleton />);
    const skeletonElement = container.firstChild;
    expect(skeletonElement).toHaveClass('animate-pulse');
    expect(skeletonElement).toHaveClass('rounded-md'); // default text variant
  });

  it('applies circular variant', () => {
    const { container } = render(<Skeleton variant="circular" />);
    const skeletonElement = container.firstChild;
    expect(skeletonElement).toHaveClass('animate-pulse');
    expect(skeletonElement).toHaveClass('rounded-full');
  });
});
