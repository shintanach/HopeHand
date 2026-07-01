import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Users, Package, Heart } from "lucide-react";

const slides = [
  {
    icon: Users,
    heading: "Jadilah Relawan yang Berarti",
    sub: "Temukan jadwal kegiatan panti sesuai waktumu",
  },
  {
    icon: Package,
    heading: "Donasikan Barang yang Dibutuhkan",
    sub: "Pilih langsung barang yang paling dibutuhkan panti",
  },
  {
    icon: Heart,
    heading: "Bantu Lewat Donasi Dana",
    sub: "Donasi uang secara aman dan transparan",
  },
];

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/login");
    }
  };

  const handleSkip = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Skip button */}
      <div className="flex justify-end p-6">
        <button
          onClick={handleSkip}
          className="text-foreground/60 hover:text-foreground transition-colors"
        >
          Lewati
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center max-w-md"
          >
            {/* Icon illustration */}
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-coral/20 to-coral-light/20 flex items-center justify-center mb-8">
              {(() => { const Icon = slides[currentSlide].icon; return Icon ? <Icon className="w-32 h-32 text-coral" /> : null; })()}
            </div>

            {/* Heading */}
            <h1 className="text-3xl mb-4 text-foreground">
              {slides[currentSlide].heading}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-foreground/70">
              {slides[currentSlide].sub}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="p-6 space-y-6">
        {/* Dot indicators */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-8 bg-coral"
                  : "w-2 bg-coral/30 hover:bg-coral/50"
              }`}
            />
          ))}
        </div>

        {/* Next/Start button */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-coral text-white rounded-full hover:bg-coral/90 transition-colors"
          >
            {currentSlide === slides.length - 1
              ? "Mulai Sekarang"
              : "Selanjutnya"}
          </button>
        </div>
      </div>
    </div>
  );
}
