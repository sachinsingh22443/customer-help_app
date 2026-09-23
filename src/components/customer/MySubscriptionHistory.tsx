import { useEffect, useState } from "react";
import {
  ArrowLeft,
  History,
  CalendarDays,
  Clock,
  Crown,
  Search,
  X,
} from "lucide-react";

interface Props {
  onBack: () => void;
}

interface Subscription {
  id: string;
  plan?: string;
  plan_name?: string;
  plan_type?: string;

  chefName?: string;
  chef_name?: string;

  price?: number;

  breakfast_enabled?: boolean;
  breakfast_price?: number;

  startDate?: string;
  endDate?: string;

  start_date?: string;
  end_date?: string;

  time?: string;
  status?: string;

  customer_name?: string;
  dish_name?: string;

  meals_per_day?: number;
}

type FilterType =
  | "all"
  | "today"
  | "yesterday"
  | "last7"
  | "month"
  | "specific"
  | "custom";

export default function MySubscriptionHistory({
  onBack,
}: Props) {
  const [subscriptions, setSubscriptions] = useState<
    Subscription[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FILTER
  const [filter, setFilter] =
    useState<FilterType>("all");

  const [specificDate, setSpecificDate] =
    useState("");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [showCustom, setShowCustom] =
    useState(false);

  // =========================================================
  // DATE HELPERS
  // =========================================================

  const getLocalDateString = (
    date: Date
  ) => {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getFilterDates = () => {
    const today = new Date();

    const todayString =
      getLocalDateString(today);

    // ALL
    if (filter === "all") {
      return {
        specific_date: "",
        from_date: "",
        to_date: "",
      };
    }

    // TODAY
    if (filter === "today") {
      return {
        specific_date: todayString,
        from_date: "",
        to_date: "",
      };
    }

    // YESTERDAY
    if (filter === "yesterday") {
      const yesterday = new Date(today);

      yesterday.setDate(
        yesterday.getDate() - 1
      );

      return {
        specific_date:
          getLocalDateString(yesterday),
        from_date: "",
        to_date: "",
      };
    }

    // LAST 7 DAYS
    if (filter === "last7") {
      const start = new Date(today);

      start.setDate(
        start.getDate() - 6
      );

      return {
        specific_date: "",
        from_date:
          getLocalDateString(start),
        to_date: todayString,
      };
    }

    // THIS MONTH
    if (filter === "month") {
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      return {
        specific_date: "",
        from_date:
          getLocalDateString(start),
        to_date: todayString,
      };
    }

    // SPECIFIC DATE
    if (filter === "specific") {
      return {
        specific_date: specificDate,
        from_date: "",
        to_date: "",
      };
    }

    // CUSTOM
    if (filter === "custom") {
      return {
        specific_date: "",
        from_date: fromDate,
        to_date: toDate,
      };
    }

    return {
      specific_date: "",
      from_date: "",
      to_date: "",
    };
  };

  // =========================================================
  // FETCH HISTORY
  // =========================================================

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      // SAME API AS MY SUBSCRIPTIONS
      const API =
        "https://chef-backend-qh12.onrender.com";

      const dates =
        getFilterDates();

      const params =
        new URLSearchParams();

      params.set("page", "1");
      params.set("limit", "50");

      if (dates.specific_date) {
        params.set(
          "specific_date",
          dates.specific_date
        );
      }

      if (dates.from_date) {
        params.set(
          "from_date",
          dates.from_date
        );
      }

      if (dates.to_date) {
        params.set(
          "to_date",
          dates.to_date
        );
      }

      const url =
        `${API}/subscriptions/my-history?${params.toString()}`;

      console.log(
        "SUBSCRIPTION HISTORY URL:",
        url
      );

      const response = await fetch(
        url,
        {
          method: "GET",
          headers: {
            Accept:
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      const rawText =
        await response.text();

      console.log(
        "SUBSCRIPTION HISTORY STATUS:",
        response.status
      );

      console.log(
        "SUBSCRIPTION HISTORY RESPONSE:",
        rawText
      );

      if (!response.ok) {
        throw new Error(
          `Subscription history API failed: ${response.status}`
        );
      }

      if (
        !contentType.includes(
          "application/json"
        )
      ) {
        throw new Error(
          "Subscription history returned non-JSON response."
        );
      }

      const data =
        JSON.parse(rawText);

      console.log(
        "SUBSCRIPTION HISTORY DATA:",
        data
      );

      let history: Subscription[] =
        [];

      if (Array.isArray(data)) {
        history = data;
      } else if (
        Array.isArray(data?.items)
      ) {
        history = data.items;
      } else if (
        Array.isArray(
          data?.subscriptions
        )
      ) {
        history =
          data.subscriptions;
      }

      setSubscriptions(history);
    } catch (err: any) {
      console.error(
        "Subscription history error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load subscription history."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchHistory();
  }, []);

  // =========================================================
  // APPLY FILTER
  // =========================================================

  const applyFilter = (
    type: FilterType
  ) => {
    setFilter(type);

    if (type !== "custom") {
      setShowCustom(false);
    }

    if (type === "custom") {
      setShowCustom(true);
      return;
    }

    if (
      type === "specific" &&
      !specificDate
    ) {
      return;
    }

    setTimeout(() => {
      fetchHistory();
    }, 0);
  };

  // =========================================================
  // SPECIFIC DATE
  // =========================================================

  const handleSpecificDate =
    (value: string) => {
      setSpecificDate(value);

      if (!value) {
        return;
      }

      setFilter("specific");
      setShowCustom(false);

      setTimeout(() => {
        fetchHistory();
      }, 0);
    };

  // =========================================================
  // CUSTOM DATE
  // =========================================================

  const applyCustomDate = () => {
    if (!fromDate || !toDate) {
      setError(
        "Please select both From Date and To Date."
      );
      return;
    }

    if (fromDate > toDate) {
      setError(
        "From Date cannot be after To Date."
      );
      return;
    }

    setError("");
    setFilter("custom");
    setShowCustom(true);

    setTimeout(() => {
      fetchHistory();
    }, 0);
  };

  // =========================================================
  // CLEAR FILTER
  // =========================================================

  const clearFilter = () => {
    setFilter("all");
    setSpecificDate("");
    setFromDate("");
    setToDate("");
    setShowCustom(false);

    setTimeout(() => {
      fetchHistory();
    }, 0);
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "-";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "-";
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // PLAN NAME
  // =========================================================

  const getPlanName = (
    subscription: Subscription
  ) => {
    return (
      subscription.plan ||
      subscription.plan_name ||
      subscription.dish_name ||
      "Subscription"
    );
  };

  // =========================================================
  // START DATE
  // =========================================================

  const getStartDate = (
    subscription: Subscription
  ) => {
    return (
      subscription.startDate ||
      subscription.start_date
    );
  };

  // =========================================================
  // END DATE
  // =========================================================

  const getEndDate = (
    subscription: Subscription
  ) => {
    return (
      subscription.endDate ||
      subscription.end_date
    );
  };

  // =========================================================
  // DURATION
  // =========================================================

  const getDuration = (
    subscription: Subscription
  ) => {
    const start =
      getStartDate(subscription);

    const end =
      getEndDate(subscription);

    if (!start || !end) {
      return null;
    }

    const startDate =
      new Date(start);

    const endDate =
      new Date(end);

    if (
      Number.isNaN(
        startDate.getTime()
      ) ||
      Number.isNaN(
        endDate.getTime()
      )
    ) {
      return null;
    }

    const diff =
      endDate.getTime() -
      startDate.getTime();

    return (
      Math.floor(
        diff /
          (1000 *
            60 *
            60 *
            24)
      ) + 1
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] px-4 sm:px-6 pb-28">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative overflow-hidden rounded-b-[32px] bg-gradient-to-br from-[#FF7A30] via-[#FF4D4D] to-[#7C3AED] px-5 pt-5 pb-7 mb-5 shadow-[0_15px_40px_rgba(255,90,31,0.20)]">

        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10" />

        <div className="absolute -left-12 bottom-[-60px] h-36 w-36 rounded-full bg-white/10" />

        <div className="relative flex items-center gap-3">

          <button
            type="button"
            onClick={onBack}
            className="h-12 w-12 shrink-0 rounded-2xl bg-white/95 flex items-center justify-center shadow-lg active:scale-95 transition"
          >
            <ArrowLeft
              size={22}
              className="text-gray-900"
            />
          </button>

          <div className="min-w-0 flex-1">

            <div className="flex items-center gap-2">

              <History
                size={22}
                className="text-yellow-300 shrink-0"
              />

              <h1 className="text-[21px] font-extrabold text-white truncate">
                Subscription History
              </h1>

            </div>

            <p className="text-sm text-white/80 mt-1">
              View your previous plans
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          FILTER CARD
      ===================================================== */}

      <div className="max-w-3xl mx-auto mb-6">

        <div className="rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-orange-100">

          <div className="flex items-center justify-between mb-3">

            <div className="flex items-center gap-2">

              <Search
                size={18}
                className="text-orange-500"
              />

              <h2 className="font-extrabold text-gray-900">
                Filter History
              </h2>

            </div>

            {filter !== "all" && (
              <button
                type="button"
                onClick={clearFilter}
                className="flex items-center gap-1 text-xs font-bold text-red-500"
              >
                <X size={14} />
                Clear
              </button>
            )}

          </div>

          {/* QUICK FILTERS */}

          <div className="flex gap-2 overflow-x-auto pb-2">

            <button
              type="button"
              onClick={() =>
                applyFilter("all")
              }
              className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${
                filter === "all"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-orange-50 text-orange-600"
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() =>
                applyFilter("today")
              }
              className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${
                filter === "today"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-orange-50 text-orange-600"
              }`}
            >
              Today
            </button>

            <button
              type="button"
              onClick={() =>
                applyFilter(
                  "yesterday"
                )
              }
              className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${
                filter === "yesterday"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-orange-50 text-orange-600"
              }`}
            >
              Yesterday
            </button>

            <button
              type="button"
              onClick={() =>
                applyFilter("last7")
              }
              className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${
                filter === "last7"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-orange-50 text-orange-600"
              }`}
            >
              Last 7 Days
            </button>

            <button
              type="button"
              onClick={() =>
                applyFilter("month")
              }
              className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${
                filter === "month"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-orange-50 text-orange-600"
              }`}
            >
              This Month
            </button>

            <button
              type="button"
              onClick={() =>
                applyFilter("custom")
              }
              className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${
                filter === "custom"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-orange-50 text-orange-600"
              }`}
            >
              Custom
            </button>

          </div>

          {/* SPECIFIC DATE */}

          <div className="mt-4">

            <label className="block text-xs font-extrabold text-gray-600 mb-2">
              Specific Date
            </label>

            <div className="relative">

              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none"
              />

              <input
                type="date"
                value={specificDate}
                onChange={(e) =>
                  handleSpecificDate(
                    e.target.value
                  )
                }
                className="w-full h-12 pl-10 pr-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />

            </div>

          </div>

          {/* CUSTOM DATE RANGE */}

          {showCustom && (
            <div className="mt-4 p-4 rounded-2xl bg-orange-50 border border-orange-100">

              <p className="text-xs font-extrabold text-orange-700 mb-3">
                Custom Date Range
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div>

                  <label className="block text-[11px] font-bold text-gray-500 mb-1">
                    From Date
                  </label>

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) =>
                      setFromDate(
                        e.target.value
                      )
                    }
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold outline-none focus:border-orange-400"
                  />

                </div>

                <div>

                  <label className="block text-[11px] font-bold text-gray-500 mb-1">
                    To Date
                  </label>

                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) =>
                      setToDate(
                        e.target.value
                      )
                    }
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold outline-none focus:border-orange-400"
                  />

                </div>

              </div>

              <button
                type="button"
                onClick={applyCustomDate}
                className="w-full mt-3 h-11 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-extrabold shadow-md active:scale-[0.98] transition"
              >
                Apply Date Range
              </button>

            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          HISTORY CONTENT
      ===================================================== */}

      <div className="max-w-3xl mx-auto">

        {/* LOADING */}

        {loading && (
          <div className="flex items-center justify-center py-16">

            <div className="h-10 w-10 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />

          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="rounded-3xl bg-white p-6 shadow-sm text-center">

            <p className="text-red-500 font-semibold text-sm">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchHistory}
              className="mt-4 px-5 py-3 rounded-2xl bg-orange-500 text-white font-bold active:scale-95 transition"
            >
              Try Again
            </button>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          subscriptions.length === 0 && (
            <div className="rounded-3xl bg-white p-8 shadow-sm text-center">

              <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center">

                <History
                  size={30}
                  className="text-orange-500"
                />

              </div>

              <h2 className="text-lg font-extrabold text-gray-900">
                No Subscription History
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                No subscriptions found
                for the selected date/filter.
              </p>

            </div>
          )}

        {/* HISTORY LIST */}

        {!loading &&
          !error &&
          subscriptions.length > 0 && (

            <div className="space-y-4">

              {/* RESULT COUNT */}

              <div className="flex items-center justify-between px-1">

                <p className="text-sm font-extrabold text-gray-800">
                  {subscriptions.length}{" "}
                  subscription
                  {subscriptions.length !==
                  1
                    ? "s"
                    : ""}
                </p>

                {filter !== "all" && (
                  <p className="text-xs text-orange-600 font-bold">
                    Filter applied
                  </p>
                )}

              </div>

              {subscriptions.map(
                (subscription) => {

                  const duration =
                    getDuration(
                      subscription
                    );

                  return (
                    <div
                      key={
                        subscription.id
                      }
                      className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                    >

                      {/* TOP */}

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex items-start gap-3 min-w-0">

                          <div className="h-12 w-12 shrink-0 rounded-2xl bg-orange-50 flex items-center justify-center">

                            <Crown
                              size={22}
                              className="text-orange-500"
                              fill="currentColor"
                            />

                          </div>

                          <div className="min-w-0">

                            <h3 className="font-extrabold text-gray-900 truncate">
                              {getPlanName(
                                subscription
                              )}
                            </h3>

                            {duration && (
                              <p className="text-sm text-gray-500 mt-1">
                                {
                                  duration
                                }{" "}
                                Days
                              </p>
                            )}

                            {subscription.chefName && (
                              <p className="text-xs text-orange-600 font-semibold mt-1">
                                👨‍🍳{" "}
                                {
                                  subscription.chefName
                                }
                              </p>
                            )}

                          </div>

                        </div>

                        <span
                          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-extrabold ${
                            subscription.status ===
                            "active"
                              ? "bg-green-100 text-green-700"
                              : subscription.status ===
                                "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {subscription.status ||
                            "completed"}
                        </span>

                      </div>

                      {/* DATES */}

                      <div className="grid grid-cols-2 gap-3 mt-5">

                        <div className="rounded-2xl bg-gray-50 p-3">

                          <div className="flex items-center gap-2 text-gray-500">

                            <CalendarDays
                              size={16}
                            />

                            <span className="text-xs font-semibold">
                              Start Date
                            </span>

                          </div>

                          <p className="text-sm font-bold text-gray-900 mt-1">
                            {formatDate(
                              getStartDate(
                                subscription
                              )
                            )}
                          </p>

                        </div>

                        <div className="rounded-2xl bg-gray-50 p-3">

                          <div className="flex items-center gap-2 text-gray-500">

                            <CalendarDays
                              size={16}
                            />

                            <span className="text-xs font-semibold">
                              End Date
                            </span>

                          </div>

                          <p className="text-sm font-bold text-gray-900 mt-1">
                            {formatDate(
                              getEndDate(
                                subscription
                              )
                            )}
                          </p>

                        </div>

                      </div>

                      {/* BOTTOM */}

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">

                        <div className="flex items-center gap-2 text-gray-500">

                          <Clock size={16} />

                          <span className="text-sm">
                            {subscription.meals_per_day
                              ? `${subscription.meals_per_day} meals/day`
                              : duration
                              ? `${duration} day plan`
                              : "Meal subscription"}
                          </span>

                        </div>

                        {subscription.price !==
                          undefined && (
                          <span className="text-lg font-extrabold text-gray-900">
                            ₹
                            {
                              subscription.price
                            }
                          </span>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

      </div>
    </div>
  );
}