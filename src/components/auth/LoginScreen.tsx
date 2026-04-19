import { useState } from "react";
import { motion } from "motion/react";
import { Smartphone, Lock, Eye, EyeOff } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
  onForgotPassword?: () => void;
}

export function LoginScreen({ onLogin, onForgotPassword }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const BASE_URL = "https://chef-backend-1.onrender.com";

  // ✅ SEND OTP
  const handleSendOTP = async () => {
    if (!phone) {
      alert("Enter phone number");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "OTP sent");
        setShowOtpInput(true);
      } else {
        alert(data.detail || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  // ✅ SIGNUP
  const handleSignup = async () => {
    if (!otp || !password) {
      alert("Enter OTP & password");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/verify-otp-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          otp,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful, please login");
        setIsLogin(true);
        setShowOtpInput(false);
        setOtp("");
      } else {
        alert(data.detail || "Signup failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ LOGIN
  const handleLogin = async () => {
    if (!phone || !password) {
      alert("Enter phone & password");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/loginapi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const token = data.access_token || data.token;

        if (!token) {
          alert("Token not received");
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user_id", data.user_id);

        alert("Login successful");
        onLogin();
      } else {
        alert(data.detail || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
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
        <span className="text-4xl">🍽️</span>
      </motion.div>

      <div className="flex-1 flex flex-col pt-44 px-6 relative z-10">
        <motion.div
          className="bg-white rounded-3xl p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          
          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-[#FFF8F0] rounded-2xl p-1">
            <button
              onClick={() => {
                setIsLogin(true);
                setShowOtpInput(false);
              }}
              className={`flex-1 py-3 rounded-xl ${
                isLogin ? "bg-white text-[#FF7A30]" : "text-[#171717]/50"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => {
                setIsLogin(false);
                setShowOtpInput(false);
              }}
              className={`flex-1 py-3 rounded-xl ${
                !isLogin ? "bg-white text-[#FF7A30]" : "text-[#171717]/50"
              }`}
            >
              Sign Up
            </button>
          </div>

          <h2 className="mb-2">
            {isLogin ? "Welcome Back!" : "Join EatUnity"}
          </h2>

          <div className="space-y-4 mb-6">

            {/* PHONE */}
            <div>
              <label className="block mb-2">Phone Number</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+919876543210"
                  className="w-full pl-12 py-4 rounded-xl border"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-xl border"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* ✅ SAME UI STYLE (small text, no design change) */}
              {isLogin && (
                <div className="mt-2 text-right">
                  <button
                    onClick={onForgotPassword}
                    className="text-sm text-[#171717]/60"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {/* OTP */}
            {!isLogin && showOtpInput && (
              <div>
                <label className="block mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl border"
                />
              </div>
            )}
          </div>

          {/* BUTTON */}
          <motion.button
            onClick={
              isLogin
                ? handleLogin
                : showOtpInput
                ? handleSignup
                : handleSendOTP
            }
            className="w-full bg-orange-500 text-white py-4 rounded-xl"
          >
            {isLogin
              ? "Login"
              : showOtpInput
              ? "Verify OTP & Signup"
              : "Send OTP"}
          </motion.button>

        </motion.div>
      </div>
    </div>
  );
}