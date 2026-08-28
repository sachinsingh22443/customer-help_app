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
}, 30000);

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
  <div className="min-h-screen bg-[#F7F6F3] pb-28">

    {/* =====================================================
        PREMIUM HEADER
    ===================================================== */}

    <div className="relative overflow-hidden rounded-b-[2.8rem] bg-gradient-to-br from-[#24104D] via-[#5F2EEA] to-[#FF7A30] px-5 pb-9 pt-8">

      {/* Decorative glow */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 left-0 h-56 w-56 rounded-full bg-orange-300/15 blur-3xl" />

      <div className="relative">

        <div className="flex items-start justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Package className="h-4 w-4 text-orange-200" />

              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/60">
                Your journey
              </span>

            </div>

            <h1 className="mt-2 text-[30px] font-bold tracking-tight text-white">
              My Orders
            </h1>

            <p className="mt-1 text-xs text-white/65">
              Everything you ordered, all in one place.
            </p>

          </div>


          {/* ORDER COUNT */}

          <div className="flex h-14 min-w-[58px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md">

            <span className="text-lg font-bold text-white">
              {orders.length}
            </span>

            <span className="text-[8px] font-bold uppercase tracking-wider text-white/50">
              Orders
            </span>

          </div>

        </div>


        {/* LIVE STATUS */}

        {orders.length > 0 && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">

            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">

              <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-emerald-300 opacity-60" />

              <span className="relative h-2 w-2 rounded-full bg-emerald-300" />

            </div>

            <div className="flex-1">

              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/50">
                Live updates
              </p>

              <p className="mt-0.5 text-[10px] font-medium text-white">
                Your order status is updated automatically
              </p>

            </div>

            <Clock className="h-4 w-4 text-white/50" />

          </div>
        )}

      </div>

    </div>


    {/* =====================================================
        EMPTY STATE
    ===================================================== */}

    {orders.length === 0 && (
      <div className="px-5 pt-6">

        <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">

          <NoOrders
            onBrowse={() => {}}
          />

        </div>

      </div>
    )}


    {/* =====================================================
        ORDER LIST
    ===================================================== */}

    <div className="space-y-5 px-5 pt-6">

      {orders.map((order: any, index) => {

        const StatusIcon =
          getStatusIcon(order.status);

        const statusColor =
          getStatusColor(order.status);


        /* =================================================
           STATUS HELPERS
        ================================================= */

        const isDelivered =
          order.status === "delivered";

        const isPending =
          order.status === "pending";

        const isAccepted =
          order.status === "accepted";

        const isPreparing =
          order.status === "preparing";

        const isReady =
          order.status === "ready";

        const isDelivery =
          order.status === "out_for_delivery";


        return (
          <motion.div
            key={order.id}

            initial={{
              opacity: 0,
              y: 30,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: index * 0.08,
              duration: 0.4,
            }}

            className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_12px_35px_rgba(30,20,70,0.07)]"
          >

            {/* =================================================
                STATUS HEADER
            ================================================= */}

            <div
              className={`relative overflow-hidden bg-gradient-to-r ${statusColor} px-5 py-4`}
            >

              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/10 blur-xl" />


              <div className="relative flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">

                    <StatusIcon
                      className="h-5 w-5 text-white"
                    />

                  </div>

                  <div>

                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/60">
                      Current status
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-white">
                      {getStatusLabel(order.status)}
                    </p>

                  </div>

                </div>


                <div className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur-md">

                  <p className="text-[8px] font-bold uppercase tracking-wider text-white/50">
                    Order
                  </p>

                  <p className="mt-0.5 text-[10px] font-bold text-white">
                    #{order.id.slice(0, 8)}
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                ORDER CONTENT
            ================================================= */}

            <div className="p-5">


              {/* =================================================
                  ORDER ITEMS
              ================================================= */}

              <div className="flex items-start gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-purple-50">

                  <span className="text-2xl">
                    🍱
                  </span>

                </div>


                <div className="min-w-0 flex-1">

                  <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Your meal
                  </p>

                  <div className="mt-1 space-y-1">

                    {order.items?.map(
                      (item: any, i: number) => (

                        <p
                          key={i}
                          className="text-sm font-bold text-slate-800"
                        >

                          {item.name}

                          <span className="ml-1 text-xs font-semibold text-slate-400">
                            × {item.quantity}
                          </span>

                        </p>

                      )
                    )}

                  </div>

                </div>

              </div>


              {/* =================================================
                  STATUS MESSAGE
              ================================================= */}

              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">

                  {isDelivery ? (
                    <Truck className="h-4 w-4 text-orange-500" />
                  ) : isDelivered ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-[#5F2EEA]" />
                  )}

                </div>


                <div>

                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    What's happening
                  </p>

                  <p className="mt-1 text-[10px] font-medium leading-5 text-slate-600">

                    {isPending &&
                      "Your order has been received and is waiting for chef confirmation."}

                    {isAccepted &&
                      "The chef has accepted your order and will start preparing it soon."}

                    {isPreparing &&
                      "Your chef is currently preparing your fresh meal."}

                    {isReady &&
                      "Your food is ready and waiting for pickup."}

                    {isDelivery &&
                      "Your delivery partner is bringing your meal to you."}

                    {isDelivered &&
                      "Your meal has been delivered successfully. Enjoy! 🎉"}

                  </p>

                </div>

              </div>


              {/* =================================================
                  PREMIUM ORDER TIMELINE
              ================================================= */}

              <div className="mt-6">

                <div className="mb-4 flex items-center justify-between">

                  <div>

                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      Order journey
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-800">
                      Track every step
                    </p>

                  </div>

                  <MapPin className="h-4 w-4 text-[#5F2EEA]" />

                </div>


                <div className="relative">

                  {/* Vertical line */}

                  <div className="absolute left-[15px] top-3 h-[calc(100%-24px)] w-[2px] bg-slate-100" />


                  {/* RECEIVED */}

                  <div className="relative flex gap-3 pb-4">

                    <div
                      className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        !isPending
                          ? "bg-emerald-500"
                          : "bg-yellow-500"
                      }`}
                    >

                      <CheckCircle className="h-4 w-4 text-white" />

                    </div>

                    <div className="pt-1">

                      <p className="text-[10px] font-bold text-slate-800">
                        Order Received
                      </p>

                      <p className="mt-0.5 text-[8px] text-slate-400">
                        Your order is in our system
                      </p>

                    </div>

                  </div>


                  {/* ACCEPTED */}

                  <div className="relative flex gap-3 pb-4">

                    <div
                      className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isAccepted ||
                        isPreparing ||
                        isReady ||
                        isDelivery ||
                        isDelivered
                          ? "bg-emerald-500"
                          : "bg-slate-100"
                      }`}
                    >

                      <CheckCircle
                        className={`h-4 w-4 ${
                          isAccepted ||
                          isPreparing ||
                          isReady ||
                          isDelivery ||
                          isDelivered
                            ? "text-white"
                            : "text-slate-300"
                        }`}
                      />

                    </div>

                    <div className="pt-1">

                      <p
                        className={`text-[10px] font-bold ${
                          isAccepted ||
                          isPreparing ||
                          isReady ||
                          isDelivery ||
                          isDelivered
                            ? "text-slate-800"
                            : "text-slate-300"
                        }`}
                      >
                        Chef Accepted
                      </p>

                      <p className="mt-0.5 text-[8px] text-slate-400">
                        Chef confirmed your order
                      </p>

                    </div>

                  </div>


                  {/* PREPARING */}

                  <div className="relative flex gap-3 pb-4">

                    <div
                      className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isPreparing ||
                        isReady ||
                        isDelivery ||
                        isDelivered
                          ? "bg-[#5F2EEA]"
                          : "bg-slate-100"
                      }`}
                    >

                      <Package
                        className={`h-4 w-4 ${
                          isPreparing ||
                          isReady ||
                          isDelivery ||
                          isDelivered
                            ? "text-white"
                            : "text-slate-300"
                        }`}
                      />

                    </div>

                    <div className="pt-1">

                      <p
                        className={`text-[10px] font-bold ${
                          isPreparing ||
                          isReady ||
                          isDelivery ||
                          isDelivered
                            ? "text-slate-800"
                            : "text-slate-300"
                        }`}
                      >
                        Preparing
                      </p>

                      <p className="mt-0.5 text-[8px] text-slate-400">
                        Your meal is being prepared
                      </p>

                    </div>

                  </div>


                  {/* DELIVERY */}

                  <div className="relative flex gap-3">

                    <div
                      className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isReady ||
                        isDelivery ||
                        isDelivered
                          ? "bg-orange-500"
                          : "bg-slate-100"
                      }`}
                    >

                      {isDelivered ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <Truck
                          className={`h-4 w-4 ${
                            isReady ||
                            isDelivery
                              ? "text-white"
                              : "text-slate-300"
                          }`}
                        />
                      )}

                    </div>

                    <div className="pt-1">

                      <p
                        className={`text-[10px] font-bold ${
                          isReady ||
                          isDelivery ||
                          isDelivered
                            ? "text-slate-800"
                            : "text-slate-300"
                        }`}
                      >
                        {isDelivered
                          ? "Delivered"
                          : isDelivery
                          ? "On the Way"
                          : "Delivery"}
                      </p>

                      <p className="mt-0.5 text-[8px] text-slate-400">
                        {isDelivered
                          ? "Order completed successfully"
                          : "Your meal is heading to you"}
                      </p>

                    </div>

                  </div>

                </div>

              </div>


              {/* =================================================
                  DELIVERED SUCCESS
              ================================================= */}

              {isDelivered && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="mt-5 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">

                      <CheckCircle className="h-5 w-5 text-white" />

                    </div>

                    <div>

                      <p className="text-xs font-bold text-emerald-800">
                        Delivered successfully 🎉
                      </p>

                      <p className="mt-1 text-[9px] text-emerald-600">
                        Thank you for choosing Eat Unity.
                      </p>

                    </div>

                  </div>

                </motion.div>
              )}


              {/* =================================================
                  ORDER META
              ================================================= */}

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                <div>

                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Ordered on
                  </p>

                  <p className="mt-1 text-[9px] font-semibold text-slate-600">

                    {order.created_at
                      ? new Date(
                          order.created_at
                        ).toLocaleString()
                      : "Recently ordered"}

                  </p>

                </div>


                <div className="text-right">

                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Total
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#FF7A30]">
                    ₹{order.total_price}
                  </p>

                </div>

              </div>


              {/* =================================================
                  TRACK BUTTON
              ================================================= */}

              <button
                onClick={() =>
                  onNavigateToTracking?.(
                    order.id
                  )
                }
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-bold text-white shadow-lg transition active:scale-[0.98] ${
                  isDelivered
                    ? "bg-gradient-to-r from-[#0FAD6E] to-[#34D399]"
                    : "bg-gradient-to-r from-[#FF7A30] to-[#5F2EEA]"
                }`}
              >

                {isDelivered ? (
                  <>
                    <Package className="h-4 w-4" />

                    View Order Details
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />

                    Track Order

                    <Truck className="h-4 w-4" />
                  </>
                )}

              </button>

            </div>

          </motion.div>
        );

      })}

    </div>


    {/* =====================================================
        BOTTOM TRUST MESSAGE
    ===================================================== */}

    {orders.length > 0 && (
      <div className="px-5 pt-7">

        <div className="rounded-[1.8rem] border border-slate-100 bg-white p-5 text-center shadow-sm">

          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">

            <Package className="h-5 w-5 text-[#5F2EEA]" />

          </div>

          <p className="mt-3 text-xs font-bold text-slate-800">
            Fresh food. Clear tracking.
          </p>

          <p className="mx-auto mt-1 max-w-xs text-[9px] leading-5 text-slate-400">
            We'll keep your order status updated automatically
            while your meal makes its way to you.
          </p>

        </div>

      </div>
    )}

  </div>
);
}