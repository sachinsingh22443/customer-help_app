import { motion } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface CheckoutProps {
  onBack: () => void;
  onSuccess: (order: any) => void;
  onFailed: () => void;
  onAddAddress: () => void;
  cartData: any[];
}

export function Checkout({
  onBack,
  onSuccess,
  onFailed,
  onAddAddress,
  cartData,
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

      const res = await fetch("https://chef-backend-1.onrender.com/address", {
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

  const cartItems = cartData || [];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery = 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + tax;

  // 🧾 CREATE ORDER
  const createOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const addr = addresses.find(a => a.id === selectedAddress);
      if (!addr) return alert("Select address");

      const res = await fetch("https://chef-backend-1.onrender.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: addr.address,
          payment_method: selectedPayment,
          items: cartItems.map(item => ({
         menu_id: item.type === "menu" ? item.id : null,
        special_id: item.type === "special" ? item.id : null,
       quantity: item.quantity,
       })),
        }),
      });

      const data = await res.json();
      console.log("ORDER:", data);

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

      const res = await fetch("https://chef-backend-1.onrender.com/orders/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order_id: order.id }),
      });

      const data = await res.json();
      console.log("PAYMENT:", data);

      if (!res.ok) {
        alert(data.detail);
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        order_id: data.razorpay_order_id,

        handler: async function (response: any) {
          try {
            console.log("SUCCESS:", response);

            const verify = await fetch(
              "https://chef-backend-1.onrender.com/orders/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: order.id,
                }),
              }
            );

            const verifyData = await verify.json();
            console.log("VERIFY:", verifyData);

            if (!verify.ok) {
              alert("Payment verification failed");
              return onFailed();
            }

            localStorage.removeItem("cart");

            onSuccess({
              ...order,
              payment_status: "paid",
            });

          } catch (err) {
            console.error(err);
            onFailed();
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
            onFailed();
          },
        },

        theme: {
          color: "#FF7A30",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      onFailed();
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    const order = await createOrder();
    if (!order) return setLoading(false);

    if (selectedPayment === "cod") {
      localStorage.removeItem("cart");
      onSuccess({ ...order, is_cod: true });
      return setLoading(false);
    }

    await openRazorpay(order);
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
              onClick={() => setSelectedPayment(p)}
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