import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

export function SessionCheck() {
  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6">
      <motion.div
        className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center neo-shadow-lg mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <span className="text-5xl">🍽️</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h2 className="text-[#171717] mb-4">Checking Session</h2>
        <div className="flex items-center justify-center gap-2 text-[#171717]/60">
          <Loader2 className="w-5 h-5 animate-spin text-[#FF7A30]" />
          <p>Please wait...</p>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FF7A30]/10 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}
