import { motion } from "motion/react";
import { ShieldAlert, Mail, Phone } from "lucide-react";

interface AccountBlockedProps {
  reason?: string;
  onContactSupport?: () => void;
  onBack: () => void;
}

export function AccountBlocked({ reason = "Violation of Terms of Service", onContactSupport, onBack }: AccountBlockedProps) {
  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-[#FF7A30] to-[#5F2EEA] opacity-10 rounded-b-[3rem]" />

      <motion.div
        className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center neo-shadow-lg mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        <ShieldAlert className="w-12 h-12 text-[#FF7A30]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <h2 className="text-[#171717] mb-3">Account Blocked</h2>
        <p className="text-[#171717]/60 mb-8">
          Your account has been temporarily blocked due to a violation of our terms of service.
        </p>

        <div className="bg-white rounded-2xl p-6 neo-shadow-sm mb-6 text-left">
          <h3 className="text-[#171717] mb-3">Reason:</h3>
          <p className="text-sm text-[#171717]/70 mb-4">
            {reason}
          </p>
          
          <div className="h-px bg-[#171717]/10 my-4" />
          
          <h3 className="text-[#171717] mb-3">What's Next?</h3>
          <ul className="space-y-2 text-sm text-[#171717]/70">
            <li className="flex items-start gap-2">
              <span className="text-[#FF7A30] mt-1">1.</span>
              <span>Review our Terms of Service</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF7A30] mt-1">2.</span>
              <span>Contact our support team</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF7A30] mt-1">3.</span>
              <span>Wait for account review</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={onContactSupport}
            className="w-full py-4 bg-[#FF7A30] text-white rounded-2xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Contact Support
          </button>

          <div className="grid grid-cols-2 gap-3">
            <a
              href="mailto:support@eatunity.com"
              className="py-3 px-4 bg-white text-[#171717] rounded-xl neo-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
            <a
              href="tel:+911234567890"
              className="py-3 px-4 bg-white text-[#171717] rounded-xl neo-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-[#171717]/40">
          Account ID: EU-{Math.random().toString(36).substr(2, 9).toUpperCase()}
        </p>
      </motion.div>
    </div>
  );
}