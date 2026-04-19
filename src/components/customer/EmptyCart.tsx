import { motion } from "motion/react";
import { ShoppingBag, ArrowRight } from "lucide-react";

interface EmptyCartProps {
  onBrowse: () => void;
}

export function EmptyCart({ onBrowse }: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-32 h-32 mb-6 bg-gradient-to-br from-[#FF7A30]/10 to-[#5F2EEA]/10 rounded-full flex items-center justify-center"
      >
        <ShoppingBag className="w-16 h-16 text-[#FF7A30]" strokeWidth={1.5} />
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-[#171717] mb-3">Your Cart is Empty</h2>
        <p className="text-[#171717]/60 mb-8 max-w-xs mx-auto">
          Looks like you haven't added anything to your cart yet. Explore our delicious homemade dishes!
        </p>

        <motion.button
          onClick={onBrowse}
          className="bg-gradient-to-r from-[#FF7A30] to-[#ff9d5c] text-white px-8 py-4 rounded-xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all inline-flex items-center gap-2"
          whileTap={{ scale: 0.98 }}
        >
          <span>Browse Dishes</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
}
