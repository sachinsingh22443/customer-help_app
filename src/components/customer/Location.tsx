import { useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect } from "react";
// import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

declare const google: any;

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
  

  // Current Location
  const handleAutoLocation = async () => {
    try {
      setLoading(true);
      setError("");

      if (window.Capacitor?.isNativePlatform()) {
           const permission = await Geolocation.requestPermissions();

  if (
    permission.location !== "granted" &&
    permission.coarseLocation !== "granted"
  ) {
    setError("Location permission denied");
    setLoading(false);
    return;
  }
}

      

  let lat: number;
let lng: number;

if (window.Capacitor?.isNativePlatform()) {
    let bestPosition = null;

for (let i = 0; i < 3; i++) {
  const pos = await Geolocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 0,
  });

  if (
    !bestPosition ||
    pos.coords.accuracy < bestPosition.coords.accuracy
  ) {
    bestPosition = pos;
  }
}

lat = bestPosition.coords.latitude;
lng = bestPosition.coords.longitude;

// console.log(
//   "Best Accuracy:",
//   bestPosition.coords.accuracy
// );

  

} else {
  const position = await new Promise<GeolocationPosition>(
    (resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 60000,
        }
      );
    }
  );

  lat = position.coords.latitude;
  lng = position.coords.longitude;

}


      // console.log("✅ GPS Coordinates");
      // console.log("Latitude:", lat);
      // console.log("Longitude:", lng);

     await loader?.load();

const geocoder = new google.maps.Geocoder();

geocoder.geocode(
  {
    location: { lat, lng },
  },
  (results: any, status: any) => {
    const locationName =
      status === "OK" && results?.[0]
        ? results[0].formatted_address
        : "Current Location";

    localStorage.setItem("lat", lat.toString());
    localStorage.setItem("lng", lng.toString());
    localStorage.setItem("location_name", locationName);

    onLocationSelect(lat, lng, locationName);

    setLoading(false);
    onClose();
  }
);
    } catch (err: any) {
      // console.error("Location Error:", err);

      setError(err?.message || "Unable to fetch location");
      setLoading(false);
    }
  };


const [suggestions, setSuggestions] = useState<any[]>([]);
const [loader, setLoader] = useState<Loader | null>(null);

useEffect(() => {

  
  const mapsLoader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: "weekly",
    libraries: ["places"],
  });



  setLoader(mapsLoader);
}, []);


const searchPlaces = async (query: string) => {
  if (!loader || query.length < 3) {
    setSuggestions([]);
    return;
  }

  try {
    await loader.load();

    // console.log("Google:", !!window.google);
    // console.log("Places:", !!window.google?.maps?.places);

    const service =
      new google.maps.places.AutocompleteService();

    service.getPlacePredictions(
      {
        input: query,
        componentRestrictions: { country: "in" },
      },
      (predictions: any, status: any) => {
        // alert(
        //   `STATUS: ${status}\nCOUNT: ${
        //     predictions?.length || 0
        //   }`
        // );

        // console.log("STATUS:", status);
        // console.log("PREDICTIONS:", predictions);

        setSuggestions(predictions || []);
      }
    );
  } catch (err) {
    // alert("ERROR: " + JSON.stringify(err));
    setError("Location search failed");
  }
};


