import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import ShoeCard from "../components/ui/ShoeCard";
import { SHOES } from "../lib/mockData";

export default function FeaturedProducts() {

  // ⭐ take first 6 products
  const featuredShoes = SHOES.slice(0, 6);

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6">

        {/* ⭐ Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-500 uppercase tracking-wide">
            Featured Collections
          </h2>

          <Link
            href="/shop"
            className="text-yellow-500 font-semibold hover:text-yellow-400 transition"
          >
            See All →
          </Link>
        </div>

        {/* ⭐ Description */}
        <motion.p
          className="text-lg text-gray-300 max-w-2xl mx-auto mb-12 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Discover our handpicked selection of premium footwear designed for
          comfort, performance and luxury street presence.
        </motion.p>

        {/* ⭐ Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

          <AnimatePresence>
            {featuredShoes.map((shoe, index) => (

              <motion.div
                key={shoe.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ y: -12, scale: 1.02 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08
                }}
              >
                {/* ⭐ VERY IMPORTANT → pass main image */}
                <ShoeCard
                  shoe={{
                    ...shoe,
                    image: shoe.images?.[1]   // ⭐ NEW FIX
                  }}
                />
              </motion.div>

            ))}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}