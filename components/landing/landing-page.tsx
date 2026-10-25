"use client";

import React, { useState } from "react";
import { GreyHero } from "./grey-hero";
import { HeroBento } from "./hero-bento";
import { SocialProof } from "./social-proof";
import { WaitlistModal } from "./interactive-waitlist";
import { FAQAccordion } from "./faq-accordion";
import { LandingFooter } from "./landing-footer";

interface LandingPageProps {
  onOpenSandbox: () => void;
}

export function LandingPage({ onOpenSandbox }: LandingPageProps) {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const openWaitlist = () => {
    setIsWaitlistOpen(true);
  };

  const closeWaitlist = () => {
    setIsWaitlistOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFBF9] text-slate-900 selection:bg-[#004F71] selection:text-white font-sans antialiased">
      {/* 1. Hero Section (Grey.co Layout + User's hero-image.jpg + Thin Geist + Polkaa Brand Colors) */}
      <GreyHero
        onJoinWaitlist={openWaitlist}
        onOpenSandbox={onOpenSandbox}
      />

      {/* 2. Bento Grid Features Section (Nearpays Image 1 Layout) */}
      <HeroBento
        onJoinWaitlist={openWaitlist}
        onOpenSandbox={onOpenSandbox}
      />

      {/* 3. Sector Details & Operations Band (Using the 2-Column Social Proof Layout) */}
      <SocialProof
        onJoinWaitlist={openWaitlist}
        onOpenSandbox={onOpenSandbox}
      />

      {/* 4. Frequently Asked Questions Accordion (Nearpays Image 4) */}
      <FAQAccordion />

      {/* 5. Black Minimalist Footer */}
      <LandingFooter onJoinWaitlist={openWaitlist} onOpenSandbox={onOpenSandbox} />

      {/* 6. World-Class Waitlist Popup Modal (Stripe / Moniepoint / Wise standard) */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={closeWaitlist}
        onOpenSandbox={onOpenSandbox}
      />
    </div>
  );
}
