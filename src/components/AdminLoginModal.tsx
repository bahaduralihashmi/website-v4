import React, { useState } from "react";
import { X, Lock, RefreshCw, Mail, KeyRound } from "lucide-react";
import { loginAdmin } from "../lib/firebaseService";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  darkMode: boolean;
}

export default function AdminLoginModal({ isOpen, onClose, onSuccess, darkMode }: AdminLoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await loginAdmin(email, password);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Invalid authentication credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl relative transition-colors duration-300 ${
          darkMode ? "bg-[#1c1c24] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
            darkMode ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-black/5 text-slate-500 hover:text-black"
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-brand-orange/15 text-brand-orange">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg text-brand-orange">Staff Authentication</h3>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Direct database verification for Haider Brothers Traders admin
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-600/15 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider block mb-1.5">
              Secure Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="bahaduralimunnabhai@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2.5 pl-9 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange ${
                  darkMode ? "bg-black/40 border-white/10 text-white" : "bg-slate-50 border-slate-200"
                }`}
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider block mb-1.5">
              Enter Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-2.5 pl-9 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange ${
                  darkMode ? "bg-black/40 border-white/10 text-white" : "bg-slate-50 border-slate-200"
                }`}
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-orange to-red-600 hover:from-brand-orange-light hover:to-red-500 text-white font-bold p-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-brand-orange/20 transition-all cursor-pointer mt-2"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
            <span>Verify Credentials</span>
          </button>
        </form>
      </div>
    </div>
  );
}
