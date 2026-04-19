import { motion } from "motion/react";
import { WifiOff, RefreshCw } from "lucide-react";

interface NoInternetProps {
  onRetry: () => void;
}

export function NoInternet({ onRetry }: NoInternetProps) {
  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6 text-center">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-32 h-32 mb-6 bg-gradient-to-br from-[#FF7A30]/10 to-[#FF7A30]/5 rounded-full flex items-center justify-center relative"
      >
        <WifiOff className="w-16 h-16 text-[#FF7A30]" strokeWidth={1.5} />
        <motion.div
          className="absolute inset-0 border-4 border-[#FF7A30]/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h1 className="text-[#171717] mb-3">No Internet Connection</h1>
        <p className="text-[#171717]/60 mb-2 max-w-sm mx-auto">
          Oops! Looks like you're offline. Check your internet connection and try again.
        </p>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 neo-shadow-sm mb-8 text-left max-w-sm"
      >
        <p className="text-sm text-[#171717] mb-3">💡 Try these steps:</p>
        <ul className="space-y-2 text-sm text-[#171717]/70">
          <li className="flex items-start gap-2">
            <span className="text-[#FF7A30]">•</span>
            <span>Check your WiFi or mobile data connection</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FF7A30]">•</span>
            <span>Turn airplane mode off</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FF7A30]">•</span>
            <span>Restart your router</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FF7A30]">•</span>
            <span>Move to an area with better signal</span>
          </li>
        </ul>
      </motion.div>

      {/* Retry Button */}
      <motion.button
        onClick={onRetry}
        className="bg-gradient-to-r from-[#FF7A30] to-[#ff9d5c] text-white px-8 py-4 rounded-xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all inline-flex items-center gap-2"
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <RefreshCw className="w-5 h-5" />
        <span>Try Again</span>
      </motion.button>
    </div>
  );
}
