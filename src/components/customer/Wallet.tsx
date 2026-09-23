import { useEffect, useState } from "react";
import {
  Wallet as WalletIcon,
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  RefreshCw,
  ArrowLeft,
  CalendarDays,
  X,
} from "lucide-react";

const BASE_URL = "https://chef-backend-qh12.onrender.com";

interface WalletProps {
  onBack: () => void;
}

interface WalletTransaction {
  id: string;
  amount: number;
  transaction_type: string;
  meal_type?: string | null;
  subscription_id?: string | null;
  order_id?: string | null;
  referral_id?: string | null;
  schedule_id?: string | null;
  description?: string | null;
  created_at: string;
}

interface WalletHistoryResponse {
  balance: number;
  transactions: WalletTransaction[];
}

type QuickFilter =
  | "all"
  | "today"
  | "yesterday"
  | "last7"
  | "month"
  | "custom";

export function Wallet({ onBack }: WalletProps) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<
    WalletTransaction[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [quickFilter, setQuickFilter] =
    useState<QuickFilter>("all");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);

  // =========================================================
  // DATE HELPERS
  // =========================================================

  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getToday = () => {
    return getLocalDateString(new Date());
  };

  const getYesterday = () => {
    const date = new Date();

    date.setDate(
      date.getDate() - 1
    );

    return getLocalDateString(date);
  };

  const getSevenDaysAgo = () => {
    const date = new Date();

    date.setDate(
      date.getDate() - 6
    );

    return getLocalDateString(date);
  };

  const getMonthStart = () => {
    const date = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    return getLocalDateString(date);
  };

  // =========================================================
  // FETCH WALLET
  // =========================================================

  const fetchWallet = async (
    selectedFilter: QuickFilter = quickFilter,
    customFrom = fromDate,
    customTo = toDate
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        return;
      }

      setLoading(true);

      let startDate = "";
      let endDate = "";

      if (selectedFilter === "today") {
        startDate = getToday();
        endDate = getToday();
      }

      if (selectedFilter === "yesterday") {
        startDate = getYesterday();
        endDate = getYesterday();
      }

      if (selectedFilter === "last7") {
        startDate = getSevenDaysAgo();
        endDate = getToday();
      }

      if (selectedFilter === "month") {
        startDate = getMonthStart();
        endDate = getToday();
      }

      if (selectedFilter === "custom") {
        startDate = customFrom;
        endDate = customTo;
      }

      const params = new URLSearchParams();

      if (startDate) {
        params.set(
          "from_date",
          startDate
        );
      }

      if (endDate) {
        params.set(
          "to_date",
          endDate
        );
      }

      const queryString =
        params.toString();

      const url =
        `${BASE_URL}/wallet/history` +
        (queryString
          ? `?${queryString}`
          : "");

      const response = await fetch(
        url,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data: WalletHistoryResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          (data as any)?.detail ||
            "Failed to load wallet"
        );
      }

      setBalance(
        Number(data?.balance || 0)
      );

      setTransactions(
        Array.isArray(
          data?.transactions
        )
          ? data.transactions
          : []
      );
    } catch (error) {
      console.error(
        "WALLET FETCH ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchWallet("all");
  }, []);

  // =========================================================
  // FILTER
  // =========================================================

  const applyQuickFilter = (
    filter: QuickFilter
  ) => {
    setQuickFilter(filter);
    setFilterOpen(false);

    if (filter !== "custom") {
      setFromDate("");
      setToDate("");
      fetchWallet(filter);
    }
  };

  const applyCustomFilter = () => {
    if (!fromDate || !toDate) {
      alert(
        "Please select both dates"
      );
      return;
    }

    if (fromDate > toDate) {
      alert(
        "From date cannot be greater than To date"
      );
      return;
    }

    setQuickFilter("custom");
    setFilterOpen(false);

    fetchWallet(
      "custom",
      fromDate,
      toDate
    );
  };

  const clearFilter = () => {
    setQuickFilter("all");
    setFromDate("");
    setToDate("");
    setFilterOpen(false);

    fetchWallet("all", "", "");
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

    if (
      transaction.transaction_type ===
      "referral_reward"
    ) {
      return "Referral Reward 🎁";
    }

    if (
      transaction.transaction_type ===
      "referral_reward_reversal"
    ) {
      return "Referral Reward Reversed";
    }

    if (
      transaction.transaction_type ===
      "meal_on_debit"
    ) {
      const meal =
        transaction.meal_type
          ? transaction.meal_type
              .charAt(0)
              .toUpperCase() +
            transaction.meal_type.slice(1)
          : "Meal";

      return `${meal} meal`;
    }

    return (
      transaction.transaction_type
        ?.replaceAll("_", " ")
        ?.replace(
          /\b\w/g,
          (char) =>
            char.toUpperCase()
        ) ||
      "Wallet Transaction"
    );
  };

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (
    value: string
  ) => {
    try {
      return new Date(
        value
      ).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "-";
    }
  };

  // =========================================================
  // TIME
  // =========================================================

  const formatTime = (
    value: string
  ) => {
    try {
      return new Date(
        value
      ).toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return "";
    }
  };

  // =========================================================
  // FILTER LABEL
  // =========================================================

  const getFilterLabel = () => {
    if (quickFilter === "today") {
      return "Today";
    }

    if (
      quickFilter === "yesterday"
    ) {
      return "Yesterday";
    }

    if (quickFilter === "last7") {
      return "Last 7 Days";
    }

    if (quickFilter === "month") {
      return "This Month";
    }

    if (quickFilter === "custom") {
      if (
        fromDate &&
        toDate &&
        fromDate === toDate
      ) {
        return formatDate(
          fromDate
        );
      }

      return "Custom Date";
    }

    return "All Transactions";
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bg-gradient-to-r from-[#171717] to-[#5F2EEA] text-white px-5 pt-10 pb-7">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1">

            <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">
              MY MONEY
            </p>

            <h1 className="text-2xl font-black">
              Wallet
            </h1>

          </div>

          <button
            type="button"
            onClick={() =>
              fetchWallet()
            }
            disabled={loading}
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"
          >
            <RefreshCw
              size={18}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
          </button>

        </div>

        {/* Balance */}

        <div className="mt-7 bg-white/10 border border-white/10 rounded-3xl p-5">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">

              <WalletIcon
                size={25}
                className="text-yellow-300"
              />

            </div>

            <div>

              <p className="text-white/60 text-xs">
                Available Balance
              </p>

              <p className="text-4xl font-black mt-1">
                ₹{balance.toFixed(2)}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          FILTER SECTION
      ===================================================== */}

      <div className="px-5 pt-5">

        <button
          type="button"
          onClick={() =>
            setFilterOpen(
              !filterOpen
            )
          }
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-gray-100"
        >

          <div className="w-11 h-11 rounded-xl bg-[#F1ECFF] flex items-center justify-center">
            <CalendarDays
              size={20}
              className="text-[#5F2EEA]"
            />
          </div>

          <div className="flex-1 text-left">

            <p className="text-xs text-gray-400">
              TRANSACTION FILTER
            </p>

            <p className="font-extrabold text-gray-800 mt-1">
              {getFilterLabel()}
            </p>

          </div>

          <span className="text-[#5F2EEA] font-bold">
            {filterOpen
              ? "Close"
              : "Change"}
          </span>

        </button>

        {filterOpen && (
          <div className="mt-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">

            {/* Quick filters */}

            <p className="text-xs font-bold text-gray-400 uppercase mb-3">
              Quick Filter
            </p>

            <div className="grid grid-cols-2 gap-2">

              {[
                ["all", "All"],
                ["today", "Today"],
                ["yesterday", "Yesterday"],
                ["last7", "Last 7 Days"],
                ["month", "This Month"],
              ].map(
                ([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      applyQuickFilter(
                        value as QuickFilter
                      )
                    }
                    className={`rounded-xl py-3 px-3 text-sm font-bold border ${
                      quickFilter ===
                      value
                        ? "bg-[#5F2EEA] text-white border-[#5F2EEA]"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                )
              )}

            </div>

            {/* Custom date */}

            <div className="mt-5">

              <p className="text-xs font-bold text-gray-400 uppercase mb-3">
                Specific Date / Date Range
              </p>

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="text-xs text-gray-500">
                    From
                  </label>

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) =>
                      setFromDate(
                        e.target.value
                      )
                    }
                    className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none"
                  />

                </div>

                <div>

                  <label className="text-xs text-gray-500">
                    To
                  </label>

                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) =>
                      setToDate(
                        e.target.value
                      )
                    }
                    className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none"
                  />

                </div>

              </div>

              <button
                type="button"
                onClick={
                  applyCustomFilter
                }
                className="w-full mt-3 bg-[#FF7A30] text-white rounded-xl py-3 font-extrabold"
              >
                Apply Date Filter
              </button>

              <button
                type="button"
                onClick={clearFilter}
                className="w-full mt-2 bg-gray-100 text-gray-700 rounded-xl py-3 font-bold"
              >
                Clear Filter
              </button>

            </div>

          </div>
        )}

      </div>

      {/* =====================================================
          TRANSACTIONS
      ===================================================== */}

      <div className="px-5 mt-5">

        <div className="flex items-center justify-between mb-3">

          <div>

            <h2 className="font-black text-xl text-gray-800">
              Transactions
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              {getFilterLabel()}
            </p>

          </div>

          <span className="text-xs font-bold bg-gray-100 px-3 py-2 rounded-full text-gray-600">
            {transactions.length}
          </span>

        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-10 text-center">

            <RefreshCw
              size={28}
              className="animate-spin text-[#5F2EEA] mx-auto"
            />

            <p className="text-sm text-gray-500 mt-3">
              Loading transactions...
            </p>

          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center">

            <div className="w-16 h-16 rounded-2xl bg-gray-100 mx-auto flex items-center justify-center">

              <WalletIcon
                size={28}
                className="text-gray-400"
              />

            </div>

            <h3 className="font-extrabold text-gray-800 mt-4">
              No Transactions
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              No wallet transactions found for this period.
            </p>

          </div>
        ) : (
          <div className="space-y-3">

            {transactions.map(
              (transaction) => {

                const isCredit =
                  Number(
                    transaction.amount
                  ) > 0;

                return (
                  <div
                    key={
                      transaction.id
                    }
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
                  >

                    <div className="flex items-center gap-3">

                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          isCredit
                            ? "bg-emerald-50"
                            : "bg-red-50"
                        }`}
                      >

                        {isCredit ? (
                          <ArrowDownLeft
                            size={20}
                            className="text-emerald-600"
                          />
                        ) : (
                          <ArrowUpRight
                            size={20}
                            className="text-red-500"
                          />
                        )}

                      </div>

                      <div className="flex-1 min-w-0">

                        <p className="font-extrabold text-gray-800 text-sm truncate">
                          {getTransactionTitle(
                            transaction
                          )}
                        </p>

                        <p className="text-[11px] text-gray-400 mt-1">
                          {formatDate(
                            transaction.created_at
                          )}
                          {" • "}
                          {formatTime(
                            transaction.created_at
                          )}
                        </p>

                      </div>

                      <div className="text-right">

                        <p
                          className={`font-black text-sm ${
                            isCredit
                              ? "text-emerald-600"
                              : "text-red-500"
                          }`}
                        >
                          {isCredit
                            ? "+"
                            : "-"}
                          ₹
                          {Math.abs(
                            Number(
                              transaction.amount
                            )
                          ).toFixed(2)}
                        </p>

                        <p className="text-[9px] text-gray-400 mt-1">
                          {isCredit
                            ? "CREDIT"
                            : "DEBIT"}
                        </p>

                      </div>

                    </div>

                    {transaction.transaction_type ===
                      "referral_reward" && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl bg-yellow-50 border border-yellow-100 px-3 py-2">

                        <Gift
                          size={14}
                          className="text-yellow-600"
                        />

                        <span className="text-[11px] font-bold text-yellow-700">
                          Referral reward credited
                        </span>

                      </div>
                    )}

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

export default Wallet;