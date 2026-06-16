import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Layers, 
  Compass, 
  MessageSquare, 
  Heart, 
  CheckCircle2, 
  ChevronRight, 
  TrendingUp, 
  Award, 
  Search,
  ChevronDown,
  ChevronUp,
  Share2,
  Lock,
  Wrench,
  HelpCircle,
  FolderLock
} from "lucide-react";

import { BUSINESS_INFO, BRANDS, REVIEWS, TireProduct } from "./data";
import { 
  getTireProducts, 
  getReviews, 
  addReview, 
  SEED_TYRE_PRODUCTS 
} from "./lib/tireService";
import { checkAuthState, logVisitorInfo, onProductsSnapshot } from "./lib/firebaseService";

import Navbar from "./components/Navbar";
import Logo from "./components/Logo";
import Hero from "./components/Hero";
import TireCard from "./components/TireCard";
import ProductDetailsModal from "./components/ProductDetailsModal";
import ReviewsSection from "./components/ReviewsSection";
import LocationContact from "./components/LocationContact";
import FloatingActions from "./components/FloatingActions";
import VehicleFitmentWidget from "./components/VehicleFitmentWidget";
import InventoryManager from "./components/InventoryManager";
import AdminLoginModal from "./components/AdminLoginModal";
import Promotions from "./components/Promotions";
import NewsletterSignup from "./components/NewsletterSignup";
import FAQSection from "./components/FAQSection";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  
  const isAuthorizedAdmin = currentUser?.email === "bahaduralimunnabhai@gmail.com";

  // Redirect to home if unauthenticated user somehow sits on admin route
  useEffect(() => {
    if (currentPage === "admin" && !isAuthorizedAdmin) {
      setCurrentPage("home");
    }
  }, [currentPage, isAuthorizedAdmin]);

  // Track page navigation analytics safely
  useEffect(() => {
    logVisitorInfo(currentPage);
  }, [currentPage]);

  // Auth listener
  useEffect(() => {
    const unsubscribe = checkAuthState((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
  
  // Master API database states loaded dynamically from Firestore
  const [products, setProducts] = useState<TireProduct[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Dynamic state selectors
  const [activeSegment, setActiveSegment] = useState<'all' | 'hot' | 'new' | 'famous'>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceSort, setPriceSort] = useState<'none' | 'low-high' | 'high-low'>('none');
  const [selectedTire, setSelectedTire] = useState<TireProduct | null>(null);

  // Load products dynamically in real-time and reviews on startup
  useEffect(() => {
    setLoading(true);
    
    // Subscribe to live products collection updates
    const unsubscribeProducts = onProductsSnapshot((snapshotList) => {
      const mapped = snapshotList.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        size: p.size,
        feature: p.feature,
        price: p.price,
        badge: p.badge || (p.category === "hot-selling" ? "Hot Selling" : p.category === "new-brands" ? "New Arrival" : "Famous"),
        segment: p.segment || (p.category === "hot-selling" ? "hot" : p.category === "new-brands" ? "new" : "famous") as "hot" | "new" | "famous",
        image: p.image || p.imageUrl,
        stock: p.stock || 0,
        description: p.description || `Premium quality tire from ${p.brand}.`
      }));
      setProducts(mapped);
      setLoading(false);
    });

    loadReviews();

    return () => {
      unsubscribeProducts();
    };
  }, []);

  const loadReviews = async () => {
    try {
      const dbReviews = await getReviews();
      if (dbReviews && dbReviews.length > 0) {
        setReviews(dbReviews);
      } else {
        setReviews(REVIEWS);
      }
    } catch (e) {
      console.error("Firestore reviews fallback.", e);
      setReviews(REVIEWS);
    }
  };

  const handleAddNewReview = async (newReviewObj: any) => {
    try {
      await addReview(newReviewObj);
      // Reload from cloud immediately
      const dbReviews = await getReviews();
      setReviews(dbReviews);
    } catch (e) {
      // Offline fallback append
      setReviews((prev) => [newReviewObj, ...prev]);
    }
  };

  // Helper action: when selecting recommended size from widget, immediately filter catalogue
  const handleFilterSizeFromWidget = (sizeCode: string) => {
    setSearchQuery(sizeCode);
    setSelectedBrand("All");
    setActiveSegment("all");
    setPriceSort("none");
    setCurrentPage("catalogue");
    
    // Smooth scroll to top of database list
    setTimeout(() => {
      const el = document.getElementById("catalog-grid-top");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Derivative Filter for landing sections
  const hotSellingProducts = products.filter(p => p.segment === 'hot');
  const newArrivalProducts = products.filter(p => p.segment === 'new');

  // Master Filter and Sorting engine for dynamic Catalogue list
  const filteredCatalogProducts = products.filter((tire) => {
    const matchesSegment = activeSegment === 'all' || tire.segment === activeSegment;
    const matchesBrand = selectedBrand === 'All' || tire.brand.toLowerCase() === selectedBrand.toLowerCase();
    
    const searchString = `${tire.name} ${tire.brand} ${tire.size} ${tire.feature} ${tire.description}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());

    return matchesSegment && matchesBrand && matchesSearch;
  });

  // Apply Price Sorting configurations
  const sortedCatalogProducts = [...filteredCatalogProducts].sort((a, b) => {
    if (priceSort === "low-high") return a.price - b.price;
    if (priceSort === "high-low") return b.price - a.price;
    return 0; // retain database natural feed sorting
  });

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
      darkMode ? "bg-brand-dark text-white" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* 24/7 Top Alert Ribbon with High Visibility SEO keyword highlights */}
      <div className="bg-gradient-to-r from-brand-orange to-red-600 text-white text-center py-2 px-4 text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center space-x-2 relative z-50">
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
        <span className="hidden sm:inline">24/7 EMERGENCY TYRE PUNCTURE BREAKDOWN REPAIR ROAD ASSISTANCE IN LAHORE: </span>
        <span className="sm:hidden">24/7 LAHORE EMERGENCY ASSISTANCE: </span>
        <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="underline hover:opacity-85 ml-1 font-sans font-extrabold text-xs tracking-normal">
          📞 {BUSINESS_INFO.phone}
        </a>
      </div>

      {/* State-driven Navigation Bar */}
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isAuthorizedAdmin={isAuthorizedAdmin}
      />

      {/* Main Container Wrapper with Animation Transitions */}
      <main className="transition-opacity duration-300">
        
        {/* VIEW 1: HOME PAGE PAGE-TAB */}
        {currentPage === "home" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Elegant Display Hero Header */}
            <Hero darkMode={darkMode} />

            {/* HIGH SEO TEXT SECTION & KEYWORDS */}
            <section className={`py-6 border-y ${darkMode ? "bg-black/10 border-white/5" : "bg-slate-100 border-slate-200"}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs tracking-wide font-mono opacity-85">
                <span>⚡ LAHORE INDUSTRIAL TRADING CORP • RETAIL & WHOLESALE RATES ON BRAND NEW TYRES IN FAISAL TOWN • CERTIFIED GERMAN TUNE-UP & ALIGNMENT STAGES</span>
              </div>
            </section>

            {/* SEASONAL BUNDLE PROMOTIONS CAROUSEL SLIDER */}
            <Promotions darkMode={darkMode} />

            {/* DYNAMIC CAR MODEL VEHICLE INTEGRATION WIDGET */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-mono tracking-widest uppercase bg-brand-orange/15 text-brand-orange px-3.5 py-1 rounded-full font-extrabold">
                  Car Fitment Search
                </span>
                <h2 className="text-3xl font-display font-extrabold tracking-tight mt-3">
                  Vehicle Recommended Tyre Size Finder
                </h2>
                <p className={`text-sm mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Input or lookup your car name to pull custom rim specifications, load recommended profile compounds, and lookup live stock matching instantly.
                </p>
              </div>

              {/* Mounted child fitment widget component */}
              <VehicleFitmentWidget 
                darkMode={darkMode} 
                onFilterSize={handleFilterSizeFromWidget} 
              />
            </section>

            {/* FEATURED: HOT SELLING TYRES LISTING */}
            <section id="hot" className={`py-12 ${darkMode ? "bg-brand-dark/95" : "bg-white"}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 border-b pb-4 border-black/5 dark:border-white/5">
                  <div>
                    <span className="text-brand-orange font-mono text-xs uppercase font-extrabold tracking-widest">
                      🔥 Top Seller Index
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-display font-black tracking-tight mt-1">
                      Lahore's Demanded Tyres
                    </h3>
                  </div>
                  <button 
                    onClick={() => { setCurrentPage("catalogue"); setActiveSegment("hot"); }}
                    className="text-xs font-bold text-brand-orange hover:underline focus:outline-none mt-2 sm:mt-0"
                  >
                    View All Popular Tyres →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {hotSellingProducts.slice(0, 4).map((tire) => (
                    <TireCard
                      key={tire.id}
                      tire={tire}
                      darkMode={darkMode}
                      onSelect={(t) => setSelectedTire(t)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* BRAND DIFFERENTIATORS BENTO GRAPH DISPLAY SECTION */}
            <section className={`py-20 ${darkMode ? "bg-black/30" : "bg-slate-100"}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div>
                    <span className="text-brand-orange font-mono text-xs uppercase font-extrabold">
                      🛡️ Premium Security and Quality Safety
                    </span>
                    <h3 className="text-3xl font-display font-black tracking-tight mt-2 leading-tight">
                      Why Faisal Town Chooses Haider Brothers Traders?
                    </h3>
                    <p className={`text-sm mt-3 leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                      Our mission is to guarantee maximum safety rating, high speed response, comfortable suspensions, and durable tyre lifespan for everyday Pakistani passenger sedans and heavy commercial vehicles. We operate 24 hours a day to prevent vehicle emergencies and offer full high-grade premium warranty validation.
                    </p>

                    <div className="space-y-4 mt-6">
                      <div className="flex items-start space-x-3">
                        <span className="p-1 px-1.8 rounded-lg bg-brand-orange/10 text-brand-orange font-bold text-xs mt-0.5">✔</span>
                        <div>
                          <h4 className="font-bold text-sm">German 3D Wheel Alignment stages</h4>
                          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>We restore precise steering control & eliminate early tyre scrubbing.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <span className="p-1 px-1.8 rounded-lg bg-brand-orange/10 text-brand-orange font-bold text-xs mt-0.5">✔</span>
                        <div>
                          <h4 className="font-bold text-sm">100% Genuine Certified Imports</h4>
                          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Say no to smuggling issues. Enjoy legal security with real DOT manufacturing years.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 sm:p-8 rounded-3xl border ${
                    darkMode ? "bg-[#1c1c24] border-white/5 shadow-2xl" : "bg-white border-slate-200/80 shadow-md"
                  }`}>
                    <h4 className="font-display font-black text-l uppercase text-brand-orange text-center mb-6">
                      ⚙️ Core Service Statistics
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-mono font-bold mb-1">
                          <span>Original Custom Warranty Claim Ratio</span>
                          <span className="text-brand-orange">100% Guaranteed</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-black/30 overflow-hidden">
                          <div className="h-full bg-brand-orange w-full"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono font-bold mb-1">
                          <span>Response Speed under Emergency (Minutes)</span>
                          <span className="text-brand-orange">Within 25 Mins</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-black/30 overflow-hidden">
                          <div className="h-full bg-brand-orange" style={{ width: "95%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono font-bold mb-1">
                          <span>Certified Import Tyre Compound Durability</span>
                          <span className="text-brand-orange">50,000+ Kilometers</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-black/30 overflow-hidden">
                          <div className="h-full bg-brand-orange" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-brand-orange/5 border border-brand-orange/10 rounded-xl text-center mt-6">
                      <span className="text-xs font-semibold text-brand-orange font-mono">
                        🔥 CERTIFIED REPUTATION FOR QUALITY FITTING
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTIONS: LAHORE STREET LOCATION CONTACT PREVIEW */}
            <LocationContact darkMode={darkMode} />
          </motion.div>
        )}

        {/* VIEW 2: TYRE CATALOGUE PAGE-TAB */}
        {currentPage === "catalogue" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            {/* Header intro */}
            <div className="text-center max-w-2xl mx-auto mb-12" id="catalog-grid-top">
              <span className="text-xs font-mono tracking-widest uppercase bg-brand-orange/10 text-brand-orange px-3.5 py-1.5 rounded-full font-bold inline-block">
                Distributer Price Index
              </span>
              <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight mt-4">
                Full Tyre Inventory Catalogue
              </h1>
              <p className={`text-sm mt-3 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Live stock records connected to Faisal Town Lahore branch. Filter by sizes, manufacturers, segment highlights, or order by price index instantly.
              </p>
            </div>

            {/* Advanced Filters Block */}
            <div className={`p-6 rounded-3xl border mb-10 space-y-6 ${
              darkMode ? "glassmorphism box-glow" : "glassmorphism-light shadow-md"
            }`}>
              {/* Row 1: Search and Sorting controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Bar input */}
                <div className="md:col-span-2 relative">
                  <span className={`text-xs font-semibold font-mono block mb-1 px-1 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                    Filter by Keywords (e.g. Michelin, 185/65R14, grabber)
                  </span>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type tire model, width, ratio, code, or feature description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full p-3 pl-10 rounded-xl text-xs border focus:ring-1 focus:ring-brand-orange focus:outline-none ${
                        darkMode ? "bg-black/35 border-white/10 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-800"
                      }`}
                      id="search-tyres-input"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Price sorting selection dropdown */}
                <div>
                  <span className={`text-xs font-semibold font-mono block mb-1 px-1 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                    Sort by Price Index
                  </span>
                  <select
                    value={priceSort}
                    onChange={(e) => setPriceSort(e.target.value as any)}
                    className={`w-full p-3 rounded-xl text-xs border focus:ring-1 focus:ring-brand-orange focus:outline-none ${
                      darkMode ? "bg-black/35 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
                    }`}
                    id="price-sort-select"
                  >
                    <option value="none">Database Standards</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Segments */}
              <div className="space-y-2 pt-2 border-t border-black/5 dark:border-white/5">
                <span className={`text-xs font-mono font-bold tracking-wider uppercase block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Filter by Segment Categories
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Products' },
                    { id: 'hot', label: '🔥 Hot Selling' },
                    { id: 'new', label: '🆕 New arrivals' },
                    { id: 'famous', label: '⭐ Famous Brand Favorites' }
                  ].map((seg) => (
                    <button
                      key={seg.id}
                      onClick={() => setActiveSegment(seg.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        activeSegment === seg.id
                          ? "bg-brand-orange text-white"
                          : darkMode
                          ? "bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10"
                          : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
                      }`}
                      id={`segment-btn-${seg.id}`}
                    >
                      {seg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Manufacturer filters */}
              <div className="space-y-2 pt-2 border-t border-black/5 dark:border-white/5">
                <span className={`text-xs font-mono font-bold tracking-wider uppercase block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Filter by Brand Manufacturer
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedBrand('All')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedBrand === 'All'
                        ? "border border-brand-orange text-brand-orange bg-brand-orange/10 font-bold"
                        : darkMode
                        ? "border border-white/5 bg-white/5 text-slate-300 hover:text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:text-slate-900"
                    }`}
                    id="brand-btn-all"
                  >
                    All Brands
                  </button>
                  {BRANDS.map((br) => (
                    <button
                      key={br.name}
                      onClick={() => setSelectedBrand(br.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedBrand === br.name
                          ? "border border-brand-orange text-brand-orange bg-brand-orange/10 font-bold"
                          : darkMode
                          ? "border border-white/5 bg-white/5 text-slate-300 hover:text-white"
                          : "border border-slate-200 bg-white text-slate-700 hover:text-slate-900"
                      }`}
                      id={`brand-btn-${br.name.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      {br.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results bar */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-mono text-slate-400">
                Found <span className="text-brand-orange font-bold font-sans">{sortedCatalogProducts.length}</span> matching products in Lahore branch
              </span>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-brand-orange hover:underline font-bold"
                >
                  Clear size queries
                </button>
              )}
            </div>

            {/* Dynamic Tyre Catalog Cards Grid */}
            {sortedCatalogProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedCatalogProducts.map((tire) => (
                  <TireCard
                    key={tire.id}
                    tire={tire}
                    darkMode={darkMode}
                    onSelect={(t) => setSelectedTire(t)}
                  />
                ))}
              </div>
            ) : (
              <div className={`p-12 text-center rounded-3xl border border-dashed text-slate-400 ${
                darkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
              } max-w-md mx-auto`}>
                <span className="text-4xl block mb-3">🔍</span>
                <h4 className="font-display font-bold text-md text-brand-orange">No exact specification tyre found</h4>
                <p className={`text-xs mt-2 leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  We might still have warehouse stock of size custom model '{searchQuery}'! Please call or shoot a direct WhatsApp to our sales desk.
                </p>
                <div className="mt-6 flex justify-center space-x-3">
                  <button
                    onClick={() => { setSelectedBrand("All"); setActiveSegment("all"); setSearchQuery(""); }}
                    className="bg-brand-orange text-white text-xs px-4 py-2 rounded-xl transition-all hover:bg-brand-orange-dark font-medium"
                  >
                    Reset Filter options
                  </button>
                  <a
                    href={`tel:${BUSINESS_INFO.phoneRaw}`}
                    className={`text-xs px-4 py-2 border rounded-xl transition-all ${
                      darkMode ? "border-white/10 text-white" : "border-slate-300 text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    Call Sales Office
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* VIEW 3: LIVE REVIEWS BOARD PAGE-TAB */}
        {currentPage === "reviews" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pt-24"
          >
            {/* Direct mount child Reviews component */}
            <ReviewsSection 
              darkMode={darkMode} 
              reviews={reviews}
              onAddReview={handleAddNewReview}
            />
          </motion.div>
        )}

        {/* VIEW 4: SHOWROOM LOCATION DETAILS PAGE-TAB */}
        {currentPage === "showroom" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pt-24 pb-20"
          >
            {/* Showroom location address layouts */}
            <LocationContact darkMode={darkMode} />

            {/* FITTING & ALIGNMENT GUIDELINES EXTRA INFO PANEL */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`p-6 sm:p-8 rounded-3xl border ${
                darkMode ? "bg-[#1c1c24] border-white/5" : "bg-slate-100 border-slate-200"
              }`}>
                <h3 className="font-display font-black text-l text-brand-orange mb-4">
                  🧭 ROAD EMERGENCIES IN LAHORE
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Broke down late at midnight in Faisal Town, Garden Town, Model Town, Gulberg, or Johar Town due to tyre flat punctures? Do not panic. Simply trigger our emergency phone number 24/7. Our mobile fitment van is equipped with high quality compound kits to rescue you immediately on-site!
                </p>
                <div className="mt-4">
                  <a 
                    href={`tel:${BUSINESS_INFO.phoneRaw}`}
                    className="inline-flex items-center space-x-1 bg-brand-orange text-white font-bold text-xs px-4 py-2 rounded-xl"
                  >
                    <span>Request Roadside Assistance</span>
                  </a>
                </div>
              </div>

              <div className={`p-6 sm:p-8 rounded-3xl border ${
                darkMode ? "bg-[#1c1c24] border-white/5" : "bg-slate-100 border-slate-200"
              }`}>
                <h3 className="font-display font-black text-l text-brand-orange mb-4">
                  🛠️ ALIGNMENT & COMPUTERIZED STEERING ADJUSTMENTS
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  We recommend doing computerized 3D wheel alignment checks and wheel balancing every 8,000 Kilometers to avoid uneven tread wire wear, suspension pull, and secure complete control of the car across highways at high speeds. Stop by during the day for discount fitment checking.
                </p>
                <p className="text-[11px] font-mono text-slate-400 mt-3">
                  ⏱️ 3D Alignment Stage is hosted 24/7 for premium passenger cars.
                </p>
              </div>
            </section>

            {/* DYNAMIC FAQ ACCORDION COMPONENT WITH HIGHEST SEO RATINGS */}
            <FAQSection darkMode={darkMode} />
          </motion.div>
        )}

        {/* VIEW 5: INVENTORY MANAGER DB SEEDING PAGE-TAB */}
        {currentPage === "admin" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 border-b pb-4 border-black/5 dark:border-white/5">
              <div>
                <div className="inline-flex items-center space-x-2 bg-brand-orange/10 px-3 py-1 rounded-full text-brand-orange text-xs font-mono font-bold uppercase tracking-wider mb-2">
                  <FolderLock className="w-3.5 h-3.5" />
                  <span>Real Backend Integration Console</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight mt-1">
                  Firestore Inventory Manager
                </h1>
                <p className={`text-sm mt-1 max-w-2xl ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Admin board connected directly with our provisioned cloud Firestore. Any tyre product configured, edited, or removed in this environment reflects onto the landing page immediately.
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 text-emerald-500 text-xs px-3 py-1.8 rounded-xl font-mono">
                <span>Secure DB Mode</span>
              </div>
            </div>

            {/* Main inventory administration dashboards */}
            <InventoryManager 
              darkMode={darkMode} 
              onRefreshProducts={loadReviews}
            />
          </motion.div>
        )}

      </main>

      {/* COMPREHENSIVE HIGH SEO FOOTER ROW SUMMARY SECTION */}
      <footer className={`pt-16 pb-12 relative overflow-hidden transition-colors duration-300 border-t ${
        darkMode ? "bg-brand-dark border-white/5 text-slate-400" : "bg-[#f1f3f6] border-slate-200 text-slate-600"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Column 1: About imports */}
            <div className="md:col-span-1.5 space-y-4">
              <div className="flex items-center">
                <Logo variant="full" darkMode={darkMode} className="h-12 w-auto -ml-3" />
              </div>
              <p className="leading-relaxed">
                Premium quality wholesaler and certified dealer of brand new tyres. We specialize in providing verified fresh manufacturing date imports, computer balancing, and 3D wheel alignments in Faisal Town Lahore.
              </p>
              <div className="flex items-center space-x-1 font-mono text-[10px] text-brand-orange">
                <span>⭐ 4.8 Ratings • Direct Google Mapping verified</span>
              </div>
            </div>

             {/* Column 2: Quick navigation */}
            <div className="md:col-span-0.5 space-y-3 font-mono">
              <h4 className={`font-display font-medium text-xs uppercase tracking-widest ${darkMode ? "text-slate-200" : "text-slate-950"}`}>
                Navigation
              </h4>
              <div className="flex flex-col space-y-2">
                <button onClick={() => { setCurrentPage("home"); window.scrollTo({ top: 0 }); }} className="text-left hover:text-brand-orange transition-colors">Showroom Home</button>
                <button onClick={() => { setCurrentPage("catalogue"); window.scrollTo({ top: 0 }); }} className="text-left hover:text-brand-orange transition-colors">Tyre Catalogue</button>
                <button onClick={() => { setCurrentPage("reviews"); window.scrollTo({ top: 0 }); }} className="text-left hover:text-brand-orange transition-colors">Customer Feed</button>
                <button onClick={() => { setCurrentPage("showroom"); window.scrollTo({ top: 0 }); }} className="text-left hover:text-brand-orange transition-colors">Lahore Location</button>
                {isAuthorizedAdmin && (
                  <button onClick={() => { setCurrentPage("admin"); window.scrollTo({ top: 0 }); }} className="text-left hover:text-brand-orange transition-colors flex items-center gap-1">
                    <span>Inventory Manager</span>
                  </button>
                )}
              </div>
            </div>

            {/* Column 3: Contact highlights & Location */}
            <div className="md:col-span-1 space-y-3 font-mono">
              <h4 className={`font-display font-medium text-xs uppercase tracking-widest ${darkMode ? "text-slate-200" : "text-slate-950"}`}>
                Showroom Contact
              </h4>
              <div className="flex flex-col space-y-1.5">
                <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="hover:text-brand-orange transition-colors">
                  📞 Emergency: {BUSINESS_INFO.phone}
                </a>
                <a href={`${BUSINESS_INFO.whatsappUrl}?text=I'd%20like%20to%20inquire%20about%20tires`} target="_blank" rel="noreferrer" className="hover:text-brand-orange transition-colors">
                  💬 WhatsApp: Chat Live
                </a>
                <div className="text-slate-500 font-sans text-xs pt-1">
                  📍 {BUSINESS_INFO.address}
                </div>
                <div className="flex items-center space-x-1 text-brand-orange text-[9px] uppercase font-bold tracking-wider pt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Faisal Town Lahore</span>
                </div>
              </div>
            </div>

            {/* Column 4: Newsletter signup */}
            <div className="md:col-span-1">
              <NewsletterSignup darkMode={darkMode} />
            </div>

          </div>

          <div className="pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 text-center">
            <p className="mb-4 sm:mb-0">
              © {new Date().getFullYear()} Haider Brothers Traders Lahore. All Rights Reserved. Fully optimized in production under Pakistan wholesale regulations.
              <button
                onClick={() => {
                  if (isAuthorizedAdmin) {
                    setCurrentPage("admin");
                    window.scrollTo({ top: 0 });
                  } else {
                    setShowAdminLoginModal(true);
                  }
                }}
                className="opacity-40 hover:opacity-100 transition-opacity ml-2 cursor-pointer inline-flex items-center gap-1 text-[10px]"
                id="subtle-staff-entrance"
                title="Management Console"
              >
                <Lock className="w-2.5 h-2.5 text-brand-orange inline" />
                <span>Staff Portal</span>
              </button>
            </p>
            <div className="flex items-center space-x-1 text-center justify-center">
              <span>Drive Safely with certified tyre sizes</span>
              <Heart className="w-3.5 h-3.5 text-brand-orange fill-current" />
              <span>& robust grip safety rules</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Detail Modal view */}
      <AnimatePresence>
        {selectedTire && (
          <ProductDetailsModal
            tire={selectedTire}
            onClose={() => setSelectedTire(null)}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>

      {/* Staff Authentication Portal Modal */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onSuccess={() => {
          setCurrentPage("admin");
          window.scrollTo({ top: 0 });
        }}
        darkMode={darkMode}
      />

      {/* Floating Corner CTAs handles */}
      <FloatingActions 
        darkMode={darkMode} 
        selectedTire={selectedTire}
      />
    </div>
  );
}
