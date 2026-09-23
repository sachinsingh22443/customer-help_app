import { useEffect, useState } from "react";
import { motion} from "motion/react";
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
  History,
  Calendar,
  Wallet,
  Gift,
} from "lucide-react";

const BASE_URL = "https://chef-backend-qh12.onrender.com";

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
  onNavigateToWallet?: () => void;
  onNavigateToShareAndEarn?: () => void;
  onNavigateToPayments?: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToHelp?: () => void;
  onNavigateToChangePassword?: () => void;
  onNavigateToSubscriptions?: () => void;
  onNavigateToSpecialHistory?: () => void;
  onNavigateToDeleteAccount?: () => void;
  onLogout?: () => void;
}

export function Profile({
  onNavigateToEditProfile,
  onNavigateToAddresses,
  onNavigateToWallet,
  onNavigateToShareAndEarn,
  onNavigateToPayments,
  onNavigateToSettings,
  onNavigateToHelp,
  onNavigateToChangePassword,
  onNavigateToSubscriptions,
  onNavigateToSpecialHistory,
  onNavigateToDeleteAccount,
  onLogout,
}: ProfileProps) {
  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const res = await fetch(
        `${BASE_URL}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.detail || "Failed to load profile"
        );
      }

      setProfile(data);
    } catch (err) {
      console.log("Profile error:", err);
    }
  };

  // =========================================================
  // FETCH WALLET
  // =========================================================

  

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================================================
  // MENU CLICK
  // =========================================================

  const handleMenuClick = (id: string) => {
    if (
      id === "profile" &&
      onNavigateToEditProfile
    ) {
      onNavigateToEditProfile();
    }

    if (
      id === "addresses" &&
      onNavigateToAddresses
    ) {
      onNavigateToAddresses();
    }

    if (
      id === "payment" &&
      onNavigateToPayments
    ) {
      onNavigateToPayments();
    }

    if (
      id === "settings" &&
      onNavigateToSettings
    ) {
      onNavigateToSettings();
    }

    if (
      id === "help" &&
      onNavigateToHelp
    ) {
      onNavigateToHelp();
    }

    if (
      id === "change-password" &&
      onNavigateToChangePassword
    ) {
      onNavigateToChangePassword();
    }

    if (
      id === "subscriptions" &&
      onNavigateToSubscriptions
    ) {
      onNavigateToSubscriptions();
    }

    if (
      id === "special-history" &&
      onNavigateToSpecialHistory
    ) {
      onNavigateToSpecialHistory();
    }

    if (
      id === "delete-account" &&
      onNavigateToDeleteAccount
    ) {
      onNavigateToDeleteAccount();
    }
  };

  // =========================================================
  // MENU ITEMS
  // =========================================================

  const menuItems = [
    {
      id: "profile",
      icon: User,
      label: "Edit Profile",
      color: "from-[#FF7A30] to-[#ff9d5c]",
    },

    {
      id: "addresses",
      icon: MapPin,
      label: "My Addresses",
      color: "from-[#0FAD6E] to-[#3ec98d]",
    },

    {
      id: "payment",
      icon: CreditCard,
      label: "Payment Methods",
      color: "from-[#0FAD6E] to-[#FF7A30]",
    },

    {
      id: "change-password",
      icon: Lock,
      label: "Change Password",
      color: "from-[#FF7A30] to-[#5F2EEA]",
    },

    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      color: "from-[#171717] to-[#3a3a3a]",
    },

    {
      id: "help",
      icon: HelpCircle,
      label: "Help & Support",
      color: "from-[#FF7A30] to-[#ff9d5c]",
    },

    {
      id: "subscriptions",
      icon: Calendar,
      label: "My Subscriptions",
      color: "from-[#5F2EEA] to-[#8860f5]",
    },

    {
      id: "special-history",
      icon: History,
      label: "My Special History",
      color: "from-[#FF7A30] to-[#5F2EEA]",
    },
  ];



    // =========================================================
  // SHARE & EARN
  // =========================================================

  

  

  

  
  

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    if (onLogout) {
      onLogout();
    } else {
      window.location.href = "/";
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">

      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}

      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-24 rounded-b-[2rem]">

        <h1 className="text-white mb-8">
          Profile 👤
        </h1>

        <div className="glass-card rounded-2xl p-6">

          <div className="flex items-center gap-4 mb-4">

            <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden">

              {profile?.profile_image ? (
                <img
                  src={profile.profile_image}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-3xl">
                  👤
                </div>
              )}

            </div>

            <div className="flex-1 min-w-0">

              <h2 className="text-white mb-1 truncate">
                {profile?.name || "Loading..."}
              </h2>

              <p className="text-white/80 text-sm truncate">
                {profile?.phone}
              </p>

              <p className="text-white/80 text-sm truncate">
                {profile?.email}
              </p>

              <span className="inline-block text-xs bg-white/20 px-2 py-1 rounded mt-1">
                {profile?.role}
              </span>

            </div>

          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20">

            <div className="text-center">
              <p className="text-white text-xl mb-1">
                {profile?.total_orders || 0}
              </p>

              <p className="text-white/70 text-xs">
                Orders
              </p>
            </div>

            <div className="text-center">
              <p className="text-white text-xl mb-1">
                {profile?.avg_rating || 0}
              </p>

              <p className="text-white/70 text-xs">
                Rating
              </p>
            </div>

            <div className="text-center">
              <p className="text-white text-xl mb-1">
                {profile?.join_date || "-"}
              </p>

              <p className="text-white/70 text-xs">
                Joined
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* =====================================================
          ACCOUNT CARD
      ===================================================== */}

      <div className="px-6 -mt-16 mb-6">

        <div className="bg-gradient-to-br from-[#5F2EEA] to-[#8860f5] rounded-2xl p-6 text-white">

          <div className="flex items-center gap-2 mb-4">

            <Award className="w-6 h-6" />

            <h3>
              {profile?.role === "chef"
                ? "Chef Account"
                : "Customer Account"}
            </h3>

          </div>

          <p className="text-white/80 text-sm mb-4">
            Welcome to your dashboard 🎉
          </p>

        </div>

      </div>

      
<div className="px-6 mb-4">

  <motion.button
    type="button"
    whileTap={{ scale: 0.98 }}
    onClick={() =>
      onNavigateToWallet?.()
    }
    className="w-full text-left relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#171717] via-[#252525] to-[#5F2EEA] p-5 text-white shadow-[0_15px_40px_rgba(95,46,234,0.18)]"
  >

    <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/5" />

    <div className="relative flex items-center gap-4">

      <div className="w-13 h-13 rounded-2xl bg-white/10 flex items-center justify-center">

        <Wallet
          size={25}
          className="text-yellow-300"
        />

      </div>

      <div className="flex-1">

        <p className="text-white/60 text-xs font-semibold">
          MY WALLET
        </p>

        <h3 className="text-white text-lg font-black">
          Wallet
        </h3>

        <p className="text-white/60 text-xs mt-1">
          View balance & transaction history
        </p>

      </div>

      <ChevronRight
        size={22}
        className="text-white/60"
      />

    </div>

  </motion.button>

</div>

     

<div className="px-6 mb-6">

  <motion.button
    type="button"
    whileTap={{ scale: 0.98 }}
    onClick={() =>
      onNavigateToShareAndEarn?.()
    }
    className="w-full text-left relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#FF7A30] via-[#FF8E42] to-[#5F2EEA] p-5 text-white shadow-[0_15px_40px_rgba(255,122,48,0.18)]"
  >

    <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10" />

    <div className="relative flex items-center gap-4">

      <div className="w-13 h-13 rounded-2xl bg-white/15 flex items-center justify-center">

        <Gift
          size={25}
          className="text-yellow-200"
        />

      </div>

      <div className="flex-1">

        <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">
          EARN WITH FRIENDS
        </p>

        <h3 className="text-white text-lg font-black">
          Share & Earn 🎁
        </h3>

        <p className="text-white/70 text-xs mt-1">
          Invite friends and earn rewards
        </p>

      </div>

      <ChevronRight
        size={22}
        className="text-white/60"
      />

    </div>

  </motion.button>

</div>

      <div className="px-6 space-y-3">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                handleMenuClick(item.id)
              }
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm"
            >

              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>

              <span className="flex-1 text-left font-medium">
                {item.label}
              </span>

              <ChevronRight
                className="text-gray-400"
                size={20}
              />

            </motion.button>
          );

        })}

        {/* =====================================================
            DELETE ACCOUNT
        ===================================================== */}

        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() =>
            handleMenuClick("delete-account")
          }
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 border border-red-200 shadow-sm"
        >

          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">

            <Trash2 className="text-red-500" />

          </div>

          <span className="flex-1 text-left text-red-500 font-medium">
            Delete Account
          </span>

          <ChevronRight
            className="text-red-300"
            size={20}
          />

        </motion.button>

        {/* =====================================================
            LOGOUT
        ===================================================== */}

        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 border border-red-200 shadow-sm"
        >

          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">

            <LogOut className="text-red-500" />

          </div>

          <span className="flex-1 text-left text-red-500 font-medium">
            Logout
          </span>

          <ChevronRight
            className="text-red-300"
            size={20}
          />

        </motion.button>

      </div>

      
      

    </div>
  );
}