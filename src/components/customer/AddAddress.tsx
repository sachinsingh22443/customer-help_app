import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ChevronLeft,
  Save,
  MapPin,
  Home,
  Briefcase,
  Navigation,
} from "lucide-react";

import Location from "./Location";

const BASE_URL = "https://chef-backend-qh12.onrender.com";

interface AddAddressProps {
  onBack: () => void;
  onSave: () => void;
  addressId?: string;
}

export function AddAddress({
  onBack,
  onSave,
  addressId,
}: AddAddressProps) {
  const [loading, setLoading] = useState(false);

  const [addressType, setAddressType] = useState<
    "home" | "work" | "other"
  >("home");

  const [showLocation, setShowLocation] = useState(false);

  // =========================================================
  // 📍 FORM DATA
  // =========================================================

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    flatNo: "",
    area: "",
    landmark: "",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "",

    // 📍 DELIVERY LOCATION
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const token = localStorage.getItem("token");

  // =========================================================
  // 💾 SAVE ADDRESS
  // =========================================================

  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.phone ||
      !formData.flatNo ||
      !formData.area ||
      !formData.pincode
    ) {
      alert("Please fill all required fields");
      return;
    }

    // 📍 Location check
    if (
      formData.latitude === null ||
      formData.longitude === null
    ) {
      alert("Please select your current location before saving the address.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/address/`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,

          flatNo: formData.flatNo,
          area: formData.area,
          landmark: formData.landmark,

          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,

          addressType: addressType,

          // 📍 LOCATION
          latitude: formData.latitude,
          longitude: formData.longitude,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.detail || "Failed to save address"
        );
      }

      console.log("✅ Address Saved:", data);

      console.log("📍 Saved Latitude:", data.latitude);
      console.log("📍 Saved Longitude:", data.longitude);

      alert("Address saved successfully!");

      onSave();
    } catch (err: any) {
      console.error("❌ Save address error:", err);

      alert(
        err?.message ||
          "Something went wrong while saving address"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // 📍 ADDRESS TYPES
  // =========================================================

  const addressTypes = [
    {
      id: "home" as const,
      label: "Home",
      icon: Home,
    },
    {
      id: "work" as const,
      label: "Work",
      icon: Briefcase,
    },
    {
      id: "other" as const,
      label: "Other",
      icon: MapPin,
    },
  ];

  // =========================================================
  // 🌆 LOAD SAVED CITY
  // =========================================================

  useEffect(() => {
    const city = localStorage.getItem("location_name");

    if (city) {
      setFormData((prev) => ({
        ...prev,
        city,
      }));
    }
  }, []);

  // =========================================================
  // 🎨 UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-32">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bg-gradient-to-br from-[#FF7A30] to-[#ff9d5c] px-6 pt-12 pb-8 rounded-b-[2rem]">

        <div className="flex items-center gap-4">

          <button
            onClick={onBack}
            type="button"
          >
            <ChevronLeft className="text-white" />
          </button>

          <h1 className="text-white flex-1">
            {addressId
              ? "Edit Address"
              : "Add New Address"}
          </h1>

        </div>

      </div>


      {/* =====================================================
          FORM
      ===================================================== */}

      <div className="px-6 mt-6 space-y-4">

        {/* ===================================================
            📍 CURRENT LOCATION
        =================================================== */}

        <button
          type="button"
          onClick={() => setShowLocation(true)}
          className="w-full bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm"
        >

          <Navigation className="text-[#FF7A30]" />

          <div className="flex-1 text-left">

            <p className="font-medium">
              Use my current location
            </p>

            {formData.latitude !== null &&
            formData.longitude !== null ? (
              <p className="text-xs text-green-600 mt-1">
                ✓ Location selected
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Select location for delivery
              </p>
            )}

          </div>

        </button>


        {/* ===================================================
            📍 LOCATION DETAILS
        =================================================== */}

        {formData.latitude !== null &&
        formData.longitude !== null && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3">

            <div className="flex items-center gap-2">

              <MapPin
                size={18}
                className="text-green-600"
              />

              <div>

                <p className="text-sm font-medium text-green-700">
                  Delivery location selected
                </p>

                <p className="text-xs text-green-600">
                  {formData.latitude.toFixed(6)},{" "}
                  {formData.longitude.toFixed(6)}
                </p>

              </div>

            </div>

          </div>
        )}


        {/* ===================================================
            ADDRESS TYPE
        =================================================== */}

        <div className="bg-white p-4 rounded-xl">

          <div className="grid grid-cols-3 gap-2">

            {addressTypes.map((type) => {

              const Icon = type.icon;

              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() =>
                    setAddressType(type.id)
                  }
                  className={`p-3 rounded flex flex-col items-center gap-1 ${
                    addressType === type.id
                      ? "bg-orange-100 text-[#FF7A30]"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >

                  <Icon size={20} />

                  <span>
                    {type.label}
                  </span>

                </button>
              );
            })}

          </div>

        </div>


        {/* ===================================================
            FORM INPUTS
        =================================================== */}

        <div className="bg-white p-4 rounded-xl space-y-3">

          {/* NAME */}

          <input
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="w-full p-3 border rounded"
          />


          {/* PHONE */}

          <input
            placeholder="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
            className="w-full p-3 border rounded"
          />


          {/* FLAT */}

          <input
            placeholder="Flat No"
            value={formData.flatNo}
            onChange={(e) =>
              setFormData({
                ...formData,
                flatNo: e.target.value,
              })
            }
            className="w-full p-3 border rounded"
          />


          {/* AREA */}

          <input
            placeholder="Area"
            value={formData.area}
            onChange={(e) =>
              setFormData({
                ...formData,
                area: e.target.value,
              })
            }
            className="w-full p-3 border rounded"
          />


          {/* LANDMARK */}

          <input
            placeholder="Landmark"
            value={formData.landmark}
            onChange={(e) =>
              setFormData({
                ...formData,
                landmark: e.target.value,
              })
            }
            className="w-full p-3 border rounded"
          />


          {/* CITY */}

          <input
            placeholder="City"
            value={formData.city}
            onChange={(e) =>
              setFormData({
                ...formData,
                city: e.target.value,
              })
            }
            className="w-full p-3 border rounded"
          />


          {/* STATE */}

          <input
            placeholder="State"
            value={formData.state}
            onChange={(e) =>
              setFormData({
                ...formData,
                state: e.target.value,
              })
            }
            className="w-full p-3 border rounded"
          />


          {/* PINCODE */}

          <input
            placeholder="Pincode"
            type="text"
            inputMode="numeric"
            value={formData.pincode}
            onChange={(e) =>
              setFormData({
                ...formData,
                pincode: e.target.value,
              })
            }
            className="w-full p-3 border rounded"
          />

        </div>

      </div>


      {/* =====================================================
          💾 SAVE BUTTON
      ===================================================== */}

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4">

        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-[#FF7A30] text-white py-3 rounded flex items-center justify-center gap-2 disabled:opacity-60"
        >

          <Save size={18} />

          {loading
            ? "Saving..."
            : "Save Address"}

        </button>

      </div>


      {/* =====================================================
          📍 LOCATION MODAL
      ===================================================== */}

      {showLocation && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <Location
            onLocationSelect={(lat, lng, city) => {

              console.log(
                "📍 Selected Location:",
                lat,
                lng,
                city
              );

              setFormData((prev) => ({
                ...prev,

                // 📍 IMPORTANT
                latitude: lat,
                longitude: lng,

                // 🌆 CITY
                city: city || prev.city,

                // AREA
                area:
                  localStorage.getItem(
                    "location_name"
                  ) || prev.area,
              }));

              setShowLocation(false);
            }}

            onClose={() =>
              setShowLocation(false)
            }
          />

        </div>

      )}

    </div>
  );
}