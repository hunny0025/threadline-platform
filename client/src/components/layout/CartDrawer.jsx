import { motion, AnimatePresence } from "motion/react";
import { X, Trash2, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../ui";

export function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  updateQuantity,
  removeItem,
}) {
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState(null);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  // Simple rule: Free shipping over $150
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const tax = subtotal * 0.08; // 8% tax for demo purposes
  const total = subtotal + shipping + tax;

  const handleUpdateQuantity = async (variantId, newQty) => {
    try {
      setLoadingId(variantId);
      await updateQuantity(variantId, newQty);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemoveItem = async (variantId) => {
    try {
      setLoadingId(variantId);
      await removeItem(variantId);
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white z-[110] shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              ease: [0.43, 0.13, 0.23, 0.96],
              duration: 0.4,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200">
              <h2 className="text-xl font-display font-semibold text-zinc-900 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Your Cart
                <span className="ml-2 text-sm font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors focus:outline-none"
                aria-label="Close Cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                  <div className="h-20 w-20 bg-zinc-50 rounded-full flex items-center justify-center mb-2">
                    <ShoppingBag className="h-8 w-8 text-zinc-300" />
                  </div>
                  <p className="text-lg font-medium text-zinc-900">Your cart is empty</p>
                  <p className="text-sm text-center max-w-[250px]">
                    Looks like you haven't added anything yet. Explore our latest drops.
                  </p>
                  <Button variant="primary" className="mt-4" onClick={onClose}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => {
                    const isItemLoading = loadingId === item.variantId;
                    return (
                      <div
                        key={item.variantId}
                        className={`flex gap-4 transition-opacity ${isItemLoading ? "opacity-60" : ""}`}
                      >
                        {/* Image Thumbnail */}
                        <div className="h-28 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="text-base font-medium text-zinc-900 line-clamp-1 pr-4">
                                {item.title}
                              </h3>
                              <p className="text-base font-semibold text-zinc-900">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-zinc-500 capitalize flex items-center gap-2">
                              {item.color && <span>{item.color}</span>}
                              {item.color && item.size && (
                                <span className="w-1 h-1 rounded-full bg-zinc-300" />
                              )}
                              {item.size && <span>Size {item.size}</span>}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-zinc-200 rounded-md">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.variantId,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                                className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors disabled:opacity-50"
                                disabled={item.quantity <= 1 || isItemLoading}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium text-zinc-900">
                                {isItemLoading ? (
                                  <Loader2 className="h-3.5 w-3.5 mx-auto animate-spin text-zinc-400" />
                                ) : (
                                  item.quantity
                                )}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(item.variantId, item.quantity + 1)
                                }
                                className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors disabled:opacity-50"
                                disabled={isItemLoading}
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item.variantId)}
                              disabled={isItemLoading}
                              className="text-sm font-medium text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer / Price Breakdown */}
            {cartItems.length > 0 && (
              <div className="border-t border-zinc-200 bg-zinc-50 px-6 py-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm text-zinc-600">
                    <p>Subtotal</p>
                    <p className="font-medium text-zinc-900">
                      ${subtotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-zinc-600">
                    <p>Shipping</p>
                    <p className="font-medium text-zinc-900">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-zinc-600">
                    <p>Estimated Tax</p>
                    <p className="font-medium text-zinc-900">${tax.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between text-base font-semibold text-zinc-900 pt-3 border-t border-zinc-200">
                    <p>Total</p>
                    <p>${total.toFixed(2)}</p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-full py-4 text-base"
                  onClick={() => {
                    onClose();
                    navigate("/checkout");
                  }}
                >
                  Checkout Now
                </Button>
                <p className="mt-4 text-xs text-center text-zinc-500 flex items-center justify-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-shield-check"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  Secure checkout powered by Razorpay
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
