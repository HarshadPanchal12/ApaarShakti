"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface RoleScope {
  role: string;
  scopeType: "GLOBAL" | "REGION" | "INSTITUTION";
  scopeId: string;
  scopeName: string;
  badgeColor: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  mfaEnabled: boolean;
  mfaVerified: boolean;
}

export interface DemoAccount {
  id: string;
  email: string;
  name: string;
  primaryRole: string;
  roles: RoleScope[];
  description: string;
  defaultPath: string;
}

export const PRESET_DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "inst-admin",
    email: "registrar@iit-surat.ac.in",
    name: "Dr. K. S. Sharma",
    primaryRole: "INSTITUTION_ADMIN",
    roles: [
      {
        role: "INSTITUTION_ADMIN",
        scopeType: "INSTITUTION",
        scopeId: "1-1029411",
        scopeName: "National Institute of Technology, Surat",
        badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      },
      {
        role: "INSTITUTION_OPERATOR",
        scopeType: "INSTITUTION",
        scopeId: "1-1029411",
        scopeName: "National Institute of Technology, Surat",
        badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/30",
      },
    ],
    description: "Registrar with batch upload, error resolution, and intake management privileges.",
    defaultPath: "/portal/institution",
  },
  {
    id: "regional-officer",
    email: "officer.western@aicte-india.org",
    name: "Rajeshwar Rao",
    primaryRole: "AICTE_REGIONAL_OFFICER",
    roles: [
      {
        role: "AICTE_REGIONAL_OFFICER",
        scopeType: "REGION",
        scopeId: "WR",
        scopeName: "Western Region (MH, GJ, GA)",
        badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
      },
    ],
    description: "Regional officer overseeing compliance, flag reviews, and institution clarifications.",
    defaultPath: "/portal/regional-officer",
  },
  {
    id: "national-officer",
    email: "national.hq@aicte-india.org",
    name: "Smt. Vandana Nair",
    primaryRole: "AICTE_NATIONAL_OFFICER",
    roles: [
      {
        role: "AICTE_NATIONAL_OFFICER",
        scopeType: "GLOBAL",
        scopeId: "NATIONAL",
        scopeName: "National Head Office",
        badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      },
      {
        role: "AICTE_REGIONAL_OFFICER",
        scopeType: "REGION",
        scopeId: "NR",
        scopeName: "Northern Region Overseer",
        badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
      },
    ],
    description: "National oversight, cross-institution duplicate investigation, and automated escalations.",
    defaultPath: "/portal/national-officer",
  },
  {
    id: "policy-analyst",
    email: "analyst@aicte-india.org",
    name: "Ananya Deshmukh",
    primaryRole: "AICTE_POLICY_ANALYST",
    roles: [
      {
        role: "AICTE_POLICY_ANALYST",
        scopeType: "GLOBAL",
        scopeId: "NATIONAL",
        scopeName: "AICTE Policy Research Division",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      },
    ],
    description: "Macro-level intake and admission analytics with privacy small-cell suppression (< 5 hidden).",
    defaultPath: "/portal/analyst",
  },
  {
    id: "verifier",
    email: "recruiter@tcs.com",
    name: "Vikram Malhotra",
    primaryRole: "VERIFIER",
    roles: [
      {
        role: "VERIFIER",
        scopeType: "GLOBAL",
        scopeId: "TCS-CAMPUS",
        scopeName: "Tata Consultancy Services (Authorized Verifier)",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      },
    ],
    description: "Corporate recruiter verifying student academic authenticity with consent.",
    defaultPath: "/portal/verifier",
  },
  {
    id: "student",
    email: "aryan.verma@student.ac.in",
    name: "Aryan Verma",
    primaryRole: "STUDENT",
    roles: [
      {
        role: "STUDENT",
        scopeType: "GLOBAL",
        scopeId: "APAAR-9041-8821-3419",
        scopeName: "APAAR: 9041-8821-3419",
        badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
      },
    ],
    description: "Student data owner with DPDP consent toggles and digital credential wallet.",
    defaultPath: "/portal/student",
  },
  {
    id: "admin",
    email: "admin@apaar-verify.gov.in",
    name: "System Administrator",
    primaryRole: "SYSTEM_ADMIN",
    roles: [
      {
        role: "SYSTEM_ADMIN",
        scopeType: "GLOBAL",
        scopeId: "ROOT",
        scopeName: "Root Platform Authority",
        badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      },
    ],
    description: "Full platform rule administration, API key rotation, and hash-chained audit verification.",
    defaultPath: "/portal/admin",
  },
];

