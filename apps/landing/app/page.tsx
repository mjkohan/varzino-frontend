import { Contact } from "@/components/contact";
import { Faq } from "@/components/faq";
import { LandingHeader } from "@/components/header";
import { Hero } from "@/components/hero";
import { ModulesExplorer } from "@/components/modules-explorer";
import { BeforeAfter, Footer, Onboarding, Roles, ScopeStrip, Security, Showcase } from "@/components/sections";

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main>
        <Hero />
        <ScopeStrip />
        <BeforeAfter />
        <ModulesExplorer />
        <Showcase />
        <Roles />
        <Onboarding />
        <Security />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
