import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Lock, Eye, EyeOff, Check } from "lucide-react";
import { auth } from "@/firebase";
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

  const BASE_URL = "https://chef-backend-1.onrender.com"; // ✅ FIX

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

      if (!token) {
        alert("Please login again");
        return;
      }

      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ important
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password changed successfully");

        // 🔥 logout
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

      <div className="sticky top-0 z-10 bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 py-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-white">Change Password</h2>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >

          {/* Current Password */}
          <input
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full py-4 px-5 rounded-xl border"
          />

          {/* New Password */}
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full py-4 px-5 rounded-xl border"
          />

          {/* Confirm Password */}
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full py-4 px-5 rounded-xl border"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-orange-500 text-white rounded-xl"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

        </motion.form>
      </div>
    </div>
  );
}