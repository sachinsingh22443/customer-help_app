import { motion } from "motion/react";
import { User, ChefHat, Shield } from "lucide-react";

interface RoleSelectionProps {
  onSelectRole: (role: "customer" | "chef" | "admin") => void;
}

const roles = [
  {
    id: "customer" as const,
    title: "Customer",
    description: "Order healthy homemade meals",
    icon: User,
    color: "from-[#FF7A30] to-[#ff9d5c]",
    emoji: "🍽️",
  },
  {
    id: "chef" as const,
    title: "Chef",
    description: "Share your culinary passion",
    icon: ChefHat,
    color: "from-[#0FAD6E] to-[#3ec98d]",
    emoji: "👨‍🍳",
  },
  {
    id: "admin" as const,
    title: "Admin",
    description: "Manage platform operations",
    icon: Shield,
    color: "from-[#5F2EEA] to-[#8860f5]",
    emoji: "⚙️",
  },
];

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col px-6 py-12 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-[#171717] mb-2">Choose Your Role</h1>
        <p className="text-[#171717]/60">How would you like to use EatUnity?</p>
      </motion.div>

      {/* Role cards */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        {roles.map((role, index) => {
          const Icon = role.icon;
          return (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectRole(role.id)}
              className="group relative overflow-hidden"
            >
              <div className="bg-white rounded-2xl p-6 neo-shadow hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all duration-300">
                <div className="flex items-center gap-4">
                  {/* Icon container */}
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center relative overflow-hidden`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-8 h-8 text-white relative z-10" strokeWidth={2} />
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>

                  {/* Text content */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[#171717]">{role.title}</h3>
                      <span className="text-2xl">{role.emoji}</span>
                    </div>
                    <p className="text-[#171717]/60">{role.description}</p>
                  </div>

                  {/* Arrow indicator */}
                  <motion.div
                    className="text-[#171717]/30"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </div>
              </div>

              {/* Hover gradient effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${role.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity pointer-events-none`}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Footer text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-[#171717]/50 text-sm mt-8"
      >
        You can always change your role later in settings
      </motion.p>
    </div>
  );
}
