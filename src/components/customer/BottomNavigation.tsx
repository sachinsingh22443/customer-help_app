import { motion } from "motion/react";
import { Home, ShoppingBag, User, Sparkles } from "lucide-react";

interface BottomNavigationProps {
  activeTab: "home" | "orders" | "profile" | "specials";
  onTabChange: (tab: "home" | "orders" | "profile" | "specials") => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "home" as const, icon: Home, label: "Home" },
    { id: "specials" as const, icon: Sparkles, label: "Specials" },
    { id: "orders" as const, icon: ShoppingBag, label: "Orders" },
    { id: "profile" as const, icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#171717]/5 z-30">
      <div className="max-w-[390px] mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center gap-1 relative"
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className={`relative ${
                    isActive ? "text-[#FF7A30]" : "text-[#171717]/40"
                  }`}
                  animate={isActive ? { y: [0, -3, 0] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-6 h-6" strokeWidth={2} />
                  
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF7A30] rounded-full"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>

                <span
                  className={`text-xs ${
                    isActive ? "text-[#FF7A30]" : "text-[#171717]/40"
                  }`}
                >
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Curved indicator background */}
        <svg
          className="absolute bottom-full left-0 w-full h-6 pointer-events-none"
          viewBox="0 0 390 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 24V12C0 5.37258 5.37258 0 12 0H378C384.627 0 390 5.37258 390 12V24H0Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}
