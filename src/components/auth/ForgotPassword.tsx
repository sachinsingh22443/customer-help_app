import { motion } from "motion/react";
import { Mail, Smartphone, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface ForgotPasswordProps {
  onBack: () => void;
  onContinue: (method: "phone" | "email", value: string) => void;
}

export function ForgotPassword({ onBack, onContinue }: ForgotPasswordProps) {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://chef-backend-1.onrender.com";

  const handleSubmit = async () => {
    if (!value) {
      alert(method === "phone" ? "Enter phone number" : "Enter email");
      return;
    }

    try {
      setLoading(true);

      // 🔥 ONLY PHONE API (email future ke liye)
      if (method === "phone") {
        const res = await fetch(
          `${BASE_URL}/auth/forgot-password/send-otp`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone: value }),
          }
        );

        const data = await res.json();

        if (res.ok) {
          alert("OTP sent successfully");

          // 👉 NEXT SCREEN (OTP VERIFY)
          onContinue(method, value);
        } else {
          alert(data.detail || "Failed to send OTP");
        }
      } else {
        alert("Email reset coming soon");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] rounded-b-[3rem]" />
      
      <motion.div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-3xl flex items-center justify-center neo-shadow-sm"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <span className="text-4xl">🔐</span>
      </motion.div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center z-20"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      {/* Content */}
      <div className="flex-1 flex flex-col pt-44 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 neo-shadow-lg"
        >
          <h2 className="text-[#171717] mb-2">Forgot Password?</h2>
          <p className="text-[#171717]/60 mb-6">
            Don't worry! Enter your details and we'll send you a code to reset your password.
          </p>

          {/* Method selector */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMethod("phone")}
              className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                method === "phone"
                  ? "border-[#FF7A30] bg-[#FF7A30]/5"
                  : "border-[#171717]/10"
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span>Phone</span>
            </button>
            <button
              onClick={() => setMethod("email")}
              className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                method === "email"
                  ? "border-[#FF7A30] bg-[#FF7A30]/5"
                  : "border-[#171717]/10"
              }`}
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </button>
          </div>

          {/* Input */}
          <div className="mb-6">
            <label className="block text-sm text-[#171717]/70 mb-2">
              {method === "phone" ? "Phone Number" : "Email Address"}
            </label>
            <div className="relative">
              {method === "phone" ? (
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#171717]/40" />
              ) : (
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#171717]/40" />
              )}
              <input
                type={method === "phone" ? "tel" : "email"}
                placeholder={method === "phone" ? "+91 98765 43210" : "your@email.com"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-[#171717]/10 focus:border-[#FF7A30] outline-none transition-colors bg-[#FFF8F0]"
              />
            </div>
          </div>

          {/* Submit button */}
          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FF7A30] to-[#ff9d5c] text-white py-4 rounded-xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Sending..." : "Send Code"}
          </motion.button>

          {/* Back to login */}
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