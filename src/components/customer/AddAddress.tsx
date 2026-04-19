import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Save, MapPin, Home, Briefcase, Navigation } from "lucide-react";
import Location from "./Location";

const BASE_URL = "https://chef-backend-1.onrender.com";

interface AddAddressProps {
  onBack: () => void;
  onSave: () => void;
  addressId?: string;
}

export function AddAddress({ onBack, onSave, addressId }: AddAddressProps) {
  const [loading, setLoading] = useState(false);

  const [addressType, setAddressType] = useState<"home" | "work" | "other">("home");
  const [showLocation, setShowLocation] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    flatNo: "",
    area: "",
    landmark: "",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "",
  });

  const token = localStorage.getItem("token");

  // 🔥 SAVE ADDRESS API
  const handleSave = async () => {
    if (!formData.name || !formData.phone || !formData.flatNo || !formData.area || !formData.pincode) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          addressType: addressType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to save address");
      }

      console.log("✅ Address Saved:", data);

      alert("Address saved successfully!");
      onSave();

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 AUTO LOCATION (optional)
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );

      const data = await res.json();

      setFormData({
        ...formData,
        area: data.address.suburb || "",
        city: data.address.city || data.address.town || "",
        pincode: data.address.postcode || "",
      });
    });
  };

  const addressTypes = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "work" as const, label: "Work", icon: Briefcase },
    { id: "other" as const, label: "Other", icon: MapPin },
  ];


  useEffect(() => {
  const city = localStorage.getItem("location_name");

  if (city) {
    setFormData((prev) => ({
      ...prev,
      city,
    }));
  }
}, []);
  
  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-32">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#FF7A30] to-[#ff9d5c] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ChevronLeft className="text-white" />
          </button>

          <h1 className="text-white flex-1">
            {addressId ? "Edit Address" : "Add New Address"}
          </h1>
        </div>
      </div>

      {/* FORM */}
      <div className="px-6 mt-6 space-y-4">

        {/* AUTO LOCATION */}
        <button
         onClick={() => setShowLocation(true)} // 🔥 CHANGE
         className="w-full bg-white rounded-xl p-4 flex items-center gap-3"
         >
             <Navigation />
            Use my current location
         </button>

        {/* ADDRESS TYPE */}
        <div className="bg-white p-4 rounded-xl">
          <div className="grid grid-cols-3 gap-2">
            {addressTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setAddressType(type.id)}
                className={`p-3 rounded ${
                  addressType === type.id ? "bg-orange-100" : "bg-gray-100"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* FORM INPUTS */}
        <div className="bg-white p-4 rounded-xl space-y-3">

          <input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border rounded"
          />

          <input
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-3 border rounded"
          />

          <input
            placeholder="Flat No"
            value={formData.flatNo}
            onChange={(e) => setFormData({ ...formData, flatNo: e.target.value })}
            className="w-full p-3 border rounded"
          />

          <input
            placeholder="Area"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            className="w-full p-3 border rounded"
          />

          <input
            placeholder="Landmark"
            value={formData.landmark}
            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
            className="w-full p-3 border rounded"
          />

          <input
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full p-3 border rounded"
          />

          <input
            placeholder="State"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full p-3 border rounded"
          />

          <input
            placeholder="Pincode"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            className="w-full p-3 border rounded"
          />

        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-[#FF7A30] text-white py-3 rounded"
        >
          {loading ? "Saving..." : "Save Address"}
        </button>
      </div>



    {showLocation && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <Location
  onLocationSelect={(lat, lng, city) => {
    setFormData((prev) => ({
      ...prev,
      city: city,
      area: localStorage.getItem("location_name") || prev.area,
    }));

    setShowLocation(false);
  }}
  onClose={() => setShowLocation(false)} // ✅ ADD THIS
/>
  </div>
)}

    </div>
  );
}