import { motion } from "framer-motion";
import { useState } from "react";
import { SearchBar } from "@/src/components/ui/SearchBar";
import { Button } from "@/src/components/ui";
import { ArrowRight, TrendingUp, Star, Heart } from "lucide-react";

export function Landing() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Popular search suggestions
  const popularSearches = [
    "Summer Dresses",
    "Vintage Denim",
    "Minimalist Jewelry",
    "Athletic Wear",
    "Evening Gowns",
  ];

  // Mock search function
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    await new Promise((resolve) => setTimeout(resolve, 400));

    const mockResults = [
      {
        id: "1",
        title: `${query} - Premium Collection`,
        subtitle: "Curated selection of premium items",
        thumbnail:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&h=100&fit=crop",
      },
      {
        id: "2",
        title: `${query} - New Arrivals`,
        subtitle: "Latest trends and styles",
        thumbnail:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
      },
      {
        id: "3",
        title: `${query} - Sale Items`,
        subtitle: "Discounted prices on quality pieces",
        thumbnail:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop",
      },
      {
        id: "4",
        title: `${query} - Exclusive`,
        subtitle: "Limited edition and exclusive items",
        thumbnail:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop",
      },
    ];

    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const handleResultSelect = (result) => {
    console.log("Landing page search selected:", result);
    // Add navigation logic here
  };

  const handlePopularSearchClick = (search) => {
    handleSearch(search);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-amber-50">
      {/* Main Landing Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-neutral-900 leading-tight mb-6"
            >
              Find Your Perfect
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-amber-500">
                Fashion Match
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-neutral-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Discover thousands of curated fashion pieces from top brands.
              Search by style, color, brand, or let your creativity guide you.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={itemVariants}
              className="max-w-2xl mx-auto mb-8"
            >
              <SearchBar
                placeholder="Search for clothing, brands, styles..."
                size="lg"
                results={searchResults}
                isLoading={isSearching}
                onSearch={handleSearch}
                onSelect={handleResultSelect}
                className="shadow-lg border-neutral-300"
              />
            </motion.div>

            {/* Popular Searches */}
            <motion.div variants={itemVariants} className="mb-12">
              <p className="text-sm text-neutral-500 mb-3">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handlePopularSearchClick(search)}
                    className="px-3 py-1.5 text-sm bg-white border border-neutral-200 rounded-full text-neutral-700 hover:border-violet-300 hover:text-violet-600 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                Browse All Categories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                View New Arrivals
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-4">
              Why Choose Threadline?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We make finding and buying your perfect outfit effortless and
              enjoyable.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Trending Styles
              </h3>
              <p className="text-neutral-600">
                Stay ahead with the latest fashion trends and seasonal
                collections
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Premium Quality
              </h3>
              <p className="text-neutral-600">
                Carefully curated pieces from trusted brands and emerging
                designers
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Personal Style
              </h3>
              <p className="text-neutral-600">
                Find pieces that match your unique style and personality
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Search Categories */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-neutral-600">
              Quick access to our most popular fashion categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "Dresses",
                image:
                  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&h=300&fit=crop",
              },
              {
                name: "Tops",
                image:
                  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop",
              },
              {
                name: "Accessories",
                image:
                  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
              },
              {
                name: "Shoes",
                image:
                  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop",
              },
            ].map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-lg bg-white shadow-sm aspect-square"
                onClick={() => handlePopularSearchClick(category.name)}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg">
                    {category.name}
                  </h3>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
