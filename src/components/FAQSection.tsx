import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck, 
  Wrench, 
  Clock, 
  Search, 
  BadgeHelp,
  Tag
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category: "warranty" | "services" | "general";
}

interface FAQSectionProps {
  darkMode: boolean;
}

export default function FAQSection({ darkMode }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>("warranty-duration");
  const [filterCategory, setFilterCategory] = useState<"all" | "warranty" | "services">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const FAQS: FAQItem[] = [
    {
      id: "warranty-duration",
      question: "What official warranty is provided with premium imported tyres from Yokohama, Michelin, and Continental?",
      answer: "All premium brand tyres (including Yokohama, Michelin, and Continental) purchased from Haider Brothers Faisal Town come with a 5-Year Continuous Structural & Tread Warranty. This warranty protects against tread separation, structural defects, factory compounds failures, and early bulging under standard driving specifications. We assist with 100% genuine claims fast-tracked directly with manufacturer dealers without complications.",
      keywords: ["warranty Yokohama", "Michelin warranty", "Continental tyres Lahore", "imported tyre warranty"],
      category: "warranty"
    },
    {
      id: "tire-installation-benefits",
      question: "Is there a charge for tyre installation, computerized balancing, and nitrogen air filling in Faisal Town showroom?",
      answer: "No, tyre installation at our Faisal Town showroom is 100% free with the purchase of any tyre set. For seasonal promotional packages or sets of 4 premium tyres, we include computerized 3D wheel alignment, premium computerized wheel balancing, durable tubeless valves, and lifetime nitrogen gas top-up sessions absolutely free. No hidden service charges apply.",
      keywords: ["free tyre installation", "3D wheel alignment", "wheel balancing Faisal Town", "free nitrogen Lahore"],
      category: "services"
    },
    {
      id: "checking-dot-year",
      question: "How can I verify the genuine manufacturing year and DOT marking of tyres purchased at Haider Brothers?",
      answer: "We guarantee 100% authentic tyre imports with visible, untouched DOT stamps. The DOT code is a 4-digit code hot-stamped on the tire sidewall; the first two digits represent the manufacturing week, and the last two represent the year (e.g., '1226' means 12th week of 2026). Haider Brothers never stocks smuggled or expired stock, securing complete legal peace of mind with legal custom imports.",
      keywords: ["tyre manufacturing year", "how to read DOT markings", "genuine imported tyres", "fresh tyre stock Lahore"],
      category: "warranty"
    },
    {
      id: "pothole-road-hazard",
      question: "Does the warranty cover tyre punctures, roadside sidewall cuts, or pothole impact damage?",
      answer: "Official manufacturer structural warranties cover material defects and manufacturing flaws. Road hazards such as standard tyre punctures, impact damage from deep Lahore potholes, sidewall kerb cuts, or debris damage are not traditionally covered under standard structural warranty terms. However, we offer premium tyre repair and patching services at our showroom anytime, or immediate tyre roadside replacements via our emergency van.",
      keywords: ["pothole tyre damage warranty", "sidewall cuts repair Lahore", "tire puncture service", "road hazard assistance"],
      category: "warranty"
    },
    {
      id: "emergency-road-service",
      question: "What should I do if my sedan tire bursts late at night in Lahore? Do you offer 24/7 emergency roadside support?",
      answer: "Yes, Haider Brothers operates a dedicated 24 Hours Emergency Roadside Tyre Assistance service. If you encounter a flat tire, puncture, or rim issue late at night anywhere around Faisal Town, Model Town, Gulberg, Johar Town, or Garden Town, call our emergency hotline at +92 302 4594403 immediately. Our responsive mobile service van will dispatch with fresh stock to assist on-site.",
      keywords: ["24/7 tyre repair Lahore", "midnight flat tire recovery", "emergency roadside assistance", "mobile tire van Faisal Town"],
      category: "services"
    },
    {
      id: "alignment-frequency",
      question: "How often should I get computerized 3D wheel alignment checks and wheel balancing for Pakistani roads?",
      answer: "For Pakistani road terrains, we strongly recommend a computerized 3D wheel alignment and professional wheel balancing check every 8,000 to 10,000 Kilometers, or whenever you feel alignment pulling to one side. Regular alignments prevent premature tread wear (uneven tire scrubbing), keep steering vibration-free on motorways at high speeds, and optimize vehicle fuel economy.",
      keywords: ["computerized wheel alignment frequency", "tire balancing intervals", "how to prevent uneven tire wear", "Pakistani road maintenance"],
      category: "services"
    }
  ];

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // Filter and search logic for great SEO reach
  const filteredFAQs = FAQS.filter((faq) => {
    const categoryMatches = filterCategory === "all" || faq.category === filterCategory;
    const searchString = `${faq.question} ${faq.answer} ${faq.keywords.join(" ")}`.toLowerCase();
    const queryMatches = searchString.includes(searchQuery.toLowerCase());
    return categoryMatches && queryMatches;
  });

  return (
    <section 
      id="showroom-faqs-accordion"
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-black/5 dark:border-white/5"
    >
      {/* Schema.org Structured Data Injection for high-fidelity Google SEO relevance */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQS.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })}
      </script>

      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-mono tracking-widest uppercase bg-brand-orange/15 text-brand-orange px-3.5 py-1 rounded-full font-bold inline-flex items-center gap-1.5 shadow-xs">
          <BadgeHelp className="w-3.5 h-3.5 animate-pulse" />
          <span>Haider Brothers FAQ Hub</span>
        </span>
        <h2 className="text-2xl sm:text-3.5xl font-display font-black tracking-tight mt-3">
          Tire Warranty & Service FAQs
        </h2>
        <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          Honest, transparent answers about premium tyre warranties, alignment services, and emergency 24/7 roadside assistances in Faisal Town Lahore.
        </p>
      </div>

      {/* Segment Category Switcher + SEO Search Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between mb-6">
        <div className="flex p-1 rounded-xl bg-slate-200/50 dark:bg-black/30 border border-slate-300/30 dark:border-white/5 self-start">
          {[
            { id: "all", label: "All Questions" },
            { id: "warranty", label: "🛡️ Warranty" },
            { id: "services", label: "🛠️ Services & 3D Align" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterCategory === cat.id
                  ? "bg-brand-orange text-white"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
              type="button"
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Live Search inside FAQ content with key phrases */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search FAQs (e.g. alignment, DOT, Michelin)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full p-2.5 pl-8 text-xs rounded-xl border focus:ring-1 focus:ring-brand-orange focus:outline-hidden ${
              darkMode
                ? "bg-black/35 border-white/10 text-white placeholder-slate-500"
                : "bg-white border-slate-200 text-slate-850 placeholder-slate-400"
            }`}
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Accordion List Container */}
      {filteredFAQs.length > 0 ? (
        <div className="space-y-3.5">
          {filteredFAQs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? darkMode
                      ? "bg-[#1c1c24] border-brand-orange/40"
                      : "bg-white border-brand-orange shadow-md"
                    : darkMode
                    ? "bg-black/25 border-white/5 hover:border-white/10"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
                id={`faq-item-${faq.id}`}
              >
                {/* Header Interactive Trigger Button */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between font-sans font-bold text-xs sm:text-sm text-left transition-colors focus:outline-hidden relative group"
                  aria-expanded={isOpen}
                  type="button"
                >
                  <div className="flex items-start space-x-3 pr-4">
                    {faq.category === "warranty" ? (
                      <ShieldCheck className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                    ) : faq.category === "services" ? (
                      <Wrench className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                    )}
                    <span className={darkMode ? "text-slate-100 group-hover:text-white" : "text-slate-850 group-hover:text-brand-orange"}>
                      {faq.question}
                    </span>
                  </div>

                  <span className={`p-1 rounded-lg transition-transform duration-300 ${
                    isOpen ? "bg-brand-orange/15 text-brand-orange rotate-180" : "text-slate-400 hover:text-slate-600"
                  }`}>
                    <ChevronDown className="w-4 h-4 shrink-0" />
                  </span>
                </button>

                {/* Smooth Expandable Accordion Body Panels */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className={`p-4 sm:p-5 pt-0 border-t font-sans text-xs sm:text-[13px] leading-relaxed select-none ${
                        darkMode ? "border-white/5 text-slate-300" : "border-slate-100 text-slate-700"
                      }`}>
                        <p>{faq.answer}</p>
                        
                        {/* SEO Keyword tags indicator for algorithmic reach */}
                        <div className="mt-3.5 flex flex-wrap gap-1.5 items-center opacity-80">
                          <Tag className="w-3 h-3 text-brand-orange shrink-0" />
                          <span className="text-[10px] font-mono text-slate-400">Related indexes:</span>
                          {faq.keywords.map((kw, i) => (
                            <span 
                              key={i} 
                              className="text-[9px] font-mono bg-brand-orange/5 text-brand-orange/80 px-2 py-0.5 rounded-md border border-brand-orange/10"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`p-10 text-center rounded-2xl border border-dashed text-slate-400 ${
          darkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
        }`}>
          <HelpCircle className="w-8 h-8 mx-auto text-slate-500 mb-2 animate-bounce" />
          <h4 className="font-bold text-xs">No matching faq answers found</h4>
          <p className="text-[11px] mt-1">Try searching for simple words like "warranty", "3D alignment", or "DOT".</p>
        </div>
      )}

      {/* Extra Service Pledge stamp */}
      <div className={`mt-8 p-4 rounded-2xl border text-center font-mono text-[10px] ${
        darkMode ? "bg-brand-orange/5 border-brand-orange/10" : "bg-orange-50/50 border-brand-orange/20"
      }`}>
        <span className="text-brand-orange font-bold font-sans">🛡️ CERTIFIED DIRECT CLAIM GUARANTOR: </span>
        <span className={darkMode ? "text-slate-400" : "text-slate-600"}>We deal strictly in direct legal brand imports on all 2026 batches. No duplicate or high wear compounds guaranteed.</span>
      </div>
    </section>
  );
}
