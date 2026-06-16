import { motion } from "motion/react";
import { MessageSquare, ShieldCheck, Compass, Eye } from "lucide-react";
import { TireProduct, BUSINESS_INFO } from "../data";

interface TireCardProps {
  tire: TireProduct;
  darkMode: boolean;
  onSelect: (tire: TireProduct) => void;
  key?: string;
}

export default function TireCard({ tire, darkMode, onSelect }: TireCardProps) {
  // Format WhatsApp Link
  const waPreFilledText = `Hello Haider Brothers, I want price & stock for ${tire.name} (Size: ${tire.size})`;
  const encodedText = encodeURIComponent(waPreFilledText);
  const waLink = `${BUSINESS_INFO.whatsappUrl}?text=${encodedText}`;

  // Get brand indicator styling
  const isAutogrip = tire.brand.toLowerCase() === "autogrip";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-3xl overflow-hidden flex flex-col justify-between border transition-all duration-300 group ${
        darkMode
          ? "bg-[#1c1c24] border-white/5 hover:border-brand-orange/40 shadow-xl shadow-black/20"
          : "bg-white border-slate-100/90 hover:border-brand-orange/40 shadow-md shadow-slate-100"
      }`}
    >
      {/* Glow highlight on hover */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-orange/0 to-transparent group-hover:via-brand-orange/70 transition-all duration-500"></div>

      {/* Card Header Media area */}
      <div className="relative aspect-video overflow-hidden bg-slate-900 group">
        {/* Dynamic Image with Lazy Load */}
        <img
          src={tire.image}
          alt={tire.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-95"
          referrerPolicy="no-referrer"
        />

        {/* Shadow overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>

        {/* Top-row Glass badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
          <span className="backdrop-blur-md bg-black/50 text-white border border-white/10 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {tire.badge}
          </span>
          <span className="backdrop-blur-md bg-brand-orange/90 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm shadow-brand-orange/20">
            {tire.size}
          </span>
        </div>

        {/* Brand Label block (Bottom-left absolute overlay over media) */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 backdrop-blur-md bg-black/60 px-2.5 py-1 rounded-lg border border-white/5 text-white">
          <span className="text-xs">⚙️</span>
          <span className={`text-xs font-display font-extrabold tracking-wider uppercase ${isAutogrip ? "text-brand-orange-light" : "text-white"}`}>
            {tire.brand}
          </span>
        </div>
      </div>

      {/* Card Detail Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Tire Name */}
          <h4 className={`font-display text-lg font-bold tracking-tight leading-snug group-hover:text-brand-orange transition-colors ${
            darkMode ? "text-white" : "text-slate-900"
          }`}>
            {tire.name}
          </h4>

          {/* Quick specs / Description */}
          <p className={`text-xs mt-1.5 leading-relaxed line-clamp-2 ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}>
            {tire.description}
          </p>

          {/* Core Feature highlight badge */}
          <div className={`mt-3 flex items-center space-x-1.5 text-xs font-semibold ${
            darkMode ? "text-slate-300" : "text-slate-700"
          }`}>
            <Compass className="w-3.5 h-3.5 text-brand-orange shrink-0" />
            <span className="truncate">{tire.feature}</span>
          </div>
        </div>

        {/* Price & Action row */}
        <div className="pt-4 border-t border-black/5 dark:border-white/5">
          <div className="flex items-baseline justify-between mb-4">
            <span className={`text-[10px] uppercase font-mono tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Dealer Net Price
            </span>
            <span className="text-brand-orange font-display text-xl font-extrabold tracking-tight">
              PKR {tire.price.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {/* Quick Specs Quickview Button */}
            <button
              onClick={() => onSelect(tire)}
              className={`col-span-2 flex items-center justify-center p-3 rounded-xl transition-all ${
                darkMode
                  ? "bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white"
                  : "bg-slate-100 hover:bg-slate-200 border border-slate-200/50 text-slate-700 hover:text-slate-950"
              }`}
              title="View Specifications"
              id={`quickview-${tire.id}`}
            >
              <Eye className="w-4.5 h-4.5" />
            </button>

            {/* WhatsApp Enquiry Button */}
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer referrer"
              className="col-span-3 flex items-center justify-center space-x-1.5 bg-green-600 hover:bg-green-500 text-white py-3 px-3 rounded-xl text-xs font-bold transition-all hover:shadow-md hover:shadow-green-500/10"
              id={`whatsapp-enquiry-${tire.id}`}
            >
              <MessageSquare className="w-4.5 h-4.5 shrink-0" />
              <span>Quick Enquiry</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
