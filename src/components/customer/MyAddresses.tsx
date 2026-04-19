import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  Plus,
  MapPin,
  Home,
  Briefcase,
  Edit,
  Trash2,
  Star,
} from "lucide-react";

const BASE_URL = "https://chef-backend-1.onrender.com";

interface MyAddressesProps {
  onBack: () => void;
  onAddAddress: () => void;
  onEditAddress: (id: string) => void;
}

export function MyAddresses({
  onBack,
  onAddAddress,
  onEditAddress,
}: MyAddressesProps) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // 🔥 FETCH ADDRESSES
  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // 🔥 DELETE ADDRESS
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;

    try {
      await fetch(`${BASE_URL}/address/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchAddresses(); // refresh
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const getIcon = (type: string) => {
    if (type === "home") return Home;
    if (type === "work") return Briefcase;
    return MapPin;
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#FF7A30] to-[#ff9d5c] px-6 pt-12 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack}>
            <ChevronLeft className="text-white" />
          </button>

          <div className="flex-1">
            <h1 className="text-white">My Addresses</h1>
            <p className="text-white/80 text-sm">
              {addresses.length} saved
            </p>
          </div>

          <button onClick={onAddAddress}>
            <Plus className="text-white" />
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="px-6 mt-6 space-y-4">

        {loading ? (
          <p>Loading...</p>
        ) : addresses.length === 0 ? (
          <div className="text-center py-20">
            <p>No addresses found</p>
            <button
              onClick={onAddAddress}
              className="mt-4 bg-[#FF7A30] text-white px-6 py-2 rounded"
            >
              Add Address
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {addresses.map((addr, index) => {
              const Icon = getIcon(addr.address_type);

              return (
                <motion.div
                  key={addr.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-4 rounded-xl shadow"
                >
                  {/* TOP */}
                  <div className="flex gap-3 mb-3">
                    <Icon className="text-[#FF7A30]" />

                    <div className="flex-1">
                      <p className="font-medium capitalize">
                        {addr.address_type || "Address"}
                      </p>
                      <p className="text-sm text-gray-500">{addr.name}</p>
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div className="text-sm text-gray-700 mb-3">
                    <p>{addr.address}</p>
                    <p>
                      {addr.city} - {addr.pincode}
                    </p>
                    <p>{addr.phone}</p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEditAddress(addr.id)}
                      className="flex-1 bg-purple-100 text-purple-600 py-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="flex-1 bg-red-100 text-red-600 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

      </div>
    </div>
  );
}