import { useEffect, useState } from "react";
import { ExternalLink, MapPin, Star, RefreshCw } from "lucide-react";

interface GoogleReview {
  id: string;
  source: "google";
  name: string;
  initials: string;
  rating: number;
  text: string;
  date: string;
  googleMapsUri?: string | null;
  authorUri?: string | null;
  authorPhotoUri?: string | null;
}

interface GoogleReviewsFeedProps {
  darkMode: boolean;
}

const GOOGLE_REVIEW_URL = "https://www.google.com/maps/search/?api=1&query=Haider%20Brothers%20Traders&query_place_id=ChIJL0avNwADGTkR1nF8MiXCecQ";

export default function GoogleReviewsFeed({ darkMode }: GoogleReviewsFeedProps) {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [place, setPlace] = useState<{ name: string; rating: number; userRatingCount: number; googleMapsUri?: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);

  const loadGoogleReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/google-reviews", { cache: "no-store" });
      const data = await response.json();
      setConfigured(data.configured !== false);
      if (response.ok && data.configured) {
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
        setPlace(data.place || null);
      }
    } catch (error) {
      console.error("Google review feed error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoogleReviews();
  }, []);

  if (!configured) return null;

  return (
    <section className={`mb-10 rounded-3xl border p-5 sm:p-7 ${darkMode ? "bg-[#17171d] border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-orange font-bold">
            <MapPin className="w-4 h-4" /> Google Reviews
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-black mt-1">Live customer feedback from Google</h3>
          <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Fresh Google feedback and rating information is loaded when this page opens.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-3 py-2 text-xs font-extrabold text-white hover:opacity-90">
            Leave a Google Review <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button onClick={loadGoogleReviews} className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${darkMode ? "bg-white/5 hover:bg-white/10" : "bg-slate-100 hover:bg-slate-200"}`}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {place && (
        <div className={`mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl p-4 ${darkMode ? "bg-white/5" : "bg-slate-50"}`}>
          <div>
            <div className="font-bold text-sm">{place.name}</div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="font-black text-lg text-brand-orange">{place.rating.toFixed(1)}</span>
              <span className="flex text-amber-500">{[1,2,3,4,5].map(n => <Star key={n} className="w-4 h-4 fill-current" />)}</span>
              <span className="text-xs opacity-70">{place.userRatingCount.toLocaleString()} Google ratings</span>
            </div>
          </div>
          <a href={place.googleMapsUri || GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-brand-orange hover:underline">
            View business on Google Maps <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {loading && reviews.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1,2].map(i => <div key={i} className={`h-32 rounded-2xl animate-pulse ${darkMode ? "bg-white/5" : "bg-slate-100"}`} />)}</div>
      ) : reviews.length === 0 ? (
        <div className={`rounded-2xl p-5 text-sm ${darkMode ? "bg-white/5 text-slate-400" : "bg-slate-50 text-slate-500"}`}>No Google review cards were returned right now. You can still open the Google profile and leave a review.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map(review => (
            <article key={review.id} className={`rounded-2xl border p-4 ${darkMode ? "border-white/5 bg-white/[0.025]" : "border-slate-100 bg-slate-50"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {review.authorPhotoUri ? <img src={review.authorPhotoUri} alt="" className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center text-xs font-black">{review.initials}</div>}
                  <div className="min-w-0">
                    {review.authorUri ? <a href={review.authorUri} target="_blank" rel="noopener noreferrer" className="font-bold text-sm truncate block hover:underline">{review.name}</a> : <div className="font-bold text-sm truncate">{review.name}</div>}
                    <div className="text-[10px] opacity-60">{review.date}</div>
                  </div>
                </div>
                <div className="flex shrink-0 text-amber-500">{[1,2,3,4,5].map(n => <Star key={n} className={`w-3.5 h-3.5 ${n <= Math.round(review.rating) ? "fill-current" : ""}`} />)}</div>
              </div>
              <p className={`text-xs sm:text-sm leading-relaxed mt-3 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{review.text}</p>
              {review.googleMapsUri && <a href={review.googleMapsUri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-[10px] font-bold text-brand-orange hover:underline">View on Google <ExternalLink className="w-3 h-3" /></a>}
            </article>
          ))}
        </div>
      )}

      <p className={`text-[10px] mt-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Google review content is displayed with attribution and a direct link to the Google business profile.</p>
    </section>
  );
}
