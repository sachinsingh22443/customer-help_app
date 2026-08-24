import { useState } from "react";
import { motion } from "motion/react";

import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChefHat,
  Clock3,
  Crown,
  Flame,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Utensils,
} from "lucide-react";

import {
  Checkout as RazorpayCheckout,
} from "capacitor-razorpay";


/* =========================================================
   SELECTED PLAN
   ========================================================= */

interface SelectedPlan {
  plan_id: string;

  title: string;

  price: number;

  chef_name?: string;

  plan_type?: string;

  tagline?: string;

  emoji?: string;

  chef_id: string;

  menu_id: string;

  menu_name: string;

  goal?: string;

  diet_type?: string;

  meal_type?: string[];

  calories_per_day?: number;

  breakfast_available?: boolean;

  breakfast_price?: number;
}


/* =========================================================
   DURATION
   ========================================================= */

interface Duration {
  id: string;

  name: string;

  days: number;

  discount: number;

  icon: React.ComponentType<any>;

  color: string;
}


/* =========================================================
   PROPS
   ========================================================= */

interface Props {
  selectedPlan: SelectedPlan;

  onBack: () => void;

  onViewSubscriptions: () => void;

  onGoHome: () => void;
}


/* =========================================================
   SUBSCRIPTION DURATION
   ========================================================= */

