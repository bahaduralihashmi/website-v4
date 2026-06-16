import React, { useState, useEffect, useRef } from "react";
import { TireProduct } from "../data";
import { 
  getTireProducts, 
  saveTireProduct, 
  deleteTireProduct 
} from "../lib/tireService";
import { 
  loginAdmin, 
  logoutAdmin, 
  checkAuthState, 
  createAdminUser,
  bulkUpdatePrices,
  getLowStockProducts,
  onProductsSnapshot,
  exportToJSON,
  importFromJSON,
  isBrowserOnline,
  registerNetworkStateListener,
  uploadProductImage,
  ProductDocument,
  getVisitorLogs,
  VisitorRecord
} from "../lib/firebaseService";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Database, 
  Wrench, 
  RefreshCw, 
  Sparkles, 
  Save, 
  X, 
  Search, 
  Tag, 
  Check,
  User,
  Lock,
  LogOut,
  Download,
  Upload,
  AlertTriangle,
  FileSpreadsheet,
  Wifi,
  WifiOff,
  Image as ImageIcon,
  Eye,
  Users,
  Monitor,
  Globe
} from "lucide-react";
import { User as AuthUser } from "firebase/auth";

interface InventoryManagerProps {
  darkMode: boolean;
  onRefreshProducts: () => void;
}

