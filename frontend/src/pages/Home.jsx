import HeroSection from "@/components/HeroSection";
import VirtualTryOn from "@/components/VirtualTryOn";
import FeaturedProducts from "@/components/FeaturedProducts";
import StatsSection from "@/components/StatsSection";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import FeedbackForm from "@/components/FeedbackForm";


export default function Home() {
  return (
    <div className="min-h-screen bg-background">
    
      <main>
        <HeroSection />
        <FeaturedProducts />
        <VirtualTryOn />
        <StatsSection />
        <Testimonials />
        <Newsletter />
        <FeedbackForm />
      </main>
  
    </div>
  );
}