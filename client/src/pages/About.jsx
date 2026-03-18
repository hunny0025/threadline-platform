import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
};

const values = [
  {
    title: "Intentional Design",
    description:
      "Every stitch, every seam, every detail is deliberate. We create pieces that move with you, not against you.",
  },
  {
    title: "Limited Drops",
    description:
      "We reject mass production. Each collection is released in limited quantities, ensuring exclusivity and reducing waste.",
  },
  {
    title: "Quality Over Quantity",
    description:
      "Premium materials, ethical manufacturing, and timeless designs that outlast trends.",
  },
  {
    title: "Community First",
    description:
      "Built by and for those who move different. Our community shapes every decision we make.",
  },
];

export function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-zinc-900 text-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Functional Utility.
              <br />
              <span className="text-violet-400">Kinetic Attitude.</span>
            </h1>
            <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed">
              Threadline was born from a simple belief: clothing should work as
              hard as you do. We design for movers, makers, and those who refuse
              to stand still.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              {...fadeInUp}
              viewport={{ once: true }}
              whileInView="animate"
              initial="initial"
            >
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-zinc-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-zinc-600">
                <p>
                  Founded in 2024, Threadline emerged from the frustration of
                  finding clothes that looked good but couldn't keep up with an
                  active lifestyle.
                </p>
                <p>
                  We started in a small studio with a single mission: create
                  apparel that bridges the gap between performance wear and
                  street style, without compromising on either.
                </p>
                <p>
                  Today, we work with a small network of ethical manufacturers
                  who share our obsession with quality and our commitment to
                  sustainable practices.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="aspect-[4/3] bg-zinc-100 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                <span className="text-6xl">🧵</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
              What We Stand For
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              Our values aren't just words on a page. They're the principles
              that guide every decision, from design to delivery.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="bg-white p-6 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="font-display font-semibold text-lg text-zinc-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-zinc-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
              Join the Movement
            </h2>
            <p className="text-zinc-600 max-w-xl mx-auto mb-8">
              Be the first to know about new drops, exclusive releases, and
              behind-the-scenes content.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
