import { motion } from "framer-motion";
import { CheckCircle2, Home, Package, Wallet } from "lucide-react";

interface PaymentSuccessProps {
  order: any; // 🔥 FULL ORDER OBJECT
  onBackToHome: () => void;
  onViewOrders?: () => void;
}

export function PaymentSuccess({
  order,
  onBackToHome,
  onViewOrders,
}: PaymentSuccessProps) {

  const isCOD = order.payment_method === "cod";

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Background */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#0FAD6E]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#FF7A30]/10 rounded-full blur-3xl" />

      {/* ICON */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="relative mb-6"
      >
        <motion.div className="w-32 h-32 bg-gradient-to-br from-[#0FAD6E] to-[#3ec98d] rounded-full flex items-center justify-center neo-shadow">
          
          {/* 🔥 ICON CHANGE */}
          {isCOD ? (
            <Wallet className="w-16 h-16 text-white" />
          ) : (
            <CheckCircle2 className="w-16 h-16 text-white" />
          )}

        </motion.div>
      </motion.div>

      {/* TEXT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-[#171717] mb-3">
          {isCOD ? "Order Placed Successfully!" : "Payment Successful!"}
        </h1>

        <p className="text-[#171717]/60 max-w-sm mx-auto">
          {isCOD
            ? "Your order has been placed. Please pay at delivery."
            : "Your payment was successful and order is confirmed."}
        </p>
      </motion.div>

      {/* ORDER DETAILS */}
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mb-8">
        <div className="space-y-3">

          <div className="flex justify-between border-b pb-3">
            <span className="text-sm text-gray-500">Order ID</span>
            <span>{order.id}</span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span className="text-sm text-gray-500">
              {isCOD ? "Amount to Pay" : "Amount Paid"}
            </span>
            <span className="text-green-600">₹{order.total_price}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Delivery</span>
            <span>30-45 mins</span>
          </div>

        </div>
      </div>

      {/* BUTTONS */}
      <div className="w-full max-w-sm space-y-3">

        {onViewOrders && (
          <button
            onClick={onViewOrders}
            className="w-full bg-green-500 text-white py-4 rounded-xl flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" />
            Track Order
          </button>
        )}

        <button
          onClick={onBackToHome}
          className="w-full bg-white border-2 py-4 rounded-xl flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </button>

      </div>
    </div>
  );
}