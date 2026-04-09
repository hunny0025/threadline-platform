// ============================================================
// Threadline — SWR hook for Search API
// GET /api/v1/search?q=<query>
// ============================================================

import useSWR from 'swr';
import { fetcher } from '../lib/api';

/**
 * Map an API search result to the SearchResult shape expected by SearchBar.
 *
 * API shape:  { id, name, slug, basePrice, thumbnail, category, gender, fitType }
 * UI shape:   { id, title, subtitle, thumbnail }
 */
function mapResult(item) {
  const categoryName = item.category?.name || '';
  const price = item.basePrice != null ? `$${Number(item.basePrice).toFixed(2)}` : '';
  const subtitle = [categoryName, price].filter(Boolean).join(' · ');

  return {
    id: item.id || item._id,
    title: item.name,
    subtitle,
    thumbnail: item.thumbnail || null,
  };
}

/**
 * Search products by text query.
 *
 * @param {string} query  Search text (must be >= 2 chars to fire)
 * @returns {{ results, count, isLoading, isError, error }}
 */
export function useSearch(query) {
  const trimmed = (query || '').trim();
  const key = trimmed.length >= 2 ? `/api/v1/search?q=${encodeURIComponent(trimmed)}` : null;

  const { data, error, isLoading } = useSWR(key, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
    dedupingInterval: 2000,
  });

  return {
    results: data?.results ? data.results.map(mapResult) : [],
    count: data?.count || 0,
    isLoading,
    isError: !!error,
    error,
  };
}
