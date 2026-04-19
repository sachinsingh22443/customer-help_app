import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Tag, Check, X, Percent } from "lucide-react";

interface ApplyCouponProps {
  onBack: () => void;
  onApplyCoupon?: (code: string) => void;
}

export function ApplyCoupon({ onBack, onApplyCoupon }: ApplyCouponProps) {
  const [couponCode, setCouponCode] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);

  const availableCoupons = [
    {
      id: "FIRST50",
      code: "FIRST50",
      title: "First Order Special",
      description: "50% off on your first order",
      discount: "50% OFF",
      minOrder: 199,
      maxDiscount: 150,
      validUntil: "31 Dec 2026",
      badge: "NEW USER"
    },
    {
      id: "SAVE100",
      code: "SAVE100",
      title: "Flat ₹100 Off",
      description: "Save ₹100 on orders above ₹499",
      discount: "₹100 OFF",
      minOrder: 499,
      maxDiscount: 100,
      validUntil: "15 Mar 2026",
      badge: "POPULAR"
    },
    {
      id: "HEALTHY20",
      code: "HEALTHY20",
      title: "Healthy Meal Deal",
      description: "20% off on diet meals",
      discount: "20% OFF",
      minOrder: 299,
      maxDiscount: 200,
      validUntil: "31 Mar 2026",
      badge: "LIMITED"
    },
    {
      id: "WEEKEND",
      code: "WEEKEND",
      title: "Weekend Special",
      description: "30% off on weekends",
      discount: "30% OFF",
      minOrder: 399,
      maxDiscount: 250,
      validUntil: "Every Weekend",
      badge: ""
    }
  ];

  const handleApply = () => {
    if (selectedCoupon) {
      onApplyCoupon && onApplyCoupon(selectedCoupon);
    } else if (couponCode) {
      onApplyCoupon && onApplyCoupon(couponCode);
    }
  };

  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 py-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-xl neo-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#171717]" />
          </button>
          <h2 className="text-white">Apply Coupon</h2>
        </div>

        {/* Coupon input */}
        <div className="bg-white rounded-2xl p-4 flex items-center gap-3">
          <Tag className="w-5 h-5 text-[#FF7A30]" />
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="flex-1 outline-none text-[#171717] placeholder:text-[#171717]/40"
          />
          {couponCode && (
            <button
              onClick={() => setCouponCode("")}
              className="w-6 h-6 bg-[#171717]/10 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4 text-[#171717]" />
            </button>
          )}
        </div>
      </div>

      {/* Available Coupons */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        <h3 className="text-[#171717] mb-2">Available Coupons</h3>

        {availableCoupons.map((coupon) => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelectedCoupon(coupon.code)}
            className={`bg-white rounded-2xl p-5 neo-shadow-sm cursor-pointer transition-all relative overflow-hidden ${
              selectedCoupon === coupon.code ? "ring-2 ring-[#FF7A30]" : ""
            }`}
          >
            {/* Dashed border decoration */}
            <div className="absolute top-0 left-0 right-0 h-px bg-[#171717]/10" style={{ backgroundImage: "repeating-linear-gradient(to right, #171717 0, #171717 4px, transparent 4px, transparent 8px)" }} />
            
            {/* Badge */}
            {coupon.badge && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-[#FF7A30] text-white text-xs rounded-full animate-pulse-glow">
                  {coupon.badge}
                </span>
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-[#FFF8F0] rounded-xl flex items-center justify-center flex-shrink-0">
                <Percent className="w-7 h-7 text-[#FF7A30]" />
              </div>

              <div className="flex-1">
                <h3 className="text-[#171717] mb-1">{coupon.title}</h3>
                <p className="text-sm text-[#171717]/60 mb-3">
                  {coupon.description}
                </p>

                <div className="flex items-center gap-4 mb-3">
                  <div className="px-3 py-1 bg-[#0FAD6E]/10 rounded-lg">
                    <p className="text-xs text-[#0FAD6E] font-semibold">
                      {coupon.discount}
                    </p>
                  </div>
                  <p className="text-xs text-[#171717]/40">
                    Min order ₹{coupon.minOrder}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-1 bg-[#FFF8F0] rounded-lg text-sm font-mono text-[#5F2EEA] border-2 border-dashed border-[#5F2EEA]/30">
                      {coupon.code}
                    </code>
                  </div>
                  <p className="text-xs text-[#171717]/40">
                    Valid till {coupon.validUntil}
                  </p>
                </div>
              </div>

              {selectedCoupon === coupon.code && (
                <div className="w-6 h-6 bg-[#0FAD6E] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Apply Button */}
      <div className="px-6 py-4 bg-white border-t-2 border-[#171717]/5">
        <button
          onClick={handleApply}
          disabled={!selectedCoupon && !couponCode}
          className="w-full py-4 bg-[#FF7A30] text-white rounded-2xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Apply Coupon
        </button>
      </div>
    </div>
  );
}