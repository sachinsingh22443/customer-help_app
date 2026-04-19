import { motion } from "motion/react";
import { Bell, X } from "lucide-react";

interface NotificationPermissionProps {
  onAllow: () => void;
  onDeny: () => void;
}

export function NotificationPermission({ onAllow, onDeny }: NotificationPermissionProps) {
  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-[#FF7A30] to-[#5F2EEA] opacity-10 rounded-b-[3rem]" />

      <motion.div
        className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center neo-shadow-lg mb-6 relative"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <Bell className="w-12 h-12 text-[#FF7A30]" />
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF7A30] rounded-full"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <h2 className="text-[#171717] mb-3">Stay Updated</h2>
        <p className="text-[#171717]/60 mb-8">
          Enable notifications to get real-time updates about your orders, special offers, and more.
        </p>

        <div className="bg-white rounded-2xl p-6 neo-shadow-sm mb-6">
          <h3 className="text-[#171717] mb-3 text-left">You'll receive updates about:</h3>
          <ul className="space-y-2 text-left text-sm text-[#171717]/70">
            <li className="flex items-start gap-2">
              <span className="text-[#FF7A30] mt-1">🔔</span>
              <span>Order status and delivery updates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF7A30] mt-1">💰</span>
              <span>Exclusive deals and offers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF7A30] mt-1">⭐</span>
              <span>New dishes from your favorite chefs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF7A30] mt-1">📦</span>
              <span>Subscription reminders</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={onAllow}
            className="w-full py-4 bg-[#FF7A30] text-white rounded-2xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Bell className="w-5 h-5" />
            Enable Notifications
          </button>

          <button
            onClick={onDeny}
            className="w-full py-4 bg-white text-[#171717] rounded-2xl neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Not Now
          </button>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-[#171717]/40">
          You can change this anytime in settings
        </p>
      </motion.div>
    </div>
  );
}
