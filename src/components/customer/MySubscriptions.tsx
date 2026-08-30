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

  // Today's actual menu
  menu_id?: string | null;
  menu_name?: string | null;
  menu_description?: string | null;
  menu_price?: number | null;
  menu_category?: string | null;
  food_type?: string | null;

  // Nutrition
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fats?: number | null;

  // Image
  menu_image?: string | null;
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
  normal_menu_price?: number;
  subscription_price?: number;


  // Optional date returned by backend
  date?: string;

  chef_id?: string;
  chef_name?: string;
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

  onViewDish?: (dish: any) => void;
}

type MealType = "breakfast" | "lunch" | "dinner";

export default function MySubscriptions({ onBack, onViewDish, }: Props) {
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

    const API =
      "https://chef-backend-qh12.onrender.com";

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // =========================================================
    // 1. GET SUBSCRIPTIONS
    // =========================================================

    const res = await fetch(
      `${API}/subscriptions/my`,
      {
        headers,
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to load subscriptions"
      );
    }

    const data: Subscription[] =
      await res.json();

    console.log(
      "MY SUBSCRIPTION DATA:",
      data
    );

    // =========================================================
    // 2. SHOW SUBSCRIPTION IMMEDIATELY
    //
    // IMPORTANT:
    // DO NOT WAIT FOR meals/today
    // DO NOT WAIT FOR menu-cycle
    // =========================================================

    const initialSubscriptions =
      data.map((sub) => ({
        ...sub,
        meals: [],
        menu_cycle: [],
      }));

    setSubscriptions(
      initialSubscriptions
    );

    // =========================================================
    // 3. LOAD TODAY'S MEALS + MENU CYCLE
    //    IN BACKGROUND
    //
    // These requests NEVER block the initial screen.
    // =========================================================

    data.forEach((sub) => {

      // =======================================================
      // TODAY'S MEALS
      // =======================================================

      fetch(
        `${API}/subscriptions/${sub.id}/meals/today`,
        {
          headers,
        }
      )
        .then(async (mealRes) => {

          if (!mealRes.ok) {
            console.warn(
              "TODAY MEALS API FAILED:",
              sub.id,
              mealRes.status
            );

            return [];
          }

          const meals: MealSchedule[] =
            await mealRes.json();

          return meals;

        })
        .then((meals) => {

          setSubscriptions(
            (previous) =>
              previous.map(
                (currentSub) =>
                  currentSub.id === sub.id
                    ? {
                        ...currentSub,
                        meals,
                      }
                    : currentSub
              )
          );

        })
        .catch((error) => {

          console.error(
            `Failed to load today's meals for ${sub.id}`,
            error
          );

        });

      // =======================================================
      // MENU CYCLE
      //
      // IMPORTANT:
      // This is completely independent.
      // Even if this takes 13 seconds,
      // page is already visible.
      // =======================================================

      fetch(
        `${API}/subscriptions/${sub.id}/menu-cycle`,
        {
          headers,
        }
      )
        .then(async (menuCycleRes) => {

          if (!menuCycleRes.ok) {

            console.warn(
              "MENU CYCLE API FAILED:",
              sub.id,
              menuCycleRes.status
            );

            return [];
          }

          const menuCycleData =
            await menuCycleRes.json();

          let menuCycle: SubscriptionMenuItem[] =
            [];

          // =====================================================
          // RESPONSE FORMAT: { days: [...] }
          // =====================================================

          if (
            Array.isArray(
              menuCycleData?.days
            )
          ) {

            menuCycle =
              menuCycleData.days.flatMap(
                (day: any) =>
                  (day.meals || []).map(
                    (meal: any) => ({
                      id:
                        meal.schedule_id ||
                        meal.id ||
                        `${day.day_number}-${meal.meal_type}`,

                      day_number:
                        Number(
                          day.day_number
                        ),

                      date:
                        day.date,

                      meal_type:
                        meal.meal_type,

                      menu_id:
                        meal.menu?.id ||
                        meal.menu_id ||
                        null,

                      menu_name:
                        meal.menu?.name ||
                        meal.menu_name ||
                        "Meal",

                      menu_description:
                        meal.menu?.description ||
                        meal.menu_description ||
                        "",

                      menu_image:
                        meal.menu?.menu_image ||
                        meal.menu?.image_urls?.[0] ||
                        meal.menu_image ||
                        null,

                      // Subscription price
                      menu_price: Number(
                        meal.menu?.subscription_price ??
                        meal.subscription_price ??
                        meal.menu?.price ??
                        meal.meal_price ??
                        0
                      ),

                      chef_id:
                        meal.chef_id ||
                        sub.chef_id ||
                        null,

                      chef_name:
                        meal.chef_name ||
                        sub.chefName ||
                        null,
                    })
                  )
              );

          // =====================================================
          // RESPONSE FORMAT: ARRAY
          // =====================================================

          } else if (
            Array.isArray(menuCycleData)
          ) {

            menuCycle =
              menuCycleData;

          // =====================================================
          // RESPONSE FORMAT: { items: [...] }
          // =====================================================

          } else if (
            Array.isArray(
              menuCycleData?.items
            )
          ) {

            menuCycle =
              menuCycleData.items;

          // =====================================================
          // RESPONSE FORMAT: { menu_cycle: [...] }
          // =====================================================

          } else if (
            Array.isArray(
              menuCycleData?.menu_cycle
            )
          ) {

            menuCycle =
              menuCycleData.menu_cycle;

          } else {

            console.warn(
              "Unexpected MENU CYCLE response:",
              menuCycleData
            );

            menuCycle = [];
          }

          console.log(
            "SUBSCRIPTION MENU CYCLE:",
            sub.id,
            menuCycle
          );

          return menuCycle;
        })
        .then((menuCycle) => {

          setSubscriptions(
            (previous) =>
              previous.map(
                (currentSub) =>
                  currentSub.id === sub.id
                    ? {
                        ...currentSub,
                        menu_cycle:
                          menuCycle,
                      }
                    : currentSub
              )
          );

        })
        .catch((error) => {

          console.error(
            "MENU CYCLE FETCH ERROR:",
            sub.id,
            error
          );

        });

    });

  } catch (error) {

    console.error(
      "Failed to load subscriptions",
      error
    );

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
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }
);

    // -----------------------------------------
    // SAFE RESPONSE PARSING
    // -----------------------------------------

    const responseText = await res.text();

    let data: any = {};

