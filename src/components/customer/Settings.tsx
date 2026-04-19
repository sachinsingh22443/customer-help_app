import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ChevronLeft,
  Bell,
  Moon,
  Globe,
  Shield,
  Smartphone,
  LogOut,
  RotateCcw
} from "lucide-react";

interface SettingsProps {
  onBack: () => void;
  onLogout?: () => void;
}

export function Settings({ onBack, onLogout }: SettingsProps) {

  const defaultSettings = {
    pushNotifications: true,
    emailNotifications: true,
    orderUpdates: true,
    specialOffers: false,
    darkMode: false,
    language: "English",
  };

  const [settings, setSettings] = useState(defaultSettings);

  // 🌍 TRANSLATIONS
  const translations = {
    English: {
      settings: "Settings ⚙️",
      notifications: "Notifications",
      push: "Push Notifications",
      email: "Email Notifications",
      orders: "Order Updates",
      offers: "Special Offers",
      darkMode: "Dark Mode",
      language: "Language",
      privacy: "Privacy & Security",
      privacyDesc: "Your data is secure and encrypted.",
      appInfo: "App Info",
      version: "Version",
      reset: "Reset Settings",
      logout: "Logout",
    },
    Hindi: {
      settings: "सेटिंग्स ⚙️",
      notifications: "सूचनाएं",
      push: "पुश नोटिफिकेशन",
      email: "ईमेल नोटिफिकेशन",
      orders: "ऑर्डर अपडेट",
      offers: "स्पेशल ऑफर्स",
      darkMode: "डार्क मोड",
      language: "भाषा",
      privacy: "गोपनीयता और सुरक्षा",
      privacyDesc: "आपका डेटा सुरक्षित है।",
      appInfo: "ऐप जानकारी",
      version: "संस्करण",
      reset: "सेटिंग्स रीसेट करें",
      logout: "लॉगआउट",
    }
  };

  const t = translations[settings.language as "English" | "Hindi"];

  // =========================
  // LOAD SETTINGS
  // =========================
  useEffect(() => {
    const saved = localStorage.getItem("settings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  // =========================
  // SAVE SETTINGS
  // =========================
  const updateSettings = (newSettings: any) => {
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
  };

  const toggleSetting = (key: keyof typeof settings) => {
    const updated = { ...settings, [key]: !settings[key] };
    updateSettings(updated);
  };

  // =========================
  // DARK MODE
  // =========================
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  // =========================
  // RESET
  // =========================
  const resetSettings = () => {
    updateSettings(defaultSettings);
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("settings");

    if (onLogout) onLogout();
    else window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#181818] to-[#3d3d3d] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onBack}
            className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="text-white" />
          </motion.button>

          <h1 className="text-white flex-1">{t.settings}</h1>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">

        {/* 🔔 NOTIFICATIONS */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="mb-4">{t.notifications}</h3>

          {[
            { key: "pushNotifications", label: t.push },
            { key: "emailNotifications", label: t.email },
            { key: "orderUpdates", label: t.orders },
            { key: "specialOffers", label: t.offers },
          ].map((item) => (
            <div key={item.key} className="flex justify-between py-2">
              <span>{item.label}</span>
              <button
                onClick={() => toggleSetting(item.key as any)}
                className={`w-12 h-6 rounded-full ${
                  settings[item.key as keyof typeof settings]
                    ? "bg-[#0FAD6E]"
                    : "bg-gray-300"
                }`}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full"
                  animate={{
                    x: settings[item.key as keyof typeof settings] ? 26 : 2,
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* 🌙 DARK MODE */}
        <div className="bg-white rounded-2xl p-6 flex justify-between">
          <span>{t.darkMode}</span>
          <button
            onClick={() => toggleSetting("darkMode")}
            className={`w-12 h-6 rounded-full ${
              settings.darkMode ? "bg-[#0FAD6E]" : "bg-gray-300"
            }`}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full"
              animate={{ x: settings.darkMode ? 26 : 2 }}
            />
          </button>
        </div>

        {/* 🌍 LANGUAGE */}
        <div className="bg-white rounded-2xl p-6 flex justify-between">
          <span>{t.language}</span>
          <select
            value={settings.language}
            onChange={(e) =>
              updateSettings({ ...settings, language: e.target.value })
            }
          >
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>

        {/* 🔐 PRIVACY */}
        <div className="bg-white rounded-2xl p-6">
          <h3>{t.privacy}</h3>
          <p className="text-sm text-gray-500">{t.privacyDesc}</p>
        </div>

        {/* 📱 APP INFO */}
        <div className="bg-white rounded-2xl p-6 text-sm text-gray-500">
          <p>{t.version}: 1.0.0</p>
          <p>© EatUnity</p>
        </div>

        {/* 🔄 RESET */}
        <button
          onClick={resetSettings}
          className="w-full bg-yellow-100 p-4 rounded-xl flex items-center justify-center gap-2"
        >
          <RotateCcw /> {t.reset}
        </button>

        {/* 🚪 LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-100 p-4 rounded-xl flex items-center justify-center gap-2 text-red-600"
        >
          <LogOut /> {t.logout}
        </button>

      </div>
    </div>
  );
}