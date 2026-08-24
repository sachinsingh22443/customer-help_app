import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Bell,
  ShoppingCart,
  TrendingUp,
  Salad,
  Apple,
  Drumstick,
  ChevronRight,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useCart } from "../../contexts/CartContext";
import Location from "./Location";
// import { ChevronRight } from "lucide-react";



interface CustomerHomeProps {
  onNavigateToSubscription: () => void;
  onNavigateToTomorrowSpecials: (category?: string) => void; // 🔥 FIX
  onNavigateToChefDetails: (chefId: string) => void;
  onNavigateToCategory: (category: "healthy" | "protein" | "tiffin" | "diet") => void;
  onNavigateToCart?: () => void;
  onNavigateToSearch?: () => void;
  onNavigateToNotifications?: () => void;
  onNavigateToSpecialDetail: (item: any) => void;
  onNavigateToAllChefs: () => void;
}

export function CustomerHome({
  onNavigateToSubscription,
  onNavigateToTomorrowSpecials,
  onNavigateToChefDetails,
  onNavigateToCategory,
  onNavigateToCart,
  onNavigateToNotifications,
  onNavigateToSpecialDetail,
   onNavigateToAllChefs,
}: CustomerHomeProps) {

  const { getTotalItems } = useCart();

  const [chefs, setChefs] = useState<any[]>([]);
  const [specials, setSpecials] = useState<any[]>([]);
  const [loadingChefs, setLoadingChefs] = useState(true);
  const [loadingSpecials, setLoadingSpecials] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [showLocation, setShowLocation] = useState(false);
  const [locationName, setLocationName] = useState("Select Location");

  useEffect(() => {
    const savedCity = localStorage.getItem("location_name");
    if (savedCity) setLocationName(savedCity);
  }, []);


  useEffect(() => {
  if (showLocation) {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }
}, [showLocation]);
  // =========================
  // 🔥 FETCH CHEFS
  // =========================
  const fetchNearbyChefs = async () => {
    try {
      const lat = localStorage.getItem("lat");
      const lng = localStorage.getItem("lng");

      if (!lat || !lng) return;

      setLoadingChefs(true);

      const res = await fetch(
        `https://chef-backend-qh12.onrender.com/menu/nearby-chefs?lat=${lat}&lng=${lng}&category=${selectedCategory}`
      );

      const data = await res.json();
      setChefs(data || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChefs(false);
    }
  };

  // =========================
  // 🔥 FETCH SPECIALS
  // =========================
  const fetchSpecials = async () => {
    try {
      const lat = localStorage.getItem("lat");
      const lng = localStorage.getItem("lng");

      if (!lat || !lng) return;

      setLoadingSpecials(true);

      const res = await fetch(
        `https://chef-backend-qh12.onrender.com/tomorrow-special/nearby?lat=${lat}&lng=${lng}&category=${selectedCategory}`
      );

      const data = await res.json();
      setSpecials(data || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSpecials(false);
    }
  };

  // 🔥 RELOAD ON CATEGORY CHANGE
  useEffect(() => {
    fetchNearbyChefs();
    fetchSpecials();
  }, [selectedCategory]);

  // 🔥 SEARCH
  const searchChefs = async (value: string) => {
    const lat = localStorage.getItem("lat");
    const lng = localStorage.getItem("lng");

    if (!lat || !lng) return;

    const res = await fetch(
      `https://chef-backend-qh12.onrender.com/menu/search-chefs?query=${value}&lat=${lat}&lng=${lng}`
    );

    const data = await res.json();
    setChefs(data || []);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim() === "") {
        fetchNearbyChefs();
      } else {
        searchChefs(search);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  // =========================
  // 🔥 CATEGORY LIST
  // =========================
  const categories = [
    { name: "Healthy", key: "healthy", icon: Salad },
    { name: "Protein Rich", key: "protein", icon: Drumstick },
    { name: "Tiffin", key: "tiffin", icon: Apple },
    { name: "Diet Plan", key: "diet", icon: TrendingUp },
  ];

    return (
    <div className="min-h-screen bg-[#F8F7F4] pb-24 text-slate-900">

      {/* PREMIUM HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#25134F] via-[#5F2EEA] to-[#FF7A30] px-5 pb-8 pt-10 rounded-b-[2.2rem] shadow-[0_12px_35px_rgba(95,46,234,0.20)]">
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-orange-300/20 blur-3xl" />

        <div className="relative flex items-center justify-between mb-7">
          <button
            onClick={() => setShowLocation(true)}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
              <MapPin className="h-5 w-5 text-white" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/60">
                Delivering to
              </p>

              <p className="max-w-[170px] truncate text-sm font-semibold text-white">
                {locationName}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">

            {/* NOTIFICATION */}
            <button
              onClick={onNavigateToNotifications}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md"
            >
              <Bell className="h-5 w-5 text-white" />
            </button>

            {/* CART */}
            <button
              onClick={onNavigateToCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md"
            >
              <ShoppingCart className="h-5 w-5 text-white" />

              {getTotalItems() > 0 && (
                <span className="absolute -right-1 -top-1 min-w-5 h-5 rounded-full bg-[#FF7A30] px-1.5 text-[10px] font-bold text-white flex items-center justify-center border-2 border-[#5F2EEA]">
                  {getTotalItems()}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* HEADER TITLE */}
        <div className="relative mb-2">
          <p className="mb-1 text-xs font-medium text-white/70">
            Fresh food. Personalised for you.
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Eat better, live better.
          </h1>
        </div>

        {/* SEARCH */}
        <div className="relative mt-5 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-lg">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chefs, meals or plans..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </div>


      {/* ===================================================== */}
      {/* SUBSCRIPTION - TOP PRIORITY */}
      {/* ===================================================== */}

      <section className="px-5 pt-5">

        <button
          onClick={onNavigateToSubscription}
          className="group relative w-full overflow-hidden rounded-[1.6rem] bg-gradient-to-r from-[#FF7A30] via-[#FF5C35] to-[#5F2EEA] p-[1px] text-left shadow-[0_14px_30px_rgba(95,46,234,0.18)]"
        >

          <div className="relative overflow-hidden rounded-[1.55rem] px-5 py-5 text-white">

            <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/15 blur-xl" />

            <div className="pointer-events-none absolute -bottom-12 right-16 h-24 w-24 rounded-full bg-purple-300/20 blur-2xl" />

            <div className="relative flex items-start justify-between gap-4">

              <div className="flex min-w-0 gap-3">

                {/* CROWN */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm">
                  <Crown className="h-6 w-6 text-yellow-200" />
                </div>

                <div>

                  <div className="mb-1 flex items-center gap-2">

                    <span className="rounded-full bg-white/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider">
                      Premium
                    </span>

                    <Sparkles className="h-3.5 w-3.5 text-yellow-200" />

                  </div>

                  <h2 className="text-lg font-bold">
                    Your personal meal plan
                  </h2>

                  <p className="mt-1 text-xs leading-relaxed text-white/80">
                    Healthy meals, expert chefs & plans made for your goals.
                  </p>

                </div>

              </div>

              <ChevronRight className="mt-2 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />

            </div>


            {/* SUBSCRIPTION BOTTOM */}
            <div className="relative mt-4 flex items-center justify-between border-t border-white/15 pt-3">

              <div className="flex items-center gap-2 text-[11px] text-white/85">

                <ShieldCheck className="h-4 w-4" />

                <span>
                  Flexible plans • Fresh daily meals
                </span>

              </div>

              <span className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#5F2EEA]">
                View Plans
              </span>

            </div>

          </div>

        </button>

      </section>


      {/* ===================================================== */}
      {/* VERIFIED CHEFS */}
      {/* ===================================================== */}

      <section className="px-5 pt-7">

        <div className="mb-4 flex items-end justify-between">

          <div>

            <div className="flex items-center gap-2">

              <h2 className="text-lg font-bold">
                Verified Chefs
              </h2>

              <ShieldCheck className="h-4 w-4 text-[#0FAD6E]" />

            </div>

            <p className="mt-0.5 text-xs text-slate-500">
              Trusted chefs serving near you
            </p>

          </div>


          <button
            onClick={onNavigateToAllChefs}
            className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#5F2EEA] shadow-sm ring-1 ring-slate-100"
          >

            View All

            <ChevronRight className="h-3.5 w-3.5" />

          </button>

        </div>


        {/* LOADING CHEFS */}
        {loadingChefs ? (

          <div className="flex gap-3 overflow-hidden">

            {[1, 2].map((i) => (

              <div
                key={i}
                className="h-48 w-44 shrink-0 animate-pulse rounded-2xl bg-white"
              />

            ))}

          </div>

        ) : chefs.length === 0 ? (

          /* NO CHEFS */
          <div className="rounded-2xl bg-white p-5 text-center ring-1 ring-slate-100">

            <p className="text-sm font-medium text-slate-700">
              No chefs found nearby
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your location.
            </p>

          </div>

        ) : (

          /* CHEF LIST */
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">

            {chefs.slice(0, 5).map((chef) => (

              <button
                key={chef.id}
                onClick={() => onNavigateToChefDetails(chef.id)}
                className="group w-44 shrink-0 overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >

                {/* CHEF IMAGE */}
                <div className="relative">

                  <ImageWithFallback
                    src={chef.profile_image}
                    alt={chef.name}
                    className="h-32 w-full object-cover"
                  />

                  {/* VERIFIED BADGE */}
                  <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[9px] font-bold text-[#0FAD6E] shadow-sm">

                    <ShieldCheck className="h-3 w-3" />

                    VERIFIED

                  </div>

                </div>


                {/* CHEF INFO */}
                <div className="p-3">

                  <p className="truncate text-sm font-bold text-slate-900">
                    {chef.name}
                  </p>

                  <p className="mt-1 truncate text-[11px] text-slate-500">
                    {chef.specialties || "Healthy home-style meals"}
                  </p>

                  <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-slate-400">

                    <MapPin className="h-3 w-3" />

                    Nearby chef

                  </div>

                </div>

              </button>

            ))}

          </div>

        )}

      </section>


      {/* ===================================================== */}
      {/* UNIQUE CATEGORIES */}
      {/* ===================================================== */}

      <section className="pt-7">

        <div className="mb-4 flex items-end justify-between px-5">

          <div>

            <h2 className="text-lg font-bold">
              Explore by goal
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Choose what your body needs today
            </p>

          </div>

          <Sparkles className="h-5 w-5 text-[#FF7A30]" />

        </div>


        {/* HORIZONTAL CATEGORY CARDS */}
        <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">

          {categories.map((cat, i) => {

            const Icon = cat.icon;

            const selected = selectedCategory === cat.key;


            const categoryMeta = [

              {
                subtitle: "Clean & balanced",
                iconBg: "bg-emerald-50",
                iconColor: "text-emerald-600",
                glow: "from-emerald-100/70",
              },

              {
                subtitle: "Power your day",
                iconBg: "bg-orange-50",
                iconColor: "text-orange-600",
                glow: "from-orange-100/70",
              },

              {
                subtitle: "Homely & fresh",
                iconBg: "bg-blue-50",
                iconColor: "text-blue-600",
                glow: "from-blue-100/70",
              },

              {
                subtitle: "Goal-focused",
                iconBg: "bg-purple-50",
                iconColor: "text-purple-600",
                glow: "from-purple-100/70",
              },

            ][i];


            return (

              <button
                key={cat.key}
                onClick={() => {

                  const newCategory =
                    selected ? "" : cat.key;

                  setSelectedCategory(newCategory);

                  localStorage.setItem(
                    "category",
                    newCategory
                  );

                  onNavigateToCategory(
                    cat.key as
                      | "healthy"
                      | "protein"
                      | "tiffin"
                      | "diet"
                  );

                }}
                className={`relative w-[150px] shrink-0 overflow-hidden rounded-[1.35rem] border p-4 text-left transition-all ${
                  selected
                    ? "border-[#5F2EEA] bg-[#5F2EEA] text-white shadow-[0_10px_25px_rgba(95,46,234,0.25)]"
                    : "border-slate-100 bg-white text-slate-900 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >

                {/* GLOW */}
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-br ${categoryMeta.glow} to-transparent blur-xl`}
                />


                {/* ICON */}
                <div
                  className={`relative mb-5 flex h-11 w-11 items-center justify-center rounded-2xl ${
                    selected
                      ? "bg-white/15 text-white"
                      : `${categoryMeta.iconBg} ${categoryMeta.iconColor}`
                  }`}
                >

                  <Icon className="h-5 w-5" />

                </div>


                {/* CATEGORY NAME */}
                <p
                  className={`relative text-sm font-bold ${
                    selected
                      ? "text-white"
                      : "text-slate-900"
                  }`}
                >
                  {cat.name}
                </p>


                {/* SUBTITLE */}
                <p
                  className={`relative mt-1 text-[10px] leading-4 ${
                    selected
                      ? "text-white/70"
                      : "text-slate-400"
                  }`}
                >
                  {categoryMeta.subtitle}
                </p>


                {/* EXPLORE */}
                <div
                  className={`relative mt-3 flex items-center gap-1 text-[10px] font-semibold ${
                    selected
                      ? "text-white/90"
                      : categoryMeta.iconColor
                  }`}
                >

                  Explore

                  <ChevronRight className="h-3 w-3" />

                </div>

              </button>

            );

          })}

        </div>

      </section>


      {/* ===================================================== */}
      {/* TOMORROW SPECIALS */}
      {/* ===================================================== */}

      <section className="px-5 pt-7">

        <div className="mb-4 flex items-end justify-between">

          <div>

            <div className="flex items-center gap-2">

              <h2 className="text-lg font-bold">
                Tomorrow Specials
              </h2>

              <Flame className="h-4 w-4 text-[#FF7A30]" />

            </div>

            <p className="mt-0.5 text-xs text-slate-500">
              Limited dishes prepared fresh for tomorrow
            </p>

          </div>


          <button
            onClick={() =>
              onNavigateToTomorrowSpecials(
                selectedCategory
              )
            }
            className="flex items-center gap-1 text-xs font-semibold text-[#FF7A30]"
          >

            View All

            <ChevronRight className="h-4 w-4" />

          </button>

        </div>


        {/* LOADING SPECIALS */}
        {loadingSpecials ? (

          <div className="grid grid-cols-2 gap-3">

            {[1, 2].map((i) => (

              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl bg-white"
              />

            ))}

          </div>

        ) : specials.length === 0 ? (

          /* EMPTY STATE */
          <div className="rounded-2xl bg-white p-5 text-center ring-1 ring-slate-100">

            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">

              <Utensils className="h-5 w-5 text-[#FF7A30]" />

            </div>

            <p className="text-sm font-semibold text-slate-700">
              No specials in your area yet
            </p>

            <button
              onClick={() =>
                onNavigateToTomorrowSpecials(
                  selectedCategory
                )
              }
              className="mt-2 text-xs font-semibold text-[#FF7A30]"
            >
              Explore all specials →
            </button>

          </div>

        ) : (

          /* SPECIAL CARDS */
          <div className="grid grid-cols-2 gap-3">

            {specials.slice(0, 4).map((item: any) => (

              <button
                key={item.id}
                onClick={() =>
                  onNavigateToSpecialDetail(item)
                }
                className="overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
              >

                <ImageWithFallback
                  src={item.image_url}
                  alt={item.dish_name}
                  className="h-32 w-full object-cover"
                />

                <div className="p-3">

                  <p className="truncate text-sm font-bold text-slate-900">
                    {item.dish_name}
                  </p>

                  <div className="mt-1 flex items-center justify-between">

                    <p className="text-xs text-slate-500">
                      Tomorrow
                    </p>

                    <p className="text-sm font-bold text-[#5F2EEA]">
                      ₹{item.price}
                    </p>

                  </div>

                </div>

              </button>

            ))}

          </div>

        )}

      </section>


      {/* ===================================================== */}
      {/* LOCATION MODAL */}
      {/* ===================================================== */}

      {showLocation && (

        <Location

          onLocationSelect={(lat, lng, city) => {

            localStorage.setItem(
              "lat",
              lat
            );

            localStorage.setItem(
              "lng",
              lng
            );

            localStorage.setItem(
              "location_name",
              city
            );

            setLocationName(city);

            fetchNearbyChefs();

            fetchSpecials();

            setShowLocation(false);

          }}

          onClose={() =>
            setShowLocation(false)
          }

        />

      )}

    </div>
  );
}