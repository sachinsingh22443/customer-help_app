import { useEffect, useState } from "react";
import { Share } from "@capacitor/share";
import { motion, AnimatePresence } from "motion/react";
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
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  RefreshCw,
  X,
  Copy,
  Share2,
} from "lucide-react";

const BASE_URL = "https://chef-backend-qh12.onrender.com";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  profile_image?: string;
  referral_code?: string;
  total_orders: number;
  avg_rating: number;
  join_date: string;
}

interface WalletTransaction {
  id: string;
  amount: number;
  transaction_type: string;
  meal_type?: string | null;
  subscription_id?: string | null;
  order_id?: string | null;
  referral_id?: string | null;
  schedule_id?: string | null;
  description?: string | null;
  created_at: string;
}

interface WalletHistoryResponse {
  balance: number;
  transactions: WalletTransaction[];
}

interface ProfileProps {
  onNavigateToEditProfile?: () => void;
  onNavigateToAddresses?: () => void;
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

  // =========================================================
  // WALLET STATE
  // =========================================================

  const [walletBalance, setWalletBalance] =
    useState<number>(0);

  const [walletTransactions, setWalletTransactions] =
    useState<WalletTransaction[]>([]);

  const [walletLoading, setWalletLoading] =
    useState(false);

  const [walletHistoryOpen, setWalletHistoryOpen] =
    useState(false);

  // =========================================================
  // FETCH PROFILE
  // =========================================================

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

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      setWalletLoading(true);

