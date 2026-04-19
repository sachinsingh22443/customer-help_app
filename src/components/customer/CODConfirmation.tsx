import { motion } from "motion/react";
import { Wallet, AlertCircle, Check } from "lucide-react";
import { useState } from "react";

interface CODConfirmationProps {
  order: any; // 🔥 FULL ORDER OBJECT
  onConfirm: (order: any) => void;
  onBack?: () => void;
  onBackToHome: () => void;
}

export function CODConfirmation({
  order,
  onConfirm,
  onBack,
  onBackToHome,
}: CODConfirmationProps) {

  const [loading, setLoading] = useState(false);

  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6 relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-[#0FAD6E] to-[#5F2EEA] opacity-10 rounded-b-[3rem]" />

      {/* ICON */}
      <motion.div
        className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center neo-shadow-lg mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <Wallet className="w-12 h-12 text-[#0FAD6E]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm w-full"
      >
        <h2 className="text-[#171717] mb-3">Cash on Delivery</h2>

        <p className="text-[#171717]/60 mb-8">
          Please keep exact change ready for a smooth delivery experience
        </p>

        {/* AMOUNT */}
        <div className="bg-white rounded-2xl p-6 neo-shadow-sm mb-6">
          <p className="text-sm text-[#171717]/60 mb-2">Amount to Pay</p>
          <p className="text-4xl font-bold text-[#0FAD6E]">
            ₹{order?.total_price || 0}
          </p>
        </div>

        {/* IMPORTANT */}
        <div className="bg-[#FF7A30]/10 border-2 border-[#FF7A30]/30 rounded-2xl p-5 mb-6 text-left">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-[#FF7A30]" />
            <h3 className="text-[#171717]">Important</h3>
          </div>

          <ul className="space-y-2 text-sm text-[#171717]/70">
            <li className="flex items-start gap-2">
              <span className="text-[#0FAD6E] mt-1">✓</span>
              <span>Keep exact change ready</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0FAD6E] mt-1">✓</span>
              <span>Payment collected by delivery partner</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0FAD6E] mt-1">✓</span>
              <span>You'll receive a receipt</span>
            </li>
          </ul>
        </div>

        {/* ACTIONS */}
        <div className="space-y-3">

          <button
            disabled={loading}
            onClick={() => {
              setLoading(true);
              onConfirm(order);
            }}
            className="w-full py-4 bg-[#0FAD6E] text-white rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <Check className="w-5 h-5" />
                Confirm COD Order
              </>
            )}
          </button>

          <button
            onClick={onBack}
            className="w-full py-4 bg-white text-[#171717] rounded-2xl"
          >
            Choose Different Payment
          </button>

          <button
            onClick={onBackToHome}
            className="w-full py-4 bg-white text-[#171717] rounded-2xl"
          >
            Back to Home
          </button>

        </div>
      </motion.div>
    </div>
  );
}