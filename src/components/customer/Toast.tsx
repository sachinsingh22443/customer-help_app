import { motion, AnimatePresence } from "motion/react";
import { CheckCircle } from "lucide-react";

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-[340px] w-full px-6"
        >
          <div className="bg-[#0FAD6E] text-white px-4 py-3 rounded-2xl neo-shadow flex items-center gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
