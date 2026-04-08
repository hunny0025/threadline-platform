import { motion } from "framer-motion";
import { Button } from "@/src/components/ui";

export function HeroVideoBanner() {
  // Custom cubic-bezier easing for a smooth, premium entrance
  const customEasing = [0.16, 1, 0.3, 1];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2, // slight delay to allow video load to initiate securely
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.0,
        ease: customEasing,
      },
    },
  };

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Video Background Layer */}
      <div className="absolute inset-0 z-0">
        {/*
          Using native HTML5 Video for max performance and high bitrate support.
          `playsInline` handles iOS Safari requirements for autoplay.
        */}
        <video
          className="w-full h-full object-cover opacity-80"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
        >
          {/* 
            High-bitrate optimal source (Pexels links frequently expire, so this may 403).
            The previous fallback was ForBiggerJoyrides.mp4 which contained baked-in text 
            that overlapped the hero text. Leaving sources empty to gracefully fall back 
            to the beautiful fashion poster image.
          */}
        </video>

        {/* Overlay gradient for text readability and premium look */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-900/40 to-black/20 mix-blend-multiply" />
      </div>

      {/* Content Overlay Layer */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
        {/* Main Content - Center Left */}
        <div className="flex-1 flex items-center pt-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            {/* Pill Badge Entrance */}
            <motion.div
              variants={itemVariants}
              className="mb-6 flex justify-center sm:justify-start"
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium tracking-widest uppercase">
                Spring/Summer '26 Collection
              </span>
            </motion.div>

            {/* Main Title with Gradient */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-7xl lg:text-8xl font-display font-extrabold text-white leading-[1.1] mb-6 tracking-tight text-center sm:text-left"
            >
              Redefining <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-white to-zinc-300">
                Modern Elegance.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl text-zinc-300 max-w-2xl leading-relaxed font-body font-light text-center sm:text-left"
            >
              Experience the new standard in curated fashion. Built with passion
              and designed for modern wardrobes.
            </motion.p>
          </motion.div>
        </div>

        {/* Call to Actions - Bottom Right */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="pb-12 sm:pb-16 flex justify-center sm:justify-end"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              size="lg"
              className="bg-white text-zinc-950 hover:bg-zinc-100 hover:scale-105 transition-transform duration-300 border-transparent font-medium text-base shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Shop the Collection
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 font-medium"
            >
              Explore Lookbook
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
