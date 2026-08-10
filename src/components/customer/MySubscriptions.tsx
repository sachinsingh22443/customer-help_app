import { useEffect, useState } from "react";

import { Checkout as RazorpayCheckout } from "capacitor-razorpay";
import {
  ArrowLeft,
  Crown,
  Calendar,
  Clock,
  Plus,
  Wallet,
  History,
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
}

interface Props {
  onBack: () => void;
}


export default function MySubscriptions({
  onBack,
}: Props) {
  const [subscriptions, setSubscriptions] =
  useState<Subscription[]>([]);

  const [walletBalance, setWalletBalance] =
  useState<number>(0);

const [walletTransactions, setWalletTransactions] =
  useState<WalletTransaction[]>([]);

const [walletLoading, setWalletLoading] =
  useState(false);

const [walletHistoryOpen, setWalletHistoryOpen] =
  useState(false);

const [walletFromDate, setWalletFromDate] =
  useState("");

const [walletToDate, setWalletToDate] =
  useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

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

          const meals: MealSchedule[] =
            await mealRes.json();

          return {
            ...sub,
            meals,
          };
        } catch (error) {
          console.error(
            `Failed to load today's meals for ${sub.id}`,
            error
          );

          return {
            ...sub,
            meals: [],
          };
        }
      })
    );

    setSubscriptions(subscriptionsWithMeals);
  } catch (error) {
    console.error(
      "Failed to load subscriptions",
      error
    );
  }
};






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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.detail ||
          "Failed to load wallet history"
      );
    }

    setWalletBalance(data.balance || 0);
    setWalletTransactions(
      data.transactions || []
    );
  } catch (error: any) {
    console.error(
      "WALLET HISTORY ERROR:",
      error
    );

    alert(
      error?.message ||
        "Failed to load wallet history"
    );
  } finally {
    setWalletLoading(false);
  }
};

const getTransactionTitle = (
  transaction: WalletTransaction
) => {
  if (transaction.description) {
    return transaction.description;
  }

  if (transaction.meal_type) {
    return (
      transaction.meal_type
        .charAt(0)
        .toUpperCase() +
      transaction.meal_type.slice(1)
    );
  }

  return transaction.transaction_type;
};

  const handleAddBreakfast = async (
  subscription: Subscription
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    // =========================================
    // CREATE BREAKFAST PAYMENT
    // =========================================

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
        paymentData.detail ||
        "Unable to create breakfast payment"
      );
    }

    // =========================================
    // SHOW PAYMENT
    // =========================================

    const result =
      await RazorpayCheckout.open({
        key: paymentData.key,

        amount: String(
          paymentData.amount
        ),

        currency: "INR",

        name: "Eat Unity",

        description:
          "Breakfast Add-on",

        order_id:
          paymentData.razorpay_order_id,
      });

    const response = result.response;

    // =========================================
    // VERIFY PAYMENT
    // =========================================

    const verifyRes = await fetch(
      "https://chef-backend-qh12.onrender.com/subscriptions/breakfast/verify-payment",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          subscription_id:
            subscription.id,

          razorpay_order_id:
            response.razorpay_order_id,

          razorpay_payment_id:
            response.razorpay_payment_id,

          razorpay_signature:
            response.razorpay_signature,
        }),
      }
    );

    const verifyData =
      await verifyRes.json();

    if (!verifyRes.ok) {
      throw new Error(
        verifyData.detail ||
        "Breakfast payment verification failed"
      );
    }

    // =========================================
    // SUCCESS
    // =========================================

    alert(
      "Breakfast added successfully 🎉"
    );

    // Refresh subscriptions
    await fetchSubscriptions();

  } catch (error: any) {

    console.error(
      "BREAKFAST PAYMENT ERROR:",
      error
    );

    alert(
      error?.message ||
      "Breakfast payment failed"
    );
  }
};


const handleMealToggle = async (
  subscriptionId: string,
  mealType: "breakfast" | "lunch" | "dinner",
  currentStatus: "on" | "off"
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const action = currentStatus === "on" ? "off" : "on";

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

    alert(data.message);

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
  }
};


