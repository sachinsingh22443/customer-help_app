import { motion } from "motion/react";
import { Mail, Smartphone, ArrowLeft } from "lucide-react";
import { useState } from "react";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/firebase";

interface ForgotPasswordProps {
  onBack: () => void;
  onContinue: (phone: string) => void; // 🔥 simplified
}

export function ForgotPassword({ onBack, onContinue }: ForgotPasswordProps) {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!value) {
      alert("Enter phone number");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Firebase OTP send
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );

      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${value}`,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmation;

      alert("OTP sent successfully");

      // 👉 next screen (OTP verify screen)
      onContinue(value);
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
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
        <motion.div
          className="bg-white rounded-3xl p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="mb-2">Forgot Password?</h2>
          <p className="mb-6 text-[#171717]/60">
            Enter your phone number to reset password
          </p>

          {/* Method (email future ke liye) */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMethod("phone")}
              className="flex-1 py-3 rounded-xl border bg-[#FF7A30]/5"
            >
              Phone
            </button>
            <button
              onClick={() => alert("Email coming soon")}
              className="flex-1 py-3 rounded-xl border"
            >
              Email
            </button>
          </div>

          {/* Input */}
          <div className="mb-6">
            <label className="block mb-2">Phone Number</label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
              <input
                type="tel"
                placeholder="9876543210"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full pl-12 py-4 rounded-xl border"
              />
            </div>
          </div>

          {/* Button */}
          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-orange-500 text-white py-4 rounded-xl"
          >
            {loading ? "Sending..." : "Send OTP"}
          </motion.button>

          <div className="mt-6 text-center">
            <button onClick={onBack} className="text-sm text-[#FF7A30]">
              Back to Login
            </button>
          </div>

          {/* Firebase Recaptcha */}
          <div id="recaptcha-container"></div>

        </motion.div>
      </div>
    </div>
  );
}