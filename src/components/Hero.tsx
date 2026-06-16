import { motion } from "motion/react";
import { Phone, ArrowRight, Star, Clock, Sparkles, ShieldCheck, MapPin } from "lucide-react";
import { BUSINESS_INFO, BRANDS } from "../data";

interface HeroProps {
  darkMode: boolean;
}

export default function Hero({ darkMode }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section
      id="home"
      className={`relative min-h-screen pt-28 pb-16 flex flex-col justify-center overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-brand-dark text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Dynamic Background Playing Tire Video */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            darkMode ? "opacity-25" : "opacity-10"
          }`}
          src="https://assets.mixkit.co/videos/preview/mixkit-tire-of-a-car-wheels-spinning-on-the-road-41484-large.mp4"
          style={{ objectFit: "cover" }}
        />
        {/* Horizontal Dark Gradient Mask for Left-Column Text Readability */}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-r ${
            darkMode 
              ? "from-brand-dark via-brand-dark/85 to-transparent" 
              : "from-slate-100 via-slate-100/75 to-transparent"
          }`}
        />
        {/* Vertical Transition Mask to Blend into the next sections flawlessly */}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-t ${
            darkMode 
              ? "from-brand-dark via-transparent to-transparent" 
              : "from-slate-50 via-transparent to-transparent"
          }`}
        />
      </div>

      {/* Decorative Orbs with glassmersion */}
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-gradient-to-br from-brand-orange/30 to-rose-600/10 blur-[100px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-600/10 to-brand-orange/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-brand-orange/10 dark:bg-brand-orange/15 border border-brand-orange/30 px-3.5 py-1.5 rounded-full text-brand-orange">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-mono font-semibold tracking-wider uppercase">Faisal Town's #1 Rated Tyre Store</span>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
                Premium Tyres <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-orange-500 to-red-600">
                  Built For Safety
                </span>
              </h1>
              <p className={`text-base sm:text-lg max-w-xl ${
                darkMode ? "text-slate-300" : "text-slate-600"
              }`}>
                Authorized distributor of world-renowned tyre brands in Lahore. From high-speed touring tyres to rugged off-road compounds, enjoy 
                <span className="text-brand-orange font-semibold"> 24/7 emergency tyre repairs</span> & alignment services.
              </p>
            </motion.div>

            {/* Quick Actions Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <a
                href="#all-products"
                className="group flex items-center justify-center space-x-2 bg-gradient-to-br from-brand-orange to-red-600 hover:from-brand-orange-light hover:to-red-500 text-white px-7 py-4 rounded-xl text-base font-semibold shadow-lg shadow-brand-orange/25 hover:shadow-brand-orange/40 hover:-translate-y-0.5 transition-all text-center"
              >
                <span>View Tyre Catalog</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className={`flex items-center justify-center space-x-2 border px-7 py-4 rounded-xl text-base font-semibold transition-all hover:-translate-y-0.5 ${
                  darkMode
                    ? "border-white/10 dark:hover:bg-white/5 bg-white/5 active:bg-white/10 text-white"
                    : "border-slate-300 hover:bg-slate-100 bg-white shadow-sm text-slate-800"
                }`}
              >
                <Phone className="w-5 h-5 text-brand-orange animate-wiggle" />
                <span>Call Hotline +92 302 4594403</span>
              </a>
            </motion.div>

            {/* Micro badges */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 border-t pt-8 border-black/5 dark:border-white/5">
              <div className="flex flex-col">
                <span className="text-brand-orange font-display text-2xl font-bold">100% Original</span>
                <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Authentic Import Warranty</span>
              </div>
              <div className="flex flex-col">
                <span className="text-brand-orange font-display text-2xl font-bold">24/7 Hours</span>
                <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Night Emergency Road Rescue</span>
              </div>
              <div className="flex flex-col">
                <span className="text-brand-orange font-display text-2xl font-bold">Same Day</span>
                <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Instant Fitting & Tuning</span>
              </div>
            </motion.div>
          </div>

          {/* Right Bento Grid Column */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {/* Bento Card 1: Map Google Ratings */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`col-span-2 p-5 rounded-3xl ${
                darkMode ? "glassmorphism relative overflow-hidden" : "glassmorphism-light shadow-md"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-xs font-mono tracking-wider uppercase block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Google Reviews</span>
                  <h3 className="text-2xl font-display font-extrabold mt-1 text-brand-orange">4.8 ★ Rating</h3>
                  <p className={`text-xs mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Overwhelming praise for swift customer support & precise alignment.</p>
                </div>
                <div className="flex space-x-1 bg-brand-orange/10 p-2 rounded-xl text-brand-orange">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </div>
              {/* Profile group miniature */}
              <div className="flex items-center space-x-2.5 mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center -space-x-2 overflow-hidden">
                  <div className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-[#1c1c24] bg-gradient-to-br from-emerald-500 to-teal-600 text-[10px] text-white flex items-center justify-center font-bold uppercase shadow-sm">
                    GM
                  </div>
                  <div className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-[#1c1c24] bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] text-white flex items-center justify-center font-bold uppercase shadow-sm">
                    MB
                  </div>
                  <div className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-[#1c1c24] bg-gradient-to-br from-purple-500 to-fuchsia-600 text-[10px] text-white flex items-center justify-center font-bold uppercase shadow-sm">
                    MR
                  </div>
                </div>
                <span className={`text-[11px] font-medium tracking-wide ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Verified Customer Comments on Maps
                </span>
              </div>
            </motion.div>

            {/* Bento Card 2: 24/7 Hours */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className={`p-5 rounded-3xl ${
                darkMode ? "glassmorphism" : "glassmorphism-light shadow-md"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-brand-orange flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-lg">Always Open</h4>
              <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Emergency assistance, fitting & air services 24 hours open.
              </p>
            </motion.div>

            {/* Bento Card 3: Secure Products */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className={`p-5 rounded-3xl ${
                darkMode ? "glassmorphism" : "glassmorphism-light shadow-md"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-lg">100% Genuine</h4>
              <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Authorized dealer of global and local major brands.
              </p>
            </motion.div>

            {/* Bento Card 4: Location Pin */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className={`col-span-2 p-5 rounded-3xl flex items-center space-x-4 ${
                darkMode ? "glassmorphism" : "glassmorphism-light shadow-md"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className={`text-[10px] font-mono uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Faisal Town, Block C 1, Lahore</span>
                <h4 className="font-display font-bold text-md mt-0.5">Near Center Flats</h4>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>F8G5+H9, Lahore, Pakistan</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Brand Stripe Ribbons Area */}
        <div className="mt-20 pt-8 border-t border-black/5 dark:border-white/5">
          <p className={`text-center font-mono text-xs tracking-widest uppercase mb-6 ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}>
            Official Retailer / Authorized Distributor Of Premium Brands
          </p>
          
          <div className="relative w-full overflow-hidden whitespace-nowrap py-4">
            {/* Smooth mask on edges */}
            <div className={`absolute top-0 left-0 w-20 h-full z-10 pointer-events-none bg-gradient-to-r ${
              darkMode ? "from-brand-dark to-transparent" : "from-slate-50 to-transparent"
            }`}></div>
            <div className={`absolute top-0 right-0 w-20 h-full z-10 pointer-events-none bg-gradient-to-l ${
              darkMode ? "from-brand-dark to-transparent" : "from-slate-50 to-transparent"
            }`}></div>

            {/* Marquee scroll loop */}
            <div className="inline-flex space-x-12 animate-marquee-scroll">
              {[...BRANDS, ...BRANDS].map((brand, bIdx) => (
                <div
                  key={`${brand.name}-${bIdx}`}
                  className={`inline-flex items-center space-x-2 bg-white/5 dark:bg-white/5 px-4 py-2.5 rounded-xl border ${
                    brand.hasDirectAccent
                      ? "border-brand-orange/40 text-brand-orange"
                      : darkMode
                      ? "border-white/5 text-slate-300 hover:border-white/25 hover:text-white"
                      : "border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900"
                  } transition-colors cursor-default`}
                >
                  {/* Brand visual emoji / tire mockup symbol */}
                  <span className="text-sm font-semibold">⚙️</span>
                  <span className="font-display font-bold uppercase tracking-wider text-sm">{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
