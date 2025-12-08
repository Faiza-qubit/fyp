import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import ShoeCard from "../components/ui/ShoeCard";
import { SHOES } from "../lib/mockData";

export default function FeaturedProducts() {
  const featuredShoes = SHOES.slice(0, 6); // Show only first 6 shoes

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Top See All Link */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-500 uppercase tracking-wide relative">
            Featured Collections
          </h2>

          <Link
            href="/shop"
            className="text-yellow-500 font-semibold hover:underline hover:text-yellow-400 transition-colors"
          >
            See All
          </Link>
        </div>

        {/* Section Description */}
        <motion.p
          className="text-lg text-gray-300 max-w-2xl mx-auto mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Discover our handpicked selection of premium footwear, designed for
          those who demand excellence in every step.
        </motion.p>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {featuredShoes.map((shoe) => (
              <motion.div
                key={shoe.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <ShoeCard shoe={shoe} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
