import { useState } from "react";
import { ChevronLeft, Heart, Minus, Plus } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface DishDetailProps {
  dish: any;
  onBack: () => void;
  onAddToCart: (dishId: string, quantity: number) => void;
  onNavigateToChef: (chefId: string) => void;
  onOrderNow?: (dish: any) => void;
}

const BASE_URL = "https://chef-backend-qh12.onrender.com";

export function DishDetail({
  dish,
  onBack,
  onAddToCart,
  onNavigateToChef,
  onOrderNow,
}: DishDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // SAFE VALUES
  // =========================================================

  const availableQty = Number(
    dish?.remaining ?? dish?.quantity ?? 0
  );

  const image =
    dish?.image_url ||
    dish?.image_urls?.[0] ||
    dish?.image ||
    dish?.photo_url ||
    "/fallback.jpg";

  const foodType =
    dish?.food_type === "veg"
      ? "Vegetarian"
      : dish?.food_type === "non-veg" ||
        dish?.food_type === "non_veg"
      ? "Non-Vegetarian"
      : "Veg / Non-Veg";

  // Tomorrow Special identification
  // const isSpecial = dish?.type === "special";

  // const isSpecial =
  // dish?.type === "special" ||
  // !!dish?.special_date ||
  // !!dish?.cutoff_time ||
  // dish?.max_plates != null ||
  // dish?.pre_orders != null;

  const isSpecial =
  dish?.type === "special" ||
  !!dish?.special_date ||
  !!dish?.cutoff_time ||
  dish?.max_plates != null ||
  dish?.pre_orders != null;
  

  // =========================================================
  // INGREDIENTS - SAFE NORMALIZATION
  // Backend currently returns ingredients as STRING.
  // This also supports ARRAY in future.
  // =========================================================

  const normalizedIngredients: string[] = Array.isArray(
    dish?.ingredients
  )
    ? dish.ingredients
    : typeof dish?.ingredients === "string"
    ? dish.ingredients
        .split(",")
        .map((item: string) => item.trim())
        .filter(Boolean)
    : [];

  // =========================================================
  // PREMIUM SPECIAL VALUES
  // =========================================================

  const originalPrice = Number(dish?.original_price ?? 0);
  const currentPrice = Number(dish?.price ?? 0);

  const hasDiscount =
    isSpecial &&
    originalPrice > currentPrice &&
    originalPrice > 0;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((originalPrice - currentPrice) / originalPrice) * 100
      )
    : 0;

  
  // =========================================================
// TOMORROW SPECIAL CUTOFF
// =========================================================

// =========================================================
// TOMORROW SPECIAL CUTOFF
// Uses special_date + cutoff_time
// =========================================================

