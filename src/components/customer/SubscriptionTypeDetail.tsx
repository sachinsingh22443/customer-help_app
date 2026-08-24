import {
  ArrowLeft,
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
  Salad,
} from "lucide-react";

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
  selectedPlan: Plan | null;
  onBack: () => void;
  onSelectDuration: () => void;
}

export function SubscriptionTypeDetail({
  selectedPlan,
  onBack,
  onSelectDuration,
}: Props) {

  /* ========================================================= */
  /* NULL STATE */
  /* ========================================================= */

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-6">

        <div className="rounded-[1.8rem] bg-white p-7 text-center shadow-lg">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50">
            <Crown className="h-7 w-7 text-[#5F2EEA]" />
          </div>

          <h2 className="mt-4 font-bold text-slate-900">
            Loading your plan...
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Please wait a moment
          </p>

        </div>

      </div>
    );
  }


  /* ========================================================= */
  /* INVALID PLAN */
  /* ========================================================= */

  if (!selectedPlan.plan_id) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-6">

        <div className="rounded-[1.8rem] bg-white p-7 text-center shadow-lg">

          <h2 className="font-bold text-slate-900">
            No plan selected
          </h2>

          <button
            onClick={onBack}
            className="mt-5 rounded-xl bg-gradient-to-r from-[#FF7A30] to-[#5F2EEA] px-5 py-3 text-sm font-bold text-white"
          >
            Go Back
          </button>

        </div>

      </div>
    );
  }


  /* ========================================================= */
  /* PLAN TYPE LABEL */
  /* ========================================================= */

  const getPlanTypeLabel = () => {

    if (selectedPlan.plan_type === "dietician") {
      return "👨‍⚕️ Dietician Guided";
    }

    if (selectedPlan.plan_type === "gym") {
      return "💪 Gym + Trainer";
    }

    if (selectedPlan.plan_type === "normal") {
      return "🥗 Balanced Meals";
    }

    return selectedPlan.plan_type || "Premium Plan";
  };


  return (
    <div className="min-h-screen bg-[#F8F7F4] pb-32">

      {/* ===================================================== */}
      {/* PREMIUM HERO */}
      {/* ===================================================== */}

      <div
        className="relative overflow-hidden rounded-b-[2.7rem] px-5 pb-7 pt-7 shadow-[0_15px_40px_rgba(95,46,234,0.20)]"
        style={{
          background:
            selectedPlan.color ||
            "linear-gradient(135deg,#25134F 0%,#5F2EEA 55%,#FF7A30 100%)",
        }}
      >

        {/* GLOW */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 left-5 h-44 w-44 rounded-full bg-orange-300/20 blur-3xl" />


        {/* TOP NAV */}
        <div className="relative flex items-center justify-between">

          <button
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>


          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">

            <Crown className="h-3.5 w-3.5 text-yellow-200" />

            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white">
              Premium Plan
            </span>

          </div>

        </div>


        {/* PLAN HERO */}
        <div className="relative mt-8">

          <div className="flex items-start gap-4">

            {/* EMOJI */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.6rem] bg-white/15 text-4xl shadow-lg ring-1 ring-white/20 backdrop-blur-md">
              {selectedPlan.emoji || "🍱"}
            </div>


            <div className="min-w-0 flex-1">

              {/* TYPE */}
              <div className="mb-2 flex flex-wrap gap-2">

                <span className="rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  {getPlanTypeLabel()}
                </span>

                <Sparkles className="h-4 w-4 text-yellow-200" />

              </div>


              {/* TITLE */}
              <h1 className="text-2xl font-bold leading-tight text-white">
                {selectedPlan.title}
              </h1>


              {/* TAGLINE */}
              {selectedPlan.tagline && (
                <p className="mt-2 text-xs leading-5 text-white/75">
                  {selectedPlan.tagline}
                </p>
              )}

            </div>

          </div>


          {/* PRICE */}
          <div className="mt-7 flex items-end justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/60">
                Starting at
              </p>

              <div className="mt-1 flex items-end gap-2">

                <span className="text-4xl font-bold tracking-tight text-white">
                  ₹{selectedPlan.price}
                </span>

                <span className="mb-1.5 text-xs text-white/60">
                  / plan
                </span>

              </div>

            </div>


            {selectedPlan.duration_days && (
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-md">

                <Clock3 className="h-4 w-4 text-white" />

                <div>

                  <p className="text-[8px] uppercase text-white/50">
                    Duration
                  </p>

                  <p className="text-xs font-bold text-white">
                    {selectedPlan.duration_days} Days
                  </p>

                </div>

              </div>
            )}

          </div>


          {/* CHEF */}
          {selectedPlan.chef_name && (
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <ChefHat className="h-5 w-5 text-white" />
                </div>

                <div>

                  <p className="text-[9px] uppercase tracking-wider text-white/50">
                    Created by
                  </p>

                  <div className="flex items-center gap-1">

                    <p className="text-sm font-bold text-white">
                      {selectedPlan.chef_name}
                    </p>

                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-200" />

                  </div>

                </div>

              </div>


              <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-200">

                <ShieldCheck className="h-3.5 w-3.5" />

                Verified

              </div>

            </div>
          )}


          {/* TAGS */}
          <div className="mt-4 flex flex-wrap gap-2">

            {selectedPlan.goal && (
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md">
                🎯 {selectedPlan.goal}
              </span>
            )}

            {selectedPlan.diet_type && (
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md">
                🌿 {selectedPlan.diet_type}
              </span>
            )}

          </div>

        </div>

      </div>


      {/* ===================================================== */}
      {/* CONTENT */}
      {/* ===================================================== */}

      <div className="space-y-5 px-5 pt-6">


        {/* =================================================== */}
        {/* QUICK STATS */}
        {/* =================================================== */}

        <div className="grid grid-cols-3 gap-2.5">

          {/* CALORIES */}
          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">

              <Flame className="h-4 w-4 text-orange-500" />

            </div>

            <p className="mt-2 text-[9px] text-slate-400">
              Calories
            </p>

            <p className="mt-0.5 text-xs font-bold text-slate-800">
              {selectedPlan.calories_per_day
                ? `${selectedPlan.calories_per_day}`
                : "--"}
            </p>

            <p className="text-[8px] text-slate-400">
              kcal/day
            </p>

          </div>


          {/* MEALS */}
          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">

              <Utensils className="h-4 w-4 text-[#5F2EEA]" />

            </div>

            <p className="mt-2 text-[9px] text-slate-400">
              Meals
            </p>

            <p className="mt-0.5 truncate text-xs font-bold text-slate-800">
              {(selectedPlan.meal_type || []).length
                ? `${selectedPlan.meal_type?.length}`
                : "--"}
            </p>

            <p className="text-[8px] text-slate-400">
              per day
            </p>

          </div>


          {/* DURATION */}
          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">

              <Clock3 className="h-4 w-4 text-emerald-600" />

            </div>

            <p className="mt-2 text-[9px] text-slate-400">
              Duration
            </p>

            <p className="mt-0.5 text-xs font-bold text-slate-800">
              {selectedPlan.duration_days || "--"}
            </p>

            <p className="text-[8px] text-slate-400">
              days
            </p>

          </div>

        </div>


        {/* =================================================== */}
        {/* DESCRIPTION */}
        {/* =================================================== */}

        {selectedPlan.description && (
          <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50">

                <Sparkles className="h-4 w-4 text-[#5F2EEA]" />

              </div>

              <h3 className="text-sm font-bold text-slate-900">
                About this plan
              </h3>

            </div>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              {selectedPlan.description}
            </p>

          </div>
        )}


        {/* =================================================== */}
        {/* MEALS */}
        {/* =================================================== */}

        {(selectedPlan.meal_type || []).length > 0 && (

          <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">

                  <Utensils className="h-5 w-5 text-orange-500" />

                </div>

                <div>

                  <h3 className="text-sm font-bold text-slate-900">
                    Daily meals
                  </h3>

                  <p className="text-[10px] text-slate-400">
                    Meals included in your routine
                  </p>

                </div>

              </div>

            </div>


            <div className="mt-4 flex flex-wrap gap-2">

              {(selectedPlan.meal_type || []).map(
                (meal, index) => (

                  <div
                    key={index}
                    className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    🍽️ {meal}
                  </div>

                )
              )}

            </div>

          </div>

        )}


        {/* =================================================== */}
        {/* BREAKFAST ADDON */}
        {/* =================================================== */}

        {selectedPlan.breakfast_available && (

          <div className="relative overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">

            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100 blur-2xl" />

            <div className="relative flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                  🍳
                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <h3 className="text-sm font-bold text-emerald-900">
                      Breakfast Available
                    </h3>

                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[8px] font-bold uppercase text-emerald-700">
                      Add-on
                    </span>

                  </div>

                  <p className="mt-1 text-[10px] text-emerald-700/70">
                    Start your day with a fresh meal
                  </p>

                </div>

              </div>


              <div className="text-right">

                <p className="text-sm font-bold text-emerald-700">
                  ₹{selectedPlan.breakfast_price}
                </p>

                <p className="text-[9px] text-emerald-600/60">
                  / day
                </p>

              </div>

            </div>

          </div>

        )}


        {/* =================================================== */}
        {/* FEATURES */}
        {/* =================================================== */}

        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">

              <Crown className="h-5 w-5 text-[#5F2EEA]" />

            </div>

            <div>

              <h3 className="text-sm font-bold text-slate-900">
                Plan benefits
              </h3>

              <p className="text-[10px] text-slate-400">
                Everything included in your plan
              </p>

            </div>

          </div>


          <div className="mt-5 space-y-3">

            {(selectedPlan.features || []).length > 0 ? (

              (selectedPlan.features || []).map(
                (feature, index) => (

                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >

                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50">

                      <Check className="h-3.5 w-3.5 text-emerald-600" />

                    </div>

                    <p className="text-xs leading-5 text-slate-600">
                      {feature}
                    </p>

                  </div>

                )

              )

            ) : (

              <p className="text-xs text-slate-400">
                Premium meals and personalized service included.
              </p>

            )}

          </div>

        </div>


        {/* =================================================== */}
        {/* WHAT'S INCLUDED */}
        {/* =================================================== */}

        {(selectedPlan.includes || []).length > 0 && (

          <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">

                <Leaf className="h-5 w-5 text-emerald-600" />

              </div>

              <div>

                <h3 className="text-sm font-bold text-slate-900">
                  What's included
                </h3>

                <p className="text-[10px] text-slate-400">
                  Your subscription covers
                </p>

              </div>

            </div>


            <div className="mt-5 grid grid-cols-1 gap-3">

              {(selectedPlan.includes || []).map(
                (item, index) => (

                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3"
                  >

                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">

                      <Check className="h-3.5 w-3.5 text-emerald-600" />

                    </div>

                    <span className="text-xs font-medium text-slate-600">
                      {item}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        )}


        {/* =================================================== */}
        {/* TRUST CARD */}
        {/* =================================================== */}

        <div className="rounded-[1.5rem] border border-purple-100 bg-gradient-to-br from-purple-50 to-orange-50 p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">

              <ShieldCheck className="h-5 w-5 text-[#5F2EEA]" />

            </div>

            <div>

              <h3 className="text-sm font-bold text-slate-800">
                Fresh & verified
              </h3>

              <p className="mt-1 text-[10px] leading-5 text-slate-500">
                Your meals are prepared by verified chefs
                and delivered fresh according to your plan.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ===================================================== */}
      {/* FIXED BOTTOM CTA */}
      {/* ===================================================== */}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white/95 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl">

        <div className="mx-auto max-w-2xl">

          <div className="mb-2 flex items-center justify-between px-1">

            <div>

              <p className="text-[9px] uppercase tracking-wider text-slate-400">
                Selected plan
              </p>

              <p className="text-xs font-bold text-slate-800">
                {selectedPlan.title}
              </p>

            </div>

            <p className="text-lg font-bold text-[#5F2EEA]">
              ₹{selectedPlan.price}
            </p>

          </div>


          <button
            onClick={onSelectDuration}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF7A30] via-[#FF5C35] to-[#5F2EEA] py-4 text-sm font-bold text-white shadow-[0_8px_20px_rgba(95,46,234,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(95,46,234,0.30)]"
          >

            <Crown className="h-4 w-4 text-yellow-200" />

            Choose Duration

            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>

          </button>

        </div>

      </div>

    </div>
  );
}