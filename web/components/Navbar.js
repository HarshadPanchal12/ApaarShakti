"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Building2, GraduationCap, Users, Briefcase,
  LogOut, ArrowRight, ShieldCheck
} from "lucide-react";
import { sb, api } from "../lib/supabase";

const ROLE_INFO = {
  officer: { label: "AICTE Officer", path: "/officer", icon: Building2, color: "#003087" },
  institution: { label: "Institution", path: "/institution", icon: GraduationCap, color: "#003087" },
  student: { label: "Student", path: "/student", icon: Users, color: "#138808" },
  verifier: { label: "Verifier", path: "/verifier", icon: Briefcase, color: "#FF6B00" }
};

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check initial session
    sb.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session) {
        api("/me").then(setProfile).catch(() => {});
      } else {
        setProfile(null);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session) {
        api("/me").then(setProfile).catch(() => {});
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname]);

  async function handleLogout() {
    try {
      await sb.auth.signOut();
    } catch (e) {
      console.error("Signout error:", e);
    }
    setUser(null);
    setProfile(null);
    router.push("/login");
    router.refresh();
  }

  const roleData = profile?.role ? ROLE_INFO[profile.role] : null;
  const RoleIcon = roleData?.icon || ShieldCheck;

  return (
    <nav className="site-nav">
      <div className="site-nav-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ fontWeight: pathname === "/" ? 700 : 500, color: pathname === "/" ? "var(--gov-navy)" : undefined }}>
            Home
          </a>
          <a href="/verify" style={{ fontWeight: pathname === "/verify" ? 700 : 500, color: pathname === "/verify" ? "var(--gov-navy)" : undefined }}>
            Verify Credential
          </a>
          {roleData && (
            <a href={roleData.path} style={{ fontWeight: pathname === roleData.path ? 700 : 500, color: pathname === roleData.path ? "var(--gov-navy)" : undefined }}>
              {roleData.label} Portal
            </a>
          )}
        </div>

        <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#F0F4FF", border: "1px solid #D1D9E6",
                padding: "4px 10px", borderRadius: 20, fontSize: 12
              }}>
                <RoleIcon size={14} color={roleData?.color || "#003087"} />
                <span style={{ fontWeight: 700, color: "#003087" }}>
                  {roleData?.label || "Authenticated"}
                </span>
                <span style={{ color: "#64748B", fontSize: 11 }}>
                  ({user.email})
                </span>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "#FEF2F2", color: "#DC2626",
                  border: "1px solid #FECACA", borderRadius: 6,
                  padding: "5px 12px", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.15s ease"
                }}
                title="Sign out of current portal"
              >
                <LogOut size={13} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <a href="/login" style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontWeight: 600, color: "var(--gov-navy)"
            }}>
              <span>Login</span>
              <ArrowRight size={14} />
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

