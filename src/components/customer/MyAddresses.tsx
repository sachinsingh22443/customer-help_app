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

const BASE_URL = "https://chef-backend-qh12.onrender.com";

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

      if (!res.ok) {
  throw new Error(`Failed to fetch addresses: ${res.status}`);
}

const data = await res.json();

setAddresses(
  Array.isArray(data)
    ? data
    : Array.isArray(data.addresses)
      ? data.addresses
      : []
);
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

  
const formatAddress = (addr: any) => {
  const clean = (value: unknown) =>
    String(value ?? "")
      .replace(/\s+/g, " ")
      .replace(/[.,\s]+$/g, "")
      .trim();

  const unique = (values: unknown[]) => {
    const result: string[] = [];

    values.forEach((value) => {
      const text = clean(value);
      if (
        text &&
        !result.some(
          (item) => item.toLowerCase() === text.toLowerCase()
        )
      ) {
        result.push(text);
      }
    });

    return result;
  };

  const fullAddress = clean(addr.address);
  const parts = fullAddress
    .split(",")
    .map(clean)
    .filter(Boolean);

  // Remove repeated comma-separated parts
  const cleanedParts = unique(parts);

  // Handle full address repeated twice, e.g. A, B, C, A, B, C
  if (
    parts.length >= 4 &&
    parts.length % 2 === 0
  ) {
    const half = parts.length / 2;
    const first = parts.slice(0, half);
    const second = parts.slice(half);

    if (
      first.every(
        (part, index) =>
          part.toLowerCase() === second[index].toLowerCase()
      )
    ) {
      return first.join(", ");
    }
  }

  return cleanedParts.join(", ");
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
                  className="bg-white p-3.5 rounded-2xl border border-orange-100 shadow-sm"
                >
                  {/* TOP */}
                  <div className="flex gap-3 mb-2">
                    <Icon className="text-[#FF7A30]" />

                    <div className="flex-1">
                      <p className="font-medium capitalize">
                        {addr.address_type || "Address"}
                      </p>
                      <p className="text-sm text-gray-500">{addr.name}</p>
                    </div>
                  </div>

                
                  

{/* ADDRESS */}
<div className="mb-4 space-y-1.5">
  <p className="line-clamp-3 break-words text-sm font-medium leading-5 text-gray-800">
    {formatAddress(addr) || "Address not available"}
  </p>

  <p className="text-xs text-gray-500">
    {[
      addr.city,
      addr.state,
      addr.pincode,
    ]
      .filter(Boolean)
      .filter(
        (value, index, array) =>
          array.findIndex(
            (item) =>
              String(item).trim().toLowerCase() ===
              String(value).trim().toLowerCase()
          ) === index
      )
      .join(", ")}
  </p>

  {addr.phone && (
    <p className="text-xs text-gray-500">
      {addr.phone}
    </p>
  )}
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