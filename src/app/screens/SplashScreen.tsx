import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import logoImg from "../../imports/Removal-3.png";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate checking if user is new or returning
    const timer = setTimeout(() => {
      // For demo, always go to onboarding
      // In production, check localStorage for returning user
      navigate("/onboarding");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <img
          src={logoImg}
          alt="Hope Hand Logo"
          className="w-48 h-48 object-contain"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 text-xl text-foreground text-center"
        >
          Satu Langkah, Seribu Harapan
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-12"
      >
        <div className="w-12 h-12 border-4 border-coral border-t-transparent rounded-full animate-spin" />
      </motion.div>
    </div>
  );
}
