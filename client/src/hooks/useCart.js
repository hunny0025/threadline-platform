// ============================================================
// Threadline — SWR hook for Cart API
//
// Uses the custom cartFetcher so every request carries the
// guest session ID header. Exposes normalized cart items plus
// mutation helpers with optimistic updates.
// ============================================================

import useSWR from 'swr';
import {
  cartFetcher,
  addToCart,
  updateCartItem,
  removeCartItem,
} from '../lib/cartApi';

/**
 * Normalise a raw API cart item into a shape the UI can render.
 *
 * Raw item from API:
 *   { variant: { _id, product, size, color, price, stock, ... }, quantity }
 *
 * Normalised shape:
 *   { variantId, productId, title, size, color, price, quantity, image, stock }
 */
function normaliseItem(item) {
  const v = item.variant || {};

  // Product may be populated or just an ObjectId
  const product = typeof v.product === 'object' ? v.product : null;

  return {
    variantId: v._id || v.id || item.variant,
    productId: product?._id || product?.id || v.product,
    title: product?.name || 'Product',
    size: v.size || '',
    color: v.color || '',
    price: v.price || 0,
    quantity: item.quantity || 1,
    stock: v.stock ?? 99,
    image:
      product?.images?.[0] ||
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80',
  };
}

/**
 * @returns {{
 *   cart: object|null,
 *   cartItems: Array,
 *   itemCount: number,
 *   subtotal: number,
 *   isLoading: boolean,
 *   isError: boolean,
 *   error: Error|null,
 *   addItem: (variantId: string, qty?: number) => Promise<void>,
 *   updateItem: (variantId: string, qty: number) => Promise<void>,
 *   removeItem: (variantId: string) => Promise<void>,
 *   refreshCart: () => void,
 * }}
 */
export function useCart() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/v1/cart',
    cartFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3000,
    },
  );

  // Normalise items
  const rawItems = data?.items || [];
  const cartItems = rawItems.map(normaliseItem);

  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  /* ── Mutation helpers ───────────────────────────────────── */

  const addItem = async (variantId, quantity = 1) => {
    // Optimistic: add a temporary entry (or increment if existing)
    const optimistic = data
      ? {
          ...data,
          items: data.items.some(
            (i) => (i.variant?._id || i.variant) === variantId,
          )
            ? data.items.map((i) =>
                (i.variant?._id || i.variant) === variantId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              )
            : [...data.items, { variant: variantId, quantity }],
        }
      : data;

    await mutate(
      async () => {
        await addToCart(variantId, quantity);
        // Return fresh cart by re-fetching
        return cartFetcher('/api/v1/cart');
      },
      {
        optimisticData: optimistic,
        rollbackOnError: true,
        revalidate: true,
      },
    );
  };

  const updateItem = async (variantId, quantity) => {
    if (quantity <= 0) {
      return removeItem(variantId);
    }

    const optimistic = data
      ? {
          ...data,
          items: data.items.map((i) =>
            (i.variant?._id || i.variant) === variantId
              ? { ...i, quantity }
              : i,
          ),
        }
      : data;

    await mutate(
      async () => {
        await updateCartItem(variantId, quantity);
        return cartFetcher('/api/v1/cart');
      },
      {
        optimisticData: optimistic,
        rollbackOnError: true,
        revalidate: true,
      },
    );
  };

  const removeItem = async (variantId) => {
    const optimistic = data
      ? {
          ...data,
          items: data.items.filter(
            (i) => (i.variant?._id || i.variant) !== variantId,
          ),
        }
      : data;

    await mutate(
      async () => {
        await removeCartItem(variantId);
        return cartFetcher('/api/v1/cart');
      },
      {
        optimisticData: optimistic,
        rollbackOnError: true,
        revalidate: true,
      },
    );
  };

  return {
    cart: data || null,
    cartItems,
    itemCount,
    subtotal,
    isLoading,
    isError: !!error,
    error,
    addItem,
    updateItem,
    removeItem,
    refreshCart: () => mutate(),
  };
}
