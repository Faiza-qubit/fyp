import StatsSection from "@/components/StatsSection";
import Testimonials from "@/components/Testimonials";
import FeedbackForm from "@/components/FeedbackForm";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <StatsSection />
        <Testimonials />
        <FeedbackForm />
      </main>
    </div>
  );
}
