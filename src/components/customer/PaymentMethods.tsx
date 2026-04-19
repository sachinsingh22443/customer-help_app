import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Plus,
  CreditCard,
  Wallet,
  Building,
  Trash2,
  Star,
} from "lucide-react";

interface PaymentMethodsProps {
  onBack: () => void;
  onAddCard: () => void;
  onSelect: (method: string) => void; // 🔥 NEW
}

export function PaymentMethods({
  onBack,
  onAddCard,
  onSelect,
}: PaymentMethodsProps) {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "1",
      type: "card",
      name: "HDFC Credit Card",
      number: "**** **** **** 4532",
      expiry: "12/26",
      isDefault: true,
    },
    {
      id: "2",
      type: "upi",
      name: "Google Pay",
      number: "rahul@oksbi",
      isDefault: false,
    },
    {
      id: "3",
      type: "wallet",
      name: "EatUnity Wallet",
      number: "Balance: ₹450",
      isDefault: false,
    },
    {
      id: "4",
      type: "cod",
      name: "Cash on Delivery",
      number: "Pay at your doorstep",
      isDefault: false,
    },
  ]);

  const handleDelete = (id: string) => {
    if (confirm("Remove this payment method?")) {
      setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
    }
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }))
    );
  };

  // 🔥 SELECT METHOD (IMPORTANT)
  const handleSelect = (method: any) => {
    localStorage.setItem("payment_method", method.type);
    onSelect(method.type);
  };

  const getIcon = (type: string) => {
    if (type === "card") return CreditCard;
    if (type === "upi") return Building;
    return Wallet;
  };

  const getColor = (type: string) => {
    if (type === "card") return "from-[#5F2EEA] to-[#8860f5]";
    if (type === "upi") return "from-[#0FAD6E] to-[#3ec98d]";
    return "from-[#FF7A30] to-[#ff9d5c]";
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#5F2EEA] to-[#8860f5] px-6 pt-12 pb-8 rounded-b-[2rem] relative overflow-hidden">

        <div className="flex items-center gap-4 mb-6">
          <motion.button onClick={onBack}>
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>

          <div className="flex-1">
            <h1 className="text-white">Payment Methods</h1>
          </div>

          <motion.button onClick={onAddCard}>
            <Plus className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </div>

      {/* LIST */}
      <div className="px-6 mt-6 space-y-4">
        <AnimatePresence>
          {paymentMethods.map((method, index) => {
            const Icon = getIcon(method.type);
            const gradient = getColor(method.type);

            return (
              <motion.div
                key={method.id}
                onClick={() => {
                  handleSetDefault(method.id);
                  handleSelect(method); // 🔥 MAIN FIX
                }}
                className="bg-white rounded-2xl p-4 cursor-pointer"
              >
                {method.isDefault && (
                  <div className="text-green-500 text-xs mb-2">
                    Default
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Icon className="text-[#FF7A30]" />
                  <div>
                    <p>{method.name}</p>
                    <p className="text-sm text-gray-500">{method.number}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}