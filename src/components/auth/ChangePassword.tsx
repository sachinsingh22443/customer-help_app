import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react";

interface ChangePasswordProps {
  onBack: () => void;
  onPasswordChanged: () => void;
}

export function ChangePassword({ onBack, onPasswordChanged }: ChangePasswordProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://chef-backend-qh12.onrender.com";

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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password changed successfully");

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

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 py-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4">
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
        <motion.form onSubmit={handleSubmit} className="space-y-6">

          {/* CURRENT */}
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full py-4 px-5 pr-12 rounded-xl border"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showCurrent ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* NEW */}
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full py-4 px-5 pr-12 rounded-xl border"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showNew ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* REQUIREMENTS */}
          <div className="text-sm space-y-1">
            {passwordRequirements.map((req, i) => (
              <div key={i} className={`flex items-center gap-2 ${req.met ? "text-green-600" : "text-gray-400"}`}>
                <Check className="w-4 h-4" />
                {req.label}
              </div>
            ))}
          </div>

          {/* CONFIRM */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full py-4 px-5 pr-12 rounded-xl border"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showConfirm ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-orange-500 text-white rounded-xl disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

        </motion.form>
      </div>
    </div>
  );
}