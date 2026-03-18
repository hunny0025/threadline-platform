import { motion } from "framer-motion";
import {
  Package,
  RefreshCw,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: Package,
    title: "Pack Your Item",
    description:
      "Place item(s) in original packaging with all tags attached. Include the packing slip.",
  },
  {
    icon: RefreshCw,
    title: "Request Return",
    description:
      "Log into your account and initiate a return request. Print your prepaid shipping label.",
  },
  {
    icon: CreditCard,
    title: "Ship It Back",
    description:
      "Drop off your package at any authorized shipping location. Keep your receipt.",
  },
  {
    icon: Clock,
    title: "Get Your Refund",
    description:
      "Refunds are processed within 5-7 business days after we receive your return.",
  },
];

const eligibleItems = [
  "Unworn and unwashed items",
  "Items with original tags attached",
  "Items in original packaging",
  "Items returned within 30 days of delivery",
];

const ineligibleItems = [
  "Intimate apparel and swimwear",
  "Items marked as Final Sale",
  "Items without original tags",
  "Items showing signs of wear or washing",
  "Personalized or custom items",
];

export function Returns() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-zinc-900 text-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Returns & Exchanges
            </h1>
            <p className="text-zinc-400 text-lg">
              Not the perfect fit? No worries. We make returns easy with our
              30-day hassle-free policy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="font-display text-2xl sm:text-3xl font-bold text-zinc-900 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How Returns Work
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-violet-600" />
                </div>
                <div className="text-sm text-violet-600 font-medium mb-1">
                  Step {index + 1}
                </div>
                <h3 className="font-display font-semibold text-zinc-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-zinc-600 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-16 lg:py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Eligible */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-display text-xl font-semibold text-zinc-900">
                  Eligible for Return
                </h3>
              </div>
              <ul className="space-y-3">
                {eligibleItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-zinc-600"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Not Eligible */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-display text-xl font-semibold text-zinc-900">
                  Not Eligible
                </h3>
              </div>
              <ul className="space-y-3">
                {ineligibleItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-zinc-600"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Policy Details */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-zinc-900 mb-8">
              Policy Details
            </h2>

            <div className="prose prose-zinc max-w-none">
              <h3 className="font-display text-lg font-semibold text-zinc-900 mt-8 mb-3">
                Return Window
              </h3>
              <p className="text-zinc-600 mb-6">
                Items must be returned within 30 days of delivery. The return
                window begins on the date your order was delivered, as shown in
                your shipping confirmation.
              </p>

              <h3 className="font-display text-lg font-semibold text-zinc-900 mt-8 mb-3">
                Exchanges
              </h3>
              <p className="text-zinc-600 mb-6">
                We offer free exchanges for different sizes. If your preferred
                size is out of stock, we'll issue a full refund to your original
                payment method. Exchanges are processed within 2-3 business days
                of receiving your return.
              </p>

              <h3 className="font-display text-lg font-semibold text-zinc-900 mt-8 mb-3">
                Refund Processing
              </h3>
              <p className="text-zinc-600 mb-6">
                Once we receive your return, refunds are processed within 5-7
                business days. Refunds are issued to your original payment
                method. Please note that your bank or credit card company may
                take additional time to post the refund to your account.
              </p>

              <h3 className="font-display text-lg font-semibold text-zinc-900 mt-8 mb-3">
                Return Shipping
              </h3>
              <p className="text-zinc-600 mb-6">
                For US orders, we provide free prepaid return shipping labels.
                International return shipping costs are the responsibility of
                the customer. We recommend using a trackable shipping method for
                all returns.
              </p>

              <h3 className="font-display text-lg font-semibold text-zinc-900 mt-8 mb-3">
                Damaged or Defective Items
              </h3>
              <p className="text-zinc-600 mb-6">
                If you receive a damaged or defective item, please contact us
                within 48 hours of delivery with photos of the damage. We'll
                arrange for a replacement or full refund at no additional cost.
              </p>
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            className="mt-12 p-6 bg-zinc-50 rounded-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-display text-lg font-semibold text-zinc-900 mb-2">
              Need Help with a Return?
            </h3>
            <p className="text-zinc-600 mb-4">
              Our support team is here to help. Check our FAQ for quick answers
              or contact us directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/faq"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-zinc-200 rounded-lg text-zinc-700 font-medium hover:bg-zinc-50 transition-colors"
              >
                View FAQ
              </Link>
              <a
                href="mailto:support@threadline.com"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-violet-600 rounded-lg text-white font-medium hover:bg-violet-700 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
