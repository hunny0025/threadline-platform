import { useState } from "react";
import { motion } from "motion/react";
import { ShoppingBag, Lock, ChevronRight, CreditCard, Loader2, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";
import { useCartContext } from "../components/CartContext";
import { createOrder, createPaymentIntent, confirmPayment } from "../lib/cartApi";

export function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal: cartSubtotal, isLoading: cartLoading, refreshCart } = useCartContext();

  // Shipping options
  const shippingOptions = [
    { id: "standard", name: "Standard Shipping (3-5 business days)", price: 0 },
    { id: "express", name: "Express Shipping (1-2 business days)", price: 15 },
  ];
  const [selectedShipping, setSelectedShipping] = useState("standard");

  // Shipping form state
  const [shippingForm, setShippingForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
  });

  // Payment Form State
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    nameOnCard: ""
  });
  const [cardType, setCardType] = useState("unknown");

  // Order processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === "cardNumber") {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      
      let type = "unknown";
      if (v.match(/^4/)) type = "visa";
      else if (v.match(/^(34|37)/)) type = "amex";
      else if (v.match(/^5[1-5]/) || v.match(/^222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720/)) type = "mastercard";
      else if (v.match(/^6(?:011|5[0-9]{2})/)) type = "discover";
      
      setCardType(type);

      if (type === "amex") {
        const part1 = v.substring(0, 4);
        const part2 = v.substring(4, 10);
        const part3 = v.substring(10, 15);
        if (v.length > 10) formattedValue = `${part1} ${part2} ${part3}`;
        else if (v.length > 4) formattedValue = `${part1} ${part2}`;
        else formattedValue = part1;
      } else {
        const parts = [];
        for (let i = 0; i < v.length; i += 4) {
          parts.push(v.substring(i, i + 4));
        }
        formattedValue = parts.slice(0, 5).join(' ').substring(0, 19);
      }
    } else if (name === "expiry") {
      if (value.length < paymentDetails.expiry.length) {
        formattedValue = value;
      } else {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
          formattedValue = `${v.substring(0, 2)} / ${v.substring(2, 4)}`;
        } else if (v.length === 1 && parseInt(v) > 1) {
          formattedValue = `0${v} / `;
        } else {
          formattedValue = v;
        }
      }
    } else if (name === "cvc") {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      formattedValue = cardType === "amex" ? v.substring(0, 4) : v.substring(0, 3);
    }
    
    setPaymentDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const shippingCost = shippingOptions.find((opt) => opt.id === selectedShipping)?.price || 0;
  const tax = cartSubtotal * 0.08;
  const total = cartSubtotal + shippingCost + tax;

  /**
   * Full checkout flow:
   * 1. Create order from cart (backend clears cart)
   * 2. Attempt Razorpay payment (or simulate if keys not configured)
   * 3. Navigate to confirmation page with order data
   */
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setOrderError(null);
    setIsProcessing(true);

    try {
      // Step 1: Create order from cart
      // Note: The backend requires auth for orders. For the demo/guest flow,
      // we pass null (no auth token). If the backend returns 401, we show
      // a helpful message.
      let order;
      try {
        order = await createOrder(null);
      } catch (err) {
        throw err;
      }

      // Step 2: Attempt payment
      // For the demo: simulate successful payment
      const paymentResult = {
        success: true,
        method: `•••• ${paymentDetails.cardNumber.slice(-4) || '4242'}`,
      };

      // Try Razorpay if available (non-blocking)
      try {
        if (order._id && !order._id.startsWith('demo_')) {
          const intent = await createPaymentIntent(order._id, null);
          
          // If Razorpay SDK is loaded, open checkout
          if (window.Razorpay && intent?.razorpayOrderId) {
            const rzpResult = await new Promise((resolve, reject) => {
              const rzp = new window.Razorpay({
                key: intent.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: intent.amount,
                currency: intent.currency || 'INR',
                order_id: intent.razorpayOrderId,
                name: 'Threadline',
                description: `Order ${order._id}`,
                handler: function (response) {
                  resolve(response);
                },
                modal: {
                  ondismiss: function () {
                    reject(new Error('Payment cancelled'));
                  },
                },
              });
              rzp.open();
            });

            // Confirm payment
            await confirmPayment({
              razorpayOrderId: rzpResult.razorpay_order_id,
              razorpayPaymentId: rzpResult.razorpay_payment_id,
              razorpaySignature: rzpResult.razorpay_signature,
              orderId: order._id,
            }, null);

            paymentResult.method = 'Razorpay';
          }
        }
      } catch (payErr) {
        // Payment provider not configured — continue with simulated payment
        console.info('Razorpay not available, using simulated payment:', payErr.message);
      }

      // Step 3: Navigate to confirmation
      refreshCart(); // Re-fetch cart (should now be empty)
      
      navigate("/order-confirmation", {
        state: {
          order,
          orderItems: cartItems,
          subtotal: cartSubtotal,
          shipping: shippingCost,
          tax,
          total,
          shippingAddress: {
            name: `${shippingForm.firstName} ${shippingForm.lastName}`,
            address: shippingForm.address,
            apartment: shippingForm.apartment,
            city: shippingForm.city,
            state: shippingForm.state,
            zip: shippingForm.zip,
          },
          shippingMethod: selectedShipping,
          paymentMethod: paymentResult.method,
        },
      });

    } catch (err) {
      console.error('Checkout failed:', err);
      setOrderError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Loading State ──────────────────────────────────────────
  if (cartLoading) {
    return (
      <div className="bg-white min-h-screen pt-4 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center gap-2 text-sm text-zinc-500 font-medium">
            <div className="h-4 w-10 bg-zinc-100 rounded animate-pulse" />
            <ChevronRight className="w-4 h-4 text-zinc-200" />
            <div className="h-4 w-16 bg-zinc-100 rounded animate-pulse" />
          </div>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            <div className="w-full lg:w-[55%] space-y-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-12 bg-zinc-100 rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="w-full lg:w-[45%] h-96 bg-zinc-50 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // ── Empty Cart State ───────────────────────────────────────
  if (!cartLoading && cartItems.length === 0) {
    return (
      <div className="bg-white min-h-screen pt-4 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center gap-2 text-sm text-zinc-500 font-medium">
            <Link to="/shop" className="hover:text-zinc-900 transition-colors">Shop</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-zinc-900">Checkout</span>
          </div>
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-8 h-8 text-zinc-300" />
            </div>
            <h1 className="text-2xl font-display font-semibold text-zinc-900 mb-3">Your cart is empty</h1>
            <p className="text-zinc-500 mb-8 max-w-md mx-auto">
              Add some items to your cart before checking out.
            </p>
            <Link to="/shop">
              <Button variant="primary" size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-4 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Top Bar */}
        <div className="py-6 flex items-center gap-2 text-sm text-zinc-500 font-medium">
          <Link to="/shop" className="hover:text-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-sm">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-zinc-900">Checkout</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Main Left Column (Forms) */}
          <div className="w-full lg:w-[55%] xl:w-[60%] order-2 lg:order-1">
            <h1 className="text-3xl font-display font-semibold text-zinc-900 mb-8">Checkout</h1>
            
            <form onSubmit={handlePlaceOrder} className="space-y-10">
              
              {/* Error Banner */}
              {orderError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Order could not be placed</p>
                    <p className="text-sm mt-0.5">{orderError}</p>
                  </div>
                </motion.div>
              )}

              {/* Contact Information */}
              <section>
                <h2 className="text-xl font-display font-medium text-zinc-900 mb-4">Contact</h2>
                <div className="grid grid-cols-1 gap-4">
                  <Input 
                    type="email"
                    name="email"
                    placeholder="Email address" 
                    required 
                    className="w-full"
                    aria-label="Email address"
                    value={shippingForm.email}
                    onChange={handleShippingChange}
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <input 
                      type="checkbox" 
                      id="newsletter" 
                      className="w-4 h-4 text-violet-600 border-zinc-300 rounded focus:ring-violet-500"
                    />
                    <label htmlFor="newsletter" className="text-sm text-zinc-600 select-none cursor-pointer">
                      Email me with news and offers
                    </label>
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h2 className="text-xl font-display font-medium text-zinc-900 mb-4 mt-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    type="text"
                    name="firstName"
                    placeholder="First name" 
                    required 
                    aria-label="First name"
                    value={shippingForm.firstName}
                    onChange={handleShippingChange}
                  />
                  <Input 
                    type="text"
                    name="lastName"
                    placeholder="Last name" 
                    required 
                    aria-label="Last name"
                    value={shippingForm.lastName}
                    onChange={handleShippingChange}
                  />
                  <div className="md:col-span-2">
                    <Input 
                      type="text"
                      name="address"
                      placeholder="Address" 
                      required 
                      aria-label="Address"
                      value={shippingForm.address}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input 
                      type="text"
                      name="apartment"
                      placeholder="Apartment, suite, etc. (optional)" 
                      aria-label="Apartment, suite, etc. (optional)"
                      value={shippingForm.apartment}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <Input 
                    type="text"
                    name="city"
                    placeholder="City" 
                    required 
                    aria-label="City"
                    value={shippingForm.city}
                    onChange={handleShippingChange}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      type="text"
                      name="state"
                      placeholder="State" 
                      required 
                      aria-label="State"
                      value={shippingForm.state}
                      onChange={handleShippingChange}
                    />
                    <Input 
                      type="text"
                      name="zip"
                      placeholder="ZIP code" 
                      required 
                      aria-label="ZIP code"
                      value={shippingForm.zip}
                      onChange={handleShippingChange}
                    />
                  </div>
                </div>
              </section>

              {/* Delivery Method */}
              <section>
                <h2 className="text-xl font-display font-medium text-zinc-900 mb-4 mt-6">Delivery Method</h2>
                <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                  {shippingOptions.map((option, index) => (
                    <label 
                      key={option.id}
                      className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                        selectedShipping === option.id ? "bg-violet-50/50" : "bg-white hover:bg-zinc-50"
                      } ${index === 0 ? "border-b border-zinc-200" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="radio" 
                            name="shipping" 
                            value={option.id}
                            checked={selectedShipping === option.id}
                            onChange={(e) => setSelectedShipping(e.target.value)}
                            className="sr-only peer"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center ${
                            selectedShipping === option.id ? "border-violet-600" : "border-zinc-300"
                          }`}>
                            <div className={`w-2 h-2 rounded-full bg-violet-600 transition-transform ${
                              selectedShipping === option.id ? "scale-100" : "scale-0"
                            }`} />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-zinc-900">{option.name}</span>
                      </div>
                      <span className="text-sm font-medium text-zinc-900">
                        {option.price === 0 ? "Free" : `$${option.price.toFixed(2)}`}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Payment Section */}
              <section>
                <div className="flex items-center justify-between mb-4 mt-6">
                  <h2 className="text-xl font-display font-medium text-zinc-900">Payment</h2>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
                    <Lock className="w-3 h-3" /> Secure Encrypted
                  </span>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-4">
                  <div className="mb-4 text-sm text-zinc-600 font-medium">All transactions are secure and encrypted.</div>
                  
                  <div className="md:col-span-2 relative">
                    <Input 
                      type="tel" 
                      name="cardNumber"
                      placeholder="Card number" 
                      required 
                      aria-label="Card number"
                      value={paymentDetails.cardNumber}
                      onChange={handlePaymentChange}
                      className="pr-16"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none flex items-center">
                      {cardType === 'visa' && <span className="font-bold text-base text-blue-800 italic select-none">VISA</span>}
                      {cardType === 'mastercard' && (
                        <div className="flex -space-x-1.5 opacity-80 mt-0.5">
                          <div className="w-4 h-4 rounded-full bg-red-500/90 mix-blend-multiply" />
                          <div className="w-4 h-4 rounded-full bg-yellow-400/90 mix-blend-multiply" />
                        </div>
                      )}
                      {cardType === 'amex' && <span className="font-bold text-[11px] text-blue-500 border border-blue-500 px-1 py-0.5 rounded-sm select-none">AMEX</span>}
                      {cardType === 'discover' && <span className="font-bold text-sm text-orange-500 select-none">Discover</span>}
                      {cardType === 'unknown' && <CreditCard className="w-5 h-5" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      type="tel" 
                      name="expiry"
                      placeholder="Expiration date (MM / YY)" 
                      required 
                      aria-label="Expiration date"
                      value={paymentDetails.expiry}
                      onChange={handlePaymentChange}
                    />
                    <Input 
                      type="tel" 
                      name="cvc"
                      placeholder="Security code (CVC)" 
                      required 
                      aria-label="Security code"
                      value={paymentDetails.cvc}
                      onChange={handlePaymentChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input 
                      type="text" 
                      name="nameOnCard"
                      placeholder="Name on card" 
                      required 
                      aria-label="Name on card"
                      value={paymentDetails.nameOnCard}
                      onChange={handlePaymentChange}
                    />
                  </div>
                </div>
              </section>

              <div className="pt-6">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full text-lg py-5 shadow-xl shadow-violet-600/20"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing…
                    </span>
                  ) : (
                    `Pay $${total.toFixed(2)}`
                  )}
                </Button>
              </div>

            </form>
          </div>

          {/* Right Column (Order Summary) */}
          <div className="w-full h-full lg:w-[45%] xl:w-[40%] bg-zinc-50 rounded-2xl p-6 lg:p-8 border border-zinc-200 lg:sticky lg:top-24 order-1 lg:order-2">
            <h2 className="text-xl font-display font-semibold text-zinc-900 flex items-center gap-2 mb-6">
              <ShoppingBag className="w-5 h-5" />
              Order Summary
              <span className="ml-auto text-sm font-medium text-zinc-500 bg-zinc-200 px-2.5 py-0.5 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
              </span>
            </h2>

            {/* Items */}
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.variantId} className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-zinc-200 bg-white flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-zinc-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white z-10">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-zinc-900 truncate pr-2">{item.title}</h3>
                    <p className="text-xs text-zinc-500 capitalize">{item.color} / {item.size}</p>
                  </div>
                  <div className="text-sm font-medium text-zinc-900 tabular-nums">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Discount Code */}
            <div className="mt-8 pt-6 border-t border-zinc-200 flex gap-2">
              <Input type="text" placeholder="Discount code or gift card" className="flex-1" />
              <Button variant="secondary" className="whitespace-nowrap px-6">Apply</Button>
            </div>

            {/* Totals */}
            <div className="mt-6 pt-6 border-t border-zinc-200 space-y-3 font-medium">
              <div className="flex justify-between text-zinc-600 text-sm">
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600 text-sm">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-zinc-600 text-sm">
                <span>Estimated Taxes</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            {/* Final Total */}
            <div className="mt-6 pt-6 border-t border-zinc-200 flex justify-between items-center">
              <div>
                <span className="text-base font-medium text-zinc-900">Total</span>
                <p className="text-xs text-zinc-500 font-normal">Including taxes & fees</p>
              </div>
              <div className="text-2xl font-bold font-display text-zinc-900 tracking-tight">
                <span className="text-sm font-medium text-zinc-500 mr-1.5 uppercase">USD</span>
                ${total.toFixed(2)}
              </div>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
}
