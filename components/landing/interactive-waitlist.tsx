"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Mail, 
  Building, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  ChevronDown 
} from "lucide-react";
import { TopographicPattern, PolkaaLogo } from "./vectors";

export interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSandbox: () => void;
  initialEmail?: string;
}

export function WaitlistModal({
  isOpen,
  onClose,
  onOpenSandbox,
  initialEmail = ""
}: WaitlistModalProps) {
  const [email, setEmail] = useState(initialEmail);
  const [companyName, setCompanyName] = useState("");
  const [sector, setSector] = useState("fmcg");
  const [monthlyVolume, setMonthlyVolume] = useState("50m-250m");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [queueNumber, setQueueNumber] = useState(47);

  // Sync initialEmail if passed
  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const randomTicket = Math.floor(Math.random() * 20) + 38;
      setQueueNumber(randomTicket);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const resetAndClose = () => {
    onClose();
    // Delay state reset so exit animation finishes smoothly
    setTimeout(() => {
      setIsSubmitted(false);
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          
          {/* Frosted Backdrop Scrim (Stripe / Wise style) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-slate-950/65 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="relative w-full max-w-[520px] max-h-[92vh] overflow-y-auto bg-white rounded-3xl border border-slate-200/90 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35)] z-10 my-auto"
          >
            {/* Top Brand Hairline Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#004F71] via-[#006E9C] to-[#FFCC05]" />

            {/* Modal Body Container */}
            <div className="p-5 sm:p-8">
              
              {/* Header Navigation */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#004F71]" />
                  <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#004F71] bg-[#004F71]/8 px-2 py-0.5 rounded-md">
                    Early Business Rollout
                  </span>
                </div>

                <button
                  type="button"
                  onClick={resetAndClose}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!isSubmitted ? (
                /* INTAKE FORM VIEW */
                <div className="mt-5 space-y-5">
                  <div>
                    <h3 className="text-2xl sm:text-[26px] font-normal tracking-tight text-slate-900 leading-snug">
                      Join the waitlist for your business
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm font-light text-slate-600 leading-relaxed">
                      Move away from physical cash risks. Reserve early deployment across 774 LGAs with instant demo sandbox access.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    {/* Work Email */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-medium">
                        Work Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="operations@company.ng"
                          className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-[#004F71]/10 focus:border-[#004F71] transition-all"
                        />
                      </div>
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-medium">
                        Company Name *
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Serna Distribution Ltd"
                          className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-[#004F71]/10 focus:border-[#004F71] transition-all"
                        />
                      </div>
                    </div>

                    {/* Sector & Volume Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Sector */}
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-medium">
                          Industry Sector *
                        </label>
                        <div className="relative">
                          <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                          <select
                            value={sector}
                            onChange={(e) => setSector(e.target.value)}
                            className="w-full h-11 pl-10 pr-8 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-[#004F71]/10 focus:border-[#004F71] transition-all appearance-none cursor-pointer"
                          >
                            <option value="fmcg">FMCG &amp; Route Distribution</option>
                            <option value="logistics">Haulage &amp; Interstate Logistics</option>
                            <option value="construction">Construction &amp; Building Sites</option>
                            <option value="agribusiness">Agribusiness &amp; Farming</option>
                            <option value="ngo">Humanitarian NGOs &amp; Relief</option>
                            <option value="wholesale">Wholesale &amp; Field Trade</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                        </div>
                      </div>

                      {/* Monthly Volume */}
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-medium">
                          Monthly Cash Volume *
                        </label>
                        <div className="relative">
                          <TrendingUp className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                          <select
                            value={monthlyVolume}
                            onChange={(e) => setMonthlyVolume(e.target.value)}
                            className="w-full h-11 pl-10 pr-8 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-[#004F71]/10 focus:border-[#004F71] transition-all appearance-none cursor-pointer"
                          >
                            <option value="10m-50m">₦10M – ₦50M / mo</option>
                            <option value="50m-250m">₦50M – ₦250M / mo</option>
                            <option value="250m-plus">Over ₦250M / mo</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 rounded-xl bg-[#004F71] hover:bg-[#003654] text-white font-normal text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg active:scale-[0.99] disabled:opacity-75"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2 font-mono text-xs">
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Securing Your Priority Spot...</span>
                          </span>
                        ) : (
                          <>
                            <span>Request Early Access</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Sleek Trust Micro-copy */}
                    <div className="pt-1 text-center">
                      <span className="text-[11px] font-mono text-slate-400">
                        Zero setup fees · Instant demo sandbox · Bank-grade security
                      </span>
                    </div>
                  </form>
                </div>
              ) : (
                /* VIP PRIORITY DIGITAL PASS VIEW (Stripe / Moniepoint Style) */
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 space-y-5 text-center"
                >
                  {/* Glowing Emerald Confirmation Icon */}
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div>
                    <h4 className="text-2xl font-normal text-slate-900 tracking-tight">
                      You are #{queueNumber} on the Priority List
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">
                      Reserved for <strong className="text-slate-800 font-medium">{companyName || email}</strong>.
                    </p>
                  </div>

                  {/* Tactile Obsidian VIP Pass */}
                  <div className="rounded-2xl bg-[#0A0F1D] p-5 text-white border border-slate-800 shadow-2xl relative overflow-hidden text-left">
                    <TopographicPattern className="absolute inset-0 opacity-20 pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <PolkaaLogo variant="dark" className="h-5 w-auto" />
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFCC05]/15 border border-[#FFCC05]/40 text-[#FFCC05] text-[11px] font-mono font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFCC05] animate-pulse" />
                        <span>PASS #{queueNumber} · VIP</span>
                      </div>
                    </div>

                    <div className="relative z-10 mt-3.5 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">Target Sector</span>
                        <span className="font-normal text-slate-200 capitalize text-xs mt-0.5 block">{sector} Corridors</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">Monthly Float Tier</span>
                        <span className="font-normal font-mono text-emerald-400 text-xs mt-0.5 block">{monthlyVolume}</span>
                      </div>
                    </div>

                    <div className="relative z-10 mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>REF: PK-774-LGAS-VIP</span>
                      <span className="text-slate-300">Reconciled to the Kobo</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        resetAndClose();
                        onOpenSandbox();
                      }}
                      className="w-full h-12 rounded-xl bg-[#004F71] hover:bg-[#003654] text-white font-normal text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <span>Explore the live demo now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={resetAndClose}
                      className="text-xs text-slate-500 hover:text-slate-800 transition-colors py-1 cursor-pointer font-light"
                    >
                      Done &amp; return to page
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}

// Backward-compatible alias export
export const InteractiveWaitlist = WaitlistModal;
