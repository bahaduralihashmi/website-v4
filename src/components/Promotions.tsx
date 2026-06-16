import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Percent, 
  Gift, 
  ShieldCheck, 
  Flame, 
  TrendingUp, 
  Calendar,
  AlertCircle
} from "lucide-react";
import { BUSINESS_INFO } from "../data";

interface PromoOffer {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  badge: {
    text: string;
    type: "discount" | "bundle" | "limited" | "exclusive";
  };
  highlightFeatures: string[];
  duration: string;
  actionText: string;
  gradient: string;
  icon: any;
}

export default function Promotions({ darkMode }: { darkMode: boolean }) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const PROMO_DATA: PromoOffer[] = [
    {
      id: "monsoon-alignment-bundle",
      title: "Lahore Monsoon Safety Package",
      subtitle: "FREE Computerized 3D Alignment & Wheel Balancing",
      tagline: "Total peace-of-mind during rainy seasons on wet Lahore roads",
      description: "Buy any premium set of 4 Tyres (Yokohama, Michelin, or Continental) and unlock complete computerized German 3D alignment, nitrogen air filling, and four heavy-duty brass safety valves absolutely free of charge.",
      badge: {
        text: "Special Bundle",
        type: "bundle"
      },
      highlightFeatures: [
        "Free 3D Alignment (PKR 3,500 value)",
        "Premium German Tubeless Valves",
        "Computerized Wheel Balancing Included",
        "Lifetime Nitrogen topping-up sessions"
      ],
      duration: "Valid until July 31, 2026",
      actionText: "Claim Bundle on WhatsApp",
      gradient: "from-blue-600 via-indigo-900 to-[#0e1017]",
      icon: Gift,
    },
    {
      id: "yokohama-summer-blast",
      title: "Summer Heat-Resistant Tyre Fest",
      subtitle: "Save up to 15% on Eco-Friendly Japanese Yokohama Imports",
      tagline: "Advanced rubber compounds designed for Pakistan's extreme summer asphalt",
      description: "Yokohama BluEarth and Advan series tyres have advanced silica compound protection to withhold high highway friction and temperature spikes during summer without risking tire decompression.",
      badge: {
        text: "Flat Discount",
        type: "discount"
      },
      highlightFeatures: [
        "15% Flat Rebate on selected sizes",
        "Genuine 2026 Import DOT markings",
        "Wet traction Class-A safety ratings",
        "Reduced fuel consumption thread patterns"
      ],
      duration: "Limited stock quota",
      actionText: "Check Size Compatibility",
      gradient: "from-brand-orange via-amber-850 to-[#120703]",
      icon: Percent,
    },
    {
      id: "executive-continental-bundle",
      title: "Continental Premium Executive Deal",
      subtitle: "Get PKR 8,000 Instant Voucher on Set of 4 Continental Tyres",
      tagline: "Engineered in Germany, trusted on Pakistani Motorways",
      description: "Elevate your sedan's comfort level. Continental offers exceptional noise reduction and high-speed stability. Install at our Faisal Town showroom to claim your premium service cashback voucher.",
      badge: {
        text: "Exclusive Reward",
        type: "exclusive"
      },
      highlightFeatures: [
        "PKR 8,000 Instant Cash Voucher",
        "Free Professional fitting & balancing",
        "5-Year official structural backup warranty",
        "Complimentary Suspension checkups"
      ],
      duration: "Hurry! Active this week only",
      actionText: "Secure Cash Voucher",
      gradient: "from-emerald-600 via-teal-950 to-[#0c1613]",
      icon: Sparkles,
    },
    {
      id: "general-tyre-pakistan",
      title: "General Tyre Durability Drive",
      subtitle: "Flat 8% Off on All Local General Tyre Products",
      tagline: "The absolute rugged champion for everyday Lahore traffic and pothole terrains",
      description: "Specially formulated for Pakistani road conditions. Extreme puncture-resistance and thick reinforcement sidewalls guarantee reliable performance for cabs, sedans, and commercial wagons.",
      badge: {
        text: "High Durability",
        type: "limited"
      },
      highlightFeatures: [
        "Economical Lahore pricing",
        "Reinforced steel belt core protection",
        "Excellent water-channeling grooves",
        "Unbeatable lifetime warranty terms"
      ],
      duration: "Offer valid on cash payments",
      actionText: "Inquire stock levels",
      gradient: "from-red-600 via-rose-900 to-[#1e0a0f]",
      icon: ShieldCheck,
    }
  ];

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMO_DATA.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, PROMO_DATA.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + PROMO_DATA.length) % PROMO_DATA.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % PROMO_DATA.length);
  };

  const getBadgeStyles = (type: string) => {
    switch (type) {
      case "discount":
        return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
      case "bundle":
        return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
      case "exclusive":
        return "bg-purple-500/15 text-purple-400 border border-purple-500/30";
      default:
        return "bg-red-500/15 text-red-400 border border-red-500/30";
    }
  };

  const currentPromo = PROMO_DATA[currentIndex];
  const IconComponent = currentPromo.icon;

  return (
    <section 
      id="promotions"
      className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-mono tracking-widest uppercase bg-brand-orange/15 text-brand-orange px-3.5 py-1 rounded-full font-extrabold flex items-center justify-center w-fit mx-auto gap-1.5 shadow-sm">
          <Flame className="w-3.5 h-3.5 animate-pulse" />
          <span>Seasonal Promotions & Offers</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight mt-3">
          Special Bundle Packages & Discounts
        </h2>
        <p className={`text-sm mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          Exclusively designed packages for Lahore drivers. Enjoy free alignment services, road hazard upgrades, and seasonal cash savings.
        </p>
      </div>

      {/* Main Carousel Frame */}
      <div 
        className={`relative rounded-3xl overflow-hidden border ${
          darkMode ? "border-white/10 bg-black/40 shadow-2xl" : "border-slate-200 bg-white shadow-xl"
        }`}
        id="promotions-carousel-stage"
      >
        <div className="absolute inset-0 bg-linear-to-r from-black/80 to-transparent z-10 pointer-events-none md:block hidden" />

        {/* Carousel Content Render */}
        <div className="relative min-h-[460px] md:min-h-[400px] flex flex-col justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPromo.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`absolute inset-0 w-full h-full bg-gradient-to-r ${currentPromo.gradient} flex flex-col md:flex-row items-stretch`}
            >
              {/* Left Column: Promotion Info */}
              <div className="flex-1 p-6 sm:p-10 md:p-12 flex flex-col justify-between z-20 text-white select-none">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={`text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded-full font-bold ${getBadgeStyles(currentPromo.badge.type)}`}>
                      {currentPromo.badge.text}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                      {currentPromo.duration}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-black tracking-tight text-white leading-tight">
                      {currentPromo.title}
                    </h3>
                    <h4 className="text-sm sm:text-base font-semibold text-brand-orange font-mono">
                      {currentPromo.subtitle}
                    </h4>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-xl">
                    {currentPromo.description}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {currentPromo.highlightFeatures.map((feat, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Interactive Trigger Area */}
                <div className="pt-6 sm:pt-0 mt-6 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <a
                    href={`${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent(
                      `Hello Haider Brothers, I'm interested in the promotion: *${currentPromo.title}* (${currentPromo.subtitle}).`
                    )}`}
                    target="_blank"
                    rel="noreferrer referrer"
                    className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-brand-orange/25"
                  >
                    <span>{currentPromo.actionText}</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                  <span className="text-[10px] text-slate-400 font-mono italic flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    Premium standard tire sizes apply. Rates subject to stock.
                  </span>
                </div>
              </div>

              {/* Right Column: High Fidelity Aesthetic Visual Cover art */}
              <div className="w-full md:w-[40%] bg-black/40 md:bg-transparent relative overflow-hidden flex items-center justify-center p-8 md:p-0">
                {/* Glowing aesthetic backdrop circle matching promotion icon */}
                <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-brand-orange/15 blur-3xl" />
                
                <div className="relative text-center flex flex-col items-center justify-center space-y-3 z-20">
                  <div className="p-5 rounded-3xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-md">
                    <IconComponent className="w-12 h-12 text-brand-orange animate-pulse" />
                  </div>
                  <span className="text-xs font-mono tracking-widest uppercase text-slate-300 font-bold block">
                    Haider Brothers Deals
                  </span>
                  <p className="text-[10px] text-slate-400 max-w-[200px] text-center mx-auto">
                    {currentPromo.tagline}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Manual Carousel Chevron Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-xl border border-white/10 bg-black/30 hover:bg-black/50 text-white hover:scale-105 active:scale-95 transition-all text-sm backdrop-blur-md"
          title="Previous slide"
          type="button"
          id="btn-promo-prev"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-xl border border-white/10 bg-black/30 hover:bg-black/50 text-white hover:scale-105 active:scale-95 transition-all text-sm backdrop-blur-md"
          title="Next slide"
          type="button"
          id="btn-promo-next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Bullet Progress Indicator bar */}
        <div className="absolute bottom-4 left-1/2 -translate-y-0 -translate-x-1/2 z-30 flex items-center space-x-2 bg-black/20 p-1.5 px-3 rounded-full backdrop-blur-sm">
          {PROMO_DATA.map((promo, idx) => (
            <button
              key={promo.id}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(idx);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-6 bg-brand-orange" : "w-2.5 bg-slate-500/50"
              }`}
              title={`Go to slide ${idx + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
