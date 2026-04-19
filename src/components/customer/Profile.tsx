import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  User,
  MapPin,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Award,
  Lock,
  Trash2,
} from "lucide-react";

const BASE_URL = "https://chef-backend-1.onrender.com";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  profile_image?: string;
  total_orders: number;
  avg_rating: number;
  join_date: string;
}

interface ProfileProps {
  onNavigateToEditProfile?: () => void;
  onNavigateToAddresses?: () => void;
  onNavigateToPayments?: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToHelp?: () => void;
  onNavigateToChangePassword?: () => void;
  onNavigateToDeleteAccount?: () => void; // 🔥 NEW
  onLogout?: () => void;
}

export function Profile({
  onNavigateToEditProfile,
  onNavigateToAddresses,
  onNavigateToPayments,
  onNavigateToSettings,
  onNavigateToHelp,
  onNavigateToChangePassword,
  onNavigateToDeleteAccount,
  onLogout,
}: ProfileProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.log("Profile error:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleMenuClick = (id: string) => {
    if (id === "profile" && onNavigateToEditProfile) onNavigateToEditProfile();
    if (id === "addresses" && onNavigateToAddresses) onNavigateToAddresses();
    if (id === "payment" && onNavigateToPayments) onNavigateToPayments();
    if (id === "settings" && onNavigateToSettings) onNavigateToSettings();
    if (id === "help" && onNavigateToHelp) onNavigateToHelp();
    if (id === "change-password" && onNavigateToChangePassword) onNavigateToChangePassword();
    if (id === "delete-account" && onNavigateToDeleteAccount) onNavigateToDeleteAccount();
  };

  const menuItems = [
    { id: "profile", icon: User, label: "Edit Profile", color: "from-[#FF7A30] to-[#ff9d5c]" },
    { id: "addresses", icon: MapPin, label: "My Addresses", color: "from-[#0FAD6E] to-[#3ec98d]" },
    { id: "payment", icon: CreditCard, label: "Payment Methods", color: "from-[#0FAD6E] to-[#FF7A30]" },
    { id: "change-password", icon: Lock, label: "Change Password", color: "from-[#FF7A30] to-[#5F2EEA]" },
    { id: "settings", icon: Settings, label: "Settings", color: "from-[#171717] to-[#3a3a3a]" },
    { id: "help", icon: HelpCircle, label: "Help & Support", color: "from-[#FF7A30] to-[#ff9d5c]" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    if (onLogout) {
      onLogout();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">

      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-24 rounded-b-[2rem]">

        <h1 className="text-white mb-8">Profile 👤</h1>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">

            <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden">
              {profile?.profile_image ? (
                <img src={profile.profile_image} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-3xl">👤</div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-white mb-1">{profile?.name || "Loading..."}</h2>
              <p className="text-white/80 text-sm">{profile?.phone}</p>
              <p className="text-white/80 text-sm">{profile?.email}</p>

              <span className="text-xs bg-white/20 px-2 py-1 rounded">
                {profile?.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20">
            <div className="text-center">
              <p className="text-white text-xl mb-1">{profile?.total_orders || 0}</p>
              <p className="text-white/70 text-xs">Orders</p>
            </div>

            <div className="text-center">
              <p className="text-white text-xl mb-1">{profile?.avg_rating || 0}</p>
              <p className="text-white/70 text-xs">Rating</p>
            </div>

            <div className="text-center">
              <p className="text-white text-xl mb-1">{profile?.join_date || "-"}</p>
              <p className="text-white/70 text-xs">Joined</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-16 mb-6">
        <div className="bg-gradient-to-br from-[#5F2EEA] to-[#8860f5] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6" />
            <h3>{profile?.role === "chef" ? "Chef Account" : "Customer Account"}</h3>
          </div>

          <p className="text-white/80 text-sm mb-4">
            Welcome to your dashboard 🎉
          </p>
        </div>
      </div>

      <div className="px-6 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              <span className="flex-1 text-left">{item.label}</span>
              <ChevronRight />
            </button>
          );
        })}

        {/* 🔥 DELETE ACCOUNT */}
        <button
          onClick={() => handleMenuClick("delete-account")}
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 border border-red-400"
        >
          <Trash2 className="text-red-500" />
          <span className="text-red-500">Delete Account</span>
        </button>

        {/* 🔥 LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 border border-red-400"
        >
          <LogOut className="text-red-500" />
          <span className="text-red-500">Logout</span>
        </button>
      </div>

    </div>
  );
}