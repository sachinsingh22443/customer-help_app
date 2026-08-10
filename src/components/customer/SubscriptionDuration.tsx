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
duration_days?: number;

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
  // Plan price is the 30-day/month price
  const planPrice =
    (selectedPlan.price / 30) * days;

  // Breakfast is charged per day
  const breakfastTotal =
    breakfastEnabled &&
    selectedPlan.breakfast_available &&
    selectedPlan.breakfast_price
      ? selectedPlan.breakfast_price * days
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SUCCESS SCREEN
  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#FFF8F0]">
        <p className="text-gray-500 mb-6">
           Your subscription has been activated successfully.
         </p>

         <p className="text-sm text-orange-600 font-medium mb-4">
         {selectedPlan.title}
         </p>

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

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-8">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <button onClick={onBack} className="text-white mb-6">
          ← Back
        </button>

        <h1 className="text-white text-xl font-semibold mb-2">
          Subscription Summary
        </h1>
      </div>

      {/* PLAN INFO */}
      <div className="px-6 mt-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold">{selectedPlan.title}</h2>
          <p className="text-orange-500 font-bold">
            ₹{selectedPlan.price}
          </p>

          {selectedPlan.tagline && (
        <p className="text-xs text-gray-500">
        {selectedPlan.tagline}
       </p>
        )}

          {selectedPlan.chef_name && (
         <p className="text-sm font-medium text-orange-600">
          👨‍🍳 {selectedPlan.chef_name}
          </p>
         )}

          <p className="text-sm text-gray-500">
          {selectedPlan.goal}
           </p>

         <p className="text-sm text-gray-500">
         {selectedPlan.diet_type}
        </p>

        <p className="text-sm text-gray-500">
        {selectedPlan.plan_type === "normal" && "🥗 Normal Diet"}
        {selectedPlan.plan_type === "dietician" && "👨‍⚕️ Dietician Support"}
        {selectedPlan.plan_type === "gym" && "💪 Gym + Diet + Trainer"}
        </p>

         <p className="text-sm text-gray-500">
          🔥 {selectedPlan.calories_per_day} kcal/day
         </p>
        </div>
        </div>





        {selectedPlan.breakfast_available && (
  <div className="px-6 mt-6">
    <div className="bg-white p-5 rounded-2xl shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <h3 className="font-semibold text-gray-900">
            🥣 Breakfast
          </h3>

          <p className="text-sm text-gray-500">
            Optional meal
          </p>

          <p className="text-sm text-orange-500 font-semibold mt-1">
            ₹{selectedPlan.breakfast_price}/day
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setBreakfastEnabled((prev) => !prev)
          }
          className={`px-4 py-2 rounded-xl font-semibold ${
            breakfastEnabled
              ? "bg-green-500 text-white"
              : "bg-orange-500 text-white"
          }`}
        >
          {breakfastEnabled
            ? "✓ Added"
            : "+ Add Breakfast"}
        </button>

      </div>

      

    </div>
  </div>
)}

      {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}

      {/* DURATIONS */}
      <div className="px-6 mt-6 space-y-4">

        {durations.map((d, index) => {
  const Icon = d.icon;
  const finalPrice = calculatePrice(d.days);

  return (
    <motion.div
      key={d.id}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <button
        onClick={() => handleSubscribe(d)}
        disabled={loading}
        className={`w-full p-5 rounded-xl shadow-md transition-all ${
          loading
            ? "bg-gray-200 opacity-70 cursor-not-allowed"
            : "bg-white hover:shadow-lg active:scale-95"
        }`}
      >
        <div className="flex items-center gap-4">

          <div
            className={`w-14 h-14 bg-gradient-to-br ${d.color} rounded-xl flex items-center justify-center`}
          >
            <Icon className="text-white" />
          </div>

          <div className="flex-1 text-left">
            <h3 className="text-lg font-semibold">
              {loading ? "Processing..." : d.name}
            </h3>
        <p className="text-sm text-gray-500">
         Subscription: ₹
          {((selectedPlan.price / 30) * d.days).toFixed(2)}
        </p>

            {breakfastEnabled &&
              selectedPlan.breakfast_available &&
              selectedPlan.breakfast_price && (
                <p className="text-sm text-green-600">
                  Breakfast: ₹
                  {selectedPlan.breakfast_price * d.days}
                </p>
              )}

            <p className="text-xl font-bold text-orange-500 mt-2">
              Total: ₹{finalPrice}
            </p>
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