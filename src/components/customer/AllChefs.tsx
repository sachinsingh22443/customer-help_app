import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, ChefHat } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface AllChefsProps {
  onBack: () => void;
  onNavigateToChefDetails: (chefId: string) => void;
}

export function AllChefs({
  onBack,
  onNavigateToChefDetails,
}: AllChefsProps) {
  const [chefs, setChefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNearbyChefs = async () => {
    try {
      setLoading(true);
      setError("");

      const lat = localStorage.getItem("lat");
      const lng = localStorage.getItem("lng");

      if (!lat || !lng) {
        setError("Please select your location first.");
        return;
      }

      const res = await fetch(
        `https://chef-backend-qh12.onrender.com/menu/nearby-chefs?lat=${lat}&lng=${lng}`
      );

      if (!res.ok) {
        throw new Error("Failed to load nearby chefs");
      }

      const data = await res.json();

      setChefs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("All chefs error:", err);
      setError("Unable to load nearby chefs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyChefs();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-8 rounded-b-[2rem]">

        <button
          onClick={onBack}
          className="flex items-center text-white mb-5"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-white">
          Nearby Chefs
        </h1>

        <p className="text-white/80 text-sm mt-1">
          Home chefs near your location
        </p>
      </div>

      {/* CONTENT */}
      <div className="p-6">

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />

            <p className="text-gray-500 mt-4">
              Finding chefs near you...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">

            <MapPin className="w-10 h-10 mx-auto text-orange-500 mb-3" />

            <p className="text-gray-700 font-medium">
              {error}
            </p>

            <button
              onClick={fetchNearbyChefs}
              className="mt-4 bg-orange-500 text-white px-5 py-2 rounded-xl"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && chefs.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">

            <ChefHat className="w-12 h-12 mx-auto text-orange-400 mb-4" />

            <h3 className="font-semibold text-lg">
              No nearby chefs found
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              We couldn't find any chefs in your area yet.
            </p>
          </div>
        )}

        {/* CHEFS */}
        {!loading && !error && chefs.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">
                {chefs.length} Chef
                {chefs.length !== 1 ? "s" : ""} Near You
              </h2>

              <span className="text-xs text-gray-500">
                Within 50 km
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">

              {chefs.map((chef) => (
                <div
                  key={chef.id}
                  onClick={() =>
                    onNavigateToChefDetails(chef.id)
                  }
                  className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                >

                  {/* IMAGE */}
                  <div className="relative">

                    <ImageWithFallback
                      src={chef.profile_image}
                      alt={chef.name || "Chef"}
                      className="w-full h-40 object-cover"
                    />

                    {/* DISTANCE */}
                    {chef.distance != null && (
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-500" />

                        <span className="text-[11px] font-semibold text-gray-700">
                          {Number(chef.distance).toFixed(1)} km
                        </span>
                      </div>
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="p-3">

                    <h3 className="font-semibold text-gray-900 truncate">
                      {chef.name || "Home Chef"}
                    </h3>

                    {chef.specialties && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {chef.specialties}
                      </p>
                    )}

                    {/* MENU STATUS */}
                    {Array.isArray(chef.menus) &&
                    chef.menus.length > 0 ? (
                      <p className="text-xs text-green-600 font-medium mt-2">
                        ✓ Menu available
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-2">
                        Menu coming soon
                      </p>
                    )}

                  </div>
                </div>
              ))}

            </div>
          </>
        )}
      </div>
    </div>
  );
}