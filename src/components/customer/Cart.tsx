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
  <div className="min-h-screen bg-[#F7F6F3] pb-44">

    {/* =====================================================
        PREMIUM HEADER
    ===================================================== */}

    <div className="relative overflow-hidden rounded-b-[2.8rem] bg-gradient-to-br from-[#24104D] via-[#5F2EEA] to-[#FF7A30] px-5 pb-9 pt-7">

      {/* Background glow */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-orange-300/15 blur-3xl" />


      <div className="relative">

        {/* TOP */}

        <div className="flex items-center justify-between">

          <button
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white backdrop-blur-md transition active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>


          <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md">

            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white">
              Eat Unity
            </span>

          </div>

        </div>


        {/* TITLE */}

        <div className="mt-8">

          <div className="flex items-center gap-2">

            <span className="text-lg">
              🛒
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/55">
              Ready to order
            </span>

          </div>


          <h1 className="mt-2 text-[31px] font-bold tracking-tight text-white">
            Your Cart
          </h1>


          <p className="mt-2 text-xs leading-5 text-white/65">
            Fresh meals selected just for you.
          </p>


          {/* CART SUMMARY */}

          <div className="mt-6 flex items-center gap-2">

            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-md">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                🍱
              </div>

              <div>

                <p className="text-[8px] font-bold uppercase tracking-wider text-white/45">
                  Items
                </p>

                <p className="mt-0.5 text-xs font-bold text-white">
                  {items.length}{" "}
                  {items.length === 1
                    ? "item"
                    : "items"}
                </p>

              </div>

            </div>


            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-md">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                ✨
              </div>

              <div>

                <p className="text-[8px] font-bold uppercase tracking-wider text-white/45">
                  Total
                </p>

                <p className="mt-0.5 text-xs font-bold text-white">
                  ₹{total.toFixed(0)}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>


    {/* =====================================================
        CONTENT
    ===================================================== */}

    <div className="px-5 pt-6">


      {/* ===================================================
          LOADING
      =================================================== */}

      {loading ? (

        <div className="space-y-4">

          {[1, 2, 3].map((item) => (

            <div
              key={item}
              className="overflow-hidden rounded-[2rem] bg-white shadow-sm"
            >

              <div className="flex gap-4 p-4">

                <div className="h-24 w-24 animate-pulse rounded-2xl bg-slate-200" />

                <div className="flex-1 space-y-3">

                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />

                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />

                  <div className="h-8 w-full animate-pulse rounded-xl bg-slate-100" />

                </div>

              </div>

            </div>

          ))}

        </div>


      ) : items.length === 0 ? (

        /* =================================================
           EMPTY CART
        ================================================= */

        <div className="rounded-[2.2rem] bg-white px-6 py-10 text-center shadow-sm">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-orange-50 to-purple-50">

            <span className="text-5xl">
              🛒
            </span>

          </div>


          <div className="mx-auto mt-5 w-fit rounded-full bg-slate-50 px-3 py-1.5">

            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Nothing here yet
            </span>

          </div>


          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Your cart is waiting
          </h2>


          <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-slate-500">
            Explore delicious meals and add your
            favourites to your cart.
          </p>


          <button
            onClick={onBack}
            className="mt-6 rounded-2xl bg-gradient-to-r from-[#FF7A30] to-[#5F2EEA] px-7 py-3.5 text-xs font-bold text-white shadow-lg transition active:scale-95"
          >
            Explore Meals →
          </button>

        </div>


      ) : (

        /* =================================================
           CART ITEMS
        ================================================= */

        <div className="space-y-5">

          {/* SECTION HEADER */}

          <div className="flex items-end justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Your selection
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Delicious picks
              </h2>

            </div>


            <div className="rounded-full bg-orange-50 px-3 py-1.5">

              <span className="text-[9px] font-bold text-orange-600">
                {items.length}{" "}
                {items.length === 1
                  ? "ITEM"
                  : "ITEMS"}
              </span>

            </div>

          </div>


          {items.map((item) => (

            <div
              key={item.id}
              className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_12px_35px_rgba(30,20,70,0.07)]"
            >

              {/* =================================================
                  ITEM TOP
              ================================================= */}

              <div className="p-4">

                <div className="flex gap-4">

                  {/* IMAGE */}

                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.4rem] bg-slate-100">

                    <ImageWithFallback
                      src={
                        item.image ||
                        "/fallback.jpg"
                      }
                      alt={
                        item.name ||
                        "Food"
                      }
                      className="h-full w-full object-cover"
                    />


                    {/* IMAGE BADGE */}

                    {item.type ===
                      "special" && (

                      <div className="absolute left-1.5 top-1.5 rounded-lg bg-purple-600 px-1.5 py-1 text-[7px] font-bold text-white shadow">
                        SPECIAL
                      </div>

                    )}

                  </div>


                  {/* DETAILS */}

                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-2">

                      <div className="min-w-0">

                        <p className="truncate text-sm font-bold text-slate-900">
                          {item.name}
                        </p>

                        <div className="mt-1 flex items-center gap-1">

                          <span className="text-[9px] text-emerald-500">
                            ●
                          </span>

                          <span className="text-[9px] font-medium text-slate-400">
                            Freshly prepared
                          </span>

                        </div>

                      </div>


                      {/* DELETE */}

                      <button
                        onClick={() =>
                          handleRemove(item)
                        }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 transition active:scale-90"
                      >

                        <Trash2
                          size={16}
                          className="text-red-500"
                        />

                      </button>

                    </div>


                    {/* =================================================
                        NORMAL MENU INFO
                    ================================================= */}

                    {item.type ===
                      "menu" &&
                      item.menu_date && (

                      <div className="mt-3 rounded-xl bg-orange-50/70 p-2.5">

                        <div className="flex items-center gap-2">

                          <CalendarDays
                            size={13}
                            className="text-orange-500"
                          />

                          <span className="text-[9px] font-semibold text-slate-600">
                            {formatMenuDate(
                              item.menu_date
                            )}
                          </span>

                        </div>


                        {item.meal_type && (

                          <div className="mt-1 flex items-center gap-2">

                            <Clock
                              size={13}
                              className="text-[#5F2EEA]"
                            />

                            <span className="text-[9px] font-semibold text-slate-600">

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
                        TOMORROW SPECIAL
                    ================================================= */}

                    {item.type ===
                      "special" && (

                      <div className="mt-3 flex items-center gap-2">

                        <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[8px] font-bold text-purple-700">
                          ⭐ Tomorrow Special
                        </span>

                        <span className="text-[8px] text-slate-400">
                          Limited
                        </span>

                      </div>

                    )}

                  </div>

                </div>


                {/* =================================================
                    BOTTOM ITEM BAR
                ================================================= */}

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                  {/* QUANTITY */}

                  <div>

                    <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Quantity
                    </p>

                    <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-1">

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
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm transition active:scale-90"
                      >

                        <Minus
                          size={14}
                          className="text-slate-600"
                        />

                      </button>


                      <span className="min-w-[25px] text-center text-xs font-bold text-slate-800">
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
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 text-white shadow-sm transition active:scale-90"
                      >

                        <Plus size={14} />

                      </button>

                    </div>

                  </div>


                  {/* ITEM PRICE */}

                  <div className="text-right">

                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Item total
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-900">

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

                    <p className="mt-0.5 text-[8px] text-slate-400">
                      ₹{Number(
                        item.price
                      ).toFixed(0)} each
                    </p>

                  </div>

                </div>

              </div>

            </div>

          ))}


          {/* =================================================
              CART TRUST CARD
          ================================================= */}

          <div className="rounded-[1.8rem] border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">

                <span className="text-lg">
                  ✓
                </span>

              </div>

              <div>

                <p className="text-xs font-bold text-emerald-800">
                  Fresh & carefully prepared
                </p>

                <p className="mt-1 text-[9px] leading-4 text-emerald-600">
                  Your meals are prepared by local chefs
                  with care.
                </p>

              </div>

            </div>

          </div>


        </div>

      )}

    </div>


    {/* =====================================================
        PREMIUM CHECKOUT BAR
    ===================================================== */}

    {items.length > 0 && (

      <div className="fixed bottom-0 left-0 right-0 z-50">

        {/* Blur background */}

        <div className="absolute inset-0 bg-white/85 backdrop-blur-xl" />


        <div className="relative mx-auto max-w-xl px-5 pb-5 pt-4">

          {/* PRICE SUMMARY */}

          <div className="mb-3 rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-[0_8px_30px_rgba(20,20,50,0.06)]">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Order summary
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-600">
                  {items.length}{" "}
                  {items.length === 1
                    ? "item"
                    : "items"}{" "}
                  · Delivery
                </p>

              </div>


              <div className="text-right">

                <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Total
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  ₹{total.toFixed(0)}
                </p>

              </div>

            </div>


            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">

              <span className="text-[9px] text-slate-400">
                Subtotal
              </span>

              <span className="text-[9px] font-semibold text-slate-600">
                ₹{subtotal.toFixed(0)}
              </span>

            </div>


            <div className="mt-1 flex items-center justify-between">

              <span className="text-[9px] text-slate-400">
                Delivery
              </span>

              <span className="text-[9px] font-semibold text-emerald-600">
                {deliveryFee === 0
                  ? "FREE"
                  : `₹${deliveryFee}`}
              </span>

            </div>

          </div>


          {/* CHECKOUT BUTTON */}

          <button
            onClick={onCheckout}
            className="group flex w-full items-center justify-between rounded-[1.4rem] bg-gradient-to-r from-[#FF7A30] via-[#F45B2A] to-[#5F2EEA] px-5 py-4 text-white shadow-[0_12px_30px_rgba(95,46,234,0.22)] transition active:scale-[0.98]"
          >

            <div className="text-left">

              <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/60">
                Secure checkout
              </p>

              <p className="mt-0.5 text-sm font-bold">
                Proceed to Checkout
              </p>

            </div>


            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 transition group-active:translate-x-1">

              <span className="text-lg">
                →
              </span>

            </div>

          </button>


          <div className="mt-2 flex items-center justify-center gap-1">

            <span className="text-[8px] text-slate-400">
              🔒 Secure & protected payment
            </span>

          </div>

        </div>

      </div>

    )}

  </div>
);
}