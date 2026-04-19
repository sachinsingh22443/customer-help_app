import { motion } from "motion/react";
import { Check, Flame, Dumbbell, Users, ChefHat, Calendar, CreditCard } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface PlanPreviewProps {
  userDetails: any;
  selectedPlan: string;
  selectedDuration: string;
  onConfirm: () => void;
  onBack: () => void;
}

export function PlanPreview({
  userDetails,
  selectedPlan,
  selectedDuration,
  onConfirm,
  onBack,
}: PlanPreviewProps) {
  // Generate personalized macros based on user details
  const calculateMacros = () => {
    const weight = parseInt(userDetails.weight) || 70;
    const goal = userDetails.fitnessGoal;

    let protein = 0;
    let carbs = 0;
    let fats = 0;
    let calories = 0;

    if (goal === "gain") {
      protein = Math.round(weight * 2.2);
      carbs = Math.round(weight * 5);
      fats = Math.round(weight * 1);
      calories = Math.round((protein * 4) + (carbs * 4) + (fats * 9));
    } else if (goal === "loss") {
      protein = Math.round(weight * 2);
      carbs = Math.round(weight * 2);
      fats = Math.round(weight * 0.8);
      calories = Math.round((protein * 4) + (carbs * 4) + (fats * 9));
    } else {
      protein = Math.round(weight * 1.8);
      carbs = Math.round(weight * 3.5);
      fats = Math.round(weight * 0.9);
      calories = Math.round((protein * 4) + (carbs * 4) + (fats * 9));
    }

    return { protein, carbs, fats, calories };
  };

  const macros = calculateMacros();

  const mealPlan = [
    {
      meal: "Breakfast",
      items: ["Oats with Nuts", "Banana", "Green Tea"],
      calories: Math.round(macros.calories * 0.25),
      image: "https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXB8ZW58MXx8fHwxNzYzNjM0ODE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      meal: "Lunch",
      items: ["Brown Rice", "Dal", "Veggie Curry", "Salad"],
      calories: Math.round(macros.calories * 0.35),
      image: "https://images.unsplash.com/photo-1672477179695-7276b0602fa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwaW5kaWFuJTIwZm9vZCUyMHRoYWxpfGVufDF8fHx8MTc2MzY2NDQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      meal: "Dinner",
      items: ["Roti", "Paneer", "Mixed Vegetables"],
      calories: Math.round(macros.calories * 0.30),
      image: "https://images.unsplash.com/photo-1606471191009-63994c53433b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFyaWFuJTIwY3VycnklMjBib3dsfGVufDF8fHx8MTc2MzY0NzE1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  const gymPlan = selectedPlan !== "normal" ? [
    { day: "Monday", focus: "Chest & Triceps", duration: "60 min" },
    { day: "Wednesday", focus: "Back & Biceps", duration: "60 min" },
    { day: "Friday", focus: "Legs & Shoulders", duration: "60 min" },
  ] : [];

  const planPrices: Record<string, number> = {
    normal: 3999,
    gym: 5999,
    premium: 9999,
  };

  const durationMultipliers: Record<string, number> = {
    weekly: 0.25,
    biweekly: 0.45,
    monthly: 0.8,
  };

  const totalPrice = Math.round(
    planPrices[selectedPlan] * durationMultipliers[selectedDuration]
  );

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-8 rounded-b-[2rem] relative overflow-hidden sticky top-0 z-20">
        <motion.div
          className="absolute top-10 right-10 w-24 h-24 rounded-full bg-white/10 blur-2xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <button onClick={onBack} className="text-white mb-6 flex items-center gap-2">
          ← Back
        </button>

        <motion.h1
          className="text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your Personalized Plan
        </motion.h1>
        <motion.p
          className="text-white/90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Review your custom health journey
        </motion.p>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* User Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 neo-shadow"
        >
          <h3 className="text-[#171717] mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#FF7A30]" />
            Your Profile
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[#171717]/60 text-sm mb-1">Goal</p>
              <p className="text-[#171717] capitalize">{userDetails.fitnessGoal}</p>
            </div>
            <div>
              <p className="text-[#171717]/60 text-sm mb-1">Preference</p>
              <p className="text-[#171717] capitalize">{userDetails.foodPreference}</p>
            </div>
            <div>
              <p className="text-[#171717]/60 text-sm mb-1">Height</p>
              <p className="text-[#171717]">{userDetails.height} cm</p>
            </div>
            <div>
              <p className="text-[#171717]/60 text-sm mb-1">Weight</p>
              <p className="text-[#171717]">{userDetails.weight} kg</p>
            </div>
          </div>
        </motion.div>

        {/* Macro Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#0FAD6E] to-[#3ec98d] rounded-2xl p-6 neo-shadow text-white"
        >
          <h3 className="mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5" />
            Daily Macros Target
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl mb-1">{macros.calories}</p>
              <p className="text-white/80 text-sm">Calories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-1">{macros.protein}g</p>
              <p className="text-white/80 text-sm">Protein</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-1">{macros.carbs}g</p>
              <p className="text-white/80 text-sm">Carbs</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-1">{macros.fats}g</p>
              <p className="text-white/80 text-sm">Fats</p>
            </div>
          </div>
        </motion.div>

        {/* Diet Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-[#171717] mb-4 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-[#FF7A30]" />
            Sample Daily Meal Plan
          </h3>
          <div className="space-y-3">
            {mealPlan.map((meal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden neo-shadow flex"
              >
                <div className="w-24 h-24 bg-[#FFF8F0] flex-shrink-0">
                  <ImageWithFallback
                    src={meal.image}
                    alt={meal.meal}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4">
                  <p className="text-[#171717] mb-1">{meal.meal}</p>
                  <p className="text-[#171717]/60 text-sm mb-2">
                    {meal.items.join(", ")}
                  </p>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#FF7A30]" />
                    <span className="text-sm text-[#FF7A30]">{meal.calories} cal</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Gym Plan */}
        {selectedPlan !== "normal" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-[#171717] mb-4 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-[#FF7A30]" />
              Weekly Gym Schedule
            </h3>
            <div className="space-y-3">
              {gymPlan.map((workout, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 neo-shadow flex items-center justify-between"
                >
                  <div>
                    <p className="text-[#171717] mb-1">{workout.day}</p>
                    <p className="text-[#171717]/60 text-sm">{workout.focus}</p>
                  </div>
                  <div className="text-[#FF7A30]">{workout.duration}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Plan Includes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 neo-shadow"
        >
          <h3 className="text-[#171717] mb-4">What's Included</h3>
          <div className="space-y-3">
            {[
              "Personalized meal planning",
              "Daily fresh homemade food",
              selectedPlan !== "normal" && "Custom gym workout plans",
              selectedPlan === "premium" && "Personal dietitian consultation",
              selectedPlan === "premium" && "Dedicated gym trainer",
              "Progress tracking & analytics",
              "24/7 customer support",
            ]
              .filter(Boolean)
              .map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0FAD6E]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#0FAD6E]" />
                  </div>
                  <p className="text-[#171717]/70 text-sm">{item}</p>
                </div>
              ))}
          </div>
        </motion.div>

        {/* Price Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-[#5F2EEA] to-[#8860f5] rounded-2xl p-6 neo-shadow text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Plan Summary
            </h3>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-white/80">
              <span>Plan Type</span>
              <span className="capitalize">{selectedPlan}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Duration</span>
              <span className="capitalize">{selectedDuration}</span>
            </div>
          </div>
          <div className="pt-4 border-t border-white/20">
            <div className="flex justify-between items-baseline">
              <span className="text-white/80">Total Amount</span>
              <span className="text-3xl">₹{totalPrice}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#171717]/10 p-6 z-20">
        <motion.button
          onClick={onConfirm}
          className="w-full bg-gradient-to-r from-[#FF7A30] to-[#ff9d5c] text-white py-4 rounded-xl neo-shadow flex items-center justify-center gap-2"
          whileTap={{ scale: 0.98 }}
        >
          <CreditCard className="w-5 h-5" />
          <span>Proceed to Payment</span>
        </motion.button>
      </div>
    </div>
  );
}
