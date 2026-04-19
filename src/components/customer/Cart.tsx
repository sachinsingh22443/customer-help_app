import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const BASE_URL = "https://chef-backend-1.onrender.com";

interface CartProps {
  onBack: () => void;
  onCheckout: () => void;
  setCartData: (data: any[]) => void;
}

export function Cart({ onBack, onCheckout, setCartData }: CartProps) {

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // =========================
  // 🔥 FETCH CART
  // =========================
  const fetchCart = async () => {
    try {
      if (!token) {
        setItems([]);
        setCartData([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        setItems([]);
        setCartData([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      const cartItems = data.items || [];

      setItems(cartItems);
      setCartData(cartItems);

    } catch (err) {
      console.error("Cart fetch error:", err);
      setItems([]);
      setCartData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // =========================
  // 🔥 UPDATE QUANTITY
  // =========================
  const handleUpdate = async (item: any, quantity: number) => {
    if (!token) return;

    const type = item.type;   // ✅ FIXED

    try {
      await fetch(
        `${BASE_URL}/cart/update?type=${type}&item_id=${item.id}&quantity=${quantity}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // =========================
  // 🔥 REMOVE ITEM
  // =========================
  const handleRemove = async (item: any) => {
    if (!token) return;

    const type = item.type;   // ✅ FIXED

    try {
      await fetch(
        `${BASE_URL}/cart/remove/${type}/${item.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-40">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ChevronLeft className="text-white" />
          </button>

          <div>
            <h1 className="text-white font-semibold">My Cart 🛒</h1>
            <p className="text-white/80 text-sm">{items.length} items</p>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="px-6 mt-6">

        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <h3>Your cart is empty 🛒</h3>
          </div>
        ) : (
          <div className="space-y-4">

            {items.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow">

                <div className="flex gap-4">

                  <div className="w-20 h-20 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">

                    <div className="flex justify-between">
                      <p className="font-medium">{item.name}</p>

                      <button onClick={() => handleRemove(item)}>
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-3">

                      <div className="flex items-center gap-2">

                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              handleUpdate(item, item.quantity - 1);
                            } else {
                              handleRemove(item);
                            }
                          }}
                        >
                          <Minus size={14} />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            handleUpdate(item, item.quantity + 1)
                          }
                        >
                          <Plus size={14} />
                        </button>

                      </div>

                      <p className="text-[#FF7A30] font-semibold">
                        ₹{item.price * item.quantity}
                      </p>

                    </div>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>

      {/* FOOTER */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Delivery</span>
            <span>₹{deliveryFee}</span>
          </div>

          <div className="flex justify-between font-bold mb-3">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={onCheckout}
            className="w-full bg-[#FF7A30] text-white py-3 rounded-lg"
          >
            Proceed to Checkout
          </button>

        </div>
      )}

    </div>
  );
}