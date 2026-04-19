import { motion } from "motion/react";
import { Star, MapPin, Clock, Award, Heart, ChevronLeft } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useEffect, useState } from "react";
import axios from "axios";

interface ChefDetailsProps {
  chefId?: string; // 🔥 optional kar diya
  onBack: () => void;
  onNavigateToDish?: (dish: any) => void;
}


export function ChefDetails({ chefId, onBack, onNavigateToDish }: ChefDetailsProps) {
  
  const [chef, setChef] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChefData = async () => {
      try {
        // 🔥 REAL ID (fallback from localStorage)
        const finalChefId = chefId || localStorage.getItem("userId");

        if (!finalChefId) {
          console.error("❌ No chefId found");
          setLoading(false);
          return;
        }

        console.log("🔥 Fetching chef:", finalChefId);

        const res = await axios.get(
          `https://chef-backend-1.onrender.com/menu/chef/${finalChefId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setChef(res.data.chef);
        setMenuItems(res.data.menus || []);

      } catch (err: any) {
        console.error("❌ Error fetching chef:", err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChefData();
  }, [chefId]);

  // 🔥 Loading UI
  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // 🔥 Error UI
  if (!chef) {
    return <div className="p-10 text-center text-red-500">Chef not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">
      
      {/* Header */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] relative overflow-hidden">
          
          <div className="absolute inset-0 opacity-30">
            <ImageWithFallback
              src={chef.profile_image || "/fallback.jpg"}
              alt={chef.name}
              className="w-full h-full object-cover"
            />
          </div>

          <button
            onClick={onBack}
            className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <motion.button
            className="absolute top-12 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center z-10"
            whileTap={{ scale: 0.9 }}
          >
            <Heart className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Chef Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 -mt-16 bg-white rounded-2xl p-6 shadow relative z-10"
        >
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden">
              <ImageWithFallback
                src={chef.profile_image || "/fallback.jpg"}
                alt={chef.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h2>{chef.name}</h2>
              <p className="text-sm text-gray-500">
                {chef.specialties || "Home Chef"}
              </p>

              <div className="flex items-center gap-2 mt-1 text-sm">
                <MapPin className="w-4 h-4 text-[#FF7A30]" />
                <span>{chef.location || "N/A"}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* About */}
      <div className="px-6 mt-6">
        <h3>About</h3>
        <p className="text-sm text-gray-600">
          {chef.bio || "No bio available"}
        </p>
      </div>

      {/* Menu */}
      <div className="px-6 mt-6">
        <h3 className="mb-3">Menu</h3>

        {menuItems.length === 0 ? (
          <p>No menu available</p>
        ) : (
          <div className="space-y-3">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl flex overflow-hidden shadow"
              >
                <div className="w-24 h-24">
                  <ImageWithFallback
                    src={item.image_urls?.[0] || "/fallback.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-3 flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.description}
                  </p>

                  <div className="flex justify-between mt-2">
                    <span className="text-[#FF7A30] font-semibold">
                      ₹{item.price}
                    </span>

                    <button
                      className="bg-[#FF7A30] text-white px-3 py-1 text-xs rounded"
                      onClick={() =>
                          onNavigateToDish && onNavigateToDish(item)
                         }
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}