"use client";

import React, { useState } from "react";
import { PolkaaLogo, MoMoLogo } from "./vectors";
import { ArrowRight, Menu, X } from "lucide-react";

interface LandingNavbarProps {
  onOpenSandbox: () => void;
  onJoinWaitlistClick: () => void;
}

export function LandingNavbar({ onOpenSandbox, onJoinWaitlistClick }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAFBF9]/95 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Official Brand Logo */}
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center group">
            <PolkaaLogo variant="light" className="h-8 sm:h-9 w-auto" />
          </a>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-medium text-slate-700">
            <MoMoLogo className="w-3.5 h-3.5 rounded-xs" />
            <span>MTN MoMo PSB Rails</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => scrollToSection("features")}
            className="hover:text-[#003654] transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("sectors")}
            className="hover:text-[#003654] transition-colors cursor-pointer"
          >
            Industry
          </button>
          <button
            onClick={() => scrollToSection("field-ops")}
            className="hover:text-[#003654] transition-colors cursor-pointer"
          >
            How it works
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="hover:text-[#003654] transition-colors cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenSandbox}
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Sign in
          </button>
          <button
            onClick={onJoinWaitlistClick}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#004F71] hover:bg-[#003654] rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenSandbox}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-xs"
          >
            Sign in
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-md border-b border-slate-200 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3 font-medium text-slate-700 text-base">
            <button
              onClick={() => scrollToSection("features")}
              className="text-left py-2 hover:text-[#004F71]"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("sectors")}
              className="text-left py-2 hover:text-[#004F71]"
            >
              Industry (FMCG, Haulage, Sites)
            </button>
            <button
              onClick={() => scrollToSection("field-ops")}
              className="text-left py-2 hover:text-[#004F71]"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-left py-2 hover:text-[#004F71]"
            >
              About &amp; FAQs
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSandbox();
              }}
              className="w-full py-3 text-center text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Launch Live Sandbox
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onJoinWaitlistClick();
              }}
              className="w-full py-3 text-center text-sm font-semibold text-white bg-[#004F71] hover:bg-[#003654] rounded-xl shadow-xs"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
