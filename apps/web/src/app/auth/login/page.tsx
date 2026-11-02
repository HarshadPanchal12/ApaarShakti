"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Shield, 
  ArrowRight, 
  Lock, 
  Mail, 
  Building2, 
  MapPin, 
  Globe, 
  BarChart3, 
  Search, 
  UserCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  KeyRound 
} from "lucide-react";
import { useAuth, PRESET_DEMO_ACCOUNTS } from "@/lib/auth-context";

export default function LoginPage() {
  const { loginAsDemo } = useAuth();
  const [selectedDemoId, setSelectedDemoId] = useState<string>("inst-admin");
  const [email, setEmail] = useState("registrar@iit-surat.ac.in");
  const [password, setPassword] = useState("demo2026!");
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaCode, setMfaCode] = useState("492810");

  const selectedAccount =
    PRESET_DEMO_ACCOUNTS.find((a) => a.id === selectedDemoId) || PRESET_DEMO_ACCOUNTS[0];

  const handleSelectDemo = (id: string) => {
    setSelectedDemoId(id);
    const acc = PRESET_DEMO_ACCOUNTS.find((a) => a.id === id);
    if (acc) {
      setEmail(acc.email);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccount.primaryRole.startsWith("AICTE_") || selectedAccount.primaryRole === "SYSTEM_ADMIN") {
      setShowMfaModal(true);
    } else {
      loginAsDemo(selectedDemoId);
    }
  };

  const handleMfaConfirm = () => {
    setShowMfaModal(false);
    loginAsDemo(selectedDemoId);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-slate-950 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 group-hover:scale-105 transition">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">APAAR-Verify</span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
          Access Portal & Role Picker
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          SIH26263 • AICTE Student Verification Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4 sm:px-0">
        <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl">
          {/* Quick Demo Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Select Instant Demo Persona:
              </span>
              <span className="text-[11px] text-slate-500 font-mono">1-Click Login</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_DEMO_ACCOUNTS.map((acc) => {
                const isSelected = acc.id === selectedDemoId;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectDemo(acc.id)}
                    className={`flex flex-col text-left p-2.5 rounded-xl border transition text-xs ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 text-white shadow-sm"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <span className="font-semibold truncate text-[11px]">{acc.name}</span>
                    <span className="text-[10px] text-indigo-400 truncate mt-0.5 font-mono">
                      {acc.primaryRole.replace("AICTE_", "").replace("_", " ")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Official Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <span className="text-[11px] text-slate-500 font-mono">Demo: demo2026!</span>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Scope info preview */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3 text-xs">
              <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] mb-1">
                <span>Active Scope:</span>
                <span className="text-teal-400 font-bold">{selectedAccount.roles[0].scopeType}</span>
              </div>
              <div className="text-slate-200 font-medium">{selectedAccount.roles[0].scopeName}</div>
              <div className="text-[11px] text-slate-400 mt-1">{selectedAccount.description}</div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 transition"
              >
                Sign In as {selectedAccount.name}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Quick Direct 1-Click Launch */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Skip password entry:</span>
            <button
              onClick={() => loginAsDemo(selectedDemoId)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 font-mono"
            >
              Instant 1-Click Entry →
            </button>
          </div>
        </div>
      </div>

      {/* TOTP MFA Modal for AICTE & Admin Roles */}
      {showMfaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full rounded-2xl glass-panel border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">TOTP MFA Mandatory</h3>
                <p className="text-xs text-amber-400 font-mono">Mandatory for AICTE & Admin Roles</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              As per AICTE security guidelines, two-factor authentication is required for officers and platform administrators. Enter your 6-digit TOTP authenticator code.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                6-Digit Authenticator Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="w-full text-center text-2xl font-mono tracking-widest py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 text-center block mt-1 font-mono">
                (Pre-filled demo TOTP token: 492810)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowMfaModal(false)}
                className="flex-1 py-2 text-xs font-semibold rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleMfaConfirm}
                className="flex-1 py-2 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-md"
              >
                Verify & Enter Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

