import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChefHat,
  Clock3,
  Crown,
  Flame,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Utensils,
} from "lucide-react";

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
  goal?: string;
  diet_type?: string;
  meal_type?: string[];
  plan_type?: string;
  calories_per_day?: number;
  duration_days?: number;
  tagline?: string;
  includes?: string[];
  breakfast_available?: boolean;
  breakfast_price?: number;
}

interface SubscriptionPlansProps {
  onSelectPlan: (plan: any) => void;
  onBack: () => void;
}

export function SubscriptionPlans({
  onSelectPlan,
  onBack,
}: SubscriptionPlansProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError("");

        const lat = localStorage.getItem("lat");
        const lng = localStorage.getItem("lng");

        if (!lat || !lng) {
          throw new Error("Location not selected");
        }

        const res = await fetch(
          `https://chef-backend-qh12.onrender.com/subscriptions/plans?lat=${lat}&lng=${lng}`
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

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F3]">

        <div className="relative overflow-hidden rounded-b-[2.7rem] bg-gradient-to-br from-[#24104D] via-[#5F2EEA] to-[#FF7A30] px-5 pb-9 pt-8">

          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">

            <div className="h-11 w-11 animate-pulse rounded-2xl bg-white/15" />

            <div className="mt-10 h-4 w-28 animate-pulse rounded bg-white/15" />

            <div className="mt-3 h-9 w-64 animate-pulse rounded bg-white/15" />

            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-white/10" />

          </div>

        </div>

        <div className="space-y-5 px-5 pt-6">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-[1.8rem] bg-white shadow-sm"
            />
          ))}

        </div>

      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F6F3] px-5 flex items-center justify-center">

        <div className="w-full max-w-sm rounded-[2rem] bg-white p-7 text-center shadow-xl">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <Flame className="h-7 w-7 text-red-500" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#FF7A30] to-[#5F2EEA] py-3.5 text-sm font-bold text-white shadow-lg"
          >
            Try Again
          </button>

          <button
            onClick={onBack}
            className="mt-3 w-full rounded-2xl border border-slate-200 py-3.5 text-sm font-semibold text-slate-600"
          >
            Back to Home
          </button>

        </div>

      </div>
    );
  }

  /* =========================================================
     EMPTY
  ========================================================= */

  if (!plans.length) {
    return (
      <div className="min-h-screen bg-[#F7F6F3] px-5 flex items-center justify-center">

        <div className="w-full max-w-sm text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.8rem] bg-gradient-to-br from-orange-100 to-purple-100">

            <Crown className="h-9 w-9 text-[#5F2EEA]" />

          </div>

          <h2 className="mt-6 text-xl font-bold text-slate-900">
            Plans are coming soon
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            We couldn't find subscription plans around your
            current location.
          </p>

          <button
            onClick={onBack}
            className="mt-7 flex mx-auto items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF7A30] to-[#5F2EEA] px-6 py-3.5 text-sm font-bold text-white shadow-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3] pb-12">

      {/* =====================================================
          PREMIUM HERO
      ===================================================== */}

      <div className="relative overflow-hidden rounded-b-[2.7rem] bg-gradient-to-br from-[#24104D] via-[#5F2EEA] to-[#FF7A30] px-5 pb-9 pt-7 shadow-[0_15px_40px_rgba(95,46,234,0.22)]">

        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-20 -top-16 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 left-10 h-48 w-48 rounded-full bg-orange-300/20 blur-3xl" />

        <div className="pointer-events-none absolute right-20 top-28 h-20 w-20 rounded-full border border-white/10" />

        {/* TOP BAR */}
        <div className="relative flex items-center justify-between">

          <button
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">

            <Crown className="h-3.5 w-3.5 text-yellow-200" />

            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white">
              Eat Unity Premium
            </span>

          </div>

        </div>

        {/* HERO TEXT */}
        <div className="relative mt-9">

          <div className="mb-3 flex items-center gap-2">

            <Sparkles className="h-4 w-4 text-yellow-200" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
              Personalized nutrition
            </span>

          </div>

          <h1 className="max-w-md text-[30px] font-bold leading-[1.08] tracking-tight text-white">
            A meal plan made
            <span className="block text-orange-200">
              around you.
            </span>
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
            Choose from verified chefs and nutrition-focused
            plans designed for your everyday goals.
          </p>

        </div>

        {/* TRUST PILLS */}
        <div className="relative mt-6 flex gap-2 overflow-x-auto scrollbar-hide">

          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 backdrop-blur-md">

            <ShieldCheck className="h-3.5 w-3.5 text-emerald-200" />

            <span className="text-[10px] font-semibold text-white/90">
              Verified Chefs
            </span>

          </div>

          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 backdrop-blur-md">

            <Leaf className="h-3.5 w-3.5 text-green-200" />

            <span className="text-[10px] font-semibold text-white/90">
              Fresh Meals
            </span>

          </div>

          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 backdrop-blur-md">

            <Sparkles className="h-3.5 w-3.5 text-yellow-200" />

            <span className="text-[10px] font-semibold text-white/90">
              Goal Focused
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="px-5 pt-7">

        <div className="flex items-end justify-between">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Available near you
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
              Find your plan
            </h2>

          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">

            <Utensils className="h-5 w-5 text-[#5F2EEA]" />

          </div>

        </div>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          {plans.length} personalized{" "}
          {plans.length === 1 ? "option" : "options"}{" "}
          available from nearby chefs.
        </p>

      </section>


      {/* =====================================================
          PLANS
      ===================================================== */}

      <div className="space-y-5 px-5 pt-5">

        {plans.map((plan, index) => {

          const isRecommended = index === 0;

          return (
            <motion.div
              key={plan.id + index}
              initial={{
                opacity: 0,
                y: 35,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.08,
                duration: 0.45,
              }}
            >

              <button
                onClick={() =>
                  onSelectPlan({
                    plan_id: plan.id,

                    chef_name:
                      plan.chef_name,

                    plan_type:
                      plan.plan_type,

                    title:
                      plan.title,

                    price:
                      plan.price,

                    goal:
                      plan.goal,

                    diet_type:
                      plan.diet_type,

                    meal_type:
                      plan.meal_type,

                    calories_per_day:
                      plan.calories_per_day,

                    duration_days:
                      plan.duration_days,

                    tagline:
                      plan.tagline,

                    description:
                      plan.description,

                    emoji:
                      plan.emoji,

                    color:
                      plan.color,

                    features:
                      plan.features,

                    includes:
                      plan.includes,

                    breakfast_available:
                      plan.breakfast_available,

                    breakfast_price:
                      plan.breakfast_price,

                    chef_id:
                      plan.chef_id,

                    menu_id:
                      plan.menu_id,

                    menu_name:
                      plan.menu_name,
                  })
                }
                className="group w-full text-left"
              >

                {/* OUTER BORDER */}
                <div
                  className={`rounded-[1.9rem] p-[1px] transition-all ${
                    isRecommended
                      ? "bg-gradient-to-br from-[#FF7A30] via-[#FFB347] to-[#5F2EEA]"
                      : "bg-slate-200"
                  }`}
                >

                  <div className="relative overflow-hidden rounded-[1.85rem] bg-white shadow-sm transition-all group-hover:-translate-y-0.5 group-hover:shadow-xl">

                    {/* RECOMMENDED */}
                    {isRecommended && (
                      <div className="absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF7A30] to-[#5F2EEA] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-lg">

                        <Sparkles className="h-3 w-3" />

                        Recommended

                      </div>
                    )}


                    {/* =================================================
                        PLAN TOP
                    ================================================= */}

                    <div
                      className={`relative overflow-hidden px-5 pb-5 pt-5 ${
                        isRecommended
                          ? "bg-gradient-to-br from-orange-50 via-white to-purple-50"
                          : "bg-slate-50/80"
                      }`}
                    >

                      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-100/60 blur-2xl" />

                      <div className="relative flex items-start gap-4">

                        {/* EMOJI */}
                        <div
                          className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-[1.35rem] text-3xl shadow-sm ring-1 ring-black/5"
                          style={{
                            background:
                              plan.color ||
                              "linear-gradient(135deg,#FF7A30,#5F2EEA)",
                          }}
                        >
                          {plan.emoji || "🍱"}
                        </div>


                        <div className="min-w-0 flex-1">

                          {plan.plan_type && (
                            <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider text-purple-700">
                              {plan.plan_type}
                            </span>
                          )}

                          <h3 className="mt-2 pr-16 text-xl font-bold leading-tight text-slate-900">
                            {plan.title}
                          </h3>

                          {plan.tagline && (
                            <p className="mt-1 text-[11px] font-medium text-[#5F2EEA]">
                              {plan.tagline}
                            </p>
                          )}

                        </div>

                      </div>

                    </div>


                    {/* =================================================
                        CARD BODY
                    ================================================= */}

                    <div className="p-5">

                      {/* CHEF */}
                      {plan.chef_name && (
                        <div className="mb-5 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">

                              <ChefHat className="h-5 w-5 text-orange-600" />

                            </div>

                            <div>

                              <p className="text-[8px] font-medium uppercase tracking-[0.14em] text-slate-400">
                                Created by
                              </p>

                              <div className="mt-0.5 flex items-center gap-1">

                                <p className="text-sm font-bold text-slate-800">
                                  {plan.chef_name}
                                </p>

                                <ShieldCheck className="h-3.5 w-3.5 text-[#0FAD6E]" />

                              </div>

                            </div>

                          </div>


                          {plan.distance !== undefined && (
                            <div className="text-right">

                              <div className="flex items-center justify-end gap-1 text-slate-400">

                                <MapPin className="h-3 w-3" />

                                <span className="text-[8px] uppercase tracking-wider">
                                  Nearby
                                </span>

                              </div>

                              <p className="mt-0.5 text-xs font-bold text-slate-700">
                                {plan.distance} km
                              </p>

                            </div>
                          )}

                        </div>
                      )}


                      {/* PRICE */}
                      <div className="flex items-end justify-between">

                        <div>

                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                            Plan price
                          </p>

                          <div className="mt-1 flex items-end gap-1">

                            <span className="text-3xl font-bold tracking-tight text-slate-900">
                              ₹{plan.price}
                            </span>

                            <span className="mb-1 text-[10px] text-slate-400">
                              / 30 days
                            </span>

                          </div>

                        </div>


                        <div className="flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-2">

                          <Crown className="h-3.5 w-3.5 text-[#5F2EEA]" />

                          <span className="text-[9px] font-bold text-[#5F2EEA]">
                            Premium
                          </span>

                        </div>

                      </div>


                      {/* GOAL + DIET */}
                      <div className="mt-5 flex flex-wrap gap-2">

                        {plan.goal && (
                          <span className="rounded-full bg-purple-50 px-3 py-1.5 text-[10px] font-bold text-purple-700">
                            🎯 {plan.goal}
                          </span>
                        )}

                        {plan.diet_type && (
                          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700">
                            🌿 {plan.diet_type}
                          </span>
                        )}

                      </div>


                      {/* QUICK STATS */}
                      <div className="mt-4 grid grid-cols-3 gap-2">

                        <div className="rounded-xl bg-slate-50 p-3">

                          <Flame className="h-4 w-4 text-orange-500" />

                          <p className="mt-2 text-[8px] text-slate-400">
                            Calories
                          </p>

                          <p className="mt-0.5 text-[10px] font-bold text-slate-700">
                            {plan.calories_per_day
                              ? `${plan.calories_per_day}`
                              : "--"}
                          </p>

                        </div>


                        <div className="rounded-xl bg-slate-50 p-3">

                          <Utensils className="h-4 w-4 text-[#5F2EEA]" />

                          <p className="mt-2 text-[8px] text-slate-400">
                            Meals
                          </p>

                          <p className="mt-0.5 truncate text-[10px] font-bold text-slate-700">
                            {plan.meal_type?.length
                              ? `${plan.meal_type.length}`
                              : "--"}
                          </p>

                        </div>


                        <div className="rounded-xl bg-slate-50 p-3">

                          <Clock3 className="h-4 w-4 text-emerald-600" />

                          <p className="mt-2 text-[8px] text-slate-400">
                            Duration
                          </p>

                          <p className="mt-0.5 text-[10px] font-bold text-slate-700">
                            {plan.duration_days
                              ? `${plan.duration_days}d`
                              : "--"}
                          </p>

                        </div>

                      </div>


                      {/* DESCRIPTION */}
                      {plan.description && (
                        <p className="mt-4 text-xs leading-5 text-slate-500">
                          {plan.description}
                        </p>
                      )}


                      {/* BREAKFAST */}
                      {plan.breakfast_available && (
                        <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
                              🍳
                            </div>

                            <div>

                              <p className="text-xs font-bold text-emerald-800">
                                Breakfast available
                              </p>

                              <p className="text-[9px] text-emerald-600">
                                Optional daily add-on
                              </p>

                            </div>

                          </div>

                          <p className="text-xs font-bold text-emerald-700">
                            +₹{plan.breakfast_price}/day
                          </p>

                        </div>
                      )}


                      {/* FEATURES */}
                      {plan.features &&
                        plan.features.length > 0 && (
                          <div className="mt-5">

                            <div className="mb-3 flex items-center justify-between">

                              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                What's included
                              </p>

                              <Sparkles className="h-3.5 w-3.5 text-[#FF7A30]" />

                            </div>

                            <div className="space-y-2.5">

                              {plan.features
                                .slice(0, 3)
                                .map((feature, i) => (

                                  <div
                                    key={i}
                                    className="flex items-start gap-2.5"
                                  >

                                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50">

                                      <Check className="h-3 w-3 text-emerald-600" />

                                    </div>

                                    <p className="text-xs leading-5 text-slate-600">
                                      {feature}
                                    </p>

                                  </div>

                                ))}

                            </div>

                          </div>
                        )}


                      {/* SELECT CTA */}
                      <div
                        className={`mt-5 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-md transition-all group-hover:-translate-y-0.5 group-hover:shadow-lg ${
                          isRecommended
                            ? "bg-gradient-to-r from-[#FF7A30] to-[#5F2EEA]"
                            : "bg-gradient-to-r from-[#5F2EEA] to-[#8064EA]"
                        }`}
                      >

                        <span>
                          View Plan Details
                        </span>

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />

                      </div>


                      {/* TRUST */}
                      <div className="mt-3 flex items-center justify-center gap-1.5">

                        <ShieldCheck className="h-3 w-3 text-[#0FAD6E]" />

                        <p className="text-[9px] text-slate-400">
                          Verified chef • Fresh meals • Flexible plan
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </button>

            </motion.div>
          );
        })}

      </div>


      {/* =====================================================
          BOTTOM TRUST SECTION
      ===================================================== */}

      <section className="px-5 pt-7">

        <div className="relative overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-[#24104D] to-[#5F2EEA] p-5 text-white">

          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />

          <div className="relative flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">

              <ShieldCheck className="h-5 w-5 text-emerald-200" />

            </div>

            <div>

              <h3 className="text-sm font-bold">
                Your food. Your goals. Your routine.
              </h3>

              <p className="mt-1 text-[10px] leading-5 text-white/60">
                Pick a plan from a verified chef and build
                a healthier everyday routine with Eat Unity.
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}