import { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Calendar,
  Users,
  Ruler,
  Weight,
  Target,
  Utensils,
  DollarSign,
  Clock,
  MapPin,
  ChevronDown,
} from "lucide-react";

interface UserDetailsFormProps {
  onSubmit: (details: any) => void;
  onBack: () => void;
}

export function UserDetailsForm({ onSubmit, onBack }: UserDetailsFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    fitnessGoal: "",
    foodPreference: "",
    budget: "",
    timingPreference: "",
    address: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-8 rounded-b-[2rem] relative overflow-hidden sticky top-0 z-20">
        <motion.div
          className="absolute top-10 right-10 w-24 h-24 rounded-full bg-white/10 blur-2xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <button
          onClick={onBack}
          className="text-white mb-6 flex items-center gap-2"
        >
          ← Back
        </button>

        <motion.h1
          className="text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your Details
        </motion.h1>
        <motion.p
          className="text-white/90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Help us personalize your plan
        </motion.p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 mt-6 space-y-4">
        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm text-[#171717]/70 mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-4 rounded-xl border-2 border-[#171717]/10 focus:border-[#FF7A30] outline-none transition-colors bg-white neo-shadow-sm"
            required
          />
        </motion.div>

        {/* Age & Gender */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm text-[#171717]/70 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => updateField("age", e.target.value)}
              placeholder="25"
              className="w-full px-4 py-4 rounded-xl border-2 border-[#171717]/10 focus:border-[#FF7A30] outline-none transition-colors bg-white neo-shadow-sm"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm text-[#171717]/70 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Gender
            </label>
            <div className="relative">
              <select
                value={formData.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                className="w-full px-4 py-4 rounded-xl border-2 border-[#171717]/10 focus:border-[#FF7A30] outline-none transition-colors bg-white neo-shadow-sm appearance-none"
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#171717]/40 pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* Height & Weight */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm text-[#171717]/70 mb-2 flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Height (cm)
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => updateField("height", e.target.value)}
              placeholder="170"
              className="w-full px-4 py-4 rounded-xl border-2 border-[#171717]/10 focus:border-[#FF7A30] outline-none transition-colors bg-white neo-shadow-sm"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm text-[#171717]/70 mb-2 flex items-center gap-2">
              <Weight className="w-4 h-4" />
              Weight (kg)
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => updateField("weight", e.target.value)}
              placeholder="70"
              className="w-full px-4 py-4 rounded-xl border-2 border-[#171717]/10 focus:border-[#FF7A30] outline-none transition-colors bg-white neo-shadow-sm"
              required
            />
          </motion.div>
        </div>

        {/* Fitness Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-sm text-[#171717]/70 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Fitness Goal
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "gain", label: "Gain", emoji: "💪" },
              { value: "loss", label: "Loss", emoji: "🔥" },
              { value: "maintain", label: "Maintain", emoji: "⚖️" },
            ].map((goal) => (
              <button
                key={goal.value}
                type="button"
                onClick={() => updateField("fitnessGoal", goal.value)}
                className={`py-3 px-4 rounded-xl border-2 transition-all ${
                  formData.fitnessGoal === goal.value
                    ? "border-[#FF7A30] bg-[#FF7A30]/5 neo-shadow-sm"
                    : "border-[#171717]/10 bg-white"
                }`}
              >
                <div className="text-2xl mb-1">{goal.emoji}</div>
                <div className="text-sm">{goal.label}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Food Preference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <label className="block text-sm text-[#171717]/70 mb-3 flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Food Preference
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "veg", label: "Vegetarian", emoji: "🥗" },
              { value: "nonveg", label: "Non-Veg", emoji: "🍗" },
              { value: "vegan", label: "Vegan", emoji: "🌱" },
              { value: "eggetarian", label: "Eggetarian", emoji: "🥚" },
            ].map((pref) => (
              <button
                key={pref.value}
                type="button"
                onClick={() => updateField("foodPreference", pref.value)}
                className={`py-3 px-4 rounded-xl border-2 transition-all ${
                  formData.foodPreference === pref.value
                    ? "border-[#FF7A30] bg-[#FF7A30]/5 neo-shadow-sm"
                    : "border-[#171717]/10 bg-white"
                }`}
              >
                <div className="text-xl mb-1">{pref.emoji}</div>
                <div className="text-sm">{pref.label}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Budget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <label className="block text-sm text-[#171717]/70 mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Daily Budget (₹)
          </label>
          <input
            type="number"
            value={formData.budget}
            onChange={(e) => updateField("budget", e.target.value)}
            placeholder="200"
            className="w-full px-4 py-4 rounded-xl border-2 border-[#171717]/10 focus:border-[#FF7A30] outline-none transition-colors bg-white neo-shadow-sm"
            required
          />
        </motion.div>

        {/* Timing Preference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <label className="block text-sm text-[#171717]/70 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Delivery Time Preference
          </label>
          <div className="relative">
            <select
              value={formData.timingPreference}
              onChange={(e) => updateField("timingPreference", e.target.value)}
              className="w-full px-4 py-4 rounded-xl border-2 border-[#171717]/10 focus:border-[#FF7A30] outline-none transition-colors bg-white neo-shadow-sm appearance-none"
              required
            >
              <option value="">Select time</option>
              <option value="breakfast">Breakfast (7-9 AM)</option>
              <option value="lunch">Lunch (12-2 PM)</option>
              <option value="dinner">Dinner (7-9 PM)</option>
              <option value="all">All Meals</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#171717]/40 pointer-events-none" />
          </div>
        </motion.div>

        {/* Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <label className="block text-sm text-[#171717]/70 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Delivery Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="Enter your complete address"
            rows={3}
            className="w-full px-4 py-4 rounded-xl border-2 border-[#171717]/10 focus:border-[#FF7A30] outline-none transition-colors bg-white neo-shadow-sm resize-none"
            required
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="w-full bg-gradient-to-r from-[#FF7A30] to-[#ff9d5c] text-white py-4 rounded-xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all mt-6"
          whileTap={{ scale: 0.98 }}
        >
          Generate My Plan →
        </motion.button>
      </form>
    </div>
  );
}
