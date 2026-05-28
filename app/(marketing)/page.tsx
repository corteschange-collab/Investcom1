"use client";

import { useState } from "react";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { TrustBar } from "@/components/landing/trust-bar";
import { ScoreEngine } from "@/components/landing/score-engine";
import { TechnicalIndicators } from "@/components/landing/technical-indicators";
import { AssetClasses } from "@/components/landing/asset-classes";
import { DataSources } from "@/components/landing/data-sources";
import { ProbabilisticAnalysis } from "@/components/landing/probabilistic-analysis";
import { InvestorProfiles } from "@/components/landing/investor-profiles";
import { Transparency } from "@/components/landing/transparency";
import { FeaturesTabs } from "@/components/landing/features-tabs";
import { Simulator } from "@/components/landing/simulator";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import { LandingPricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/footer";
import { LoginModal } from "@/components/landing/login-modal";

export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <main className="min-h-screen">
        {/* 1. Navbar — sticky, com login */}
        <LandingNavbar onLoginOpen={() => setLoginOpen(true)} />

        {/* 2. Hero — primeira dobra, chart ao vivo, CTA forte */}
        <LandingHero onLoginOpen={() => setLoginOpen(true)} />

        {/* 3. Trust bar — prova social imediata, contadores animados */}
        <TrustBar />

        {/* 4. Score engine — motor proprietário, donut animado */}
        <ScoreEngine />

        {/* 5. 10 indicadores técnicos — grid com tags e "0ms latência" */}
        <TechnicalIndicators />

        {/* 6. 9 classes de ativos — accordion expandível com risk dots */}
        <AssetClasses />

        {/* 7. Análise probabilística — 3 cenários com barras animadas */}
        <ProbabilisticAnalysis />

        {/* 8. Fontes de dados — Brapi, Yahoo, BCB com frequências */}
        <DataSources />

        {/* 9. 10 perfis de investidor — grid interativo */}
        <InvestorProfiles />

        {/* 10. Features com tabs — mostra o produto de forma interativa */}
        <FeaturesTabs />

        {/* 11. Simulador — killer feature de conversão */}
        <Simulator />

        {/* 12. Como funciona — remove objeção de complexidade */}
        <LandingHowItWorks />

        {/* 13. Depoimentos — prova social qualitativa */}
        <Testimonials />

        {/* 14. Capacidades e limitações — honestidade radical */}
        <Transparency />

        {/* 15. Preços — depois de mostrar valor, apresentar custo */}
        <LandingPricing />

        {/* 16. FAQ — remove objeções finais antes da decisão */}
        <FAQ />

        {/* 17. CTA final — reforço e conversão */}
        <FinalCTA onLoginOpen={() => setLoginOpen(true)} />

        {/* 18. Footer */}
        <LandingFooter />
      </main>

      {/* Login Modal — sem fricção */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