const isSpecialCutoffPassed = () => {
  if (
    !isSpecial ||
    !dish?.special_date ||
    !dish?.cutoff_time
  ) {
    return false;
  }

  try {
    const specialDate = String(dish.special_date).split("T")[0];

    const [year, month, day] = specialDate
      .split("-")
      .map(Number);

    const [hours, minutes] = String(dish.cutoff_time)
      .split(":")
      .map(Number);

    if (
      !year ||
      !month ||
      !day ||
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) {
      return false;
    }

    // India timezone
    const now = new Date();

    // Build cutoff using the SPECIAL DATE
    const cutoff = new Date(
      year,
      month - 1,
      day,
      hours,
      minutes,
      0,
      0
    );

    return now > cutoff;
  } catch (error) {
    console.error(
      "Special cutoff calculation error:",
      error
    );

    return false;
  }
};
  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = async () => {
    try {

      if (isSpecial && isSpecialCutoffPassed()) {
      alert(
        `Tomorrow Special ordering closed. Order by ${dish?.cutoff_time}`
      );
      return;
    }
      if (availableQty <= 0) {
        alert("Out of stock");
        return;
      }

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
          type: isSpecial ? "special" : "menu",
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


  // =========================================================
// ORDER NOW - TOMORROW SPECIAL
// =========================================================

const handleOrderNow = () => {
  if (!isSpecial) {
    return;
  }

  // 🔥 Cutoff check
  if (isSpecialCutoffPassed()) {
    alert(
      `Tomorrow Special ordering closed. Order by ${dish?.cutoff_time}`
    );
    return;
  }

  if (availableQty <= 0) {
    alert("Tomorrow Special is sold out");
    return;
  }

  if (quantity > availableQty) {
    alert(`Only ${availableQty} plates available`);
    return;
  }

  if (!onOrderNow) {
    console.error("onOrderNow handler not provided");
    return;
  }

  onOrderNow({
    ...dish,
    type: "special",
    quantity,
  });
};

  

  

  


  // =========================================================
  // RENDER
  // =========================================================

    // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-40">

      {/* =====================================================
          IMAGE
      ====================================================== */}

      <div className="relative h-[300px]">

        <ImageWithFallback
          src={image}
          alt={dish?.name || "Dish"}
          className="w-full h-full object-cover"
        />

        {/* BACK */}
        <button
          onClick={onBack}
          className="absolute top-10 left-4 bg-white p-2 rounded-full shadow"
        >
          <ChevronLeft />
        </button>

        {/* FAVORITE */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-10 right-4 bg-white p-2 rounded-full shadow"
        >
          <Heart
            className={
              isFavorite
                ? "text-red-500 fill-red-500"
                : "text-gray-700"
            }
          />
        </button>

        {/* SPECIAL BADGE */}
        {isSpecial && (
          <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
            ⭐ Tomorrow Special
          </div>
        )}

      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="p-5">

        {/* DISH NAME */}
        <h1 className="text-xl font-bold">
          {dish?.name || "Dish"}
        </h1>

        {/* FOOD TYPE */}
        <p className="text-sm mt-1 text-green-600">
          {foodType}
        </p>

        {/* CHEF */}
        {dish?.chef_name && (
          <p className="text-sm text-gray-500 mt-1">
            👨‍🍳 {dish.chef_name}
          </p>
        )}

        {/* DESCRIPTION */}
        <p className="text-gray-500 text-sm mt-2">
          {dish?.description || "No description available"}
        </p>

        {/* =================================================
            PRICE
        ================================================== */}

        <div className="flex items-center gap-3 mt-3">

          <p className="text-[#FF7A30] text-xl font-bold">
            ₹{currentPrice}
          </p>

          {hasDiscount && (
            <>
              <p className="text-gray-400 line-through text-sm">
                ₹{originalPrice}
              </p>

              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                {discountPercentage}% OFF
              </span>
            </>
          )}

        </div>

        {/* =================================================
            AVAILABILITY
        ================================================== */}

        <p className="text-sm text-gray-500 mt-1">
          {availableQty > 0
            ? `Available: ${availableQty}`
            : "Out of Stock"}
        </p>

        {/* =================================================
            PREMIUM NUTRITION
        ================================================== */}

        {isSpecial &&
          (
            dish?.calories != null ||
            dish?.protein != null ||
            dish?.carbs != null ||
            dish?.fats != null
          ) && (
            <div className="mt-5">

              <h3 className="font-semibold mb-3">
                Nutrition
              </h3>

              <div className="grid grid-cols-2 gap-3">

                {dish?.calories != null && (
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Calories
                    </p>

                    <p className="font-semibold">
                      {dish.calories} kcal
                    </p>
                  </div>
                )}

                {dish?.protein != null && (
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Protein
                    </p>

                    <p className="font-semibold">
                      {dish.protein} g
                    </p>
                  </div>
                )}

                {dish?.carbs != null && (
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Carbs
                    </p>

                    <p className="font-semibold">
                      {dish.carbs} g
                    </p>
                  </div>
                )}

                {dish?.fats != null && (
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Fats
                    </p>

                    <p className="font-semibold">
                      {dish.fats} g
                    </p>
                  </div>
                )}

              </div>
            </div>
          )}

        {/* =================================================
            PREPARATION TIME
        ================================================== */}

        {isSpecial && dish?.preparation_time != null && (
          <div className="mt-4 bg-white rounded-xl p-4 shadow-sm">

            <p className="text-xs text-gray-500">
              Preparation Time
            </p>

            <p className="font-semibold mt-1">
              ⏱️ {dish.preparation_time} minutes
            </p>

          </div>
        )}

        {/* =================================================
            INGREDIENTS
        ================================================== */}

        {normalizedIngredients.length > 0 && (
          <div className="mt-5">

            <h3 className="font-semibold mb-2">
              Ingredients
            </h3>

            <ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">

              {normalizedIngredients.map(
                (item: string, index: number) => (
                  <li key={`${item}-${index}`}>
                    {item}
                  </li>
                )
              )}

            </ul>

          </div>
        )}

        {/* =================================================
            CUTOFF TIME - TOMORROW SPECIAL
        ================================================== */}

        {isSpecial && dish?.cutoff_time && (
          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4">

            <p className="text-xs text-gray-500">
              Pre-order deadline
            </p>

            <p
  className={`font-semibold mt-1 ${
    isSpecialCutoffPassed()
      ? "text-red-600"
      : "text-orange-600"
  }`}
>
  {isSpecialCutoffPassed()
    ? "🔒 Ordering closed"
    : `⏰ Order by ${dish.cutoff_time}`}
</p>

          </div>
        )}

        {/* =================================================
            CHEF
        ================================================== */}

        {dish?.chef_id && (
          <div
            className="mt-5 p-4 bg-white rounded-xl shadow cursor-pointer"
            onClick={() =>
              onNavigateToChef(dish.chef_id)
            }
          >

            <p className="text-sm text-gray-500">
              Made by
            </p>

            <p className="font-medium mt-1">
              {dish?.chef_name || "Chef"}
            </p>

            <p className="text-xs text-orange-500 mt-1">
              View Chef →
            </p>

          </div>
        )}

      </div>

      {/* =====================================================
          BOTTOM BAR
      ====================================================== */}

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-30">

        {/* QUANTITY */}
        <div className="flex items-center gap-3">

          <div className="flex items-center gap-3 bg-[#FFF8F0] px-3 py-3 rounded-xl">

            <button
              onClick={() =>
                setQuantity(Math.max(1, quantity - 1))
              }
              disabled={quantity <= 1}
              className="bg-white p-1 rounded shadow disabled:opacity-40"
            >
              <Minus size={16} />
            </button>

            <span className="min-w-[20px] text-center font-medium">
              {quantity}
            </span>

            <button
              onClick={() => {
                if (quantity < availableQty) {
                  setQuantity(quantity + 1);
                }
              }}
              disabled={
                availableQty <= 0 ||
                quantity >= availableQty
              }
              className="bg-white p-1 rounded shadow disabled:opacity-40"
            >
              <Plus size={16} />
            </button>

          </div>

          {/* ADD TO CART */}
          <button
            disabled={
              availableQty === 0 ||
              loading ||
              (isSpecial && isSpecialCutoffPassed())
            }
            onClick={handleAddToCart}
            className={`flex-1 py-3 rounded-xl font-medium ${
              availableQty === 0
                ? "bg-gray-400 text-white"
                : "bg-[#FF7A30] text-white"
            }`}
          >
            {loading
  ? "Adding..."
  : availableQty === 0
  ? "Out of Stock"
  : isSpecial && isSpecialCutoffPassed()
  ? "Ordering Closed"
  : `Add to Cart • ₹${currentPrice * quantity}`}
          </button>

        </div>

        {/* =================================================
            ORDER NOW
            ONLY FOR TOMORROW SPECIAL
        ================================================== */}

        {isSpecial && (
  <button
    disabled={
      availableQty === 0 ||
      isSpecialCutoffPassed()
    }
    onClick={handleOrderNow}
    className={`w-full mt-3 py-3 rounded-xl font-semibold ${
      availableQty === 0 || isSpecialCutoffPassed()
        ? "bg-gray-400 text-white"
        : "bg-[#5F2EEA] text-white"
    }`}
  >
    {availableQty === 0
      ? "Sold Out"
      : isSpecialCutoffPassed()
      ? "⏰ Ordering Closed"
      : `⭐ Order Now • ₹${currentPrice * quantity}`}
  </button>
)}

      </div>

    </div>
  );
}