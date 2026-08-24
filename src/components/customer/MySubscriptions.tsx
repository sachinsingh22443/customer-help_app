import { useEffect, useState } from "react";
import { Checkout as RazorpayCheckout } from "capacitor-razorpay";
import {
  ArrowLeft,
  Crown,
  Calendar,
  Clock,
  Wallet,
  History,
  Plus,
  Utensils,
  Sparkles,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

interface MealSchedule {
  id: string;
  subscription_id: string;
  date: string;
  meal_type: "breakfast" | "lunch" | "dinner";
  meal_price: number;
  status: "on" | "off";
  cutoff_at: string;
}

interface WalletTransaction {
  id: string;
  amount: number;
  transaction_type: string;
  meal_type?: string | null;
  subscription_id?: string | null;
  schedule_id?: string | null;
  description?: string | null;
  created_at: string;
}

interface WalletHistoryResponse {
  balance: number;
  transactions: WalletTransaction[];
}


interface SubscriptionMenuItem {
  id: string;
  day_number: number;
  meal_type: "breakfast" | "lunch" | "dinner";
  menu_id: string;
  menu_name?: string;
  menu_description?: string;
  menu_image?: string | null;
  menu_price?: number;
}

interface Subscription {
  id: string;
  plan?: string;
  chefName?: string;
  plan_type?: string;
  price: number;

  breakfast_enabled: boolean;
  breakfast_price: number;

  startDate: string;
  endDate: string;
  time: string;

  status: string;

  meals?: MealSchedule[];

  menu_cycle?: SubscriptionMenuItem[];
}

interface Props {
  onBack: () => void;
}

type MealType = "breakfast" | "lunch" | "dinner";

export default function MySubscriptions({ onBack }: Props) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const [walletBalance, setWalletBalance] = useState<number>(0);

  const [walletTransactions, setWalletTransactions] = useState<
    WalletTransaction[]
  >([]);

  const [walletLoading, setWalletLoading] = useState(false);

  const [walletHistoryOpen, setWalletHistoryOpen] = useState(false);

  const [walletFromDate, setWalletFromDate] = useState("");

  const [walletToDate, setWalletToDate] = useState("");

  const [mealLoading, setMealLoading] = useState<string | null>(null);
  const [showAllMenu, setShowAllMenu] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // =========================================================
  // FETCH SUBSCRIPTIONS
  // =========================================================

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const res = await fetch(
        "https://chef-backend-qh12.onrender.com/subscriptions/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to load subscriptions");
      }

      const data: Subscription[] = await res.json();

      console.log("MY SUBSCRIPTION DATA:", data);

      const subscriptionsWithMeals = await Promise.all(
        data.map(async (sub) => {
          try {
            const mealRes = await fetch(
              `https://chef-backend-qh12.onrender.com/subscriptions/${sub.id}/meals/today`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!mealRes.ok) {
              return {
                ...sub,
                meals: [],
              };
            }

            const meals: MealSchedule[] = await mealRes.json();

            const menuCycleRes = await fetch(
  `https://chef-backend-qh12.onrender.com/subscriptions/${sub.id}/menu-cycle`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

let menuCycle: SubscriptionMenuItem[] = [];

if (menuCycleRes.ok) {
  menuCycle = await menuCycleRes.json();
}

return {
  ...sub,
  meals,
  menu_cycle: menuCycle,
};
          } catch (error) {
            console.error(
              `Failed to load today's meals for ${sub.id}`,
              error
            );

            return {
              ...sub,
              meals: [],
              menu_cycle: [],
            };
          }
        })
      );

      setSubscriptions(subscriptionsWithMeals);
    } catch (error) {
      console.error("Failed to load subscriptions", error);
    }
  };

  // =========================================================
  // WALLET HISTORY
  // =========================================================

  const fetchWalletHistory = async (
    fromDate?: string,
    toDate?: string
  ) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      setWalletLoading(true);

      let url =
        "https://chef-backend-qh12.onrender.com/wallet/history";

      const params = new URLSearchParams();

      if (fromDate) {
        params.append("from_date", fromDate);
      }

      if (toDate) {
        params.append("to_date", toDate);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: WalletHistoryResponse = await res.json();

      if (!res.ok) {
        throw new Error(
          (data as any)?.detail ||
            "Failed to load wallet history"
        );
      }

      setWalletBalance(data.balance || 0);
      setWalletTransactions(data.transactions || []);
    } catch (error: any) {
      console.error("WALLET HISTORY ERROR:", error);

      alert(
        error?.message ||
          "Failed to load wallet history"
      );
    } finally {
      setWalletLoading(false);
    }
  };

  // =========================================================
  // TRANSACTION TITLE
  // =========================================================

  const getTransactionTitle = (
    transaction: WalletTransaction
  ) => {
    if (transaction.description) {
      return transaction.description;
    }

    if (transaction.meal_type) {
      return (
        transaction.meal_type.charAt(0).toUpperCase() +
        transaction.meal_type.slice(1)
      );
    }

    return transaction.transaction_type;
  };

  // =========================================================
  // BREAKFAST PAYMENT
  // =========================================================

  // =========================================================
