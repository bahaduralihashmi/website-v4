import React, { useState } from "react";
import { Star, Sparkles, CheckCircle2 } from "lucide-react";
import GoogleReviewsFeed from "./GoogleReviewsFeed";

interface ReviewsSectionProps {
  darkMode: boolean;
  reviews: any[];
  onAddReview: (review: { name: string; rating: number; text: string; date: string; initials: string }) => Promise<void>;
}

export default function ReviewsSection({ darkMode, reviews, onAddReview }: ReviewsSectionProps) {
  const [newReview, setNewReview] = useState({ name: "", text: "", rating: 5 });
  const [formSuccess, setFormSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.text.trim()) return;
    const initials = newReview.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
    await onAddReview({ ...newReview, date: "Just now", initials });
    setNewReview({ name: "", text: "", rating: 5 });
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 4500);
  };

  return (
    <section id="reviews" className={`py-16 sm:py-24 relative overflow-hidden ${darkMode ? "bg-brand-dark/95 text-white" : "bg-white text-slate-900"}`}>
      <div className="absolute top-1/3 left-0 w-72 h-72 rounded-full bg-brand-orange/10 blur-[90px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 px-3.5 py-1.5 rounded-full text-brand-orange text-xs font-mono tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Google Customer Reviews
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">Trusted By Lahore's Car Community</h2>
          <p className={`text-sm mt-3 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>See live Google feedback and customer experiences before you visit or order tyres online.</p>
        </div>

        <GoogleReviewsFeed darkMode={darkMode} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-display font-black">Customer feedback saved in our website database</h3>
            {reviews.map((review, rIdx) => (
              <article key={`${review.name}-${rIdx}`} className={`p-5 sm:p-6 rounded-2xl border ${darkMode ? "bg-[#1c1c24] border-white/5" : "bg-slate-50 border-slate-100 shadow-sm"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange text-sm font-bold flex items-center justify-center shrink-0">{review.initials}</div>
                    <div className="min-w-0"><h4 className="font-bold text-sm truncate">{review.name}</h4><span className="text-[10px] opacity-60">{review.date}</span></div>
                  </div>
                  <div className="flex text-amber-500 shrink-0">{[1,2,3,4,5].map(n => <Star key={n} className={`w-3.5 h-3.5 ${n <= Math.round(review.rating) ? "fill-current" : ""}`} />)}</div>
                </div>
                <p className={`text-xs sm:text-sm mt-4 leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>&quot;{review.text}&quot;</p>
              </article>
            ))}
          </div>

          <div className="lg:col-span-5">
            <div className={`p-5 sm:p-7 rounded-3xl border ${darkMode ? "glassmorphism" : "glassmorphism-light shadow-md"}`}>
              <h3 className="font-display font-bold text-lg">Share Your Experience</h3>
              <p className={`text-xs mt-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Website feedback is stored in Firebase. For Google reviews, customers should use the Google Maps review link.</p>
              {formSuccess && <div className="mt-4 p-3 bg-green-500/10 border border-green-500/35 text-green-500 rounded-xl text-xs flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Review saved successfully.</div>}
              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div>
                  <label className="text-xs font-semibold uppercase font-mono block mb-1">Your Rating</label>
                  <div className="flex gap-1">{[1,2,3,4,5].map(rating => <button key={rating} type="button" onClick={() => setNewReview({ ...newReview, rating })} onMouseEnter={() => setHoverRating(rating)} onMouseLeave={() => setHoverRating(null)} className="p-1"><Star className={`w-6 h-6 ${rating <= (hoverRating ?? newReview.rating) ? "text-amber-500 fill-current" : "text-slate-400"}`} /></button>)}</div>
                </div>
                <input required type="text" placeholder="Full name" value={newReview.name} onChange={e => setNewReview({ ...newReview, name: e.target.value })} className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-brand-orange focus:outline-none ${darkMode ? "bg-black/40 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"}`} />
                <textarea required rows={4} placeholder="Tell us about your tyre purchase or service..." value={newReview.text} onChange={e => setNewReview({ ...newReview, text: e.target.value })} className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-brand-orange focus:outline-none resize-y ${darkMode ? "bg-black/40 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"}`} />
                <button type="submit" className="w-full bg-brand-orange hover:opacity-90 text-white font-bold py-3.5 rounded-xl text-sm transition-all">Post Website Review</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
