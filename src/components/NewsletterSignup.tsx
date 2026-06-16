import React, { useState } from "react";
import { Mail, Send, Check, Loader2, Sparkles } from "lucide-react";
import { subscribeNewsletter } from "../lib/firebaseService";

interface NewsletterSignupProps {
  darkMode: boolean;
}

export default function NewsletterSignup({ darkMode }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      await subscribeNewsletter(email);
      setStatus("success");
      setEmail("");
    } catch (err: any) {
      console.error("Subscription failed:", err);
      setStatus("error");
      
      // Extract a descriptive human error message
      let msg = "Something went wrong. Please check your network or try again.";
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed.error) {
            msg = parsed.error;
          }
        } catch {
          msg = err.message;
        }
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4" id="newsletter-signup-container">
      <div className="space-y-1.5">
        <h4 className={`font-display font-medium text-xs uppercase tracking-widest flex items-center gap-1.5 font-mono ${
          darkMode ? "text-slate-200" : "text-slate-950"
        }`}>
          <Mail className="w-3.5 h-3.5 text-brand-orange" />
          <span>Maintenance Newsletter</span>
        </h4>
        <p className="leading-relaxed text-[11px] text-slate-500">
          Subscribe to receive seasonal tyre maintenance advice, road safety checks, and priority showroom discount vouchers in Lahore.
        </p>
      </div>

      {status === "success" ? (
        <div 
          className={`p-3 rounded-2xl border flex items-start space-x-2.5 transition-all animate-fadeIn ${
            darkMode 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
          id="newsletter-success-alert"
        >
          <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-bold text-xs">Successfully Subscribed!</p>
            <p className="text-[10px] mt-0.5 opacity-90">
              You're registered to receive maintenance tips. Stay safe on the road!
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="space-y-2">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={loading}
              className={`w-full text-xs px-3.5 py-2.5 pr-10 rounded-xl border font-sans focus:outline-hidden focus:ring-1 focus:ring-brand-orange transition-all duration-200 ${
                darkMode
                  ? "bg-black/40 border-white/10 text-white placeholder-slate-500 focus:border-brand-orange/40"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-brand-orange"
              }`}
              id="newsletter-email-input"
            />
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-dark text-white hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
              title="Subscribe"
              id="newsletter-submit-btn"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {status === "error" && (
            <p className="text-[10px] text-rose-500 font-medium px-1 leading-snug" id="newsletter-error-message">
              ⚠️ {errorMessage}
            </p>
          )}

          <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-mono px-1">
            <Sparkles className="w-3 h-3 text-brand-orange/60 shrink-0" />
            <span>Updates twice a month • Opt-out anytime</span>
          </div>
        </form>
      )}
    </div>
  );
}
