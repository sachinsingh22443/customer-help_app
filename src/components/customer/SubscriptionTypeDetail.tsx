import { Check } from "lucide-react";

interface Plan {
  plan_id: string;
  title: string;
  price: number;
  description?: string;
  plan_type?: string;
  tagline?: string;
  emoji?: string;
  color?: string;
  features?: string[];
  includes?: string[];

  chef_id: string;
  chef_name?: string;
  menu_id: string;
  menu_name: string;

  goal?: string;
  diet_type?: string;
  meal_type?: string[];
  breakfast_available?: boolean;
  breakfast_price?: number;

  calories_per_day?: number;
  duration_days?: number;
}

interface Props {
  selectedPlan: Plan | null;   // 🔥 FIX
  onBack: () => void;
  onSelectDuration: () => void;
}

export function SubscriptionTypeDetail({
  selectedPlan,
  onBack,
  onSelectDuration,
}: Props) {

  // 🔥 FIX 1: null handle (UI same)
  if (!selectedPlan) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  // 🔥 FIX 2: invalid data handle
  if (!selectedPlan.plan_id) {
    return <div className="p-6 text-center">No plan selected</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-32">

      <div className="bg-orange-400 px-6 pt-12 pb-20 rounded-b-3xl">
        <button onClick={onBack} className="text-white mb-4">
          ← Back
        </button>

        <div className="text-5xl">{selectedPlan.emoji || "🔥"}</div>

        <h1 className="text-white text-xl font-semibold mt-2">
          {selectedPlan.title}
        </h1>

        {selectedPlan.tagline && (
          <p className="text-white/80 text-sm">
            {selectedPlan.tagline}
          </p>
        )}

        <div className="mt-2">
            <p className="text-white text-2xl font-semibold">
            ₹{selectedPlan.price}
          </p>

          <p className="text-white/80 text-xs">
           per 30 days
         </p>
        </div>


        {selectedPlan.breakfast_available && (
         <div className="mt-3 bg-white/20 rounded-xl px-4 py-3">
         <p className="text-white font-medium">
         🥣 Breakfast Available
         </p>

        <p className="text-white/80 text-sm">
         Optional · ₹{selectedPlan.breakfast_price}/day
        </p>
         </div>
        )}


        {selectedPlan.chef_name && (
  <div className="mt-3 bg-white/20 rounded-xl px-4 py-3">
    <p className="text-white/80 text-xs">
      Created By
    </p>

    <p className="text-white font-semibold">
      👨‍🍳 {selectedPlan.chef_name}
    </p>
  </div>
)}

    <div className="flex flex-wrap gap-2 mt-3">
  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
    {selectedPlan.goal}
  </span>

  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
    {selectedPlan.diet_type}
  </span>

  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
    {selectedPlan.plan_type === "normal" && "🥗 Normal"}

    {selectedPlan.plan_type === "dietician" &&
      "👨‍⚕️ Dietician"}

    {selectedPlan.plan_type === "gym" &&
      "💪 Gym + Trainer"}
  </span>
</div>


      </div>

  <div className="p-6 space-y-4">
        
  <div className="bg-white rounded-2xl p-4 shadow">
  <h3 className="font-semibold mb-2">
    Plan Details
  </h3>

  <div className="space-y-2">
  <p>
    🔥 Calories: {selectedPlan.calories_per_day} kcal/day
  </p>

  <p>
    ⏳ Duration: {selectedPlan.duration_days} Days
  </p>

  <p>
    🍽️ Meals: {(selectedPlan.meal_type || []).join(", ")}
  </p>

  <p>
    💰 Price: ₹{selectedPlan.price}
  </p>
</div>
</div>


        {selectedPlan.description && (
          <p>{selectedPlan.description}</p>
        )}

        <div className="bg-white rounded-2xl p-4 shadow">
  <h3 className="font-semibold mb-3">
    Plan Features
  </h3>

  {(selectedPlan.features || []).map((f, i) => (
    <div
      key={i}
      className="flex items-center gap-2 mb-2"
    >
      <Check size={16} />
      {f}
    </div>
  ))}
</div>


  {(selectedPlan.includes || []).length > 0 && (
  <div className="bg-white rounded-2xl p-4 shadow">
    <h3 className="font-semibold mb-3">
      What's Included
    </h3>

    {(selectedPlan.includes || []).map((item, i) => (
      <div
        key={i}
        className="flex items-center gap-2 mb-2"
      >
        <Check size={16} />
        {item}
      </div>
    ))}
  </div>
)}



      </div>

      <div className="fixed bottom-0 w-full p-4 bg-white">
        <button
          onClick={onSelectDuration}
          className="w-full bg-orange-500 text-white py-3 rounded-lg"
        >
          Choose Duration →
        </button>
      </div>
    </div>
  );
}