try {
  data = responseText
    ? JSON.parse(responseText)
    : {};
} catch {
  data = {
    message: responseText,
  };
}

if (!res.ok) {
  throw new Error(
    data?.detail ||
      data?.message ||
      `Unable to turn ${mealType} ${action}`
  );
}

console.log(
  `MEAL ${mealType.toUpperCase()} ${action.toUpperCase()} SUCCESS:`,
  data
);
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
  // Subscription ke FIXED cutoff times
  // Normal Menu se cutoff time fetch nahi karna hai.

  if (mealType === "breakfast") {
    return cutoffPassed
      ? "Cutoff: 8:00 AM • Passed"
      : "Cutoff: 8:00 AM";
  }

  if (mealType === "lunch") {
    return cutoffPassed
      ? "Cutoff: 11:00 AM • Passed"
      : "Cutoff: 11:00 AM";
  }

  return cutoffPassed
    ? "Cutoff: 6:00 PM • Passed"
    : "Cutoff: 6:00 PM";
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
    const meal = getMeal(subscription, mealType);

    if (!meal) {
  // -------------------------------------------------
  // BREAKFAST NOT SUBSCRIBED
  // -------------------------------------------------

  if (
    mealType === "breakfast" &&
    subscription.breakfast_enabled !== true
  ) {
    return (
      <div className="mb-3 rounded-2xl bg-orange-50 border border-orange-100 p-4">
        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-3 min-w-0">

            <div className="h-11 w-11 shrink-0 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm">
              ☀️
            </div>

            <div className="min-w-0">
              <p className="font-extrabold text-gray-900">
                Breakfast
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Breakfast is not included
              </p>

              {subscription.breakfast_price > 0 && (
                <p className="text-xs font-bold text-orange-600 mt-1">
                  ₹{subscription.breakfast_price}/day
                </p>
              )}
            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              handleAddBreakfast(subscription)
            }
            className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-extrabold shadow-md shadow-orange-200 active:scale-95 transition"
          >
            + Add
          </button>

        </div>
      </div>
    );
  }

  // -------------------------------------------------
  // OTHER MEAL NOT SCHEDULED
  // -------------------------------------------------

  return (
    <div className="mb-3 rounded-2xl bg-gray-50 border border-gray-100 p-4">
      <div className="flex items-center gap-3">

        <span className="text-2xl">
          {getMealEmoji(mealType)}
        </span>

        <div>
          <p className="font-extrabold text-gray-900 capitalize">
            {mealType}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            No meal scheduled
          </p>
        </div>

      </div>
    </div>
  );
}

    const cutoffPassed = isCutoffPassed(meal.cutoff_at);

    const loadingKey =
      `${subscription.id}-${mealType}`;

    const isLoading =
      mealLoading === loadingKey;

    return (
      <div
        className={`mb-3 rounded-2xl border p-4 transition ${
          meal.status === "on"
            ? "bg-white border-emerald-100"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between gap-3">

          {/* LEFT */}
          <div className="flex items-center gap-3 min-w-0">

            <div className="h-11 w-11 shrink-0 rounded-2xl bg-orange-50 flex items-center justify-center text-xl">
              {getMealEmoji(mealType)}
            </div>

            <div className="min-w-0">

              <p className="font-extrabold text-gray-900 capitalize">
                {mealType}
              </p>

              {meal.menu_name && (
                <p className="text-sm font-semibold text-gray-700 mt-0.5 truncate">
                  {meal.menu_name}
                </p>
              )}

              <p
                className={`text-[11px] mt-1 ${
                  cutoffPassed
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              >
                {getCutoffText(
                  mealType,
                  cutoffPassed
                )}
              </p>

            </div>
          </div>

          {/* RIGHT */}
          <button
  type="button"
  disabled={cutoffPassed || isLoading}
  onClick={() =>
    handleMealToggle(
      subscription.id,
      mealType,
      meal.status
    )
  }
  aria-label={`${mealType} ${meal.status === "on" ? "on" : "off"}`}
  aria-pressed={meal.status === "on"}
  className={`group relative flex h-9 w-[76px] shrink-0 items-center rounded-full p-1 transition-all duration-300 ease-out
    ${
      meal.status === "on"
        ? "bg-gradient-to-r from-emerald-500 to-green-500 shadow-[0_5px_14px_rgba(16,185,129,0.25)]"
        : "bg-gray-200 shadow-inner"
    }
    ${
      cutoffPassed || isLoading
        ? "cursor-not-allowed opacity-55"
        : "cursor-pointer hover:scale-[1.03] active:scale-[0.96]"
    }
  `}
>
  {/* ON / OFF LABEL */}
  <span
    className={`absolute text-[9px] font-black tracking-wide transition-all duration-200
      ${
        meal.status === "on"
          ? "left-2.5 text-white"
          : "right-2.5 text-gray-500"
      }
    `}
  >
    {meal.status === "on" ? "ON" : "OFF"}
  </span>

  {/* KNOB */}
  <span
    className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white
      shadow-[0_2px_7px_rgba(0,0,0,0.20)]
      transition-transform duration-300 ease-[cubic-bezier(.4,1.4,.6,1)]
      ${
        meal.status === "on"
          ? "translate-x-[40px]"
          : "translate-x-0"
      }
    `}
  >
    {isLoading ? (
      <RefreshCw
        size={13}
        className="animate-spin text-gray-500"
      />
    ) : meal.status === "on" ? (
      <span className="text-[13px] font-black text-emerald-500">
        ✓
      </span>
    ) : (
      <span className="text-[13px] font-black text-gray-400">
        −
      </span>
    )}
  </span>
</button>

        </div>

        {/* STATUS */}
        <div className="mt-3 flex items-center justify-between">

          <span
            className={`text-[10px] font-extrabold uppercase ${
              meal.status === "on"
                ? "text-emerald-600"
                : "text-gray-500"
            }`}
          >
            {isLoading
              ? "Updating..."
              : meal.status === "on"
                ? "Meal ON"
                : "Meal OFF"}
          </span>

          {meal.menu_price != null && (
            <span className="text-xs font-bold text-gray-400">
              ₹{meal.menu_price}
            </span>
          )}

        </div>
      </div>
    );
  };

    const renderSubscriptionMenu = (
    subscription: Subscription
  ) => {
    const menuCycle =
  subscription.menu_cycle || [];

    // =====================================================
    // DATE HELPERS
    // =====================================================

    const parseDateOnly = (value: string) => {
  const raw = String(value || "").trim();

  if (!raw) {
    return null;
  }

  // -----------------------------------------
  // FORMAT 1:
  // YYYY-MM-DD / ISO date
  // -----------------------------------------
  const isoDate = raw.split("T")[0];

  if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    const [year, month, day] =
      isoDate.split("-").map(Number);

    const date = new Date(
      year,
      month - 1,
      day
    );

    date.setHours(0, 0, 0, 0);

    return date;
  }

  // -----------------------------------------
  // FORMAT 2:
  // "Aug 28, 2026"
  // -----------------------------------------
  const parsed = new Date(raw);

  if (Number.isNaN(parsed.getTime())) {
    console.warn(
      "Invalid subscription date:",
      value
    );

    return null;
  }

  parsed.setHours(0, 0, 0, 0);

  return parsed;
};

    const formatDate = (date: Date) => {
      return date.toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
        }
      );
    };

    const formatFullDate = (date: Date) => {
      return date.toLocaleDateString(
        "en-IN",
        {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    };

    const startDate =
      parseDateOnly(
        subscription.startDate
      );

    const endDate =
      parseDateOnly(
        subscription.endDate
      );

    if (!startDate || !endDate) {
      return null;
    }

    // =====================================================
    // TODAY
    // =====================================================

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    // =====================================================
    // CURRENT SUBSCRIPTION DAY
    //
    // Start Date = Day 1
    // Next Date  = Day 2
    // =====================================================

    const diffMs =
      today.getTime() -
      startDate.getTime();

    const currentDayNumber =
      Math.floor(
        diffMs /
          (1000 * 60 * 60 * 24)
      ) + 1;

    const totalSubscriptionDays =
  Math.max(
    1,
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
  );

const safeCurrentDay =
  Math.max(
    1,
    Math.min(
      currentDayNumber,
      totalSubscriptionDays
    )
  );

    // =====================================================
    // ALL 30 DAYS
    // =====================================================

    // =====================================================
// ALL 30 SUBSCRIPTION DAYS
// =====================================================

// =====================================================
// ACTUAL SUBSCRIPTION DAYS
// =====================================================

const allDays = Array.from(
  {
    length: totalSubscriptionDays,
  },
  (_, index) => index + 1
);

    // =====================================================
    // VIEW ALL STATE
    // =====================================================

    const isShowingAll =
      showAllMenu[
        subscription.id
      ] === true;

    // =====================================================
    // DEFAULT = TODAY + NEXT 6 DAYS
    // VIEW ALL = COMPLETE 30 DAYS
    // =====================================================

    const visibleDays =
      isShowingAll
        ? allDays
        : allDays.filter(
            (dayNumber) =>
              dayNumber >=
                safeCurrentDay &&
              dayNumber <
                safeCurrentDay + 7
          );

    // =====================================================
    // TODAY MEALS
    // =====================================================

    const todayItems =
      menuCycle.filter(
        (item) =>
          Number(
            item.day_number
          ) === safeCurrentDay
      );

    // =====================================================
    // COMING DAYS
    // =====================================================

    const comingDays =
      visibleDays.filter(
        (dayNumber) =>
          dayNumber !==
          safeCurrentDay
      );

    // =====================================================
    // MEAL ORDER
    // =====================================================

    const mealOrder = {
      breakfast: 1,
      lunch: 2,
      dinner: 3,
    };

    // =====================================================
    // DATE FOR SUBSCRIPTION DAY
    // =====================================================

    const getDateForDay = (
      dayNumber: number
    ) => {
      const date =
        new Date(
          startDate
        );

      date.setDate(
        startDate.getDate() +
          dayNumber -
          1
      );

      return date;
    };

    // =====================================================
    // VIEW DISH
    // =====================================================

    const handleViewDish = (
  item: SubscriptionMenuItem
) => {
  console.log("🔥 VIEW SUBSCRIPTION DISH:", item);

  if (!onViewDish) {
    console.warn(
      "❌ onViewDish callback missing"
    );
    return;
  }

  const menuDate = getDateForDay(
    Number(item.day_number)
  );

  const dish = {
    // -----------------------------------------
    // MAIN MENU DATA
    // -----------------------------------------
    id: item.menu_id,
    menu_id: item.menu_id,

    name:
      item.menu_name ||
      "Meal",

    description:
      item.menu_description ||
      "",

    price: Number(
      item.menu_price ?? 0
    ),

    image_url:
      item.menu_image ||
      null,

    // -----------------------------------------
    // SUBSCRIPTION MENU CONTEXT
    // -----------------------------------------
    meal_type:
      item.meal_type,

    menu_date:
      menuDate
        .toISOString()
        .split("T")[0],

    subscription_day:
      Number(item.day_number),

    // -----------------------------------------
    // IMPORTANT
    // -----------------------------------------
    type: "menu",

    // DishDetail expects these safely
    // even if backend doesn't provide them
    food_type: "veg",
    ingredients: [],
    remaining: 999,

    // Chef information
    chef_id:
      item.chef_id ||
      item.chefId ||
      undefined,

    chef_name:
      item.chef_name ||
      item.chefName ||
      "Chef",
  };

  console.log(
    "🔥 OPEN SUBSCRIPTION DISH:",
    dish
  );

  onViewDish(dish);
};

    // =====================================================
    // MEAL EMOJI
    // =====================================================

    const getMenuMealEmoji = (
      mealType: MealType
    ) => {

      if (
        mealType ===
        "breakfast"
      ) {
        return "☀️";
      }

      if (
        mealType ===
        "lunch"
      ) {
        return "🍱";
      }

      return "🌙";
    };

    // =====================================================
    // MENU ITEM
    // =====================================================

    // =====================================================
// MENU ITEM
// =====================================================

const renderMenuItem = (
  item: SubscriptionMenuItem,
  isToday = false
) => {
  // -----------------------------------------------------
  // SUBSCRIPTION FIXED CUTOFF TIMES
  // IMPORTANT:
  // Normal Menu ka cutoff yahan se fetch/use nahi hoga.
  // Subscription ke apne fixed cutoff hain:
  // Breakfast = 8:00 AM
  // Lunch     = 11:00 AM
  // Dinner    = 6:00 PM
  // -----------------------------------------------------

  const getSubscriptionCutoff = (
    mealType: MealType
  ) => {
    if (mealType === "breakfast") {
      return "8:00 AM";
    }

    if (mealType === "lunch") {
      return "11:00 AM";
    }

    return "6:00 PM";
  };

  const cutoffText =
    getSubscriptionCutoff(item.meal_type);

  return (
    <div
      key={item.id}
      className={`bg-white rounded-2xl border p-3 ${
        isToday
          ? "border-orange-300 shadow-md"
          : "border-gray-100"
      }`}
    >

      {/* =================================================
          IMAGE + INFO
      ================================================= */}

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
            {getMenuMealEmoji(
              item.meal_type
            )}
          </div>
        )}

        {/* INFO */}
        <div className="flex-1 min-w-0">

          {/* MEAL TYPE */}
          <div className="flex items-center gap-2">

            <p className="text-[10px] font-extrabold text-orange-600 uppercase">
              {getMenuMealEmoji(
                item.meal_type
              )}{" "}
              {item.meal_type}
            </p>

            {isToday && (
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[9px] font-extrabold">
                TODAY
              </span>
            )}

          </div>

          {/* MENU NAME */}
          <h4 className="font-extrabold text-gray-900 mt-1">
            {item.menu_name || "Meal"}
          </h4>

          {/* DESCRIPTION */}
          {item.menu_description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {item.menu_description}
            </p>
          )}

          {/* SUBSCRIPTION PRICE */}
          {item.menu_price != null && (
            <p className="text-xs font-bold text-gray-500 mt-1">
              ₹{item.menu_price}
            </p>
          )}

          {/* =================================================
              SUBSCRIPTION CUTOFF
          ================================================= */}

          <p className="text-[11px] text-gray-400 mt-1">
            Cutoff: {cutoffText}
          </p>

        </div>
      </div>

      {/* =================================================
          VIEW DETAILS
      ================================================= */}

      <button
        type="button"
        onClick={() =>
          handleViewDish(item)
        }
        className="w-full mt-3 py-2.5 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 text-xs font-extrabold active:scale-[0.98] transition"
      >
        View Details →
      </button>

    </div>
  );
};

    // =====================================================
    // RENDER SUBSCRIPTION MENU
    // =====================================================

    return (
      <div className="mt-6 pt-5 border-t border-gray-100">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-5">

          <div>

            <h3 className="text-lg font-extrabold text-gray-900">

              Subscription Menu

            </h3>

            <p className="text-xs text-gray-400 mt-1">
  {isShowingAll
    ? `Complete ${totalSubscriptionDays}-day subscription menu`
    : "Today + next 6 days"}
</p>

          </div>

          <Utensils
            size={19}
            className="text-orange-500"
          />

        </div>

        {/* =================================================
            TODAY
        ================================================= */}

        {!isShowingAll && (

          <section className="mb-6">

            <div className="flex items-center gap-2 mb-3">

              <span className="text-lg">
                ⭐
              </span>

              <h4 className="font-extrabold text-gray-900">

                Today

              </h4>

              <span className="text-xs text-gray-400">

                {formatDate(
                  getDateForDay(
                    safeCurrentDay
                  )
                )}

              </span>

            </div>

            {todayItems.length > 0 ? (

              <div className="space-y-3">

                {todayItems
                  .slice()
                  .sort(
                    (a, b) =>
                      mealOrder[
                        a.meal_type
                      ] -
                      mealOrder[
                        b.meal_type
                      ]
                  )
                  .map(
                    (item) =>
                      renderMenuItem(
                        item,
                        true
                      )
                  )}

              </div>

            ) : (

              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-500">
  Today's menu is not available yet.
</div>

            )}

          </section>

        )}

        {/* =================================================
            COMING
        ================================================= */}

        {!isShowingAll && (

          <section>

            <div className="flex items-center gap-2 mb-3">

              <span className="text-lg">
                📅
              </span>

              <h4 className="font-extrabold text-gray-900">

                Coming

              </h4>

              <span className="text-xs text-gray-400">
  {comingDays.length} upcoming days
</span>

            </div>

            {comingDays.length > 0 ? (

              <div className="space-y-4">

                {comingDays.map(
                  (dayNumber) => {

                    const date =
                      getDateForDay(
                        dayNumber
                      );

                    const dayMeals =
                      menuCycle
                        .filter(
                          (item) =>
                            Number(
                              item.day_number
                            ) ===
                            dayNumber
                        )
                        .sort(
                          (a, b) =>
                            mealOrder[
                              a.meal_type
                            ] -
                            mealOrder[
                              b.meal_type
                            ]
                        );

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

                            Day{" "}
                            {dayNumber}

                          </p>

                          <p className="text-xs text-gray-400 mt-1">

                            {formatFullDate(
                              date
                            )}

                          </p>

                        </div>

                        {/* MEALS */}

<div className="p-3 space-y-3">
  {dayMeals.length > 0 ? (
    dayMeals.map((item) =>
      renderMenuItem(item)
    )
  ) : (
    <div className="rounded-2xl bg-white border border-gray-100 p-4 text-sm text-gray-400">
      Menu not available yet.
    </div>
  )}
</div>

                      </div>

                    );
                  }
                )}

              </div>

            ) : (

              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-500">

                No upcoming meals.

              </div>

            )}

          </section>

        )}

        {/* =================================================
            FULL 30 DAYS
        ================================================= */}

        {isShowingAll && (

          <section>

            <div className="flex items-center justify-between mb-4">

              <div>

                <h4 className="font-extrabold text-gray-900">
  Full Subscription Menu
</h4>

                <p className="text-xs text-gray-400 mt-1">

                  Day{" "}
                  {safeCurrentDay}{" "}
                  is today

                </p>

              </div>

              <span className="text-xs font-bold text-orange-500">
  {totalSubscriptionDays} Days
</span>

            </div>

            <div className="space-y-4">

              {allDays.map(
                (dayNumber) => {

                  const date =
                    getDateForDay(
                      dayNumber
                    );

                  const isToday =
                    dayNumber ===
                    safeCurrentDay;

                  const dayMeals =
                    menuCycle
                      .filter(
                        (item) =>
                          Number(
                            item.day_number
                          ) ===
                          dayNumber
                      )
                      .sort(
                        (a, b) =>
                          mealOrder[
                            a.meal_type
                          ] -
                          mealOrder[
                            b.meal_type
                          ]
                      );

                  return (

                    <div
                      key={dayNumber}
                      className={`rounded-3xl overflow-hidden border ${
                        isToday
                          ? "border-orange-300 shadow-md"
                          : "border-gray-100"
                      } bg-gray-50`}
                    >

                      {/* DAY HEADER */}

                      <div
                        className={`px-4 py-3 border-b ${
                          isToday
                            ? "bg-orange-50 border-orange-100"
                            : "bg-white border-gray-100"
                        }`}
                      >

                        <div className="flex items-center gap-2">

                          <p className="text-xs text-orange-500 font-extrabold uppercase">

                            Subscription Day

                          </p>

                          {isToday && (

                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-500 text-white font-extrabold">

                              TODAY

                            </span>

                          )}

                        </div>

                        <p className="text-lg font-extrabold text-gray-900 mt-1">

                          Day{" "}
                          {dayNumber}

                        </p>

                        <p className="text-xs text-gray-400 mt-1">

                          {formatFullDate(
                            date
                          )}

                        </p>

                      </div>

                      {/* MEALS */}

                      <div className="p-3 space-y-3">
  {dayMeals.length > 0 ? (
    dayMeals.map((item) =>
      renderMenuItem(
        item,
        isToday
      )
    )
  ) : (
    <div className="rounded-2xl bg-white border border-gray-100 p-4 text-sm text-gray-400">
      Menu not available yet.
    </div>
  )}
</div>

                    </div>

                  );
                }
              )}

            </div>

          </section>

        )}

        {/* =================================================
            VIEW ALL / SHOW LESS
        ================================================= */}

        {allDays.length > 7 && (

          <button
            type="button"
            onClick={() =>
              setShowAllMenu(
                (previous) => ({
                  ...previous,
                  [subscription.id]:
                    !previous[
                      subscription.id
                    ],
                })
              )
            }
            className="w-full mt-5 py-3.5 rounded-2xl bg-orange-50 border border-orange-100 text-orange-600 font-extrabold text-sm active:scale-[0.98] transition"
          >

            {isShowingAll
  ? "← Show 7-Day View"
  : `View All ${totalSubscriptionDays} Days →`}

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
                  {renderMealCard(
                    sub,
                    "breakfast"
                  )}
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