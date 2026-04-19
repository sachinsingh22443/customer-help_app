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

interface CustomerHomeProps {
  onNavigateToSubscription: () => void;
  onNavigateToTomorrowSpecials: (category?: string) => void; // 🔥 FIX
  onNavigateToChefDetails: (chefId: string) => void;
  onNavigateToCategory: (category: "healthy" | "protein" | "tiffin" | "diet") => void;
  onNavigateToCart?: () => void;
  onNavigateToSearch?: () => void;
  onNavigateToNotifications?: () => void;
  onNavigateToSpecialDetail: (item: any) => void;
}

export function CustomerHome({
  onNavigateToSubscription,
  onNavigateToTomorrowSpecials,
  onNavigateToChefDetails,
  onNavigateToCategory,
  onNavigateToCart,
  onNavigateToNotifications,
  onNavigateToSpecialDetail,
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
        `https://chef-backend-1.onrender.com/menu/nearby-chefs?lat=${lat}&lng=${lng}&category=${selectedCategory}`
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
        `https://chef-backend-1.onrender.com/tomorrow-special/nearby?lat=${lat}&lng=${lng}&category=${selectedCategory}`
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
      `https://chef-backend-1.onrender.com/menu/search-chefs?query=${value}&lat=${lat}&lng=${lng}`
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
    <div className="min-h-screen bg-[#FFF8F0] pb-24">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-8 rounded-b-[2rem]">

        <div className="flex justify-between mb-6">
          <div onClick={() => setShowLocation(true)} className="cursor-pointer">
            <MapPin className="text-white" />
            <p className="text-white text-sm">{locationName}</p>
          </div>

          <div className="flex gap-3">
            <button onClick={onNavigateToCart} className="relative">
              <ShoppingCart className="text-white" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-xs px-1 rounded-full">
                  {getTotalItems()}
                </span>
              )}
            </button>

            <button onClick={onNavigateToNotifications}>
              <Bell className="text-white" />
            </button>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl flex gap-2">
          <Search />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full outline-none"
          />
        </div>
      </div>

      {/* CHEFS */}
      <div className="p-6">
        <h3 className="mb-4 font-semibold">Verified Chefs</h3>

        {loadingChefs ? (
          <p>Loading...</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto">
            {chefs.map((chef) => (
              <div
                key={chef.id}
                onClick={() => onNavigateToChefDetails(chef.id)}
                className="bg-white p-3 rounded-xl w-40"
              >
                <ImageWithFallback
                  src={chef.profile_image}
                  alt={chef.name}
                  className="h-32 w-full object-cover rounded-lg"
                />
                <p>{chef.name}</p>
                <p className="text-sm text-gray-500">{chef.specialties}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TOMORROW SPECIAL */}
      {/* TOMORROW SPECIAL */}
<div className="px-6">
  <div className="flex justify-between mb-4 items-center">
    <h3 className="font-semibold">Tomorrow Specials</h3>

    <button
      onClick={() => onNavigateToTomorrowSpecials(selectedCategory)}
      className="text-sm text-orange-500 flex items-center gap-1"
    >
      View All <ChevronRight className="w-4 h-4" />
    </button>
  </div>

  {/* 🔥 LOADING */}
  {loadingSpecials ? (
    <p className="text-sm text-gray-500">Loading...</p>
  ) : specials.length === 0 ? (

    /* 🔥 EMPTY STATE FIX */
    <div className="bg-white p-4 rounded-xl text-center">
      <p className="text-sm text-gray-500 mb-3">
        No specials available in your area 😢
      </p>

      <button
        onClick={() => onNavigateToTomorrowSpecials(selectedCategory)}
        className="text-orange-500 text-sm underline"
      >
        Try View All
      </button>
    </div>

  ) : (

    /* 🔥 DATA */
    <div className="grid grid-cols-2 gap-4">
      {specials.slice(0, 2).map((item: any) => (
        <div
          key={item.id}
          onClick={() => onNavigateToSpecialDetail(item)}
          className="bg-white p-3 rounded-xl cursor-pointer"
        >
          <ImageWithFallback
            src={item.image_url}
            alt={item.dish_name}
            className="w-full h-28 object-cover rounded-lg"
          />
          <p className="font-medium">{item.dish_name}</p>
          <p className="text-sm text-gray-500">₹{item.price}</p>
        </div>
      ))}
    </div>

  )}
</div>



{/* 🔥 SUBSCRIPTION SECTION */}
<div className="px-6 mb-6">
  <div className="bg-gradient-to-r from-[#FF7A30] to-[#5F2EEA] p-5 rounded-2xl text-white flex items-center justify-between">
    
    <div>
      <p className="text-sm opacity-90">Get Your Diet Plan</p>
      <h3 className="text-lg font-semibold">Start Subscription</h3>
      <p className="text-xs opacity-80">
        Healthy meals + fitness plans
      </p>
    </div>

    <button
      onClick={onNavigateToSubscription}
      className="bg-white text-[#FF7A30] px-4 py-2 rounded-lg font-medium"
    >
      View Plans
    </button>
  </div>
</div>




      {/* CATEGORY */}
      <div className="p-6">
        <h3 className="mb-4">Categories</h3>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <button
                key={i}
                onClick={() => {
                  const newCategory =
                    selectedCategory === cat.key ? "" : cat.key;

                  setSelectedCategory(newCategory);
                  localStorage.setItem("category", newCategory);
                }}
                className="bg-white p-4 rounded-xl"
              >
                <Icon />
                <p>{cat.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* LOCATION MODAL */}
      {showLocation && (
        <Location
          onLocationSelect={(lat, lng, city) => {
            localStorage.setItem("lat", lat);
            localStorage.setItem("lng", lng);
            localStorage.setItem("location_name", city);
            setLocationName(city);
            fetchNearbyChefs();
            fetchSpecials();
            setShowLocation(false);
          }}
          onClose={() => setShowLocation(false)}
        />
      )}
    </div>
  );
}