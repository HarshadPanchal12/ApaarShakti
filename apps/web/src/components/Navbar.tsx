"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, CheckCircle2, ChevronRight, Menu, X, ArrowUpRight, Cpu } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-teal-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-950">
              <Shield className="h-5 w-5 text-indigo-400 group-hover:scale-110 transition duration-200" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">APAAR-Verify</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                <Cpu className="h-2.5 w-2.5" />
                SIH26263
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              AICTE Smart Automation • Student Verification
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="#pipeline" className="hover:text-indigo-400 transition">
            Pipeline
          </Link>
          <Link href="#verify" className="hover:text-indigo-400 transition">
            Live Sandbox
          </Link>
          <Link href="#automation" className="hover:text-indigo-400 transition">
            Smart Automation
          </Link>
          <Link href="#roles" className="hover:text-indigo-400 transition">
            Role Portals
          </Link>
          <Link href="#security" className="hover:text-indigo-400 transition">
            Security & DPDP
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="#verify"
            className="flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3.5 py-1.5 text-xs font-semibold text-teal-300 hover:bg-teal-500/20 hover:border-teal-500/50 transition"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Verify Student
          </Link>
          <Link
            href="#roles"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 transition"
          >
            Launch Portals
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          <Link
            href="#pipeline"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-300 hover:text-indigo-400"
          >
            Pipeline
          </Link>
          <Link
            href="#verify"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-300 hover:text-indigo-400"
          >
            Live Sandbox
          </Link>
          <Link
            href="#automation"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-300 hover:text-indigo-400"
          >
            Smart Automation
          </Link>
          <Link
            href="#roles"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-300 hover:text-indigo-400"
          >
            Role Portals
          </Link>
          <Link
            href="#security"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-300 hover:text-indigo-400"
          >
            Security & DPDP
          </Link>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Link
              href="#verify"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3.5 py-2 text-xs font-semibold text-teal-300"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verify Student
            </Link>
            <Link
              href="#roles"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white"
            >
              Launch Portals
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

