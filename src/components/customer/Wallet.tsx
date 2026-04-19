import { motion } from "motion/react";
import { ArrowLeft, Wallet as WalletIcon, Plus, ArrowDownLeft, ArrowUpRight, TrendingUp } from "lucide-react";

interface WalletProps {
  onBack: () => void;
  onAddMoney?: () => void;
}

export function Wallet({ onBack, onAddMoney }: WalletProps) {
  const walletData = {
    balance: 1250,
    transactions: [
      { id: "1", type: "credit", amount: 150, date: "28 Feb 2026", description: "Refund for Order #12345", status: "completed" },
      { id: "2", type: "debit", amount: 459, date: "27 Feb 2026", description: "Order Payment #12344", status: "completed" },
      { id: "3", type: "credit", amount: 100, date: "25 Feb 2026", description: "Cashback Reward", status: "completed" },
      { id: "4", type: "credit", amount: 500, date: "24 Feb 2026", description: "Added to Wallet", status: "completed" },
      { id: "5", type: "debit", amount: 299, date: "23 Feb 2026", description: "Order Payment #12340", status: "completed" },
      { id: "6", type: "credit", amount: 200, date: "22 Feb 2026", description: "Refund for Order #12338", status: "pending" }
    ]
  };

  return (
    <div className="h-screen bg-[#FFF8F0] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#5F2EEA] via-[#FF7A30] to-[#0FAD6E] px-6 py-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-xl neo-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#171717]" />
          </button>
          <h2 className="text-white">My Wallet</h2>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <WalletIcon className="w-5 h-5 text-white" />
            <p className="text-white/80 text-sm">Available Balance</p>
          </div>
          <p className="text-4xl font-bold text-white mb-4">₹{walletData.balance}</p>
          {onAddMoney && (
            <button
              onClick={onAddMoney}
              className="w-full py-3 bg-white text-[#5F2EEA] rounded-2xl neo-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Money
            </button>
          )}
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 py-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 neo-shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownLeft className="w-4 h-4 text-[#0FAD6E]" />
            <p className="text-xs text-[#171717]/60">Total Earned</p>
          </div>
          <p className="text-xl font-bold text-[#0FAD6E]">₹950</p>
        </div>
        <div className="bg-white rounded-2xl p-4 neo-shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="w-4 h-4 text-[#FF7A30]" />
            <p className="text-xs text-[#171717]/60">Total Spent</p>
          </div>
          <p className="text-xl font-bold text-[#FF7A30]">₹758</p>
        </div>
      </div>

      {/* Transactions */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#171717]">Recent Transactions</h3>
          <TrendingUp className="w-5 h-5 text-[#0FAD6E]" />
        </div>

        <div className="space-y-3">
          {walletData.transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-4 neo-shadow-sm flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  transaction.type === "credit" ? "bg-[#0FAD6E]/10" : "bg-[#FF7A30]/10"
                }`}
              >
                {transaction.type === "credit" ? (
                  <ArrowDownLeft className="w-6 h-6 text-[#0FAD6E]" />
                ) : (
                  <ArrowUpRight className="w-6 h-6 text-[#FF7A30]" />
                )}
              </div>

              <div className="flex-1">
                <p className="text-[#171717] mb-1">{transaction.description}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-[#171717]/60">{transaction.date}</p>
                  {transaction.status === "pending" && (
                    <span className="px-2 py-0.5 bg-[#FF7A30]/10 text-[#FF7A30] text-xs rounded-full">
                      Pending
                    </span>
                  )}
                </div>
              </div>

              <p
                className={`text-lg font-bold ${
                  transaction.type === "credit" ? "text-[#0FAD6E]" : "text-[#FF7A30]"
                }`}
              >
                {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}