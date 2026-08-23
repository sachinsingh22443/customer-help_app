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
    <div className="min-h-screen bg-[#FFF8F0] pb-24">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ArrowLeft className="text-white" />
          </button>
          <h1 className="text-white">Checkout</h1>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">

        {/* ADDRESS */}
        <div className="bg-white p-6 rounded-2xl">
          <div className="flex justify-between mb-4">
            <h3>Delivery Address</h3>
            <button onClick={onAddAddress} className="text-[#FF7A30] flex gap-1">
              <Plus size={14} /> Add New
            </button>
          </div>

          {loadingAddress ? (
            <p>Loading...</p>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => setSelectedAddress(addr.id)}
                className={`p-3 border rounded mb-2 cursor-pointer ${
                  selectedAddress === addr.id ? "border-orange-500" : ""
                }`}
              >
                <p>{addr.address}</p>
                <p className="text-sm text-gray-500">
                  {addr.city} - {addr.pincode}
                </p>
              </div>
            ))
          )}
        </div>

        {/* PAYMENT */}
        <div className="bg-white p-6 rounded-2xl">
          <h3 className="mb-4">Payment Method</h3>

          {["card", "upi", "cod"].map((p) => (
            <div
              key={p}
             onClick={() => {
  setSelectedPayment(p);
  localStorage.setItem("payment_method", p);
}}
              className={`p-4 border rounded-xl mb-2 cursor-pointer ${
                selectedPayment === p
                  ? "border-green-500 bg-green-50"
                  : ""
              }`}
            >
              {p}
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-2xl">
          <h3>Order Summary</h3>

          {cartItems.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <hr className="my-2" />

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

      </div>

      {/* BUTTON */}
      <div className="fixed bottom-0 w-full bg-white p-4">
        <button
          disabled={loading}
          onClick={handlePlaceOrder}
          className="w-full bg-[#FF7A30] text-white py-3 rounded"
        >
          {loading ? "Processing..." : `Place Order ₹${total}`}
        </button>
      </div>
    </div>
  );
}