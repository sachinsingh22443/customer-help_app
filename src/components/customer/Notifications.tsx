import { motion } from "motion/react";
import {
  ArrowLeft,
  Package,
  Tag,
  Star,
  Gift,
  TrendingUp,
  CheckCircle,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";

interface NotificationsProps {
  onBack: () => void;
}

const BASE_URL = "https://chef-backend-qh12.onrender.com";

export function Notifications({ onBack }: NotificationsProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/notifications/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      console.log("Notification error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchNotifications();

  const interval = setInterval(() => {
    fetchNotifications();
  }, 10000);

  return () => clearInterval(interval);
}, []);

  // ✅ MARK ALL READ (FIXED)
  const markAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("MARK ALL TOKEN:", token);

      await fetch(`${BASE_URL}/notifications/mark-all-read`, {
        method: "PUT", // 🔥 FIX
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // UI update
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, unread: false }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getIcon = (type: string) => {
  switch (type) {
    case "order":
      return Package;

    case "payment":
      return CheckCircle;

    case "delivery":
      return Truck;

    case "offer":
      return Tag;

    case "review":
      return Star;

    case "reward":
      return Gift;

    default:
      return TrendingUp;
  }
};

const markRead = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    console.log("MARK READ TOKEN:", token);

    await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, unread: false } : n
      )
    );
  } catch (err) {
    console.log(err);
  }
};

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
  <div className="min-h-screen bg-[#F7F6F3] pb-8">

    {/* =====================================================
        PREMIUM HEADER
    ===================================================== */}

    <div className="relative overflow-hidden rounded-b-[2.8rem] bg-gradient-to-br from-[#24104D] via-[#5F2EEA] to-[#FF7A30] px-5 pb-9 pt-7">

      {/* Background glow */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-orange-300/15 blur-3xl" />

      <div className="relative">

        {/* TOP BAR */}

        <div className="flex items-center justify-between">

          <motion.button
            onClick={onBack}
            whileTap={{ scale: 0.9 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white backdrop-blur-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>


          <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md">

            <div className="flex items-center gap-1.5">

              <span className="text-sm">
                🔔
              </span>

              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white">
                Updates
              </span>

            </div>

          </div>

        </div>


        {/* HEADER CONTENT */}

        <div className="mt-8">

          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/50">
            Stay informed
          </p>


          <div className="mt-2 flex items-end justify-between">

            <div>

              <h1 className="text-[31px] font-bold tracking-tight text-white">
                Notifications
              </h1>

              <p className="mt-2 text-xs leading-5 text-white/65">
                Everything important, all in one place.
              </p>

            </div>


            {/* UNREAD COUNT */}

            {unreadCount > 0 && (

              <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md">

                <span className="text-xl font-bold text-white">
                  {unreadCount}
                </span>

                <span className="text-[7px] font-bold uppercase tracking-wider text-white/50">
                  Unread
                </span>

              </div>

            )}

          </div>


          {/* HEADER ACTION */}

          {unreadCount > 0 && (

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={markAllRead}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 py-3 backdrop-blur-md transition"
            >

              <CheckCircle className="h-4 w-4 text-white" />

              <span className="text-[10px] font-bold text-white">
                Mark all notifications as read
              </span>

            </motion.button>

          )}

        </div>

      </div>

    </div>


    {/* =====================================================
        CONTENT
    ===================================================== */}

    <div className="px-5 pt-6">


      {/* ===================================================
          LOADING
      =================================================== */}

      {loading && (

        <div className="space-y-4">

          {[1, 2, 3].map((item) => (

            <div
              key={item}
              className="rounded-[1.8rem] bg-white p-4 shadow-sm"
            >

              <div className="flex gap-4">

                <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-200" />

                <div className="flex-1 space-y-3">

                  <div className="h-3.5 w-2/3 animate-pulse rounded bg-slate-200" />

                  <div className="h-3 w-full animate-pulse rounded bg-slate-100" />

                  <div className="h-2.5 w-1/3 animate-pulse rounded bg-slate-100" />

                </div>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* ===================================================
          EMPTY STATE
      =================================================== */}

      {!loading && notifications.length === 0 && (

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="rounded-[2.2rem] bg-white px-6 py-12 text-center shadow-sm"
        >

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-orange-50 to-purple-50">

            <span className="text-5xl">
              🔔
            </span>

          </div>


          <div className="mx-auto mt-5 w-fit rounded-full bg-slate-50 px-3 py-1.5">

            <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
              All caught up
            </span>

          </div>


          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Nothing new
          </h2>


          <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-slate-500">
            We'll let you know about your orders,
            offers, rewards and important updates here.
          </p>

        </motion.div>

      )}


      {/* ===================================================
          NOTIFICATION LIST
      =================================================== */}

      {!loading && notifications.length > 0 && (

        <div className="space-y-4">


          {/* SECTION TITLE */}

          <div className="flex items-center justify-between px-1">

            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Your activity
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Recent Updates
              </h2>

            </div>


            <div className="rounded-full bg-slate-100 px-3 py-1.5">

              <span className="text-[8px] font-bold text-slate-500">
                {notifications.length}{" "}
                {notifications.length === 1
                  ? "UPDATE"
                  : "UPDATES"}
              </span>

            </div>

          </div>


          {notifications.map(
            (notification, idx) => {

              const Icon =
                getIcon(notification.type);

              const isUnread =
                notification.unread;


              /* TYPE STYLE */

              const typeStyles: Record<
                string,
                {
                  bg: string;
                  iconBg: string;
                  icon: string;
                  label: string;
                }
              > = {

                order: {
                  bg: "from-orange-50 to-orange-100/50",
                  iconBg: "bg-orange-500",
                  icon: "text-white",
                  label: "Order",
                },

                payment: {
                  bg: "from-emerald-50 to-green-100/50",
                  iconBg: "bg-emerald-500",
                  icon: "text-white",
                  label: "Payment",
                },

                delivery: {
                  bg: "from-blue-50 to-cyan-100/50",
                  iconBg: "bg-blue-500",
                  icon: "text-white",
                  label: "Delivery",
                },

                offer: {
                  bg: "from-purple-50 to-violet-100/50",
                  iconBg: "bg-purple-500",
                  icon: "text-white",
                  label: "Offer",
                },

                review: {
                  bg: "from-yellow-50 to-amber-100/50",
                  iconBg: "bg-yellow-500",
                  icon: "text-white",
                  label: "Review",
                },

                reward: {
                  bg: "from-pink-50 to-rose-100/50",
                  iconBg: "bg-pink-500",
                  icon: "text-white",
                  label: "Reward",
                },

              };


              const style =
                typeStyles[
                  notification.type
                ] ||
                {
                  bg:
                    "from-slate-50 to-slate-100",
                  iconBg:
                    "bg-slate-600",
                  icon: "text-white",
                  label: "Update",
                };


              return (

                <motion.div
                  key={notification.id}

                  initial={{
                    opacity: 0,
                    y: 25,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay: idx * 0.06,
                    duration: 0.35,
                  }}

                  whileTap={{
                    scale: 0.99,
                  }}

                  onClick={() => {

                    if (isUnread) {
                      markRead(
                        notification.id
                      );
                    }

                  }}

                  className={`relative overflow-hidden rounded-[1.8rem] border bg-white shadow-[0_10px_30px_rgba(30,20,70,0.06)] transition ${
                    isUnread
                      ? "border-orange-200"
                      : "border-white"
                  }`}
                >


                  {/* UNREAD ACCENT */}

                  {isUnread && (

                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#FF7A30] to-[#5F2EEA]" />

                  )}


                  <div className="p-4">


                    {/* TOP */}

                    <div className="flex items-start gap-3">


                      {/* ICON */}

                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${style.bg}`}
                      >

                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-sm ${style.iconBg}`}
                        >

                          <Icon
                            className={`h-4.5 w-4.5 ${style.icon}`}
                          />

                        </div>

                      </div>


                      {/* CONTENT */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-2">

                          <div className="min-w-0">

                            <div className="flex items-center gap-2">

                              <span className="rounded-full bg-slate-100 px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-slate-500">
                                {style.label}
                              </span>


                              {isUnread && (

                                <span className="flex items-center gap-1 text-[7px] font-bold uppercase tracking-wider text-orange-500">

                                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />

                                  New

                                </span>

                              )}

                            </div>


                            <h3 className="mt-2 text-sm font-bold leading-5 text-slate-900">
                              {notification.title}
                            </h3>

                          </div>

                        </div>


                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          {notification.message}
                        </p>


                        <div className="mt-3 flex items-center justify-between">

                          <p className="text-[8px] font-medium text-slate-400">
                            {notification.time}
                          </p>


                          {isUnread && (

                            <span className="text-[8px] font-semibold text-orange-500">
                              Tap to mark read
                            </span>

                          )}

                        </div>

                      </div>

                    </div>


                    {/* UNREAD FOOTER */}

                    {isUnread && (

                      <div className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-50 to-purple-50 px-3 py-2.5">

                        <span className="text-[10px]">
                          ✨
                        </span>

                        <span className="text-[8px] font-semibold text-slate-500">
                          You have a new update waiting
                        </span>

                      </div>

                    )}

                  </div>

                </motion.div>

              );

            }
          )}

        </div>

      )}


      {/* ===================================================
          BOTTOM TRUST MESSAGE
      =================================================== */}

      {!loading &&
        notifications.length > 0 && (

          <div className="mt-6 flex items-center justify-center gap-2">

            <span className="text-[10px]">
              🔔
            </span>

            <span className="text-[8px] font-medium text-slate-400">
              Notifications refresh automatically
            </span>

          </div>

        )}

    </div>

  </div>
);
}