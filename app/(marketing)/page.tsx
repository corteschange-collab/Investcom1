"use client";

import { useState } from "react";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { TrustBar } from "@/components/landing/trust-bar";
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

        {/* 4. Features com tabs — mostra o produto de forma interativa */}
        <FeaturesTabs />

        {/* 5. Simulador — killer feature de conversão, mostra valor concreto */}
        <Simulator />

        {/* 6. Como funciona — remove objeção de complexidade */}
        <LandingHowItWorks />

        {/* 7. Depoimentos — prova social qualitativa */}
        <Testimonials />

        {/* 8. Preços — depois de mostrar valor, apresentar custo */}
        <LandingPricing />

        {/* 9. FAQ — remove objeções finais antes da decisão */}
        <FAQ />

        {/* 10. CTA final — reforço e conversão */}
        <FinalCTA onLoginOpen={() => setLoginOpen(true)} />

        {/* 11. Footer */}
        <LandingFooter />
      </main>

      {/* Login Modal — sem fricção */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
