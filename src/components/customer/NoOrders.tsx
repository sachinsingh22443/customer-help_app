import { motion } from "motion/react";
import { Package, ArrowRight } from "lucide-react";
import { useState } from "react";

interface NoOrdersProps {
  onBrowse: () => void;
}

export function NoOrders({ onBrowse }: NoOrdersProps) {

  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

      {/* ICON */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-32 h-32 mb-6 bg-gradient-to-br from-[#0FAD6E]/10 to-[#5F2EEA]/10 rounded-full flex items-center justify-center"
      >
        <Package className="w-16 h-16 text-[#0FAD6E]" strokeWidth={1.5} />
      </motion.div>

      {/* TEXT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-[#171717] mb-3">No Orders Yet</h2>

        <p className="text-[#171717]/60 mb-8 max-w-xs mx-auto">
          You haven't placed any orders yet. Start exploring our homemade dishes and place your first order!
        </p>

        {/* BUTTON */}
        <motion.button
          disabled={loading}
          onClick={() => {
            setLoading(true);
            onBrowse();
          }}
          className="bg-gradient-to-r from-[#0FAD6E] to-[#3ec98d] text-white px-8 py-4 rounded-xl flex items-center gap-2 disabled:opacity-50"
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            "Opening..."
          ) : (
            <>
              <span>Order Now</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}