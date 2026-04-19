import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Heart, Plus, Star, Flame } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface FavoriteDishesProps {
  onBack: () => void;
  onViewDish: (dishId: string) => void;
}

export function FavoriteDishes({ onBack, onViewDish }: FavoriteDishesProps) {
  const [favorites, setFavorites] = useState([
    {
      id: "1",
      name: "Rajasthani Dal Baati Churma",
      chef: "Priya Sharma",
      price: 249,
      rating: 4.8,
      calories: 620,
      image: "https://images.unsplash.com/photo-1727018427695-35a6048c91e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
    {
      id: "2",
      name: "Protein Power Bowl",
      chef: "Anjali Patel",
      price: 199,
      rating: 4.9,
      calories: 450,
      image: "https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
    {
      id: "3",
      name: "Paneer Tikka Masala",
      chef: "Meera Singh",
      price: 179,
      rating: 4.7,
      calories: 380,
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
  ]);

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#5F2EEA] via-[#FF7A30] to-[#0FAD6E] px-6 pt-12 pb-8 rounded-b-[2rem] relative overflow-hidden">
        <motion.div
          className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="flex items-center gap-4 mb-4">
          <motion.button
            onClick={onBack}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>

          <div className="flex-1">
            <h1 className="text-white mb-1">Favorite Dishes ❤️</h1>
            <p className="text-white/80 text-sm">{favorites.length} dishes you love</p>
          </div>
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="px-6 mt-6">
        {favorites.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {favorites.map((dish, index) => (
                <motion.div
                  key={dish.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden neo-shadow"
                >
                  <div className="flex gap-4 p-4">
                    {/* Image */}
                    <motion.button
                      onClick={() => onViewDish(dish.id)}
                      className="w-28 h-28 rounded-xl overflow-hidden bg-[#FFF8F0] flex-shrink-0"
                      whileTap={{ scale: 0.95 }}
                    >
                      <ImageWithFallback
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>

                    {/* Details */}
                    <div className="flex-1">
                      <button
                        onClick={() => onViewDish(dish.id)}
                        className="text-left w-full"
                      >
                        <p className="text-[#181818] mb-1">{dish.name}</p>
                        <p className="text-[#181818]/60 text-sm mb-2">by {dish.chef}</p>

                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-[#FF7A30] fill-[#FF7A30]" />
                            <span className="text-xs text-[#181818]/70">{dish.rating}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-[#FF7A30]" />
                            <span className="text-xs text-[#181818]/70">
                              {dish.calories} cal
                            </span>
                          </div>
                        </div>

                        <p className="text-[#FF7A30] text-xl">₹{dish.price}</p>
                      </button>
                    </div>

                    {/* Remove Button */}
                    <motion.button
                      onClick={() => handleRemoveFavorite(dish.id)}
                      className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center self-start"
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    </motion.button>
                  </div>

                  {/* Quick Add */}
                  <div className="px-4 pb-4">
                    <motion.button
                      className="w-full bg-gradient-to-r from-[#FF7A30] to-[#ff9d5c] text-white py-3 rounded-xl flex items-center justify-center gap-2"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">💔</div>
            <p className="text-[#181818] mb-2">No favorites yet</p>
            <p className="text-[#181818]/60 text-sm mb-6">
              Start adding dishes you love to see them here
            </p>
            <motion.button
              onClick={onBack}
              className="bg-gradient-to-r from-[#FF7A30] to-[#ff9d5c] text-white px-8 py-3 rounded-xl neo-shadow"
              whileTap={{ scale: 0.95 }}
            >
              Explore Dishes
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
