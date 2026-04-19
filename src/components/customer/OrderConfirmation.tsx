import { motion } from "motion/react";
import { Check, MapPin, Clock, User } from "lucide-react";

interface OrderConfirmationProps {
  order: any; // 🔥 FULL ORDER OBJECT
  onContinue: () => void;
  onTrackOrder: (orderId: string) => void;
}

export function OrderConfirmation({
  order,
  onContinue,
  onTrackOrder,
}: OrderConfirmationProps) {

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* BG */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0FAD6E]/10 via-transparent to-[#FF7A30]/10" />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="relative z-10"
      >

        {/* ICON */}
        <motion.div
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#0FAD6E] to-[#3ec98d] rounded-full flex items-center justify-center"
        >
          <Check className="w-12 h-12 text-white" strokeWidth={3} />
        </motion.div>

        {/* TEXT */}
        <div className="text-center mb-8">
          <h1 className="text-[#171717] mb-2">Order Confirmed!</h1>

          <p className="text-[#171717]/60 mb-4">
            Your order has been placed successfully
          </p>

          <div className="bg-white px-4 py-2 rounded-xl">
            <p className="text-xs text-gray-500">Order ID</p>
            <p className="text-[#FF7A30]">#{order.id}</p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="bg-white rounded-2xl p-6 mb-6 space-y-4">

          {/* DELIVERY TIME */}
          <div className="flex items-center gap-3">
            <Clock className="text-[#FF7A30]" />
            <div>
              <p className="text-sm text-gray-500">Estimated Delivery</p>
              <p>30-45 minutes</p>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="flex items-center gap-3">
            <MapPin className="text-[#0FAD6E]" />
            <div>
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p>{order.address || "Your address"}</p>
            </div>
          </div>

          {/* TOTAL */}
          <div className="flex items-center gap-3">
            <User className="text-[#5F2EEA]" />
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-[#0FAD6E] font-bold">
                ₹{order.total_price}
              </p>
            </div>
          </div>

        </div>

        {/* BUTTONS */}
        <div className="space-y-3">

          <button
            onClick={() => onTrackOrder(order.id)}
            className="w-full bg-[#FF7A30] text-white py-4 rounded-xl"
          >
            Track Order
          </button>

          <button
            onClick={onContinue}
            className="w-full border border-[#FF7A30] text-[#FF7A30] py-4 rounded-xl"
          >
            Back to Home
          </button>

        </div>
      </motion.div>
    </div>
  );
}