import { motion } from "motion/react";
import { ShieldAlert, Settings, X } from "lucide-react";

interface PermissionDeniedProps {
  type: "location" | "notification" | "camera" | "storage";
  onOpenSettings: () => void;
  onDismiss: () => void;
}

export function PermissionDenied({ type, onOpenSettings, onDismiss }: PermissionDeniedProps) {
  const permissionInfo = {
    location: {
      icon: "📍",
      title: "Location Access Denied",
      description: "We need location access to find chefs near you and provide accurate delivery estimates.",
      features: [
        "Find nearby chefs",
        "Get delivery estimates",
        "Track your orders",
        "Personalized recommendations"
      ]
    },
    notification: {
      icon: "🔔",
      title: "Notifications Disabled",
      description: "Enable notifications to stay updated about your orders and receive exclusive offers.",
      features: [
        "Order updates",
        "Delivery notifications",
        "Special offers",
        "Chef announcements"
      ]
    },
    camera: {
      icon: "📷",
      title: "Camera Access Denied",
      description: "We need camera access to upload photos of your dishes or profile picture.",
      features: [
        "Upload dish photos",
        "Update profile picture",
        "Share food reviews",
        "Scan QR codes"
      ]
    },
    storage: {
      icon: "💾",
      title: "Storage Access Denied",
      description: "We need storage access to save photos and cache data for better performance.",
      features: [
        "Save dish images",
        "Cache menu data",
        "Offline access",
        "Faster loading"
      ]
    }
  };

  const info = permissionInfo[type];

  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-[#FF7A30] to-[#5F2EEA] opacity-10 rounded-b-[3rem]" />

      <motion.div
        className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center neo-shadow-lg mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        <span className="text-5xl">{info.icon}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <h2 className="text-[#171717] mb-3">{info.title}</h2>
        <p className="text-[#171717]/60 mb-8">
          {info.description}
        </p>

        <div className="bg-white rounded-2xl p-6 neo-shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-[#FF7A30]" />
            <h3 className="text-[#171717] text-left">Missing Features:</h3>
          </div>
          <ul className="space-y-2 text-left text-sm text-[#171717]/70">
            {info.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#171717]/30 mt-1">✗</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={onOpenSettings}
            className="w-full py-4 bg-[#FF7A30] text-white rounded-2xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Open Settings
          </button>

          <button
            onClick={onDismiss}
            className="w-full py-4 bg-white text-[#171717] rounded-2xl neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Continue Anyway
          </button>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-[#171717]/40">
          Grant permission in app settings
        </p>
      </motion.div>
    </div>
  );
}
