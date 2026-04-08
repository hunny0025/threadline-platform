// ============================================================
// Threadline — SWR hooks for Product & Category APIs
// ============================================================

import useSWR from 'swr';
import { fetcher } from '../lib/api';

/**
 * Fetch paginated product list.
 *
 * GET /api/v1/products?page=1&limit=12&category=...
 *
 * @param {Object} params  Query params (page, limit, category, gender, etc.)
 * @returns {{ products, pagination, isLoading, isError, error, mutate }}
 */
export function useProducts(params = {}) {
  const query = new URLSearchParams();

  // Only append defined params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  const key = `/api/v1/products${queryString ? `?${queryString}` : ''}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR(key, fetcher, {
    keepPreviousData: true,
  });

  return {
    products: data?.data || [],
    pagination: data?.pagination || null,
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  };
}

/**
 * Fetch a single product by ID.
 *
 * GET /api/v1/products/:id
 *
 * @param {string|null} id  MongoDB ObjectId
 */
export function useProduct(id) {
  const key = id ? `/api/v1/products/${id}` : null;

  const { data, error, isLoading, mutate } = useSWR(key, fetcher);

  return {
    product: data || null,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

/**
 * Fetch product recommendations.
 *
 * GET /api/v1/products/:id/recommendations
 *
 * @param {string|null} id  MongoDB ObjectId of the source product
 */
export function useRecommendations(id) {
  const key = id ? `/api/v1/products/${id}/recommendations` : null;

  const { data, error, isLoading } = useSWR(key, fetcher);

  return {
    recommendations: data?.recommendations || [],
    count: data?.count || 0,
    isLoading,
    isError: !!error,
    error,
  };
}

/**
 * Fetch all active categories.
 *
 * GET /api/v1/categories
 */
export function useCategories() {
  const { data, error, isLoading } = useSWR('/api/v1/categories', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // categories change rarely
  });

  return {
    categories: data || [],
    isLoading,
    isError: !!error,
    error,
  };
}

/**
 * Fetch a single category by ID.
 *
 * GET /api/v1/categories/:id
 *
 * @param {string|null} id  MongoDB ObjectId
 */
export function useCategory(id) {
  const key = id ? `/api/v1/categories/${id}` : null;

  const { data, error, isLoading } = useSWR(key, fetcher);

  return {
    category: data || null,
    isLoading,
    isError: !!error,
    error,
  };
}
