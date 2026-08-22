import { useState } from "react";

import {
  ChevronLeft,
  Heart,
  Minus,
  Plus,
} from "lucide-react";

import { ImageWithFallback } from "../figma/ImageWithFallback";

interface DishDetailProps {
  dish: any;

  onBack: () => void;

  onAddToCart: (
    dishId: string,
    quantity: number
  ) => void;

  onNavigateToChef: (
    chefId: string
  ) => void;

  onOrderNow?: (
    dish: any
  ) => void;
}

const BASE_URL =
  "https://chef-backend-qh12.onrender.com";

export function DishDetail({
  dish,
  onBack,
  onAddToCart,
  onNavigateToChef,
  onOrderNow,
}: DishDetailProps) {

  const [quantity, setQuantity] =
    useState(1);

  const [isFavorite, setIsFavorite] =
    useState(false);

  const [loading, setLoading] =
    useState(false);


  // =========================================================
  // SAFE VALUES
  // =========================================================

  const availableQty = Number(
    dish?.remaining ??
    dish?.quantity ??
    0
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


  // =========================================================
  // TOMORROW SPECIAL IDENTIFICATION
  // =========================================================

  const isSpecial =
    dish?.type === "special" ||
    !!dish?.special_date ||
    !!dish?.cutoff_time ||
    dish?.max_plates != null ||
    dish?.pre_orders != null;


  // =========================================================
  // NORMAL MENU VALUES
  // =========================================================

  const menuDate =
    dish?.menu_date ||
    dish?.date ||
    null;


  const mealType =
    dish?.meal_type
      ? String(dish.meal_type).toLowerCase()
      : null;


  // =========================================================
  // VALID MEAL TYPES
  // =========================================================

  const validMealTypes = [
    "breakfast",
    "lunch",
    "dinner",
  ];


  // =========================================================
  // INGREDIENTS
  // =========================================================

  const normalizedIngredients: string[] =
    Array.isArray(dish?.ingredients)
      ? dish.ingredients
      : typeof dish?.ingredients === "string"
      ? dish.ingredients
          .split(",")
          .map(
            (item: string) =>
              item.trim()
          )
          .filter(Boolean)
      : [];


  // =========================================================
  // PREMIUM SPECIAL VALUES
  // =========================================================

  const originalPrice =
    Number(
      dish?.original_price ?? 0
    );

  const currentPrice =
    Number(
      dish?.price ?? 0
    );


  const hasDiscount =
    isSpecial &&
    originalPrice > currentPrice &&
    originalPrice > 0;


  const discountPercentage =
    hasDiscount
      ? Math.round(
          (
            (originalPrice -
              currentPrice) /
            originalPrice
          ) * 100
        )
      : 0;


  // =========================================================
  // TOMORROW SPECIAL CUTOFF
  // =========================================================

  const isSpecialCutoffPassed =
    () => {

      if (
        !isSpecial ||
        !dish?.special_date ||
        !dish?.cutoff_time
      ) {
        return false;
      }


      try {

        const specialDate =
          String(
            dish.special_date
          ).split("T")[0];


        const [
          year,
          month,
          day,
        ] =
          specialDate
            .split("-")
            .map(Number);


        const [
          hours,
          minutes,
        ] =
          String(
            dish.cutoff_time
          )
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


        // =================================================
        // INDIA TIME
        // =================================================

        const now =
          new Date();


        const cutoff =
          new Date(
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
  // NORMAL MENU CUTOFF
  // =========================================================

  const getMealCutoffTime =
    () => {

      if (
        mealType === "breakfast"
      ) {
        return "08:30";
      }

      if (
        mealType === "lunch"
      ) {
        return "11:00";
      }

      if (
        mealType === "dinner"
      ) {
        return "18:00";
      }

      return null;
    };


  // =========================================================
  // NORMAL MENU CUTOFF PASSED
  // =========================================================

  const isNormalMenuCutoffPassed =
    () => {

      if (
        isSpecial ||
        !mealType ||
        !validMealTypes.includes(
          mealType
        )
      ) {
        return false;
      }


      const cutoffTime =
        getMealCutoffTime();


      if (!cutoffTime) {
        return false;
      }


      // -----------------------------------------------------
      // MENU DATE
      // -----------------------------------------------------

      if (!menuDate) {
        return false;
      }


      try {

        const targetDate =
          String(menuDate)
            .split("T")[0];


        const [
          year,
          month,
          day,
        ] =
          targetDate
            .split("-")
            .map(Number);


        const [
          hours,
          minutes,
        ] =
          cutoffTime
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


        // =================================================
        // CURRENT DATE/TIME
        // =================================================

        const now =
          new Date();


        const today =
          new Date();

        today.setHours(
          0,
          0,
          0,
          0
        );


        const target =
          new Date(
            year,
            month - 1,
            day
          );

        target.setHours(
          0,
          0,
          0,
          0
        );


        // -------------------------------------------------
        // PAST DATE
        // -------------------------------------------------

        if (
          target < today
        ) {
          return true;
        }


        // -------------------------------------------------
        // FUTURE DATE
        // -------------------------------------------------

        if (
          target > today
        ) {
          return false;
        }


        // -------------------------------------------------
        // TODAY CUTOFF
        // -------------------------------------------------

        const cutoff =
          new Date(
            year,
            month - 1,
            day,
            hours,
            minutes,
            0,
            0
          );


        return now >= cutoff;

      } catch (error) {

        console.error(
          "Normal menu cutoff calculation error:",
          error
        );

        return false;
      }
    };


  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart =
    async () => {

      try {

        // ===================================================
        // TOMORROW SPECIAL CUTOFF
        // ===================================================

        if (
          isSpecial &&
          isSpecialCutoffPassed()
        ) {

          alert(
            `Tomorrow Special ordering closed. Order by ${dish?.cutoff_time}`
          );

          return;
        }


        // ===================================================
        // NORMAL MENU VALIDATION
        // ===================================================

        if (!isSpecial) {

          if (!menuDate) {

            alert(
              "Menu date is not available."
            );

            return;
          }


          if (!mealType) {

            alert(
              "Meal type is not available."
            );

            return;
          }


          if (
            !validMealTypes.includes(
              mealType
            )
          ) {

            alert(
              "Invalid meal type."
            );

            return;
          }


          // -----------------------------------------------
          // CUTOFF
          // -----------------------------------------------

          if (
            isNormalMenuCutoffPassed()
          ) {

            const cutoff =
              getMealCutoffTime();


            const displayTime =
              cutoff === "08:30"
                ? "8:30 AM"
                : cutoff === "11:00"
                ? "11:00 AM"
                : "6:00 PM";


            alert(
              `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} ordering is closed. Order by ${displayTime}.`
            );

            return;
          }
        }


        // ===================================================
        // STOCK
        // ===================================================

        if (
          availableQty <= 0
        ) {

          alert(
            "Out of stock"
          );

          return;
        }


        if (
          quantity > availableQty
        ) {

          alert(
            "Not enough stock"
          );

          return;
        }


        // ===================================================
        // LOGIN
        // ===================================================

        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {

          alert(
            "Please login first"
          );

          return;
        }


        setLoading(true);


        // ===================================================
        // REQUEST BODY
        // ===================================================

        const requestBody: any = {

          type:
            isSpecial
              ? "special"
              : "menu",

          item_id:
            dish.id,

          quantity,
        };


        // ===================================================
        // NORMAL MENU DATA
        // ===================================================

        if (!isSpecial) {

          requestBody.menu_date =
            menuDate;

          requestBody.meal_type =
            mealType;
        }


        console.log(
          "🛒 Add to cart:",
          requestBody
        );


        // ===================================================
        // API REQUEST
        // ===================================================

        const res =
          await fetch(
            `${BASE_URL}/cart/add`,
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  requestBody
                ),
            }
          );


        // ===================================================
        // AUTH ERROR
        // ===================================================

        if (
          res.status === 401
        ) {

          alert(
            "Session expired, login again"
          );

          localStorage.removeItem(
            "token"
          );

          return;
        }


        const data =
          await res.json();


        // ===================================================
        // BACKEND ERROR
        // ===================================================

        if (!res.ok) {

          alert(
            data.detail ||
            "Failed to add to cart"
          );

          return;
        }


        // ===================================================
        // SUCCESS
        // ===================================================

        alert(
          "Added to cart ✅"
        );


        onAddToCart(
          dish.id,
          quantity
        );


      } catch (err) {

        console.error(
          "Add to cart error:",
          err
        );

        alert(
          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };


  // =========================================================
  // ORDER NOW - TOMORROW SPECIAL
  // =========================================================

  const handleOrderNow =
    () => {

      if (!isSpecial) {
        return;
      }


      // =====================================================
      // CUTOFF CHECK
      // =====================================================

      if (
        isSpecialCutoffPassed()
      ) {

        alert(
          `Tomorrow Special ordering closed. Order by ${dish?.cutoff_time}`
        );

        return;
      }


      // =====================================================
      // STOCK
      // =====================================================

      if (
        availableQty <= 0
      ) {

        alert(
          "Tomorrow Special is sold out"
        );

        return;
      }


      if (
        quantity > availableQty
      ) {

        alert(
          `Only ${availableQty} plates available`
        );

        return;
      }


      // =====================================================
      // HANDLER
      // =====================================================

      if (!onOrderNow) {

        console.error(
          "onOrderNow handler not provided"
        );

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
          onClick={() =>
            setIsFavorite(!isFavorite)
          }
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
          {dish?.description ||
            "No description available"}
        </p>


        {/* =================================================
            NORMAL MENU — MEAL INFORMATION
        ================================================== */}

        {!isSpecial && (
          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4">

            <p className="text-xs text-gray-500">
              Today's Meal
            </p>

            <p className="font-semibold mt-1 text-orange-600 capitalize">
              {mealType === "breakfast" &&
                "🍳 Breakfast"}

              {mealType === "lunch" &&
                "🍛 Lunch"}

              {mealType === "dinner" &&
                "🍽️ Dinner"}

              {!mealType &&
                "Meal not specified"}
            </p>

            {menuDate && (
              <p className="text-xs text-gray-500 mt-2">
                📅{" "}
                {new Date(
                  `${String(menuDate).split("T")[0]}T00:00:00`
                ).toLocaleDateString(
                  "en-IN",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </p>
            )}

            {mealType && (
              <p
                className={`text-xs font-medium mt-2 ${
                  isNormalMenuCutoffPassed()
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {isNormalMenuCutoffPassed()
                  ? "🔒 Ordering closed"
                  : mealType === "breakfast"
                  ? "⏰ Order before 8:30 AM"
                  : mealType === "lunch"
                  ? "⏰ Order before 11:00 AM"
                  : "⏰ Order before 6:00 PM"}
              </p>
            )}

          </div>
        )}


        {/* =================================================
            PRICE
        ================================================== */}

        <div className="flex items-center gap-3 mt-4">

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

        {isSpecial &&
          dish?.preparation_time != null && (

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
                (
                  item: string,
                  index: number
                ) => (
                  <li
                    key={`${item}-${index}`}
                  >
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

        {isSpecial &&
          dish?.cutoff_time && (

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
              onNavigateToChef(
                dish.chef_id
              )
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
                setQuantity(
                  Math.max(
                    1,
                    quantity - 1
                  )
                )
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
                if (
                  quantity <
                  availableQty
                ) {
                  setQuantity(
                    quantity + 1
                  );
                }
              }}
              disabled={
                availableQty <= 0 ||
                quantity >=
                  availableQty
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
              (
                isSpecial &&
                isSpecialCutoffPassed()
              ) ||
              (
                !isSpecial &&
                (
                  !menuDate ||
                  !mealType ||
                  !validMealTypes.includes(
                    mealType
                  ) ||
                  isNormalMenuCutoffPassed()
                )
              )
            }
            onClick={
              handleAddToCart
            }
            className={`flex-1 py-3 rounded-xl font-medium ${
              availableQty === 0 ||
              (
                !isSpecial &&
                (
                  !menuDate ||
                  !mealType ||
                  !validMealTypes.includes(
                    mealType
                  ) ||
                  isNormalMenuCutoffPassed()
                )
              ) ||
              (
                isSpecial &&
                isSpecialCutoffPassed()
              )
                ? "bg-gray-400 text-white"
                : "bg-[#FF7A30] text-white"
            }`}
          >

            {loading
              ? "Adding..."

              : availableQty === 0
              ? "Out of Stock"

              : (
                  isSpecial &&
                  isSpecialCutoffPassed()
                )
              ? "Ordering Closed"

              : (
                  !isSpecial &&
                  isNormalMenuCutoffPassed()
                )
              ? "Ordering Closed"

              : (
                  !isSpecial &&
                  (
                    !menuDate ||
                    !mealType ||
                    !validMealTypes.includes(
                      mealType
                    )
                  )
                )
              ? "Menu Unavailable"

              : `Add to Cart • ₹${
                  currentPrice *
                  quantity
                }`
            }

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
            onClick={
              handleOrderNow
            }
            className={`w-full mt-3 py-3 rounded-xl font-semibold ${
              availableQty === 0 ||
              isSpecialCutoffPassed()
                ? "bg-gray-400 text-white"
                : "bg-[#5F2EEA] text-white"
            }`}
          >

            {availableQty === 0
              ? "Sold Out"

              : isSpecialCutoffPassed()
              ? "⏰ Ordering Closed"

              : `⭐ Order Now • ₹${
                  currentPrice *
                  quantity
                }`
            }

          </button>
        )}

      </div>

    </div>
  );
}