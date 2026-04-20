import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface OTPVerificationProps {
  onBack: () => void;
  onSuccess: (phone: string) => void; // 🔥 next step (reset password)
  value: string; // phone number
}

export function OTPVerification({ onBack, onSuccess, value }: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const BASE_URL = "https://chef-backend-1.onrender.com";

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      alert("Enter full OTP");
      return;
    }

    try {
      // 🔥 Firebase verify
      const result = await (window as any).confirmationResult.confirm(finalOtp);
      const user = result.user;

      const token = await user.getIdToken();

      // 🔥 backend verify (forgot password)
      const res = await fetch(`${BASE_URL}/auth/forgot-password/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("OTP verified");
        onSuccess(value); // 👉 go to reset password
      } else {
        alert(data.detail || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      alert("Invalid OTP");
    }
  };

  const handleResend = () => {
    setTimer(60);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    alert("Resend OTP from previous screen");
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
        <motion.div
          className="bg-white rounded-3xl p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
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
            className="w-full bg-orange-500 text-white py-4 rounded-xl"
          >
            Verify OTP
          </motion.button>

        </motion.div>
      </div>
    </div>
  );
}