import { motion } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface RefundStatusProps {
  order: any; // 🔥 FULL ORDER OBJECT
  onBack: () => void;
}

export function RefundStatus({
  order,
  onBack,
}: RefundStatusProps) {

  const statusConfig: any = {
    pending: {
      icon: Clock,
      color: "#FF7A30",
      text: "Refund Pending",
    },
    processing: {
      icon: RefreshCw,
      color: "#5F2EEA",
      text: "Processing Refund",
    },
    completed: {
      icon: CheckCircle,
      color: "#0FAD6E",
      text: "Refund Completed",
    },
    failed: {
      icon: XCircle,
      color: "#FF7A30",
      text: "Refund Failed",
    },
  };

  // 🔥 SAFE FALLBACK
  const config =
    statusConfig[order.refund_status] || statusConfig["pending"];

  const StatusIcon = config.icon;

  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#5F2EEA] to-[#0FAD6E] px-6 py-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ArrowLeft className="text-white" />
          </button>

          <div>
            <h2 className="text-white">Refund Status</h2>
            <p className="text-white/80 text-sm">
              Order #{order.id}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">

        {/* STATUS CARD */}
        <motion.div className="bg-white rounded-2xl p-6 text-center">
          <StatusIcon
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: config.color }}
          />

          <h2>{config.text}</h2>

          <p className="text-green-600 mt-2 text-xl">
            ₹{order.refund_amount || order.total_price}
          </p>
        </motion.div>

        {/* DETAILS */}
        <div className="bg-white rounded-2xl p-6">
          <div className="space-y-3">

            {order.refund_date && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Requested</span>
                <span>
                  {new Date(order.refund_date).toLocaleDateString()}
                </span>
              </div>
            )}

            {/* Optional expected date */}
            {order.refund_status === "processing" && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Expected</span>
                <span>3-5 days</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="capitalize">
                {order.refund_status}
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}