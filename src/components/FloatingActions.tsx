import { motion, AnimatePresence } from "motion/react";
import { Phone, MessageSquare } from "lucide-react";
import { BUSINESS_INFO, TireProduct } from "../data";

interface FloatingActionsProps {
  darkMode: boolean;
  selectedTire?: TireProduct | null;
}

export default function FloatingActions({ darkMode, selectedTire }: FloatingActionsProps) {
  // Format dynamic WhatsApp URL
  const getWhatsAppUrl = () => {
    if (!selectedTire) {
      return `${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent(
        "Hello Haider Brothers, I need assistance with tyres right now"
      )}`;
    }

    const message = `Hello Haider Brothers, I'm interested in the following tyre:

🚗 *Tyre details:*
• *Brand:* ${selectedTire.brand}
• *Model:* ${selectedTire.name}
• *Size:* ${selectedTire.size}
• *Features:* ${selectedTire.feature}
• *Price:* PKR ${selectedTire.price.toLocaleString()}
• *Stock status:* ${selectedTire.stock !== undefined ? `${selectedTire.stock} Units Available` : "Available"}

Could you please confirm the current stock and availability for installation? Thank you!`;

    return `${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`;
  };

  const hasSelectedTire = !!selectedTire;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3.5 pointer-events-auto items-end">
      {/* Alert Tooltip for Selected Tyre */}
      <AnimatePresence>
        {selectedTire && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            className={`mr-1 mb-1 p-3.5 rounded-2xl shadow-xl max-w-xs border text-left scale-95 origin-bottom-right flex flex-col space-y-1 backdrop-blur-md ${
              darkMode 
                ? "bg-black/95 border-white/10 text-white" 
                : "bg-white/95 border-slate-200 text-slate-800"
            }`}
          >
            <div className="flex items-center space-x-1.5 text-brand-orange text-[10px] uppercase font-mono tracking-wider font-extrabold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping shrink-0" />
              <span>Direct Product Inquiry</span>
            </div>
            <p className={`text-xs font-bold leading-tight line-clamp-1 ${darkMode ? "text-slate-100" : "text-slate-850"}`}>
              {selectedTire.brand} {selectedTire.name}
            </p>
            <p className={`text-[10px] leading-snug ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Click below to send instant specifications over WhatsApp!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clickable Phone Call dialer */}
      <a
        href={`tel:${BUSINESS_INFO.phoneRaw}`}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-orange to-red-600 text-white flex items-center justify-center shadow-lg shadow-brand-orange/30 hover:scale-110 active:scale-95 transition-all group"
        title="Dial emergency tire service line"
        id="floating-call-btn"
      >
        <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      </a>

      {/* Floating interactive WhatsApp */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noreferrer referrer"
        className={`relative w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg transition-all group ${
          hasSelectedTire 
            ? "bg-brand-orange hover:bg-brand-orange-dark shadow-brand-orange/40 hover:scale-112" 
            : "bg-green-500 hover:bg-green-600 shadow-green-500/30 hover:scale-110"
        }`}
        title={hasSelectedTire ? `Inquire about ${selectedTire.brand} ${selectedTire.name} on WhatsApp` : "Chat live on WhatsApp"}
        id="floating-whatsapp-btn"
      >
        {/* Pulsating green or orange ring indication */}
        <span className={`absolute inset-0 rounded-full animate-ping pointer-events-none scale-105 ${
          hasSelectedTire ? "bg-brand-orange/40" : "bg-green-500/40"
        }`}></span>
        <MessageSquare className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
      </a>
    </div>
  );
}