// BREAKFAST PAYMENT
// =========================================================

const handleAddBreakfast = async (
  subscription: Subscription
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    // -----------------------------------------
    // 1. CREATE RAZORPAY PAYMENT ORDER
    // -----------------------------------------

    const paymentRes = await fetch(
      "https://chef-backend-qh12.onrender.com/subscriptions/breakfast/create-payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscription_id: subscription.id,
        }),
      }
    );

    const paymentData = await paymentRes.json();

    if (!paymentRes.ok) {
      throw new Error(
        paymentData?.detail ||
          "Unable to create breakfast payment"
      );
    }

    // -----------------------------------------
    // 2. OPEN RAZORPAY
    // -----------------------------------------

    let result;

    try {
      result = await RazorpayCheckout.open({
        key: paymentData.key,
        amount: String(paymentData.amount),
        currency: "INR",
        name: "Eat Unity",
        description: "Breakfast Add-on",
        order_id: paymentData.razorpay_order_id,
      });
    } catch (razorpayError: any) {

      console.log(
        "RAZORPAY CLOSED / CANCELLED:",
        razorpayError
      );

      // -----------------------------------------
      // USER PAYMENT SCREEN SE BACK/EXIT KAR GAYA
      // -----------------------------------------

      const errorCode =
        razorpayError?.code ||
        razorpayError?.response?.code ||
        "";

      const errorDescription =
        razorpayError?.description ||
        razorpayError?.response?.description ||
        "";

      const errorMessage =
        typeof razorpayError === "string"
          ? razorpayError
          : JSON.stringify(razorpayError);

      const isCancelled =
        errorCode === "PAYMENT_CANCELLED" ||
        errorCode === "PAYMENT_CANCELED" ||
        errorCode === "BAD_REQUEST_ERROR" ||
        errorDescription?.toLowerCase().includes("cancel") ||
        errorDescription?.toLowerCase().includes("dismiss") ||
        errorMessage?.toLowerCase().includes("cancel") ||
        errorMessage?.toLowerCase().includes("dismiss");

      if (isCancelled) {
        console.log("ℹ️ Breakfast payment cancelled by customer.");

        // IMPORTANT:
        // Yahan koi alert nahi dikhana
        // User simply My Subscription page par rahega.

        return;
      }

      // Genuine Razorpay error
      throw new Error(
        errorDescription ||
          "Payment could not be completed. Please try again."
      );
    }

    // -----------------------------------------
    // 3. PAYMENT RESPONSE
    // -----------------------------------------

    const response = result?.response;

    if (
      !response?.razorpay_order_id ||
      !response?.razorpay_payment_id ||
      !response?.razorpay_signature
    ) {
      console.log(
        "Payment response incomplete:",
        response
      );

      alert(
        "Payment was not completed. Please try again."
      );

      return;
    }

    // -----------------------------------------
    // 4. VERIFY PAYMENT
    // -----------------------------------------

    const verifyRes = await fetch(
      "https://chef-backend-qh12.onrender.com/subscriptions/breakfast/verify-payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscription_id: subscription.id,
          razorpay_order_id:
            response.razorpay_order_id,
          razorpay_payment_id:
            response.razorpay_payment_id,
          razorpay_signature:
            response.razorpay_signature,
        }),
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok) {
      throw new Error(
        verifyData?.detail ||
          "Breakfast payment verification failed"
      );
    }

    // -----------------------------------------
    // 5. SUCCESS
    // -----------------------------------------

    console.log(
      "✅ BREAKFAST PAYMENT VERIFIED:",
      verifyData
    );

    alert("Breakfast added successfully 🎉");

    // Refresh subscription + today's meals
    await fetchSubscriptions();

  } catch (error: any) {

    console.error(
      "BREAKFAST PAYMENT ERROR:",
      error
    );

    // -----------------------------------------
    // FINAL SAFETY:
    // Cancel/exit errors ko user ko mat dikhao
    // -----------------------------------------

    const errorText =
      typeof error === "string"
        ? error
        : JSON.stringify(error);

    const lowerError =
      errorText.toLowerCase();

    const isCancelled =
      lowerError.includes("cancel") ||
      lowerError.includes("canceled") ||
      lowerError.includes("cancelled") ||
      lowerError.includes("dismiss") ||
      lowerError.includes("bad_request_error");

    if (isCancelled) {
      console.log(
        "ℹ️ User cancelled breakfast payment."
      );

      return;
    }

    // Genuine error only
    alert(
      error?.message ||
        "Breakfast payment failed. Please try again."
    );
  }
};

  // =========================================================
  // MEAL TOGGLE
  // =========================================================

  const handleMealToggle = async (
    subscriptionId: string,
    mealType: MealType,
    currentStatus: "on" | "off"
  ) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const action =
        currentStatus === "on" ? "off" : "on";

      const loadingKey =
        `${subscriptionId}-${mealType}`;

      setMealLoading(loadingKey);

      const res = await fetch(
        `https://chef-backend-qh12.onrender.com/subscriptions/${subscriptionId}/meals/${mealType}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.detail ||
            `Unable to turn ${mealType} ${action}`
        );
      }

      await fetchSubscriptions();
    } catch (error: any) {
      console.error(
        `MEAL ${mealType.toUpperCase()} ERROR:`,
        error
      );

      alert(
        error?.message ||
          `Unable to update ${mealType}`
      );
    } finally {
      setMealLoading(null);
    }
  };

  // =========================================================
  // GET MEAL
  // =========================================================

  const getMeal = (
    subscription: Subscription,
    mealType: MealType
  ) => {
    return subscription.meals?.find(
      (meal) => meal.meal_type === mealType
    );
  };

  // =========================================================
  // CUTOFF CHECK
  // =========================================================

  const isCutoffPassed = (
    cutoffAt?: string
  ) => {
    if (!cutoffAt) {
      return false;
    }

    return new Date() >= new Date(cutoffAt);
  };

  // =========================================================
  // FORMAT CUTOFF
  // =========================================================

  const getCutoffText = (
    mealType: MealType,
    cutoffPassed: boolean
  ) => {
    if (cutoffPassed) {
      return "Cutoff time passed";
    }

    if (mealType === "breakfast") {
      return "Cutoff: 8:00 AM";
    }

    if (mealType === "lunch") {
      return "Cutoff: 10:00 AM";
    }

    return "Cutoff: 5:00 PM";
  };

  // =========================================================
  // MEAL ICON
  // =========================================================

  const getMealEmoji = (
    mealType: MealType
  ) => {
    if (mealType === "breakfast") {
      return "☀️";
    }

    if (mealType === "lunch") {
      return "🍱";
    }

    return "🌙";
  };

  // =========================================================
  // MEAL CARD
  // =========================================================

  const renderMealCard = (
    subscription: Subscription,
    mealType: MealType
  ) => {
    const meal = getMeal(
      subscription,
      mealType
    );

    // -------------------------------------------------------
    // NOT SCHEDULED
    // -------------------------------------------------------

    if (!meal) {
      if (
        mealType === "breakfast" &&
        !subscription.breakfast_enabled
      ) {
        return (
          <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4 mb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-sm text-xl">
                  ☀️
                </div>

                <div>
                  <p className="font-bold text-gray-900">
                    Breakfast
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Not included in your plan
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  handleAddBreakfast(subscription)
                }
                className="px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold shadow-lg shadow-orange-200 active:scale-95 transition flex items-center gap-1.5"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-sm text-xl">
              {getMealEmoji(mealType)}
            </div>

            <div>
              <p className="font-bold text-gray-900 capitalize">
                {mealType}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Not scheduled today
              </p>
            </div>
          </div>
        </div>
      );
    }

    const cutoffPassed =
      isCutoffPassed(meal.cutoff_at);

    const loadingKey =
      `${subscription.id}-${mealType}`;

    const isLoading =
      mealLoading === loadingKey;

    const isOn =
      meal.status === "on";

    return (
      <div
        className={`relative overflow-hidden rounded-2xl border p-4 mb-3 transition-all duration-300 ${
          isOn
            ? "bg-gradient-to-r from-emerald-50 via-green-50 to-white border-emerald-100 shadow-sm"
            : "bg-gray-50 border-gray-100"
        }`}
      >
        {/* LEFT ACCENT */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 ${
            isOn
              ? "bg-emerald-500"
              : "bg-gray-300"
          }`}
        />

        <div className="flex items-center justify-between gap-3 pl-1">

          {/* MEAL INFO */}
          <div className="flex items-center gap-3 min-w-0">

            <div
              className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
                isOn
                  ? "bg-white"
                  : "bg-gray-100"
              }`}
            >
              {getMealEmoji(mealType)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-extrabold text-gray-900 capitalize">
                  {mealType}
                </p>

                {isOn && !cutoffPassed && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase">
                    Active
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-1">
                ₹{meal.meal_price}/day
              </p>

              <p
                className={`text-[11px] mt-1 font-medium ${
                  cutoffPassed
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {cutoffPassed
                  ? "● Cutoff time passed"
                  : `● ${getCutoffText(
                      mealType,
                      false
                    )}`}
              </p>
            </div>
          </div>

          {/* TOGGLE */}
          <button
            disabled={
              cutoffPassed ||
              isLoading
            }
            onClick={() =>
              handleMealToggle(
                subscription.id,
                mealType,
                meal.status
              )
            }
            aria-label={`Toggle ${mealType}`}
            className={`relative w-[58px] h-[32px] shrink-0 rounded-full transition-all duration-300 shadow-inner ${
              isOn
                ? "bg-emerald-500"
                : "bg-gray-300"
            } ${
              cutoffPassed || isLoading
                ? "opacity-50 cursor-not-allowed"
                : "active:scale-95"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                isOn
                  ? "left-[28px]"
                  : "left-1"
              }`}
            />

            {isLoading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <RefreshCw
                  size={13}
                  className="text-white animate-spin"
                />
              </span>
            )}
          </button>
        </div>

        {/* STATUS FOOTER */}
        <div className="mt-3 pt-3 border-t border-black/5 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            Meal preference
          </span>

          <span
            className={`text-[11px] font-bold ${
              isOn
                ? "text-emerald-600"
                : "text-gray-500"
            }`}
          >
            {isOn ? "ON • Included" : "OFF • Skipped"}
          </span>
        </div>
      </div>
    );
  };

  const renderSubscriptionMenu = (
  subscription: Subscription
) => {
  const menuCycle = subscription.menu_cycle || [];

  if (menuCycle.length === 0) {
    return null;
  }

  // =====================================================
  // GET ALL DAYS
  // =====================================================

  const allDays = Array.from(
    new Set(
      menuCycle.map(
        (item) => item.day_number
      )
    )
  ).sort((a, b) => a - b);

  // =====================================================
  // SHOW ONLY FIRST 7 DAYS BY DEFAULT
  // =====================================================

  const isShowingAll =
  showAllMenu[subscription.id] === true;

const visibleDays = isShowingAll
  ? allDays
  : allDays.slice(0, 7);

  const getMealEmoji = (
    mealType:
      | "breakfast"
      | "lunch"
      | "dinner"
  ) => {
    if (mealType === "breakfast") {
      return "☀️";
    }

    if (mealType === "lunch") {
      return "🍱";
    }

    return "🌙";
  };

  return (
    <div className="mt-6 pt-5 border-t border-gray-100">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between mb-4">

        <div>
          <h3 className="text-lg font-extrabold text-gray-900">
            Subscription Menu
          </h3>

          <p className="text-xs text-gray-400 mt-1">
            {isShowingAll
  ? "Complete 30-day meal cycle"
  : "Next 7 days meal cycle"}
          </p>
        </div>

        <Utensils
          size={19}
          className="text-orange-500"
        />

      </div>

      {/* =================================================
          DAYS
      ================================================= */}

      <div className="space-y-4">

        {visibleDays.map((dayNumber) => {

          const dayMeals = menuCycle
            .filter(
              (item) =>
                item.day_number === dayNumber
            )
            .sort((a, b) => {

              const order = {
                breakfast: 1,
                lunch: 2,
                dinner: 3,
              };

              return (
                order[a.meal_type] -
                order[b.meal_type]
              );
            });

          return (
            <div
              key={dayNumber}
              className="rounded-3xl bg-gray-50 border border-gray-100 overflow-hidden"
            >

              {/* DAY HEADER */}

              <div className="px-4 py-3 bg-white border-b border-gray-100">

                <p className="text-xs text-orange-500 font-extrabold uppercase">
                  Subscription Day
                </p>

                <p className="text-lg font-extrabold text-gray-900">
                  Day {dayNumber}
                </p>

              </div>

              {/* MEALS */}

              <div className="p-3 space-y-3">

                {dayMeals.map((item) => (

                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-100 p-3"
                  >

                    <div className="flex gap-3">

                      {/* IMAGE */}

                      {item.menu_image ? (
                        <img
                          src={item.menu_image}
                          alt={
                            item.menu_name ||
                            item.meal_type
                          }
                          className="w-20 h-20 rounded-2xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl shrink-0">
                          {getMealEmoji(
                            item.meal_type
                          )}
                        </div>
                      )}

                      {/* INFO */}

                      <div className="flex-1 min-w-0">

                        <div className="flex items-center justify-between gap-2">

                          <p className="text-xs font-extrabold text-orange-600 uppercase">
                            {getMealEmoji(
                              item.meal_type
                            )}{" "}
                            {item.meal_type}
                          </p>

                          {item.menu_price != null && (
                            <span className="text-xs font-bold text-gray-500">
                              ₹{item.menu_price}
                            </span>
                          )}

                        </div>

                        <h4 className="font-extrabold text-gray-900 mt-1">
                          {item.menu_name ||
                            "Meal"}
                        </h4>

                        {item.menu_description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {item.menu_description}
                          </p>
                        )}

                      </div>

                    </div>

                    {/* BREAKFAST NOTE */}

                    {item.meal_type ===
                      "breakfast" && (
                      <div className="mt-3 px-3 py-2 rounded-xl bg-orange-50 border border-orange-100">

                        <p className="text-[10px] text-orange-700 font-semibold">
                          Breakfast is optional.
                          You pay separately only
                          when you choose breakfast.
                        </p>

                      </div>
                    )}

                  </div>

                ))}

              </div>

            </div>
          );
        })}

      </div>

      {/* =================================================
          VIEW ALL / SHOW LESS
      ================================================= */}

      {allDays.length > 7 && (
        <button
          type="button"
          onClick={() =>
  setShowAllMenu((previous) => ({
    ...previous,
    [subscription.id]:
      !previous[subscription.id],
  }))
}
          className="w-full mt-5 py-3.5 rounded-2xl bg-orange-50 border border-orange-100 text-orange-600 font-extrabold text-sm active:scale-[0.98] transition"
        >
          {isShowingAll
  ? "Show Less"
  : `View All ${allDays.length} Days`}
        </button>
      )}

    </div>
  );
};
  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#FFF8F0] px-4 sm:px-6 pb-28">

      {/* =====================================================
          PREMIUM HEADER
      ===================================================== */}

      <div className="relative overflow-hidden rounded-b-[32px] bg-gradient-to-br from-[#FF7A30] via-[#FF4D4D] to-[#7C3AED] px-5 pt-5 pb-7 mb-7 shadow-[0_15px_40px_rgba(255,90,31,0.20)]">

        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10" />

        <div className="absolute -left-12 bottom-[-60px] h-36 w-36 rounded-full bg-white/10" />

        <div className="relative flex items-center gap-4">

          <button
            onClick={onBack}
            className="h-12 w-12 shrink-0 rounded-2xl bg-white/95 flex items-center justify-center shadow-lg active:scale-95 transition"
          >
            <ArrowLeft
              size={22}
              className="text-gray-900"
            />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <Crown
                size={22}
                className="text-yellow-300"
                fill="currentColor"
              />

              <h1 className="text-[24px] font-extrabold text-white">
                My Subscriptions
              </h1>
            </div>

            <p className="text-sm text-white/80 mt-1">
              Your personalized meal plans
            </p>
          </div>

        </div>
      </div>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {subscriptions.length === 0 ? (
        <div className="bg-white rounded-[30px] p-10 shadow-[0_15px_45px_rgba(23,23,23,0.08)] text-center border border-orange-100">

          <div className="h-20 w-20 mx-auto bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl flex items-center justify-center mb-5">
            <Crown
              size={36}
              className="text-orange-500"
              fill="currentColor"
            />
          </div>

          <h2 className="text-xl font-extrabold text-gray-900 mb-2">
            No Active Subscription
          </h2>

          <p className="text-sm text-gray-500 leading-6">
            Subscribe to a meal plan and enjoy
            delicious food every day.
          </p>

        </div>
      ) : (

        /* =====================================================
           SUBSCRIPTIONS
        ===================================================== */

        <div className="space-y-6">

          {subscriptions.map((sub) => (

            <div
              key={sub.id}
              className="relative overflow-hidden rounded-[30px] bg-white border border-white shadow-[0_15px_45px_rgba(23,23,23,0.10)]"
            >

              {/* TOP GRADIENT */}

              <div className="h-2 bg-gradient-to-r from-[#FF7A30] via-[#FF4D4D] to-[#7C3AED]" />

              <div className="p-5">

                {/* =================================================
                    SUBSCRIPTION HEADER
                ================================================= */}

                <div className="flex items-start justify-between gap-3 mb-6">

                  <div className="flex items-start gap-3 min-w-0">

                    <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center shadow-sm">
                      <Crown
                        size={24}
                        className="text-yellow-500"
                        fill="currentColor"
                      />
                    </div>

                    <div className="min-w-0">

                      <h2 className="text-xl font-extrabold text-gray-900 truncate">
                        {sub.plan || "Meal Plan"}
                      </h2>

                      {sub.chefName && (
                        <p className="text-sm font-semibold text-orange-600 mt-1">
                          👨‍🍳 {sub.chefName}
                        </p>
                      )}

                    </div>

                  </div>

                  <span
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${
                      sub.status === "active"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    ●{" "}
                    {sub.status === "active"
                      ? "Active"
                      : sub.status}
                  </span>

                </div>

                {/* =================================================
                    DATE + DELIVERY CARDS
                ================================================= */}

                <div className="grid grid-cols-2 gap-3">

                  {/* START */}

                  <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">

                    <Calendar
                      size={20}
                      className="text-blue-500 mb-2"
                    />

                    <p className="text-[10px] uppercase tracking-wide text-blue-500 font-extrabold">
                      Start Date
                    </p>

                    <p className="text-sm font-bold text-gray-800 mt-1">
                      {sub.startDate}
                    </p>

                  </div>

                  {/* END */}

                  <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">

                    <Calendar
                      size={20}
                      className="text-emerald-500 mb-2"
                    />

                    <p className="text-[10px] uppercase tracking-wide text-emerald-500 font-extrabold">
                      End Date
                    </p>

                    <p className="text-sm font-bold text-gray-800 mt-1">
                      {sub.endDate}
                    </p>

                  </div>

                  {/* DELIVERY */}

                  <div className="col-span-2 rounded-2xl bg-purple-50 border border-purple-100 p-4 flex items-center gap-3">

                    <div className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                      <Clock
                        size={21}
                        className="text-purple-500"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-purple-500 font-extrabold">
                        Delivery Schedule
                      </p>

                      <p className="text-sm font-bold text-gray-800 mt-1">
                        {sub.time}
                      </p>
                    </div>

                  </div>

                </div>

                {/* =================================================
                    SUBSCRIPTION AMOUNT
                ================================================= */}

                <div className="mt-5 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 p-4 flex items-center justify-between">

                  <div>
                    <p className="text-[10px] uppercase tracking-wide font-extrabold text-gray-500">
                      Subscription Amount
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Your active meal plan
                    </p>
                  </div>

                  <div className="text-right">

                    <p className="text-2xl font-extrabold text-orange-600">
                      ₹{sub.price}
                    </p>

                    <p className="text-[10px] text-gray-400">
                      plan price
                    </p>

                  </div>

                </div>

                {/* =================================================
                    TODAY'S MEALS
                ================================================= */}

                <div className="mt-6 pt-5 border-t border-gray-100">

                  <div className="flex items-center justify-between mb-4">

                    <div>
                      <div className="flex items-center gap-2">

                        <h3 className="text-lg font-extrabold text-gray-900">
                          Today's Meals
                        </h3>

                        <Sparkles
                          size={17}
                          className="text-orange-500"
                        />

                      </div>

                      <p className="text-xs text-gray-400 mt-1">
                        Manage your daily meal preferences
                      </p>
                    </div>

                    <div className="h-10 w-10 rounded-2xl bg-orange-50 flex items-center justify-center">
                      <Utensils
                        size={19}
                        className="text-orange-500"
                      />
                    </div>

                  </div>

                  {/* LUNCH */}

                  {renderMealCard(
                    sub,
                    "lunch"
                  )}

                  {/* DINNER */}

                  {renderMealCard(
                    sub,
                    "dinner"
                  )}

                  {/* BREAKFAST */}

                  {renderMealCard(
                    sub,
                    "breakfast"
                  )}

                  

                </div>
                {renderSubscriptionMenu(sub)}

              </div>
            </div>
          ))}

        </div>
      )}

      {/* =====================================================
          WALLET
      ===================================================== */}

      <div className="mt-7 bg-white rounded-[30px] shadow-[0_15px_45px_rgba(23,23,23,0.09)] border border-orange-100 overflow-hidden">

        {/* WALLET HEADER */}

        <div className="relative overflow-hidden bg-gradient-to-br from-[#FF7A30] via-[#FF4D4D] to-[#E91E63] p-6 text-white">

          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

          <div className="relative flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
                <Wallet size={27} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-white/70 font-bold">
                  Wallet Balance
                </p>

                <h2 className="text-3xl font-extrabold mt-1">
                  ₹{walletBalance.toFixed(2)}
                </h2>
              </div>

            </div>

          </div>

        </div>

        {/* WALLET BODY */}

        <div className="p-5">

          <button
            onClick={async () => {

              const nextOpen =
                !walletHistoryOpen;

              setWalletHistoryOpen(
                nextOpen
              );

              if (nextOpen) {
                await fetchWalletHistory(
                  walletFromDate || undefined,
                  walletToDate || undefined
                );
              }

            }}
            className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-2xl transition active:scale-[0.99]"
          >

            <div className="flex items-center gap-3">

              <div className="h-11 w-11 bg-white rounded-xl flex items-center justify-center shadow-sm">

                <History
                  size={20}
                  className="text-orange-600"
                />

              </div>

              <div className="text-left">

                <p className="font-bold text-gray-900">
                  Wallet History
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  View wallet transactions
                </p>

              </div>

            </div>

            <div className="flex items-center gap-1 text-orange-600 font-bold text-sm">

              {walletHistoryOpen
                ? "Hide"
                : "View"}

              <ChevronDown
                size={17}
                className={`transition-transform ${
                  walletHistoryOpen
                    ? "rotate-180"
                    : ""
                }`}
              />

            </div>

          </button>

          {/* =================================================
              WALLET HISTORY
          ================================================= */}

          {walletHistoryOpen && (

            <div className="mt-5">

              {/* DATE FILTER */}

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">

                <h3 className="font-bold text-gray-900 mb-4">
                  Filter History
                </h3>

                {/* FROM DATE */}

                <div className="mb-3">

                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">
                    From Date
                  </label>

                  <input
                    type="date"
                    value={walletFromDate}
                    onChange={(e) =>
                      setWalletFromDate(
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />

                </div>

                {/* TO DATE */}

                <div className="mb-4">

                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">
                    To Date
                  </label>

                  <input
                    type="date"
                    value={walletToDate}
                    onChange={(e) =>
                      setWalletToDate(
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />

                </div>

                {/* VIEW */}

                <button
                  onClick={() =>
                    fetchWalletHistory(
                      walletFromDate || undefined,
                      walletToDate || undefined
                    )
                  }
                  disabled={walletLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-orange-100 disabled:opacity-50 active:scale-[0.98] transition"
                >
                  {walletLoading
                    ? "Loading..."
                    : "View History"}
                </button>

                {/* CLEAR */}

                {(walletFromDate ||
                  walletToDate) && (

                  <button
                    onClick={() => {

                      setWalletFromDate("");
                      setWalletToDate("");

                      fetchWalletHistory();

                    }}
                    className="w-full text-sm text-gray-500 py-3"
                  >
                    Clear Date Filter
                  </button>

                )}

              </div>

              {/* =================================================
                  TRANSACTIONS
              ================================================= */}

              <div className="mt-5">

                <div className="flex items-center justify-between mb-3">

                  <h3 className="font-bold text-gray-900">
                    Transactions
                  </h3>

                  <span className="text-xs text-gray-400">
                    {walletTransactions.length} transactions
                  </span>

                </div>

                {walletLoading ? (

                  <div className="text-center py-8 text-gray-500">
                    Loading wallet history...
                  </div>

                ) : walletTransactions.length === 0 ? (

                  <div className="bg-gray-50 rounded-2xl p-7 text-center border border-gray-100">

                    <div className="h-14 w-14 mx-auto rounded-2xl bg-white flex items-center justify-center mb-3 shadow-sm">

                      <Wallet
                        size={27}
                        className="text-gray-400"
                      />

                    </div>

                    <p className="text-sm text-gray-500">
                      No wallet transactions found.
                    </p>

                  </div>

                ) : (

                  <div className="space-y-3">

                    {walletTransactions.map(
                      (transaction) => {

                        const isCredit =
                          transaction.amount > 0;

                        return (

                          <div
                            key={transaction.id}
                            className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
                          >

                            <div className="flex justify-between items-start gap-3">

                              <div className="min-w-0">

                                <p className="font-bold text-gray-900">
                                  {getTransactionTitle(
                                    transaction
                                  )}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">

                                  {new Date(
                                    transaction.created_at
                                  ).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}

                                  {" • "}

                                  {new Date(
                                    transaction.created_at
                                  ).toLocaleTimeString(
                                    "en-IN",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}

                                </p>

                                {transaction.meal_type && (

                                  <p className="text-xs text-gray-500 mt-1">
                                    Meal:{" "}
                                    {transaction.meal_type}
                                  </p>

                                )}

                              </div>

                              <p
                                className={`font-extrabold shrink-0 ${
                                  isCredit
                                    ? "text-emerald-600"
                                    : "text-red-600"
                                }`}
                              >

                                {isCredit
                                  ? "+"
                                  : "-"}
                                ₹
                                {Math.abs(
                                  transaction.amount
                                ).toFixed(2)}

                              </p>

                            </div>

                          </div>

                        );

                      }
                    )}

                  </div>

                )}

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}