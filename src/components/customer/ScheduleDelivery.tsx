import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, RefreshCw } from "lucide-react";

interface ScheduleDeliveryProps {
  onBack: () => void;
  onSchedule?: (date: string, time: string, recurring: boolean) => void;
}

export function ScheduleDelivery({ onBack, onSchedule }: ScheduleDeliveryProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState("daily");

  // Generate next 7 days
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return days;
  };

  const timeSlots = [
    { id: "breakfast", label: "Breakfast", time: "7:00 AM - 9:00 AM", icon: "🌅" },
    { id: "lunch", label: "Lunch", time: "12:00 PM - 2:00 PM", icon: "☀️" },
    { id: "snack", label: "Evening Snack", time: "4:00 PM - 6:00 PM", icon: "🌤️" },
    { id: "dinner", label: "Dinner", time: "7:00 PM - 9:00 PM", icon: "🌙" }
  ];

  const days = getNextDays();

  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#5F2EEA] to-[#0FAD6E] px-6 py-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-xl neo-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#171717]" />
          </button>
          <h2 className="text-white">Schedule Delivery</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-24">
        {/* Select Date */}
        <div>
          <h3 className="text-[#171717] mb-3">Select Date</h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {days.map((day) => (
              <button
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`flex-shrink-0 w-20 py-4 rounded-2xl border-2 transition-all ${
                  selectedDate === day.date
                    ? "border-[#5F2EEA] bg-[#5F2EEA] text-white neo-shadow-sm"
                    : "border-[#171717]/10 bg-white text-[#171717]"
                }`}
              >
                <p className="text-xs mb-1">{day.day}</p>
                <p className="text-2xl font-bold mb-1">{day.dayNum}</p>
                <p className="text-xs opacity-70">{day.month}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Select Time Slot */}
        <div>
          <h3 className="text-[#171717] mb-3">Select Time Slot</h3>
          <div className="space-y-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedTime(slot.id)}
                className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                  selectedTime === slot.id
                    ? "border-[#5F2EEA] bg-[#5F2EEA]/5"
                    : "border-[#171717]/10 bg-white"
                }`}
              >
                <div className="w-12 h-12 bg-[#FFF8F0] rounded-xl flex items-center justify-center text-2xl">
                  {slot.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-[#171717] mb-1">{slot.label}</h3>
                  <p className="text-sm text-[#171717]/60">{slot.time}</p>
                </div>
                {selectedTime === slot.id && (
                  <div className="w-6 h-6 bg-[#5F2EEA] rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Recurring Delivery */}
        <div className="bg-white rounded-2xl p-5 neo-shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FF7A30]/10 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-[#FF7A30]" />
              </div>
              <div>
                <h3 className="text-[#171717]">Recurring Delivery</h3>
                <p className="text-sm text-[#171717]/60">
                  Set up daily or weekly
                </p>
              </div>
            </div>
            <label className="relative inline-block w-14 h-8">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-[#171717]/10 rounded-full peer peer-checked:bg-[#FF7A30] transition-colors"></div>
              <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-md"></div>
            </label>
          </div>

          {isRecurring && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2 pt-4 border-t-2 border-[#171717]/5"
            >
              <button
                onClick={() => setRecurringType("daily")}
                className={`w-full py-3 px-4 rounded-xl text-left transition-all ${
                  recurringType === "daily"
                    ? "bg-[#FF7A30] text-white"
                    : "bg-[#FFF8F0] text-[#171717]"
                }`}
              >
                Daily Delivery
              </button>
              <button
                onClick={() => setRecurringType("weekly")}
                className={`w-full py-3 px-4 rounded-xl text-left transition-all ${
                  recurringType === "weekly"
                    ? "bg-[#FF7A30] text-white"
                    : "bg-[#FFF8F0] text-[#171717]"
                }`}
              >
                Weekly Delivery
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto px-6 py-4 bg-white border-t-2 border-[#171717]/5">
        <button
          onClick={() => onSchedule && onSchedule(selectedDate, selectedTime, isRecurring)}
          disabled={!selectedDate || !selectedTime}
          className="w-full py-4 bg-[#5F2EEA] text-white rounded-2xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Confirm Schedule
        </button>
      </div>
    </div>
  );
}