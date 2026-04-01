import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  MapPin,
  CreditCard,
  ChevronRight,
  ShoppingBag,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "../components/ui";

/* ── Generate mock order data ────────────────────────────── */
function generateOrderNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const nums = "0123456789";
  let result = "TL-";
  for (let i = 0; i < 2; i++) result += chars[Math.floor(Math.random() * chars.length)];
  for (let i = 0; i < 6; i++) result += nums[Math.floor(Math.random() * nums.length)];
  return result;
}

function getEstimatedDelivery(isExpress = false) {
  const today = new Date();
  const minDays = isExpress ? 1 : 3;
  const maxDays = isExpress ? 2 : 5;
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + minDays);
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + maxDays);

  const opts = { weekday: "short", month: "short", day: "numeric" };
  return {
    range: `${startDate.toLocaleDateString("en-US", opts)} – ${endDate.toLocaleDateString("en-US", opts)}`,
    start: startDate,
    end: endDate,
  };
}

/* ── Animated SVG Checkmark ──────────────────────────────── */
function AnimatedCheckmark() {
  return (
    <div className="relative w-28 h-28 mx-auto">
      {/* Outer glow rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 2.2, opacity: [0, 1, 0] }}
        transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 3, opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.8, delay: 0.4, ease: "easeOut" }}
      />

      {/* Circle background */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg"
        style={{ boxShadow: "0 8px 32px rgba(34,197,94,0.35)" }}
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1,
        }}
      />

      {/* SVG Checkmark with stroke-dashoffset animation */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 112 112"
        fill="none"
      >
        <motion.path
          d="M32 58 L48 74 L80 40"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.5,
            ease: [0.65, 0, 0.35, 1],
          }}
        />
      </svg>

      {/* Sparkle particles */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 60;
        const y = Math.sin(angle) * 60;
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full"
            style={{
              left: "50%",
              top: "50%",
              marginLeft: "-3px",
              marginTop: "-3px",
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: x,
              y: y,
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: 0.8,
              delay: 0.6 + i * 0.06,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Timeline Step ───────────────────────────────────────── */
function TimelineStep({ icon: Icon, label, detail, isActive, isCompleted, delay }) {
  return (
    <motion.div
      className="flex items-start gap-3"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex flex-col items-center">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            isCompleted
              ? "bg-emerald-100 text-emerald-600"
              : isActive
                ? "bg-violet-100 text-violet-600 ring-2 ring-violet-200"
                : "bg-zinc-100 text-zinc-400"
          }`}
        >
          {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
        </div>
      </div>
      <div className="pt-1">
        <p
          className={`text-sm font-medium ${
            isCompleted || isActive ? "text-zinc-900" : "text-zinc-400"
          }`}
        >
          {label}
        </p>
        {detail && (
          <p className="text-xs text-zinc-500 mt-0.5">{detail}</p>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export function OrderConfirmation() {
  const [orderNumber] = useState(() => generateOrderNumber());
  const [copied, setCopied] = useState(false);
  const [confettiDone, setConfettiDone] = useState(false);

  // Mock order details (mirroring the Checkout mock data)
  const orderItems = [
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

  const subtotal = orderItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const shipping = 0; // Standard free
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const delivery = getEstimatedDelivery(false);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => setConfettiDone(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* ── Confetti / particle burst overlay ──────────────── */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {!confettiDone &&
          [...Array(24)].map((_, i) => {
            const colors = [
              "#22c55e",
              "#8b5cf6",
              "#f59e0b",
              "#3b82f6",
              "#ec4899",
              "#14b8a6",
            ];
            const color = colors[i % colors.length];
            const left = 40 + Math.random() * 20;
            const angle = (Math.random() - 0.5) * 120;
            const dist = 300 + Math.random() * 400;
            const size = 4 + Math.random() * 6;
            const rotation = Math.random() * 720;
            return (
              <motion.div
                key={i}
                className="absolute rounded-sm"
                style={{
                  width: `${size}px`,
                  height: `${size * (0.4 + Math.random() * 0.6)}px`,
                  backgroundColor: color,
                  left: `${left}%`,
                  top: "30%",
                }}
                initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
                animate={{
                  y: dist,
                  x: Math.tan((angle * Math.PI) / 180) * dist * 0.5,
                  rotate: rotation,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1.2 + Math.random() * 0.6,
                  delay: 0.3 + Math.random() * 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            );
          })}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb ──────────────────────────────────── */}
        <div className="py-6 flex items-center gap-2 text-sm text-zinc-500 font-medium">
          <Link
            to="/shop"
            className="hover:text-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-sm"
          >
            Shop
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            to="/checkout"
            className="hover:text-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-sm"
          >
            Checkout
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-zinc-900">Confirmation</span>
        </div>

        {/* ── Hero Success Section ────────────────────────── */}
        <motion.div
          className="text-center py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatedCheckmark />

          <motion.h1
            className="text-3xl sm:text-4xl font-display font-bold text-zinc-900 mt-8 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Order Confirmed!
          </motion.h1>

          <motion.p
            className="text-zinc-500 mt-3 text-base sm:text-lg max-w-md mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
          >
            Thank you for your purchase. We're preparing your order and you'll
            receive a confirmation email shortly.
          </motion.p>

          {/* Order Number Pill */}
          <motion.div
            className="inline-flex items-center gap-2.5 bg-zinc-50 border border-zinc-200 rounded-full px-5 py-2.5 mt-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1 }}
          >
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Order
            </span>
            <span className="text-sm font-bold font-mono text-zinc-900 tracking-wide">
              {orderNumber}
            </span>
            <button
              onClick={copyOrderNumber}
              className="text-zinc-400 hover:text-zinc-700 transition-colors p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
              aria-label="Copy order number"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </motion.div>
        </motion.div>

        {/* ── Main Content Grid ───────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Left: Delivery & Shipping Details */}
          <motion.div
            className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <h2 className="text-lg font-display font-semibold text-zinc-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-violet-600" />
              Delivery Details
            </h2>

            {/* Estimated Delivery Card */}
            <div className="bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-200/60 rounded-xl p-4">
              <p className="text-xs font-medium text-violet-600 uppercase tracking-wider mb-1">
                Estimated Delivery
              </p>
              <p className="text-xl font-display font-bold text-zinc-900 tracking-tight">
                {delivery.range}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Standard Shipping · Free</p>
            </div>

            {/* Order Timeline */}
            <div className="space-y-4 pt-2">
              <TimelineStep
                icon={CreditCard}
                label="Payment confirmed"
                detail="Just now"
                isCompleted
                delay={1.3}
              />
              <div className="ml-4 w-px h-4 bg-zinc-200" />
              <TimelineStep
                icon={Package}
                label="Processing order"
                detail="Preparing your items"
                isActive
                delay={1.4}
              />
              <div className="ml-4 w-px h-4 bg-zinc-200" />
              <TimelineStep
                icon={Truck}
                label="Shipping"
                detail={delivery.range}
                delay={1.5}
              />
              <div className="ml-4 w-px h-4 bg-zinc-200" />
              <TimelineStep
                icon={MapPin}
                label="Delivered"
                detail="To your doorstep"
                delay={1.6}
              />
            </div>

            {/* Shipping Address */}
            <div className="pt-4 border-t border-zinc-200">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Shipping to
              </p>
              <p className="text-sm text-zinc-900 font-medium">Alex Johnson</p>
              <p className="text-sm text-zinc-600">
                123 Fashion Ave, Suite 4B
                <br />
                New York, NY 10001
              </p>
            </div>
          </motion.div>

          {/* Right: Order Summary */}
          <motion.div
            className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <h2 className="text-lg font-display font-semibold text-zinc-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-violet-600" />
              Order Summary
              <span className="ml-auto text-xs font-medium text-zinc-500 bg-zinc-200 px-2.5 py-0.5 rounded-full">
                {orderItems.reduce((a, i) => a + i.quantity, 0)} items
              </span>
            </h2>

            {/* Items */}
            <div className="space-y-4">
              {orderItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  className="flex gap-4 items-center"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.3 + idx * 0.1 }}
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-zinc-200 bg-white flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-zinc-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white z-10">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-zinc-900 truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-500 capitalize">
                      {item.color} / {item.size}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-zinc-900 tabular-nums">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-zinc-200 space-y-2.5">
              <div className="flex justify-between text-sm text-zinc-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="pt-4 border-t border-zinc-200 flex justify-between items-center">
              <div>
                <span className="text-base font-semibold text-zinc-900">Total</span>
                <p className="text-xs text-zinc-500 font-normal">Paid with •••• 4242</p>
              </div>
              <div className="text-2xl font-bold font-display text-zinc-900 tracking-tight">
                <span className="text-xs font-medium text-zinc-500 mr-1 uppercase">
                  USD
                </span>
                ${total.toFixed(2)}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── CTAs ────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <Link to="/shop" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-10 py-4 text-base gap-2 shadow-xl shadow-black/10"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto px-10 py-4 text-base"
            >
              Back to Home
            </Button>
          </Link>
        </motion.div>

        {/* ── Help Footer ────────────────────────────────── */}
        <motion.div
          className="text-center mt-12 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.7 }}
        >
          <p className="text-sm text-zinc-500">
            Need help?{" "}
            <Link
              to="/faq"
              className="text-violet-600 hover:text-violet-700 font-medium transition-colors"
            >
              View FAQ
            </Link>{" "}
            or{" "}
            <Link
              to="/returns"
              className="text-violet-600 hover:text-violet-700 font-medium transition-colors"
            >
              Returns Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
