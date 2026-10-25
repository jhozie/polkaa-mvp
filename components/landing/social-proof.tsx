"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CurvedReviewArrow } from "./vectors";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface SocialProofProps {
  onJoinWaitlist: () => void;
  onOpenSandbox: () => void;
}

interface SectorDetail {
  id: string;
  number: string;
  name: string;
  shortLabel: string;
  headline: string;
  problem: string;
  solution: string;
  channel: string;
  beneficiaries: string;
  settlement: string;
  pipeline: string[];
}

const sectors: SectorDetail[] = [
  {
    id: "fmcg",
    number: "01",
    name: "FMCG & Route Distribution",
    shortLabel: "Retail & Van Sales",
    headline: "Collect delivery payments at shop doors without cash bags or POS downtime.",
    problem: "Van sales drivers visit 60–120 retail shops daily. Retailers pay in physical cash, meaning delivery trucks carry millions on dangerous roads with severe robbery risks and delayed bank alerts.",
    solution: "Retailers dial *671# at shop counters or pay through any local agent. The driver receives an instant SMS delivery confirmation before offloading goods. Zero cash on the truck.",
    channel: "USSD *671# or POS Agent",
    beneficiaries: "Retail Shops & Van Drivers",
    settlement: "Instant Wallet Credit",
    pipeline: [
      "Retail Shop",
      "Dials *671#",
      "Instant Wallet Credit",
      "Driver Confirms Alert"
    ]
  },
  {
    id: "logistics",
    number: "02",
    name: "Haulage & Interstate Logistics",
    shortLabel: "Interstate Fleets",
    headline: "Fund interstate drivers on the highway at roadside cash points.",
    problem: "Interstate drivers carrying cash for diesel, road tolls, and offloading face armed robbery along transit routes. Normal bank transfers frequently fail due to poor highway network.",
    solution: "Fleet managers send an SMS cash code directly from the dashboard. Drivers pull over at any roadside MoMo or POS agent across Nigeria to collect cash in minutes.",
    channel: "SMS Cash Code",
    beneficiaries: "Truck Drivers & Motor Boys",
    settlement: "Unused cash returned in 48h",
    pipeline: [
      "Head Office Wallet",
      "Sends SMS Code",
      "Roadside POS / MoMo",
      "Driver Collects Cash"
    ]
  },
  {
    id: "construction",
    number: "03",
    name: "Construction & Building Sites",
    shortLabel: "Construction Sites",
    headline: "Pay hundreds of casual artisans and site labourers without cash bags.",
    problem: "Friday cash paydays halt construction work for hours, carry severe robbery risks, and leak money to ghost workers through manual paper rosters.",
    solution: "Site supervisors upload the weekly Excel payment sheet. Workers receive an SMS cash code as they clock out and collect their money at any agent on their commute home.",
    channel: "Bulk Excel Upload",
    beneficiaries: "Artisans & Site Labourers",
    settlement: "Requires 2-Person Approval",
    pipeline: [
      "Upload Excel Sheet",
      "Two Admins Approve",
      "Workers Receive SMS",
      "Cash Out at Kiosk"
    ]
  },
  {
    id: "agribusiness",
    number: "04",
    name: "Agribusiness & Outgrowers",
    shortLabel: "Agric Outgrowers",
    headline: "Pay smallholder farmers on harvest day directly to basic phones.",
    problem: "Smallholder farmers deliver harvest at rural collection centres. Most do not have smartphones, BVN, or bank accounts. Carrying sacks of cash to villages is risky and hard to track.",
    solution: "Farmers receive an SMS cash code on their basic button phones. They collect physical cash at the nearest village kiosk while every kilogram and payment is recorded on your dashboard.",
    channel: "Basic Phone SMS Code",
    beneficiaries: "Smallholders & Harvesters",
    settlement: "No bank account needed",
    pipeline: [
      "Harvest Scale Point",
      "Basic Button Phone",
      "Village Agent Kiosk",
      "Cash Paid Instantly"
    ]
  },
  {
    id: "ngo",
    number: "05",
    name: "Humanitarian Aid & Cash Grants",
    shortLabel: "NGO Aid Grants",
    headline: "Distribute emergency aid cash with full donor accountability.",
    problem: "Moving physical cash into remote or insecure communities is dangerous. Paper vouchers often lead to fraud or force families to buy from overpriced local cartels.",
    solution: "Send cash support codes directly by SMS or USSD. Beneficiaries collect 100% of their cash at approved local agents, with every kobo accounted for in your donor reports.",
    channel: "SMS or USSD Code",
    beneficiaries: "Rural Families & Households",
    settlement: "Every kobo tracked for donors",
    pipeline: [
      "Donor Wallet",
      "SMS Cash Code",
      "Verified Local Agent",
      "100% Cash in Hand"
    ]
  }
];

