import { motion } from "motion/react";
import { ArrowLeft, Gift, Clock, Sparkles, Star } from "lucide-react";

interface OffersListProps {
  onBack: () => void;
  onSelectOffer?: (offerId: string) => void;
}

export function OffersList({ onBack, onSelectOffer }: OffersListProps) {
  const offers = [
    {
      id: "bank-offer",
      title: "Bank Offer",
      description: "Get 25% cashback on orders above ₹799 using HDFC cards",
      discount: "25% Cashback",
      icon: "💳",
      color: "from-[#5F2EEA] to-[#FF7A30]",
      validUntil: "31 Mar 2026",
      terms: ["Valid on HDFC Credit/Debit cards", "Max cashback ₹200", "Once per user"]
    },
    {
      id: "subscription-offer",
      title: "Subscription Deal",
      description: "Subscribe to any meal plan and get first week free",
      discount: "1 Week Free",
      icon: "📦",
      color: "from-[#0FAD6E] to-[#5F2EEA]",
      validUntil: "15 Apr 2026",
      terms: ["New subscribers only", "Auto-renews after trial", "Cancel anytime"]
    },
    {
      id: "referral-bonus",
      title: "Refer & Earn",
      description: "Invite friends and get ₹100 for each successful referral",
      discount: "₹100 Each",
      icon: "🎁",
      color: "from-[#FF7A30] to-[#0FAD6E]",
      validUntil: "Ongoing",
      terms: ["Friend must complete first order", "No limit on referrals", "Instant credit"]
    },
    {
      id: "festival-special",
      title: "Festival Mega Sale",
      description: "Flat 40% off on all orders during festival season",
      discount: "40% OFF",
      icon: "🎊",
      color: "from-[#FF7A30] to-[#5F2EEA]",
      validUntil: "10 Mar 2026",
      terms: ["No minimum order", "Valid on all meals", "Limited time only"]
    },
    {
      id: "loyalty-reward",
      title: "Loyalty Reward",
      description: "Complete 10 orders and unlock exclusive benefits",
      discount: "VIP Access",
      icon: "⭐",
      color: "from-[#5F2EEA] to-[#0FAD6E]",
      validUntil: "Ongoing",
      terms: ["Priority delivery", "Special discounts", "Early access to new dishes"]
    },
    {
      id: "midnight-deal",
      title: "Midnight Hunger Deal",
      description: "Order between 11 PM - 2 AM and get 30% off",
      discount: "30% OFF",
      icon: "🌙",
      color: "from-[#171717] to-[#5F2EEA]",
      validUntil: "Daily",
      terms: ["Valid 11 PM - 2 AM", "Min order ₹299", "Limited slots"]
    }
  ];

  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 py-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-xl neo-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#171717]" />
          </button>
          <div>
            <h2 className="text-white">Special Offers</h2>
            <p className="text-white/80 text-sm">Save more on every order</p>
          </div>
          <Sparkles className="w-6 h-6 text-white ml-auto animate-pulse-glow" />
        </div>
      </div>

      {/* Offers List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {offers.map((offer, index) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectOffer && onSelectOffer(offer.id)}
            className="bg-white rounded-2xl overflow-hidden neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
          >
            {/* Gradient header */}
            <div className={`h-24 bg-gradient-to-br ${offer.color} p-5 relative overflow-hidden`}>
              <div className="absolute top-2 right-2 text-4xl opacity-20">
                {offer.icon}
              </div>
              <h3 className="text-white mb-1">{offer.title}</h3>
              <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg">
                <p className="text-white text-sm font-semibold">{offer.discount}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="text-[#171717]/70 mb-4">
                {offer.description}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-[#FF7A30]" />
                <p className="text-xs text-[#171717]/60">
                  Valid until {offer.validUntil}
                </p>
              </div>

              {/* Terms */}
              <div className="bg-[#FFF8F0] rounded-xl p-3">
                <p className="text-xs text-[#171717]/60 mb-2">Terms & Conditions:</p>
                <ul className="space-y-1">
                  {offer.terms.map((term, idx) => (
                    <li key={idx} className="text-xs text-[#171717]/50 flex items-start gap-2">
                      <span className="text-[#0FAD6E] mt-0.5">•</span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSelectOffer && onSelectOffer(offer.id)}
                className="w-full mt-4 py-3 bg-gradient-to-r from-[#FF7A30] to-[#5F2EEA] text-white rounded-xl text-sm hover:opacity-90 transition-opacity"
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom info */}
      <div className="px-6 py-4 bg-white border-t-2 border-[#171717]/5">
        <div className="flex items-center gap-2 justify-center text-sm text-[#171717]/60">
          <Star className="w-4 h-4 text-[#FF7A30]" />
          <p>Check back regularly for new offers</p>
        </div>
      </div>
    </div>
  );
}