export function SubscriptionDuration({
  selectedPlan,
  onBack,
  onViewSubscriptions,
  onGoHome,
}: Props) {


  /* =======================================================
     DURATION OPTIONS

     API / PAYMENT LOGIC SE SAME
     ======================================================= */

  const durations: Duration[] = [
    {
      id: "7",
      name: "7 Days",
      days: 7,
      discount: 0,
      icon: Calendar,
      color: "from-[#5F2EEA] to-[#8860f5]",
    },

    {
      id: "15",
      name: "15 Days",
      days: 15,
      discount: 0,
      icon: Calendar,
      color: "from-[#FF7A30] to-[#ff9f43]",
    },

    {
      id: "30",
      name: "30 Days",
      days: 30,
      discount: 0,
      icon: Calendar,
      color: "from-[#0FAD6E] to-[#34d399]",
    },
  ];


  /* =======================================================
     STATES

     SAME STATES — DO NOT CHANGE
     ======================================================= */

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [breakfastEnabled, setBreakfastEnabled] =
    useState(false);

  const [selectedDuration, setSelectedDuration] =
    useState<Duration | null>(null);

  const [showBreakfastSelection, setShowBreakfastSelection] =
    useState(false);

  const [paymentSuccess, setPaymentSuccess] =
    useState(false);

  const [orderId, setOrderId] =
    useState<string | null>(null);


  /* =======================================================
     INVALID PLAN
     ======================================================= */

  if (!selectedPlan?.plan_id) {
    return (
      <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center px-6">

        <div className="w-full max-w-sm rounded-[2rem] bg-white p-7 text-center shadow-xl">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50">

            <Crown className="h-7 w-7 text-[#5F2EEA]" />

          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Invalid Plan
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Please select a subscription plan again.
          </p>

          <button
            onClick={onBack}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#FF7A30] to-[#5F2EEA] py-3.5 text-sm font-bold text-white shadow-lg"
          >
            Go Back
          </button>

        </div>

      </div>
    );
  }


  /* =======================================================
     END DATE

     ⚠️ API LOGIC — UNCHANGED
     ======================================================= */

  const getEndDate = (days: number) => {

    const d = new Date();

    d.setDate(
      d.getDate() + days - 1
    );

    return d.toISOString();
  };


  /* =======================================================
     PRICE CALCULATION

     ⚠️ API / PAYMENT LOGIC — UNCHANGED
     ======================================================= */

  const calculatePrice = (days: number) => {

    // Subscription price according to selected duration

    const planPrice =
      (Number(selectedPlan.price) / 30) *
      days;


    // Breakfast is optional and charged per day

    const breakfastTotal =
      breakfastEnabled &&
      selectedPlan.breakfast_price != null &&
      Number(selectedPlan.breakfast_price) > 0

        ? Number(
            selectedPlan.breakfast_price
          ) * days

        : 0;


    return Number(
      (
        planPrice +
        breakfastTotal
      ).toFixed(2)
    );
  };


  /* =======================================================
     SUBSCRIBE / PAYMENT FLOW

     ⚠️ IMPORTANT:
     IS FUNCTION KO TOUCH NAHI KIYA GAYA.
     ======================================================= */

  const handleSubscribe = async (
    duration: Duration
  ) => {

    try {

      setError("");


      /* =================================================
         TOKEN
         ================================================= */

      const token =
        localStorage.getItem("token");


      if (!token) {

        setError(
          "Please login first"
        );

        return;
      }


      /* =================================================
         CHECK ACTIVE SUBSCRIPTION
         ================================================= */

      const activeCheck =
        await fetch(
          "https://chef-backend-qh12.onrender.com/subscriptions/my-active",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const activeData =
        await activeCheck.json();


      if (
        activeData.has_active_subscription
      ) {

        alert(
          `You already have an active subscription until ${new Date(
            activeData.end_date
          ).toLocaleDateString()}`
        );

        return;
      }


      /* =================================================
         START LOADING
         ================================================= */

      setLoading(true);


      const finalPrice =
        calculatePrice(
          duration.days
        );


      /* =================================================
         CREATE ORDER

         ⚠️ UNCHANGED
         ================================================= */

      const orderRes =
        await fetch(
          "https://chef-backend-qh12.onrender.com/orders/",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({

              items: [
                {
                  menu_id:
                    selectedPlan.menu_id,

                  quantity: 1,
                },
              ],

              amount:
                finalPrice,

              is_subscription:
                true,

              address:
                localStorage.getItem(
                  "address"
                ) ||
                "Default Address",

              payment_method:
                localStorage.getItem(
                  "payment_method"
                ) ||
                "card",
            }),

          }
        );


      const orderData =
        await orderRes.json();


      if (!orderRes.ok) {

        throw new Error(
          "Order failed"
        );
      }


      /* =================================================
         CREATE PAYMENT

         ⚠️ UNCHANGED
         ================================================= */

      const paymentRes =
        await fetch(
          "https://chef-backend-qh12.onrender.com/orders/create-payment",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              order_id:
                orderData.id,
            }),
          }
        );


      const paymentData =
        await paymentRes.json();


      /* =================================================
         RAZORPAY

         ⚠️ UNCHANGED
         ================================================= */

      const result =
        await RazorpayCheckout.open({

          key:
            paymentData.key,

          amount:
            String(
              paymentData.amount
            ),

          currency:
            "INR",

          name:
            "Eat Unity",

          description:
            selectedPlan.title,

          order_id:
            paymentData.razorpay_order_id,

        });


      const response =
        result.response;


      /* =================================================
         VERIFY PAYMENT

         ⚠️ UNCHANGED
         ================================================= */

      const verify =
        await fetch(
          "https://chef-backend-qh12.onrender.com/orders/verify-payment",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({

              razorpay_order_id:
                response.razorpay_order_id,

              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_signature:
                response.razorpay_signature,

              order_id:
                orderData.id,

            }),
          }
        );


      if (!verify.ok) {

        throw new Error(
          "Payment verification failed"
        );
      }


      /* =================================================
         CREATE SUBSCRIPTION

         ⚠️ UNCHANGED
         ================================================= */

      const subRes =
        await fetch(
          "https://chef-backend-qh12.onrender.com/subscriptions/",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({

              chef_id:
                selectedPlan.chef_id,

              menu_id:
                selectedPlan.menu_id,

              plan_id:
                selectedPlan.plan_id,

              duration_days:
                duration.days,

              meals_per_day:
                breakfastEnabled
                  ? 3
                  : 2,

              breakfast_enabled:
                breakfastEnabled,

              breakfast_price:
                breakfastEnabled
                  ? selectedPlan.breakfast_price
                  : 0,

              delivery_days: [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
              ],

              delivery_time:
                "Lunch",

              address:
                localStorage.getItem(
                  "address"
                ) ||
                "Default Address",

              start_date:
                new Date().toISOString(),

              end_date:
                getEndDate(
                  duration.days
                ),

            }),
          }
        );


      const subText =
        await subRes.text();


      if (!subRes.ok) {

        throw new Error(
          subText
        );
      }


      /* =================================================
         SUCCESS

         ⚠️ UNCHANGED
         ================================================= */

      setOrderId(
        orderData.id
      );

      setPaymentSuccess(
        true
      );


    } catch (err: any) {

      console.log(
        "Subscription payment error:",
        err
      );


      const code =
        err?.code || "";

      const description =
        err?.description || "";

      const message =
        err?.message || "";


      const isPaymentCancelled =

        code ===
          "BAD_REQUEST_ERROR" ||

        code ===
          "PAYMENT_CANCELLED" ||

        code ===
          "USER_CANCELLED" ||

        description
          .toLowerCase()
          .includes("cancel") ||

        message
          .toLowerCase()
          .includes("cancel");


      if (
        isPaymentCancelled
      ) {

        setError("");

        return;
      }


      setError(

        description ||

        message ||

        "Payment could not be completed. Please try again."

      );


    } finally {

      setLoading(false);

    }

  };


  /* =========================================================
     ⬇️ YAHAN TAK CODE PASTE KARNA HAI
     
     ISKE BAAD AAPKA EXISTING:
     
     // SUCCESS SCREEN
     // BREAKFAST SELECTION
     // DURATION SELECTION
     // return (
     
     wala code aayega.
     
     US PART KO ABHI MAT LAGANA.
     ========================================================= */

    /* =========================================================
   PREMIUM UI START
   API / PAYMENT LOGIC ABOVE THIS SECTION IS UNCHANGED
========================================================= */


