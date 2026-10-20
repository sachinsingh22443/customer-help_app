
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Plus } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface CategoryDetailProps {
  category: "healthy" | "protein" | "tiffin" | "diet";
  onBack: () => void;
  onAddToCart: (item: any) => void;
  onNavigateToDish: (dish: any) => void;
}

interface ExploreProduct {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  is_active?: boolean;
}

const API_BASE_URL = "https://chef-backend-qh12.onrender.com";

const categoryData = {
  healthy: {
    title: "Healthy Meals",
    subtitle: "Nutritious & delicious home-cooked meals",
    color: "from-[#0FAD6E] to-[#3ec98d]",
    emoji: "🥗",
    apiCategory: "Healthy",
  },
  protein: {
    title: "Protein Rich",
    subtitle: "High-protein meals for muscle building",
    color: "from-[#FF7A30] to-[#ff9d5c]",
    emoji: "💪",
    apiCategory: "Protein Rich",
  },
  tiffin: {
    title: "Daily Tiffin",
    subtitle: "Regular home-style tiffin service",
    color: "from-[#5F2EEA] to-[#8860f5]",
    emoji: "🍱",
    apiCategory: "Bulk Order",
  },
  diet: {
    title: "Diet Plans",
    subtitle: "Customized meal plans for your goals",
    color: "from-[#FF7A30] to-[#0FAD6E]",
    emoji: "📊",
    apiCategory: "Anytime",
  },
};

export function CategoryDetail({
  category,
  onBack,
  onAddToCart,
  onNavigateToDish,
}: CategoryDetailProps) {

  const [dishes, setDishes] = useState<ExploreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const data = categoryData[category];

  const fetchDishes = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        category: data.apiCategory,
      });

      const response = await fetch(
        `${API_BASE_URL}/explore/products?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Products API failed: ${response.status}`);
      }

      const result = await response.json();

      const products: ExploreProduct[] = Array.isArray(result)
        ? result
        : Array.isArray(result.products)
          ? result.products
          : [];

      setDishes(
        products.filter(
          (product) =>
            Number(product.quantity) > 0 &&
            product.is_active !== false
        )
      );
    } catch (err) {
      console.error("Explore Products Error:", err);
      setDishes([]);
      setError("Products load nahi ho paaye. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
    // Fetch again whenever the selected category changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleAddToCart = (dish: ExploreProduct) => {
    onAddToCart({
      id: dish.id,
      name: dish.name,
      price: Number(dish.price),
      quantity: 1,
      image_url: dish.image_url || "",
      image_urls: dish.image_url ? [dish.image_url] : [],
      type: "product",
      category: dish.category,
      description: dish.description || "",
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">
      {/* HEADER */}
      <div
        className={`rounded-b-[2rem] bg-gradient-to-br ${data.color} px-6 pb-20 pt-12`}
      >
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-white"
        >
          <ChevronLeft className="h-6 w-6" />
          Back
        </button>

        <div className="mb-2 flex items-center gap-3">
          <span className="text-5xl">{data.emoji}</span>
          <h1 className="text-xl font-bold text-white">{data.title}</h1>
        </div>

        <p className="text-white/90">{data.subtitle}</p>
      </div>

      {/* PRODUCT LIST */}
      <div className="-mt-12 space-y-4 px-6">
        {loading ? (
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="animate-pulse text-gray-500">
              Loading products...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-6 text-center shadow">
            <p className="mb-4 text-sm text-red-500">{error}</p>
            <button
              type="button"
              onClick={fetchDishes}
              className="rounded-lg bg-orange-500 px-5 py-2 text-white"
            >
              Retry
            </button>
          </div>
        ) : dishes.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center shadow">
            <p className="font-semibold text-gray-700">
              No products found
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Is category mein abhi koi available product nahi hai.
            </p>
          </div>
        ) : (
          dishes.map((dish, index) => (
            <motion.div
  key={dish.id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
 onClick={() =>
  onNavigateToDish({
    ...dish,
    type: "product",
    product_id: dish.id,
    remaining: Number(dish.quantity ?? 0),
  })
}
  className="flex cursor-pointer overflow-hidden rounded-xl bg-white shadow transition-transform hover:scale-[1.01]"
>
              {/* PRODUCT IMAGE */}
              <div className="h-32 w-32 shrink-0 bg-gray-100">
                {dish.image_url ? (
                  <ImageWithFallback
                    src={dish.image_url}
                    alt={dish.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-2 text-center text-xs text-gray-400">
                    Image not available
                  </div>
                )}
              </div>

              {/* PRODUCT DETAILS */}
              <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
                <div>
                  <p className="line-clamp-2 font-semibold text-gray-900">
                    {dish.name}
                  </p>

                  {dish.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                      {dish.description}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-gray-500">
                    {dish.quantity} available
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="font-bold text-orange-500">
                    ₹{Number(dish.price).toFixed(2)}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
  e.stopPropagation();
  handleAddToCart(dish);
}}
                    className="flex items-center gap-1 rounded-lg bg-orange-500 px-3 py-1.5 text-white transition hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
