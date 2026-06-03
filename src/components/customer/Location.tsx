import { useState } from "react";
import { Geolocation } from "@capacitor/geolocation";

type Props = {
  onLocationSelect: (lat: number, lng: number, city: string) => void;
  onClose: () => void;
};

export default function Location({
  onLocationSelect,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  const [error, setError] = useState("");

  // Reverse Geocoding
  const getCityName = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );

      if (!res.ok) {
        throw new Error("Reverse geocoding failed");
      }

      const data = await res.json();

      console.log("📍 Reverse Response:", data);

      const address = data.address || {};

      const locationName =
        address.village ||
        address.suburb ||
        address.town ||
        address.city ||
        address.county ||
        address.state_district ||
        address.state ||
        data.display_name ||
        "Unknown Location";

      return locationName;
    } catch (err) {
      console.error("Reverse Geocoding Error:", err);
      return "Unknown Location";
    }
  };

  // Current Location
  const handleAutoLocation = async () => {
    try {
      setLoading(true);
      setError("");

      const permission = await Geolocation.requestPermissions();

      console.log("Permission:", permission);

      if (
        permission.location !== "granted" &&
        permission.coarseLocation !== "granted"
      ) {
        setError("Location permission denied");
        setLoading(false);
        return;
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      console.log("✅ GPS Coordinates");
      console.log("Latitude:", lat);
      console.log("Longitude:", lng);
      console.log("Accuracy:", position.coords.accuracy);

      const locationName = await getCityName(lat, lng);

      localStorage.setItem("lat", lat.toString());
      localStorage.setItem("lng", lng.toString());
      localStorage.setItem("location_name", locationName);

      onLocationSelect(lat, lng, locationName);

      setLoading(false);
      onClose();
    } catch (err: any) {
      console.error("Location Error:", err);

      setError(err?.message || "Unable to fetch location");
      setLoading(false);
    }
  };

  // Manual Search
  const handleManualLocation = async () => {
    if (!manualLocation.trim()) {
      setError("Please enter a location");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          manualLocation
        )}&limit=1`
      );

      const data = await res.json();

      console.log("🔍 Search Result:", data);

      if (data.length === 0) {
        setError("Location not found");
        setLoading(false);
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);

      const locationName = await getCityName(lat, lng);

      localStorage.setItem("lat", lat.toString());
      localStorage.setItem("lng", lng.toString());
      localStorage.setItem("location_name", locationName);

      onLocationSelect(lat, lng, locationName);

      setLoading(false);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-black"
      >
        ✖
      </button>

      <h2 className="text-xl font-semibold text-center mb-5">
        Choose your location
      </h2>

      <button
        onClick={handleAutoLocation}
        disabled={loading}
        className="w-full bg-orange-500 text-white py-3 rounded-xl mb-4 font-medium disabled:opacity-50"
      >
        {loading ? "Detecting location..." : "📍 Use Current Location"}
      </button>

      <div className="text-center text-gray-400 mb-3">OR</div>

      <input
        type="text"
        placeholder="Search village, area, city..."
        value={manualLocation}
        onChange={(e) => setManualLocation(e.target.value)}
        className="w-full border p-3 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-orange-400"
      />

      <button
        onClick={handleManualLocation}
        disabled={loading}
        className="w-full bg-green-500 text-white py-3 rounded-xl font-medium disabled:opacity-50"
      >
        Search Location
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">
          {error}
        </p>
      )}
    </div>
  );
}