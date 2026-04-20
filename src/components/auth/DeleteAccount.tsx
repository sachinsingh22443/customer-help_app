import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, AlertTriangle, Trash2 } from "lucide-react";

interface DeleteAccountProps {
  onBack: () => void;
  onDeleted: () => void;
}

export function DeleteAccount({ onBack, onDeleted }: DeleteAccountProps) {
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://chef-backend-1.onrender.com"; // ✅ FIX

  const reasons = [
    "Not using the app anymore",
    "Found a better alternative",
    "Privacy concerns",
    "Too expensive",
    "Technical issues",
    "Other",
  ];

  const canDelete = reason && confirmText === "DELETE" && acceptedTerms;

  const handleDelete = async () => {
    if (!canDelete) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Session expired, please login again");
        return;
      }

      const res = await fetch(`${BASE_URL}/auth/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", // ✅ FIX
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.clear();
        sessionStorage.clear();

        alert("Account deleted successfully");

        onDeleted();
      } else {
        alert(data.detail || "Failed to delete account");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col overflow-y-auto pb-20">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-[#FF7A30] to-[#5F2EEA] px-6 py-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#171717]" />
          </button>
          <h2 className="text-white">Delete Account</h2>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >

          {/* Warning */}
          <div className="bg-red-100 border border-red-400 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="text-red-500" />
            <p className="text-sm">
              This action is permanent. All your data will be deleted.
            </p>
          </div>

          {/* Reasons */}
          <div>
            {reasons.map((r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={`w-full py-3 mb-2 rounded-xl border ${
                  reason === r ? "bg-orange-100 border-orange-500" : ""
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Confirm */}
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder='Type "DELETE"'
            className="w-full py-3 px-4 border rounded-xl"
          />

          {/* Checkbox */}
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            I understand this is permanent
          </label>

          {/* Button */}
          <button
            onClick={handleDelete}
            disabled={!canDelete || loading}
            className="w-full bg-red-500 text-white py-4 rounded-xl"
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>

          <button
            onClick={onBack}
            className="w-full py-4 border rounded-xl"
          >
            Cancel
          </button>

        </motion.div>
      </div>
    </div>
  );
}