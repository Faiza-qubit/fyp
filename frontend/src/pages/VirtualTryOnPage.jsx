import { useParams } from "wouter";
import { SHOES } from "@/lib/mockData";
import FootTryOn from "@/pages/FootTryOn";

export default function VirtualTryOnPage() {
  const { id } = useParams();

  // Find the selected shoe based on URL param
  const shoe = SHOES.find((s) => String(s.id) === String(id));

  // Map each shoe name to its corresponding 3D model in /public
  const modelMap = {
    "Adidas Street Classic": "/adidas_street_classic.glb",
    "Urban Grey Runner": "/urban_grey_runner.glb",
    "Stan Smith Retro": "/stan_smith_retro.glb",
    "Nike Flex Motion": "/nike_flex_motion.glb",
    "Nike Zoom Runner": "/nike_zoom_runner.glb",
    "Air Jordan High": "/air_jordan_high.glb",
    "Puma Street High": "/puma_street_high.glb",
  };

  // Resolve model path safely
  const modelPath = shoe && modelMap[shoe.name] ? modelMap[shoe.name] : null;

  // Handle invalid or missing shoe
  if (!shoe) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Shoe not found
      </div>
    );
  }

  // Handle missing model mapping (prevents runtime errors)
  if (!modelPath) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        3D model not available for this shoe
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 pt-20 pb-20">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-3">
        {shoe.name} Try-On
      </h1>

      <p className="text-gray-400 text-center max-w-xl mb-8">
        Place your foot inside the frame to preview the shoe in real time.
      </p>

      {/* Camera Container (EXACT SAME AS MEASUREMENT UI) */}
      <div
        className="relative bg-[#111] border border-yellow-500/20 
             rounded-2xl shadow-2xl p-3 sm:p-4 w-full max-w-md"
      >
        <div className="w-full aspect-[3/4] sm:w-[420px] sm:aspect-auto rounded-xl overflow-hidden relative">
          <FootTryOn modelPath={modelPath} />
        </div>

        {/* Glow Border */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-yellow-500/30 pointer-events-none" />
      </div>

      {/* Status Text (MATCHES MEASUREMENT STYLE) */}
      <div className="mt-6 text-yellow-400 text-lg font-semibold animate-pulse">
        Live Try-On Active...
      </div>
    </div>
  );
}
