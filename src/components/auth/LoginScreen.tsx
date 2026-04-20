import { useState } from "react";
import { motion } from "motion/react";
import { Smartphone, Lock, Eye, EyeOff } from "lucide-react";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/firebase";

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

  // ============================
  // 📲 SEND OTP (Signup)
  // ============================
  const handleSendOTP = async () => {
    if (!phone || !password) {
      alert("Enter phone and password");
      return;
    }

    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );

      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmation;

      alert("OTP Sent");
      setShowOtpInput(true);
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    }
  };

  // ============================
  // ✅ SIGNUP (OTP verify + backend)
  // ============================
  const handleSignup = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      const token = await user.getIdToken();

      const res = await fetch(`${BASE_URL}/auth/firebase-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password, // 🔥 added
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_id", data.user_id);

        alert("Signup successful");
        onLogin();
      } else {
        alert(data.detail || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Invalid OTP");
    }
  };

  // ============================
  // 🔑 LOGIN (password)
  // ============================
  const handleLogin = async () => {
    if (!phone || !password) {
      alert("Enter phone & password");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);

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
        <motion.div className="bg-white rounded-3xl p-8">

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

          <h2 className="mb-4">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>

          {/* PHONE */}
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full mb-4 px-4 py-3 border rounded-xl"
          />

          {/* PASSWORD */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* OTP */}
          {!isLogin && showOtpInput && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-4 px-4 py-3 border rounded-xl"
            />
          )}

          {/* BUTTON */}
          <button
            onClick={
              isLogin
                ? handleLogin
                : showOtpInput
                ? handleSignup
                : handleSendOTP
            }
            className="w-full bg-orange-500 text-white py-3 rounded-xl"
          >
            {isLogin
              ? "Login"
              : showOtpInput
              ? "Verify OTP & Signup"
              : "Send OTP"}
          </button>

          {onForgotPassword && isLogin && (
            <div className="mt-4 text-right">
              <button
                onClick={onForgotPassword}
                className="text-sm text-gray-500"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <div id="recaptcha-container"></div>

        </motion.div>
      </div>
    </div>
  );
}