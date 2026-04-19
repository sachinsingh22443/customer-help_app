import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ChevronLeft,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle,
  Clock,
  Package,
  Truck,
  Home,
} from "lucide-react";

interface OrderTrackingProps {
  orderId: string;
  onBack: () => void;
}

export function OrderTracking({ orderId, onBack }: OrderTrackingProps) {

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH ORDER
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `https://chef-backend-1.onrender.com/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setOrder(data);

      } catch (err) {
        console.error("Tracking error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // 🔥 AUTO REFRESH EVERY 5s
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);

  }, [orderId]);

  // 🔥 STATUS → STEP MAP
  const getStep = (status: string) => {
    if (status === "pending") return 1;
    if (status === "preparing") return 2;
    if (status === "delivering") return 3;
    if (status === "completed") return 4;
    return 1;
  };

  const currentStep = getStep(order?.status);

  const steps = [
    { id: 1, title: "Order Placed", icon: CheckCircle },
    { id: 2, title: "Preparing", icon: Package },
    { id: 3, title: "Out for Delivery", icon: Truck },
    { id: 4, title: "Delivered", icon: Home },
  ];

  if (loading) {
    return <div className="p-10 text-center">Loading tracking...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#FF7A30] to-[#5F2EEA] px-6 pt-12 pb-8 rounded-b-[2rem]">

        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ChevronLeft className="text-white" />
          </button>

          <div>
            <h2 className="text-white">Track Order</h2>
            <p className="text-white/80 text-sm">#{order.id}</p>
          </div>
        </div>

        <div className="mt-4 text-white">
          <p>Estimated: 20-30 min</p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="px-6 mt-6 space-y-4">
        {steps.map((step) => {
          const Icon = step.icon;
          const active = currentStep >= step.id;

          return (
            <div key={step.id} className="flex items-center gap-4">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  active ? "bg-green-500 text-white" : "bg-gray-200"
                }`}
              >
                <Icon />
              </div>

              <p className={active ? "text-black" : "text-gray-400"}>
                {step.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* DELIVERY */}
      <div className="px-6 mt-6">
        <div className="bg-white p-4 rounded-xl">

          <p className="mb-2">Delivery Partner</p>

          <p>{order.delivery_partner || "Assigning..."}</p>

          {order.phone && (
            <div className="flex gap-3 mt-2">
              <button className="p-2 bg-green-100 rounded">
                <Phone />
              </button>
              <button className="p-2 bg-orange-100 rounded">
                <MessageCircle />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ORDER */}
      <div className="px-6 mt-6">
        <div className="bg-white p-4 rounded-xl">

          <p className="mb-2">Items</p>

          <p>
            {order.items?.map((i: any) => `${i.name} x${i.quantity}`).join(", ")}
          </p>

          <p className="mt-2 text-gray-500">
            <MapPin className="inline w-4 h-4" /> {order.address}
          </p>

        </div>
      </div>

    </div>
  );
}