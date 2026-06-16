import { useState } from "react";
import { Search, Car, HelpCircle, ArrowRight, MessageSquare, CheckCircle } from "lucide-react";
import { PAK_CAR_FITMENTS, CarFitment } from "../lib/tireService";
import { BUSINESS_INFO } from "../data";

interface VehicleFitmentWidgetProps {
  darkMode: boolean;
  onFilterSize: (size: string) => void;
}

export default function VehicleFitmentWidget({ darkMode, onFilterSize }: VehicleFitmentWidgetProps) {
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [typedSearch, setTypedSearch] = useState<string>("");

  // Get models for selected make
  const availableModels = selectedMake
    ? PAK_CAR_FITMENTS.filter((f) => f.make.toLowerCase() === selectedMake.toLowerCase())
    : [];

  // Handle Make changes
  const handleMakeChange = (make: string) => {
    setSelectedMake(make);
    setSelectedModel("");
    setSelectedVariant(null);
  };

  // Handle Model changes
  const handleModelChange = (modelName: string) => {
    setSelectedModel(modelName);
    const fitment = availableModels.find((m) => m.model.toLowerCase() === modelName.toLowerCase());
    if (fitment && fitment.variants.length > 0) {
      setSelectedVariant(fitment.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  };

  // Quick auto-search matching
  const filteredSearchFitments = typedSearch.trim()
    ? PAK_CAR_FITMENTS.flatMap((fit) => 
        fit.variants.map((v) => ({
          make: fit.make,
          model: fit.model,
          variantName: v.name,
          engine: v.engine,
          size: v.recommendedSize
        }))
      ).filter((item) => 
        `${item.make} ${item.model} ${item.variantName}`.toLowerCase().includes(typedSearch.toLowerCase())
      ).slice(0, 4)
    : [];

  const handleSelectQuickMatch = (item: any) => {
    setSelectedMake(item.make);
    setSelectedModel(item.model);
    const fitObj = PAK_CAR_FITMENTS.find(f => f.make === item.make && f.model === item.model);
    const varObj = fitObj?.variants.find(v => v.name === item.variantName);
    setSelectedVariant(varObj || null);
    setTypedSearch("");
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.005] hover:border-brand-orange/30 ${
      darkMode ? "glassmorphism box-glow hover:shadow-[0_0_25px_rgba(255,85,0,0.25)]" : "glassmorphism-light shadow-xl hover:shadow-2xl"
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-brand-orange uppercase">
            ⚡ Fitment Recommendations Guide
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-bold mt-1 tracking-tight">
            Find Recommended Tyre Size by Vehicle model
          </h3>
          <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Configure your car's profile to extract the certified OEM tire dimensions immediately.
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-xs font-mono bg-brand-orange/5 text-brand-orange px-3 py-1.5 rounded-xl border border-brand-orange/10 self-start md:self-auto">
          <Car className="w-3.5 h-3.5" />
          <span>Pakistan Specs Database</span>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Selectors */}
        <div className="space-y-4">
          {/* Quick Search Input */}
          <div className="relative">
            <span className={`text-xs font-mono font-semibold block mb-1 px-1 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              Search Car Name (e.g. 'Corolla', 'Civic', 'Alto')
            </span>
            <div className="relative">
              <input
                type="text"
                placeholder="Type car name..."
                value={typedSearch}
                onChange={(e) => setTypedSearch(e.target.value)}
                className={`w-full p-3 pl-10 rounded-xl text-xs border focus:ring-1 focus:ring-brand-orange focus:outline-none ${
                  darkMode ? "bg-black/40 border-white/10 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                }`}
                id="car-search-input"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Auto-suggest results */}
            {filteredSearchFitments.length > 0 && (
              <div className={`absolute left-0 right-0 mt-1.5 rounded-xl border p-2 z-10 shadow-2xl ${
                darkMode ? "bg-[#1c1c24] border-white/10" : "bg-white border-slate-200"
              }`}>
                {filteredSearchFitments.map((fit, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectQuickMatch(fit)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex justify-between items-center transition-all ${
                      darkMode ? "hover:bg-white/5 text-slate-200" : "hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-brand-orange">{fit.make}</span> {fit.model} <span className="text-slate-400">({fit.variantName})</span>
                    </div>
                    <span className="font-mono text-[10px] bg-slate-500/10 px-2 py-0.5 rounded text-brand-orange font-bold">
                      {fit.size}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Make Selector */}
            <div>
              <label className={`text-xs font-mono font-semibold block mb-1 px-1 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                Select Brand (Make)
              </label>
              <select
                value={selectedMake}
                onChange={(e) => handleMakeChange(e.target.value)}
                className={`w-full p-3 rounded-xl text-xs border focus:ring-1 focus:ring-brand-orange focus:outline-none transition-all ${
                  darkMode ? "bg-black/40 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
                id="vehicle-make-select"
              >
                <option value="">-- Choose Make --</option>
                <option value="toyota">Toyota Pakistan</option>
                <option value="honda">Honda Atlas</option>
                <option value="suzuki">Pak Suzuki</option>
                <option value="kia">KIA Lucky Motors</option>
                <option value="hyundai">Hyundai Nishat</option>
                <option value="changan">Changan Pakistan</option>
                <option value="mg">MG Motors</option>
                <option value="haval">Haval Pakistan</option>
                <option value="proton">Proton Pakistan</option>
                <option value="dfsk">DFSK Motors</option>
              </select>
            </div>

            {/* Model Selector */}
            <div>
              <label className={`text-xs font-mono font-semibold block mb-1 px-1 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                Select Model
              </label>
              <select
                value={selectedModel}
                disabled={!selectedMake}
                onChange={(e) => handleModelChange(e.target.value)}
                className={`w-full p-3 rounded-xl text-xs border focus:ring-1 focus:ring-brand-orange focus:outline-none transition-all disabled:opacity-50 ${
                  darkMode ? "bg-black/40 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
                id="vehicle-model-select"
              >
                <option value="">-- Choose Model --</option>
                {Array.from(new Set(availableModels.map((m) => m.model))).map((model) => (
                  <option key={model} value={model.toLowerCase()}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Variant Selector */}
          {selectedModel && (
            <div>
              <label className={`text-xs font-mono font-semibold block mb-1 px-1 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                Select Car Variant / Engine Specifications
              </label>
              <div className="flex flex-wrap gap-2">
                {availableModels
                  .find((m) => m.model.toLowerCase() === selectedModel.toLowerCase())
                  ?.variants.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                        selectedVariant?.name === v.name
                          ? "border-brand-orange text-brand-orange bg-brand-orange/10 font-bold"
                          : darkMode
                          ? "border-white/5 bg-white/5 text-slate-300 hover:border-white/20"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                      id={`variant-btn-${v.name.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      {v.name} <span className="text-[10px] opacity-75">({v.engine})</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Recommendation Results Card container */}
        <div className="flex flex-col justify-between h-full">
          {selectedVariant ? (
            <div className={`p-5 rounded-2xl border flex flex-col justify-between h-full bg-linear-to-br transition-all duration-300 ${
              darkMode ? "bg-white/5 border-white/10 text-white" : "bg-slate-100/70 border-slate-200 text-slate-900"
            }`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-brand-orange uppercase font-bold">
                      PROFILING MATCH FOUND
                    </span>
                    <h4 className="font-display font-black text-lg sm:text-l tracking-tight mt-0.5 uppercase">
                      {selectedMake} {selectedModel}
                    </h4>
                    <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Variant: <span className="font-semibold text-brand-orange">{selectedVariant.name}</span> ({selectedVariant.engine})
                    </p>
                  </div>
                  <span className="p-2 rounded-lg bg-green-500/10 text-green-500">
                    <CheckCircle className="w-5 h-5" />
                  </span>
                </div>

                <div className={`p-4 rounded-xl text-center border my-3 ${
                  darkMode ? "bg-black/30 border-white/5" : "bg-white border-slate-200"
                }`}>
                  <span className={`text-[11px] font-mono block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    RECOMMENDED TYRE SIZE
                  </span>
                  <span className="font-display font-black text-2xl sm:text-3xl tracking-wider text-brand-orange block my-1">
                    {selectedVariant.recommendedSize}
                  </span>
                  <span className={`text-[10px] block leading-normal ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                    Spec matches the exact manufacturing profile for road pressure distribution & safety rules of Lahore.
                  </span>
                </div>
              </div>

              {/* Practical CTAs */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button
                  onClick={() => onFilterSize(selectedVariant.recommendedSize)}
                  className="flex-1 bg-gradient-to-r from-brand-orange to-red-600 hover:from-brand-orange hover:to-red-700 text-white font-bold p-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-md hover:shadow-lg transition-all"
                  id="fitment-search-match-btn"
                >
                  <span>Filter Catalogue for this Size</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={`${BUSINESS_INFO.whatsappUrl}?text=Asalam-o-ALaykum%20Haider%20Brothers%20Traders,%20I'm%20looking%20for%20tyres%20in%20specification%20size%20${selectedVariant.recommendedSize}%20for%20my%20${selectedMake}%20${selectedModel}%20${selectedVariant.name}%20car.%20What%20brands%20are%20available%20now?`}
                  target="_blank"
                  rel="noreferrer referrer"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-md transition-all shrink-0"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Query</span>
                </a>
              </div>
            </div>
          ) : (
            <div className={`p-10 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center h-full ${
              darkMode ? "bg-white/5 border-white/10" : "bg-slate-100/50 border-slate-200"
            }`}>
              <span className="text-4xl animate-pulse block mb-3">🚗</span>
              <h4 className={`font-display font-bold text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                Select Car to Extract Fitments
              </h4>
              <p className={`text-xs max-w-[280px] mt-2 leading-relaxed ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                Select brand make/model variables on the left, or query the car name to load the customized profile recommendations instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
