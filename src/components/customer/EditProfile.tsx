import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ChevronLeft,
  Camera,
  Save,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const BASE_URL = "https://chef-backend-1.onrender.com";

interface EditProfileProps {
  onBack: () => void;
  onSave: () => void;
}

export function EditProfile({ onBack, onSave }: EditProfileProps) {
  const [profile, setProfile] = useState<any>({
    name: "",
    email: "",
    phone: "",
    city: "",
    photo: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // =========================
  // ✅ LOAD PROFILE
  // =========================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          city: data.location || "",
          photo: data.profile_image || "",
        });
      } catch (err) {
        console.log("Profile load error:", err);
      }
    };

    fetchProfile();
  }, []);

  // =========================
  // 🖼 IMAGE SELECT
  // =========================
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      // preview instantly
      setProfile((prev: any) => ({
        ...prev,
        photo: URL.createObjectURL(file),
      }));
    }
  };

  // =========================
  // 💾 SAVE PROFILE
  // =========================
  const handleSave = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("phone", profile.phone);
      formData.append("location", profile.city);

      if (imageFile) {
        formData.append("profile_image", imageFile);
      }

      const res = await fetch(`${BASE_URL}/auth/users/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("UPDATED:", data);

      // 🔥 success
      onSave();
      onBack(); // go back to profile

    } catch (err) {
      console.log("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-32">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-br from-[#5F2EEA] to-[#8860f5] px-6 pt-12 pb-8 rounded-b-[2rem] relative overflow-hidden">

        <motion.div
          className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="flex items-center gap-4 mb-6">
          <motion.button
            onClick={onBack}
            className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>

          <h1 className="text-white flex-1">Edit Profile</h1>
        </div>

        {/* ================= PROFILE IMAGE ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">

              <ImageWithFallback
                src={profile.photo || "/default-avatar.png"}
                alt="profile"
                className="w-full h-full object-cover"
              />

            </div>

            {/* hidden file input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="profileImageInput"
            />

            {/* camera button */}
            <motion.button
              onClick={() =>
                document.getElementById("profileImageInput")?.click()
              }
              className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
            >
              <Camera className="w-5 h-5 text-[#5F2EEA]" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ================= FORM ================= */}
      <div className="px-6 mt-6 space-y-4">

        {/* NAME */}
        <div className="bg-white rounded-2xl p-6">
          <label className="text-sm mb-2 block">Full Name</label>
          <input
            value={profile.name}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
            className="w-full text-lg outline-none"
          />
        </div>

        {/* EMAIL */}
        <div className="bg-white rounded-2xl p-6">
          <label className="text-sm mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </label>
          <input
            value={profile.email}
            disabled
            className="w-full text-lg opacity-70"
          />
        </div>

        {/* PHONE */}
        <div className="bg-white rounded-2xl p-6">
          <label className="text-sm mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone
          </label>
          <input
            value={profile.phone}
            onChange={(e) =>
              setProfile({ ...profile, phone: e.target.value })
            }
            className="w-full text-lg outline-none"
          />
        </div>

        {/* CITY */}
        <div className="bg-white rounded-2xl p-6">
          <label className="text-sm mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            City
          </label>
          <input
            value={profile.city}
            onChange={(e) =>
              setProfile({ ...profile, city: e.target.value })
            }
            className="w-full text-lg outline-none"
          />
        </div>
      </div>

      {/* ================= SAVE BUTTON ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-30">
        <div className="max-w-[390px] mx-auto px-6 py-4">

          <motion.button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#5F2EEA] to-[#8860f5] text-white py-4 rounded-xl flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <Save className="w-5 h-5" />
            <span>
              {loading ? "Saving..." : "Save Changes"}
            </span>
          </motion.button>

        </div>
      </div>
    </div>
  );
}