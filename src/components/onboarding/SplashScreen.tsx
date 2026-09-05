import { motion } from "motion/react";
import { UtensilsCrossed, Sparkles, Heart } from "lucide-react";

export function SplashScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FFF8F0] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 1000);
      }}
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF3E8]" />

      {/* Orange glow */}
      <motion.div
        className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-[#FF7A30]/15 blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Green glow */}
      <motion.div
        className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-[#0FAD6E]/15 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          delay: 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Purple glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-[#5F2EEA]/10 blur-3xl -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* =====================================================
          FLOATING FOOD DOTS
      ====================================================== */}

      <motion.div
        className="absolute top-[22%] left-[15%] w-3 h-3 rounded-full bg-[#FF7A30]/30"
        animate={{
          y: [0, -12, 0],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
        }}
      />

      <motion.div
        className="absolute top-[30%] right-[16%] w-2 h-2 rounded-full bg-[#0FAD6E]/40"
        animate={{
          y: [0, 10, 0],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2.2,
          delay: 0.3,
          repeat: Infinity,
        }}
      />

      <motion.div
        className="absolute bottom-[25%] right-[20%] w-3 h-3 rounded-full bg-[#5F2EEA]/25"
        animate={{
          y: [0, -10, 0],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2.8,
          delay: 0.5,
          repeat: Infinity,
        }}
      />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 flex flex-col items-center px-6 text-center">

        {/* LOGO */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.5,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            type: "spring",
            bounce: 0.45,
          }}
          className="relative"
        >
          {/* Outer ring */}
          <motion.div
            className="absolute -inset-3 rounded-[2rem] border border-[#FF7A30]/20"
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
            }}
          />

          {/* Logo box */}
          <motion.div
            className="relative w-28 h-28 rounded-[2rem] bg-gradient-to-br from-[#FF7A30] via-[#FF8D4A] to-[#5F2EEA] flex items-center justify-center shadow-2xl"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <UtensilsCrossed
              className="w-14 h-14 text-white"
              strokeWidth={2}
            />

            {/* Sparkle */}
            <motion.div
              className="absolute -top-3 -right-3 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center"
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Sparkles
                className="w-5 h-5 text-[#FF7A30]"
                fill="currentColor"
              />
            </motion.div>

            {/* Heart */}
            <motion.div
              className="absolute -bottom-2 -left-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center"
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
              }}
            >
              <Heart
                className="w-4 h-4 text-[#0FAD6E]"
                fill="currentColor"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* =====================================================
            BRAND NAME
        ====================================================== */}

        <motion.h1
          className="mt-8 text-4xl font-bold tracking-tight text-[#171717]"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.45,
            duration: 0.7,
          }}
        >
          Eat<span className="text-[#FF7A30]">Unity</span>
        </motion.h1>

        {/* =====================================================
            TAGLINE
        ====================================================== */}

        <motion.div
          className="mt-4"
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.75,
            duration: 0.7,
          }}
        >
          <p className="text-[#171717] text-lg font-semibold">
            Ghar ka Khana
          </p>

          <p className="mt-1 text-sm font-medium">
            <span className="text-[#FF7A30]">
              Swad bhi
            </span>

            <span className="text-[#171717]/40 mx-2">
              •
            </span>

            <span className="text-[#0FAD6E]">
              Sehat bhi
            </span>

            <span className="ml-1">
              ❤️
            </span>
          </p>
        </motion.div>

        {/* =====================================================
            SHORT BRAND DESCRIPTION
        ====================================================== */}

        <motion.p
          className="mt-5 max-w-xs text-sm text-[#171717]/55 leading-relaxed"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1,
            duration: 0.7,
          }}
        >
          Homemade meals from trusted local chefs,
          made fresh with love.
        </motion.p>

        {/* =====================================================
            LOADING
        ====================================================== */}

        <motion.div
          className="mt-8 flex items-center gap-2"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1.3,
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[#FF7A30]"
              animate={{
                y: [0, -6, 0],
                opacity: [0.35, 1, 0.35],
              }}
              transition={{
                duration: 0.9,
                delay: i * 0.18,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

      </div>
    </motion.div>
  );
}