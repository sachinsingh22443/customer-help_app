import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, AlertTriangle, Trash2 } from "lucide-react";

const BASE_URL = "https://chef-backend-1.onrender.com";

interface DeleteAccountProps {
  onBack: () => void;
  onDeleted: () => void;
}

export function DeleteAccount({ onBack, onDeleted }: DeleteAccountProps) {
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const reasons = [
    "Not using the app anymore",
    "Found a better alternative",
    "Privacy concerns",
    "Too expensive",
    "Technical issues",
    "Other",
  ];

  const canDelete = reason && confirmText === "DELETE" && acceptedTerms;

  // 🔥 DELETE LOGIC
  const handleDelete = async () => {
    if (!canDelete) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/auth/delete-account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }), // optional
      });

      if (res.ok) {
        // 🔥 clear user data
        localStorage.clear();
        sessionStorage.clear();

        alert("Account deleted successfully");

        onDeleted(); // redirect to login
      } else {
        const data = await res.json();
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
            className="w-10 h-10 bg-white rounded-xl neo-shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#171717]" />
          </button>
          <h2 className="text-white">Delete Account</h2>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >

          {/* Warning */}
          <div className="bg-[#FF7A30]/10 border-2 border-[#FF7A30] rounded-2xl p-6 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-[#FF7A30]" />
            <div>
              <h3 className="mb-2">Warning: This action is permanent</h3>
              <p className="text-sm text-[#171717]/70">
                All your data will be permanently deleted.
              </p>
            </div>
          </div>

          {/* Reasons */}
          <div>
            <label className="block text-sm mb-3">
              Why are you leaving? (Optional)
            </label>
            <div className="space-y-2">
              {reasons.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`w-full py-3 px-4 rounded-xl border-2 text-left ${
                    reason === r
                      ? "border-[#FF7A30] bg-[#FF7A30]/5"
                      : "border-[#171717]/10 bg-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Confirm */}
          <div>
            <label className="block text-sm mb-2">
              Type "DELETE" to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full py-4 px-5 bg-white rounded-2xl border-2 border-[#171717]/10 focus:border-[#FF7A30]"
            />
          </div>

          {/* Checkbox */}
          <div className="flex gap-3">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-5 h-5 accent-[#FF7A30]"
            />
            <p className="text-sm text-[#171717]/70">
              I understand this action is permanent
            </p>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={!canDelete || loading}
            className="w-full py-4 bg-[#FF7A30] text-white rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" />
            {loading ? "Deleting..." : "Delete My Account"}
          </button>

          {/* Cancel */}
          <button
            onClick={onBack}
            className="w-full py-4 bg-white rounded-2xl"
          >
            Cancel
          </button>

        </motion.div>
      </div>
    </div>
  );
}