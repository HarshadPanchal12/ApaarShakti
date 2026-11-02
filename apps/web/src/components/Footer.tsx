import Link from "next/link";
import { Shield, ExternalLink, Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-12 text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-900">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Shield className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">APAAR-Verify</span>
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-mono text-indigo-400 border border-indigo-500/20">
                SIH26263
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Smart Student Data Management & Verification Platform designed for Smart India Hackathon 2026 (Problem Statement SIH26263 — AICTE, Theme: Smart Automation).
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed max-w-md">
              <strong>Notice:</strong> This platform uses neutral design placeholders and synthetic data. No official Government of India or AICTE emblems are utilized.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200">
              Platform Features
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="#pipeline" className="hover:text-white transition">
                  5-Stage Autonomous Pipeline
                </Link>
              </li>
              <li>
                <Link href="#verify" className="hover:text-white transition">
                  Live Verification Sandbox
                </Link>
              </li>
              <li>
                <Link href="#automation" className="hover:text-white transition">
                  Smart Automation Registry
                </Link>
              </li>
              <li>
                <Link href="#roles" className="hover:text-white transition">
                  NIST Multi-Role Portals
                </Link>
              </li>
              <li>
                <Link href="#security" className="hover:text-white transition">
                  Cryptographic Integrity & DPDP
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Contact */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200">
              Statutory & Privacy
            </h4>
            <ul className="space-y-2">
              <li className="text-slate-400">
                DPDP Act 2023 Aligned
              </li>
              <li className="text-slate-400">
                Zero-Knowledge HMAC APAAR
              </li>
              <li className="text-slate-400">
                Grievance: <span className="text-indigo-400 font-mono">grievance@apaar-verify.dev</span>
              </li>
              <li className="text-slate-400">
                Keys: <span className="text-teal-400 font-mono">/.well-known/apaar-verify-keys.json</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 APAAR-Verify • Hackathon Production Prototype (AICTE Theme: Smart Automation).
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono">FastAPI + Next.js 15 + Supabase + Ed25519</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

