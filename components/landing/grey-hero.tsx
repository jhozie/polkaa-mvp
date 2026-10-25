"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PolkaaLogo } from "./vectors";
import { ArrowRight, Menu, X, ChevronRight, ShieldCheck } from "lucide-react";

interface GreyHeroProps {
  onJoinWaitlist: () => void;
  onOpenSandbox: () => void;
}

export function GreyHero({ onJoinWaitlist, onOpenSandbox }: GreyHeroProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full min-w-full relative bg-gradient-to-br from-[#004F71] via-[#004464] to-[#003654] text-white overflow-hidden m-0 p-0">

      {/* 1. TOP NAVIGATION */}
      <header className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center">
            <PolkaaLogo variant="dark" className="h-8 sm:h-9 w-auto" />
          </a>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-normal text-white/80">
          <button onClick={() => scrollTo("features")} className="hover:text-white transition-colors cursor-pointer">
            Products
          </button>
          <button onClick={() => scrollTo("sectors")} className="hover:text-white transition-colors cursor-pointer">
            Who it&apos;s for
          </button>
          <button onClick={() => scrollTo("faq")} className="hover:text-white transition-colors cursor-pointer">
            Company &amp; FAQ
          </button>
        </nav>

        {/* Right Action (Desktop — clean secondary action) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenSandbox}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-normal transition-all border border-white/15 cursor-pointer"
          >
            Explore demo
          </button>
        </div>

        {/* Mobile Hamburger Button (Standard 44px tap target, No Waitlist button in header) */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white transition-all cursor-pointer flex items-center justify-center border border-white/10 shadow-xs"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Standard Full-Screen Mobile Drawer (Stripe / Moniepoint style) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#001D2B]/95 backdrop-blur-2xl flex flex-col justify-between p-6 overflow-y-auto"
          >
            {/* Top Bar inside Drawer */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <PolkaaLogo variant="dark" className="h-8 w-auto" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simple, Clean Nav Menu Items */}
            <div className="py-8 space-y-1 flex-1 flex flex-col justify-center">
              <button
                onClick={() => scrollTo("features")}
                className="w-full py-4 px-3 rounded-xl text-left text-2xl font-normal text-white hover:text-[#FFCC05] hover:bg-white/5 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>Products</span>
                <ChevronRight className="w-5 h-5 text-white/30" />
              </button>

              <button
                onClick={() => scrollTo("sectors")}
                className="w-full py-4 px-3 rounded-xl text-left text-2xl font-normal text-white hover:text-[#FFCC05] hover:bg-white/5 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>Who it&apos;s for</span>
                <ChevronRight className="w-5 h-5 text-white/30" />
              </button>

              <button
                onClick={() => scrollTo("faq")}
                className="w-full py-4 px-3 rounded-xl text-left text-2xl font-normal text-white hover:text-[#FFCC05] hover:bg-white/5 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>Company &amp; FAQ</span>
                <ChevronRight className="w-5 h-5 text-white/30" />
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-6 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onJoinWaitlist();
                }}
                className="w-full h-12 rounded-xl bg-[#FFCC05] hover:bg-[#E5B700] active:scale-[0.99] text-[#002738] text-sm font-medium transition-all shadow-md flex items-center justify-center cursor-pointer"
              >
                <span>Join the waitlist</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSandbox();
                }}
                className="w-full h-12 rounded-xl bg-white/10 hover:bg-white/15 active:scale-[0.99] text-white text-sm font-normal transition-all border border-white/15 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore demo</span>
                <ArrowRight className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO CONTENT */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Copy */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-normal tracking-tight text-white leading-[1.12]">
              The simple way <br />
              to pay workers <br />
              in the field.
            </h1>

            <p className="text-base sm:text-lg font-light text-white/85 max-w-lg leading-relaxed">
              Pay casual staff, drivers, and farmers directly from your dashboard. Workers cash out at any local shop with an SMS code—no bank app or smartphone needed.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onJoinWaitlist}
                className="h-12 px-7 rounded-xl bg-[#FFCC05] hover:bg-[#E5B700] text-[#002738] text-base font-normal transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Join the waitlist</span>
              </button>
              <button
                onClick={onOpenSandbox}
                className="h-12 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-normal transition-all border border-white/15 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore demo</span>
                <ArrowRight className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>

          {/* Right Column: Hero Photo + Independent Card Images */}
          <div className="lg:col-span-6 relative flex items-start justify-center lg:justify-end">

            {/* The wrapper — height comes from the photo itself */}
            <div className="relative w-full max-w-lg lg:max-w-none">

              {/* Hero Photo */}
              <div className="relative w-full aspect-[16/10] rounded-[32px] overflow-hidden border border-white/20">
                <Image
                  src="/images/hero-image.jpg"
                  alt="Nigerian business grower using Polkaa"
                  fill
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* CARD IMAGE 1: Settlement Card — Top Left */}
              <div className="absolute -top-4 -left-2 sm:-top-7 sm:-left-6 lg:-top-8 lg:-left-7 z-20 w-[165px] sm:w-[230px] lg:w-[260px]">
                <Image
                  src="/images/settlement-card.png"
                  alt="Settlement notification showing +₦145,000 paid to Amina Bello"
                  width={835}
                  height={426}
                  className="w-full h-auto drop-shadow-2xl"
                  priority
                />
              </div>

              {/* CARD IMAGE 2: Success Badge — Top Right */}
              <div className="absolute -top-3 -right-1 sm:-top-4 sm:-right-4 lg:-top-5 lg:-right-5 z-20 w-[125px] sm:w-[180px] lg:w-[205px]">
                <Image
                  src="/images/success-badge.png"
                  alt="99.8% Field Success — works offline on button phones"
                  width={652}
                  height={174}
                  className="w-full h-auto drop-shadow-xl"
                  priority
                />
              </div>

              {/* CARD IMAGE 3: Withdrawal Code — Staggered Bottom Overlap */}
              <div className="absolute -bottom-5 left-2 sm:-bottom-8 sm:left-8 lg:-bottom-10 lg:left-12 z-20 w-[170px] sm:w-[230px] lg:w-[265px]">
                <Image
                  src="/images/withdrawal-card.png"
                  alt="Withdrawal code 849 · 201 · 99 valid for 48 hours"
                  width={1018}
                  height={549}
                  className="w-full h-auto drop-shadow-2xl"
                  priority
                />
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