/* =========================================================
   PAYMENT SUCCESS SCREEN
========================================================= */

if (paymentSuccess) {
  return (
    <div className="min-h-screen bg-[#F7F6F3] px-5">

      <div className="flex min-h-screen items-center justify-center">

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >

          {/* SUCCESS CARD */}

          <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-7 text-center shadow-[0_25px_70px_rgba(30,20,70,0.12)]">

            {/* Decorative background */}

            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-100 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-purple-100 blur-3xl" />


            <div className="relative">

              {/* SUCCESS ICON */}

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.15,
                  type: "spring",
                  stiffness: 180,
                }}
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-[#0FAD6E] to-[#34D399] shadow-[0_15px_35px_rgba(15,173,110,0.25)]"
              >

                <Check
                  className="h-11 w-11 text-white"
                  strokeWidth={3}
                />

              </motion.div>


              {/* BADGE */}

              <div className="mx-auto mt-6 flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5">

                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />

                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-700">
                  Payment Successful
                </span>

              </div>


              <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                Subscription Activated
              </h1>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                Your personalized meal journey is officially ready.
              </p>


              {/* PLAN */}

              <div className="mt-7 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4 text-left">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF7A30] to-[#5F2EEA] text-xl shadow-sm">
                    {selectedPlan.emoji || "🍱"}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      Your plan
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-slate-800">
                      {selectedPlan.title}
                    </p>

                  </div>

                  <ShieldCheck className="h-5 w-5 text-[#0FAD6E]" />

                </div>

              </div>


              {/* ORDER ID */}

              {orderId && (
                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">

                  <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Order ID
                  </p>

                  <p className="mt-1 truncate text-[11px] font-semibold text-slate-600">
                    {orderId}
                  </p>

                </div>
              )}


              {/* ACTIONS */}

              <div className="mt-7 space-y-3">

                <button
                  onClick={onViewSubscriptions}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF7A30] to-[#5F2EEA] py-4 text-sm font-bold text-white shadow-[0_12px_25px_rgba(95,46,234,0.2)] transition active:scale-[0.98]"
                >

                  <Crown className="h-4 w-4" />

                  My Subscription

                  <ArrowRight className="h-4 w-4" />

                </button>


                <button
                  onClick={onGoHome}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
                >
                  Go To Home
                </button>

              </div>


              <div className="mt-6 flex items-center justify-center gap-1.5">

                <ShieldCheck className="h-3.5 w-3.5 text-[#0FAD6E]" />

                <span className="text-[9px] text-slate-400">
                  Secure payment • Verified chef • Eat Unity
                </span>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
}


/* =========================================================
   BREAKFAST SELECTION SCREEN
========================================================= */

