import { motion } from "motion/react";
import { Wrench, Clock } from "lucide-react";

export function MaintenanceMode() {
  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-[#5F2EEA] via-[#0FAD6E] to-[#FF7A30] opacity-10 rounded-b-[3rem]" />

      <motion.div
        className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center neo-shadow-lg mb-6"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Wrench className="w-12 h-12 text-[#5F2EEA]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <h2 className="text-[#171717] mb-3">Under Maintenance</h2>
        <p className="text-[#171717]/60 mb-8">
          We're currently upgrading our kitchen! EatUnity will be back soon with exciting new features.
        </p>

        <div className="bg-white rounded-2xl p-6 neo-shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-[#FF7A30]" />
            <p className="text-[#171717]">Estimated Time</p>
          </div>
          <p className="text-2xl font-bold text-[#5F2EEA]">2 Hours</p>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-[#171717]/40">
          Follow us on social media for updates
        </p>
      </motion.div>

      {/* Floating circles animation */}
      <motion.div
        className="absolute top-20 right-10 w-16 h-16 bg-[#0FAD6E]/20 rounded-full"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-32 left-10 w-12 h-12 bg-[#FF7A30]/20 rounded-full"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
    </div>
  );
}
