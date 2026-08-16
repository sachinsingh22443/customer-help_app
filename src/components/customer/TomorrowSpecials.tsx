import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Clock,
  ChefHat,
  Flame,
  Utensils,
  Timer,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface TomorrowSpecialsProps {
  onBack: () => void;
  onNavigateToSpecialDetail?: (item: any) => void;
  category?: string;
}

export function TomorrowSpecials({
  onBack,
  onNavigateToSpecialDetail,
  category,
}: TomorrowSpecialsProps) {

  const [specials, setSpecials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSpecials();
  }, [category]);

  const fetchSpecials = async () => {
    try {
      setLoading(true);

      const lat = localStorage.getItem("lat");
      const lng = localStorage.getItem("lng");

      if (!lat || !lng) {
        setSpecials([]);
        return;
      }

      const res = await fetch(
        `https://chef-backend-qh12.onrender.com/tomorrow-special/nearby?lat=${lat}&lng=${lng}&category=${category || ""}`
      );

      if (!res.ok) {
        throw new Error("API failed");
      }

      const data = await res.json();

      setSpecials(data || []);
    } catch (err) {
      console.log("SPECIAL ERROR:", err);
      setSpecials([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-8">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-8 rounded-b-[2rem] sticky top-0 z-20">

        <button
          onClick={onBack}
          className="text-white mb-4 flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>

          <h1 className="text-white text-xl font-bold">
            Tomorrow Specials
          </h1>
        </div>

        <p className="text-white/80 text-sm mt-1">
          Fresh chef-special dishes available for tomorrow
        </p>

      </div>


      {/* ===================================================== */}
      {/* CONTENT */}
      {/* ===================================================== */}

      <div className="px-6 mt-6 space-y-5">

        {/* LOADING */}
        {loading ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-gray-400 animate-pulse">
              Loading specials...
            </p>
          </div>
        ) : specials.length === 0 ? (

          /* EMPTY */
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">

            <div className="text-5xl mb-3">
              🍽️
            </div>

            <h3 className="font-semibold text-gray-800">
              No Tomorrow Specials
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              No special dishes are currently available in your area.
            </p>

          </div>

        ) : (

          /* SPECIAL LIST */
          specials
            .filter((item: any) => item.remaining > 0)
            .map((special: any, index: number) => {

              const hasDiscount =
                special.original_price &&
                Number(special.original_price) > Number(special.price);

              const discountPercentage = hasDiscount
                ? Math.round(
                    ((Number(special.original_price) -
                      Number(special.price)) /
                      Number(special.original_price)) *
                      100
                  )
                : 0;

              return (
                <motion.div
                  key={special.id}

                  initial={{
                    opacity: 0,
                    y: 20,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay: index * 0.05,
                  }}

                  onClick={() =>
                    onNavigateToSpecialDetail?.({

                      // BASIC
                      id: special.id,
                      name: special.dish_name,
                      description: special.description,

                      // PRICING
                      price: special.price,
                      original_price: special.original_price,

                      // INVENTORY
                      quantity: special.remaining,
                      remaining: special.remaining,
                      max_plates: special.max_plates,
                      pre_orders: special.pre_orders,

                      // IMAGE
                      image_urls: special.image_url
                        ? [special.image_url]
                        : [],

                      // CHEF
                      chef_id: special.chef_id,
                      chef_name: special.chef_name,
                      distance: special.distance,

                      // FOOD
                      food_type: special.food_type,

                      // NUTRITION
                      calories: special.calories,
                      protein: special.protein,
                      carbs: special.carbs,
                      fats: special.fats,

                      // PREMIUM INFO
                      preparation_time:
                        special.preparation_time,

                      ingredients:
                        special.ingredients,

                      // TIMING
                      cutoff_time: special.cutoff_time,
                      special_date: special.special_date,

// TYPE
                      type: "special",
                    })
                  }

                  className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer"
                >

                  {/* ================================================= */}
                  {/* IMAGE */}
                  {/* ================================================= */}

                  <div className="relative">

                    <ImageWithFallback
                      src={
                        special.image_url ||
                        "https://via.placeholder.com/300"
                      }

                      alt={special.dish_name}

                      className="w-full h-52 object-cover"
                    />


                    {/* REMAINING */}
                    <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow">

                      <Flame className="w-3 h-3" />

                      {special.remaining} left

                    </div>


                    {/* DISCOUNT */}
                    {hasDiscount && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow">

                        {discountPercentage}% OFF

                      </div>
                    )}

                  </div>


                  {/* ================================================= */}
                  {/* CONTENT */}
                  {/* ================================================= */}

                  <div className="p-4">

                    {/* DISH NAME */}
                    <h3 className="font-bold text-lg text-gray-900">
                      {special.dish_name}
                    </h3>


                    {/* CHEF */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">

                      <ChefHat className="w-4 h-4" />

                      <span>
                        {special.chef_name}
                      </span>

                      {special.distance !== undefined && (
                        <>
                          <span>
                            •
                          </span>

                          <span>
                            {special.distance} km
                          </span>
                        </>
                      )}

                    </div>


                    {/* FOOD TYPE + SPECIAL BADGE */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          special.food_type === "veg"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {special.food_type === "veg"
                          ? "🌱 Veg"
                          : "🍗 Non-Veg"}
                      </span>


                      <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">
                        ⭐ Chef Special
                      </span>

                    </div>


                    {/* DESCRIPTION */}
                    {special.description && (
                      <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                        {special.description}
                      </p>
                    )}


                    {/* ================================================= */}
                    {/* NUTRITION */}
                    {/* ================================================= */}

                    {(
                      special.calories !== undefined ||
                      special.protein !== undefined ||
                      special.carbs !== undefined ||
                      special.fats !== undefined
                    ) && (

                      <div className="grid grid-cols-4 gap-2 mt-4">

                        {special.calories !== undefined && (
                          <div className="bg-orange-50 rounded-xl p-2 text-center">

                            <div className="text-sm font-bold text-orange-600">
                              {special.calories}
                            </div>

                            <div className="text-[10px] text-gray-500">
                              kcal
                            </div>

                          </div>
                        )}


                        {special.protein !== undefined && (
                          <div className="bg-green-50 rounded-xl p-2 text-center">

                            <div className="text-sm font-bold text-green-600">
                              {special.protein}g
                            </div>

                            <div className="text-[10px] text-gray-500">
                              Protein
                            </div>

                          </div>
                        )}


                        {special.carbs !== undefined && (
                          <div className="bg-blue-50 rounded-xl p-2 text-center">

                            <div className="text-sm font-bold text-blue-600">
                              {special.carbs}g
                            </div>

                            <div className="text-[10px] text-gray-500">
                              Carbs
                            </div>

                          </div>
                        )}


                        {special.fats !== undefined && (
                          <div className="bg-purple-50 rounded-xl p-2 text-center">

                            <div className="text-sm font-bold text-purple-600">
                              {special.fats}g
                            </div>

                            <div className="text-[10px] text-gray-500">
                              Fats
                            </div>

                          </div>
                        )}

                      </div>
                    )}


                    {/* ================================================= */}
                    {/* PREPARATION TIME */}
                    {/* ================================================= */}

                    {special.preparation_time && (
                      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">

                        <Timer className="w-4 h-4 text-orange-500" />

                        <span>
                          Preparation time:
                        </span>

                        <strong className="text-gray-700">
                          {special.preparation_time} min
                        </strong>

                      </div>
                    )}


                    {/* ================================================= */}
                    {/* INGREDIENTS */}
                    {/* ================================================= */}

                    {special.ingredients && (
                      <div className="mt-4">

                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-1">

                          <Utensils className="w-4 h-4 text-orange-500" />

                          Ingredients

                        </div>

                        <p className="text-xs text-gray-500 leading-relaxed">
                          {special.ingredients}
                        </p>

                      </div>
                    )}


                    {/* ================================================= */}
                    {/* PRICE + PRE-ORDER */}
                    {/* ================================================= */}

                    <div className="flex justify-between items-center mt-5">

                      {/* PRICE */}
                      <div>

                        {hasDiscount && (
                          <div className="flex items-center gap-2">

                            <span className="text-xs text-gray-400 line-through">
                              ₹{special.original_price}
                            </span>

                            <span className="text-xs font-bold text-green-600">
                              {discountPercentage}% OFF
                            </span>

                          </div>
                        )}

                        <div className="text-orange-500 font-bold text-xl">
                          ₹{special.price}
                        </div>

                      </div>


                      {/* PRE-ORDER */}
                      

                    </div>


                    {/* ================================================= */}
                    {/* CUTOFF + REMAINING */}
                    {/* ================================================= */}

                    <div className="flex items-center justify-between mt-3">

                      <div className="flex items-center gap-1 text-xs text-gray-400">

                        <Clock className="w-3 h-3" />

                        Order by {special.cutoff_time}

                      </div>

                      <span className="text-xs text-gray-400">
                        {special.remaining} plates available
                      </span>

                    </div>

                  </div>

                </motion.div>
              );
            })
        )}

      </div>

    </div>
  );
}