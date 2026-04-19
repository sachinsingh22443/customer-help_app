import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface OTPVerificationProps {
  onBack: () => void;
  onVerify: (otp: string) => void;
  method: "phone" | "email";
  value: string;
}

export function OTPVerification({ onBack, onVerify, method, value }: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto verify when all filled
    if (newOtp.every(digit => digit !== "") && index === 5) {
      setTimeout(() => onVerify(newOtp.join("")), 300);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(60);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
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
        <span className="text-4xl">📱</span>
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
          <h2 className="text-[#171717] mb-2">Verification Code</h2>
          <p className="text-[#171717]/60 mb-8">
            We sent a code to {method === "phone" ? "your phone" : "your email"}{" "}
            <span className="text-[#FF7A30]">{value}</span>
          </p>

          {/* OTP Input */}
          <div className="flex justify-between px-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-[14%] aspect-square text-center text-sm rounded-lg border-2 border-[#171717]/10 focus:border-[#FF7A30] outline-none bg-[#FFF8F0]"
              />
            ))}
          </div>

          {/* Timer and resend */}
          <div className="flex justify-center gap-2 mb-8">
            <p className="text-sm text-[#171717]/60">
              {timer > 0 ? (
                <>Code expires in <span className="text-[#FF7A30]">{timer}s</span></>
              ) : (
                "Code expired"
              )}
            </p>
            {timer === 0 && (
              <button
                onClick={handleResend}
                className="text-sm text-[#FF7A30] font-medium"
              >
                Resend Code
              </button>
            )}
          </div>

          {/* Verify button */}
          <motion.button
            onClick={() => onVerify(otp.join(""))}
            disabled={otp.some(digit => digit === "")}
            className="w-full bg-gradient-to-r from-[#FF7A30] to-[#ff9d5c] text-white py-4 rounded-xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.98 }}
          >
            Verify Code
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
