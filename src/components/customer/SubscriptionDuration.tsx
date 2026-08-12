import { useState } from "react";
import { motion } from "motion/react";
import { Calendar} from "lucide-react";
import { Checkout as RazorpayCheckout } from "capacitor-razorpay";

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

interface Duration {
  id: string;
  name: string;
  days: number;
  discount: number;
  icon: React.ComponentType<any>;
  color: string;
}

interface Props {
  selectedPlan: SelectedPlan;
  onBack: () => void;
  onViewSubscriptions: () => void;
  onGoHome: () => void;
}


export function SubscriptionDuration({
  selectedPlan,
  onBack,
  onViewSubscriptions,
  onGoHome,
}: Props) {

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [breakfastEnabled, setBreakfastEnabled] = useState(false);
  const [selectedDuration, setSelectedDuration] =
  useState<Duration | null>(null);

  const [showBreakfastSelection, setShowBreakfastSelection] =
  useState(false);

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  if (!selectedPlan?.plan_id) {
    return <div className="p-6 text-center">Invalid plan</div>;
  }

  const getEndDate = (days: number) => {
  const d = new Date();

  d.setDate(d.getDate() + days - 1);

  return d.toISOString();
};

  const calculatePrice = (days: number) => {
  // Subscription price according to selected duration
  const planPrice =
    (Number(selectedPlan.price) / 30) * days;

  // Breakfast is optional and charged per day
  const breakfastTotal =
    breakfastEnabled &&
    selectedPlan.breakfast_price != null &&
    Number(selectedPlan.breakfast_price) > 0
      ? Number(selectedPlan.breakfast_price) * days
      : 0;

  return Number(
    (planPrice + breakfastTotal).toFixed(2)
  );
};

  const handleSubscribe = async (duration: Duration) => {
    try {
      setError("");

      const token = localStorage.getItem("token");

if (!token) {
  setError("Please login first");
  return;
}

// ✅ CHECK ACTIVE SUBSCRIPTION FIRST
const activeCheck = await fetch(
  "https://chef-backend-qh12.onrender.com/subscriptions/my-active",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const activeData = await activeCheck.json();

if (activeData.has_active_subscription) {
  alert(
    `You already have an active subscription until ${new Date(
      activeData.end_date
    ).toLocaleDateString()}`
  );

  return;
}

setLoading(true);

const finalPrice = calculatePrice(duration.days);

      // 🔥 CREATE ORDER (SEND EXACT AMOUNT)
      const orderRes = await fetch("https://chef-backend-qh12.onrender.com/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
         items: [
    {
      menu_id: selectedPlan.menu_id,
      quantity: 1,
    },
  ],
  amount: finalPrice,
  is_subscription: true,
  address: localStorage.getItem("address") || "Default Address",
  payment_method:
    localStorage.getItem("payment_method") || "card",
}),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error("Order failed");

      // 🔥 CREATE PAYMENT
      const paymentRes = await fetch(
        "https://chef-backend-qh12.onrender.com/orders/create-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order_id: orderData.id,
          }),
        }
      );

      const paymentData = await paymentRes.json();

      

  const result = await RazorpayCheckout.open({
  key: paymentData.key,
  amount: String(paymentData.amount),
  currency: "INR",
  name: "Eat Unity",
  description: selectedPlan.title,
  order_id: paymentData.razorpay_order_id,
});


const response = result.response;

// ✅ VERIFY PAYMENT
// console.log("VERIFY START");
const verify = await fetch(
  "https://chef-backend-qh12.onrender.com/orders/verify-payment",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      order_id: orderData.id,
    }),
  }
);

// console.log("VERIFY STATUS =", verify.status);
// console.log("VERIFY DONE");

if (!verify.ok) {
  throw new Error("Payment verification failed");
}

// ✅ CREATE SUBSCRIPTION
const subRes = await fetch(
  "https://chef-backend-qh12.onrender.com/subscriptions/",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      chef_id: selectedPlan.chef_id,
      menu_id: selectedPlan.menu_id,
      plan_id: selectedPlan.plan_id,
      duration_days: duration.days,
      meals_per_day: breakfastEnabled ? 3 : 2,

      breakfast_enabled: breakfastEnabled,

      breakfast_price: breakfastEnabled
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
      delivery_time: "Lunch",
      address: localStorage.getItem("address") || "Default Address",
      start_date: new Date().toISOString(),
      end_date: getEndDate(duration.days),
    }),
  }
);

// console.log("SUB STATUS =", subRes.status);

const subText = await subRes.text();

// console.log("SUB RESPONSE =", subText);

if (!subRes.ok) {
  throw new Error(subText);
}

