import { useState } from "react";
import { motion } from "motion/react";
import { ShoppingBag, Lock, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";

export function Checkout() {
  const navigate = useNavigate();
  // Mock Cart Data (duplicated from Header for visual representation)
  const cartItems = [
    {
      id: "1",
      title: "Heavyweight Boxy Tee",
      price: 45,
      quantity: 1,
      size: "L",
      color: "Washed Black",
      image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80",
    },
    {
      id: "2",
      title: "Nylon Cargo Pants",
      price: 120,
      quantity: 1,
      size: "M",
      color: "Olive",
      image: "https://images.unsplash.com/photo-1624378441864-6da7c44422e1?w=500&q=80",
    },
  ];

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingOptions = [
    { id: "standard", name: "Standard Shipping (3-5 business days)", price: 0 },
    { id: "express", name: "Express Shipping (1-2 business days)", price: 15 },
  ];
  const [selectedShipping, setSelectedShipping] = useState("standard");

  const shippingCost = shippingOptions.find((opt) => opt.id === selectedShipping)?.price || 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // Normally handled by a payment provider, simulate a short delay before navigating
    navigate("/shop");
  };

  return (
    <div className="bg-white min-h-screen pt-4 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Top Bar */}
        <div className="py-6 flex items-center gap-2 text-sm text-zinc-500 font-medium">
          <Link to="/cart" className="hover:text-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-sm">Cart</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-zinc-900">Checkout</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Main Left Column (Forms) */}
          <div className="w-full lg:w-[55%] xl:w-[60%] order-2 lg:order-1">
            <h1 className="text-3xl font-display font-semibold text-zinc-900 mb-8">Checkout</h1>
            
            <form onSubmit={handlePlaceOrder} className="space-y-10">
              
              {/* Contact Information */}
              <section>
                <h2 className="text-xl font-display font-medium text-zinc-900 mb-4">Contact</h2>
                <div className="grid grid-cols-1 gap-4">
                  <Input 
                    type="email" 
                    placeholder="Email address" 
                    required 
                    className="w-full"
                    aria-label="Email address"
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
                    placeholder="First name" 
                    required 
                    aria-label="First name"
                  />
                  <Input 
                    type="text" 
                    placeholder="Last name" 
                    required 
                    aria-label="Last name"
                  />
                  <div className="md:col-span-2">
                    <Input 
                      type="text" 
                      placeholder="Address" 
                      required 
                      aria-label="Address"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input 
                      type="text" 
                      placeholder="Apartment, suite, etc. (optional)" 
                      aria-label="Apartment, suite, etc. (optional)"
                    />
                  </div>
                  <Input 
                    type="text" 
                    placeholder="City" 
                    required 
                    aria-label="City"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      type="text" 
                      placeholder="State" 
                      required 
                      aria-label="State"
                    />
                    <Input 
                      type="text" 
                      placeholder="ZIP code" 
                      required 
                      aria-label="ZIP code"
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
                  
                  <div className="md:col-span-2">
                    <Input 
                      type="text" 
                      placeholder="Card number" 
                      required 
                      aria-label="Card number"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      type="text" 
                      placeholder="Expiration date (MM / YY)" 
                      required 
                      aria-label="Expiration date"
                    />
                    <Input 
                      type="text" 
                      placeholder="Security code (CVC)" 
                      required 
                      aria-label="Security code"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input 
                      type="text" 
                      placeholder="Name on card" 
                      required 
                      aria-label="Name on card"
                    />
                  </div>
                </div>
              </section>

              <div className="pt-6">
                <Button type="submit" variant="primary" size="lg" className="w-full text-lg py-5 shadow-xl shadow-violet-600/20">
                  Pay ${total.toFixed(2)}
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
                <div key={item.id} className="flex gap-4 items-center">
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
                <span>${subtotal.toFixed(2)}</span>
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
