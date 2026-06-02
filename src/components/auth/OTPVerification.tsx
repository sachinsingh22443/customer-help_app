import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface OTPVerificationProps {
  onBack: () => void;
  onSuccess: (phone: string) => void;
  value: string; // phone
}

export function OTPVerification({ onBack, onSuccess, value }: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const BASE_URL = "https://chef-backend-qh12.onrender.com";

  // ⏱ Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔢 OTP input
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ================= VERIFY OTP =================
  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      alert("Enter full OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: value,
          otp: finalOtp,
          new_password: "temp1234" // ⚠️ temp (next screen me change karna hai)
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("OTP verified");
        onSuccess(value);
      } else {
        alert(data.detail || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESEND OTP =================
  const handleResend = async () => {
    try {
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      await fetch(`${BASE_URL}/auth/forgot-password?phone=${value}`, {
        method: "POST",
      });

      alert("OTP resent");
    } catch {
      alert("Failed to resend OTP");
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
        <span className="text-4xl">📱</span>
      </motion.div>

      <button
        onClick={onBack}
        className="absolute top-12 left-6 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center z-20"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      <div className="flex-1 flex flex-col pt-44 px-6 relative z-10">
        <motion.div className="bg-white rounded-3xl p-8">

          <h2 className="mb-2">Verification Code</h2>
          <p className="mb-8 text-[#171717]/60">
            Code sent to <span className="text-[#FF7A30]">{value}</span>
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-between px-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-[14%] aspect-square text-center rounded-lg border"
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            {timer > 0 ? (
              <p>Expires in {timer}s</p>
            ) : (
              <button onClick={handleResend}>Resend OTP</button>
            )}
          </div>

          {/* Verify */}
          <motion.button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-orange-500 text-white py-4 rounded-xl disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </motion.button>

        </motion.div>
      </div>
    </div>
  );
}