import React, { useState } from "react";
import { Star, Sparkles, CheckCircle2 } from "lucide-react";

interface ReviewsSectionProps {
  darkMode: boolean;
  reviews: any[];
  onAddReview: (review: { name: string; rating: number; text: string; date: string; initials: string }) => Promise<void>;
}

export default function ReviewsSection({ darkMode, reviews, onAddReview }: ReviewsSectionProps) {
  const [newReview, setNewReview] = useState({
    name: "",
    text: "",
    rating: 5
  });
  const [formSuccess, setFormSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.text.trim()) return;

    // Grab initials
    const initials = newReview.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

    const newlyCreated = {
      name: newReview.name,
      rating: newReview.rating,
      text: newReview.text,
      date: "Just now",
      initials: initials
    };

    try {
      await onAddReview(newlyCreated);
      setNewReview({ name: "", text: "", rating: 5 });
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 4500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section
      id="reviews"
      className={`py-24 relative overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-brand-dark/95 text-white" : "bg-white text-slate-900"
      }`}
    >
      {/* Visual glowing orbs */}
      <div className="absolute top-1/3 left-0 w-72 h-72 rounded-full bg-brand-orange/10 blur-[90px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-brand-orange/10 px-3.5 py-1.5 rounded-full text-brand-orange text-xs font-mono tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>4.8★ Ratings On Google Maps</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
            Loved By Lahore's Car Community
          </h2>
          <p className={`text-sm mt-3 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Real testimonials from car, SUV, and commercial truck owners who buy their Michelin, Yokohama, and Autogrip tyres from us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: List of Reviews */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {reviews.map((review, rIdx) => (
                <div
                  key={`${review.name}-${rIdx}`}
                  className={`p-6 rounded-2xl border transition-all hover:scale-[1.01] duration-300 ${
                    darkMode
                      ? "bg-[#1c1c24] border-white/5 hover:border-brand-orange/30 shadow-md"
                      : "bg-slate-50 border-slate-100 hover:border-brand-orange/30 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-orange-600/10 text-brand-orange text-sm font-bold flex items-center justify-center shrink-0">
                        {review.initials}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm">{review.name}</h4>
                        <span className={`text-[10px] font-mono ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                          Verified User • {review.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, sIdx) => (
                        <Star
                          key={sIdx}
                          className={`w-3.5 h-3.5 fill-current ${
                            sIdx < Math.floor(review.rating)
                              ? "text-amber-500"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className={`text-xs sm:text-sm mt-4 italic leading-relaxed ${
                    darkMode ? "text-slate-300" : "text-slate-600"
                  }`}>
                    "{review.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Custom aggregate and submission form */}
          <div className="lg:col-span-5 space-y-6">
            {/* Aggregate Dashboard breakout */}
            <div className={`p-6 rounded-3xl border ${
              darkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100 shadow-sm"
            }`}>
              <h3 className="font-display font-extrabold text-lg mb-4">Google Maps Score</h3>
              <div className="flex items-center space-x-4">
                <span className="text-4xl sm:text-5xl font-black text-brand-orange font-display">4.8</span>
                <div>
                  <div className="flex space-x-0.5 text-amber-500">
                    <Star className="w-5 h-5 fill-current text-amber-500" />
                    <Star className="w-5 h-5 fill-current text-amber-500" />
                    <Star className="w-5 h-5 fill-current text-amber-500" />
                    <Star className="w-5 h-5 fill-current text-amber-500" />
                    <Star className="w-5 h-5 fill-current text-amber-500" />
                  </div>
                  <span className={`text-xs font-mono block mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Based on {reviews.length} Genuine Feedback Records
                  </span>
                </div>
              </div>
            </div>

            {/* Leave a review interactive form */}
            <div className={`p-6 sm:p-8 rounded-3xl border relative ${
              darkMode ? "glassmorphism" : "glassmorphism-light shadow-md"
            }`}>
              <h3 className="font-display font-bold text-lg">Leave Your Review</h3>
              <p className={`text-xs mt-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Submit your experience with Haider Brothers Traders. Your feedback will write directly to our Firestore node.
              </p>

              {formSuccess && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/35 text-green-500 rounded-xl text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Review recorded in Firestore database successfully!</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                {/* Star rating selector */}
                <div className="space-y-1">
                  <label className={`text-xs font-semibold uppercase font-mono block ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                    Your Rating:
                  </label>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const ratingVal = idx + 1;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: ratingVal })}
                          onMouseEnter={() => setHoverRating(ratingVal)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 transition-transform active:scale-95"
                          title={`Rate ${ratingVal} Stars`}
                          id={`star-btn-${ratingVal}`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              ratingVal <= (hoverRating ?? newReview.rating)
                                ? "text-amber-500 fill-current"
                                : "text-slate-400 dark:text-slate-600"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name field */}
                <div className="space-y-1">
                  <label className={`text-xs font-semibold uppercase font-mono block ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hammad Butt"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-brand-orange focus:outline-none transition-all ${
                      darkMode
                        ? "bg-black/40 border-white/10 text-white placeholder-slate-500"
                        : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                    }`}
                    id="review-name-input"
                  />
                </div>

                {/* Feedback text */}
                <div className="space-y-1">
                  <label className={`text-xs font-semibold uppercase font-mono block ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your tire purchase, prices, or alignment support experience..."
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-brand-orange focus:outline-none transition-all ${
                      darkMode
                        ? "bg-black/40 border-white/10 text-white placeholder-slate-500"
                        : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                    }`}
                    id="review-text-input"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3.5 rounded-xl text-sm shadow-md shadow-brand-orange/20 transition-all hover:-translate-y-0.5"
                  id="submit-review-btn"
                >
                  Post Review Onto Feed
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
