// ============================================================
// Threadline Platform — API Client & SWR Fetcher
// Central API layer that all SWR hooks use.
//
// • In dev, Vite proxies /api → localhost:3000 (see vite.config.mjs)
// • In production, VITE_API_URL points to the Railway backend
// ============================================================

/**
 * Base URL for all API requests.
 * Defaults to '' so that Vite's dev proxy handles /api/* automatically.
 */
export const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Standard JSON fetcher for SWR.
 * Unwraps the Threadline API envelope: { success, status, message, data }
 *
 * @param {string} url  Relative or absolute URL
 * @returns {Promise<any>}  The `data` property from the response envelope
 * @throws {Error}  Includes status + message from the API
 */
export async function fetcher(url) {
  const res = await fetch(`${API_BASE}${url}`);

  // Network-level failure
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

  // API-level failure (success: false inside a 200 response)
  if (json.success === false) {
    const err = new Error(json.message || 'Request failed');
    err.status = json.status || 500;
    err.info = json;
    throw err;
  }

  return json.data;
}

/**
 * Global SWR configuration shared across the app.
 */
export const swrConfig = {
  fetcher,
  revalidateOnFocus: false,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  dedupingInterval: 5000,
};