interface AuthContextType {
  user: UserProfile | null;
  activeRoleScope: RoleScope | null;
  availableRoleScopes: RoleScope[];
  loginAsDemo: (demoId: string) => void;
  switchRoleScope: (roleScope: RoleScope) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeRoleScope, setActiveRoleScope] = useState<RoleScope | null>(null);
  const [availableRoleScopes, setAvailableRoleScopes] = useState<RoleScope[]>([]);

  // Initialize with saved demo user or default to Institution Admin on mount
  useEffect(() => {
    const saved = localStorage.getItem("apaar_auth_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed.user);
        setActiveRoleScope(parsed.activeRoleScope);
        setAvailableRoleScopes(parsed.availableRoleScopes);
      } catch (e) {
        console.error("Failed to parse auth session", e);
      }
    } else {
      // Default to Institution Admin for immediate seamless demo
      const def = PRESET_DEMO_ACCOUNTS[0];
      setUser({
        id: def.id,
        email: def.email,
        fullName: def.name,
        mfaEnabled: false,
        mfaVerified: true,
      });
      setActiveRoleScope(def.roles[0]);
      setAvailableRoleScopes(def.roles);
    }
  }, []);

  const loginAsDemo = (demoId: string) => {
    const account = PRESET_DEMO_ACCOUNTS.find((a) => a.id === demoId) || PRESET_DEMO_ACCOUNTS[0];
    const newUser: UserProfile = {
      id: account.id,
      email: account.email,
      fullName: account.name,
      mfaEnabled: account.primaryRole.startsWith("AICTE_") || account.primaryRole === "SYSTEM_ADMIN",
      mfaVerified: true,
    };
    const primaryScope = account.roles[0];

    setUser(newUser);
    setActiveRoleScope(primaryScope);
    setAvailableRoleScopes(account.roles);

    localStorage.setItem(
      "apaar_auth_session",
      JSON.stringify({
        user: newUser,
        activeRoleScope: primaryScope,
        availableRoleScopes: account.roles,
      })
    );

    // If user has multiple roles, route to role-picker; otherwise to dashboard
    if (account.roles.length > 1) {
      router.push("/auth/role-picker");
    } else {
      router.push(account.defaultPath);
    }
  };

  const switchRoleScope = (roleScope: RoleScope) => {
    setActiveRoleScope(roleScope);
    if (user) {
      localStorage.setItem(
        "apaar_auth_session",
        JSON.stringify({
          user,
          activeRoleScope: roleScope,
          availableRoleScopes,
        })
      );
    }

    // Route based on newly selected role
    switch (roleScope.role) {
      case "INSTITUTION_ADMIN":
      case "INSTITUTION_OPERATOR":
        router.push("/portal/institution");
        break;
      case "AICTE_REGIONAL_OFFICER":
        router.push("/portal/regional-officer");
        break;
      case "AICTE_NATIONAL_OFFICER":
        router.push("/portal/national-officer");
        break;
      case "AICTE_POLICY_ANALYST":
        router.push("/portal/analyst");
        break;
      case "VERIFIER":
        router.push("/portal/verifier");
        break;
      case "STUDENT":
        router.push("/portal/student");
        break;
      case "SYSTEM_ADMIN":
        router.push("/portal/admin");
        break;
      default:
        router.push("/portal/institution");
    }
  };

  const logout = () => {
    setUser(null);
    setActiveRoleScope(null);
    setAvailableRoleScopes([]);
    localStorage.removeItem("apaar_auth_session");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRoleScope,
        availableRoleScopes,
        loginAsDemo,
        switchRoleScope,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