      const res = await fetch(
        `${BASE_URL}/wallet/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: WalletHistoryResponse =
        await res.json();

      if (!res.ok) {
        throw new Error(
          (data as any)?.detail ||
            "Failed to load wallet"
        );
      }

      setWalletBalance(
        Number(data?.balance || 0)
      );

      setWalletTransactions(
        Array.isArray(data?.transactions)
          ? data.transactions
          : []
      );
    } catch (error) {
      console.error(
        "WALLET FETCH ERROR:",
        error
      );
    } finally {
      setWalletLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchProfile();
    fetchWallet();
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

  const getReferralLink = () => {
    const referralCode = profile?.referral_code;

    if (!referralCode) {
      return "";
    }

    return `https://play.google.com/store/apps/details?id=com.eatunity.app&ref=${encodeURIComponent(
      referralCode
    )}`;
  };

  const handleCopyReferralCode = async () => {
    try {
      const referralCode = profile?.referral_code;

      if (!referralCode) {
        alert("Referral code not available");
        return;
      }

      await navigator.clipboard.writeText(referralCode);

      alert("Referral code copied 🎉");
    } catch (error) {
      console.error(
        "COPY REFERRAL CODE ERROR:",
        error
      );

      alert("Unable to copy referral code");
    }
  };

  const handleShareReferral = async () => {
  try {
    const referralCode = profile?.referral_code;

    if (!referralCode) {
      alert("Referral code not available");
      return;
    }

    const referralLink =
      `https://play.google.com/store/apps/details?id=com.eatunity.app&ref=${encodeURIComponent(
        referralCode
      )}`;

    const shareText =
      `🍱 Order delicious, home-style meals with Eat Unity!\n\n` +
      `Use my referral code: ${referralCode}\n\n` +
      `Download Eat Unity using this link:\n` +
      `${referralLink}`;

    await Share.share({
      title: "Join Eat Unity",
      text: shareText,
      url: referralLink,
      dialogTitle: "Share Eat Unity",
    });

  } catch (error: any) {
    if (
      error?.message?.toLowerCase?.().includes("cancel") ||
      error?.name === "AbortError"
    ) {
      return;
    }

    console.error("SHARE REFERRAL ERROR:", error);

    try {
      const referralCode = profile?.referral_code;

      if (!referralCode) {
        alert("Referral code not available");
        return;
      }

      const referralLink =
        `https://play.google.com/store/apps/details?id=com.eatunity.app&ref=${encodeURIComponent(
          referralCode
        )}`;

      const shareText =
        `🍱 Order delicious, home-style meals with Eat Unity!\n\n` +
        `Use my referral code: ${referralCode}\n\n` +
        `Download Eat Unity using this link:\n` +
        `${referralLink}`;

      await navigator.clipboard.writeText(shareText);

      alert("Referral message copied 🎉");

    } catch (copyError) {
      console.error("COPY REFERRAL ERROR:", copyError);
      alert("Unable to share referral");
    }
  }
};
  // =========================================================
  // TRANSACTION TITLE
  // =========================================================

  const getTransactionTitle = (
    transaction: WalletTransaction
  ) => {
    if (transaction.description) {
      return transaction.description;
    }

    if (
      transaction.transaction_type ===
      "referral_reward"
    ) {
      return "Referral Reward 🎁";
    }

    if (
      transaction.transaction_type ===
      "referral_reward_reversal"
    ) {
      return "Referral Reward Reversed";
    }

    if (
      transaction.transaction_type ===
      "meal_on_debit"
    ) {
      return `${
        transaction.meal_type
          ? transaction.meal_type
              .charAt(0)
              .toUpperCase() +
            transaction.meal_type.slice(1)
          : "Meal"
      } meal`;
    }

    return transaction.transaction_type
      ?.replaceAll("_", " ")
      ?.replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  // =========================================================
  // TRANSACTION DATE
  // =========================================================

  const formatTransactionDate = (
    value: string
  ) => {
    try {
      return new Date(value).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "-";
    }
  };

  // =========================================================
  // TRANSACTION TIME
  // =========================================================

  const formatTransactionTime = (
    value: string
  ) => {
    try {
      return new Date(value).toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return "";
    }
  };

  // =========================================================
  // LOGOUT
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

      {/* =====================================================
          WALLET
      ===================================================== */}

      <div className="px-6 mb-6">

        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#171717] via-[#252525] to-[#5F2EEA] p-5 text-white shadow-[0_15px_40px_rgba(95,46,234,0.20)]">

          {/* Decorative circles */}

          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/5" />

          <div className="absolute -left-10 -bottom-14 w-36 h-36 rounded-full bg-white/5" />

          <div className="relative">

            {/* Wallet Header */}

            <div className="flex items-center justify-between mb-5">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">

                  <Wallet
                    size={24}
                    className="text-yellow-300"
                  />

                </div>

                <div>
                  <p className="text-white/60 text-xs font-semibold">
                    MY WALLET
                  </p>

                  <h3 className="text-white text-lg font-extrabold">
                    Wallet Balance
                  </h3>
                </div>

              </div>

              <button
                type="button"
                onClick={fetchWallet}
                disabled={walletLoading}
                className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center active:scale-95 transition"
              >
                <RefreshCw
                  size={16}
                  className={
                    walletLoading
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>

            </div>

            {/* Balance */}

            <div className="mb-5">

              <p className="text-white/60 text-xs mb-1">
                Available Balance
              </p>

              <p className="text-4xl font-black tracking-tight">
                ₹
                {walletBalance.toFixed(2)}
              </p>

            </div>

            {/* Wallet Actions */}

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() =>
                  setWalletHistoryOpen(true)
                }
                className="flex items-center justify-center gap-2 bg-white text-gray-900 rounded-2xl py-3 px-4 text-sm font-extrabold active:scale-[0.98] transition"
              >
                <History size={17} />
                Wallet History
              </button>

              <div className="flex items-center justify-center gap-2 bg-white/10 border border-white/10 rounded-2xl py-3 px-4 text-sm font-bold text-white/90">
                <Gift
                  size={17}
                  className="text-yellow-300"
                />
                Referral Rewards
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          MENU
      ===================================================== */}

            {/* =====================================================
          SHARE & EARN
      ===================================================== */}

      <div className="px-6 mb-6">

        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#FF7A30] via-[#FF8E42] to-[#5F2EEA] p-5 text-white shadow-[0_15px_40px_rgba(255,122,48,0.20)]">

          {/* Decorative circles */}

          <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-white/10" />

          <div className="absolute -left-12 -bottom-16 w-40 h-40 rounded-full bg-white/5" />

          <div className="relative">

            {/* Header */}

            <div className="flex items-center gap-3 mb-5">

              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">

                <Gift
                  size={25}
                  className="text-yellow-200"
                />

              </div>

              <div>

                <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">
                  EARN WITH FRIENDS
                </p>

                <h3 className="text-white text-xl font-black">
                  Share & Earn 🎁
                </h3>

              </div>

            </div>

            {/* Description */}

            <p className="text-white/90 text-sm leading-relaxed mb-5">
              Friends ko Eat Unity par invite karo aur
              unke qualifying purchase par referral reward
              earn karo.
            </p>

            {/* Referral Code */}

            <div className="bg-white/10 border border-white/15 rounded-2xl p-4 mb-4">

              <p className="text-white/60 text-[11px] font-semibold mb-2">
                YOUR REFERRAL CODE
              </p>

              <div className="flex items-center gap-3">

                <div className="flex-1 min-w-0">

                  <p className="text-white text-2xl font-black tracking-[0.18em] truncate">
                    {profile?.referral_code || "------"}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={handleCopyReferralCode}
                  disabled={!profile?.referral_code}
                  className="shrink-0 w-11 h-11 rounded-xl bg-white text-[#5F2EEA] flex items-center justify-center active:scale-95 transition disabled:opacity-50"
                >

                  <Copy size={18} />

                </button>

              </div>

            </div>

            {/* Rewards */}

            <div className="bg-black/10 rounded-2xl p-4 mb-4">

              <p className="text-white text-sm font-extrabold mb-3">
                Referral Rewards
              </p>

              <div className="grid grid-cols-2 gap-2">

                <div className="bg-white/10 rounded-xl p-3">

                  <p className="text-white/60 text-[10px]">
                    Normal Order
                  </p>

                  <p className="text-white font-black text-lg">
                    ₹1
                  </p>

                </div>

                <div className="bg-white/10 rounded-xl p-3">

                  <p className="text-white/60 text-[10px]">
                    7 Day Subscription
                  </p>

                  <p className="text-white font-black text-lg">
                    ₹10
                  </p>

                </div>

                <div className="bg-white/10 rounded-xl p-3">

                  <p className="text-white/60 text-[10px]">
                    15 Day Subscription
                  </p>

                  <p className="text-white font-black text-lg">
                    ₹40
                  </p>

                </div>

                <div className="bg-white/10 rounded-xl p-3">

                  <p className="text-white/60 text-[10px]">
                    30 Day Subscription
                  </p>

                  <p className="text-white font-black text-lg">
                    ₹80
                  </p>

                </div>

              </div>

            </div>

            {/* Share Button */}

            <button
              type="button"
              onClick={handleShareReferral}
              disabled={!profile?.referral_code}
              className="w-full bg-white text-[#5F2EEA] rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 font-black text-sm active:scale-[0.98] transition disabled:opacity-50"
            >

              <Share2 size={18} />

              Share Now

            </button>

          </div>

        </div>

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

      {/* =====================================================
          WALLET HISTORY MODAL
      ===================================================== */}

      <AnimatePresence>

        {walletHistoryOpen && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={() =>
              setWalletHistoryOpen(false)
            }
          >

            <motion.div
              initial={{
                opacity: 0,
                y: 80,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 80,
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
              className="w-full sm:max-w-lg max-h-[85vh] bg-[#FFF8F0] rounded-t-[30px] sm:rounded-[30px] overflow-hidden shadow-2xl"
            >

              {/* Modal Header */}

              <div className="bg-gradient-to-r from-[#171717] to-[#5F2EEA] p-5 text-white">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">

                      <Wallet size={22} />

                    </div>

                    <div>

                      <h3 className="font-extrabold text-lg">
                        Wallet History
                      </h3>

                      <p className="text-white/60 text-xs">
                        All wallet transactions
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setWalletHistoryOpen(false)
                    }
                    className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center active:scale-95"
                  >
                    <X size={19} />
                  </button>

                </div>

                <div className="mt-5">

                  <p className="text-white/60 text-xs">
                    Current Balance
                  </p>

                  <p className="text-3xl font-black mt-1">
                    ₹
                    {walletBalance.toFixed(2)}
                  </p>

                </div>

              </div>

              {/* Transactions */}

              <div className="p-4 overflow-y-auto max-h-[55vh]">

                {walletLoading ? (

                  <div className="py-12 flex flex-col items-center justify-center">

                    <RefreshCw
                      size={28}
                      className="animate-spin text-[#5F2EEA]"
                    />

                    <p className="text-sm text-gray-500 mt-3">
                      Loading wallet history...
                    </p>

                  </div>

                ) : walletTransactions.length === 0 ? (

                  <div className="py-12 text-center">

                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-4">

                      <Wallet
                        size={28}
                        className="text-gray-400"
                      />

                    </div>

                    <h4 className="font-extrabold text-gray-800">
                      No Transactions Yet
                    </h4>

                    <p className="text-sm text-gray-400 mt-1">
                      Your wallet transactions will appear here.
                    </p>

                  </div>

                ) : (

                  <div className="space-y-3">

                    {walletTransactions.map(
                      (transaction) => {

                        const isCredit =
                          Number(
                            transaction.amount
                          ) > 0;

                        return (
                          <div
                            key={transaction.id}
                            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
                          >

                            <div className="flex items-center gap-3">

                              {/* Icon */}

                              <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                                  isCredit
                                    ? "bg-emerald-50"
                                    : "bg-red-50"
                                }`}
                              >

                                {isCredit ? (
                                  <ArrowDownLeft
                                    size={20}
                                    className="text-emerald-600"
                                  />
                                ) : (
                                  <ArrowUpRight
                                    size={20}
                                    className="text-red-500"
                                  />
                                )}

                              </div>

                              {/* Details */}

                              <div className="flex-1 min-w-0">

                                <p className="font-extrabold text-gray-800 text-sm truncate">
                                  {getTransactionTitle(
                                    transaction
                                  )}
                                </p>

                                <p className="text-[11px] text-gray-400 mt-1">
                                  {formatTransactionDate(
                                    transaction.created_at
                                  )}
                                  {" • "}
                                  {formatTransactionTime(
                                    transaction.created_at
                                  )}
                                </p>

                              </div>

                              {/* Amount */}

                              <div className="text-right">

                                <p
                                  className={`font-black text-sm ${
                                    isCredit
                                      ? "text-emerald-600"
                                      : "text-red-500"
                                  }`}
                                >
                                  {isCredit
                                    ? "+"
                                    : "-"}
                                  ₹
                                  {Math.abs(
                                    Number(
                                      transaction.amount
                                    )
                                  ).toFixed(2)}
                                </p>

                                <p className="text-[9px] text-gray-400 mt-1">
                                  {isCredit
                                    ? "CREDIT"
                                    : "DEBIT"}
                                </p>

                              </div>

                            </div>

                            {/* Referral Badge */}

                            {transaction.transaction_type ===
                              "referral_reward" && (

                              <div className="mt-3 flex items-center gap-2 rounded-xl bg-yellow-50 border border-yellow-100 px-3 py-2">

                                <Gift
                                  size={14}
                                  className="text-yellow-600"
                                />

                                <span className="text-[11px] font-bold text-yellow-700">
                                  Referral reward credited
                                </span>

                              </div>

                            )}

                          </div>
                        );

                      }
                    )}

                  </div>

                )}

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}