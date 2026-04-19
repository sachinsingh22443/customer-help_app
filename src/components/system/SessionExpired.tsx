import { motion } from "motion/react";
import { Clock, LogIn } from "lucide-react";

interface SessionExpiredProps {
  onLogin: () => void;
}

export function SessionExpired({ onLogin }: SessionExpiredProps) {
  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-[#5F2EEA] to-[#FF7A30] opacity-10 rounded-b-[3rem]" />

      <motion.div
        className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center neo-shadow-lg mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <Clock className="w-12 h-12 text-[#5F2EEA]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <h2 className="text-[#171717] mb-3">Session Expired</h2>
        <p className="text-[#171717]/60 mb-8">
          Your session has expired for security reasons. Please log in again to continue enjoying your favorite meals.
        </p>

        <div className="bg-white rounded-2xl p-6 neo-shadow-sm mb-6">
          <p className="text-sm text-[#171717]/70">
            For your security, we automatically log you out after a period of inactivity.
          </p>
        </div>

        <button
          onClick={onLogin}
          className="w-full py-4 bg-[#FF7A30] text-white rounded-2xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          Log In Again
        </button>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-[#171717]/40">
          Your data is safe with us
        </p>
      </motion.div>
    </div>
  );
}
