import FeaturedProducts from "@/components/FeaturedProducts";
import Testimonials from "@/components/Testimonials";

export default function Collections() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <FeaturedProducts />
        <Testimonials />
      </main>
    </div>
  );
}