const getMeal = (
  subscription: Subscription,
  mealType: "breakfast" | "lunch" | "dinner"
) => {
  return subscription.meals?.find(
    (meal) => meal.meal_type === mealType
  );
};

  

  
  return (
  <div className="px-6 pb-24">

    {/* ================================= */}
    {/* HEADER */}
    {/* ================================= */}

    <div className="flex items-center gap-3 mb-8">

      <button
        onClick={onBack}
        className="h-11 w-11 flex items-center justify-center rounded-full bg-white shadow-md"
      >
        <ArrowLeft size={20} />
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          My Subscriptions
        </h1>

        <p className="text-sm text-gray-500">
          Manage your meal plans
        </p>
      </div>

    </div>


    {/* ================================= */}
    {/* EMPTY STATE */}
    {/* ================================= */}

    {subscriptions.length === 0 ? (

      <div className="bg-white rounded-3xl p-10 shadow-lg text-center">

        <div className="h-20 w-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">

          <Crown
            size={36}
            className="text-orange-500"
          />

        </div>

        <h2 className="text-xl font-bold mb-2">
          No Active Subscription
        </h2>

        <p className="text-gray-500">
          Subscribe to a meal plan and enjoy
          delicious food every day.
        </p>

      </div>

    ) : (

      /* ================================= */
      /* SUBSCRIPTIONS */
      /* ================================= */

      <div className="space-y-5">

        {subscriptions.map((sub) => (

          <div
            key={sub.id}
            className="relative overflow-hidden rounded-3xl bg-white shadow-xl border border-orange-100"
          >

            {/* TOP GRADIENT */}

            <div className="bg-gradient-to-r from-orange-500 to-red-500 h-3" />

            <div className="p-5">

              {/* ================================= */}
              {/* HEADER */}
              {/* ================================= */}

              <div className="flex justify-between items-start mb-5">

                <div>

                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">

                    <Crown
                      size={18}
                      className="text-yellow-500"
                    />

                    {sub.plan}

                  </h2>

                  {sub.chefName && (

                    <p className="text-sm font-semibold text-orange-600 mt-2">
                      👨‍🍳 {sub.chefName}
                    </p>

                  )}

                </div>


                {/* STATUS */}

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    sub.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {sub.status?.charAt(0).toUpperCase() +
                    sub.status?.slice(1)}
                </span>

              </div>


              {/* ================================= */}
              {/* DETAILS */}
              {/* ================================= */}

              <div className="space-y-3">

                {/* START DATE */}

                <div className="flex items-center gap-3">

                  <Calendar
                    size={18}
                    className="text-blue-500"
                  />

                  <span className="text-gray-700">
                    Start Date: {sub.startDate}
                  </span>

                </div>


                {/* END DATE */}

                <div className="flex items-center gap-3">

                  <Calendar
                    size={18}
                    className="text-green-500"
                  />

                  <span className="text-gray-700">
                    End Date: {sub.endDate}
                  </span>

                </div>


                {/* DELIVERY TIME */}

                <div className="flex items-center gap-3">

                  <Clock
                    size={18}
                    className="text-purple-500"
                  />

                  <span className="text-gray-700">
                    Delivery Time: {sub.time}
                  </span>

                </div>

              </div>


              {/* ================================= */}
              {/* SUBSCRIPTION AMOUNT */}
              {/* ================================= */}

              <div className="mt-5 border-t pt-4 flex justify-between items-center">

                <span className="text-gray-500">
                  Subscription Amount
                </span>

                <span className="font-bold text-lg text-orange-600">
                  ₹{sub.price}
                </span>

              </div>


              {/* ================================= */}
              {/* MEAL MANAGEMENT */}
              {/* ================================= */}

              <div className="mt-5 border-t pt-5">

                <h3 className="font-semibold text-gray-900 mb-3">
                  Today's Meals
                </h3>


                {/* ================================= */}
                {/* LUNCH */}
                {/* ================================= */}

                {(() => {

                  const meal = getMeal(
                    sub,
                    "lunch"
                  );

                  if (!meal) {

                    return (
                      <div className="p-3 bg-gray-50 rounded-xl mb-2">

                        <div>

                          <p className="font-medium text-gray-900">
                            Lunch
                          </p>

                          <p className="text-xs text-gray-500">
                            Not scheduled today
                          </p>

                        </div>

                      </div>
                    );

                  }

                  const cutoffPassed =
                    new Date() >=
                    new Date(meal.cutoff_at);

                  return (

                    <div
                      className={`flex items-center justify-between p-3 rounded-xl mb-2 ${
                        meal.status === "on"
                          ? "bg-green-50"
                          : "bg-gray-50"
                      }`}
                    >

                      <div>

                        <p className="font-medium text-gray-900">
                          Lunch
                        </p>

                        <p className="text-xs text-gray-500">
                          ₹{meal.meal_price}/day
                        </p>

                        <p
                          className={`text-xs mt-1 ${
                            cutoffPassed
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {cutoffPassed
                            ? "Cutoff time passed"
                            : "Cutoff: 10:00 AM"}
                        </p>

                      </div>


                      <button
                        disabled={cutoffPassed}
                        onClick={() =>
                          handleMealToggle(
                            sub.id,
                            "lunch",
                            meal.status
                          )
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                          meal.status === "on"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        } ${
                          cutoffPassed
                            ? "opacity-50 cursor-not-allowed"
                            : "active:scale-95"
                        }`}
                      >
                        {meal.status === "on"
                          ? "ON"
                          : "OFF"}
                      </button>

                    </div>

                  );

                })()}


                {/* ================================= */}
                {/* DINNER */}
                {/* ================================= */}

                {(() => {

                  const meal = getMeal(
                    sub,
                    "dinner"
                  );

                  if (!meal) {

                    return (
                      <div className="p-3 bg-gray-50 rounded-xl mb-2">

                        <div>

                          <p className="font-medium text-gray-900">
                            Dinner
                          </p>

                          <p className="text-xs text-gray-500">
                            Not scheduled today
                          </p>

                        </div>

                      </div>
                    );

                  }

                  const cutoffPassed =
                    new Date() >=
                    new Date(meal.cutoff_at);

                  return (

                    <div
                      className={`flex items-center justify-between p-3 rounded-xl mb-2 ${
                        meal.status === "on"
                          ? "bg-green-50"
                          : "bg-gray-50"
                      }`}
                    >

                      <div>

                        <p className="font-medium text-gray-900">
                          Dinner
                        </p>

                        <p className="text-xs text-gray-500">
                          ₹{meal.meal_price}/day
                        </p>

                        <p
                          className={`text-xs mt-1 ${
                            cutoffPassed
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {cutoffPassed
                            ? "Cutoff time passed"
                            : "Cutoff: 5:00 PM"}
                        </p>

                      </div>


                      <button
                        disabled={cutoffPassed}
                        onClick={() =>
                          handleMealToggle(
                            sub.id,
                            "dinner",
                            meal.status
                          )
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                          meal.status === "on"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        } ${
                          cutoffPassed
                            ? "opacity-50 cursor-not-allowed"
                            : "active:scale-95"
                        }`}
                      >
                        {meal.status === "on"
                          ? "ON"
                          : "OFF"}
                      </button>

                    </div>

                  );

                })()}


                {/* ================================= */}
                {/* BREAKFAST */}
                {/* ================================= */}

                {sub.breakfast_enabled ? (

                  (() => {

                    const meal = getMeal(
                      sub,
                      "breakfast"
                    );

                    if (!meal) {

                      return (
                        <div className="p-3 bg-gray-50 rounded-xl">

                          <div>

                            <p className="font-medium text-gray-900">
                              Breakfast
                            </p>

                            <p className="text-xs text-gray-500">
                              Not scheduled today
                            </p>

                          </div>

                        </div>
                      );

                    }

                    const cutoffPassed =
                      new Date() >=
                      new Date(meal.cutoff_at);

                    return (

                      <div
                        className={`flex items-center justify-between p-3 rounded-xl ${
                          meal.status === "on"
                            ? "bg-orange-50"
                            : "bg-gray-50"
                        }`}
                      >

                        <div>

                          <p className="font-medium text-gray-900">
                            Breakfast
                          </p>

                          <p className="text-xs text-green-600">
                            ₹{meal.meal_price}/day
                          </p>

                          <p
                            className={`text-xs mt-1 ${
                              cutoffPassed
                                ? "text-red-500"
                                : "text-gray-500"
                            }`}
                          >
                            {cutoffPassed
                              ? "Cutoff time passed"
                              : "Cutoff: 8:00 AM"}
                          </p>

                        </div>


                        <button
                          disabled={cutoffPassed}
                          onClick={() =>
                            handleMealToggle(
                              sub.id,
                              "breakfast",
                              meal.status
                            )
                          }
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                            meal.status === "on"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-700"
                          } ${
                            cutoffPassed
                              ? "opacity-50 cursor-not-allowed"
                              : "active:scale-95"
                          }`}
                        >
                          {meal.status === "on"
                            ? "ON"
                            : "OFF"}
                        </button>

                      </div>

                    );

                  })()

                ) : (

                  /* ================================= */
                  /* BREAKFAST NOT INCLUDED */
                  /* ================================= */

                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">

                    <div>

                      <p className="font-medium text-gray-900">
                        Breakfast
                      </p>

                      <p className="text-xs text-gray-500">
                        Not included
                      </p>

                    </div>


                    <button
                      onClick={() =>
                        handleAddBreakfast(sub)
                      }
                      className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold flex items-center gap-1"
                    >

                      <Plus size={16} />

                      Add

                    </button>

                  </div>

                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    )}


    {/* ================================= */}
    {/* WALLET */}
    {/* ================================= */}

    <div className="mt-8 bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">

      {/* WALLET HEADER */}

      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5 text-white">

        <div className="flex items-center gap-3">

          <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">

            <Wallet size={24} />

          </div>

          <div>

            <p className="text-sm text-white/80">
              Wallet Balance
            </p>

            <h2 className="text-2xl font-bold">
              ₹{walletBalance.toFixed(2)}
            </h2>

          </div>

        </div>

      </div>


      {/* WALLET HISTORY BUTTON */}

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
          className="w-full flex items-center justify-between p-4 bg-orange-50 rounded-2xl"
        >

          <div className="flex items-center gap-3">

            <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center">

              <History
                size={20}
                className="text-orange-600"
              />

            </div>

            <div className="text-left">

              <p className="font-semibold text-gray-900">
                Wallet History
              </p>

              <p className="text-xs text-gray-500">
                View wallet transactions
              </p>

            </div>

          </div>

          <span className="text-orange-600 font-semibold">
            {walletHistoryOpen
              ? "Hide"
              : "View"}
          </span>

        </button>


        {/* ================================= */}
        {/* WALLET HISTORY */}
        {/* ================================= */}

        {walletHistoryOpen && (

          <div className="mt-5">

            {/* DATE FILTER */}

            <div className="bg-gray-50 rounded-2xl p-4">

              <h3 className="font-semibold text-gray-900 mb-3">
                Filter History
              </h3>


              {/* FROM DATE */}

              <div className="mb-3">

                <label className="text-xs text-gray-500 block mb-1">
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
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2"
                />

              </div>


              {/* TO DATE */}

              <div className="mb-3">

                <label className="text-xs text-gray-500 block mb-1">
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
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2"
                />

              </div>


              {/* VIEW HISTORY */}

              <button
                onClick={() =>
                  fetchWalletHistory(
                    walletFromDate || undefined,
                    walletToDate || undefined
                  )
                }
                disabled={walletLoading}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
              >

                {walletLoading
                  ? "Loading..."
                  : "View History"}

              </button>


              {/* CLEAR DATE FILTER */}

              {(walletFromDate ||
                walletToDate) && (

                <button
                  onClick={() => {

                    setWalletFromDate("");
                    setWalletToDate("");

                    fetchWalletHistory();

                  }}
                  className="w-full text-sm text-gray-500 py-2"
                >
                  Clear Date Filter
                </button>

              )}

            </div>


            {/* ================================= */}
            {/* TRANSACTIONS */}
            {/* ================================= */}

            <div className="mt-5">

              <h3 className="font-semibold text-gray-900 mb-3">
                Transactions
              </h3>


              {walletLoading ? (

                <div className="text-center py-6 text-gray-500">
                  Loading wallet history...
                </div>

              ) : walletTransactions.length === 0 ? (

                <div className="bg-gray-50 rounded-2xl p-6 text-center">

                  <Wallet
                    size={32}
                    className="mx-auto text-gray-400 mb-2"
                  />

                  <p className="text-gray-500">
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
                          className="bg-gray-50 rounded-2xl p-4"
                        >

                          <div className="flex justify-between items-start gap-3">

                            <div>

                              <p className="font-semibold text-gray-900">
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
                              className={`font-bold ${
                                isCredit
                                  ? "text-green-600"
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