import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Crown,
  Calendar,
  Clock,
} from "lucide-react";

interface Props {
  onBack: () => void;
}

export default function MySubscriptions({
  onBack,
}: Props) {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://chef-backend-qh12.onrender.com/subscriptions/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      console.log("MY SUBSCRIPTION DATA:", data);

      setSubscriptions(data);
    } catch (error) {
      console.error("Failed to load subscriptions", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 p-5">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="h-11 w-11 flex items-center justify-center rounded-full bg-white shadow-md"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Subscriptions
          </h1>

          <p className="text-sm text-gray-500">
            Manage your meal plans
          </p>
        </div>
      </div>

      {/* Empty State */}
      {subscriptions.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 shadow-lg text-center">
          <div className="h-20 w-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Crown
              size={36}
              className="text-orange-500"
            />
          </div>

          <h2 className="text-xl font-bold mb-2">
            No Active Subscription
          </h2>

          <p className="text-gray-500">
            Subscribe to a meal plan and enjoy
            delicious food every day.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {subscriptions.map((sub: any) => (
            <div
              key={sub.id}
              className="relative overflow-hidden rounded-3xl bg-white shadow-xl border border-orange-100"
            >
              {/* Top Gradient */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-3" />

              <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Crown
                        size={18}
                        className="text-yellow-500"
                      />
                      {sub.plan}
                    </h2>

                    <p className="text-sm font-semibold text-orange-600 mt-2">
                      👨‍🍳 {sub.chefName}
                    </p>


                    
{sub.plan_type && (
  <div className="mt-2">
    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
      {sub.plan_type === "normal" && "🥗 Normal Diet"}
      {sub.plan_type === "dietician" && "👨‍⚕️ Dietician Support"}
      {sub.plan_type === "gym" && "💪 Gym + Diet + Trainer"}
    </span>
  </div>
)}

                    
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      sub.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {sub.status?.charAt(0).toUpperCase() +
                      sub.status?.slice(1)}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3">

                  <div className="flex items-center gap-3">
                    <Calendar
                      size={18}
                      className="text-blue-500"
                    />

                    <span className="text-gray-700">
                      Start Date: {sub.startDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar
                      size={18}
                      className="text-green-500"
                    />

                    <span className="text-gray-700">
                      End Date: {sub.endDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock
                      size={18}
                      className="text-purple-500"
                    />

                    <span className="text-gray-700">
                      Delivery Time: {sub.time}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="mt-5 border-t pt-4 flex justify-between items-center">
                  <span className="text-gray-500">
                    Subscription Amount
                  </span>

                  <span className="font-bold text-lg text-orange-600">
                    ₹{sub.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}