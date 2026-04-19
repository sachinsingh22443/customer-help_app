import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Lock, Eye, EyeOff, Check } from "lucide-react";

interface ChangePasswordProps {
  onBack: () => void;
  onPasswordChanged: () => void;
}

export function ChangePassword({ onBack, onPasswordChanged }: ChangePasswordProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://chef-backend-1.onrender.com";

  const passwordRequirements = [
    { label: "At least 8 characters", met: newPassword.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "One lowercase letter", met: /[a-z]/.test(newPassword) },
    { label: "One number", met: /[0-9]/.test(newPassword) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!passwordRequirements.every((req) => req.met)) {
      alert("Password not strong enough");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 important
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password changed successfully");

        // 🔥 logout user
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");

        onPasswordChanged();
      } else {
        alert(data.detail || "Failed to change password");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col overflow-y-auto pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 py-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-xl neo-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#171717]" />
          </button>
          <h2 className="text-white">Change Password</h2>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Current Password */}
          <div>
            <label className="block text-sm text-[#171717]/70 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full py-4 px-5 bg-white rounded-2xl border-2 border-[#171717]/10 focus:border-[#FF7A30] focus:outline-none transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5 text-[#171717]/40" />
                ) : (
                  <Eye className="w-5 h-5 text-[#171717]/40" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm text-[#171717]/70 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full py-4 px-5 bg-white rounded-2xl border-2 border-[#171717]/10 focus:border-[#FF7A30] focus:outline-none transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5 text-[#171717]/40" />
                ) : (
                  <Eye className="w-5 h-5 text-[#171717]/40" />
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          {newPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-white rounded-2xl p-4 neo-shadow-sm"
            >
              <p className="text-sm text-[#171717]/70 mb-3">Password Requirements:</p>
              <div className="space-y-2">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        req.met ? "bg-[#0FAD6E]" : "bg-[#171717]/10"
                      }`}
                    >
                      {req.met && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <p
                      className={`text-sm ${
                        req.met ? "text-[#0FAD6E]" : "text-[#171717]/50"
                      }`}
                    >
                      {req.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-[#171717]/70 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full py-4 px-5 bg-white rounded-2xl border-2 border-[#171717]/10 focus:border-[#FF7A30] focus:outline-none transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-[#171717]/40" />
                ) : (
                  <Eye className="w-5 h-5 text-[#171717]/40" />
                )}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-[#FF7A30] mt-2">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Info */}
          <div className="bg-[#FF7A30]/10 rounded-2xl p-4 flex items-start gap-3">
            <Lock className="w-5 h-5 text-[#FF7A30] mt-0.5" />
            <p className="text-sm text-[#171717]/70">
              After changing your password, you'll be logged out from all devices for security.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              loading ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword ||
              newPassword !== confirmPassword ||
              !passwordRequirements.every((req) => req.met)
            }
            className="w-full py-4 bg-[#FF7A30] text-white rounded-2xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}