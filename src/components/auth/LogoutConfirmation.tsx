import { motion } from "motion/react";
import { LogOut, X } from "lucide-react";

interface LogoutConfirmationProps {
  userRole?: "customer" | "chef" | "admin";
  onConfirm?: () => void;
  onCancel?: () => void;
  onBack: () => void;
}

export function LogoutConfirmation({
  userRole = "customer",
  onConfirm,
  onCancel,
  onBack,
}: LogoutConfirmationProps) {

  const BASE_URL = "https://chef-backend-1.onrender.com";

  const roleMessages = {
    customer: {
      title: "Logout from EatUnity?",
      message: "You'll need to log in again to track orders and access your account.",
      emoji: "👋"
    },
    chef: {
      title: "Logout from Chef Panel?",
      message: "Make sure all orders are completed before logging out. You won't receive order notifications while logged out.",
      emoji: "👨‍🍳"
    },
    admin: {
      title: "Logout from Admin Panel?",
      message: "Logging out will stop all admin monitoring and controls.",
      emoji: "🛡️"
    }
  };

  const roleInfo = roleMessages[userRole];

  // 🔥 MAIN LOGOUT LOGIC
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // 🔥 OPTIONAL: backend logout call
      try {
        await fetch(`${BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {
        // ignore backend logout error
      }

      // 🔥 CLEAR EVERYTHING
      localStorage.clear();
      sessionStorage.clear();

      // 🔥 CALLBACK
      if (onConfirm) {
        onConfirm();
      } else {
        window.location.href = "/"; // fallback
      }

    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#171717]/50 backdrop-blur-sm z-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl p-8 neo-shadow-lg max-w-sm w-full"
      >
        <div className="w-16 h-16 bg-[#FFF8F0] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">{roleInfo.emoji}</span>
        </div>

        <h2 className="text-[#171717] text-center mb-3">{roleInfo.title}</h2>
        <p className="text-[#171717]/60 text-center mb-8">
          {roleInfo.message}
        </p>

        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full py-4 bg-[#FF7A30] text-white rounded-2xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Yes, Logout
          </button>

          <button
            onClick={onCancel}
            className="w-full py-4 bg-[#171717] text-white rounded-2xl neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>

          <button
            onClick={onBack}
            className="w-full py-4 bg-[#171717] text-white rounded-2xl neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}