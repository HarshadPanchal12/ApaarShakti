"use client";

import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Layers, 
  Lock, 
  ShieldCheck, 
  FileSpreadsheet, 
  Download,
  AlertCircle 
} from "lucide-react";

export default function PolicyAnalystPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-amber-400">MACRO POLICY INTELLIGENCE</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">National Technical Education Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AICTE Policy & Enrolment Dashboard
          </h1>
        </div>

        {/* Small-Cell Suppression Privacy Badge */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="rounded-full bg-amber-500/10 px-3 py-1.5 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            Zero PII Access • Small-Cell Suppression (&lt; 5 Hidden)
          </span>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl glass-panel p-5 border border-slate-800">
          <span className="text-slate-400 text-xs font-mono uppercase block mb-1">NATIONAL APPROVED SEATS</span>
          <div className="text-3xl font-extrabold text-white font-mono">1,480,200</div>
          <span className="text-xs text-slate-400 block mt-1">3,847 Approved Institutions</span>
        </div>
        <div className="rounded-2xl glass-panel p-5 border border-slate-800">
          <span className="text-slate-400 text-xs font-mono uppercase block mb-1">NATIONAL ACTUAL FILL</span>
          <div className="text-3xl font-extrabold text-teal-400 font-mono">1,391,388</div>
          <span className="text-xs text-teal-400/80 block mt-1">94.0% Aggregate Intake Fill</span>
        </div>
        <div className="rounded-2xl glass-panel p-5 border border-slate-800">
          <span className="text-slate-400 text-xs font-mono uppercase block mb-1">SUPERNUMERARY ADMISSIONS</span>
          <div className="text-3xl font-extrabold text-indigo-400 font-mono">82,410</div>
          <span className="text-xs text-indigo-300 block mt-1">TFW (4.8%), NRI (1.2%)</span>
        </div>
        <div className="rounded-2xl glass-panel p-5 border border-slate-800">
          <span className="text-slate-400 text-xs font-mono uppercase block mb-1">NATIONAL QUALITY SCORE</span>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">88.6 / 100</div>
          <span className="text-xs text-amber-300 block mt-1">+3.2 YoY Data Compliance</span>
        </div>
      </div>

      {/* Aggregate Table with Small-Cell Suppression Indicator */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-bold text-white block">
              REGIONAL DISCIPLINE ENROLMENT (V_ENROLMENT_BY_INSTITUTION)
            </span>
            <span className="text-[11px] text-slate-400">
              Aggregated at Region × Branch level. Data cells with count &lt; 5 are suppressed (&lt; 5) to prevent re-identification.
            </span>
          </div>

          <button
            onClick={() => alert("Downloading aggregated policy briefing report (PDF/Excel)...")}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-600/30 transition"
          >
            <Download className="h-3.5 w-3.5" />
            Export Aggregate Excel (Clean)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Academic Branch</th>
                <th className="py-3 px-4">Approved Intake</th>
                <th className="py-3 px-4">Enrolment Total</th>
                <th className="py-3 px-4">Fill %</th>
                <th className="py-3 px-4">TFW Quota Count</th>
                <th className="py-3 px-4">FN (Foreign Nat.) Count</th>
                <th className="py-3 px-4">Suppression Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              <tr className="hover:bg-slate-900/40 transition">
                <td className="py-3.5 px-4 font-bold text-white">Western Region (WR)</td>
                <td className="py-3.5 px-4">Computer Science & Engineering</td>
                <td className="py-3.5 px-4 font-mono">84,200</td>
                <td className="py-3.5 px-4 font-mono font-bold text-teal-400">83,190</td>
                <td className="py-3.5 px-4 font-mono">98.8%</td>
                <td className="py-3.5 px-4 font-mono">4,110</td>
                <td className="py-3.5 px-4 font-mono">142</td>
                <td className="py-3.5 px-4">
                  <span className="text-[10px] text-teal-400 font-mono">Normal Aggregate</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-900/40 transition">
                <td className="py-3.5 px-4 font-bold text-white">Northern Region (NR)</td>
                <td className="py-3.5 px-4">Artificial Intelligence & Robotics</td>
                <td className="py-3.5 px-4 font-mono">24,000</td>
                <td className="py-3.5 px-4 font-mono font-bold text-teal-400">23,760</td>
                <td className="py-3.5 px-4 font-mono">99.0%</td>
                <td className="py-3.5 px-4 font-mono">1,180</td>
                <td className="py-3.5 px-4 font-mono">24</td>
                <td className="py-3.5 px-4">
                  <span className="text-[10px] text-teal-400 font-mono">Normal Aggregate</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-900/40 transition">
                <td className="py-3.5 px-4 font-bold text-white">North-Western (NW)</td>
                <td className="py-3.5 px-4">Mining & Metallurgy Engg</td>
                <td className="py-3.5 px-4 font-mono">3,400</td>
                <td className="py-3.5 px-4 font-mono font-bold text-amber-400">2,110</td>
                <td className="py-3.5 px-4 font-mono">62.0%</td>
                <td className="py-3.5 px-4 font-mono">82</td>
                <td className="py-3.5 px-4 font-mono">
                  <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    &lt; 5 (Suppressed)
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-[10px] text-amber-400 font-mono">Small-Cell Suppressed</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-900/40 transition">
                <td className="py-3.5 px-4 font-bold text-white">Southern Region (SR)</td>
                <td className="py-3.5 px-4">Marine Engineering</td>
                <td className="py-3.5 px-4 font-mono">1,800</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-200">1,540</td>
                <td className="py-3.5 px-4 font-mono">85.5%</td>
                <td className="py-3.5 px-4 font-mono">70</td>
                <td className="py-3.5 px-4 font-mono">
                  <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    &lt; 5 (Suppressed)
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-[10px] text-amber-400 font-mono">Small-Cell Suppressed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

