import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";

interface Plan {
  id: string;
  title: string;
  description?: string;
  features?: string[];
  price: number;
  color?: string;
  emoji?: string;

  chef_id: string;
  chef_name?: string;
  distance?: number;

  menu_id: string;
  menu_name: string;
}

interface SubscriptionPlansProps {
  onSelectPlan: (plan: any) => void;
  onBack: () => void;
}

export function SubscriptionPlans({ onSelectPlan, onBack }: SubscriptionPlansProps) {

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);

        const lat = localStorage.getItem("lat");
        const lng = localStorage.getItem("lng");

        if (!lat || !lng) {
          throw new Error("Location not selected");
        }

        const res = await fetch(
          `https://chef-backend-1.onrender.com/subscriptions/plans?lat=${lat}&lng=${lng}`
        );

        if (!res.ok) {
          throw new Error("Failed to load plans");
        }

        const data = await res.json();
        setPlans(data || []);

      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // 🔥 LOADING
  if (loading) {
    return <div className="p-6 text-center">Loading plans...</div>;
  }

  // 🔥 ERROR
  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
        <div className="mt-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // 🔥 EMPTY STATE (FIXED)
  if (!plans.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] px-6 text-center">

        <h2 className="text-lg font-semibold mb-2">
          No plans available in your area 😢
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Try changing your location or come back later
        </p>

        <button
          onClick={onBack}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-orange-600 transition"
        >
          ← Go Back to Home
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
          Choose Your Plan
        </h1>
        <p className="text-white/90 text-sm">
          Nearby chefs subscription plans
        </p>
      </div>

      {/* PLANS */}
      <div className="px-6 mt-6 space-y-4">

        {plans.map((plan, index) => (
          <motion.div
            key={plan.id + index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() =>
  onSelectPlan({
    plan_id: plan.id,

    // 🔥 ADD THESE (MOST IMPORTANT)
    title: plan.title,
    price: plan.price,
    description: plan.description,
    emoji: plan.emoji,
    color: plan.color,
    features: plan.features,
    includes: plan.includes,

    // existing
    chef_id: plan.chef_id,
    menu_id: plan.menu_id,
    menu_name: plan.menu_name,
  })
}
              className="w-full bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-start gap-4">

                {/* ICON */}
                <div className="w-14 h-14 bg-orange-400 rounded-xl flex items-center justify-center text-white text-2xl">
                  {plan.emoji || "🔥"}
                </div>

                {/* CONTENT */}
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold">
                    {plan.title}
                  </h3>

                  {plan.chef_name && (
                    <p className="text-xs text-gray-400">
                      {plan.chef_name} • {plan.distance} km away
                    </p>
                  )}

                  {plan.description && (
                    <p className="text-sm text-gray-500 mb-2">
                      {plan.description}
                    </p>
                  )}

                  <div className="text-orange-500 text-xl font-semibold mb-3">
                    ₹{plan.price}
                  </div>

                  {(plan.features || []).slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check size={14} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 bg-orange-500 text-white py-2 rounded-lg">
                Select Plan
              </div>
            </button>
          </motion.div>
        ))}

      </div>
    </div>
  );
}