import { useState, useEffect } from "react";
import { Phone, MessageSquare, Menu, X, Sun, Moon, Sparkles, FolderLock } from "lucide-react";
import { BUSINESS_INFO } from "../data";
import Logo from "./Logo";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isAuthorizedAdmin: boolean;
}

export default function Navbar({ darkMode, setDarkMode, currentPage, setCurrentPage, isAuthorizedAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const baseNavItems = [
    { label: "Home", page: "home" },
    { label: "Catalogue", page: "catalogue" },
    { label: "Reviews Feed", page: "reviews" },
    { label: "Showroom", page: "showroom" },
    { label: "Inventory Manager", page: "admin", isIconic: true }
  ];

  const navItems = isAuthorizedAdmin 
    ? baseNavItems 
    : baseNavItems.filter(item => item.page !== "admin");

  return (
    <nav
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled || currentPage !== "home"
          ? darkMode
            ? "bg-[#121214]/95 backdrop-blur-md border-b border-white/10 py-3 shadow-lg shadow-black/20"
            : "bg-white/95 backdrop-blur-md border-b border-black/5 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <button
            onClick={() => { setCurrentPage("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex items-center group transition-all transform hover:scale-[1.02] active:scale-95 text-left"
            id="navbar-logo-btn"
          >
            <Logo variant="full" darkMode={darkMode} className="h-10 sm:h-12 w-auto" />
          </button>

          {/* Desktop Navigation Links (Responsive breakpoint updated to lg to prevent overlapping on tablets) */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => { setCurrentPage(item.page); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all relative flex items-center space-x-1 ${
                    isActive
                      ? "text-brand-orange font-bold bg-brand-orange/5"
                      : darkMode
                      ? "text-slate-300 hover:text-white hover:bg-white/5"
                      : "text-slate-600 hover:text-slate-900 hover:bg-black/5"
                  }`}
                >
                  {item.isIconic && <FolderLock className="w-3.5 h-3.5 mr-1 text-brand-orange inline" />}
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-brand-orange rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action panel for Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl transition-all ${
                darkMode
                  ? "bg-white/5 hover:bg-white/10 text-amber-400"
                  : "bg-black/5 hover:bg-black/10 text-slate-800"
              }`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              id="theme-toggle-desktop"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Emergency Hotline Button */}
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-brand-orange to-red-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-brand-orange/20 hover:shadow-brand-orange/40 hover:-translate-y-0.5 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>24/7 Helpline</span>
            </a>
          </div>

          {/* Mobile Right Controls (Menu & Theme) */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-1.5 rounded-lg transition-all ${
                darkMode ? "bg-white/5 text-amber-400" : "bg-black/5 text-slate-800"
              }`}
              id="theme-toggle-mobile"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-1.5 rounded-lg transition-all ${
                darkMode ? "bg-white/5 text-white" : "bg-black/5 text-slate-800"
              }`}
              aria-label="Toggle navigation menu"
              id="mobile-menu-btn"
            >
              {isOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] z-45 bg-black/60 backdrop-blur-sm">
          <div
            className={`w-4/5 max-w-sm h-[calc(100vh-60px)] p-6 shadow-2xl flex flex-col justify-between transition-transform duration-300 ${
              darkMode ? "bg-[#1c1c24] text-white" : "bg-white text-slate-900"
            }`}
          >
            <div className="space-y-4">
              <span className={`text-[10px] font-mono tracking-widest block pb-2 border-b uppercase ${
                darkMode ? "text-slate-400 border-white/5" : "text-slate-500 border-black/5"
              }`}>
                Browse Showroom Sections
              </span>
              
              <div className="flex flex-col space-y-1">
                {navItems.map((item) => {
                  const isActive = currentPage === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => {
                        setCurrentPage(item.page);
                        setIsOpen(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between text-left w-full ${
                        isActive
                          ? "bg-brand-orange/10 text-brand-orange font-bold"
                          : darkMode
                          ? "hover:bg-white/5 text-slate-300"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span className="flex items-center">
                        {item.isIconic && <FolderLock className="w-4 h-4 mr-2 text-brand-orange" />}
                        {item.label}
                      </span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-brand-orange" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                <Sparkles className="w-4 h-4 text-brand-orange animate-pulse" />
                <span>OPEN 24 HOURS IN FAISAL TOWN</span>
              </div>
              
              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-brand-orange to-red-600 text-white py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-brand-orange/30 text-center"
              >
                <Phone className="w-4 h-4" />
                <span>Call Emergency Service</span>
              </a>

              <a
                href={`${BUSINESS_INFO.whatsappUrl}?text=Hello%20Haider%20Brothers,%20I%20have%20an%20emergency%20tyre%20request`}
                target="_blank"
                rel="noreferrer referrer"
                className="flex items-center justify-center space-x-2 w-full border border-green-500/35 text-green-500 bg-green-500/5 py-2.5 rounded-xl text-xs font-medium"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Live Chat</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
