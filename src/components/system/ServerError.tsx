import { motion } from "motion/react";
import { ServerCrash, RefreshCw, Home } from "lucide-react";

interface ServerErrorProps {
  onRetry: () => void;
  onBackToHome: () => void;
}

export function ServerError({ onRetry, onBackToHome }: ServerErrorProps) {
  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-[#FF7A30] to-[#5F2EEA] opacity-10 rounded-b-[3rem]" />

      <motion.div
        className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center neo-shadow-lg mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ServerCrash className="w-12 h-12 text-[#FF7A30]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <h2 className="text-[#171717] mb-3">Server Error</h2>
        <p className="text-[#171717]/60 mb-8">
          Oops! Something went wrong on our end. Our team has been notified and we're working to fix it.
        </p>

        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full py-4 bg-[#FF7A30] text-white rounded-2xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <button
            onClick={onBackToHome}
            className="w-full py-4 bg-white text-[#171717] rounded-2xl neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
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
          Error Code: 500 | Server Error
        </p>
      </motion.div>
    </div>
  );
}
