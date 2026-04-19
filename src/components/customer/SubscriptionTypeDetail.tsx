import { ChevronLeft, Check } from "lucide-react";

interface Plan {
  plan_id: string;
  title: string;
  price: number;
  description?: string;
  tagline?: string;
  emoji?: string;
  color?: string;
  features?: string[];
  includes?: string[];

  chef_id: string;
  menu_id: string;
  menu_name: string;
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

        <p className="text-white text-2xl mt-2">
          ₹{selectedPlan.price}
        </p>
      </div>

      <div className="p-6 space-y-4">

        {selectedPlan.description && (
          <p>{selectedPlan.description}</p>
        )}

        {(selectedPlan.features || []).map((f, i) => (
          <div key={i} className="flex gap-2">
            <Check size={16} /> {f}
          </div>
        ))}

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