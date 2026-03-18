import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqCategories = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 5-7 business days within the US. Express shipping (2-3 business days) is available at checkout. International orders typically arrive within 10-14 business days.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes! We ship to most countries worldwide. Shipping costs and delivery times vary by location. You can see exact shipping costs at checkout.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order ships, you'll receive an email with a tracking number. You can also track your order by logging into your account on our website.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "We process orders quickly, so changes or cancellations must be requested within 1 hour of placing your order. Contact us immediately at support@threadline.com.",
      },
    ],
  },
  {
    category: "Products & Sizing",
    questions: [
      {
        q: "How do your sizes run?",
        a: "Our pieces are designed with a modern, slightly relaxed fit. We recommend checking the size guide on each product page for detailed measurements. When in doubt, size up for a more relaxed look or stick to your usual size for a fitted silhouette.",
      },
      {
        q: "What materials do you use?",
        a: "We use premium, responsibly-sourced materials including organic cotton, recycled polyester, and innovative technical fabrics. Each product page lists the specific materials used.",
      },
      {
        q: "How should I care for my Threadline pieces?",
        a: "Most items can be machine washed cold and tumble dried on low. Check the care label on each garment for specific instructions. We recommend washing dark colors separately.",
      },
      {
        q: "Are your products sustainable?",
        a: "Sustainability is central to our mission. We use eco-friendly materials, work with ethical manufacturers, and produce in limited quantities to reduce waste. Learn more on our sustainability page.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return policy for unworn, unwashed items with original tags attached. Items must be in their original condition. Intimate apparel and final sale items are not eligible for returns.",
      },
      {
        q: "How do I initiate a return?",
        a: "Log into your account and navigate to your order history. Select the item you wish to return and follow the prompts. You'll receive a prepaid shipping label via email.",
      },
      {
        q: "Can I exchange an item for a different size?",
        a: "Yes! We offer free exchanges for different sizes within 30 days of delivery. If your desired size is out of stock, we'll issue a full refund.",
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are processed within 5-7 business days after we receive your return. The refund will be credited to your original payment method.",
      },
    ],
  },
  {
    category: "Drops & Restocks",
    questions: [
      {
        q: "When do new drops happen?",
        a: "We release new collections throughout the year. Sign up for our newsletter to get notified about upcoming drops and receive early access.",
      },
      {
        q: "Do you restock sold-out items?",
        a: "Most items are part of limited runs and won't be restocked once sold out. Occasionally, we may bring back popular styles. Follow us on social media for restock announcements.",
      },
      {
        q: "How can I get priority access to drops?",
        a: "Newsletter subscribers get early access to all drops. You can also join our Priority Access list for exclusive first looks and the ability to purchase before public release.",
      },
    ],
  },
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-200">
      <button
        className="w-full py-5 flex justify-between items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-zinc-900 pr-4">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-zinc-500"
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-zinc-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
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
              Frequently Asked Questions
            </h1>
            <p className="text-zinc-400 text-lg">
              Find answers to common questions about orders, shipping, returns,
              and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <h2 className="font-display text-xl font-semibold text-zinc-900 mb-4">
                {category.category}
              </h2>
              <div className="bg-zinc-50 rounded-xl p-6">
                {category.questions.map((item, index) => (
                  <FAQItem key={index} question={item.q} answer={item.a} />
                ))}
              </div>
            </motion.div>
          ))}

          {/* Contact CTA */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-display text-xl font-semibold text-zinc-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-zinc-600 mb-4">
              We're here to help. Reach out and we'll get back to you within 24
              hours.
            </p>
            <a
              href="mailto:support@threadline.com"
              className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium transition-colors"
            >
              Contact Support
              <span aria-hidden="true">&rarr;</span>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