export default function InventoryManager({ darkMode, onRefreshProducts }: InventoryManagerProps) {
  const [products, setProducts] = useState<TireProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Connection State
  const [isOnline, setIsOnline] = useState<boolean>(isBrowserOnline());

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Bulk operation states
  const [bulkPercent, setBulkPercent] = useState<number>(10);
  const [bulkLoading, setBulkLoading] = useState<boolean>(false);

  // Form State for Adding / Editing
  const [formId, setFormId] = useState<string>("");
  const [formName, setFormName] = useState<string>("");
  const [formBrand, setFormBrand] = useState<string>("");
  const [formSize, setFormSize] = useState<string>("");
  const [formFeature, setFormFeature] = useState<string>("");
  const [formPrice, setFormPrice] = useState<number>(15000);
  const [formStock, setFormStock] = useState<number>(10);
  const [formBadge, setFormBadge] = useState<string>("Hot Selling");
  const [formSegment, setFormSegment] = useState<"hot" | "new" | "famous">("hot");
  const [formImage, setFormImage] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Low stock products alert list
  const [lowStockProducts, setLowStockProducts] = useState<ProductDocument[]>([]);

  // Visitor Analytics State
  const [visitorLogs, setVisitorLogs] = useState<VisitorRecord[]>([]);
  const [visitorStatsLoading, setVisitorStatsLoading] = useState<boolean>(false);
  const [activeAdminTab, setActiveAdminTab] = useState<"products" | "visitors">("products");

  // Notification Toast log
  const [logMessage, setLogMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Synchronize visitor analytics list when admin is authenticated
  useEffect(() => {
    if (currentUser) {
      fetchVisitorAnalytics();
    } else {
      setVisitorLogs([]);
    }
  }, [currentUser]);

  const fetchVisitorAnalytics = async () => {
    setVisitorStatsLoading(true);
    try {
      const logs = await getVisitorLogs();
      setVisitorLogs(logs);
    } catch (err) {
      console.error("Failed to load visitor logs:", err);
    } finally {
      setVisitorStatsLoading(false);
    }
  };

  // Trigger custom state snapshots and online listener hooks
  useEffect(() => {
    // 1. Real-time online checker
    const removeNetworkListener = registerNetworkStateListener((online) => {
      setIsOnline(online);
      triggerToast(online ? "System online. Real-time databases synced." : "Workspace offline. Some writes may be queued.", online ? "success" : "error");
    });

    // 2. Auth listener
    const removeAuthListener = checkAuthState((user) => {
      setCurrentUser(user);
    });

    // 3. Real-time Snapshot listeners
    const removeSnapshotListener = onProductsSnapshot((snapshotList) => {
      const mapped = snapshotList.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        size: p.size,
        feature: p.feature,
        price: p.price,
        badge: p.badge || (p.category === "hot-selling" ? "Hot Selling" : p.category === "new-brands" ? "New Arrival" : "Famous"),
        segment: p.segment || (p.category === "hot-selling" ? "hot" : p.category === "new-brands" ? "new" : "famous"),
        image: p.image || p.imageUrl,
        stock: p.stock || 0,
        description: p.description || ""
      }));
      setProducts(mapped);
      setLoading(false);
      
      // Update low stock list
      getLowStockProducts(5).then(lows => setLowStockProducts(lows)).catch(err => console.log(err));
    });

    return () => {
      removeNetworkListener();
      removeAuthListener();
      removeSnapshotListener();
    };
  }, []);

  const triggerToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setLogMessage({ text, type });
    setTimeout(() => setLogMessage(null), 4000);
  };

  // Login handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      triggerToast("Please supply email and password", "error");
      return;
    }
    setAuthLoading(true);
    try {
      if (isRegisterMode) {
        await createAdminUser(authEmail, authPassword);
        triggerToast("Admin created and authenticated successfully!", "success");
      } else {
        await loginAdmin(authEmail, authPassword);
        triggerToast("Authenticated successfully as Administrator!", "success");
      }
      setAuthEmail("");
      setAuthPassword("");
    } catch (err: any) {
      triggerToast(err.message || "Authentication attempt rejected.", "error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutAdmin();
      triggerToast("Signed out successfully.", "info");
    } catch (err) {
      triggerToast("Signout failed.", "error");
    }
  };

  // Pre-fill edit form
  const handleEditClick = (prod: any) => {
    setEditingProduct(prod);
    setFormId(prod.id);
    setFormName(prod.name);
    setFormBrand(prod.brand);
    setFormSize(prod.size);
    setFormFeature(prod.feature);
    setFormPrice(prod.price);
    setFormStock(prod.stock || 10);
    setFormBadge(prod.badge);
    setFormSegment(prod.segment);
    setFormImage(prod.image);
    setFormDescription(prod.description);
    setShowAddForm(true); // Open the form drawer
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  // Reset/Clear Form Fields
  const clearForm = () => {
    setEditingProduct(null);
    setFormId("");
    setFormName("");
    setFormBrand("");
    setFormSize("");
    setFormFeature("");
    setFormPrice(15000);
    setFormStock(10);
    setFormBadge("New Arrival");
    setFormSegment("new");
    setFormImage("");
    setFormDescription("");
    setSelectedFile(null);
  };

  // Handle storage file uploads
  const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Trigger storage upload
  const handleImageUploadToStorage = async () => {
    if (!selectedFile) {
      triggerToast("Please select a file to upload first.", "info");
      return;
    }
    if (!formName) {
      triggerToast("Please define the Tyre Name first to tag your image correctly.", "info");
      return;
    }
    setUploadLoading(true);
    try {
      const responseUrl = await uploadProductImage(selectedFile, formName);
      setFormImage(responseUrl);
      triggerToast("Image asset uploaded to Storage bucket successfully!", "success");
      setSelectedFile(null);
    } catch (err: any) {
      triggerToast(err.message || "Failed to upload image. Writes are restricted.", "error");
    } finally {
      setUploadLoading(false);
    }
  };

  // Create / Save Handler (triggers Firebase writing)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formBrand || !formSize || !formPrice) {
      triggerToast("Please fill in all mandatory inputs.", "error");
      return;
    }

    if (!currentUser) {
      triggerToast("Unauthorized operation. Please log in as Administrator first.", "error");
      return;
    }

    const imgUrl = formImage.trim() || "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=600";
    const customId = formId || `custom-${Date.now()}`;

    const parsedPrice = parseInt(String(formPrice), 10);
    const parsedStock = parseInt(String(formStock), 10);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      triggerToast("Price must be a valid positive integer.", "error");
      return;
    }

    const categoryMapped = formSegment === "hot" ? "hot-selling" : formSegment === "new" ? "new-brands" : "famous";

    const payload: TireProduct & { stock: number } = {
      id: customId,
      name: formName,
      brand: formBrand,
      size: formSize,
      feature: formFeature,
      price: parsedPrice,
      badge: formBadge,
      segment: formSegment,
      image: imgUrl,
      stock: parsedStock,
      description: formDescription.trim() || `Premium high-durability tire configured specifically for the local roads of Lahore.`
    };

    try {
      await saveTireProduct(payload);
      triggerToast(
        editingProduct 
          ? `Successfully saved modifications for '${payload.name}'!` 
          : `Successfully registered and seeded '${payload.name}' into the database!`,
        "success"
      );
      clearForm();
      setShowAddForm(false);
      onRefreshProducts(); // Trigger app refetch
    } catch (err: any) {
      console.error(err);
      triggerToast(`Operation rejected. Verify schema rules or Admin privileges.`, "error");
    }
  };

  // Delete Handler
  const handleDeleteClick = async (id: string, name: string) => {
    if (!currentUser) {
      triggerToast("Authentication required. Please log in to complete deletions.", "error");
      return;
    }
    if (!window.confirm(`Are you absolutely sure you want to delete '${name}'?`)) {
      return;
    }

    try {
      await deleteTireProduct(id);
      triggerToast(`Deleted '${name}' from Firestore!`, "info");
      onRefreshProducts();
    } catch (err) {
      triggerToast("Restricted write. Confirm your role.", "error");
    }
  };

  // Bulk rate updater
  const handleBulkUpdate = async () => {
    if (!currentUser) {
      triggerToast("Admin authentication is required for bulk price variations.", "error");
      return;
    }
    if (!window.confirm(`Are you sure you want to alter ALL inventory prices by ${bulkPercent}%?`)) {
      return;
    }
    setBulkLoading(true);
    try {
      await bulkUpdatePrices(bulkPercent);
      triggerToast(`Successfully adjusted all catalog rates in bulk by ${bulkPercent}%!`, "success");
      onRefreshProducts();
    } catch (err: any) {
      triggerToast(err.message || "Bulk operation failed. Check rules permissions.", "error");
    } finally {
      setBulkLoading(false);
    }
  };

  // JSON backup download
  const handleExportJSON = async () => {
    try {
      await exportToJSON();
      triggerToast("Product catalog downloaded successfully!", "success");
    } catch (e) {
      triggerToast("Export failed.", "error");
    }
  };

  // JSON backup upload
  const handleImportJSONChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser) {
      triggerToast("Admin authentication is required to run database imports.", "error");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!window.confirm(`This will import products from '${file.name}'. Duplicate profiles will be ignored. Proceed?`)) {
        return;
      }
      try {
        const outcomes = await importFromJSON(file);
        triggerToast(`Import completed with success! Added: ${outcomes.imported} items, Ignored (Duplicates): ${outcomes.duplicates} items.`, "success");
        onRefreshProducts();
      } catch (err: any) {
        triggerToast(err.message || "Failed to process database import file.", "error");
      }
    }
  };

  // Filter local inventory display list
  const filteredProducts = products.filter((p) => {
    const term = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.size.toLowerCase().includes(term) ||
      p.segment.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8">
      {/* Toast Alert popup banner */}
      {logMessage && (
        <div className={`fixed bottom-6 right-6 z-55 max-w-sm rounded-2xl p-4 shadow-2xl border transition-all duration-300 flex items-center space-x-3 text-sm font-semibold animate-bounce ${
          logMessage.type === "success" 
            ? "bg-green-600 text-white border-green-500" 
            : logMessage.type === "error" 
            ? "bg-red-600 text-white border-red-500" 
            : "bg-blue-600 text-white border-blue-500"
        }`}>
          <span>{logMessage.type === "success" ? "✔" : "ℹ"}</span>
          <p className="flex-1">{logMessage.text}</p>
        </div>
      )}

      {/* Connection Checker & Admin Identity Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs ${
        darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
      }`}>
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <span className="flex items-center space-x-1.5 text-emerald-500">
              <Wifi className="w-4 h-4" />
              <span className="font-bold">SYSTEM ONLINE (bahaduralimunnabhai@gmail.com)</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1.5 text-rose-500">
              <WifiOff className="w-4 h-4 animate-pulse" />
              <span className="font-bold">SYSTEM OFFLINE (LOCAL CACHE SHIELDS ACTIVE)</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <span className="text-emerald-400 font-semibold truncate max-w-xs">
                👤 Admin: {currentUser.email}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-1.5 px-3 rounded-lg border border-red-500/20 flex items-center space-x-1 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <span className="text-amber-500 font-semibold flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Role: Unauthenticated Client (Sign in below to write to DB)</span>
            </span>
          )}
        </div>
      </div>

      {/* Admin Credentials Login Form Panel (when not logged in) */}
      {!currentUser && (
        <form
          onSubmit={handleAuthSubmit}
          className={`p-6 rounded-3xl border ${
            darkMode ? "bg-[#1c1c24] border-white/5" : "bg-white border-slate-200 shadow-sm"
          }`}
          id="admin-login-form"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Lock className="w-5 h-5 text-brand-orange" />
            <h3 className="font-display font-bold text-base">
              {isRegisterMode ? "Create New Security Admin Account" : "Registered Administrator Authentication"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            By default, Firestore security rules block unauthorized browser requests. Use this panel to sign in with an administrator email and password, or quickly register a credentials profile below!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider block mb-1">Email Username</label>
              <input
                type="email"
                required
                placeholder="e.g. admin@haiderbrothers.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-brand-orange ${
                  darkMode ? "bg-black/35 border-white/10 text-white" : "bg-slate-50 border-slate-200"
                }`}
                id="admin-email-field"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider block mb-1">Secure Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-brand-orange ${
                  darkMode ? "bg-black/35 border-white/10 text-white" : "bg-slate-50 border-slate-200"
                }`}
                id="admin-password-field"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs text-brand-orange hover:underline self-start text-left"
            >
              {isRegisterMode ? "Already have an account? Sign in here" : "Don't have an admin credential? Register one instantly"}
            </button>

            <button
              type="submit"
              disabled={authLoading}
              className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold p-2.5 px-6 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-brand-orange/20"
              id="admin-auth-btn"
            >
              {authLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
              <span>{isRegisterMode ? "Create Admin Credentials" : "Authorize Session"}</span>
            </button>
          </div>
        </form>
      )}

      {/* KPI stats display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border flex items-center space-x-4 transition-all ${
          darkMode ? "bg-[#1c1c24] border-white/5" : "bg-white border-slate-200/60 shadow-xs"
        }`}>
          <div className="p-3 bg-brand-orange/10 rounded-xl text-brand-orange font-bold text-lg">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className={`text-[10px] font-mono block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              FIRESTORE PRODUCTS COUNT
            </span>
            <span className="text-xl sm:text-2xl font-display font-black text-brand-orange leading-none">
              {products.length} Items
            </span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border flex items-center space-x-4 transition-all ${
          darkMode ? "bg-[#1c1c24] border-white/5" : "bg-white border-slate-200/60 shadow-xs"
        }`}>
          <div className="p-3 bg-green-500/10 rounded-xl text-green-500 font-bold text-lg">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <span className={`text-[10px] font-mono block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              AVERAGE WHOLESALE RATE
            </span>
            <span className="text-xl sm:text-2xl font-display font-black text-green-500 leading-none">
              PKR {Math.round(products.reduce((acc, current) => acc + current.price, 0) / (products.length || 1)).toLocaleString()}
            </span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border flex items-center space-x-4 transition-all ${
          darkMode ? "bg-[#1c1c24] border-white/5" : "bg-white border-slate-200/60 shadow-xs"
        }`}>
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500 font-bold text-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className={`text-[10px] font-mono block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              CRITICAL RESTOCK LOG (STOCK &lt; 5)
            </span>
            <span className="text-xl sm:text-2xl font-display font-black text-indigo-500 leading-none">
              {lowStockProducts.length} Items Alerted
            </span>
          </div>
        </div>
      </div>

      {/* Bulk editing & backup portability deck (visible when logged in) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module A: Bulk Adjustments */}
        <div className={`p-5 rounded-3xl border flex flex-col justify-between ${
          darkMode ? "bg-[#1c1c24] border-white/5" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <h4 className="font-display font-bold text-sm tracking-tight flex items-center space-x-1">
              <Tag className="w-4 h-4 text-emerald-500" />
              <span>Bulk Margin Adjustment Command</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Instantly increment or decrement ALL prices of tires stored in your Firestore database using a single batch payload.
            </p>

            <div className="mt-4 space-y-3">
              <label className="text-[10px] font-mono text-slate-400 block">
                Adjust Rate (Percentage % Value): <span className="text-brand-orange font-bold font-sans text-sm">{bulkPercent > 0 ? `+${bulkPercent}` : bulkPercent}%</span>
              </label>
              <div className="flex items-center space-x-3">
                <span className="text-[10px] text-slate-500 font-mono">-50%</span>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="5"
                  value={bulkPercent}
                  onChange={(e) => setBulkPercent(parseInt(e.target.value, 10))}
                  className="w-full accent-brand-orange bg-slate-200 dark:bg-neutral-800 rounded-lg"
                />
                <span className="text-[10px] text-slate-500 font-mono">+50%</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleBulkUpdate}
              disabled={bulkLoading || !currentUser}
              className={`w-full p-2.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-center space-x-1.5 ${
                currentUser 
                  ? "bg-[#10b981] text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/10" 
                  : "bg-slate-300 dark:bg-neutral-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {bulkLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Wrench className="w-4 h-4" />
              )}
              <span>{currentUser ? `Apply ${bulkPercent}% Price Adjustment` : "Login to enable bulk command"}</span>
            </button>
          </div>
        </div>

        {/* Module B: JSON Data Portability (Export & Import) */}
        <div className={`p-5 rounded-3xl border flex flex-col justify-between ${
          darkMode ? "bg-[#1c1c24] border-white/5" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <h4 className="font-display font-bold text-sm tracking-tight flex items-center space-x-1">
              <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
              <span>Firebase Backup Data Portability</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Download your complete inventory collection as a standard JSON file, or restore assets from backups with automatic duplicate detection.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            {/* Export */}
            <button
              onClick={handleExportJSON}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                darkMode 
                  ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20" 
                  : "border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100"
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Export Backup</span>
            </button>

            {/* Import file mask */}
            <div className="relative">
              <input
                type="file"
                accept=".json"
                disabled={!currentUser}
                onChange={handleImportJSONChange}
                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                id="file-import-input"
              />
              <span className={`w-full p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                currentUser 
                  ? darkMode
                    ? "border-violet-500/20 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20" 
                    : "border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100"
                  : "border-slate-300 dark:border-neutral-800 bg-slate-300/10 dark:bg-neutral-800/25 text-slate-500 cursor-not-allowed"
              }`}>
                <Upload className="w-4 h-4" />
                <span>Upload JSON</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Button controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex items-center gap-2">
          {currentUser && (
            <button
              onClick={() => { clearForm(); setShowAddForm(!showAddForm); }}
              className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-brand-orange/20"
              id="admin-new-tyre-btn"
            >
              {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showAddForm ? "Close Form Panel" : "Add New Tyre"}</span>
            </button>
          )}

          <button
            onClick={() => onRefreshProducts()}
            className={`p-2.5 rounded-xl border flex items-center gap-1 text-xs transition-all ${
              darkMode ? "border-white/10 hover:bg-white/5 text-slate-300" : "border-slate-200 hover:bg-slate-50 text-slate-700"
            }`}
            title="Refresh list"
            id="admin-sync-btn"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync DB</span>
          </button>
        </div>

        {/* Display badge for low stock warning items */}
        {lowStockProducts.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5">
            <AlertTriangle className="w-4.5 h-4.5 animate-pulse" />
            <span>Stock alerts: {lowStockProducts.length} items cataloged under 5 units!</span>
          </div>
        )}
      </div>

      {/* Add / Edit Form Panel */}
      {showAddForm && currentUser && (
        <form 
          onSubmit={handleSaveProduct}
          className={`p-6 sm:p-8 rounded-2xl border transition-all ${
            darkMode ? "glassmorphism box-glow" : "glassmorphism-light shadow-xl"
          }`}
          id="tire-product-form"
        >
          <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5 mb-6">
            <h4 className="font-display font-bold text-md flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-orange" />
              <span>{editingProduct ? `Edit Tyre Configuration: ${editingProduct.name}` : "Create New Tyre Product"}</span>
            </h4>
            <button
              type="button"
              onClick={clearForm}
              className={`text-xs ${darkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-black"}`}
            >
              Clear Values
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tyre Name */}
            <div>
              <label className="text-xs font-mono font-semibold block mb-1">Tyre Name (Model) *</label>
              <input
                type="text"
                required
                placeholder="e.g. Pilot Sport 5"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className={`w-full p-2.5 rounded-xl text-xs border focus:ring-1 focus:ring-brand-orange focus:outline-none ${
                  darkMode ? "bg-black/35 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              />
            </div>

            {/* Brand */}
            <div>
              <label className="text-xs font-mono font-semibold block mb-1">Brand (Manufacturer) *</label>
              <input
                type="text"
                required
                placeholder="e.g. Michelin"
                value={formBrand}
                onChange={(e) => setFormBrand(e.target.value)}
                className={`w-full p-2.5 rounded-xl text-xs border focus:ring-1 focus:ring-brand-orange focus:outline-none ${
                  darkMode ? "bg-black/35 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              />
            </div>

            {/* Size */}
            <div>
              <label className="text-xs font-mono font-semibold block mb-1">Tyre Size Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. 205/55R16"
                value={formSize}
                onChange={(e) => setFormSize(e.target.value)}
                className={`w-full p-2.5 rounded-xl text-xs border focus:ring-1 focus:ring-brand-orange focus:outline-none ${
                  darkMode ? "bg-black/35 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              />
            </div>

            {/* Feature Highlight */}
            <div>
              <label className="text-xs font-mono font-semibold block mb-1">Highlight Feature *</label>
              <input
                type="text"
                required
                placeholder="e.g. Comfort ride and wet braking compound"
                value={formFeature}
                onChange={(e) => setFormFeature(e.target.value)}
                className={`w-full p-2.5 rounded-xl text-xs border focus:ring-1 focus:ring-brand-orange focus:outline-none ${
                  darkMode ? "bg-black/35 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              />
            </div>

            {/* Price (PKR) */}
            <div>
              <label className="text-xs font-mono font-semibold block mb-1">Price (PKR Rate) *</label>
              <input
                type="number"
                required
                min={1}
                placeholder="e.g. 15000"
                value={formPrice}
                onChange={(e) => setFormPrice(parseInt(e.target.value, 10) || 15000)}
                className={`w-full p-2.5 rounded-xl text-xs border focus:ring-1 focus:ring-brand-orange focus:outline-none ${
                  darkMode ? "bg-black/35 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              />
            </div>

            {/* Segment Type */}
            <div>
              <label className="text-xs font-mono font-semibold block mb-1">Segment Category *</label>
              <select
                required
                value={formSegment}
                onChange={(e) => {
                  setFormSegment(e.target.value as any);
                  if (e.target.value === "hot") setFormBadge("Hot Selling");
                  else if (e.target.value === "new") setFormBadge("New Arrival");
                  else setFormBadge("Famous");
                }}
                className={`w-full p-2.5 rounded-xl text-xs border focus:ring-1 focus:ring-brand-orange focus:outline-none ${
                  darkMode ? "bg-black/35 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                <option value="hot">Hot Selling</option>
                <option value="new">New Arrival</option>
                <option value="famous">Famous Bestseller</option>
              </select>
            </div>

            {/* Stock Levels */}
            <div>
              <label className="text-xs font-mono font-semibold block mb-1">Showroom Stock Units *</label>
              <input
                type="number"
                required
                min={0}
                placeholder="e.g. 10"
                value={formStock}
                onChange={(e) => setFormStock(parseInt(e.target.value, 10) || 0)}
                className={`w-full p-2.5 rounded-xl text-xs border focus:ring-1 focus:ring-brand-orange focus:outline-none ${
                  darkMode ? "bg-black/35 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              />
            </div>

            {/* Image path */}
            <div>
              <label className="text-xs font-mono font-semibold block mb-1">Image Address URL</label>
              <input
                type="text"
                placeholder="Leave blank to upload file instead"
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
                className={`w-full p-2.5 rounded-xl text-xs border focus:ring-1 focus:ring-brand-orange focus:outline-none ${
                  darkMode ? "bg-black/35 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              />
            </div>

            {/* Firebase Storage Image Upload module */}
            <div>
              <label className="text-xs font-mono font-semibold block mb-1">Upload To Storage Bucket</label>
              <div className="flex items-center space-x-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUploadChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 p-2.5 rounded-xl text-[10px] font-bold border flex items-center justify-center space-x-1 ${
                    darkMode ? "border-white/10 bg-white/5 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-brand-orange" />
                  <span className="truncate">{selectedFile ? selectedFile.name : "Select Asset"}</span>
                </button>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleImageUploadToStorage}
                    disabled={uploadLoading}
                    className="p-2.5 bg-brand-orange text-white text-[10px] font-bold rounded-xl flex items-center space-x-0.5"
                  >
                    {uploadLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                    <span>Upload</span>
                  </button>
                )}
              </div>
            </div>

            {/* Display Badge */}
            <div>
              <label className="text-xs font-mono block mb-1">Display Flag Badge</label>
              <input
                type="text"
                value={formBadge}
                onChange={(e) => setFormBadge(e.target.value)}
                className={`w-full p-2.5 rounded-xl text-xs border focus:ring-1 focus:ring-brand-orange focus:outline-none ${
                  darkMode ? "bg-black/35 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              />
            </div>

            {/* Detailed Description */}
            <div className="md:col-span-2">
              <label className="text-xs font-mono font-semibold block mb-1">Detailed Commercial Description</label>
              <textarea
                rows={2}
                placeholder="Provide details about speed rating, mileage targets, and wet grip attributes..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className={`w-full p-2.5 rounded-xl text-xs border focus:ring-1 focus:ring-brand-orange focus:outline-none ${
                  darkMode ? "bg-black/35 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => { clearForm(); setShowAddForm(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                darkMode ? "bg-white/5 hover:bg-white/10 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center space-x-1 shadow-md shadow-brand-orange/25"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingProduct ? "Save Modifications" : "SeedTest/Publish to Firestore"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Admin Feature Tabs */}
      {currentUser && (
        <div className="flex border-b border-black/5 dark:border-white/10 pb-0.5 space-x-6">
          <button
            type="button"
            onClick={() => setActiveAdminTab("products")}
            className={`pb-3 text-sm font-bold font-display relative transition-all flex items-center space-x-2 ${
              activeAdminTab === "products" 
                ? "text-brand-orange" 
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            <span>Tire Store Catalog</span>
            {activeAdminTab === "products" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveAdminTab("visitors")}
            className={`pb-3 text-sm font-bold font-display relative transition-all flex items-center space-x-2 ${
              activeAdminTab === "visitors" 
                ? "text-brand-orange" 
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <span>Visitor Traffic Analytics</span>
              <span className="text-[10px] bg-brand-orange/15 text-brand-orange px-2 py-0.5 rounded-full font-mono">
                {visitorLogs.length} Logs
              </span>
            </span>
            {activeAdminTab === "visitors" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange rounded-full" />
            )}
          </button>
        </div>
      )}

      {activeAdminTab === "products" ? (
        /* Main Inventory Listings Search table panel */
        <div className={`rounded-2xl border overflow-hidden ${
          darkMode ? "bg-black/20 border-white/10" : "bg-white border-slate-200/80 shadow-xs"
        }`}>
          {/* Search header info */}
          <div className="p-4 border-b border-black/5 dark:border-white/5 flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
            <h5 className="font-display font-medium text-sm">
              Live Tire Catalog List ({filteredProducts.length} entries shown)
            </h5>

            <div className="relative max-w-sm w-full">
              <input
                type="text"
                placeholder="Search by brand, model, size..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full p-2 pl-9 rounded-xl text-xs border focus:ring-1 focus:ring-brand-orange focus:outline-none ${
                  darkMode ? "bg-black/30 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
                id="inventory-search-input"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Loading Indicator */}
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 text-brand-orange animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-400">Loading catalog indexing records...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`font-mono text-[10px] uppercase font-bold text-slate-500 border-b ${
                  darkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"
                }`}>
                  <tr>
                    <th className="p-3">Tyre (Make/Model)</th>
                    <th className="p-3">Brand</th>
                    <th className="p-3">Size Code</th>
                    <th className="p-3">Wholesale Price</th>
                    <th className="p-3">Stock level</th>
                    <th className="p-3">Segment Highlight</th>
                    {currentUser && <th className="p-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {filteredProducts.map((p: any) => (
                    <tr key={p.id} className={`hover:bg-brand-orange/5 transition-colors`}>
                      <td className="p-3 font-semibold text-brand-orange flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-slate-500/10 overflow-hidden shrink-0">
                          <img src={p.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span>{p.name}</span>
                      </td>
                      <td className="p-3 text-slate-400 dark:text-slate-300">{p.brand}</td>
                      <td className="p-3 font-mono font-medium">{p.size}</td>
                      <td className="p-3 font-bold text-green-500">PKR {p.price.toLocaleString()}</td>
                      <td className="p-3 font-mono">
                        <span className={`p-1 px-2.5 rounded-full text-[10px] font-bold truncate ${
                          (p.stock || 0) < 5 
                            ? "bg-rose-500/15 text-rose-500 border border-rose-500/10 animate-pulse" 
                            : "bg-emerald-500/15 text-emerald-500 border border-emerald-500/10"
                        }`}>
                          {p.stock !== undefined ? `${p.stock} Units` : "10 Units"}
                        </span>
                      </td>
                      <td className="p-3 uppercase font-mono text-[10px] tracking-wider text-slate-400">
                        <span className="bg-slate-500/10 px-2 py-0.5 rounded-md">
                          {p.segment}
                        </span>
                      </td>
                      {currentUser && (
                        <td className="p-3 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => handleEditClick(p)}
                            className={`p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/10`}
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(p.id, p.name)}
                            className={`p-1.5 rounded-lg text-red-500 hover:bg-red-500/10`}
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-slate-400">
              <span className="text-2xl block mb-2">🎈</span>
              <p className="text-xs">No matching tyre configurations found in database.</p>
            </div>
          )}
        </div>
      ) : (
        /* Visitor Traffic Analytics Panel */
        <div className="space-y-6">
          {/* Analytics KPI grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-2xl border ${darkMode ? "bg-[#1c1c24] border-white/5" : "bg-white border-slate-200/80 shadow-xs"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Total Page Views</span>
                <Eye className="w-4 h-4 text-brand-orange" />
              </div>
              <div className="text-2xl font-black font-display text-brand-orange">{visitorLogs.length} Views</div>
              <p className="text-[10px] text-slate-400 mt-1">Cumulative page navigation hits logged</p>
            </div>

            <div className={`p-4 rounded-2xl border ${darkMode ? "bg-[#1c1c24] border-white/5" : "bg-white border-slate-200/80 shadow-xs"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Unique Visitors</span>
                <Users className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black font-display text-emerald-500">
                {new Set(visitorLogs.map(l => l.sessionId)).size} Sessions
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Total singular client cookie sessions</p>
            </div>

            <div className={`p-4 rounded-2xl border ${darkMode ? "bg-[#1c1c24] border-white/5" : "bg-white border-slate-200/80 shadow-xs"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Primary Live Hub</span>
                <Globe className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-sm font-black font-display text-indigo-400 truncate uppercase mt-1">
                {(() => {
                  const counts: Record<string, number> = {};
                  visitorLogs.forEach(l => { counts[l.pagePath] = (counts[l.pagePath] || 0) + 1; });
                  const top = Object.entries(counts).sort((a,b) => b[1]-a[1])[0];
                  return top ? `${top[0]} (${top[1]} views)` : "N/A";
                })()}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Section driving maximum user count</p>
            </div>

            <div className={`p-4 rounded-2xl border ${darkMode ? "bg-[#1c1c24] border-white/5" : "bg-white border-slate-200/80 shadow-xs"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Dominant OS Client</span>
                <Monitor className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black font-display text-purple-400">
                {(() => {
                  const counts: Record<string, number> = {};
                  visitorLogs.forEach(l => { counts[l.platform] = (counts[l.platform] || 0) + 1; });
                  const top = Object.entries(counts).sort((a,b) => b[1]-a[1])[0];
                  return top ? top[0] : "Web Portal";
                })()}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Identified operating system signature</p>
            </div>
          </div>

          {/* Graphics layout columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section visits bar breakdown */}
            <div className={`p-5 rounded-2xl border ${darkMode ? "bg-black/25 border-white/10" : "bg-white border-slate-200/80 shadow-xs"}`}>
              <h6 className="font-display font-medium text-xs mb-4 uppercase tracking-wider text-slate-400">Section Hits Proportion</h6>
              <div className="space-y-3.5">
                {(() => {
                  const counts: Record<string, number> = {};
                  visitorLogs.forEach(l => { counts[l.pagePath] = (counts[l.pagePath] || 0) + 1; });
                  const items = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
                  const total = visitorLogs.length || 1;
                  return items.slice(0, 5).map(([page, count]) => {
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={page} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-300 font-semibold uppercase">{page}</span>
                          <span className="text-slate-400">{count} views ({pct}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-orange" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  });
                })()}
                {visitorLogs.length === 0 && <p className="text-xs text-slate-500 text-center py-4">No page flow patterns registered yet.</p>}
              </div>
            </div>

            {/* Operating systems bar breakdown */}
            <div className={`p-5 rounded-2xl border ${darkMode ? "bg-black/25 border-white/10" : "bg-white border-slate-200/80 shadow-xs"}`}>
              <h6 className="font-display font-medium text-xs mb-4 uppercase tracking-wider text-slate-400">System Platforms Split</h6>
              <div className="space-y-3.5">
                {(() => {
                  const counts: Record<string, number> = {};
                  visitorLogs.forEach(l => { counts[l.platform] = (counts[l.platform] || 0) + 1; });
                  const items = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
                  const total = visitorLogs.length || 1;
                  return items.slice(0, 5).map(([plat, count]) => {
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={plat} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-300 font-semibold">{plat}</span>
                          <span className="text-slate-400">{count} hits ({pct}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  });
                })()}
                {visitorLogs.length === 0 && <p className="text-xs text-slate-500 text-center py-4">Device platform stream is currently empty.</p>}
              </div>
            </div>
          </div>

          {/* Sequential Live Visitory Logs stream table */}
          <div className={`rounded-2xl border overflow-hidden ${darkMode ? "bg-black/20 border-white/10" : "bg-white border-slate-200/80 shadow-xs"}`}>
            <div className="p-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-black/10">
              <h6 className="font-display font-medium text-xs uppercase tracking-wider text-slate-400">Visitation Sequence Logs</h6>
              <button
                type="button"
                onClick={fetchVisitorAnalytics}
                className="text-xs font-semibold text-brand-orange hover:underline flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Live Traffic</span>
              </button>
            </div>

            {visitorStatsLoading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 text-brand-orange animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-400">Querying analytical traffic logs from cloud...</p>
              </div>
            ) : visitorLogs.length > 0 ? (
              <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`font-mono text-[10px] uppercase font-bold text-slate-500 border-b ${
                    darkMode ? "bg-neutral-900 border-white/5" : "bg-slate-50 border-slate-100"
                  }`}>
                    <tr>
                      <th className="p-3 pl-4">Timestamp (Asia/Karachi)</th>
                      <th className="p-3">Session Hash</th>
                      <th className="p-3">Device OS</th>
                      <th className="p-3">Client Language</th>
                      <th className="p-3">Section Section ID</th>
                      <th className="p-3 pr-4 truncate max-w-xs">User Agent string</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5 font-mono text-[11px]">
                    {visitorLogs.map((log) => {
                      const timeStr = log.timestamp
                        ? new Date(log.timestamp.seconds * 1000).toLocaleString("en-PK", { timeZone: "Asia/Karachi" })
                        : "Syncing timestamp...";
                      return (
                        <tr key={log.id} className="hover:bg-brand-orange/5 transition-colors text-slate-400 dark:text-slate-300">
                          <td className="p-3 pl-4 font-bold text-slate-500">{timeStr}</td>
                          <td className="p-3 font-semibold text-emerald-400">{log.sessionId.substring(4, 14)}...</td>
                          <td className="p-3 font-sans">
                            <span className="p-1 px-2 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/5 rounded-md">
                              {log.platform}
                            </span>
                          </td>
                          <td className="p-3">{log.language}</td>
                          <td className="p-3 font-bold text-brand-orange uppercase">{log.pagePath}</td>
                          <td className="p-3 pr-4 truncate max-w-[200px] text-[10px] text-slate-500" title={log.userAgent}>
                            {log.userAgent}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                <p className="text-xs">No user navigation sessions registered in the Firebase storage logs yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
