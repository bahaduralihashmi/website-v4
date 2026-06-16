import { X, MessageSquare, ShieldCheck, CheckCircle2, Phone, Compass } from "lucide-react";
import { TireProduct, BUSINESS_INFO } from "../data";

interface ProductDetailsModalProps {
  tire: TireProduct | null;
  onClose: () => void;
  darkMode: boolean;
}

export default function ProductDetailsModal({ tire, onClose, darkMode }: ProductDetailsModalProps) {
  if (!tire) return null;

  const waPreFilledText = `Hello Haider Brothers, I want price & stock for ${tire.name} (Size: ${tire.size})`;
  const encodedText = encodeURIComponent(waPreFilledText);
  const waLink = `${BUSINESS_INFO.whatsappUrl}?text=${encodedText}`;

  // Calculated physical traits for mock premium display
  const loadSpeedIndex = tire.size.includes("14") ? "88H" : tire.size.includes("15") ? "91H" : tire.size.includes("16") ? "94V" : tire.size.includes("17") ? "98W" : "103W";
  const treadwear = tire.brand.toLowerCase() === "michelin" || tire.brand.toLowerCase() === "continental" ? "540 A A" : "400 A A";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Container Card */}
      <div
        className={`relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl transition-all border duration-300 ${
          darkMode ? "bg-[#1c1c24] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-2 rounded-xl transition-all ${
            darkMode ? "bg-black/40 hover:bg-black/60 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
          }`}
          aria-label="Close specifications modal"
          id="close-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Card Media Section */}
          <div className="relative aspect-square md:h-full overflow-hidden bg-slate-950">
            <img
              src={tire.image}
              alt={tire.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent pointer-events-none"></div>
            
            {/* Image caption absolute */}
            <div className="absolute bottom-6 left-6 right-6">
              <span className="bg-brand-orange text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider block w-fit mb-2">
                ORIGINAL SPECIFICATIONS
              </span>
              <h3 className="font-display text-2xl font-extrabold text-white leading-tight">
                {tire.name}
              </h3>
              <p className="text-xs text-slate-300 mt-1">Authorized Import & Supply</p>
            </div>
          </div>

          {/* Details / Spec column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-brand-orange font-bold text-xs uppercase tracking-widest font-mono">
                  {tire.brand} Tyre Details
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                <span className={`text-xs font-semibold ${
                  tire.stock !== undefined && tire.stock < 5 
                    ? "text-rose-500 animate-pulse" 
                    : "text-emerald-500"
                }`}>
                  Lahore Stock: {tire.stock !== undefined ? `${tire.stock} Units Remaining` : "Available (In Stock)"}
                </span>
              </div>

              <div className="border-b pb-4 border-black/5 dark:border-white/5">
                <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {tire.description} Perfect for drivers focused on safety, longevity, and comfortable ride acoustics on both dual highways and local Lahore residential lanes.
                </p>
              </div>

              {/* Specs Bento Grid Table */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className={`p-3 rounded-xl border ${darkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                  <span className={`text-[10px] uppercase font-mono tracking-wider block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Tyre Size
                  </span>
                  <span className="font-mono text-sm font-bold text-brand-orange">{tire.size}</span>
                </div>

                <div className={`p-3 rounded-xl border ${darkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                  <span className={`text-[10px] uppercase font-mono tracking-wider block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Load/Speed Rating
                  </span>
                  <span className="font-mono text-sm font-bold">{loadSpeedIndex}</span>
                </div>

                <div className={`p-3 rounded-xl border ${darkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                  <span className={`text-[10px] uppercase font-mono tracking-wider block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    UTQG / Treadwear
                  </span>
                  <span className="font-mono text-sm font-bold">{treadwear}</span>
                </div>

                <div className={`p-3 rounded-xl border ${darkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                  <span className={`text-[10px] uppercase font-mono tracking-wider block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Installation
                  </span>
                  <span className="text-green-500 text-xs font-bold font-mono">FREE AT STORE</span>
                </div>
              </div>

              {/* Warranties flags */}
              <div className="space-y-2 pt-1 font-mono text-[11px]">
                <div className="flex items-center space-x-1.5 text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Official Year Manufacturing Date Warranted</span>
                </div>
                <div className="flex items-center space-x-1.5 text-brand-orange">
                  <Compass className="w-4 h-4" />
                  <span>Optimized for Pakistan's heat cycles & road asphalt</span>
                </div>
              </div>
            </div>

            {/* Price & Primary Call-to-actions */}
            <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className={`text-xs font-mono tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Wholesale Unit Price
                </span>
                <span className="text-brand-orange font-display text-2xl font-black">
                  PKR {tire.price.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Dial Store hotline */}
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className={`flex items-center justify-center space-x-2 py-3.5 rounded-xl text-xs font-bold transition-all border ${
                    darkMode
                      ? "border-white/10 bg-white/5 hover:bg-white/10 text-white"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800"
                  }`}
                  id="modal-phone-btn"
                >
                  <Phone className="w-4 h-4 text-brand-orange" />
                  <span>Call Store Office</span>
                </a>

                {/* WhatsApp Chat prefilled */}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer referrer"
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white py-3.5 rounded-xl text-xs font-bold shadow-md shadow-green-600/10 transition-all"
                  id="modal-wa-btn"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Secure Order</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
