import { motion } from "motion/react";
import { ArrowLeft, Star, Camera, X } from "lucide-react";
import { useState } from "react";

interface WriteReviewProps {
  dishId: string;
  dishName: string;
  onBack: () => void;
  onSubmit: (review: any) => void;
}

export function WriteReview({ dishId, dishName, onBack, onSubmit }: WriteReviewProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = () => {
    if (rating > 0 && comment.trim()) {
      onSubmit({
        dishId,
        rating,
        comment,
        images,
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const isValid = rating > 0 && comment.trim().length >= 10;

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-32">
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
            <h2 className="text-white">Write Review</h2>
            <p className="text-white/80 text-sm">{dishName}</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-4">
        {/* Rating Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 neo-shadow-sm"
        >
          <h3 className="text-[#171717] mb-4 text-center">How was your experience?</h3>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="transition-transform"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "fill-[#FF7A30] text-[#FF7A30]"
                      : "text-[#171717]/20"
                  }`}
                />
              </motion.button>
            ))}
          </div>

          {rating > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-[#171717]/60"
            >
              {rating === 5 && "Excellent! 🎉"}
              {rating === 4 && "Great! 👍"}
              {rating === 3 && "Good 👌"}
              {rating === 2 && "Okay 😐"}
              {rating === 1 && "Poor 😞"}
            </motion.p>
          )}
        </motion.div>

        {/* Comment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 neo-shadow-sm"
        >
          <h3 className="text-[#171717] mb-3">Share your thoughts</h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience with this dish..."
            className="w-full h-32 px-4 py-3 rounded-xl border-2 border-[#171717]/10 focus:border-[#FF7A30] outline-none transition-colors bg-[#FFF8F0] resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-[#171717]/40">
              Minimum 10 characters
            </p>
            <p className="text-xs text-[#171717]/60">
              {comment.length}/500
            </p>
          </div>
        </motion.div>

        {/* Photo Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 neo-shadow-sm"
        >
          <h3 className="text-[#171717] mb-3">Add Photos (Optional)</h3>
          
          <div className="grid grid-cols-4 gap-3">
            {images.map((image, idx) => (
              <div key={idx} className="relative aspect-square">
                <div className="w-full h-full rounded-xl overflow-hidden bg-[#FFF8F0]">
                  <div className="w-full h-full bg-gradient-to-br from-[#FF7A30]/20 to-[#5F2EEA]/20" />
                </div>
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF7A30] rounded-full flex items-center justify-center text-white neo-shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {images.length < 4 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="aspect-square rounded-xl border-2 border-dashed border-[#171717]/20 flex flex-col items-center justify-center gap-2 hover:border-[#FF7A30] hover:bg-[#FF7A30]/5 transition-colors"
              >
                <Camera className="w-6 h-6 text-[#171717]/40" />
                <span className="text-xs text-[#171717]/60">Add</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#FF7A30]/5 rounded-2xl p-5 border border-[#FF7A30]/20"
        >
          <p className="text-sm text-[#171717] mb-2">💡 Tips for a great review:</p>
          <ul className="space-y-1 text-sm text-[#171717]/70">
            <li className="flex items-start gap-2">
              <span className="text-[#FF7A30]">•</span>
              <span>Mention taste, quality, and presentation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF7A30]">•</span>
              <span>Be honest and constructive</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF7A30]">•</span>
              <span>Add photos for more impact</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-6 left-0 right-0 px-6 max-w-[390px] mx-auto">
        <motion.button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full bg-gradient-to-r from-[#FF7A30] to-[#ff9d5c] text-white py-4 rounded-xl neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          whileTap={{ scale: 0.98 }}
        >
          Submit Review
        </motion.button>
      </div>
    </div>
  );
}