if (
  showBreakfastSelection &&
  selectedDuration
) {

  const subscriptionPrice =
    (selectedPlan.price / 30) *
    selectedDuration.days;

  const breakfastTotal =
    breakfastEnabled &&
    selectedPlan.breakfast_price != null &&
    Number(selectedPlan.breakfast_price) > 0
      ? Number(selectedPlan.breakfast_price) *
        selectedDuration.days
      : 0;

  const totalPrice =
    subscriptionPrice +
    breakfastTotal;


  return (
    <div className="min-h-screen bg-[#F7F6F3] pb-10">


      {/* =====================================================
          PREMIUM HEADER
      ===================================================== */}

      <div className="relative overflow-hidden rounded-b-[2.6rem] bg-gradient-to-br from-[#24104D] via-[#5F2EEA] to-[#FF7A30] px-5 pb-8 pt-7">

        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-orange-300/20 blur-3xl" />


        <div className="relative">

          <button
            onClick={() => {
              setError("");
              setShowBreakfastSelection(false);
              setSelectedDuration(null);
              setBreakfastEnabled(false);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>


          <div className="mt-7">

            <div className="flex items-center gap-2">

              <Sparkles className="h-4 w-4 text-yellow-200" />

              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/60">
                Almost there
              </span>

            </div>

            <h1 className="mt-2 text-[28px] font-bold leading-tight text-white">
              Build your
              <span className="block text-orange-200">
                perfect meal plan
              </span>
            </h1>

            <p className="mt-3 text-xs leading-5 text-white/65">
              Customize your subscription before payment.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="space-y-5 px-5 pt-5">


        {/* ===================================================
            SELECTED PLAN
        =================================================== */}

        <div className="rounded-[1.8rem] bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-purple-100 text-2xl">
              {selectedPlan.emoji || "🍱"}
            </div>

            <div className="min-w-0 flex-1">

              <div className="flex items-center gap-1.5">

                <h2 className="truncate text-base font-bold text-slate-900">
                  {selectedPlan.title}
                </h2>

                <ShieldCheck className="h-4 w-4 shrink-0 text-[#0FAD6E]" />

              </div>

              {selectedPlan.chef_name && (
                <div className="mt-1 flex items-center gap-1.5">

                  <ChefHat className="h-3.5 w-3.5 text-orange-500" />

                  <p className="text-[10px] font-medium text-slate-500">
                    {selectedPlan.chef_name}
                  </p>

                </div>
              )}

            </div>

          </div>


          {/* DURATION */}

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-purple-50 px-4 py-3">

            <div className="flex items-center gap-2">

              <Calendar className="h-4 w-4 text-[#5F2EEA]" />

              <span className="text-xs font-semibold text-purple-800">
                {selectedDuration.name}
              </span>

            </div>

            <span className="text-sm font-bold text-[#5F2EEA]">
              ₹{subscriptionPrice.toFixed(2)}
            </span>

          </div>

        </div>


        {/* ===================================================
            BREAKFAST
        =================================================== */}

        <div>

          <div className="mb-3 flex items-end justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Customize
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Add breakfast?
              </h2>

            </div>

            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold text-orange-600">
              Optional
            </span>

          </div>


          {/* BREAKFAST AVAILABLE */}

          <button
            type="button"
            onClick={() => {
              setBreakfastEnabled(true);
            }}
            className={`relative w-full overflow-hidden rounded-[1.7rem] border p-4 text-left transition-all ${
              breakfastEnabled
                ? "border-emerald-400 bg-emerald-50 shadow-[0_8px_25px_rgba(16,185,129,0.12)]"
                : "border-slate-200 bg-white"
            }`}
          >

            {breakfastEnabled && (
              <div className="absolute right-0 top-0 rounded-bl-2xl bg-emerald-500 px-3 py-1.5 text-[8px] font-bold text-white">
                SELECTED
              </div>
            )}

            <div className="flex items-center gap-4">

              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${
                  breakfastEnabled
                    ? "bg-white"
                    : "bg-orange-50"
                }`}
              >
                🍳
              </div>

              <div className="flex-1">

                <div className="flex items-center gap-2">

                  <h3 className="text-sm font-bold text-slate-900">
                    Daily Breakfast
                  </h3>

                  <Leaf className="h-3.5 w-3.5 text-emerald-500" />

                </div>

                <p className="mt-1 text-[10px] leading-5 text-slate-500">
                  Start your day with a fresh chef-prepared meal.
                </p>

                <p className="mt-2 text-xs font-bold text-emerald-600">
                  +₹{selectedPlan.breakfast_price}/day
                </p>

              </div>

              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                  breakfastEnabled
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-slate-200"
                }`}
              >

                {breakfastEnabled && (
                  <Check className="h-4 w-4 text-white" />
                )}

              </div>

            </div>

          </button>


          {/* NO BREAKFAST */}

          <button
            type="button"
            onClick={() => {
              setBreakfastEnabled(false);
            }}
            className={`mt-3 w-full rounded-[1.7rem] border p-4 text-left transition-all ${
              !breakfastEnabled
                ? "border-[#5F2EEA] bg-purple-50"
                : "border-slate-200 bg-white"
            }`}
          >

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                🍽️
              </div>

              <div className="flex-1">

                <h3 className="text-sm font-bold text-slate-800">
                  Continue without breakfast
                </h3>

                <p className="mt-1 text-[10px] text-slate-500">
                  Keep your subscription focused on lunch & dinner.
                </p>

              </div>

              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                  !breakfastEnabled
                    ? "border-[#5F2EEA] bg-[#5F2EEA]"
                    : "border-slate-200"
                }`}
              >

                {!breakfastEnabled && (
                  <Check className="h-4 w-4 text-white" />
                )}

              </div>

            </div>

          </button>

        </div>


        {/* ===================================================
            PRICE SUMMARY
        =================================================== */}

        <div className="overflow-hidden rounded-[1.8rem] bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Checkout
                </p>

                <h3 className="mt-1 text-base font-bold text-slate-900">
                  Price Summary
                </h3>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50">

                <Crown className="h-4 w-4 text-[#5F2EEA]" />

              </div>

            </div>

          </div>


          <div className="space-y-3 p-5">

            <div className="flex items-center justify-between">

              <span className="text-xs text-slate-500">
                Subscription · {selectedDuration.days} days
              </span>

              <span className="text-sm font-semibold text-slate-800">
                ₹{subscriptionPrice.toFixed(2)}
              </span>

            </div>


            {breakfastEnabled && (
              <div className="flex items-center justify-between">

                <span className="text-xs text-slate-500">
                  Breakfast · {selectedDuration.days} days
                </span>

                <span className="text-sm font-semibold text-emerald-600">
                  ₹{breakfastTotal.toFixed(2)}
                </span>

              </div>
            )}


            <div className="my-4 border-t border-dashed border-slate-200" />


            <div className="flex items-end justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Total payable
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Secure payment via Razorpay
                </p>

              </div>

              <span className="text-2xl font-bold tracking-tight text-slate-900">
                ₹{totalPrice.toFixed(2)}
              </span>

            </div>

          </div>

        </div>


        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-red-100 bg-red-50 p-4"
          >

            <p className="text-xs font-medium leading-5 text-red-600">
              {error}
            </p>

          </motion.div>
        )}


        {/* ===================================================
            PAYMENT CTA
        =================================================== */}

        <button
          onClick={() =>
            handleSubscribe(selectedDuration)
          }
          disabled={loading}
          className={`group flex w-full items-center justify-center gap-2 rounded-[1.4rem] py-4 text-sm font-bold text-white shadow-[0_12px_30px_rgba(95,46,234,0.22)] transition ${
            loading
              ? "cursor-not-allowed bg-slate-400"
              : "bg-gradient-to-r from-[#FF7A30] via-[#FF6B3D] to-[#5F2EEA] active:scale-[0.98]"
          }`}
        >

          {loading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

              Processing Payment...
            </>
          ) : (
            <>
              <span>
                Continue to Payment
              </span>

              <span className="rounded-lg bg-white/15 px-2 py-1">
                ₹{totalPrice.toFixed(2)}
              </span>

              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}

        </button>


        {/* TRUST */}

        <div className="flex items-center justify-center gap-1.5 pb-4">

          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />

          <span className="text-[9px] text-slate-400">
            Secure checkout • Your payment is protected
          </span>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   DURATION SELECTION SCREEN
========================================================= */

return (
  <div className="min-h-screen bg-[#F7F6F3] pb-10">


    {/* =====================================================
        PREMIUM HERO
    ===================================================== */}

    <div className="relative overflow-hidden rounded-b-[2.7rem] bg-gradient-to-br from-[#24104D] via-[#5F2EEA] to-[#FF7A30] px-5 pb-9 pt-7 shadow-[0_15px_40px_rgba(95,46,234,0.18)]">

      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 left-0 h-52 w-52 rounded-full bg-orange-300/20 blur-3xl" />

      <div className="relative">

        {/* TOP BAR */}

        <div className="flex items-center justify-between">

          <button
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>


          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">

            <Crown className="h-3.5 w-3.5 text-yellow-200" />

            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white">
              Premium Plan
            </span>

          </div>

        </div>


        {/* HERO */}

        <div className="mt-9">

          <div className="flex items-center gap-2">

            <Sparkles className="h-4 w-4 text-yellow-200" />

            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/60">
              Flexible membership
            </span>

          </div>


          <h1 className="mt-2 text-[30px] font-bold leading-[1.08] tracking-tight text-white">
            Choose your
            <span className="block text-orange-200">
              perfect duration.
            </span>
          </h1>


          <p className="mt-4 max-w-sm text-xs leading-6 text-white/65">
            Stay consistent with chef-prepared meals
            delivered around your routine.
          </p>

        </div>


        {/* PLAN MINI CARD */}

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl">
              {selectedPlan.emoji || "🍱"}
            </div>

            <div className="min-w-0 flex-1">

              <div className="flex items-center gap-1.5">

                <p className="truncate text-sm font-bold text-white">
                  {selectedPlan.title}
                </p>

                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-200" />

              </div>

              {selectedPlan.chef_name && (
                <p className="mt-1 text-[10px] text-white/60">
                  Crafted by {selectedPlan.chef_name}
                </p>
              )}

            </div>

            <div className="text-right">

              <p className="text-[8px] uppercase tracking-wider text-white/50">
                Base
              </p>

              <p className="text-base font-bold text-white">
                ₹{selectedPlan.price}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>


    {/* =====================================================
        PLAN INFORMATION
    ===================================================== */}

    <div className="px-5 pt-5">

      <div className="rounded-[1.8rem] bg-white p-4 shadow-sm">

        <div className="flex flex-wrap gap-2">

          {selectedPlan.goal && (
            <div className="flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5">

              <span className="text-[10px]">
                🎯
              </span>

              <span className="text-[9px] font-bold text-purple-700">
                {selectedPlan.goal}
              </span>

            </div>
          )}


          {selectedPlan.diet_type && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5">

              <Leaf className="h-3 w-3 text-emerald-600" />

              <span className="text-[9px] font-bold text-emerald-700">
                {selectedPlan.diet_type}
              </span>

            </div>
          )}


          {selectedPlan.calories_per_day && (
            <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5">

              <Flame className="h-3 w-3 text-orange-500" />

              <span className="text-[9px] font-bold text-orange-700">
                {selectedPlan.calories_per_day} kcal
              </span>

            </div>
          )}

        </div>

      </div>

    </div>


    {/* =====================================================
        ERROR
    ===================================================== */}

    {error && (
      <div className="px-5 pt-4">

        <motion.div
          initial={{
            opacity: 0,
            y: -8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-2xl border border-red-100 bg-red-50 p-4"
        >

          <p className="text-xs font-medium text-red-600">
            {error}
          </p>

        </motion.div>

      </div>
    )}


    {/* =====================================================
        DURATION OPTIONS
    ===================================================== */}

    <div className="px-5 pt-7">

      <div className="mb-4 flex items-end justify-between">

        <div>

          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Membership
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            Select duration
          </h2>

        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50">

          <Calendar className="h-4 w-4 text-[#5F2EEA]" />

        </div>

      </div>


      <div className="space-y-4">

        {durations.map((d, index) => {

          const Icon = d.icon;

          const subscriptionPrice =
            (selectedPlan.price / 30) *
            d.days;

          const pricePerDay =
            subscriptionPrice /
            d.days;

          const isBestValue =
            d.days === 30;

          return (
            <motion.div
              key={d.id}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.08,
                duration: 0.4,
              }}
            >

              <button
                onClick={() => {

                  /* =========================================
                     EXISTING LOGIC — UNCHANGED
                  ========================================= */

                  setError("");

                  setSelectedDuration(d);


                  if (
                    selectedPlan.breakfast_price != null &&
                    Number(
                      selectedPlan.breakfast_price
                    ) > 0
                  ) {

                    setBreakfastEnabled(false);

                    setShowBreakfastSelection(true);

                  } else {

                    handleSubscribe(d);

                  }

                }}
                disabled={loading}
                className="group w-full text-left"
              >

                <div
                  className={`rounded-[1.9rem] p-[1px] transition-all ${
                    isBestValue
                      ? "bg-gradient-to-r from-[#0FAD6E] via-[#34D399] to-[#5F2EEA]"
                      : "bg-slate-200"
                  }`}
                >

                  <div className="relative overflow-hidden rounded-[1.85rem] bg-white p-5 shadow-sm transition-all group-hover:-translate-y-0.5 group-hover:shadow-xl">

                    {/* BEST VALUE */}

                    {isBestValue && (
                      <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider text-white shadow-sm">

                        <Sparkles className="h-3 w-3" />

                        Best Value

                      </div>
                    )}


                    <div className="flex items-center gap-4">

                      {/* ICON */}

                      <div
                        className={`flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-[1.3rem] bg-gradient-to-br ${d.color} shadow-lg`}
                      >

                        <Icon
                          className="h-6 w-6 text-white"
                          strokeWidth={2}
                        />

                      </div>


                      {/* CONTENT */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-2">

                          <h3 className="text-lg font-bold text-slate-900">
                            {d.name}
                          </h3>

                        </div>


                        <p className="mt-1 text-[10px] text-slate-400">
                          Perfect for{" "}
                          {d.days <= 7
                            ? "trying the routine"
                            : d.days <= 15
                            ? "building consistency"
                            : "long-term commitment"}
                        </p>


                        <div className="mt-3 flex items-center gap-2">

                          <span className="text-lg font-bold text-slate-900">
                            ₹{subscriptionPrice.toFixed(0)}
                          </span>

                          <span className="text-[9px] text-slate-400">
                            total
                          </span>

                        </div>

                      </div>


                      {/* ARROW */}

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all group-hover:bg-purple-50 group-hover:text-[#5F2EEA]">

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />

                      </div>

                    </div>


                    {/* BOTTOM INFO */}

                    <div className="mt-5 grid grid-cols-2 gap-2">

                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">

                        <Clock3 className="h-3.5 w-3.5 text-[#5F2EEA]" />

                        <div>

                          <p className="text-[8px] text-slate-400">
                            Per day
                          </p>

                          <p className="text-[10px] font-bold text-slate-700">
                            ₹{pricePerDay.toFixed(2)}
                          </p>

                        </div>

                      </div>


                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">

                        <Utensils className="h-3.5 w-3.5 text-orange-500" />

                        <div>

                          <p className="text-[8px] text-slate-400">
                            Meals
                          </p>

                          <p className="text-[10px] font-bold text-slate-700">
                            2 daily
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* BREAKFAST */}

                    {selectedPlan.breakfast_price != null &&
                      Number(
                        selectedPlan.breakfast_price
                      ) > 0 && (

                        <div className="mt-3 flex items-center justify-between rounded-xl bg-orange-50 px-3 py-2.5">

                          <div className="flex items-center gap-2">

                            <span className="text-sm">
                              🍳
                            </span>

                            <span className="text-[9px] font-semibold text-orange-700">
                              Breakfast available
                            </span>

                          </div>

                          <span className="text-[9px] font-bold text-orange-600">
                            +₹
                            {Number(
                              selectedPlan.breakfast_price
                            )}
                            /day
                          </span>

                        </div>

                      )}


                    {/* CTA TEXT */}

                    <div className="mt-4 flex items-center justify-between">

                      <span className="text-[9px] font-semibold text-slate-400">
                        Tap to continue
                      </span>

                      <span className="flex items-center gap-1 text-[9px] font-bold text-[#5F2EEA]">

                        Customize

                        <ArrowRight className="h-3 w-3" />

                      </span>

                    </div>

                  </div>

                </div>

              </button>

            </motion.div>
          );

        })}

      </div>

    </div>


    {/* =====================================================
        TRUST FOOTER
    ===================================================== */}

    <div className="px-5 pt-7">

      <div className="relative overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-[#24104D] to-[#5F2EEA] p-5 text-white">

        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />

        <div className="relative flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">

            <ShieldCheck className="h-5 w-5 text-emerald-200" />

          </div>

          <div>

            <h3 className="text-xs font-bold">
              Simple. Flexible. Personal.
            </h3>

            <p className="mt-1 text-[9px] leading-5 text-white/55">
              Choose your duration, customize breakfast,
              and continue securely to payment.
            </p>

          </div>

        </div>

      </div>

    </div>


    {/* =====================================================
        LOADING OVERLAY
    ===================================================== */}

    {loading && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-6 backdrop-blur-sm">

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="w-full max-w-xs rounded-[2rem] bg-white p-6 text-center shadow-2xl"
        >

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50">

            <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-200 border-t-[#5F2EEA]" />

          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-900">
            Preparing your checkout
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-slate-400">
            Please don't close the app while we prepare
            your secure payment.
          </p>

        </motion.div>

      </div>
    )}

  </div>
);
}