"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Bell, 
  ChevronDown, 
  LogOut, 
  User, 
  Building2, 
  MapPin, 
  Globe, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  Zap
} from "lucide-react";
import { useAuth, PRESET_DEMO_ACCOUNTS, RoleScope } from "@/lib/auth-context";

export function PortalHeader() {
  const { user, activeRoleScope, availableRoleScopes, switchRoleScope, logout, loginAsDemo } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 sm:px-6 backdrop-blur-xl">
      {/* Left: Active Scope Banner */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">Active Persona:</span>
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700/80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              <span className={`h-2 w-2 rounded-full ${activeRoleScope?.badgeColor?.includes("teal") ? "bg-teal-400" : activeRoleScope?.badgeColor?.includes("purple") ? "bg-purple-400" : "bg-indigo-400"}`} />
              <span className="font-mono text-indigo-400 font-bold">{activeRoleScope?.role || "ROLE"}</span>
              <span className="text-slate-400 hidden md:inline-block">• {activeRoleScope?.scopeName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Quick Switch Dropdown */}
            {roleDropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 rounded-2xl glass-panel border border-slate-700 bg-slate-900/95 p-3 shadow-2xl z-50">
                <div className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1 mb-1 font-bold">
                  Switch Active Role & Scope:
                </div>

                <div className="space-y-1 mb-3">
                  {availableRoleScopes.map((scope, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        switchRoleScope(scope);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs transition flex items-center justify-between ${
                        activeRoleScope?.role === scope.role && activeRoleScope?.scopeId === scope.scopeId
                          ? "bg-indigo-600/30 text-indigo-300 font-bold"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-semibold text-white">{scope.role}</div>
                        <div className="text-[10px] text-slate-400 truncate">{scope.scopeName}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-800 text-slate-400">
                        {scope.scopeType}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1 mb-1 font-bold">
                    Switch to Another Demo Account:
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    {PRESET_DEMO_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => {
                          loginAsDemo(acc.id);
                          setRoleDropdownOpen(false);
                        }}
                        className="text-left px-2 py-1 rounded bg-slate-950 text-slate-300 hover:bg-indigo-600/20 hover:text-indigo-300 truncate"
                      >
                        {acc.primaryRole.replace("AICTE_", "").replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions, Notifications, User Menu */}
      <div className="flex items-center gap-3">
        {/* Smart Automation Status Tag */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-mono font-semibold text-emerald-400 border border-emerald-500/20">
          <Zap className="h-3 w-3" />
          <span>Automation Engine: Active</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative rounded-xl bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white">
              3
            </span>
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel border border-slate-700 bg-slate-900/95 p-4 shadow-2xl z-50">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="text-xs font-bold text-white font-mono">AUTOMATED ALERTS</span>
                <span className="text-[10px] text-teal-400 font-mono">3 Unread</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800/80">
                  <div className="font-semibold text-amber-300">Intake Threshold Warning</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    CSE admissions at 98% approved capacity. Window closes in 6 days.
                  </div>
                </div>
                <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800/80">
                  <div className="font-semibold text-red-400">Cross-Institution Match</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Duplicate case #DC-904 opened for dual enrolment. Status auto-frozen.
                  </div>
                </div>
                <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800/80">
                  <div className="font-semibold text-teal-300">Credentials Generated</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    412 Ed25519 verifiable credentials signed and dispatched.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Logout */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 p-1.5 pl-2.5 text-xs text-slate-300 hover:border-slate-700 transition"
          >
            <span className="font-semibold text-white hidden sm:inline-block">
              {user?.fullName?.split(" ")[0] || "User"}
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-400 font-bold text-xs">
              {user?.fullName?.charAt(0) || "U"}
            </div>
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-slate-700 bg-slate-900/95 p-3 shadow-2xl z-50">
              <div className="px-2 py-1.5 border-b border-slate-800 mb-2">
                <div className="text-xs font-bold text-white">{user?.fullName}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
              </div>
              <Link
                href="/auth/role-picker"
                className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5 text-indigo-400" />
                Change Active Role
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-rose-400 hover:bg-rose-500/10 text-left mt-1"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

