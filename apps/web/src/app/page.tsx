import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PipelineVisualizer } from "@/components/PipelineVisualizer";
import { VerificationSandbox } from "@/components/VerificationSandbox";
import { SmartAutomationSection } from "@/components/SmartAutomationSection";
import { RoleShowcase } from "@/components/RoleShowcase";
import { SecuritySection } from "@/components/SecuritySection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <PipelineVisualizer />
        <VerificationSandbox />
        <SmartAutomationSection />
        <RoleShowcase />
        <SecuritySection />
      </main>
      <Footer />
    </div>
  );
}
