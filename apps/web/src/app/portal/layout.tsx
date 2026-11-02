import { PortalHeader } from "@/components/PortalHeader";
import { PortalSidebar } from "@/components/PortalSidebar";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <PortalHeader />
      <div className="flex-1 flex overflow-hidden">
        <PortalSidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}

