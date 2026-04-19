import { motion } from "motion/react";
import { Download, Sparkles } from "lucide-react";

interface ForceUpdateProps {
  onUpdate: () => void;
}

export function ForceUpdate({ onUpdate }: ForceUpdateProps) {
  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] opacity-10 rounded-b-[3rem]" />

      <motion.div
        className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center neo-shadow-lg mb-6 relative"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <span className="text-5xl">🍽️</span>
        <motion.div
          className="absolute -top-2 -right-2 w-8 h-8 bg-[#0FAD6E] rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Sparkles className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <h2 className="text-[#171717] mb-3">Update Required</h2>
        <p className="text-[#171717]/60 mb-8">
          A new version of EatUnity is available with exciting features and improvements. Please update to continue.
        </p>

        <div className="bg-white rounded-2xl p-6 neo-shadow-sm mb-6">
          <h3 className="text-[#171717] mb-3">What's New?</h3>
          <ul className="space-y-2 text-left text-sm text-[#171717]/70">
            <li className="flex items-start gap-2">
              <span className="text-[#0FAD6E] mt-1">✓</span>
              <span>Enhanced order tracking experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0FAD6E] mt-1">✓</span>
              <span>New payment options</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0FAD6E] mt-1">✓</span>
              <span>Performance improvements</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0FAD6E] mt-1">✓</span>
              <span>Bug fixes and stability</span>
            </li>
          </ul>
        </div>

        <button
          onClick={onUpdate}
          className="w-full py-4 bg-[#FF7A30] text-white rounded-2xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Update Now
        </button>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-[#171717]/40">
          Version 2.0.0 | Size: 45 MB
        </p>
      </motion.div>
    </div>
  );
}
