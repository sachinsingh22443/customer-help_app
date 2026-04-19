import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, MessageSquare, Home, Briefcase, MapPin, Phone } from "lucide-react";

interface DeliveryInstructionsProps {
  onBack: () => void;
  onSave?: (instructions: string, type: string) => void;
}

export function DeliveryInstructions({ onBack, onSave }: DeliveryInstructionsProps) {
  const [selectedType, setSelectedType] = useState("home");
  const [instructions, setInstructions] = useState("");
  const [contactlessDelivery, setContactlessDelivery] = useState(false);

  const deliveryTypes = [
    { id: "home", label: "Home", icon: Home },
    { id: "office", label: "Office", icon: Briefcase },
    { id: "other", label: "Other", icon: MapPin }
  ];

  const quickInstructions = [
    "Ring the doorbell",
    "Leave at the door",
    "Call upon arrival",
    "Avoid calling, dog inside",
    "Meet in lobby",
    "Leave with security"
  ];

  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0FAD6E] to-[#5F2EEA] px-6 py-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-xl neo-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#171717]" />
          </button>
          <h2 className="text-white">Delivery Instructions</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-24">
        {/* Delivery Type */}
        <div>
          <h3 className="text-[#171717] mb-3">Delivery Type</h3>
          <div className="grid grid-cols-3 gap-3">
            {deliveryTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`py-4 rounded-2xl border-2 transition-all ${
                  selectedType === type.id
                    ? "border-[#0FAD6E] bg-[#0FAD6E]/5"
                    : "border-[#171717]/10 bg-white"
                }`}
              >
                <type.icon className={`w-6 h-6 mx-auto mb-2 ${
                  selectedType === type.id ? "text-[#0FAD6E]" : "text-[#171717]/60"
                }`} />
                <p className="text-sm">{type.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Instructions */}
        <div>
          <h3 className="text-[#171717] mb-3">Quick Instructions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickInstructions.map((inst) => (
              <button
                key={inst}
                onClick={() => setInstructions(inst)}
                className={`py-3 px-4 rounded-xl text-sm text-left transition-all ${
                  instructions === inst
                    ? "bg-[#0FAD6E] text-white neo-shadow-sm"
                    : "bg-white text-[#171717] border-2 border-[#171717]/10"
                }`}
              >
                {inst}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Instructions */}
        <div>
          <h3 className="text-[#171717] mb-3">Custom Instructions</h3>
          <div className="relative">
            <MessageSquare className="absolute top-4 left-4 w-5 h-5 text-[#171717]/40" />
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="E.g., Please ring the doorbell twice..."
              className="w-full py-4 pl-12 pr-4 bg-white rounded-2xl border-2 border-[#171717]/10 focus:border-[#0FAD6E] focus:outline-none transition-colors resize-none h-32"
            />
          </div>
          <p className="text-xs text-[#171717]/40 mt-2">
            {instructions.length}/200 characters
          </p>
        </div>

        {/* Contactless Delivery */}
        <div className="bg-white rounded-2xl p-5 neo-shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#0FAD6E]/10 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-[#0FAD6E]" />
              </div>
              <div>
                <h3 className="text-[#171717]">Contactless Delivery</h3>
                <p className="text-sm text-[#171717]/60">
                  Leave order at door
                </p>
              </div>
            </div>
            <label className="relative inline-block w-14 h-8">
              <input
                type="checkbox"
                checked={contactlessDelivery}
                onChange={(e) => setContactlessDelivery(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-[#171717]/10 rounded-full peer peer-checked:bg-[#0FAD6E] transition-colors"></div>
              <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-md"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto px-6 py-4 bg-white border-t-2 border-[#171717]/5">
        <button
          onClick={() => onSave && onSave(instructions, selectedType)}
          className="w-full py-4 bg-[#0FAD6E] text-white rounded-2xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          Save Instructions
        </button>
      </div>
    </div>
  );
}