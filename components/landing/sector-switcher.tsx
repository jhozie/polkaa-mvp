"use client";

import React, { useState } from "react";
import { 
  Truck, 
  Navigation, 
  Building2, 
  Wheat, 
  HeartHandshake, 
  CheckCircle2, 
  ArrowRight
} from "lucide-react";

interface SectorDetail {
  id: string;
  name: string;
  shortLabel: string;
  tagline: string;
  solution: string;
  keyMetric: string;
}

const sectors: SectorDetail[] = [
  {
    id: "fmcg",
    name: "FMCG & Route Distribution",
    shortLabel: "Retail & Van Sales",
    tagline: "Collect delivery payments directly at shop doors without cash or POS drama.",
    solution: "Retailers dial *671# to pay into your company wallet. The driver gets an instant delivery receipt on the spot.",
    keyMetric: "45 mins saved per drop • Zero cash theft risk"
  },
  {
    id: "logistics",
    name: "Haulage & Long-Haul Fleet",
    shortLabel: "Logistics & Fleet",
    tagline: "Fund interstate drivers on the highway at roadside cash points.",
    solution: "Disburse an SMS withdrawal code from Lagos. The driver walks 50 metres to any roadside MoMo agent across 774 LGAs.",
    keyMetric: "1.3M+ cash-out points • 48h auto-return"
  },
  {
    id: "construction",
    name: "Construction & Civil Sites",
    shortLabel: "Construction Sites",
    tagline: "Pay 300+ artisans and daily site workers without carrying cash bags.",
    solution: "Upload a simple Excel sheet with phone numbers and day-rates. Artisans collect cash at the neighbourhood kiosk.",
    keyMetric: "100% digital audit trail • Zero cash luggage"
  },
  {
    id: "agribusiness",
    name: "Agribusiness & Outgrowers",
    shortLabel: "Agric Outgrowers",
    tagline: "Pay smallholder farmers on harvest day directly to their basic phones.",
    solution: "Farmers receive instant cash payouts at their village MoMo kiosk with zero bank app or internet requirement.",
    keyMetric: "10,000+ rural farmers paid simultaneously"
  },
  {
    id: "ngo",
    name: "Humanitarian & Cash Grants",
    shortLabel: "NGOs & Aid Grants",
    tagline: "Distribute emergency aid subsidies with strict donor audit compliance.",
    solution: "Two-Person PIN Maker-Checker ensures zero leakage. Donor audit reports export directly to Excel and PDF.",
    keyMetric: "Zero fund leakage • Strict Maker-Checker PIN"
  }
];

export function SectorSwitcher({ onOpenSandbox }: { onOpenSandbox: () => void }) {
  const [activeSectorId, setActiveSectorId] = useState<string>("fmcg");

  const currentSector = sectors.find((s) => s.id === activeSectorId) || sectors[0];

  return (
    <section id="sectors" className="py-24 bg-[#002738] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Matching Nearpays Dark Section) */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Crafted for field operations <br />
            of all shapes and sizes
          </h2>
          <p className="mt-4 text-base text-slate-300 max-w-xl mx-auto font-normal">
            Whether your operations are van sales, interstate haulage, construction sites, or rural outgrowers.
          </p>
        </div>

        {/* Sector Pills */}
        <div className="mt-10 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {sectors.map((sector) => {
            const isActive = sector.id === activeSectorId;
            return (
              <button
                key={sector.id}
                onClick={() => setActiveSectorId(sector.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-white text-slate-900 shadow-md font-semibold"
                    : "bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10"
                }`}
              >
                {sector.shortLabel}
              </button>
            );
          })}
        </div>

        {/* Highlight Card */}
        <div className="mt-10 max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 text-center backdrop-blur-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
            {currentSector.name}
          </span>
          <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
            &ldquo;{currentSector.tagline}&rdquo;
          </h3>
          <p className="mt-4 text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {currentSector.solution}
          </p>

          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm font-mono text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{currentSector.keyMetric}</span>
          </div>

          <div className="mt-8">
            <button
              onClick={onOpenSandbox}
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#002738] font-bold text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore {currentSector.shortLabel} in Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
