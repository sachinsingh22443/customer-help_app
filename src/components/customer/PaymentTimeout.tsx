import { motion } from "framer-motion";
import { Clock, RefreshCw, Home } from "lucide-react";

interface PaymentTimeoutProps {
  order: any; // 🔥 FULL ORDER OBJECT
  onRetry?: (order: any) => void;
  onBackToHome: () => void;
}

export function PaymentTimeout({
  order,
  onRetry,
  onBackToHome,
}: PaymentTimeoutProps) {

  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* BG */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-[#FF7A30] to-[#5F2EEA] opacity-10 rounded-b-[3rem]" />

      {/* ICON */}
      <motion.div
        className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Clock className="w-12 h-12 text-[#FF7A30]" />
      </motion.div>

      {/* TEXT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <h2 className="mb-3">Payment Timeout</h2>

        <p className="text-gray-500 mb-6">
          The payment took too long. Please try again.
        </p>

        {/* DETAILS */}
        <div className="bg-white rounded-2xl p-6 mb-6 space-y-2">

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order ID</span>
            <span>{order.id}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount</span>
            <span>₹{order.total_price}</span>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="space-y-3">

          {onRetry && (
            <button
              onClick={() => onRetry(order)} // 🔥 SAME ORDER RETRY
              className="w-full py-4 bg-[#FF7A30] text-white rounded-2xl flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          )}

          <button
            onClick={onBackToHome}
            className="w-full py-4 bg-white border rounded-2xl flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>

        </div>
      </motion.div>
    </div>
  );
}