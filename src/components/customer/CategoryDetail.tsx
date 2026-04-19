import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Plus } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface CategoryDetailProps {
  category: "healthy" | "protein" | "tiffin" | "diet";
  onBack: () => void;
  onAddToCart: (item: any) => void;
}

const categoryData = {
  healthy: {
    title: "Healthy Meals",
    subtitle: "Nutritious & delicious home-cooked meals",
    color: "from-[#0FAD6E] to-[#3ec98d]",
    emoji: "🥗",
  },
  protein: {
    title: "Protein Rich",
    subtitle: "High-protein meals for muscle building",
    color: "from-[#FF7A30] to-[#ff9d5c]",
    emoji: "💪",
  },
  tiffin: {
    title: "Daily Tiffin",
    subtitle: "Regular home-style tiffin service",
    color: "from-[#5F2EEA] to-[#8860f5]",
    emoji: "🍱",
  },
  diet: {
    title: "Diet Plans",
    subtitle: "Customized meal plans for your goals",
    color: "from-[#FF7A30] to-[#0FAD6E]",
    emoji: "📊",
  },
};

export function CategoryDetail({ category, onBack, onAddToCart }: CategoryDetailProps) {

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [dishes, setDishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const data = categoryData[category];

  const filters = [
    { id: "all", label: "All", emoji: "🍽️" },
    { id: "veg", label: "Veg", emoji: "🥗" },
    { id: "nonveg", label: "Non-Veg", emoji: "🍗" },
  ];

  useEffect(() => {
    fetchDishes();
  }, [category, activeFilter]);

  const fetchDishes = async () => {
    try {
      setLoading(true);

      const lat = localStorage.getItem("lat");
      const lng = localStorage.getItem("lng");

      if (!lat || !lng) {
        setDishes([]);
        return;
      }

      const res = await fetch(
        `https://chef-backend-1.onrender.com/menu/nearby-chefs?lat=${lat}&lng=${lng}&category=${category}`
      );

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();

      // 🔥 FLATTEN CHEF → MENUS
      let allDishes = data.flatMap((chef: any) =>
        (chef.menus || []).map((menu: any) => ({
          ...menu,
          chef_name: chef.name,
        }))
      );

      // 🔥 VEG / NONVEG FILTER (FRONTEND)
      if (activeFilter === "veg") {
        allDishes = allDishes.filter(
          (d: any) => d.food_type === "vegetarian"
        );
      } else if (activeFilter === "nonveg") {
        allDishes = allDishes.filter(
          (d: any) => d.food_type === "non-veg"
        );
      }

      setDishes(allDishes);

    } catch (err) {
      console.log("ERROR:", err);
      setDishes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">

      {/* HEADER */}
      <div className={`bg-gradient-to-br ${data.color} px-6 pt-12 pb-20 rounded-b-[2rem]`}>
        <button onClick={onBack} className="text-white mb-6 flex items-center gap-2">
          <ChevronLeft className="w-6 h-6" />
          Back
        </button>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-5xl">{data.emoji}</span>
          <h1 className="text-white text-xl font-bold">{data.title}</h1>
        </div>

        <p className="text-white/90">{data.subtitle}</p>
      </div>

      {/* FILTER */}
      <div className="px-6 -mt-12 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow">
          <div className="flex gap-2 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-xl border ${
                  activeFilter === filter.id
                    ? "border-orange-500 text-orange-500"
                    : "border-gray-200"
                }`}
              >
                {filter.emoji} {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="px-6 space-y-4">

        {loading ? (
          <p className="animate-pulse text-gray-400">Loading delicious food...</p>
        ) : dishes.length === 0 ? (
          <p className="text-gray-500">No dishes found</p>
        ) : (
          dishes.map((dish: any, index) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow overflow-hidden flex"
            >

              {/* IMAGE */}
              <div className="w-32 h-32">
                <ImageWithFallback
                  src={dish.image_urls?.[0] || "https://via.placeholder.com/150"}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="flex-1 p-3">

                <div className="flex justify-between">
                  <p className="font-semibold">{dish.name}</p>
                  <span>{dish.food_type === "vegetarian" ? "🥗" : "🍗"}</span>
                </div>

                <p className="text-xs text-gray-500">
                  👨‍🍳 {dish.chef_name}
                </p>

                <div className="flex gap-3 text-xs text-gray-500 mt-1">
                  <span>P: {dish.protein || 0}g</span>
                  <span>C: {dish.carbs || 0}g</span>
                  <span>F: {dish.fats || 0}g</span>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-orange-500 font-bold">
                    ₹{dish.price}
                  </span>

                  <button
                    onClick={() =>
                      onAddToCart({
                        id: dish.id,
                        name: dish.name,
                        price: dish.price,
                        quantity: 1,
                        image_urls: dish.image_urls,
                        type: "menu",
                      })
                    }
                    className="bg-orange-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}