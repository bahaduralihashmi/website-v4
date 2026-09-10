import { motion, AnimatePresence } from "motion/react";
import { Phone, MessageSquare, MapPin } from "lucide-react";
import { BUSINESS_INFO, TireProduct } from "../data";

interface FloatingActionsProps {
  darkMode: boolean;
  selectedTire?: TireProduct | null;
}

const MAP_URL = "https://www.google.com/maps/search/?api=1&query=Haider%20Brothers%20Traders&query_place_id=ChIJL0avNwADGTkR1nF8MiXCecQ";

export default function FloatingActions({ darkMode, selectedTire }: FloatingActionsProps) {
  const getWhatsAppUrl = () => {
    if (!selectedTire) {
      return `${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent("Hello Haider Brothers, I need help finding the right tyres for my car. Please share current sizes, prices and availability.")}`;
    }

    const message = `Hello Haider Brothers, I'm interested in this tyre:\n\n• Brand: ${selectedTire.brand}\n• Model: ${selectedTire.name}\n• Size: ${selectedTire.size}\n• Price: PKR ${selectedTire.price.toLocaleString()}\n• Stock: ${selectedTire.stock !== undefined ? `${selectedTire.stock} units` : "Please confirm"}\n\nPlease confirm current stock, fitting availability and delivery options.`;
    return `${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`;
  };

  const hasSelectedTire = !!selectedTire;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col space-y-3.5 pointer-events-auto items-end">
        <AnimatePresence>
          {selectedTire && (
            <motion.div initial={{ opacity: 0, scale: 0.85, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.85, y: 15 }} className={`mr-1 mb-1 p-3.5 rounded-2xl shadow-xl max-w-xs border text-left backdrop-blur-md ${darkMode ? "bg-black/95 border-white/10 text-white" : "bg-white/95 border-slate-200 text-slate-800"}`}>
              <div className="flex items-center space-x-1.5 text-brand-orange text-[10px] uppercase font-mono tracking-wider font-extrabold"><span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping shrink-0" /><span>Direct Product Inquiry</span></div>
              <p className="text-xs font-bold leading-tight mt-1">{selectedTire.brand} {selectedTire.name}</p>
              <p className={`text-[10px] leading-snug mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Send the tyre specifications directly to HBT on WhatsApp.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-orange to-red-600 text-white flex items-center justify-center shadow-lg shadow-brand-orange/30 hover:scale-110 active:scale-95 transition-all" title="Call Haider Brothers Traders" aria-label="Call Haider Brothers Traders">
          <Phone className="w-5 h-5" />
        </a>
        <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className={`relative w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg transition-all ${hasSelectedTire ? "bg-brand-orange shadow-brand-orange/40" : "bg-green-500 shadow-green-500/30"}`} title="WhatsApp Haider Brothers Traders" aria-label="WhatsApp Haider Brothers Traders">
          <MessageSquare className="w-5 h-5" />
        </a>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 bg-black/90 backdrop-blur-xl border-t border-white/10">
        <div className="grid grid-cols-3 gap-2">
          <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="min-h-12 rounded-xl bg-brand-orange text-white flex items-center justify-center gap-1.5 text-xs font-extrabold shadow-lg" aria-label="Call HBT">
            <Phone className="w-4 h-4" /> Call
          </a>
          <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="min-h-12 rounded-xl bg-green-500 text-white flex items-center justify-center gap-1.5 text-xs font-extrabold shadow-lg" aria-label="WhatsApp HBT">
            <MessageSquare className="w-4 h-4" /> WhatsApp
          </a>
          <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="min-h-12 rounded-xl bg-white text-slate-900 flex items-center justify-center gap-1.5 text-xs font-extrabold shadow-lg" aria-label="Get directions to HBT">
            <MapPin className="w-4 h-4" /> Directions
          </a>
        </div>
      </div>
    </>
  );
}