export function SocialProof({ onJoinWaitlist, onOpenSandbox }: SocialProofProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Strictly sequential auto-advance: 0 -> 1 -> 2 -> 3 -> 4 -> 0
  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % sectors.length);
    }, 6000);

    return () => clearTimeout(timer);
  }, [currentIdx, isPaused]);

  const selectSector = (idx: number) => {
    setCurrentIdx(idx);
  };

  const prev = () => {
    setCurrentIdx((i) => (i === 0 ? sectors.length - 1 : i - 1));
  };

  const next = () => {
    setCurrentIdx((i) => (i === sectors.length - 1 ? 0 : i + 1));
  };

  const s = sectors[currentIdx];

  return (
    <section 
      id="sectors" 
      className="py-24 bg-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* 1. SECTOR OPERATIONS DOSSIER (Clean 2-Column Editorial Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Institutional Header, Vertical Selector, Nav Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Institutional Infrastructure Pill Tag (No Sparkles) */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#004F71]/10 text-[#004F71] text-xs font-mono tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#004F71]" />
                <span>WHO IT&apos;S FOR · 5 HIGH-CASH SECTORS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight leading-tight mt-3">
                Built for the real corridors <br />
                of Nigerian trade.
              </h2>
              <p className="mt-3 text-sm font-light text-slate-600 leading-relaxed">
                From factory gates to rural farm collection points, Polkaa helps Nigerian businesses pay workers and collect money without handling bags of cash.
              </p>
            </div>

            {/* MOBILE ONLY: Horizontal Sector Pill Bar */}
            <div className="block lg:hidden pt-2">
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {sectors.map((sec, idx) => {
                  const isActive = idx === currentIdx;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => selectSector(idx)}
                      className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-normal transition-all cursor-pointer flex items-center gap-2 ${
                        isActive
                          ? "bg-[#004F71] text-white shadow-xs font-medium"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <span className={`font-mono text-[11px] ${isActive ? "text-[#FFCC05]" : "text-slate-400"}`}>
                        {sec.number}
                      </span>
                      <span>{sec.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DESKTOP ONLY: Vertical Sector List Selector with Spring Pill & GPU Progress Line */}
            <div className="hidden lg:block space-y-2 pt-1">
              {sectors.map((sec, idx) => {
                const isActive = idx === currentIdx;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => selectSector(idx)}
                    className="relative w-full text-left rounded-xl transition-all cursor-pointer overflow-hidden group"
                  >
                    {/* Active Background Pill with Spring Motion */}
                    {isActive ? (
                      <motion.div
                        layoutId="activeSectorPill"
                        className="absolute inset-0 bg-[#004F71] rounded-xl shadow-xs"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors" />
                    )}

                    {/* Progress Bar on Active Tab */}
                    {isActive && !isPaused && (
                      <motion.div 
                        key={sec.id}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 6, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-[2px] bg-[#FFCC05] z-20 pointer-events-none"
                      />
                    )}

                    {/* Button Content */}
                    <div className="relative z-10 px-4 py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-[11px] font-medium transition-colors ${
                          isActive ? "text-[#FFCC05]" : "text-slate-400 group-hover:text-slate-600"
                        }`}>
                          {sec.number}
                        </span>
                        <span className={`font-normal transition-colors ${
                          isActive ? "text-white font-medium" : "text-slate-700"
                        }`}>
                          {sec.name}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono transition-colors ${
                        isActive ? "text-white/80" : "text-slate-400"
                      }`}>
                        {sec.shortLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* DESKTOP ONLY: Slider Navigation Controls + Index Counter */}
            <div className="hidden lg:flex items-center justify-between pt-1 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={prev}
                  className="w-10 h-10 rounded-full border border-slate-300 hover:border-slate-900 flex items-center justify-center text-slate-700 transition-colors cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Previous sector"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="w-10 h-10 rounded-full bg-[#004F71] hover:bg-[#003654] flex items-center justify-center text-white transition-colors cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Next sector"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-slate-400 ml-1">
                  {s.number} / 0{sectors.length}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Sector Operations Dossier Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs overflow-hidden">
              
              {/* Card Header */}
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Operational Dossier · {s.number}
                  </span>
                  <h3 className="text-lg sm:text-xl font-normal text-slate-900 mt-0.5">
                    {s.name}
                  </h3>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-slate-100 text-[11px] font-mono text-slate-600">
                  {s.shortLabel}
                </div>
              </div>

              {/* Animated Content Transition using AnimatePresence */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="mt-5 space-y-5"
                >
                  <p className="text-base sm:text-lg font-normal text-slate-900 leading-snug">
                    {s.headline}
                  </p>

                  {/* Problem vs Solution Split */}
                  <div className="space-y-3.5 text-xs sm:text-sm font-light leading-relaxed">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                        The Daily Challenge
                      </div>
                      <p className="text-slate-700 leading-relaxed font-light">
                        {s.problem}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#EDF3EE]/70 border border-[#EDF3EE]">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#004F71] mb-1">
                        How Polkaa Solves It
                      </div>
                      <p className="text-slate-800 leading-relaxed font-light">
                        {s.solution}
                      </p>
                    </div>
                  </div>

                  {/* Operational Money Trail Pipeline */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 overflow-hidden">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
                      <span>How Money Moves</span>
                      <span className="text-[9px] text-[#004F71] font-mono">Step-by-Step Flow</span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                      {s.pipeline.map((step, stepIdx) => (
                        <div
                          key={stepIdx}
                          className="min-w-0 p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono text-[#004F71] font-medium">
                              0{stepIdx + 1}
                            </span>
                            {stepIdx < s.pipeline.length - 1 && (
                              <span className="text-slate-300 font-mono text-xs hidden lg:inline select-none">→</span>
                            )}
                          </div>
                          <div className="text-xs font-normal text-slate-800 leading-snug break-words">
                            {step}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Specifications Grid */}
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        Payout Channel
                      </div>
                      <div className="text-xs font-normal text-slate-900 mt-1 font-mono">
                        {s.channel}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        Who Receives It
                      </div>
                      <div className="text-xs font-normal text-slate-900 mt-1">
                        {s.beneficiaries}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        Settlement
                      </div>
                      <div className="text-xs font-normal text-[#004F71] mt-1 font-mono">
                        {s.settlement}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              {/* MOBILE ONLY: Slider Navigation Controls + Index Counter */}
              <div className="flex lg:hidden items-center justify-between mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={prev}
                    className="w-9 h-9 rounded-full border border-slate-300 hover:border-slate-900 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                    aria-label="Previous sector"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="w-9 h-9 rounded-full bg-[#004F71] hover:bg-[#003654] flex items-center justify-center text-white transition-colors cursor-pointer"
                    aria-label="Next sector"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {s.number} / 0{sectors.length} · Tap to browse
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* 2. Soft Green Banner with Floating Arrow & Architecture Cards */}
        <div className="bg-[#EDF3EE] rounded-3xl p-6 sm:p-12 border border-slate-200/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-2xl sm:text-4xl font-normal text-slate-900 tracking-tight leading-tight">
                Start moving field payments today with Polkaa.
              </h3>
              <p className="text-sm font-light text-slate-600">
                Join Nigerian businesses moving away from cash headaches.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onJoinWaitlist}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#004F71] hover:bg-[#003654] text-white font-normal text-sm transition-all shadow-xs cursor-pointer text-center hover:scale-[1.02] active:scale-[0.98]"
                >
                  Join Waitlist
                </button>
                <button
                  type="button"
                  onClick={onOpenSandbox}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-normal text-sm transition-all shadow-xs cursor-pointer text-center hover:scale-[1.02] active:scale-[0.98]"
                >
                  Explore Demo
                </button>
              </div>
            </div>

            {/* Hand-Drawn Directional Arrow with Gentle Floating Motion */}
            <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
              <motion.div
                animate={{ y: [0, -4, 0], rotate: [6, 9, 6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <CurvedReviewArrow className="w-24 h-16 text-slate-800" />
              </motion.div>
            </div>

            {/* Stacked Architecture Cards (High-Resolution Stripe-Style Textured Images) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Card 1: 48-Hour Cash Protection */}
              <motion.div 
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="w-full cursor-default"
              >
                <Image
                  src="/images/cash-protection-card.png"
                  alt="48-Hour Cash Protection with 48h Auto-Refund Guarantee"
                  width={1120}
                  height={390}
                  className="w-full h-auto drop-shadow-sm select-none"
                  priority
                />
              </motion.div>

              {/* Card 2: Nationwide MoMo PSB Infrastructure */}
              <motion.div 
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="w-full cursor-default"
              >
                <Image
                  src="/images/momo-infrastructure-card.png"
                  alt="MTN MoMo PSB Infrastructure — 1.3M+ Nationwide Cash Points"
                  width={1120}
                  height={212}
                  className="w-full h-auto drop-shadow-sm select-none"
                  priority
                />
              </motion.div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
