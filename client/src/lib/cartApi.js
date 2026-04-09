// ============================================================
// Threadline Platform — Cart & Checkout API Helpers
//
// All cart operations use a guest session ID stored in
// localStorage. When the user is logged in, Bearer token
// auth takes precedence on the backend (optionalAuth).
// ============================================================

import { API_BASE } from './api';

/* ── Session Management ───────────────────────────────────── */

const SESSION_KEY = 'threadline_session_id';

/**
 * Returns (or creates) a stable guest session ID.
 * The backend cart routes use `x-session-id` to identify guest carts.
 */
export function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess_${crypto.randomUUID()}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/**
 * Common headers for every cart / order request.
 */
function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-session-id': getSessionId(),
  };
}

/* ── SWR Fetcher (with session header) ────────────────────── */

/**
 * Custom fetcher for the cart SWR hook.
 * Identical to the global fetcher but injects x-session-id.
 */
export async function cartFetcher(url) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      body?.message || `API error ${res.status}: ${res.statusText}`;
    const err = new Error(message);
    err.status = res.status;
    err.info = body;
    throw err;
  }

  const json = await res.json();

  if (json.success === false) {
    const err = new Error(json.message || 'Request failed');
    err.status = json.status || 500;
    err.info = json;
    throw err;
  }

  return json.data;
}

/* ── Cart CRUD ────────────────────────────────────────────── */

/**
 * POST /api/v1/cart/add
 * @param {string} variantId  ProductVariant ObjectId
 * @param {number} quantity   Defaults to 1
 */
export async function addToCart(variantId, quantity = 1) {
  const res = await fetch(`${API_BASE}/api/v1/cart/add`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ variantId, quantity }),
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || 'Failed to add item to cart');
  }
  return json.data;
}

/**
 * PATCH /api/v1/cart/update
 * @param {string} variantId
 * @param {number} quantity   Set to 0 to remove
 */
export async function updateCartItem(variantId, quantity) {
  const res = await fetch(`${API_BASE}/api/v1/cart/update`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ variantId, quantity }),
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || 'Failed to update cart');
  }
  return json.data;
}

/**
 * DELETE /api/v1/cart/remove
 * @param {string} variantId
 */
export async function removeCartItem(variantId) {
  const res = await fetch(`${API_BASE}/api/v1/cart/remove`, {
    method: 'DELETE',
    headers: getHeaders(),
    body: JSON.stringify({ variantId }),
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || 'Failed to remove item');
  }
  return json.data;
}

/* ── Order & Payment ──────────────────────────────────────── */

/**
 * POST /api/v1/orders — Create order from cart (auth required).
 * NOTE: For the guest flow we include the session header; the
 * backend currently requires auth for orders. A future iteration
 * may support guest checkout.
 */
export async function createOrder(authToken) {
  const headers = getHeaders();
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE}/api/v1/orders`, {
    method: 'POST',
    headers,
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || 'Failed to create order');
  }
  return json.data;
}

/**
 * POST /api/v1/payment/create-intent
 */
export async function createPaymentIntent(orderId, authToken) {
  const headers = getHeaders();
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE}/api/v1/payment/create-intent`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ orderId }),
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || 'Failed to create payment intent');
  }
  return json.data;
}

/**
 * POST /api/v1/payment/confirm
 */
export async function confirmPayment(payload, authToken) {
  const headers = getHeaders();
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE}/api/v1/payment/confirm`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || 'Payment confirmation failed');
  }
  return json.data;
}
