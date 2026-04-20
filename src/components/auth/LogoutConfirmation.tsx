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

  const BASE_URL = "https://chef-backend-1.onrender.com"; // ✅ FIX

  const roleMessages = {
    customer: {
      title: "Logout from EatUnity?",
      message: "You'll need to log in again to access your account.",
      emoji: "👋"
    },
    chef: {
      title: "Logout from Chef Panel?",
      message: "You won't receive orders while logged out.",
      emoji: "👨‍🍳"
    },
    admin: {
      title: "Logout from Admin Panel?",
      message: "Admin controls will be disabled.",
      emoji: "🛡️"
    }
  };

  const roleInfo = roleMessages[userRole];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // 🔥 OPTIONAL backend logout
      if (token) {
        try {
          await fetch(`${BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch {
          // ignore error
        }
      }

      // 🔥 CLEAR STORAGE
      localStorage.clear();
      sessionStorage.clear();

      // 🔥 redirect / callback
      if (onConfirm) {
        onConfirm();
      } else {
        window.location.href = "/";
      }

    } catch (err) {
      console.error("Logout error:", err);
      alert("Logout failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#171717]/50 backdrop-blur-sm z-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full"
      >
        <div className="w-16 h-16 bg-[#FFF8F0] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">{roleInfo.emoji}</span>
        </div>

        <h2 className="text-center mb-3">{roleInfo.title}</h2>
        <p className="text-center mb-8 text-gray-500">
          {roleInfo.message}
        </p>

        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full py-4 bg-orange-500 text-white rounded-xl flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Yes, Logout
          </button>

          <button
            onClick={onCancel}
            className="w-full py-4 bg-gray-800 text-white rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={onBack}
            className="w-full py-4 border rounded-xl"
          >
            Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}