// ✅ SUCCESS SCREEN
setOrderId(orderData.id);
setPaymentSuccess(true);



    } catch (err: any) {
  console.log("Subscription payment error:", err);

  const code =
    err?.code ||
    err?.response?.code ||
    "";

  const description =
    err?.description ||
    err?.response?.description ||
    "";

  const message =
    err?.message ||
    "";

  // User manually exited/cancelled Razorpay
  const isPaymentCancelled =
    code === "BAD_REQUEST_ERROR" ||
    code === "PAYMENT_CANCELLED" ||
    code === "USER_CANCELLED" ||
    description.toLowerCase().includes("cancel") ||
    message.toLowerCase().includes("cancel");

  if (isPaymentCancelled) {
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

  // 🔥 SUCCESS SCREEN
    // =========================================================
  // PAYMENT SUCCESS SCREEN
  // =========================================================

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#FFF8F0]">

        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5">
          <span className="text-4xl">✓</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Subscription Activated
        </h1>

        <p className="text-gray-500 mb-6">
          Your subscription has been activated successfully.
        </p>

        <p className="text-sm text-orange-600 font-medium mb-4">
          {selectedPlan.title}
        </p>

        {orderId && (
          <p className="text-xs text-gray-400 mb-6">
            Order ID: {orderId}
          </p>
        )}

        <button
          onClick={onViewSubscriptions}
          className="w-full bg-orange-500 text-white py-3 rounded-lg mb-3"
        >
          My Subscription
        </button>

        <button
          onClick={onGoHome}
          className="w-full border border-orange-500 text-orange-500 py-3 rounded-lg"
        >
          Go To Home
        </button>

      </div>
    );
  }


  // =========================================================
  // BREAKFAST SELECTION SCREEN
  // =========================================================

  if (showBreakfastSelection && selectedDuration) {

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
      subscriptionPrice + breakfastTotal;

    return (
      <div className="min-h-screen bg-[#FFF8F0] pb-8">

        {/* HEADER */}
        <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-8 rounded-b-[2rem]">

          <button
            onClick={() => {
              setShowBreakfastSelection(false);
              setSelectedDuration(null);
              setBreakfastEnabled(false);
            }}
            className="text-white mb-6"
          >
            ← Back
          </button>

          <h1 className="text-white text-xl font-semibold">
            Choose Your Meals
          </h1>

          <p className="text-white/90 text-sm mt-1">
            Select your meals for this subscription
          </p>

        </div>


        {/* CONTENT */}
        <div className="px-6 mt-6 space-y-4">

          {/* SELECTED DURATION */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">

            <div className="flex justify-between items-center">

              <div>
                <p className="text-xs text-gray-500">
                  Selected Duration
                </p>

                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedDuration.name}
                </h2>
              </div>

              <div className="text-right">

                <p className="text-xs text-gray-500">
                  Subscription
                </p>

                <p className="text-lg font-bold text-orange-500">
                  ₹{subscriptionPrice.toFixed(2)}
                </p>

              </div>

            </div>

          </div>


          {/* BREAKFAST */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">

            <div className="flex items-start justify-between gap-4">

              <div className="flex-1">

                <div className="flex items-center gap-2">

                  <span className="text-2xl">
                    🍳
                  </span>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Breakfast
                    </h3>

                    <p className="text-sm text-gray-500">
                      ₹{selectedPlan.breakfast_price}/day
                    </p>
                  </div>

                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Breakfast is optional. You can choose
                  whether you want breakfast with your
                  subscription.
                </p>

              </div>

            </div>


            {/* ADD BREAKFAST */}
            <button
              type="button"
              onClick={() => {
                setBreakfastEnabled(true);
              }}
              className={`w-full mt-4 py-3 rounded-xl font-semibold transition ${
                breakfastEnabled
                  ? "bg-green-500 text-white"
                  : "bg-orange-500 text-white"
              }`}
            >
              {breakfastEnabled
                ? "✓ Breakfast Added"
                : "Add Breakfast"}
            </button>


            {/* NO BREAKFAST */}
            <button
              type="button"
              onClick={() => {
                setBreakfastEnabled(false);
              }}
              className={`w-full mt-3 py-3 rounded-xl font-semibold border transition ${
                !breakfastEnabled
                  ? "border-orange-500 text-orange-500 bg-orange-50"
                  : "border-gray-200 text-gray-700 bg-white"
              }`}
            >
              {!breakfastEnabled
                ? "✓ No Breakfast"
                : "Don't Add Breakfast"}
            </button>

          </div>


          {/* PRICE SUMMARY */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">

            <h3 className="font-semibold text-gray-900 mb-4">
              Price Summary
            </h3>

            {/* SUBSCRIPTION */}
            <div className="flex justify-between items-center mb-3">

              <span className="text-sm text-gray-600">
                Subscription ({selectedDuration.days} days)
              </span>

              <span className="font-semibold">
                ₹{subscriptionPrice.toFixed(2)}
              </span>

            </div>


            {/* BREAKFAST */}
            {breakfastEnabled && (
              <div className="flex justify-between items-center mb-3">

                <span className="text-sm text-gray-600">
                  Breakfast ({selectedDuration.days} days)
                </span>

                <span className="font-semibold text-green-600">
                  ₹{breakfastTotal.toFixed(2)}
                </span>

              </div>
            )}


            <div className="border-t pt-4 mt-4 flex justify-between items-center">

              <span className="font-bold text-gray-900">
                Total
              </span>

              <span className="text-2xl font-bold text-orange-500">
                ₹{totalPrice.toFixed(2)}
              </span>

            </div>

          </div>


          {/* CONTINUE PAYMENT */}
          <button
            onClick={() =>
              handleSubscribe(selectedDuration)
            }
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 active:scale-[0.98]"
            }`}
          >
            {loading
              ? "Processing..."
              : `Continue to Payment • ₹${totalPrice.toFixed(2)}`}
          </button>

        </div>

      </div>
    );
  }


  // =========================================================
  // DURATION SELECTION SCREEN
  // =========================================================

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-8">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-8 rounded-b-[2rem]">

        <button
          onClick={onBack}
          className="text-white mb-6"
        >
          ← Back
        </button>

        <h1 className="text-white text-xl font-semibold mb-2">
          Choose Subscription Duration
        </h1>

        <p className="text-white/90 text-sm">
          Select how many days you want your subscription
        </p>

      </div>


      {/* PLAN INFO */}
      <div className="px-6 mt-4">

        <div className="bg-white p-4 rounded-xl shadow-sm">

          <div className="flex justify-between items-start gap-3">

            <div>

              <h2 className="font-semibold text-gray-900">
                {selectedPlan.emoji || "🍱"}{" "}
                {selectedPlan.title}
              </h2>

              {selectedPlan.tagline && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedPlan.tagline}
                </p>
              )}

              {selectedPlan.chef_name && (
                <p className="text-sm font-medium text-orange-600 mt-2">
                  👨‍🍳 {selectedPlan.chef_name}
                </p>
              )}

            </div>

            <div className="text-right">

              <p className="text-xs text-gray-500">
                30 Days
              </p>

              <p className="text-lg font-bold text-orange-500">
                ₹{selectedPlan.price}
              </p>

            </div>

          </div>


          <div className="flex flex-wrap gap-2 mt-3">

            {selectedPlan.goal && (
              <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs">
                {selectedPlan.goal}
              </span>
            )}

            {selectedPlan.diet_type && (
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                {selectedPlan.diet_type}
              </span>
            )}

            {selectedPlan.plan_type && (
              <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs">

                {selectedPlan.plan_type === "normal" &&
                  "🥗 Normal Diet"}

                {selectedPlan.plan_type === "dietician" &&
                  "👨‍⚕️ Dietician Support"}

                {selectedPlan.plan_type === "gym" &&
                  "💪 Gym + Diet + Trainer"}

              </span>
            )}

          </div>

        </div>

      </div>


      {/* ERROR */}
      {error && (
        <div className="px-6 mt-4">

          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
            {error}
          </div>

        </div>
      )}


      {/* DURATIONS */}
      <div className="px-6 mt-6 space-y-4">

        <h2 className="font-semibold text-gray-900">
          Select Duration
        </h2>

        {durations.map((d, index) => {

          const Icon = d.icon;

          const subscriptionPrice =
            (selectedPlan.price / 30) *
            d.days;

          return (
            <motion.div
              key={d.id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.1,
              }}
            >

              <button
                onClick={() => {

  setSelectedDuration(d);

  // 🍳 Chef ne breakfast price set ki hai
  // to breakfast selection screen show karo
  if (
    selectedPlan.breakfast_price != null &&
    Number(selectedPlan.breakfast_price) > 0
  ) {

    setBreakfastEnabled(false);
    setShowBreakfastSelection(true);

  } else {

    // Breakfast configured nahi hai
    // to direct payment
    handleSubscribe(d);

  }

}}
                disabled={loading}
                className={`w-full p-5 rounded-xl shadow-md transition-all ${
                  loading
                    ? "bg-gray-200 opacity-70 cursor-not-allowed"
                    : "bg-white hover:shadow-lg active:scale-95"
                }`}
              >

                <div className="flex items-center gap-4">

                  {/* ICON */}
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${d.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="text-white" />
                  </div>


                  {/* CONTENT */}
                  <div className="flex-1 text-left">

                    <h3 className="text-lg font-semibold text-gray-900">
                      {d.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Subscription: ₹
                      {subscriptionPrice.toFixed(2)}
                    </p>

                    {selectedPlan.breakfast_price != null &&
  Number(selectedPlan.breakfast_price) > 0 && (
    <p className="text-xs text-orange-500 mt-1">
      🍳 Breakfast available • ₹
      {Number(selectedPlan.breakfast_price)}/day
    </p>
  )}

                  </div>


                  {/* ARROW */}
                  <div className="text-gray-400 text-xl">
                    →
                  </div>

                </div>

              </button>

            </motion.div>
          );
        })}

      </div>

    </div>
  );
}