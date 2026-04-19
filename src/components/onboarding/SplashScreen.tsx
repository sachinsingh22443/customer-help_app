import { motion } from "motion/react";
import { UtensilsCrossed, Sparkles } from "lucide-react";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => setTimeout(onComplete, 2500)}
    >
      {/* Decorative circles */}
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-32 left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, delay: 0.5, repeat: Infinity }}
      />

      {/* Logo and brand */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo icon with morph animation */}
        <motion.div
          className="relative mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.5 }}
        >
          <motion.div
            className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center relative"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, delay: 1, repeat: Infinity }}
          >
            <UtensilsCrossed className="w-12 h-12 text-[#FF7A30]" strokeWidth={2.5} />
            
            {/* Sparkle effects */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 2, delay: 1.2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-yellow-300 fill-yellow-300" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          className="text-white text-5xl tracking-tight mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          EatUnity
        </motion.h1>

        <motion.p
          className="text-white/90 text-center px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Ghar Ka Khana, Swad & Sehat Together
        </motion.p>

        {/* Loading indicator */}
        <motion.div
          className="mt-8 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
