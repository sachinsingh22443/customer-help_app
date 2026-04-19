import { motion } from "motion/react";
import { ArrowLeft, Package, Tag, Star, Gift, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface NotificationsProps {
  onBack: () => void;
}

const BASE_URL = "https://chef-backend-1.onrender.com";

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
  }, []);

  // ✅ MARK ALL READ (FIXED)
  const markAllRead = async () => {
    try {
      const token = localStorage.getItem("token");

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

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-6">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onBack}
              className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.button>

            <div>
              <h1 className="text-white">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-white/80 text-sm">{unreadCount} unread</p>
              )}
            </div>
          </div>

          <button onClick={markAllRead} className="text-white text-sm">
            Mark all read
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 -mt-4 space-y-3">

        {loading && <p>Loading...</p>}

        {!loading && notifications.length === 0 && (
          <p className="text-center text-[#171717]/60">No notifications</p>
        )}

        {notifications.map((notification, idx) => {
          const Icon = getIcon(notification.type);

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white rounded-2xl p-4 relative ${
                notification.unread ? "border-2 border-[#FF7A30]/20" : ""
              }`}
            >
              {notification.unread && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-[#FF7A30] rounded-full" />
              )}

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A30] to-[#5F2EEA] rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="text-[#171717] text-sm mb-1">
                    {notification.title}
                  </h3>

                  <p className="text-sm text-[#171717]/60 mb-2">
                    {notification.message}
                  </p>

                  <p className="text-xs text-[#171717]/40">
                    {notification.time}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}