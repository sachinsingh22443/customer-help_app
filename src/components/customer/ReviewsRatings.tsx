import { motion } from "motion/react";
import { ArrowLeft, Star, ThumbsUp, Filter } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface ReviewsRatingsProps {
  dishId: string;
  onBack: () => void;
  onWriteReview: () => void;
}

export function ReviewsRatings({ dishId, onBack, onWriteReview }: ReviewsRatingsProps) {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "5" | "4" | "3" | "2" | "1">("all");

  const dishInfo = {
    name: "Paneer Butter Masala",
    rating: 4.8,
    totalReviews: 234,
    ratingDistribution: {
      5: 180,
      4: 35,
      3: 12,
      2: 5,
      1: 2,
    },
  };

  const reviews = [
    {
      id: "1",
      userName: "Rahul Sharma",
      userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      rating: 5,
      date: "2 days ago",
      comment: "Absolutely delicious! The paneer was so soft and the gravy was perfectly creamy. Chef Priya's cooking is exceptional!",
      helpful: 24,
      verified: true,
    },
    {
      id: "2",
      userName: "Priya Patel",
      userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      rating: 5,
      date: "5 days ago",
      comment: "Best paneer dish I've had from any food app. Authentic taste, generous portions, and arrived hot!",
      helpful: 18,
      verified: true,
    },
    {
      id: "3",
      userName: "Amit Kumar",
      userImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100",
      rating: 4,
      date: "1 week ago",
      comment: "Very good taste but could use a bit more spice. Overall great quality and fresh ingredients.",
      helpful: 12,
      verified: false,
    },
    {
      id: "4",
      userName: "Sneha Gupta",
      userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      rating: 5,
      date: "1 week ago",
      comment: "Ordered this for a family dinner and everyone loved it! Will definitely order again.",
      helpful: 8,
      verified: true,
    },
  ];

  const filteredReviews = selectedFilter === "all" 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(selectedFilter));

  const getRatingPercentage = (star: number) => {
    const total = Object.values(dishInfo.ratingDistribution).reduce((a, b) => a + b, 0);
    return Math.round((dishInfo.ratingDistribution[star as 5 | 4 | 3 | 2 | 1] / total) * 100);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] px-6 pt-12 pb-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-2">
          <motion.button
            onClick={onBack}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <div>
            <h2 className="text-white">Reviews & Ratings</h2>
            <p className="text-white/80 text-sm">{dishInfo.name}</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-4">
        {/* Overall Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 neo-shadow-sm"
        >
          <div className="flex items-start gap-6">
            {/* Rating Score */}
            <div className="text-center">
              <div className="text-5xl text-[#171717] mb-2">{dishInfo.rating}</div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(dishInfo.rating)
                        ? "fill-[#FF7A30] text-[#FF7A30]"
                        : "text-[#171717]/20"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-[#171717]/60">{dishInfo.totalReviews} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-10">
                    <span className="text-sm text-[#171717]">{star}</span>
                    <Star className="w-3 h-3 fill-[#FF7A30] text-[#FF7A30]" />
                  </div>
                  <div className="flex-1 h-2 bg-[#171717]/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF7A30] to-[#ff9d5c]"
                      style={{ width: `${getRatingPercentage(star)}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#171717]/60 w-10 text-right">
                    {getRatingPercentage(star)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
        >
          {["all", "5", "4", "3", "2", "1"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter as any)}
              className={`px-4 py-2 rounded-xl border-2 whitespace-nowrap transition-all ${
                selectedFilter === filter
                  ? "border-[#FF7A30] bg-[#FF7A30]/10 text-[#FF7A30]"
                  : "border-[#171717]/10 text-[#171717]/60"
              }`}
            >
              {filter === "all" ? "All" : `${filter} ⭐`}
            </button>
          ))}
        </motion.div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              className="bg-white rounded-2xl p-5 neo-shadow-sm"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={review.userImage}
                    alt={review.userName}
                    fallbackSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-[#171717]">{review.userName}</p>
                    {review.verified && (
                      <span className="px-2 py-0.5 bg-[#0FAD6E]/10 text-[#0FAD6E] text-xs rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.rating
                              ? "fill-[#FF7A30] text-[#FF7A30]"
                              : "text-[#171717]/20"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[#171717]/40">{review.date}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#171717]/80 mb-3 leading-relaxed">
                {review.comment}
              </p>

              <button className="flex items-center gap-2 text-sm text-[#171717]/60 hover:text-[#FF7A30] transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful ({review.helpful})</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Write Review Button */}
      <div className="fixed bottom-6 left-0 right-0 px-6 max-w-[390px] mx-auto">
        <motion.button
          onClick={onWriteReview}
          className="w-full bg-gradient-to-r from-[#FF7A30] to-[#ff9d5c] text-white py-4 rounded-xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          whileTap={{ scale: 0.98 }}
        >
          Write a Review
        </motion.button>
      </div>
    </div>
  );
}
