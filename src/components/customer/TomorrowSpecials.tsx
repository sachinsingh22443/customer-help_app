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
  <div className="min-h-screen bg-[#F7F6F3] pb-10">

    {/* =====================================================
        PREMIUM HERO
    ===================================================== */}

    <div className="relative overflow-hidden rounded-b-[2.8rem] bg-gradient-to-br from-[#24104D] via-[#5F2EEA] to-[#FF7A30] px-5 pb-9 pt-7">

      {/* Glow */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 left-0 h-56 w-56 rounded-full bg-orange-300/15 blur-3xl" />

      <div className="relative">

        {/* TOP BAR */}

        <div className="flex items-center justify-between">

          <button
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-md transition active:scale-95"
          >
            <span className="text-xl">←</span>
          </button>


          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">

            <span className="text-sm">
              ✨
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white">
              Limited Specials
            </span>

          </div>

        </div>


        {/* HERO TEXT */}

        <div className="mt-9">

          <div className="flex items-center gap-2">

            <span className="text-lg">
              🌙
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/60">
              Tomorrow's menu
            </span>

          </div>


          <h1 className="mt-2 text-[31px] font-bold leading-[1.05] tracking-tight text-white">

            Tomorrow
            <span className="block text-orange-200">
              Specials
            </span>

          </h1>


          <p className="mt-4 max-w-sm text-xs leading-6 text-white/65">
            Fresh chef-crafted dishes available for
            pre-order before they sell out.
          </p>


          {/* INFO STRIP */}

          <div className="mt-6 flex items-center gap-2">

            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-md">

              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                📅
              </div>

              <div>

                <p className="text-[8px] uppercase tracking-wider text-white/45">
                  Availability
                </p>

                <p className="mt-0.5 text-[10px] font-bold text-white">
                  Tomorrow only
                </p>

              </div>

            </div>


            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-md">

              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                🔥
              </div>

              <div>

                <p className="text-[8px] uppercase tracking-wider text-white/45">
                  Fresh picks
                </p>

                <p className="mt-0.5 text-[10px] font-bold text-white">
                  Limited plates
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>


    {/* =====================================================
        CONTENT
    ===================================================== */}

    <div className="px-5 pt-6">


      {/* ===================================================
          LOADING
      =================================================== */}

      {loading ? (

        <div className="space-y-5">

          {[1, 2].map((item) => (

            <div
              key={item}
              className="overflow-hidden rounded-[2rem] bg-white shadow-sm"
            >

              <div className="h-56 animate-pulse bg-slate-200" />

              <div className="space-y-3 p-5">

                <div className="h-5 w-3/4 animate-pulse rounded-lg bg-slate-200" />

                <div className="h-3 w-1/2 animate-pulse rounded-lg bg-slate-100" />

                <div className="h-10 w-full animate-pulse rounded-2xl bg-slate-100" />

                <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-200" />

              </div>

            </div>

          ))}

        </div>

      ) : specials.length === 0 ? (

        /* =================================================
           EMPTY STATE
        ================================================= */

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="rounded-[2.2rem] bg-white p-7 text-center shadow-sm"
        >

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.8rem] bg-gradient-to-br from-orange-50 to-purple-50">

            <span className="text-4xl">
              🍽️
            </span>

          </div>


          <div className="mx-auto mt-5 flex w-fit items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">

            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Coming soon
            </span>

          </div>


          <h2 className="mt-4 text-xl font-bold text-slate-900">
            No specials nearby
          </h2>


          <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-slate-500">
            Our chefs haven't added tomorrow's special
            dishes in your area yet.
          </p>


          <button
            onClick={onBack}
            className="mt-6 rounded-2xl bg-gradient-to-r from-[#FF7A30] to-[#5F2EEA] px-6 py-3.5 text-xs font-bold text-white shadow-lg"
          >
            Explore Regular Menu
          </button>

        </motion.div>

      ) : (

        /* =================================================
           SPECIAL LIST
        ================================================= */

        <div className="space-y-6">

          {specials
            .filter(
              (item: any) =>
                item.remaining > 0
            )
            .map(
              (
                special: any,
                index: number
              ) => {

                const hasDiscount =
                  special.original_price &&
                  Number(
                    special.original_price
                  ) >
                    Number(
                      special.price
                    );


                const discountPercentage =
                  hasDiscount
                    ? Math.round(
                        (
                          (
                            Number(
                              special.original_price
                            ) -
                            Number(
                              special.price
                            )
                          ) /
                          Number(
                            special.original_price
                          )
                        ) *
                          100
                      )
                    : 0;


                const isVeg =
                  special.food_type ===
                  "veg";


                const isLowStock =
                  Number(
                    special.remaining
                  ) <= 5;


                return (

                  <motion.div
                    key={special.id}

                    initial={{
                      opacity: 0,
                      y: 35,
                    }}

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    transition={{
                      delay:
                        index * 0.08,
                      duration: 0.45,
                    }}

                    className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_15px_45px_rgba(30,20,70,0.08)]"
                  >


                    {/* =================================================
                        IMAGE
                    ================================================= */}

                    <div className="relative">

                      <ImageWithFallback
                        src={
                          special.image_url ||
                          "https://via.placeholder.com/300"
                        }
                        alt={
                          special.dish_name
                        }
                        className="h-60 w-full object-cover"
                      />


                      {/* IMAGE GRADIENT */}

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/65 to-transparent" />


                      {/* DISCOUNT */}

                      {hasDiscount && (

                        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-[9px] font-bold text-white shadow-lg">

                          <span>
                            ✨
                          </span>

                          {discountPercentage}% OFF

                        </div>

                      )}


                      {/* REMAINING */}

                      <div
                        className={`absolute right-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-bold text-white shadow-lg ${
                          isLowStock
                            ? "bg-red-500"
                            : "bg-orange-500"
                        }`}
                      >

                        <Flame className="h-3 w-3" />

                        {special.remaining} left

                      </div>


                      {/* BOTTOM IMAGE INFO */}

                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">

                        <div>

                          <div className="flex items-center gap-1.5">

                            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[8px] font-bold text-white backdrop-blur-md">
                              ⭐ CHEF SPECIAL
                            </span>

                          </div>

                          <h2 className="mt-2 text-xl font-bold text-white">
                            {special.dish_name}
                          </h2>

                        </div>


                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-lg backdrop-blur-md">
                          🍴
                        </div>

                      </div>

                    </div>


                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="p-5">


                      {/* CHEF */}

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2.5">

                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">

                            <ChefHat className="h-4 w-4 text-orange-500" />

                          </div>


                          <div>

                            <div className="flex items-center gap-1.5">

                              <p className="text-[10px] font-bold text-slate-800">
                                {special.chef_name ||
                                  "Local Chef"}
                              </p>

                              <span className="text-[9px]">
                                ✓
                              </span>

                            </div>

                            <p className="mt-0.5 text-[8px] text-slate-400">
                              Verified chef
                            </p>

                          </div>

                        </div>


                        {special.distance !==
                          undefined && (

                          <div className="rounded-xl bg-slate-50 px-3 py-2">

                            <p className="text-[8px] text-slate-400">
                              Nearby
                            </p>

                            <p className="text-[10px] font-bold text-slate-700">
                              📍 {special.distance} km
                            </p>

                          </div>

                        )}

                      </div>


                      {/* BADGES */}

                      <div className="mt-4 flex flex-wrap gap-2">

                        <span
                          className={`rounded-full px-3 py-1.5 text-[9px] font-bold ${
                            isVeg
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >

                          {isVeg
                            ? "🌱 Pure Veg"
                            : "🍗 Non-Veg"}

                        </span>


                        <span className="rounded-full bg-orange-50 px-3 py-1.5 text-[9px] font-bold text-orange-600">

                          🔥 Fresh Tomorrow

                        </span>


                        {special.max_plates && (

                          <span className="rounded-full bg-purple-50 px-3 py-1.5 text-[9px] font-bold text-purple-700">

                            Limited batch

                          </span>

                        )}

                      </div>


                      {/* DESCRIPTION */}

                      {special.description && (

                        <p className="mt-4 text-xs leading-6 text-slate-500">

                          {special.description}

                        </p>

                      )}


                      {/* =================================================
                          NUTRITION
                      ================================================= */}

                      {(
                        special.calories !==
                          undefined ||
                        special.protein !==
                          undefined ||
                        special.carbs !==
                          undefined ||
                        special.fats !==
                          undefined
                      ) && (

                        <div className="mt-5">

                          <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                            Nutrition
                          </p>


                          <div className="grid grid-cols-4 gap-2">

                            {special.calories !==
                              undefined && (

                              <div className="rounded-2xl bg-orange-50 p-3 text-center">

                                <div className="text-sm font-bold text-orange-600">
                                  {special.calories}
                                </div>

                                <div className="mt-0.5 text-[8px] font-medium text-slate-400">
                                  kcal
                                </div>

                              </div>

                            )}


                            {special.protein !==
                              undefined && (

                              <div className="rounded-2xl bg-emerald-50 p-3 text-center">

                                <div className="text-sm font-bold text-emerald-600">
                                  {special.protein}g
                                </div>

                                <div className="mt-0.5 text-[8px] font-medium text-slate-400">
                                  Protein
                                </div>

                              </div>

                            )}


                            {special.carbs !==
                              undefined && (

                              <div className="rounded-2xl bg-blue-50 p-3 text-center">

                                <div className="text-sm font-bold text-blue-600">
                                  {special.carbs}g
                                </div>

                                <div className="mt-0.5 text-[8px] font-medium text-slate-400">
                                  Carbs
                                </div>

                              </div>

                            )}


                            {special.fats !==
                              undefined && (

                              <div className="rounded-2xl bg-purple-50 p-3 text-center">

                                <div className="text-sm font-bold text-purple-600">
                                  {special.fats}g
                                </div>

                                <div className="mt-0.5 text-[8px] font-medium text-slate-400">
                                  Fats
                                </div>

                              </div>

                            )}

                          </div>

                        </div>

                      )}


                      {/* =================================================
                          PREPARATION
                      ================================================= */}

                      <div className="mt-5 flex items-center gap-3">

                        {special.preparation_time && (

                          <div className="flex flex-1 items-center gap-2 rounded-2xl bg-slate-50 px-3 py-3">

                            <Timer className="h-4 w-4 text-orange-500" />

                            <div>

                              <p className="text-[8px] text-slate-400">
                                Preparation
                              </p>

                              <p className="mt-0.5 text-[10px] font-bold text-slate-700">
                                {special.preparation_time} min
                              </p>

                            </div>

                          </div>

                        )}


                        <div className="flex flex-1 items-center gap-2 rounded-2xl bg-slate-50 px-3 py-3">

                          <Clock className="h-4 w-4 text-[#5F2EEA]" />

                          <div>

                            <p className="text-[8px] text-slate-400">
                              Order by
                            </p>

                            <p className="mt-0.5 text-[10px] font-bold text-slate-700">
                              {special.cutoff_time ||
                                "Tonight"}
                            </p>

                          </div>

                        </div>

                      </div>


                      {/* =================================================
                          INGREDIENTS
                      ================================================= */}

                      {special.ingredients && (

                        <div className="mt-5 rounded-2xl bg-[#FAF9FF] p-4">

                          <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white">

                              <Utensils className="h-4 w-4 text-[#5F2EEA]" />

                            </div>

                            <div>

                              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                Ingredients
                              </p>

                              <p className="mt-0.5 text-[10px] font-semibold text-slate-700">
                                Chef selected ingredients
                              </p>

                            </div>

                          </div>


                          <p className="mt-3 text-[10px] leading-5 text-slate-500">
                            {special.ingredients}
                          </p>

                        </div>

                      )}


                      {/* =================================================
                          PRICE
                      ================================================= */}

                      <div className="mt-6 rounded-[1.5rem] bg-gradient-to-r from-orange-50 to-purple-50 p-4">

                        <div className="flex items-end justify-between">

                          <div>

                            <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                              Tomorrow's price
                            </p>


                            <div className="mt-1 flex items-center gap-2">

                              <span className="text-2xl font-bold tracking-tight text-slate-900">
                                ₹{special.price}
                              </span>


                              {hasDiscount && (

                                <span className="text-xs font-medium text-slate-400 line-through">
                                  ₹{special.original_price}
                                </span>

                              )}

                            </div>

                          </div>


                          <div className="text-right">

                            <p className="text-[8px] text-slate-400">
                              Availability
                            </p>

                            <p
                              className={`mt-1 text-[10px] font-bold ${
                                isLowStock
                                  ? "text-red-500"
                                  : "text-emerald-600"
                              }`}
                            >

                              {special.remaining} plates left

                            </p>

                          </div>

                        </div>


                        {/* CTA */}

                        <button
                          onClick={() => {

                            const selectedSpecial = {

                              id:
                                special.id,

                              name:
                                special.dish_name,

                              description:
                                special.description,

                              price:
                                special.price,

                              original_price:
                                special.original_price,

                              quantity:
                                Number(
                                  special.remaining
                                ),

                              remaining:
                                Number(
                                  special.remaining
                                ),

                              max_plates:
                                special.max_plates,

                              pre_orders:
                                special.pre_orders,

                              image_urls:
                                special.image_url
                                  ? [
                                      special.image_url,
                                    ]
                                  : [],

                              chef_id:
                                special.chef_id,

                              chef_name:
                                special.chef_name,

                              distance:
                                special.distance,

                              food_type:
                                special.food_type,

                              calories:
                                special.calories,

                              protein:
                                special.protein,

                              carbs:
                                special.carbs,

                              fats:
                                special.fats,

                              preparation_time:
                                special.preparation_time,

                              ingredients:
                                special.ingredients,

                              cutoff_time:
                                special.cutoff_time,

                              special_date:
                                special.special_date,

                              type:
                                "special",
                            };


                            console.log(
                              "VIEW ALL SPECIAL CLICK:",
                              selectedSpecial
                            );


                            onNavigateToSpecialDetail?.(
                              selectedSpecial
                            );

                          }}

                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF7A30] to-[#5F2EEA] py-3.5 text-xs font-bold text-white shadow-[0_10px_25px_rgba(95,46,234,0.18)] transition active:scale-[0.98]"
                        >

                          <span>
                            View Tomorrow's Special
                          </span>

                          <span className="text-base">
                            →
                          </span>

                        </button>

                      </div>


                      {/* CUT OFF */}

                      <div className="mt-4 flex items-center justify-center gap-1.5">

                        <Clock className="h-3 w-3 text-slate-400" />

                        <span className="text-[8px] text-slate-400">
                          Pre-order before{" "}
                          {special.cutoff_time ||
                            "cutoff time"}
                        </span>

                      </div>

                    </div>

                  </motion.div>

                );

              }
            )}

        </div>

      )}

    </div>

  </div>
);
}