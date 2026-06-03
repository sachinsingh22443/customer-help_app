import { motion } from "motion/react";
import { Package, Clock, CheckCircle, Truck, MapPin } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { NoOrders } from "./NoOrders";
import { useEffect, useState } from "react";

interface OrdersProps {
  onNavigateToTracking?: (orderId: string) => void;
}

export function Orders({ onNavigateToTracking }: OrdersProps) {

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH ORDERS FROM BACKEND
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("https://chef-backend-qh12.onrender.com/orders/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(() => {
    fetchOrders();
  }, 15000);

  return () => clearInterval(interval);
  }, []);

  const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Order Received";
    case "accepted":
      return "Accepted";
    case "preparing":
      return "Preparing";
    case "ready":
      return "Ready For Pickup";
    case "out_for_delivery":
      return "Out For Delivery";
    case "delivered":
      return "Delivered";
    default:
      return status;
  }
};

  const getStatusIcon = (status: string) => {
  if (status === "pending") return Clock;
  if (status === "accepted") return CheckCircle;
  if (status === "preparing") return Package;
  if (status === "ready") return Package;
  if (status === "out_for_delivery") return Truck;
  if (status === "delivered") return CheckCircle;
  return Package;
};

  const getStatusColor = (status: string) => {
  if (status === "pending") return "from-yellow-500 to-yellow-400";
  if (status === "accepted") return "from-green-500 to-green-400";
  if (status === "preparing") return "from-[#5F2EEA] to-[#7c5cff]";
  if (status === "ready") return "from-purple-500 to-purple-400";
  if (status === "out_for_delivery") return "from-[#FF7A30] to-[#ff9d5c]";
  if (status === "delivered") return "from-[#0FAD6E] to-[#3ec98d]";
  return "from-[#171717] to-[#3a3a3a]";
};

  if (loading) {
    return (
    <div className="h-screen flex items-center justify-center text-gray-500">
    🍽️ Loading your orders...
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <h1 className="text-white mb-2">My Orders 🛍️</h1>
        <p className="text-white/90">Track your delicious journey</p>
      </div>

      {/* EMPTY */}
      {orders.length === 0 && <NoOrders onBrowse={() => {}} />}

      {/* LIST */}
      <div className="px-6 mt-6 space-y-4">
        {orders.map((order: any, index) => {

          const StatusIcon = getStatusIcon(order.status);
          const statusColor = getStatusColor(order.status);

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden"
            >

              {/* STATUS */}
              <div className={`bg-gradient-to-r ${statusColor} px-4 py-2 flex justify-between`}>
                <div className="flex items-center gap-2 text-white">
                  <StatusIcon className="w-4 h-4" />
                  <span className="text-sm">
                  {getStatusLabel(order.status)}
                 </span>
                </div>
                <span className="text-white text-xs">
              #{order.id.slice(0, 8)}
               </span>
              </div>

              {/* CONTENT */}
              <div className="p-4">

                {/* ITEMS */}
                <p className="text-[#171717] mb-2">
                  {order.items?.map((item: any, i: number) => (
                    <span key={i}>
                      {item.name} x{item.quantity}
                      {i < order.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>

                {/* STATUS */}
  <div className="flex items-center gap-2 text-sm text-gray-500">
  <Clock className="w-4 h-4" />

  <span>
    {order.status === "pending" && "Order received"}
    {order.status === "accepted" && "Order accepted by chef"}
    {order.status === "preparing" && "Chef is preparing your food"}
    {order.status === "ready" &&
   "Your food is ready and waiting for pickup"}
    {order.status === "out_for_delivery" &&
  "Delivery partner is bringing your order"}
    {order.status === "delivered" && "Delivered successfully"}
  </span>
</div>



{/* ORDER PROGRESS */}
<div className="mt-3 text-xs text-gray-600">
  {order.status === "pending" &&
    "✓ Order Received → ○ Accepted → ○ Preparing → ○ Delivery"}

  {order.status === "accepted" &&
    "✓ Order Received → ✓ Accepted → ○ Preparing → ○ Delivery"}

  {order.status === "preparing" &&
    "✓ Order Received → ✓ Accepted → ✓ Preparing → ○ Delivery"}

  {order.status === "ready" &&
    "✓ Order Received → ✓ Accepted → ✓ Preparing → ⏳ Waiting Pickup"}

  {order.status === "out_for_delivery" &&
    "✓ Order Received → ✓ Accepted → ✓ Preparing → 🚚 On The Way"}

  {order.status === "delivered" &&
    "✓ Order Received → ✓ Accepted → ✓ Preparing → ✓ Delivered"}
</div>
{order.status === "delivered" && (
  <div className="mt-3 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm font-medium">
    🎉 Your order has been delivered successfully
  </div>
)}

<div className="text-xs text-gray-400 mt-2">
  {order.created_at
    ? new Date(order.created_at).toLocaleString()
    : "Recently ordered"}
</div>

                {/* PRICE */}
                <div className="flex justify-between mt-4">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-[#FF7A30]">₹{order.total_price}</span>
                </div>

                {/* ACTION */}
                {/* ACTION */}
<button
  onClick={() => onNavigateToTracking?.(order.id)}
  className={`mt-4 w-full py-3 rounded-xl text-white font-medium ${
    order.status === "delivered"
      ? "bg-green-600"
      : "bg-[#FF7A30]"
  }`}
>
  {order.status === "delivered"
  ? "View Order Details"
  : "Track Order"}
</button>

              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}