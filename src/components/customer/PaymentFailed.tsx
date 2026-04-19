import { motion } from "framer-motion";
import { X, RefreshCw, Home } from "lucide-react";

interface PaymentFailedProps {
  order: any; // 🔥 FULL ORDER OBJECT
  error?: string;
  paymentId?: string;
  onRetry: (order: any) => void; // 🔥 pass order
  onBackToHome: () => void;
}

export function PaymentFailed({
  order,
  error = "PAYMENT_FAILED",
  paymentId,
  onRetry,
  onBackToHome,
}: PaymentFailedProps) {

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* BG */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF7A30]/10 via-transparent to-[#FF7A30]/20" />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="relative z-10"
      >

        {/* ICON */}
        <motion.div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#FF7A30] to-[#ff9d5c] rounded-full flex items-center justify-center">
          <X className="w-12 h-12 text-white" />
        </motion.div>

        {/* TEXT */}
        <div className="text-center mb-8">
          <h1 className="mb-2">Payment Failed</h1>

          <p className="text-gray-500 mb-2">
            Oops! Your payment couldn't be processed
          </p>

          <p className="text-sm text-gray-400">
            Please try again or use a different payment method
          </p>
        </div>

        {/* DETAILS */}
        <div className="bg-white rounded-2xl p-6 mb-6 w-full max-w-sm">
          <div className="space-y-3">

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span>{order.id}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amount</span>
              <span>₹{order.total_price}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Error</span>
              <span className="text-[#FF7A30]">{error}</span>
            </div>

            {paymentId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment ID</span>
                <span>{paymentId}</span>
              </div>
            )}

          </div>
        </div>

        {/* ACTIONS */}
        <div className="space-y-3">

          <button
            onClick={() => onRetry(order)} // 🔥 retry with same order
            className="w-full bg-[#FF7A30] text-white py-4 rounded-xl flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Retry Payment
          </button>

          <button
            onClick={onBackToHome}
            className="w-full bg-white border py-4 rounded-xl flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>

        </div>
      </motion.div>
    </div>
  );
}