import { motion } from "motion/react";
import { Smartphone, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface ForgotPasswordProps {
  onBack: () => void;
  onContinue: (phone: string) => void;
}

export function ForgotPassword({ onBack, onContinue }: ForgotPasswordProps) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://chef-backend-qh12.onrender.com";

  const handleSubmit = async () => {
    if (!phone) {
      alert("Enter phone number");
      return;
    }

    if (phone.length !== 10) {
      alert("Enter valid 10 digit number");
      return;
    }

    try {
      setLoading(true);

      // 🔥 MSG91 BACKEND CALL
      const res = await fetch(
  `${BASE_URL}/auth/customer/forgot-password`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone,
    }),
  }
);

      const data = await res.json();

      if (res.ok) {
  alert("OTP sent successfully");
  onContinue(phone);
} else {
  alert(
    typeof data.detail === "string"
      ? data.detail
      : JSON.stringify(data.detail)
  );
}
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] rounded-b-[3rem]" />

      <motion.div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-3xl flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <span className="text-4xl">🔐</span>
      </motion.div>

      <button
        onClick={onBack}
        className="absolute top-12 left-6 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center z-20"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      <div className="flex-1 flex flex-col pt-44 px-6 relative z-10">
        <motion.div className="bg-white rounded-3xl p-8">

          <h2 className="mb-2">Forgot Password?</h2>
          <p className="mb-6 text-[#171717]/60">
            Enter your phone number to reset password
          </p>

          {/* PHONE */}
          <div className="mb-6">
            <label className="block mb-2">Phone Number</label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) =>
  setPhone(
    e.target.value
      .replace(/\D/g, "")
      .slice(0, 10)
  )
}
                className="w-full pl-12 py-4 rounded-xl border"
              />
            </div>
          </div>

          {/* BUTTON */}
          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-orange-500 text-white py-4 rounded-xl disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </motion.button>

          <div className="mt-6 text-center">
            <button onClick={onBack} className="text-sm text-[#FF7A30]">
              Back to Login
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}