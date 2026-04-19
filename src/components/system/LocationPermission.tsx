import { motion } from "motion/react";
import { MapPin, X } from "lucide-react";

interface LocationPermissionProps {
  onAllow: () => void;
  onDeny: () => void;
}

export function LocationPermission({ onAllow, onDeny }: LocationPermissionProps) {
  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-[#0FAD6E] to-[#5F2EEA] opacity-10 rounded-b-[3rem]" />

      <motion.div
        className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center neo-shadow-lg mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <MapPin className="w-12 h-12 text-[#0FAD6E]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <h2 className="text-[#171717] mb-3">Enable Location</h2>
        <p className="text-[#171717]/60 mb-8">
          Allow EatUnity to access your location to find nearby chefs and get accurate delivery estimates.
        </p>

        <div className="bg-white rounded-2xl p-6 neo-shadow-sm mb-6">
          <h3 className="text-[#171717] mb-3 text-left">Why we need this:</h3>
          <ul className="space-y-2 text-left text-sm text-[#171717]/70">
            <li className="flex items-start gap-2">
              <span className="text-[#0FAD6E] mt-1">✓</span>
              <span>Find chefs near you</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0FAD6E] mt-1">✓</span>
              <span>Accurate delivery time estimates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0FAD6E] mt-1">✓</span>
              <span>Better recommendations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0FAD6E] mt-1">✓</span>
              <span>Real-time order tracking</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={onAllow}
            className="w-full py-4 bg-[#0FAD6E] text-white rounded-2xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            Allow Location Access
          </button>

          <button
            onClick={onDeny}
            className="w-full py-4 bg-white text-[#171717] rounded-2xl neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Maybe Later
          </button>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-[#171717]/40">
          We respect your privacy
        </p>
      </motion.div>
    </div>
  );
}
