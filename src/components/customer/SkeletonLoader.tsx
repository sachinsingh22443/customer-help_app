import { motion } from "motion/react";

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 neo-shadow-sm">
      <div className="animate-pulse">
        <div className="w-full h-40 bg-[#171717]/10 rounded-xl mb-3" />
        <div className="h-4 bg-[#171717]/10 rounded w-3/4 mb-2" />
        <div className="h-3 bg-[#171717]/10 rounded w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-4 neo-shadow-sm">
          <div className="animate-pulse flex items-center gap-4">
            <div className="w-16 h-16 bg-[#171717]/10 rounded-xl flex-shrink-0" />
            <div className="flex-1">
              <div className="h-4 bg-[#171717]/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-[#171717]/10 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="bg-white rounded-2xl p-6 neo-shadow-sm">
      <div className="animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-[#171717]/10 rounded-full" />
          <div className="flex-1">
            <div className="h-5 bg-[#171717]/10 rounded w-1/2 mb-2" />
            <div className="h-3 bg-[#171717]/10 rounded w-2/3" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-[#171717]/10 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonHome() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-10 bg-white/20 rounded-xl w-32" />
            <div className="w-12 h-12 bg-white/20 rounded-xl" />
          </div>
          <div className="h-12 bg-white/30 rounded-xl" />
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-4">
        {/* Categories Skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 neo-shadow-sm">
              <div className="animate-pulse">
                <div className="w-12 h-12 bg-[#171717]/10 rounded-xl mb-3" />
                <div className="h-4 bg-[#171717]/10 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>

        {/* Cards Skeleton */}
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
