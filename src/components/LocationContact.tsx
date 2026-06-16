import React, { useState, useEffect } from "react";
import { Phone, MapPin, Clock, MessageSquare, Compass, ClipboardCheck, Send, Sparkles } from "lucide-react";
import { BUSINESS_INFO } from "../data";

interface LocationContactProps {
  darkMode: boolean;
}

export default function LocationContact({ darkMode }: LocationContactProps) {
  const [lahoreTime, setLahoreTime] = useState("");
  const [inquiryText, setInquiryText] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      try {
        const timeString = new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Karachi",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        });
        setLahoreTime(timeString);
      } catch (e) {
        // Fallback if platform has minor timezone translation block
        const now = new Date();
        const localUTC = now.getTime() + now.getTimezoneOffset() * 60000;
        const pktTime = new Date(localUTC + 3600000 * 5); // GMT+5
        setLahoreTime(pktTime.toLocaleTimeString());
      }
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryText.trim()) return;

    // Direct redirection to WhatsApp web chat prefilled with customer inquiry
    const encoded = encodeURIComponent(`Hi Haider Brothers Traders, I am interested in: ${inquiryText}`);
    window.open(`${BUSINESS_INFO.whatsappUrl}?text=${encoded}`, "_blank");
    setInquirySuccess(true);
    setInquiryText("");
  };

  return (
    <section
      id="contact"
      className={`py-24 relative overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-brand-dark text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Visual lighting accents */}
      <div className="absolute right-0 top-1/2 w-80 h-80 rounded-full bg-red-600/10 blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-brand-orange/10 px-3.5 py-1.5 rounded-full text-brand-orange text-xs font-mono tracking-wider uppercase mb-3">
            <MapPin className="w-3.5 h-3.5 animate-bounce" />
            <span>Faisal Town Lahore Office</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
            Stop By Or Get Instant Support
          </h2>
          <p className={`text-sm mt-3 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Located at the trade center of Faisal Town block C1, Lahore. Ready to assist you 24/7 with professional tyre fitting, alignment tuning, or roadside emergency fixes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Coordinates & Real Contact bento Cards (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            
            {/* Live Indicator Card */}
            <div className={`p-6 rounded-3xl border transition-all duration-300 ${
              darkMode ? "glassmorphism" : "glassmorphism-light shadow-md"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500">Live Showroom Status</span>
                <div className="flex items-center space-x-1.5 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20 text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  <span className="text-[10px] font-bold font-mono">24/7 OPEN NOW</span>
                </div>
              </div>
              
              <div className="mt-6 flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-tight text-brand-orange">
                  {lahoreTime || "Loading..."}
                </span>
                <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Lahore PKT Time</span>
              </div>
              <p className={`text-xs mt-3 leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Midnight puncture repair? Highway wheel balance issue? Our crews never sleep. Call first or drive in at any hour.
              </p>
            </div>

            {/* Quick Connection Options Card */}
            <div className={`p-6 rounded-3xl border ${
              darkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100 shadow-sm"
            } space-y-4`}>
              {/* Telephone */}
              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className={`p-4 rounded-2xl border flex items-center space-x-4 transition-all hover:scale-[1.01] ${
                  darkMode
                    ? "bg-black/20 border-white/5 hover:border-brand-orange/40 hover:bg-black/40"
                    : "bg-white border-slate-200/60 hover:border-brand-orange/40"
                }`}
                id="contact-phone-link"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-600/10 text-brand-orange flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className={`text-[9px] font-mono uppercase block ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Direct Hotline Support</span>
                  <span className="font-display font-bold text-sm sm:text-base text-brand-orange">{BUSINESS_INFO.phone}</span>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={`${BUSINESS_INFO.whatsappUrl}?text=Hello%20Haider%20Brothers,%20I'd%20like%20to%20ask%20about%20your%20tyre%20inventory`}
                target="_blank"
                rel="noreferrer referrer"
                className={`p-4 rounded-2xl border flex items-center space-x-4 transition-all hover:scale-[1.01] ${
                  darkMode
                    ? "bg-black/20 border-white/5 hover:border-green-500/45 hover:bg-black/40"
                    : "bg-white border-slate-200/60 hover:border-green-500/40"
                }`}
                id="contact-whatsapp-link"
              >
                <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className={`text-[9px] font-mono uppercase block ${darkMode ? "text-slate-500" : "text-slate-400"}`}>WhatsApp Instant Quote</span>
                  <span className="font-display font-semibold text-sm sm:text-base text-green-500">Secure Live Text Chat</span>
                </div>
              </a>

              {/* Address */}
              <div className={`p-4 rounded-2xl border flex items-start space-x-4 ${
                darkMode ? "bg-black/20 border-white/5" : "bg-white border-slate-200/60"
              }`}>
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className={`text-[9px] font-mono uppercase block ${darkMode ? "text-slate-400" : "text-slate-400"}`}>Postal Address</span>
                  <p className="text-xs font-semibold leading-relaxed mt-1">
                    {BUSINESS_INFO.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Live Message Form */}
            <div className={`p-6 rounded-3xl border ${
              darkMode ? "glassmorphism" : "glassmorphism-light shadow-md"
            }`}>
              <h3 className="font-display font-bold text-sm mb-2">Search Stock or Request Quote</h3>
              
              <form onSubmit={handleInquirySubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="e.g., need 4 tyre price for Pirelli 205/60R16..."
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  className={`w-full p-3 rounded-xl text-xs border focus:ring-2 focus:ring-brand-orange focus:outline-none transition-all ${
                    darkMode
                      ? "bg-black/40 border-white/10 text-white placeholder-slate-500"
                      : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                  }`}
                  id="contact-stock-search-input"
                />
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand-orange to-red-600 text-white py-2.5 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 flex items-center justify-center space-x-1"
                  id="contact-submit-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send WhatsApp Message</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Google Maps Location Interactive Container (lg:col-span-7) */}
          <div className={`lg:col-span-7 flex flex-col justify-between rounded-3xl overflow-hidden border shadow-xl min-h-[400px] transition-all duration-300 hover:scale-[1.005] ${
            darkMode 
              ? "bg-[#111115] border-white/5 hover:border-brand-orange/30 hover:shadow-[0_0_25px_rgba(255,85,0,0.2)]" 
              : "bg-white border-slate-200/60 hover:border-brand-orange/30 hover:shadow-2xl"
          }`}>
            {/* Maps Iframe */}
            <div className="relative w-full h-full min-h-[350px] flex-1">
              <iframe
                title="Haider Brothers Traders Google Maps Location"
                src={BUSINESS_INFO.mapIframeUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale-0 dark:brightness-[0.85] dark:contrast-[1.15] transition-all duration-300"
              />
            </div>
            
            {/* Map footer directions link */}
            <div className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t ${
              darkMode ? "bg-[#1c1c24] border-white/5" : "bg-white border-slate-100"
            }`}>
              <div>
                <h4 className="font-display font-bold text-sm">Faisal Town C-1 Roadway</h4>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Located right on Block C 1, Faisal Town, Lahore, Pakistan.
                </p>
              </div>

              <a
                href="https://www.google.com/maps/place/Haider+Brothers+Traders/@31.4764496,74.3084687,17z/data=!3m1!4b1!4m6!3m5!1s0x3919030037af462f:0xc479c225327c71d6!8m2!3d31.4764496!4d74.3084687!16s%2Fg%2F11zjmlbgth?entry=ttu&g_ep=EgoyMDI2MDYxMC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer referrer"
                className="flex items-center justify-center space-x-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-5 py-3 rounded-xl text-xs font-bold shadow-md shadow-brand-orange/20 transition-all text-center hover:scale-105 active:scale-95"
                id="maps-directions-btn"
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span>Navigate on Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
