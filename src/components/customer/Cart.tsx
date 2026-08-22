import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Trash2,
  Plus,
  Minus,
  CalendarDays,
  Clock,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const BASE_URL =
  "https://chef-backend-qh12.onrender.com";

interface CartProps {
  onBack: () => void;
  onCheckout: () => void;
  setCartData: (data: any[]) => void;
}

export function Cart({
  onBack,
  onCheckout,
  setCartData,
}: CartProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatMenuDate = (dateValue: any) => {
    if (!dateValue) return "";

    try {
      const date = new Date(
        `${String(dateValue).split("T")[0]}T00:00:00`
      );

      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return String(dateValue);
    }
  };

  // =====================================================
  // MEAL LABEL
  // =====================================================

  const getMealLabel = (mealType: any) => {
    if (!mealType) return "";

    const value = String(mealType)
      .toLowerCase()
      .trim();

    if (value === "breakfast") {
      return "Breakfast";
    }

    if (value === "lunch") {
      return "Lunch";
    }

    if (value === "dinner") {
      return "Dinner";
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  // =====================================================
  // MEAL EMOJI
  // =====================================================

  const getMealEmoji = (mealType: any) => {
    const value = String(mealType || "")
      .toLowerCase()
      .trim();

    if (value === "breakfast") return "🌅";
    if (value === "lunch") return "🍱";
    if (value === "dinner") return "🌙";

    return "🍽️";
  };

  // =====================================================
  // FETCH CART
  // =====================================================

  const fetchCart = async () => {
    try {
      if (!token) {
        setItems([]);
        setCartData([]);
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${BASE_URL}/cart/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("token");

        setItems([]);
        setCartData([]);
        setLoading(false);

        return;
      }

      const data = await res.json();

      if (!res.ok) {
        console.error(
          "Cart API error:",
          data
        );

        setItems([]);
        setCartData([]);

        return;
      }

      const cartItems =
        Array.isArray(data.items)
          ? data.items
          : [];

      setItems(cartItems);
      setCartData(cartItems);

    } catch (err) {
      console.error(
        "Cart fetch error:",
        err
      );

      setItems([]);
      setCartData([]);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // =====================================================
  // UPDATE QUANTITY
  // =====================================================

  const handleUpdate = async (
    item: any,
    quantity: number
  ) => {
    if (!token) return;

    /*
     * IMPORTANT:
     *
     * item.id = CartItem.id
     *
     * Backend now uses CartItem.id
     * for update/remove.
     */

    const cartItemId = item.id;
    const type = item.type;

    if (!cartItemId) {
      console.error(
        "Missing cart item id:",
        item
      );

      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/cart/update?type=${encodeURIComponent(
          type
        )}&item_id=${encodeURIComponent(
          cartItemId
        )}&quantity=${quantity}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.detail ||
            "Failed to update cart"
        );

        return;
      }

      await fetchCart();

    } catch (err) {
      console.error(
        "Update error:",
        err
      );

      alert(
        "Unable to update cart"
      );
    }
  };

  // =====================================================
  // REMOVE ITEM
  // =====================================================

  const handleRemove = async (
    item: any
  ) => {
    if (!token) return;

    /*
     * IMPORTANT:
     *
     * item.id = CartItem.id
     */

    const cartItemId = item.id;
    const type = item.type;

    if (!cartItemId) {
      console.error(
        "Missing cart item id:",
        item
      );

      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/cart/remove/${encodeURIComponent(
          type
        )}/${encodeURIComponent(
          cartItemId
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.detail ||
            "Failed to remove item"
        );

        return;
      }

      await fetchCart();

    } catch (err) {
      console.error(
        "Remove error:",
        err
      );

      alert(
        "Unable to remove item"
      );
    }
  };

  // =====================================================
  // SUBTOTAL
  // =====================================================

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      (Number(item.price) || 0) *
        (Number(item.quantity) || 1),
    0
  );

  const deliveryFee = 0;

  const total =
    subtotal + deliveryFee;

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-40">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-8 rounded-b-[2rem]">

        <div className="flex items-center gap-4">

          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"
          >
            <ChevronLeft className="text-white" />
          </button>

          <div>
            <h1 className="text-white font-semibold">
              My Cart 🛒
            </h1>

            <p className="text-white/80 text-sm">
              {items.length}{" "}
              {items.length === 1
                ? "item"
                : "items"}
            </p>
          </div>

        </div>

      </div>


      {/* =================================================
          BODY
      ================================================= */}

      <div className="px-6 mt-6">

        {loading ? (

          <div className="text-center py-20">

            <div className="w-9 h-9 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />

            <p className="text-gray-500 mt-4">
              Loading cart...
            </p>

          </div>

        ) : items.length === 0 ? (

          <div className="text-center py-20">

            <div className="text-5xl mb-4">
              🛒
            </div>

            <h3 className="font-semibold text-lg">
              Your cart is empty
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              Add some delicious meals
              to continue.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {items.map((item) => (

              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
              >

                {/* =================================================
                    ITEM
                ================================================= */}

                <div className="flex gap-4">

                  {/* IMAGE */}

                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">

                    <ImageWithFallback
                      src={
                        item.image ||
                        "/fallback.jpg"
                      }
                      alt={
                        item.name ||
                        "Food"
                      }
                      className="w-full h-full object-cover"
                    />

                  </div>


                  {/* DETAILS */}

                  <div className="flex-1 min-w-0">

                    <div className="flex justify-between gap-2">

                      <p className="font-semibold text-gray-800 truncate">
                        {item.name}
                      </p>

                      <button
                        onClick={() =>
                          handleRemove(item)
                        }
                        className="flex-shrink-0"
                      >
                        <Trash2
                          size={18}
                          className="text-red-500"
                        />
                      </button>

                    </div>


                    {/* =================================================
                        NORMAL MENU DATE + MEAL
                    ================================================= */}

                    {item.type ===
                      "menu" &&
                      item.menu_date && (
                        <div className="mt-2 space-y-1">

                          <div className="flex items-center gap-1.5 text-xs text-gray-600">

                            <CalendarDays
                              size={13}
                              className="text-[#FF7A30]"
                            />

                            <span>
                              {formatMenuDate(
                                item.menu_date
                              )}
                            </span>

                          </div>


                          {item.meal_type && (

                            <div className="flex items-center gap-1.5 text-xs text-gray-600">

                              <Clock
                                size={13}
                                className="text-[#FF7A30]"
                              />

                              <span>
                                {getMealEmoji(
                                  item.meal_type
                                )}{" "}
                                {getMealLabel(
                                  item.meal_type
                                )}
                              </span>

                            </div>

                          )}

                        </div>
                      )}


                    {/* =================================================
                        SPECIAL
                    ================================================= */}

                    {item.type ===
                      "special" && (

                      <div className="mt-2">

                        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-600 px-2 py-1 rounded-full text-[10px] font-medium">

                          ⭐ Tomorrow Special

                        </span>

                      </div>

                    )}


                    {/* =================================================
                        QUANTITY + PRICE
                    ================================================= */}

                    <div className="flex justify-between items-center mt-3">

                      {/* QUANTITY */}

                      <div className="flex items-center gap-3">

                        <button
                          onClick={() => {

                            if (
                              item.quantity >
                              1
                            ) {

                              handleUpdate(
                                item,
                                item.quantity -
                                  1
                              );

                            } else {

                              handleRemove(
                                item
                              );

                            }

                          }}
                          className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center active:scale-95"
                        >
                          <Minus
                            size={14}
                          />
                        </button>


                        <span className="font-medium min-w-[20px] text-center">
                          {item.quantity}
                        </span>


                        <button
                          onClick={() =>
                            handleUpdate(
                              item,
                              item.quantity +
                                1
                            )
                          }
                          className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center active:scale-95"
                        >
                          <Plus
                            size={14}
                          />
                        </button>

                      </div>


                      {/* PRICE */}

                      <p className="text-[#FF7A30] font-semibold">

                        ₹
                        {(
                          (Number(
                            item.price
                          ) || 0) *
                          (Number(
                            item.quantity
                          ) || 1)
                        ).toFixed(0)}

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* =================================================
          FOOTER
      ================================================= */}

      {items.length > 0 && (

        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg z-50">

          <div className="max-w-xl mx-auto">

            <div className="flex justify-between mb-2 text-sm">

              <span className="text-gray-600">
                Subtotal
              </span>

              <span>
                ₹{subtotal.toFixed(0)}
              </span>

            </div>


            <div className="flex justify-between mb-2 text-sm">

              <span className="text-gray-600">
                Delivery
              </span>

              <span>
                ₹{deliveryFee}
              </span>

            </div>


            <div className="flex justify-between font-bold mb-3">

              <span>
                Total
              </span>

              <span>
                ₹{total.toFixed(0)}
              </span>

            </div>


            <button
              onClick={onCheckout}
              className="w-full bg-[#FF7A30] text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-transform"
            >
              Proceed to Checkout
            </button>

          </div>

        </div>

      )}

    </div>
  );
}