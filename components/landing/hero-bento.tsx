"use client";

import React, { useState, useRef } from "react";
import { 
  TopographicPattern, 
  SmartChip, 
  ContactlessWave 
} from "./vectors";
import { 
  ArrowRight,
  ArrowUpRight, 
  ArrowDownLeft 
} from "lucide-react";

interface HeroBentoProps {
  onJoinWaitlist: () => void;
  onOpenSandbox: () => void;
}

export function HeroBento({ onJoinWaitlist, onOpenSandbox }: HeroBentoProps) {
  const [flowToggle, setFlowToggle] = useState<"send" | "receive">("send");
  const [copied, setCopied] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText("84920199");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToCard = (idx: number) => {
    if (!carouselRef.current) return;
    const cards = carouselRef.current.querySelectorAll("[data-carousel-card]");
    if (cards[idx]) {
      cards[idx].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      setActiveCardIndex(idx);
    }
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const cards = carouselRef.current.querySelectorAll("[data-carousel-card]");
    const containerRect = carouselRef.current.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIdx = 0;
    let minDiff = Infinity;
    cards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const diff = Math.abs(cardCenter - containerCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    setActiveCardIndex(closestIdx);
  };

  // =========================================================================
  // CARD 1: Company Wallet & Balance
  // =========================================================================
  const renderBalanceCard = (extraClass = "") => (
    <div className={`bg-[#EDF3EE] hover:bg-[#E8F3FA] border border-slate-200/70 hover:border-transparent rounded-3xl p-4.5 sm:p-6 flex flex-col justify-between transition-colors duration-200 ease-out cursor-pointer group ${extraClass}`}>
      <div>
        <h3 className="text-lg sm:text-xl font-normal text-slate-900">
          Company Wallet &amp; Balance
        </h3>
        <p className="text-xs sm:text-sm font-light text-slate-600 mt-1 leading-relaxed">
          Fund your business wallet once. Pay thousands of workers anytime—with zero bank network issues or transfer delays.
        </p>
        
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpenSandbox(); }}
          className="mt-1.5 text-xs font-normal text-[#004F71] group-hover:text-[#002738] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <span>Explore demo</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Bottom Section: Switcher + Obsidian Card Face */}
      <div className="mt-4 flex flex-col gap-2.5">
        {/* Pill Toggle Switcher — Full Width Aligned with Card */}
        <div className="w-full p-1 rounded-xl bg-white grid grid-cols-2 gap-1 shadow-xs border border-slate-200/60">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setFlowToggle("send"); }}
            className={`w-full py-1.5 rounded-lg text-xs font-normal transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              flowToggle === "send"
                ? "bg-[#0A0F1D] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            <span>Send Payouts</span>
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setFlowToggle("receive"); }}
            className={`w-full py-1.5 rounded-lg text-xs font-normal transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              flowToggle === "receive"
                ? "bg-[#0A0F1D] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Collect Payments</span>
          </button>
        </div>

        {/* The Deep Obsidian Card Face */}
        <div className="rounded-xl bg-[#0A0F1D] p-3.5 sm:p-5 text-white border border-slate-800 shadow-xl relative overflow-hidden">
          <TopographicPattern className="absolute inset-0 opacity-25 pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-light text-slate-400">Available Wallet Balance</span>
            <div className="flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Balance</span>
            </div>
          </div>

          <div className="relative z-10 mt-2">
            <div className="text-2xl sm:text-4xl font-normal font-mono tracking-tight text-white">
              ₦142,500,000<span className="text-base sm:text-lg font-light text-slate-400">.00</span>
            </div>
          </div>

          {/* Dynamic bottom metrics */}
          <div className="relative z-10 mt-2.5 pt-2.5 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs font-light">
            {flowToggle === "send" ? (
              <>
                <div>
                  <div className="text-slate-400 text-[10px]">Paid Out Today</div>
                  <div className="font-normal font-mono text-white mt-0.5 text-xs">₦18,400,000</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Unclaimed (Refunded)</div>
                  <div className="font-normal font-mono text-amber-300 mt-0.5 text-xs">₦350,000</div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="text-slate-400 text-[10px]">Collected Today</div>
                  <div className="font-normal font-mono text-emerald-400 mt-0.5 text-xs">₦41,800,000</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Settled to Bank</div>
                  <div className="font-normal font-mono text-white mt-0.5 text-xs">₦41,450,000</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // CARD 2: SMS Cash-Out Code
  // =========================================================================
  const renderSmsCard = (extraClass = "") => (
    <div className={`bg-[#EDF3EE] hover:bg-[#FAF5E8] border border-slate-200/70 hover:border-transparent rounded-3xl p-4.5 sm:p-5.5 flex flex-col justify-between transition-colors duration-200 ease-out cursor-pointer group ${extraClass}`}>
      <div>
        <h3 className="text-lg sm:text-xl font-normal text-slate-900">
          SMS Cash-Out Code
        </h3>
        <p className="text-xs sm:text-sm font-light text-slate-600 mt-1 leading-relaxed">
          Workers receive an SMS code and collect physical cash at any local agent. No smartphone or bank account needed.
        </p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpenSandbox(); }}
          className="mt-1.5 text-xs font-normal text-[#004F71] group-hover:text-[#002738] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <span>Explore demo</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Dark Cash Voucher Graphic */}
      <div 
        onClick={(e) => { e.stopPropagation(); handleCopyCode(); }}
        title="Click to copy voucher code"
        className="mt-4 rounded-xl bg-[#0A0F1D] p-3.5 sm:p-4 text-white border border-slate-800 shadow-md relative overflow-hidden cursor-pointer"
      >
        <TopographicPattern className="absolute inset-0 opacity-20 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <SmartChip className="w-7 h-5" />
          <ContactlessWave className="w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="relative z-10 mt-2.5">
          <div className="text-[10px] uppercase font-light tracking-wider text-slate-400">
            SMS Cash-Out · 48h Auto-Return
          </div>
          <div className="mt-0.5 text-xl font-normal font-mono tracking-widest text-amber-300">
            849 • 201 • 99
          </div>
        </div>

        <div className="relative z-10 mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-light">
          <span className="text-slate-300 text-[11px]">Aliyu Garba (Driver)</span>
          <span className="font-normal font-mono text-white text-[11px]">₦45,000.00</span>
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // CARD 3: Collect via *671#
  // =========================================================================
  const renderUssdCard = (extraClass = "") => (
    <div className={`bg-[#EDF3EE] hover:bg-[#E8F6ED] border border-slate-200/70 hover:border-transparent rounded-3xl p-4.5 sm:p-5.5 flex flex-col justify-between transition-colors duration-200 ease-out cursor-pointer group ${extraClass}`}>
      <div>
        <h3 className="text-lg sm:text-xl font-normal text-slate-900">
          Collect via *671#
        </h3>
        <p className="text-xs sm:text-sm font-light text-slate-600 mt-1 leading-relaxed">
          Dealers, distributors, and buyers pay you directly from any phone using USSD. No internet or apps required.
        </p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpenSandbox(); }}
          className="mt-1.5 text-xs font-normal text-[#004F71] group-hover:text-[#002738] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <span>Explore demo</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Clean Feature Phone Alert */}
      <div className="mt-4 bg-white border border-slate-200 rounded-xl p-3 sm:p-3.5 shadow-sm">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 text-[10px] text-slate-400 font-mono">
          <span>Direct Network</span>
          <span>USSD *671#</span>
        </div>

        <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
          <div className="text-[10px] font-medium text-slate-800 uppercase tracking-wide">
            Payment Alert
          </div>
          <div className="mt-0.5 text-xs text-slate-700 leading-snug font-light">
            You received <strong className="text-slate-900 font-mono font-normal">₦85,000.00</strong> from Mama Tunde Stores.
          </div>
          <div className="mt-0.5 text-[9px] font-mono text-slate-400">
            Ref: PK-019284 · Instant Wallet Credit
          </div>
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // CARD 4: Payment Channels (Enriched with 3 Dense Channel Rows)
  // =========================================================================
  const renderChannelsCard = (extraClass = "") => (
    <div className={`bg-[#EDF3EE] hover:bg-[#F2EEFA] border border-slate-200/70 hover:border-transparent rounded-3xl p-4.5 sm:p-5.5 flex flex-col justify-between transition-colors duration-200 ease-out cursor-pointer group ${extraClass}`}>
      <div>
        <h3 className="text-lg sm:text-xl font-normal text-slate-900">
          Payment Channels
        </h3>
        <p className="text-xs sm:text-sm font-light text-slate-600 mt-1 leading-relaxed">
          Every way your business pays workers, collects money from buyers, and settles to your bank account.
        </p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpenSandbox(); }}
          className="mt-1.5 text-xs font-normal text-[#004F71] group-hover:text-[#002738] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <span>Explore demo</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Structured Channels Matrix (Zero Waste Space) */}
      <div className="mt-4 space-y-1.5">
        <div className="p-2 sm:p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-normal text-slate-800 text-[11px]">SMS Cash-Out</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">1.3M+ Local Agents</span>
        </div>
        <div className="p-2 sm:p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#004F71]" />
            <span className="font-normal text-slate-800 text-[11px]">USSD *671# Pay</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">Any Basic Phone</span>
        </div>
        <div className="p-2 sm:p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-normal text-slate-800 text-[11px]">48h Auto-Return</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">100% Refund Float</span>
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // CARD 5: Security & Team Controls
  // =========================================================================
  const renderSecurityCard = (extraClass = "") => (
    <div className={`bg-[#EDF3EE] hover:bg-[#FAF0ED] border border-slate-200/70 hover:border-transparent rounded-3xl p-4.5 sm:p-5.5 flex flex-col justify-between transition-colors duration-200 ease-out cursor-pointer group ${extraClass}`}>
      <div>
        <h3 className="text-lg sm:text-xl font-normal text-slate-900">
          Security &amp; Team Controls
        </h3>
        <p className="text-xs sm:text-sm font-light text-slate-600 mt-1 leading-relaxed">
          Require two-person approval for large payments, manage team permissions, and track every cash pickup in real time.
        </p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpenSandbox(); }}
          className="mt-1.5 text-xs font-normal text-[#004F71] group-hover:text-[#002738] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <span>Explore demo</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Business Management Status Mockup */}
      <div className="mt-4 bg-white border border-slate-200 rounded-xl p-3 sm:p-3.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-light">Cash Pickup Rate</div>
            <div className="text-base font-normal font-mono text-slate-900">99.4% Collected</div>
          </div>
          <div className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-mono text-emerald-700">
            <span>2-Signer PIN</span>
          </div>
        </div>

        {/* Ticker Feed */}
        <div className="space-y-1 pt-1.5 border-t border-slate-100 text-xs font-light">
          <div className="flex items-center justify-between py-0.5 px-2 rounded-md bg-slate-50">
            <span className="text-slate-700 truncate max-w-[130px] text-[11px]">Sani Adamu (Artisan)</span>
            <span className="font-mono text-emerald-600 text-[11px]">✓ ₦12,500 Picked</span>
          </div>
          <div className="flex items-center justify-between py-0.5 px-2 rounded-md bg-slate-50">
            <span className="text-slate-700 truncate max-w-[130px] text-[11px]">Kano Depot (Batch)</span>
            <span className="font-mono text-slate-900 text-[11px]">₦180,000 · Approved</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="features" className="pt-12 sm:pt-16 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* ========================================================================= */}
      {/* MOBILE EXPERIENCE: Headline + Snug Horizontal Carousel Loop (< lg)        */}
      {/* ========================================================================= */}
      <div className="block lg:hidden">
        {/* Mobile Headline */}
        <div className="mb-5">
          <h2 className="text-3xl font-normal tracking-tight text-slate-900 leading-tight">
            One dashboard. <br />
            Every way to pay <br />
            field workers.
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 font-light">
            Swipe sideways to explore all 5 field payment features.
          </p>
        </div>

        {/* Horizontal Snap Track (Snug, Zero Artificial Dead Space) */}
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex items-stretch gap-3.5 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div data-carousel-card className="w-[84vw] max-w-[335px] shrink-0 snap-center flex">
            {renderBalanceCard("w-full")}
          </div>
          <div data-carousel-card className="w-[84vw] max-w-[335px] shrink-0 snap-center flex">
            {renderSmsCard("w-full")}
          </div>
          <div data-carousel-card className="w-[84vw] max-w-[335px] shrink-0 snap-center flex">
            {renderUssdCard("w-full")}
          </div>
          <div data-carousel-card className="w-[84vw] max-w-[335px] shrink-0 snap-center flex">
            {renderChannelsCard("w-full")}
          </div>
          <div data-carousel-card className="w-[84vw] max-w-[335px] shrink-0 snap-center flex">
            {renderSecurityCard("w-full")}
          </div>
        </div>

        {/* Pagination Dots + Slide Counter */}
        <div className="flex items-center justify-between mt-2.5 px-1">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToCard(idx)}
                aria-label={`Go to feature ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeCardIndex === idx 
                    ? "w-7 bg-[#004F71]" 
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>0{activeCardIndex + 1} / 05</span>
            <span className="text-slate-300">·</span>
            <span className="text-[11px] font-sans text-slate-400">Swipe to view</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP EXPERIENCE: 12-Column Bento Grid (>= lg)                           */}
      {/* ========================================================================= */}
      <div className="hidden lg:grid grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: Headline + Large Featured Balance Card */}
        <div className="col-span-5 flex flex-col h-full">
          <div className="mb-5">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900 leading-tight">
              One dashboard. <br />
              Every way to pay <br />
              field workers.
            </h2>
          </div>

          {renderBalanceCard("flex-1")}
        </div>

        {/* RIGHT COLUMN: 2x2 Grid of Companion Cards */}
        <div className="col-span-7 grid grid-cols-2 gap-5">
          {renderSmsCard()}
          {renderUssdCard()}
          {renderChannelsCard()}
          {renderSecurityCard()}
        </div>

      </div>
    </section>
  );
}
