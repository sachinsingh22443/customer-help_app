import { motion } from "motion/react";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6">
      {/* Animated Logo */}
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] rounded-3xl flex items-center justify-center neo-shadow mb-6"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="text-4xl">🍽️</span>
      </motion.div>

      {/* Loading Dots */}
      <div className="flex items-center gap-2 mb-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-[#FF7A30] rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Message */}
      <motion.p
        className="text-[#171717]/60 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>
    </div>
  );
}
