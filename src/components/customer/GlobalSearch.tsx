import { motion } from "motion/react";
import { ArrowLeft, Search, Clock, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface GlobalSearchProps {
  onBack: () => void;
  onSelectDish: (dishId: string) => void;
  onSelectChef: (chefId: string) => void;
}

export function GlobalSearch({ onBack, onSelectDish, onSelectChef }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "Paneer Butter Masala",
    "Diet Plan",
    "South Indian",
  ]);

  const trending = [
    { name: "Biryani", emoji: "🍛" },
    { name: "Healthy Salad", emoji: "🥗" },
    { name: "Protein Bowl", emoji: "🍲" },
    { name: "Dal Makhani", emoji: "🍜" },
  ];

  const searchResults = query.length > 0 ? [
    {
      id: "1",
      type: "dish",
      name: "Paneer Butter Masala",
      subtitle: "by Chef Priya Sharma",
      price: "₹220",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200",
    },
    {
      id: "2",
      type: "chef",
      name: "Rajesh Kumar",
      subtitle: "South Indian Specialist",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1722152667178-be659e54bffc?w=200",
    },
    {
      id: "3",
      type: "dish",
      name: "Dal Makhani",
      subtitle: "by Chef Anjali Patel",
      price: "₹180",
      image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=200",
    },
  ] : [];

  const removeRecentSearch = (search: string) => {
    setRecentSearches(recentSearches.filter(s => s !== search));
  };

  const handleSelectResult = (result: any) => {
    if (result.type === "dish") {
      onSelectDish(result.id);
    } else {
      onSelectChef(result.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-6">
      {/* Header with Search */}
      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-3 mb-4">
          <motion.button
            onClick={onBack}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h2 className="text-white">Search</h2>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#171717]/40" />
          <input
            type="text"
            placeholder="Search for dishes, chefs, cuisines..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-transparent focus:border-white/50 outline-none transition-colors bg-white"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#171717]/40"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="px-6 -mt-2">
        {query.length === 0 ? (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 neo-shadow-sm mb-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#FF7A30]" />
                    <h3 className="text-[#171717]">Recent Searches</h3>
                  </div>
                  <button
                    onClick={() => setRecentSearches([])}
                    className="text-sm text-[#FF7A30]"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FFF8F0] transition-colors"
                    >
                      <button
                        onClick={() => setQuery(search)}
                        className="flex items-center gap-3 flex-1"
                      >
                        <Clock className="w-4 h-4 text-[#171717]/40" />
                        <span className="text-sm text-[#171717]">{search}</span>
                      </button>
                      <button
                        onClick={() => removeRecentSearch(search)}
                        className="text-[#171717]/40 hover:text-[#FF7A30]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Trending */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 neo-shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#FF7A30]" />
                <h3 className="text-[#171717]">Trending Now</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {trending.map((item, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setQuery(item.name)}
                    className="p-4 rounded-xl bg-[#FFF8F0] hover:bg-[#FF7A30]/10 transition-colors text-left"
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-2xl mb-2">{item.emoji}</div>
                    <p className="text-sm text-[#171717]">{item.name}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          /* Search Results */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <p className="text-sm text-[#171717]/60 px-2">
              {searchResults.length} results found
            </p>
            {searchResults.map((result, idx) => (
              <motion.button
                key={result.id}
                onClick={() => handleSelectResult(result)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="w-full bg-white rounded-2xl p-4 neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={result.image}
                      alt={result.name}
                      fallbackSrc="https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=200"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[#171717] mb-1">{result.name}</p>
                    <p className="text-sm text-[#171717]/60">{result.subtitle}</p>
                  </div>
                  <div className="text-right">
                    {result.type === "dish" ? (
                      <p className="text-[#FF7A30]">{result.price}</p>
                    ) : (
                      <div className="flex items-center gap-1 px-2 py-1 bg-[#0FAD6E]/10 rounded-lg">
                        <span className="text-xs text-[#0FAD6E]">⭐ {result.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
