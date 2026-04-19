import { motion } from "framer-motion";
import { Loader2, CreditCard } from "lucide-react";

interface PaymentProcessingProps {
  order?: any; // 🔥 optional (for better UX)
  onBackToHome?: () => void;
}

export function PaymentProcessing({
  order,
  onBackToHome,
}: PaymentProcessingProps) {

  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6 relative">

      {/* ICON */}
      <motion.div
        className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center neo-shadow-lg mb-6 relative"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <CreditCard className="w-12 h-12 text-[#5F2EEA]" />

        <motion.div
          className="absolute inset-0 rounded-3xl border-4 border-[#5F2EEA]"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* TEXT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <h2 className="text-[#171717] mb-3">Processing Payment</h2>

        <p className="text-[#171717]/60 mb-6">
          Please don't close this window. Your payment is being securely processed...
        </p>

        {/* 🔥 ORDER INFO (optional but pro UX) */}
        {order && (
          <div className="bg-white rounded-xl p-4 mb-6 text-sm">
            <p className="text-gray-500 mb-1">Order ID</p>
            <p className="font-medium">{order.id}</p>

            <p className="text-gray-500 mt-2 mb-1">Amount</p>
            <p className="font-medium text-[#0FAD6E]">₹{order.total_price}</p>
          </div>
        )}

        {/* LOADER */}
        <div className="bg-white rounded-2xl p-6 neo-shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Loader2 className="w-5 h-5 animate-spin text-[#5F2EEA]" />
            <p className="text-sm text-[#171717]/70">
              Verifying transaction
            </p>
          </div>

          <div className="h-2 bg-[#FFF8F0] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#5F2EEA] to-[#0FAD6E]"
              initial={{ width: "0%" }}
              animate={{ width: "90%" }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* FOOTER */}
      <motion.div
        className="absolute bottom-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-[#171717]/40">
          🔒 Secured by 256-bit encryption
        </p>

        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="mt-3 text-sm text-[#FF7A30]"
          >
            Cancel & Go Home
          </button>
        )}
      </motion.div>

    </div>
  );
}