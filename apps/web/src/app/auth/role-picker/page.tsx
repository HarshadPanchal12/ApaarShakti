"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  Globe, 
  Sliders, 
  UserCircle,
  HelpCircle 
} from "lucide-react";

export default function RolePickerPage() {
  const { user, availableRoleScopes, activeRoleScope, switchRoleScope } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-center bg-slate-950 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">APAAR-Verify</span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
          Select Your Active Session Role
        </h2>
        <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
          Logged in as <strong className="text-white">{user?.fullName || "User"}</strong> ({user?.email}).
          You hold multi-valued NIST roles across campuses or regional scopes. Choose which scope to activate for this session:
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl px-4 sm:px-0">
        <div className="space-y-4">
          {availableRoleScopes.map((scope, idx) => {
            const isCurrent =
              activeRoleScope?.role === scope.role && activeRoleScope?.scopeId === scope.scopeId;

            return (
              <div
                key={idx}
                className={`rounded-2xl glass-panel p-6 border transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? "border-indigo-500 bg-indigo-950/40 shadow-xl shadow-indigo-600/10"
                    : "border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
                onClick={() => switchRoleScope(scope)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 shrink-0">
                      {scope.scopeType === "INSTITUTION" ? (
                        <Building2 className="h-6 w-6" />
                      ) : scope.scopeType === "REGION" ? (
                        <MapPin className="h-6 w-6 text-teal-400" />
                      ) : (
                        <Globe className="h-6 w-6 text-purple-400" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-indigo-400">
                          {scope.role}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${scope.badgeColor}`}
                        >
                          {scope.scopeType}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{scope.scopeName}</h3>
                      <p className="text-xs text-slate-400 mt-1 font-mono">
                        Scope Identifier: {scope.scopeId}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500/20 px-3 py-1.5 text-xs font-bold text-teal-300 border border-teal-500/30">
                        <CheckCircle2 className="h-4 w-4" />
                        Active
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          switchRoleScope(scope);
                        }}
                        className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition"
                      >
                        Select
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on Role Switching */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
          <span>
            You can dynamically switch scopes anytime from the top bar in your portal without re-authenticating.
          </span>
        </div>
      </div>
    </div>
  );
}

