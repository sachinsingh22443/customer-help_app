import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ChefHat,
  Clock,
  Package,
  RefreshCw,
} from "lucide-react";

interface SpecialOrder {
  order_id: string;
  order_status: string;
  ordered_at: string | null;

  special_id: string;
  dish_name: string;
  description: string | null;
  image_url: string | null;
  food_type: string;

  special_date: string | null;
  cutoff_time: string | null;

  quantity: number;
  total: number;
  unit_price: number;

  chef_id: string;
}

interface Props {
  onBack: () => void;
}

const API_BASE =
  "https://chef-backend-qh12.onrender.com";

export default function MySpecialHistory({ onBack }: Props) {
  const [orders, setOrders] = useState<SpecialOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterType, setFilterType] = useState<
    "all" | "date" | "range"
  >("all");

  const [selectedDate, setSelectedDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Please login again");
      }

      let url = `${API_BASE}/orders/special-history`;

      const params = new URLSearchParams();

      if (filterType === "date" && selectedDate) {
        params.append("date_filter", selectedDate);
      }

      if (filterType === "range") {
        if (fromDate) {
          params.append("from_date", fromDate);
        }

        if (toDate) {
          params.append("to_date", toDate);
        }
      }

      const query = params.toString();

      if (query) {
        url += `?${query}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.detail || "Failed to load special history"
        );
      }

      const data = await response.json();

      setOrders(data.special_orders || []);
    } catch (err: any) {
      console.error("SPECIAL HISTORY ERROR:", err);

      setError(
        err?.message || "Unable to load special history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filterType]);

  const handleDateFilter = () => {
    fetchHistory();
  };

  const handleRangeFilter = () => {
    if (!fromDate && !toDate) {
      fetchHistory();
      return;
    }

    if (fromDate && toDate && fromDate > toDate) {
      setError("From date cannot be greater than To date");
      return;
    }

    fetchHistory();
  };

  const clearFilters = () => {
    setFilterType("all");
    setSelectedDate("");
    setFromDate("");
    setToDate("");

    setTimeout(() => {
      fetchHistory();
    }, 0);
  };

  const formatDate = (value: string | null) => {
    if (!value) return "N/A";

    const date = new Date(`${value}T00:00:00`);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (value: string | null) => {
    if (!value) return "";

    const date = new Date(value);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getShortOrderId = (id: string) => {
    if (!id) return "";

    return `#${id.slice(-8).toUpperCase()}`;
  };

  const getStatusStyle = (status: string) => {
    const value = status?.toLowerCase();

    if (value === "delivered") {
      return "bg-green-100 text-green-700";
    }

    if (
      value === "cancelled" ||
      value === "canceled"
    ) {
      return "bg-red-100 text-red-700";
    }

    if (value === "pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (
      value === "accepted" ||
      value === "preparing" ||
      value === "ready"
    ) {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-8">

      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-[#FFF8F0]/95 backdrop-blur-md px-4 py-4 border-b border-orange-100">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              My Special History
            </h1>

            <p className="text-xs text-gray-500">
              Your Tomorrow Special orders
            </p>
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="px-4 pt-4">

        <div className="bg-white rounded-2xl p-4 shadow-sm">

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-orange-500" />

              <h2 className="font-semibold text-gray-800">
                Filter History
              </h2>
            </div>

            {filterType !== "all" && (
              <button
                onClick={clearFilters}
                className="text-xs text-orange-500 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* FILTER TABS */}
          <div className="grid grid-cols-3 gap-2 mb-4">

            <button
              onClick={() => setFilterType("all")}
              className={`py-2 rounded-xl text-sm font-medium ${
                filterType === "all"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilterType("date")}
              className={`py-2 rounded-xl text-sm font-medium ${
                filterType === "date"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Date
            </button>

            <button
              onClick={() => setFilterType("range")}
              className={`py-2 rounded-xl text-sm font-medium ${
                filterType === "range"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Range
            </button>

          </div>

          {/* SPECIFIC DATE */}
          {filterType === "date" && (
            <div className="space-y-3">

              <label className="text-sm font-medium text-gray-700">
                Select date
              </label>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-3 outline-none focus:border-orange-400"
              />

              <button
                onClick={handleDateFilter}
                disabled={!selectedDate}
                className="w-full bg-orange-500 text-white rounded-xl py-3 font-semibold disabled:opacity-50"
              >
                Apply Date
              </button>

            </div>
          )}

          {/* DATE RANGE */}
          {filterType === "range" && (
            <div className="space-y-3">

              <div>
                <label className="text-sm font-medium text-gray-700">
                  From date
                </label>

                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) =>
                    setFromDate(e.target.value)
                  }
                  className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-3 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  To date
                </label>

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) =>
                    setToDate(e.target.value)
                  }
                  className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-3 outline-none focus:border-orange-400"
                />
              </div>

              <button
                onClick={handleRangeFilter}
                className="w-full bg-orange-500 text-white rounded-xl py-3 font-semibold"
              >
                Apply Range
              </button>

            </div>
          )}

        </div>

      </div>

      {/* RESULTS */}
      <div className="px-4 pt-5">

        <div className="flex items-center justify-between mb-3">

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Special Orders
            </h2>

            {!loading && (
              <p className="text-xs text-gray-500">
                {orders.length} order
                {orders.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <button
            onClick={fetchHistory}
            disabled={loading}
            className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center"
          >
            <RefreshCw
              className={`w-4 h-4 text-orange-500 ${
                loading ? "animate-spin" : ""
              }`}
            />
          </button>

        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm mb-4">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="space-y-4">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl p-4 animate-pulse"
              >
                <div className="flex gap-3">

                  <div className="w-24 h-24 rounded-xl bg-gray-200" />

                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm">

            <div className="w-16 h-16 mx-auto rounded-full bg-orange-50 flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-orange-400" />
            </div>

            <h3 className="font-bold text-gray-800 text-lg">
              No Special Orders
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              You haven't ordered any Tomorrow Special yet.
            </p>

          </div>
        )}

        {/* ORDERS */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">

            {orders.map((order) => (

              <div
                key={`${order.order_id}-${order.special_id}`}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >

                {/* IMAGE + BASIC INFO */}
                <div className="p-4">

                  <div className="flex gap-3">

                    {/* IMAGE */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-orange-50 flex-shrink-0">

                      {order.image_url ? (
                        <img
                          src={order.image_url}
                          alt={order.dish_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          🍽️
                        </div>
                      )}

                    </div>

                    {/* INFO */}
                    <div className="flex-1 min-w-0">

                      <div className="flex items-start justify-between gap-2">

                        <h3 className="font-bold text-gray-900 text-base truncate">
                          {order.dish_name}
                        </h3>

                        <span
                          className={`text-[10px] px-2 py-1 rounded-full font-semibold capitalize whitespace-nowrap ${getStatusStyle(
                            order.order_status
                          )}`}
                        >
                          {order.order_status}
                        </span>

                      </div>

                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <CalendarDays className="w-3.5 h-3.5" />

                        <span>
                          Special:{" "}
                          {formatDate(order.special_date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <ChefHat className="w-3.5 h-3.5" />

                        <span>
                          Chef ID:{" "}
                          {order.chef_id.slice(-8).toUpperCase()}
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* DETAILS */}
                  <div className="grid grid-cols-2 gap-2 mt-4">

                    <div className="bg-gray-50 rounded-xl p-3">

                      <p className="text-[11px] text-gray-500">
                        Quantity
                      </p>

                      <p className="font-bold text-gray-800 mt-1">
                        {order.quantity} plate
                        {order.quantity !== 1 ? "s" : ""}
                      </p>

                    </div>

                    <div className="bg-gray-50 rounded-xl p-3">

                      <p className="text-[11px] text-gray-500">
                        Total
                      </p>

                      <p className="font-bold text-orange-600 mt-1">
                        ₹{Number(order.total || 0).toFixed(0)}
                      </p>

                    </div>

                  </div>

                  {/* PRICE */}
                  <div className="flex items-center justify-between mt-4">

                    <div>
                      <p className="text-xs text-gray-500">
                        Price per plate
                      </p>

                      <p className="font-semibold text-gray-800">
                        ₹{Number(order.unit_price || 0).toFixed(0)}
                      </p>
                    </div>

                    <div className="text-right">

                      <p className="text-xs text-gray-500">
                        Order ID
                      </p>

                      <p className="font-bold text-gray-800 text-sm">
                        {getShortOrderId(order.order_id)}
                      </p>

                    </div>

                  </div>

                  {/* ORDERED AT */}
                  {order.ordered_at && (
                    <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">

                      <Clock className="w-3.5 h-3.5" />

                      Ordered on{" "}
                      {formatDateTime(order.ordered_at)}

                    </div>
                  )}

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}