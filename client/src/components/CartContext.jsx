// ============================================================
// Threadline — Cart Context
//
// Provides cart state and actions to the entire component tree.
// Wraps the useCart SWR hook so any component can read or
// mutate the cart without prop-drilling.
// ============================================================

import { createContext, useContext } from 'react';
import { useCart } from '../hooks/useCart';

const CartContext = createContext(null);

/**
 * Wrap your app with <CartProvider> inside <SWRProvider>.
 */
export function CartProvider({ children }) {
  const cart = useCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

/**
 * Access global cart state and actions from any component.
 *
 * @returns {ReturnType<typeof useCart>}
 */
export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCartContext must be used within a <CartProvider>');
  }
  return ctx;
}
