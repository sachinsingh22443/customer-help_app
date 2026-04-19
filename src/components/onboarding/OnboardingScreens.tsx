import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChefHat, Heart, Sparkles, ArrowRight } from "lucide-react";

const onboardingData = [
  {
    id: 1,
    title: "Authentic Homemade Food",
    description: "Discover verified home chefs serving delicious, healthy meals with love and tradition",
    icon: ChefHat,
    color: "from-[#FF7A30] to-[#ff9d5c]",
    illustration: "🍲",
  },
  {
    id: 2,
    title: "Health Meets Taste",
    description: "Personalized diet plans from nutritionists and trainers for your fitness journey",
    icon: Heart,
    color: "from-[#0FAD6E] to-[#3ec98d]",
    illustration: "🥗",
  },
  {
    id: 3,
    title: "Tomorrow's Special",
    description: "Pre-order limited edition chef specials and never miss your favorite dishes",
    icon: Sparkles,
    color: "from-[#5F2EEA] to-[#8860f5]",
    illustration: "✨",
  },
];

export function OnboardingScreens({ onComplete }: { onComplete: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const current = onboardingData[currentIndex];
  const Icon = current.icon;

  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col relative overflow-hidden">
      {/* Skip button */}
      <div className="absolute top-8 right-6 z-20">
        <button
          onClick={handleSkip}
          className="text-[#171717]/60 px-4 py-2 hover:text-[#171717] transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center w-full"
          >
            {/* Gradient circle background */}
            <motion.div
              className={`w-72 h-72 rounded-full bg-gradient-to-br ${current.color} flex items-center justify-center mb-12 relative neo-shadow-lg`}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="w-24 h-24 text-white" strokeWidth={1.5} />
              </div>

              {/* Emoji illustration */}
              <motion.div
                className="text-8xl absolute"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {current.illustration}
              </motion.div>

              {/* Decorative floating elements */}
              <motion.div
                className="absolute top-8 right-8 w-4 h-4 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-12 left-8 w-3 h-3 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
              />
            </motion.div>

            {/* Text content */}
            <motion.h2
              className="text-center mb-4 text-[#171717]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {current.title}
            </motion.h2>

            <motion.p
              className="text-center text-[#171717]/70 max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {current.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="px-8 pb-12">
        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {onboardingData.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-[#FF7A30]"
                  : "w-2 bg-[#171717]/20"
              }`}
              animate={index === currentIndex ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>

        {/* Next button */}
        <motion.button
          onClick={handleNext}
          className="w-full bg-[#FF7A30] text-white py-4 rounded-2xl flex items-center justify-center gap-2 neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          whileTap={{ scale: 0.98 }}
        >
          <span>{currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