const handlePlaceSelect = async (
  placeId: string,
  description: string
) => {
  if (!loader) return;

  await loader.load();

  const geocoder = new google.maps.Geocoder();

  geocoder.geocode(
    { placeId },
    (results, status) => {
      if (
        status === "OK" &&
        results &&
        results[0]
      ) {
        const loc = results[0].geometry.location;

        const lat = loc.lat();
        const lng = loc.lng();

        localStorage.setItem("lat", lat.toString());
        localStorage.setItem("lng", lng.toString());
        localStorage.setItem(
          "location_name",
          description
        );
         
        setSuggestions([]);
        setManualLocation(description);

        onLocationSelect(
          lat,
          lng,
          description
        );

        onClose();
      }
    }
  );
};

  return (
  <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-5">

    {/* =====================================================
        LOCATION MODAL
    ===================================================== */}

    <motion.div
      initial={{
        opacity: 0,
        y: 40,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.3,
      }}
      className="relative w-full max-w-md overflow-hidden rounded-t-[2.5rem] bg-[#F8F7F4] shadow-[0_-20px_60px_rgba(0,0,0,0.22)] sm:rounded-[2.5rem]"
    >

      {/* =================================================
          PREMIUM TOP AREA
      ================================================= */}

      <div className="relative overflow-hidden bg-gradient-to-br from-[#24104D] via-[#5F2EEA] to-[#FF7A30] px-6 pb-7 pt-6">

        {/* Glow */}

        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-orange-300/15 blur-3xl" />


        <div className="relative">

          {/* TOP BAR */}

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">

                <span className="text-lg">
                  📍
                </span>

              </div>

              <div>

                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/50">
                  Eat Unity
                </p>

                <p className="mt-0.5 text-xs font-bold text-white">
                  Delivery Location
                </p>

              </div>

            </div>


            <motion.button
              whileTap={{
                scale: 0.9,
              }}
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white backdrop-blur-md"
            >

              <span className="text-sm">
                ✕
              </span>

            </motion.button>

          </div>


          {/* TITLE */}

          <div className="mt-7">

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/50">
              Find food near you
            </p>

            <h2 className="mt-2 text-[28px] font-bold leading-tight tracking-tight text-white">
              Where should we
              <span className="block text-orange-200">
                deliver?
              </span>
            </h2>

            <p className="mt-3 max-w-xs text-[10px] leading-5 text-white/60">
              Select your location to discover nearby chefs,
              fresh meals and tomorrow's specials.
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          BODY
      ================================================= */}

      <div className="px-5 pb-7 pt-5">


        {/* =================================================
            CURRENT LOCATION
        ================================================= */}

        <motion.button
          whileTap={{
            scale: 0.98,
          }}
          onClick={handleAutoLocation}
          disabled={loading}
          className="group relative w-full overflow-hidden rounded-[1.7rem] bg-gradient-to-r from-[#FF7A30] to-[#F45B2A] p-[1px] shadow-[0_12px_30px_rgba(255,122,48,0.18)] disabled:opacity-60"
        >

          <div className="relative flex items-center gap-3 rounded-[1.65rem] bg-gradient-to-r from-[#FF7A30] to-[#F45B2A] px-4 py-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">

              {loading ? (

                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

              ) : (

                <span className="text-xl">
                  🎯
                </span>

              )}

            </div>


            <div className="flex-1 text-left">

              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/60">
                {loading
                  ? "Please wait"
                  : "Fastest option"}
              </p>

              <p className="mt-1 text-sm font-bold text-white">
                {loading
                  ? "Detecting your location..."
                  : "Use Current Location"}
              </p>

              <p className="mt-1 text-[8px] text-white/60">
                GPS powered • Accurate nearby results
              </p>

            </div>


            {!loading && (

              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15">

                <span className="text-sm">
                  →
                </span>

              </div>

            )}

          </div>

        </motion.button>


        {/* =================================================
            DIVIDER
        ================================================= */}

        <div className="my-5 flex items-center gap-3">

          <div className="h-px flex-1 bg-slate-200" />

          <span className="rounded-full bg-white px-3 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400 shadow-sm">
            or search manually
          </span>

          <div className="h-px flex-1 bg-slate-200" />

        </div>


        {/* =================================================
            SEARCH BOX
        ================================================= */}

        <div className="relative">

          <div className="pointer-events-none absolute left-4 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center">

            <span className="text-base">
              🔎
            </span>

          </div>


          <input
            type="text"
            placeholder="Search village, area, city..."
            value={manualLocation}
            onChange={(e) => {

              setManualLocation(
                e.target.value
              );

              searchPlaces(
                e.target.value
              );

            }}
            className="h-14 w-full rounded-[1.4rem] border border-slate-200 bg-white pl-11 pr-4 text-xs font-medium text-slate-800 outline-none shadow-sm placeholder:text-slate-400 focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
          />


          {manualLocation.length > 0 && (

            <button
              onClick={() => {

                setManualLocation("");
                setSuggestions([]);

              }}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl bg-slate-100 text-slate-400"
            >

              <span className="text-xs">
                ✕
              </span>

            </button>

          )}

        </div>


        {/* =================================================
            SEARCH HINT
        ================================================= */}

        {manualLocation.length < 3 &&
          !suggestions.length && (

          <div className="mt-3 flex items-center gap-2 px-1">

            <span className="text-[10px]">
              💡
            </span>

            <p className="text-[8px] leading-4 text-slate-400">
              Try searching for your area, village,
              landmark or city.
            </p>

          </div>

        )}


        {/* =================================================
            GOOGLE SUGGESTIONS
        ================================================= */}

        {suggestions.length > 0 && (

          <motion.div
            initial={{
              opacity: 0,
              y: -5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-3 max-h-60 overflow-y-auto rounded-[1.5rem] border border-slate-100 bg-white shadow-[0_15px_35px_rgba(30,20,70,0.10)]"
          >

            <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-3">

              <span className="text-[10px]">
                📍
              </span>

              <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Suggested locations
              </p>

            </div>


            {suggestions.map(
              (
                item: any,
                index: number
              ) => (

                <motion.button
                  key={item.place_id}

                  initial={{
                    opacity: 0,
                  }}

                  animate={{
                    opacity: 1,
                  }}

                  transition={{
                    delay:
                      index * 0.03,
                  }}

                  onClick={() =>
                    handlePlaceSelect(
                      item.place_id,
                      item.description
                    )
                  }

                  className="flex w-full items-center gap-3 border-b border-slate-50 px-4 py-3.5 text-left transition hover:bg-purple-50 active:bg-purple-100"
                >

                  {/* ICON */}

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50">

                    <span className="text-sm">
                      📍
                    </span>

                  </div>


                  {/* TEXT */}

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-[10px] font-bold text-slate-800">
                      {item.structured_formatting
                        ?.main_text ||
                        item.description}
                    </p>

                    <p className="mt-1 truncate text-[8px] leading-4 text-slate-400">
                      {item.structured_formatting
                        ?.secondary_text ||
                        "Location"}
                    </p>

                  </div>


                  <span className="text-slate-300">
                    →
                  </span>

                </motion.button>

              )
            )}

          </motion.div>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4"
          >

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100">

                <span className="text-sm">
                  ⚠️
                </span>

              </div>


              <div>

                <p className="text-[10px] font-bold text-red-700">
                  Location unavailable
                </p>

                <p className="mt-1 text-[9px] leading-4 text-red-500">
                  {error}
                </p>

              </div>

            </div>

          </motion.div>

        )}


        {/* =================================================
            PRIVACY / TRUST
        ================================================= */}

        {!error && !loading && (

          <div className="mt-5 flex items-center justify-center gap-2">

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">

              <span className="text-[10px]">
                🔒
              </span>

            </div>

            <p className="text-[8px] leading-4 text-slate-400">
              Your location is used only to show
              nearby food & chefs.
            </p>

          </div>

        )}

      </div>

    </motion.div>

  </div>
);
}