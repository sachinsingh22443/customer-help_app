import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, XCircle, AlertTriangle } from "lucide-react";

interface OrderCancellationProps {
  order: any; // 🔥 FULL ORDER OBJECT
  onBack: () => void;
  onSuccess?: () => void;
}

export function OrderCancellation({
  order,
  onBack,
  onSuccess,
}: OrderCancellationProps) {

  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);

  const reasons = [
    "Ordered by mistake",
    "Want to change delivery address",
    "Need to modify order items",
    "Changed my mind",
    "Delivery time is too long",
    "Found a better price elsewhere",
    "Other reason",
  ];

  // 🔥 VALIDATION
  const finalReason =
    selectedReason === "Other reason" ? customReason : selectedReason;

  const canCancel = finalReason && finalReason.trim().length > 3;

  // 🔥 API CALL
  const handleCancel = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await fetch(`https://chef-backend-1.onrender.com/orders/${order.id}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: finalReason,
        }),
      });

      onSuccess?.();

    } catch (err) {
      console.error("Cancel failed", err);
      alert("Failed to cancel order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col overflow-y-auto pb-20">

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-[#FF7A30] to-[#5F2EEA] px-6 py-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-[#171717]" />
          </button>
          <div>
            <h2 className="text-white">Cancel Order</h2>
            <p className="text-white/80 text-sm">Order #{order.id}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 space-y-6">

        {/* WARNING */}
        <div className="bg-[#FF7A30]/10 border-2 border-[#FF7A30] rounded-2xl p-5 flex gap-3">
          <AlertTriangle className="w-6 h-6 text-[#FF7A30]" />
          <p className="text-sm text-[#171717]/70">
            This action cannot be undone. Refund depends on order status.
          </p>
        </div>

        {/* REASONS */}
        <div>
          <h3 className="mb-3">Why are you cancelling?</h3>
          <div className="space-y-2">
            {reasons.map((reason) => (
              <button
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className={`w-full py-3 px-4 text-left rounded-xl border ${
                  selectedReason === reason
                    ? "border-[#FF7A30]"
                    : "border-gray-200"
                }`}
              >
                {reason}
              </button>
            ))}
          </div>
        </div>

        {/* CUSTOM */}
        {selectedReason === "Other reason" && (
          <textarea
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Enter reason..."
            className="w-full p-4 border rounded-xl"
          />
        )}

        {/* BUTTONS */}
        <div className="space-y-3">

          <button
            disabled={!canCancel || loading}
            onClick={handleCancel}
            className="w-full py-4 bg-[#FF7A30] text-white rounded-xl disabled:opacity-50"
          >
            {loading ? "Cancelling..." : "Cancel Order"}
          </button>

          <button
            onClick={onBack}
            className="w-full py-4 border rounded-xl"
          >
            Keep Order
          </button>

        </div>

      </div>
    </div>
  );
}