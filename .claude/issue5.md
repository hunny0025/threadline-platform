## Problem
Need to validate the complete user flow end-to-end on the staging server.

## Test Cases
1. **Auth**: Register + login (email + Google OAuth) — verify response shape `{ success, status, message, data: { accessToken, user } }`
2. **Products**: Fetch product listing — verify pagination shape
3. **Cart**: Add item to cart, update quantity, remove item
4. **Orders**: Create order from cart — verify order response shape
5. **Payment**: Initiate Razorpay payment — verify webhook fires order status update and inventory sync
6. **CORS**: Confirm PATCH/OPTIONS requests work from `https://threadline-platform.vercel.app`

Use `scripts/smoke-test.sh` as a starting point for API validation.
