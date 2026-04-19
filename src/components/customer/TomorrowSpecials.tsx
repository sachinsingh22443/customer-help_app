import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Clock, ChefHat } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useCart } from "../../contexts/CartContext";

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

  const { addItem } = useCart();

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
        `https://chef-backend-1.onrender.com/tomorrow-special/nearby?lat=${lat}&lng=${lng}&category=${category || ""}`
      );

      if (!res.ok) throw new Error("API failed");

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

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-8 rounded-b-[2rem] sticky top-0 z-20">
        <button onClick={onBack} className="text-white mb-4">
          ← Back
        </button>

        <h1 className="text-white text-xl font-bold">
          ⭐ Tomorrow Specials
        </h1>

        <p className="text-white/80 text-sm">
          Nearby special dishes
        </p>
      </div>

      {/* CONTENT */}
      <div className="px-6 mt-6 space-y-4">

        {loading ? (
          <p className="text-gray-400 animate-pulse">
            Loading specials...
          </p>
        ) : specials.length === 0 ? (
          <p className="text-gray-500">
            No specials available in your area 😢
          </p>
        ) : (
          specials
            .filter((item: any) => item.remaining > 0)
            .map((special: any, index) => {

              return (
                <motion.div
                  key={special.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() =>
                    onNavigateToSpecialDetail?.({
                      id: special.id,
                      name: special.dish_name,
                      description: special.description,
                      price: special.price,
                      quantity: special.remaining,
                      image_urls: [special.image_url],
                      chef_id: special.chef_id,
                      chef_name: special.chef_name,
                      food_type: special.food_type,
                      type: "special",   // 🔥 IMPORTANT
                    })
                  }
                  className="bg-white rounded-2xl overflow-hidden shadow cursor-pointer"
                >

                  {/* IMAGE */}
                  <div className="relative">
                    <ImageWithFallback
                      src={special.image_url || "https://via.placeholder.com/300"}
                      alt={special.dish_name}
                      className="w-full h-48 object-cover"
                    />

                    <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                      {special.remaining} left
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">

                    <h3 className="font-bold text-lg">
                      {special.dish_name}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <ChefHat className="w-4 h-4" />
                      {special.chef_name}
                    </div>

                    <p className="text-sm text-gray-600 mt-2">
                      {special.description}
                    </p>

                    {/* PRICE + BUTTON */}
                    <div className="flex justify-between items-center mt-4">

                      <div className="text-orange-500 font-bold">
                        ₹{special.price}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          addItem({
                            id: special.id,
                            name: special.dish_name,
                            price: special.price,
                            quantity: 1,
                            image_urls: [special.image_url],
                            type: "special",   // 🔥 CRITICAL
                          });
                        }}
                        className="bg-orange-500 text-white px-4 py-1 rounded-xl"
                      >
                        Pre-Order
                      </button>
                    </div>

                    {/* CUTOFF */}
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                      <Clock className="w-3 h-3" />
                      Order by {special.cutoff_time}
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