import { useEffect, useState } from "react";
import { Share } from "@capacitor/share";
import {
  ArrowLeft,
  Copy,
  Gift,
  Share2,
  Users,
} from "lucide-react";

const BASE_URL =
  "https://chef-backend-qh12.onrender.com";

interface ShareAndEarnProps {
  onBack: () => void;
}

interface ProfileData {
  referral_code?: string;
}

export function ShareAndEarn({
  onBack,
}: ShareAndEarnProps) {
  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  const [loading, setLoading] =
    useState(true);

  // =========================================================
  // FETCH PROFILE
  // =========================================================

  const fetchProfile = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        return;
      }

      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/users/me`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Failed to load profile"
        );
      }

      setProfile(data);
    } catch (error) {
      console.error(
        "SHARE EARN PROFILE ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================================================
  // REFERRAL LINK
  // =========================================================

  const getReferralLink = () => {
    const referralCode =
      profile?.referral_code;

    if (!referralCode) {
      return "";
    }

    return (
      `https://play.google.com/store/apps/details?id=com.eatunity.app` +
      `&referrer=${encodeURIComponent(
        `referral_code=${referralCode}`
      )}`
    );
  };

  // =========================================================
  // COPY CODE
  // =========================================================

  const handleCopyReferralCode =
    async () => {
      try {
        const code =
          profile?.referral_code;

        if (!code) {
          alert(
            "Referral code not available"
          );
          return;
        }

        await navigator.clipboard.writeText(
          code
        );

        alert(
          "Referral code copied 🎉"
        );
      } catch (error) {
        console.error(
          "COPY REFERRAL ERROR:",
          error
        );

        alert(
          "Unable to copy referral code"
        );
      }
    };

  // =========================================================
  // SHARE
  // =========================================================

  const handleShareReferral =
    async () => {
      try {
        const referralCode =
          profile?.referral_code;

        if (!referralCode) {
          alert(
            "Referral code not available"
          );
          return;
        }

        const referralLink =
          getReferralLink();

        const shareText =
          `🍱 Order delicious, home-style meals with Eat Unity!\n\n` +
          `Use my referral code: ${referralCode}\n\n` +
          `Download Eat Unity using this link:\n` +
          `${referralLink}`;

        await Share.share({
          title: "Join Eat Unity",
          text: shareText,
          url: referralLink,
          dialogTitle:
            "Share Eat Unity",
        });
      } catch (error: any) {
        if (
          error?.message
            ?.toLowerCase?.()
            .includes("cancel") ||
          error?.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "SHARE REFERRAL ERROR:",
          error
        );

        try {
          const referralCode =
            profile?.referral_code;

          if (!referralCode) {
            alert(
              "Referral code not available"
            );
            return;
          }

          const referralLink =
            getReferralLink();

          const shareText =
            `🍱 Order delicious, home-style meals with Eat Unity!\n\n` +
            `Use my referral code: ${referralCode}\n\n` +
            `Download Eat Unity using this link:\n` +
            `${referralLink}`;

          await navigator.clipboard.writeText(
            shareText
          );

          alert(
            "Referral message copied 🎉"
          );
        } catch (copyError) {
          console.error(
            "COPY REFERRAL ERROR:",
            copyError
          );

          alert(
            "Unable to share referral"
          );
        }
      }
    };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bg-gradient-to-br from-[#FF7A30] via-[#FF8E42] to-[#5F2EEA] text-white px-5 pt-10 pb-8">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1">

            <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">
              EARN WITH FRIENDS
            </p>

            <h1 className="text-2xl font-black">
              Share & Earn 🎁
            </h1>

          </div>

          <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">

            <Gift
              size={23}
              className="text-yellow-200"
            />

          </div>

        </div>

      </div>

      <div className="px-5 mt-5">

        {/* =====================================================
            MAIN REFERRAL CARD
        ===================================================== */}

        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#FF7A30] via-[#FF8E42] to-[#5F2EEA] p-6 text-white shadow-xl">

          <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-white/10" />

          <div className="absolute -left-12 -bottom-16 w-40 h-40 rounded-full bg-white/5" />

          <div className="relative">

            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-5">

              <Users
                size={27}
                className="text-yellow-200"
              />

            </div>

            <h2 className="text-2xl font-black">
              Invite Friends
            </h2>

            <p className="text-white/80 text-sm mt-2 leading-relaxed">
              Friends ko Eat Unity par
              invite karo aur unke
              qualifying purchase par
              referral reward earn karo.
            </p>

            {/* Referral code */}

            <div className="mt-6 bg-white/10 border border-white/15 rounded-2xl p-4">

              <p className="text-white/60 text-[11px] font-semibold">
                YOUR REFERRAL CODE
              </p>

              {loading ? (
                <div className="h-9 mt-2 bg-white/10 rounded animate-pulse" />
              ) : (
                <div className="flex items-center gap-3 mt-2">

                  <p className="flex-1 text-2xl font-black tracking-[0.18em] truncate">
                    {profile?.referral_code ||
                      "------"}
                  </p>

                  <button
                    type="button"
                    onClick={
                      handleCopyReferralCode
                    }
                    disabled={
                      !profile?.referral_code
                    }
                    className="shrink-0 w-11 h-11 rounded-xl bg-white text-[#5F2EEA] flex items-center justify-center active:scale-95 disabled:opacity-50"
                  >
                    <Copy size={18} />
                  </button>

                </div>
              )}

            </div>

            {/* Share */}

            <button
              type="button"
              onClick={
                handleShareReferral
              }
              disabled={
                !profile?.referral_code
              }
              className="w-full mt-4 bg-white text-[#5F2EEA] rounded-2xl py-4 px-4 flex items-center justify-center gap-2 font-black active:scale-[0.98] disabled:opacity-50"
            >

              <Share2 size={19} />

              Share Now

            </button>

          </div>

        </div>

        {/* =====================================================
            REWARD DETAILS
        ===================================================== */}

        <div className="mt-5">

          <h2 className="text-xl font-black text-gray-800">
            Referral Rewards
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Reward is credited after the
            referred user's qualifying purchase.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4">

            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">

              <p className="text-gray-400 text-xs">
                Normal Order
              </p>

              <p className="text-2xl font-black text-[#5F2EEA] mt-1">
                ₹1
              </p>

            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">

              <p className="text-gray-400 text-xs">
                7 Day Subscription
              </p>

              <p className="text-2xl font-black text-[#5F2EEA] mt-1">
                ₹10
              </p>

            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">

              <p className="text-gray-400 text-xs">
                15 Day Subscription
              </p>

              <p className="text-2xl font-black text-[#5F2EEA] mt-1">
                ₹40
              </p>

            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">

              <p className="text-gray-400 text-xs">
                30 Day Subscription
              </p>

              <p className="text-2xl font-black text-[#5F2EEA] mt-1">
                ₹80
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <div className="mt-5 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

          <h3 className="font-black text-lg text-gray-800">
            How it works
          </h3>

          <div className="mt-4 space-y-4">

            <div className="flex gap-3">

              <div className="w-8 h-8 rounded-full bg-[#F1ECFF] text-[#5F2EEA] flex items-center justify-center font-black text-sm">
                1
              </div>

              <div>
                <p className="font-bold text-gray-800">
                  Share your referral
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Share your referral code or link.
                </p>
              </div>

            </div>

            <div className="flex gap-3">

              <div className="w-8 h-8 rounded-full bg-[#FFF0E8] text-[#FF7A30] flex items-center justify-center font-black text-sm">
                2
              </div>

              <div>
                <p className="font-bold text-gray-800">
                  Friend joins Eat Unity
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Referral code is applied during signup.
                </p>
              </div>

            </div>

            <div className="flex gap-3">

              <div className="w-8 h-8 rounded-full bg-[#EAF9F3] text-[#0FAD6E] flex items-center justify-center font-black text-sm">
                3
              </div>

              <div>
                <p className="font-bold text-gray-800">
                  Qualifying purchase
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Reward is generated only after the qualifying purchase.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ShareAndEarn;