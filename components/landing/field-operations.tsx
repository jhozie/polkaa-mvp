"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GTBankLogo, CBNBadge } from "./vectors";
import { Copy, Check, ArrowRight } from "lucide-react";

interface FieldOperationsProps {
  onJoinWaitlist: () => void;
}

export function FieldOperations({ onJoinWaitlist }: FieldOperationsProps) {
  const [copied, setCopied] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(3); // Thu

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText("0148829103");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const weeklyData = [
    { day: "Mon", inAmount: 28, label: "₦28M In / ₦12M Out" },
    { day: "Tue", inAmount: 34, label: "₦34M In / ₦16M Out" },
    { day: "Wed", inAmount: 42, label: "₦42M In / ₦18M Out" },
    { day: "Thu", inAmount: 41.8, label: "₦41.8M In / ₦14.2M Out" },
    { day: "Fri", inAmount: 56, label: "₦56M In / ₦22M Out" },
    { day: "Sat", inAmount: 38, label: "₦38M In / ₦19M Out" },
    { day: "Sun", inAmount: 18, label: "₦18M In / ₦8M Out" },
  ];

  return (
    <section id="field-ops" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        
        {/* Left Column: Heading, Subhead, CTA (Nearpays Image 2 Style) */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Get a virtual account for your business in minutes
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Open a corporate company account for your business in minutes. Access multiple payment options, disburse to casual workers and drivers, and monitor operations with realtime insights.
          </p>

          <div className="pt-2">
            <button
              onClick={onJoinWaitlist}
              className="px-6 py-3.5 rounded-xl bg-[#004F71] hover:bg-[#003654] text-white font-semibold text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Join the waitlist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Photo + Floating UI Cards (Nearpays Image 2 Style) */}
        <div className="lg:col-span-7 relative flex items-center justify-center">
          
          {/* Main Visual Frame */}
          <div className="relative w-full max-w-lg lg:max-w-none rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-100">
            <div className="relative aspect-4/3 w-full">
              <Image
                src="/images/nigerian_business_lead.jpg"
                alt="Nigerian Operations Director using Polkaa in Lagos warehouse"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* FLOATING CARD 1: Virtual Account Badge (Top Left) */}
            <div className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xl flex items-center gap-3 transition-transform hover:scale-102">
              <GTBankLogo className="w-8 h-8 rounded-lg shrink-0 shadow-xs" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">
                    Serna Stores
                  </span>
                  <CBNBadge className="w-3.5 h-3.5 text-[#004F71] shrink-0" />
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <span>3242434342</span>
                  <button
                    onClick={handleCopyAccount}
                    className="p-1 rounded-sm hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* FLOATING CARD 2: Reports Card (Bottom Left/Center) */}
            <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xl max-w-[280px] sm:max-w-[320px] transition-transform hover:scale-102">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Reports</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  +₦7,341
                </span>
              </div>

              {/* Inflow vs Outflow Totals */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-left">
                <div>
                  <span className="text-[10px] text-slate-500 block">Money In</span>
                  <span className="text-xs font-bold font-mono text-slate-900">
                    ₦4,178,006.53
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Money Out</span>
                  <span className="text-xs font-bold font-mono text-slate-900">
                    ₦813,400.30
                  </span>
                </div>
              </div>

              {/* Weekly Vertical Bar Chart */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="h-14 flex items-end justify-between gap-1.5 px-1">
                  {weeklyData.map((item, idx) => {
                    const isSelected = idx === selectedDayIndex;
                    const heightPercent = (item.inAmount / 60) * 100;
                    return (
                      <div
                        key={item.day}
                        onClick={() => setSelectedDayIndex(idx)}
                        className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <div className="w-full flex items-end justify-center h-10">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full max-w-[12px] rounded-t-xs transition-all ${
                              isSelected
                                ? "bg-[#004F71]"
                                : "bg-emerald-300 hover:bg-emerald-400"
                            }`}
                          />
                        </div>
                        <span className={`text-[9px] ${
                          isSelected ? "text-[#004F71] font-bold" : "text-slate-400"
                        }`}>
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
