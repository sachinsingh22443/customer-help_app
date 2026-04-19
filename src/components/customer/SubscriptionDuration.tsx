import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, TrendingUp, Zap } from "lucide-react";

interface SelectedPlan {
  plan_id: string;
  title: string;
  price: number;

  chef_id: string;
  menu_id: string;
  menu_name: string;
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
}

const durations: Duration[] = [
  {
    id: "weekly",
    name: "7 Days",
    days: 7,
    discount: 0,
    icon: Zap,
    color: "from-[#0FAD6E] to-[#3ec98d]",
  },
  {
    id: "biweekly",
    name: "15 Days",
    days: 15,
    discount: 10,
    icon: TrendingUp,
    color: "from-[#FF7A30] to-[#ff9d5c]",
  },
  {
    id: "monthly",
    name: "30 Days",
    days: 30,
    discount: 20,
    icon: Calendar,
    color: "from-[#5F2EEA] to-[#8860f5]",
  },
];

export function SubscriptionDuration({ selectedPlan, onBack }: Props) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  if (!selectedPlan?.plan_id) {
    return <div className="p-6 text-center">Invalid plan</div>;
  }

  const getEndDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  const calculatePrice = (days: number, discount: number) => {
    const perDay = selectedPlan.price / 30;
    const base = perDay * days;
    const discounted = base * (1 - discount / 100);
    return Math.round(discounted);
  };

  const handleSubscribe = async (duration: Duration) => {
    try {
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        return;
      }

      setLoading(true);

      const finalPrice = calculatePrice(duration.days, duration.discount);

      // 🔥 CREATE ORDER (SEND EXACT AMOUNT)
      const orderRes = await fetch("https://chef-backend-1.onrender.com/orders/", {
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
          amount: finalPrice, // 🔥 IMPORTANT FIX
          address: localStorage.getItem("address") || "Default Address",
          payment_method: "card",
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error("Order failed");

      // 🔥 CREATE PAYMENT
      const paymentRes = await fetch(
        "https://chef-backend-1.onrender.com/orders/create-payment",
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

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: "INR",
        name: "Food App",
        description: selectedPlan.title,
        order_id: paymentData.razorpay_order_id,

        handler: async function (response: any) {

          await fetch("https://chef-backend-1.onrender.com/orders/verify-payment", {
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
          });

          // 🔥 CREATE SUBSCRIPTION
          await fetch("https://chef-backend-1.onrender.com/subscriptions/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              chef_id: selectedPlan.chef_id,
              menu_id: selectedPlan.menu_id,
              dish_name: selectedPlan.menu_name,
              plan_id: selectedPlan.plan_id,
              meals_per_day: 2,
              delivery_days: ["Mon", "Tue", "Wed"],
              delivery_time: "Lunch",
              address: localStorage.getItem("address") || "Default Address",
              start_date: new Date().toISOString(),
              end_date: getEndDate(duration.days),
            }),
          });

          setOrderId(orderData.id);
          setPaymentSuccess(true);
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

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
        <h1 className="text-2xl font-bold mb-2">Payment Successful 🎉</h1>

        <button
          onClick={() => (window.location.href = `/orders/${orderId}`)}
          className="w-full bg-orange-500 text-white py-3 rounded-lg mb-3"
        >
          Track Order
        </button>

        <button
          onClick={() => (window.location.href = "/")}
          className="w-full border border-orange-500 text-orange-500 py-3 rounded-lg"
        >
          Go to Home
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
          Select Duration
        </h1>
      </div>

      {/* PLAN INFO */}
      <div className="px-6 mt-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold">{selectedPlan.title}</h2>
          <p className="text-orange-500 font-bold">
            ₹{selectedPlan.price}
          </p>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}

      {/* DURATIONS */}
      <div className="px-6 mt-6 space-y-4">

        {durations.map((d, index) => {
          const Icon = d.icon;

          const finalPrice = calculatePrice(d.days, d.discount);

          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => handleSubscribe(d)}
                className="w-full bg-white p-5 rounded-xl shadow-md hover:shadow-lg"
              >
                <div className="flex items-center gap-4">

                  <div className={`w-14 h-14 bg-gradient-to-br ${d.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="text-white" />
                  </div>

                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold">
                      {d.name}
                    </h3>

                    <p className="text-orange-500 font-semibold">
                      ₹{finalPrice}
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