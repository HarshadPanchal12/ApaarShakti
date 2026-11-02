"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield, 
  LayoutDashboard, 
  UploadCloud, 
  FileCheck2, 
  AlertTriangle, 
  GitMerge, 
  TrendingUp, 
  BarChart3, 
  Search, 
  UserCircle, 
  Sliders, 
  Key, 
  Link as LinkIcon, 
  Building2, 
  HelpCircle, 
  QrCode,
  Zap,
  Lock,
  Layers
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

export function PortalSidebar() {
  const pathname = usePathname();
  const { activeRoleScope } = useAuth();
  const role = activeRoleScope?.role || "INSTITUTION_ADMIN";

  // Build role-specific navigation items
  let navItems: NavItem[] = [];

  if (role === "INSTITUTION_ADMIN" || role === "INSTITUTION_OPERATOR") {
    navItems = [
      { label: "Institution Dashboard", href: "/portal/institution", icon: LayoutDashboard },
      { label: "Upload Wizard", href: "/portal/institution/upload", icon: UploadCloud, badge: "POLARS" },
      { label: "Validation Results", href: "/portal/institution/validation", icon: FileCheck2 },
      { label: "Programmes & Intake", href: "/portal/institution/programs", icon: Layers },
      { label: "Clarifications Inbox", href: "/portal/institution/clarifications", icon: HelpCircle, badge: "1 PENDING" },
      { label: "Issued Credentials", href: "/portal/institution/credentials", icon: QrCode },
      { label: "ERP API Keys", href: "/portal/institution/api-keys", icon: Key },
    ];
  } else if (role === "AICTE_REGIONAL_OFFICER") {
    navItems = [
      { label: "Regional Command", href: "/portal/regional-officer", icon: LayoutDashboard },
      { label: "Flags Queue", href: "/portal/regional-officer/flags", icon: AlertTriangle, badge: "7 ACTIVE" },
      { label: "Admissions Monitor", href: "/portal/regional-officer/institutions", icon: Building2 },
      { label: "Early-Warning Forecast", href: "/portal/regional-officer/forecast", icon: TrendingUp },
      { label: "Compliance Reports", href: "/portal/regional-officer/reports", icon: BarChart3 },
    ];
  } else if (role === "AICTE_NATIONAL_OFFICER") {
    navItems = [
      { label: "National Command", href: "/portal/national-officer", icon: LayoutDashboard },
      { label: "Duplicate War Room", href: "/portal/national-officer/duplicates", icon: GitMerge, badge: "34 CASES" },
      { label: "Escalation Ladder", href: "/portal/national-officer/escalations", icon: AlertTriangle, badge: "LEVEL 2" },
      { label: "National Leaderboard", href: "/portal/national-officer/leaderboard", icon: BarChart3 },
    ];
  } else if (role === "AICTE_POLICY_ANALYST") {
    navItems = [
      { label: "Policy Dashboard", href: "/portal/analyst", icon: BarChart3, badge: "NO PII" },
      { label: "Intake vs Enrolment", href: "/portal/analyst/intake", icon: TrendingUp },
      { label: "Category Quota Mix", href: "/portal/analyst/quotas", icon: Layers },
      { label: "Data Quality Scores", href: "/portal/analyst/quality", icon: FileCheck2 },
    ];
  } else if (role === "VERIFIER") {
    navItems = [
      { label: "Verify Student", href: "/portal/verifier", icon: Search, badge: "ED25519" },
      { label: "Verification Requests", href: "/portal/verifier/requests", icon: FileCheck2 },
      { label: "Consent Status", href: "/portal/verifier/consent", icon: Lock },
      { label: "Verification Audit Log", href: "/portal/verifier/history", icon: LinkIcon },
    ];
  } else if (role === "STUDENT") {
    navItems = [
      { label: "Academic Identity", href: "/portal/student", icon: UserCircle },
      { label: "Credential & QR", href: "/portal/student/credential", icon: QrCode, badge: "VALID" },
      { label: "Consent Inbox", href: "/portal/student/consents", icon: Lock, badge: "1 REQUEST" },
      { label: "Access Timeline", href: "/portal/student/access-logs", icon: LinkIcon },
    ];
  } else if (role === "SYSTEM_ADMIN") {
    navItems = [
      { label: "System Administration", href: "/portal/admin", icon: Sliders },
      { label: "14 Validation Rules", href: "/portal/admin/rules", icon: FileCheck2 },
      { label: "Seat Categories Config", href: "/portal/admin/seat-categories", icon: Layers },
      { label: "Escalation Policies", href: "/portal/admin/escalation-policies", icon: AlertTriangle },
      { label: "Audit Chain Integrity", href: "/portal/admin/audit-chain", icon: LinkIcon, badge: "UNBROKEN" },
    ];
  }

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Brand Mini Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center gap-2.5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-white tracking-tight">APAAR-Verify</span>
            <span className="text-[10px] text-slate-500 block font-mono">SIH26263 • AICTE</span>
          </div>
        </Link>
      </div>

      {/* Nav List */}
      <div className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="text-[10px] font-mono uppercase text-slate-400 px-3 py-1 font-bold">
          Role Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Global Autonomous Center item for everyone */}
        <div className="pt-4 mt-4 border-t border-slate-800/80">
          <div className="text-[10px] font-mono uppercase text-slate-400 px-3 py-1 font-bold">
            Autonomous Core
          </div>
          <Link
            href="/portal/automation-center"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
              pathname === "/portal/automation-center"
                ? "bg-amber-600 text-white"
                : "text-amber-400/90 hover:bg-slate-900 hover:text-amber-300"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Automation Center</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              LIVE
            </span>
          </Link>
        </div>
      </div>

      {/* Scope Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
          <span>ACTIVE SCOPE:</span>
          <span className="text-teal-400 font-bold">{activeRoleScope?.scopeType}</span>
        </div>
        <div className="text-white truncate font-sans text-xs font-medium">
          {activeRoleScope?.scopeName}
        </div>
      </div>
    </aside>
  );
}

