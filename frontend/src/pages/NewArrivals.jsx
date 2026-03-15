import FeaturedProducts from "@/components/FeaturedProducts";
import Newsletter from "@/components/Newsletter";

export default function NewArrivals() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <FeaturedProducts />
        <Newsletter />
      </main>
    </div>
  );
}
