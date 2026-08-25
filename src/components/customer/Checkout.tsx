import { motion } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Checkout as RazorpayCheckout } from "capacitor-razorpay";

interface CheckoutProps {
  onBack: () => void;
  onSuccess: (order: any) => void;
  onFailed: () => void;
  onAddAddress: () => void;
  cartData: any[];
  directItem?: any;
}

export function Checkout({
  onBack,
  onSuccess,
  onFailed,
  onAddAddress,
  cartData,
  directItem,
}: CheckoutProps) {

  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("payment_method");
    if (saved) setSelectedPayment(saved);
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://chef-backend-qh12.onrender.com/address", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setAddresses(data);

      if (data.length > 0) {
        setSelectedAddress(data[0].id);
      }

    } catch (err) {
      console.error("❌ Address error:", err);
    } finally {
      setLoadingAddress(false);
    }
  };

  const cartItems =
  directItem != null
    ? [directItem]
    : Array.isArray(cartData)
      ? cartData
      : [];

  const subtotal = cartItems.reduce(
  (sum, item) =>
    sum + Number(item.price || 0) * Number(item.quantity || 0),
  0
);



  // const delivery = 0;
  // const tax = ;
  const total = subtotal ;

  // 🧾 CREATE ORDER
  const createOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const addr = addresses.find(a => a.id === selectedAddress);
      if (!addr) return alert("Select address");

      const res = await fetch("https://chef-backend-qh12.onrender.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
  address: addr.address,
  payment_method: selectedPayment,

  items: cartItems.map(item => ({
  menu_id:
    item.type === "menu"
      ? (item.menu_id ?? item.item_id ?? item.id)
      : null,

  special_id:
    item.type === "special"
      ? (item.special_id ?? item.item_id ?? item.id)
      : null,

  quantity: Number(item.quantity),

  // ✅ IMPORTANT: normal menu cycle information
  meal_type:
    item.type === "menu"
      ? (item.meal_type ?? null)
      : null,

  menu_date:
    item.type === "menu"
      ? (item.menu_date ?? null)
      : null,
})),
}),
      });

      const data = await res.json();
      // console.log("ORDER:", data);

      if (!res.ok) {
        alert(data.detail || "Order failed");
        return null;
      }

      return data;

    } catch (err) {
      console.error(err);
      onFailed();
      return null;
    }
  };

  // 💳 RAZORPAY
  
  const openRazorpay = async (order: any) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    // ============================================
    // CREATE RAZORPAY PAYMENT
    // ============================================

    const res = await fetch(
      "https://chef-backend-qh12.onrender.com/orders/create-payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: order.id,
        }),
      }
    );

    const data = await res.json();

    // console.log("Razorpay payment data:", data);

    if (!res.ok) {
      alert(
        typeof data.detail === "string"
          ? data.detail
          : "Unable to create payment"
      );

      setLoading(false);
      return;
    }

    // ============================================
    // OPEN RAZORPAY
    // ============================================

    let result: any;

    try {
      result = await RazorpayCheckout.open({
        key: data.key,
        amount: String(data.amount),
        currency: "INR",
        name: "Eat Unity",
        description: "Food Order",
        order_id: data.razorpay_order_id,
      });
    } catch (razorpayError: any) {
      console.log(
        "Razorpay closed / cancelled:",
        razorpayError
      );

      /*
       * Razorpay plugin throws an error when
       * customer presses Back / Exit without payment.
       *
       * Do NOT show the raw Razorpay JSON to customer.
       */

      setLoading(false);

      return;
    }

    // ============================================
    // CHECK RAZORPAY RESPONSE
    // ============================================

    const response = result?.response;

    if (
      !response?.razorpay_order_id ||
      !response?.razorpay_payment_id ||
      !response?.razorpay_signature
    ) {
      // console.log(
      //   "Incomplete Razorpay response:",
      //   result
      // );

      setLoading(false);
      return;
    }

    // ============================================
    // VERIFY PAYMENT
    // ============================================

    const verify = await fetch(
      "https://chef-backend-qh12.onrender.com/orders/verify-payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          razorpay_order_id:
            response.razorpay_order_id,

          razorpay_payment_id:
            response.razorpay_payment_id,

          razorpay_signature:
            response.razorpay_signature,

          order_id: order.id,
        }),
      }
    );

    const verifyData = await verify.json();

    // console.log(
    //   "Payment verification:",
    //   verifyData
    // );

    if (!verify.ok) {
      alert(
        typeof verifyData.detail === "string"
          ? verifyData.detail
          : "Payment verification failed"
      );

      setLoading(false);
      onFailed();
      return;
    }

    // ============================================
    // PAYMENT SUCCESS
    // ============================================

    localStorage.removeItem("cart");

    setLoading(false);

    onSuccess({
      ...order,
      payment_status: "paid",
    });

  } catch (err: any) {
    console.error(
      "Checkout payment error:",
      err
    );

    setLoading(false);

    alert(
      err?.message ||
      "Payment could not be completed. Please try again."
    );

    onFailed();
  }
};

    


  const handlePlaceOrder = async () => {
  if (loading) return;

  setLoading(true);

  try {
    const order = await createOrder();

    if (!order) {
      setLoading(false);
      return;
    }

    // ============================================
    // COD
    // ============================================

    // ============================================
// COD
// ============================================

if (selectedPayment === "cod") {
  setLoading(false);

  onSuccess({
    ...order,
    is_cod: true,
  });

  return;
}

    // ============================================
    // ONLINE PAYMENT
    // ============================================

    await openRazorpay(order);

  } catch (err) {
    console.error(
      "Place order error:",
      err
    );

    setLoading(false);
  }
};

  return (
  <div className="min-h-screen bg-[#F7F6F3] pb-40">

    {/* =====================================================
        PREMIUM HEADER
    ===================================================== */}

    <div className="relative overflow-hidden rounded-b-[2.8rem] bg-gradient-to-br from-[#24104D] via-[#5F2EEA] to-[#FF7A30] px-5 pb-9 pt-7">

      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-orange-300/15 blur-3xl" />

      <div className="relative">

        <div className="flex items-center justify-between">

          <button
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white backdrop-blur-md transition active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md">

            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white">
              Secure Checkout
            </span>

          </div>

        </div>


        <div className="mt-8">

          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/50">
            Almost there
          </p>

          <h1 className="mt-2 text-[30px] font-bold tracking-tight text-white">
            Complete Your Order
          </h1>

          <p className="mt-2 text-xs leading-5 text-white/65">
            Choose where we should deliver your fresh meal.
          </p>


          <div className="mt-6 flex items-center gap-2">

            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-md">

              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                🛍️
              </div>

              <div>
                <p className="text-[8px] uppercase tracking-wider text-white/45">
                  Items
                </p>

                <p className="mt-0.5 text-xs font-bold text-white">
                  {cartItems.length}
                </p>
              </div>

            </div>


            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-md">

              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                💰
              </div>

              <div>
                <p className="text-[8px] uppercase tracking-wider text-white/45">
                  Payable
                </p>

                <p className="mt-0.5 text-xs font-bold text-white">
                  ₹{total}
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>


    {/* =====================================================
        MAIN CONTENT
    ===================================================== */}

    <div className="space-y-5 px-5 pt-6">


      {/* =================================================
          DELIVERY ADDRESS
      ================================================= */}

      <section className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_12px_35px_rgba(30,20,70,0.06)]">

        <div className="p-5">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50">

                <span className="text-xl">
                  📍
                </span>

              </div>

              <div>

                <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Deliver to
                </p>

                <h2 className="mt-1 text-sm font-bold text-slate-900">
                  Delivery Address
                </h2>

              </div>

            </div>


            <button
              onClick={onAddAddress}
              className="flex items-center gap-1 rounded-xl bg-orange-50 px-3 py-2 text-[9px] font-bold text-orange-600 transition active:scale-95"
            >

              <Plus size={13} />

              Add New

            </button>

          </div>


          <div className="mt-5">

            {loadingAddress ? (

              <div className="rounded-2xl bg-slate-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200" />

                  <div className="flex-1 space-y-2">

                    <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />

                    <div className="h-2 w-1/2 animate-pulse rounded bg-slate-100" />

                  </div>

                </div>

              </div>

            ) : addresses.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/50 p-5 text-center">

                <div className="text-2xl">
                  📍
                </div>

                <p className="mt-2 text-xs font-bold text-slate-800">
                  No delivery address
                </p>

                <p className="mt-1 text-[9px] text-slate-400">
                  Add an address to continue
                </p>

                <button
                  onClick={onAddAddress}
                  className="mt-4 rounded-xl bg-orange-500 px-4 py-2.5 text-[9px] font-bold text-white"
                >
                  + Add Address
                </button>

              </div>

            ) : (

              <div className="space-y-3">

                {addresses.map((addr) => {

                  const selected =
                    selectedAddress === addr.id;

                  return (

                    <div
                      key={addr.id}
                      onClick={() =>
                        setSelectedAddress(addr.id)
                      }
                      className={`relative cursor-pointer overflow-hidden rounded-2xl border p-4 transition active:scale-[0.99] ${
                        selected
                          ? "border-orange-400 bg-gradient-to-r from-orange-50 to-purple-50"
                          : "border-slate-100 bg-slate-50"
                      }`}
                    >

                      {selected && (
                        <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white">

                          <span className="text-[11px]">
                            ✓
                          </span>

                        </div>
                      )}


                      <div className="flex gap-3">

                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            selected
                              ? "bg-orange-500 text-white"
                              : "bg-white text-slate-400"
                          }`}
                        >
                          📍
                        </div>


                        <div className="pr-7">

                          <p className="text-xs font-bold text-slate-800">
                            {addr.address}
                          </p>

                          <p className="mt-1 text-[9px] text-slate-400">
                            {addr.city} - {addr.pincode}
                          </p>

                        </div>

                      </div>

                    </div>

                  );

                })}

              </div>

            )}

          </div>

        </div>

      </section>


      {/* =================================================
          PAYMENT METHOD
      ================================================= */}

      <section className="rounded-[2rem] border border-white bg-white p-5 shadow-[0_12px_35px_rgba(30,20,70,0.06)]">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50">
            💳
          </div>

          <div>

            <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Payment
            </p>

            <h2 className="mt-1 text-sm font-bold text-slate-900">
              Choose Payment Method
            </h2>

          </div>

        </div>


        <div className="mt-5 space-y-3">

          {[
            {
              id: "card",
              title: "Cards",
              subtitle: "Credit / Debit Card",
              icon: "💳",
            },
            {
              id: "upi",
              title: "UPI",
              subtitle: "Google Pay / PhonePe / UPI",
              icon: "📲",
            },
            {
              id: "cod",
              title: "Cash on Delivery",
              subtitle: "Pay when your order arrives",
              icon: "💵",
            },
          ].map((payment) => {

            const selected =
              selectedPayment === payment.id;

            return (

              <div
                key={payment.id}
                onClick={() => {

                  setSelectedPayment(
                    payment.id
                  );

                  localStorage.setItem(
                    "payment_method",
                    payment.id
                  );

                }}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition active:scale-[0.99] ${
                  selected
                    ? "border-[#5F2EEA] bg-purple-50/60"
                    : "border-slate-100 bg-slate-50"
                }`}
              >

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${
                    selected
                      ? "bg-[#5F2EEA] text-white"
                      : "bg-white"
                  }`}
                >
                  {payment.icon}
                </div>


                <div className="flex-1">

                  <p className="text-xs font-bold text-slate-800">
                    {payment.title}
                  </p>

                  <p className="mt-1 text-[9px] text-slate-400">
                    {payment.subtitle}
                  </p>

                </div>


                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    selected
                      ? "border-[#5F2EEA] bg-[#5F2EEA]"
                      : "border-slate-200 bg-white"
                  }`}
                >

                  {selected && (
                    <span className="text-[9px] font-bold text-white">
                      ✓
                    </span>
                  )}

                </div>

              </div>

            );

          })}

        </div>


        {/* SECURITY */}

        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-2.5">

          <span className="text-[10px]">
            🔒
          </span>

          <span className="text-[8px] font-semibold text-emerald-600">
            Your payment information is secure
          </span>

        </div>

      </section>


      {/* =================================================
          ORDER SUMMARY
      ================================================= */}

      <section className="rounded-[2rem] border border-white bg-white p-5 shadow-[0_12px_35px_rgba(30,20,70,0.06)]">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50">
              🍱
            </div>

            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Review
              </p>

              <h2 className="mt-1 text-sm font-bold text-slate-900">
                Order Summary
              </h2>

            </div>

          </div>


          <span className="rounded-full bg-orange-50 px-3 py-1.5 text-[8px] font-bold text-orange-600">
            {cartItems.length} ITEMS
          </span>

        </div>


        <div className="mt-5 space-y-3">

          {cartItems.map((item, i) => (

            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
            >

              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">

                {item.image ? (

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />

                ) : (

                  <span className="text-lg">
                    🍽️
                  </span>

                )}

              </div>


              <div className="min-w-0 flex-1">

                <p className="truncate text-[10px] font-bold text-slate-800">
                  {item.name}
                </p>

                <p className="mt-1 text-[8px] text-slate-400">
                  Quantity × {item.quantity}
                </p>

              </div>


              <p className="text-xs font-bold text-slate-800">

                ₹
                {(
                  Number(item.price || 0) *
                  Number(item.quantity || 0)
                ).toFixed(0)}

              </p>

            </div>

          ))}

        </div>


        {/* PRICE BREAKDOWN */}

        <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">

          <div className="flex justify-between">

            <span className="text-[10px] text-slate-400">
              Subtotal
            </span>

            <span className="text-[10px] font-semibold text-slate-700">
              ₹{subtotal.toFixed(0)}
            </span>

          </div>


          <div className="flex justify-between">

            <span className="text-[10px] text-slate-400">
              Delivery
            </span>

            <span className="text-[10px] font-bold text-emerald-600">
              FREE
            </span>

          </div>


          <div className="mt-3 flex items-center justify-between rounded-2xl bg-gradient-to-r from-orange-50 to-purple-50 p-4">

            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Total payable
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                ₹{total.toFixed(0)}
              </p>

            </div>


            <div className="text-right">

              <p className="text-[8px] text-slate-400">
                Payment
              </p>

              <p className="mt-1 text-[9px] font-bold uppercase text-[#5F2EEA]">
                {selectedPayment === "cod"
                  ? "COD"
                  : selectedPayment === "upi"
                  ? "UPI"
                  : "CARD"}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          TRUST FEATURES
      ================================================= */}

      <div className="grid grid-cols-3 gap-2">

        <div className="rounded-2xl bg-white p-3 text-center shadow-sm">

          <div className="text-lg">
            🥗
          </div>

          <p className="mt-2 text-[8px] font-bold text-slate-600">
            Fresh Meals
          </p>

        </div>


        <div className="rounded-2xl bg-white p-3 text-center shadow-sm">

          <div className="text-lg">
            👨‍🍳
          </div>

          <p className="mt-2 text-[8px] font-bold text-slate-600">
            Local Chefs
          </p>

        </div>


        <div className="rounded-2xl bg-white p-3 text-center shadow-sm">

          <div className="text-lg">
            🔒
          </div>

          <p className="mt-2 text-[8px] font-bold text-slate-600">
            Secure Pay
          </p>

        </div>

      </div>

    </div>


    {/* =====================================================
        FIXED PLACE ORDER BAR
    ===================================================== */}

    <div className="fixed bottom-0 left-0 right-0 z-50">

      <div className="absolute inset-0 border-t border-slate-100 bg-white/90 backdrop-blur-xl" />

      <div className="relative mx-auto max-w-xl px-5 pb-5 pt-4">

        <div className="mb-3 flex items-center justify-between px-1">

          <div>

            <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
              You'll pay
            </p>

            <p className="mt-0.5 text-lg font-bold text-slate-900">
              ₹{total}
            </p>

          </div>


          <div className="flex items-center gap-1.5">

            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-[8px] font-semibold text-slate-400">
              Ready to place
            </span>

          </div>

        </div>


        <button
          disabled={loading}
          onClick={handlePlaceOrder}
          className={`flex w-full items-center justify-between rounded-[1.4rem] px-5 py-4 text-white shadow-[0_12px_30px_rgba(95,46,234,0.22)] transition active:scale-[0.98] ${
            loading
              ? "cursor-not-allowed bg-slate-400"
              : "bg-gradient-to-r from-[#FF7A30] via-[#F45B2A] to-[#5F2EEA]"
          }`}
        >

          <div className="text-left">

            <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/60">
              {loading
                ? "Please wait"
                : selectedPayment === "cod"
                ? "Cash on delivery"
                : "Secure payment"}
            </p>

            <p className="mt-0.5 text-sm font-bold">
              {loading
                ? "Processing..."
                : "Place Order"}
            </p>

          </div>


          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">

            {loading ? (

              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

            ) : (

              <span className="text-lg">
                →
              </span>

            )}

          </div>

        </button>


        <p className="mt-2 text-center text-[8px] text-slate-400">
          By placing this order, you agree to our order terms.
        </p>

      </div>

    </div>

  </div>
);
}