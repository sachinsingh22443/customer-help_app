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

        const res = await fetch("https://chef-backend-1.onrender.com/orders/", {
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
  }, []);

  const getStatusIcon = (status: string) => {
    if (status === "delivering") return Truck;
    if (status === "completed") return CheckCircle;
    return Package;
  };

  const getStatusColor = (status: string) => {
    if (status === "delivering") return "from-[#FF7A30] to-[#ff9d5c]";
    if (status === "completed") return "from-[#0FAD6E] to-[#3ec98d]";
    return "from-[#171717] to-[#3a3a3a]";
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading orders...
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
                  <span className="text-sm capitalize">{order.status}</span>
                </div>
                <span className="text-white text-xs">#{order.id}</span>
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
                {order.status === "delivering" && (
                  <div className="flex items-center gap-2 text-sm text-[#FF7A30]">
                    <Clock className="w-4 h-4" />
                    <span>On the way</span>
                  </div>
                )}

                {/* PRICE */}
                <div className="flex justify-between mt-4">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-[#FF7A30]">₹{order.total_price}</span>
                </div>

                {/* ACTION */}
                {order.status === "delivering" && (
                  <button
                    onClick={() => onNavigateToTracking?.(order.id)}
                    className="mt-4 w-full bg-[#FF7A30] text-white py-3 rounded-xl"
                  >
                    Track Order
                  </button>
                )}

              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}