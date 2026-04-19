import { motion } from "motion/react";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface ResetPasswordProps {
  onBack: () => void;
  phone: string; // 🔥 ADD THIS (important)
  onResetSuccess: () => void; // 🔥 success ke baad redirect
}

export function ResetPassword({ onBack, phone, onResetSuccess }: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://chef-backend-1.onrender.com";

  const handleSubmit = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/auth/forgot-password/reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phone,
            new_password: newPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Password reset successful");

        // 🔥 redirect to login
        onResetSuccess();
      } else {
        alert(data.detail || "Reset failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = confirmPassword && newPassword === confirmPassword;
  const passwordsDontMatch = confirmPassword && newPassword !== confirmPassword;

  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] rounded-b-[3rem]" />
      
      <motion.div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-3xl flex items-center justify-center neo-shadow-sm"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <span className="text-4xl">🔑</span>
      </motion.div>

      <button
        onClick={onBack}
        className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center z-20"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      <div className="flex-1 flex flex-col pt-44 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 neo-shadow-lg"
        >
          <h2 className="text-[#171717] mb-2">Reset Password</h2>
          <p className="text-[#171717]/60 mb-6">
            Create a new password for your account. Make sure it's strong!
          </p>

          {/* New password */}
          <div className="mb-4">
            <label className="block text-sm text-[#171717]/70 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#171717]/40" />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-[#171717]/10 focus:border-[#FF7A30] outline-none transition-colors bg-[#FFF8F0]"
              />
              <button
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#171717]/40"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {newPassword && newPassword.length < 6 && (
              <p className="text-xs text-[#FF7A30] mt-2">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="mb-6">
            <label className="block text-sm text-[#171717]/70 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#171717]/40" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 outline-none transition-colors bg-[#FFF8F0] ${
                  passwordsDontMatch
                    ? "border-[#FF7A30]"
                    : passwordsMatch
                    ? "border-[#0FAD6E]"
                    : "border-[#171717]/10 focus:border-[#FF7A30]"
                }`}
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#171717]/40"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {passwordsDontMatch && (
              <p className="text-xs text-[#FF7A30] mt-2">
                Passwords don't match
              </p>
            )}
            {passwordsMatch && (
              <p className="text-xs text-[#0FAD6E] mt-2">
                Passwords match ✓
              </p>
            )}
          </div>

          {/* Submit */}
          <motion.button
            onClick={handleSubmit}
            disabled={!passwordsMatch || newPassword.length < 6 || loading}
            className="w-full bg-gradient-to-r from-[#FF7A30] to-[#ff9d5c] text-white py-4 rounded-xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Updating..." : "Reset Password"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}