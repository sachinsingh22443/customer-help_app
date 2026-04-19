import { useState } from "react";
import { ChevronLeft, Heart, Minus, Plus } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface DishDetailProps {
  dish: any;
  onBack: () => void;
  onAddToCart: (dishId: string, quantity: number) => void;
  onNavigateToChef: (chefId: string) => void;
}

const BASE_URL = "https://chef-backend-1.onrender.com";

export function DishDetail({
  dish,
  onBack,
  onAddToCart,
  onNavigateToChef,
}: DishDetailProps) {

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 SAFE VALUES
  const availableQty = Number(dish?.remaining ?? dish?.quantity ?? 0);
  const image =
    dish?.image_urls?.[0] ||
    dish?.image ||
    "/fallback.jpg";

  const foodType =
    dish?.food_type === "veg"
      ? "Vegetarian"
      : dish?.food_type === "non_veg"
      ? "Non-Vegetarian"
      : "Veg / Non-Veg";

  // 🔥 IMPORTANT
  const isSpecial = dish?.type === "special";

  // =========================
  // ✅ ADD TO CART (FIXED)
  // =========================
  const handleAddToCart = async () => {
    try {
      if (quantity > availableQty) {
        alert("Not enough stock");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      setLoading(true);

      const res = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: isSpecial ? "special" : "menu", // 🔥 FIX
          item_id: dish.id,
          quantity: quantity,
        }),
      });

      if (res.status === 401) {
        alert("Session expired, login again");
        localStorage.removeItem("token");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Failed to add to cart");
        return;
      }

      alert("Added to cart ✅");

      onAddToCart(dish.id, quantity);

    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-32">

      {/* IMAGE */}
      <div className="relative h-[300px]">
        <ImageWithFallback
          src={image}
          alt={dish?.name || "Dish"}
          className="w-full h-full object-cover"
        />

        <button
          onClick={onBack}
          className="absolute top-10 left-4 bg-white p-2 rounded"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-10 right-4 bg-white p-2 rounded"
        >
          <Heart className={isFavorite ? "text-red-500" : ""} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-5">

        <h1 className="text-xl font-bold">
          {dish?.name || "Dish"}
        </h1>

        <p className="text-sm mt-1 text-green-600">
          {foodType}
        </p>

        <p className="text-gray-500 text-sm mt-2">
          {dish?.description || "No description available"}
        </p>

        <p className="text-[#FF7A30] text-xl mt-3">
          ₹{dish?.price || 0}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          {availableQty > 0
            ? `Available: ${availableQty}`
            : "Out of Stock"}
        </p>

        {/* INGREDIENTS */}
        {dish?.ingredients?.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Ingredients</h3>
            <ul className="text-sm text-gray-600 list-disc ml-4">
              {dish.ingredients.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* CHEF */}
        <div
          className="mt-4 p-3 bg-white rounded shadow cursor-pointer"
          onClick={() => onNavigateToChef(dish?.chef_id)}
        >
          <p className="text-sm text-gray-500">Made by</p>
          <p className="font-medium">
            {dish?.chef_name || "Chef"}
          </p>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="left-0 right-0 bg-white p-4 flex items-center gap-3 shadow-lg">

        {/* QUANTITY */}
        <div className="flex items-center gap-3 bg-[#FFF8F0] px-3 py-2 rounded-lg">

          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="bg-white p-1 rounded shadow"
          >
            <Minus size={16} />
          </button>

          <span className="min-w-[20px] text-center">
            {quantity}
          </span>

          <button
            onClick={() => {
              if (quantity < availableQty) {
                setQuantity(quantity + 1);
              }
            }}
            className="bg-white p-1 rounded shadow"
          >
            <Plus size={16} />
          </button>

        </div>

        {/* BUTTON */}
        <button
          disabled={availableQty === 0 || loading}
          onClick={handleAddToCart}
          className={`flex-1 py-3 rounded-lg font-medium ${
            availableQty === 0
              ? "bg-gray-400 text-white"
              : "bg-[#FF7A30] text-white"
          }`}
        >
          {loading
            ? "Adding..."
            : availableQty === 0
            ? "Out of Stock"
            : `Add to Cart • ₹${(dish?.price || 0) * quantity}`}
        </button>

      </div>

    </div>
  );
}