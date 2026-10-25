import React from "react";
import { PolkaaLogo } from "./vectors";

interface LandingFooterProps {
  onJoinWaitlist?: () => void;
  onOpenSandbox?: () => void;
}

export function LandingFooter({ onJoinWaitlist, onOpenSandbox }: LandingFooterProps) {
  return (
    <footer className="bg-black text-slate-400 py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 pb-12 border-b border-slate-900">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <PolkaaLogo variant="dark" className="h-8 w-auto" />

            <p className="text-xs font-light text-slate-400 leading-relaxed max-w-sm">
              The simple way to pay workers in the field. No bank apps or smartphones needed.
            </p>
          </div>

          {/* Features Column */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-normal uppercase tracking-wider text-white">
              Features
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="#features" className="hover:text-white transition-colors">SMS Cash-Out</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">USSD *671#</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Company Wallet</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">48-Hour Auto-Refund</a></li>
            </ul>
          </div>

          {/* Sectors Column */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-normal uppercase tracking-wider text-white">
              Sectors
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="#sectors" className="hover:text-white transition-colors">Retail &amp; Van Sales</a></li>
              <li><a href="#sectors" className="hover:text-white transition-colors">Haulage &amp; Fleets</a></li>
              <li><a href="#sectors" className="hover:text-white transition-colors">Construction Sites</a></li>
              <li><a href="#sectors" className="hover:text-white transition-colors">Farming &amp; Outgrowers</a></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-normal uppercase tracking-wider text-white">
              Resources
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="#faq" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-normal uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="#faq" className="hover:text-white transition-colors">About Polkaa</a></li>
              <li><a href="#sectors" className="hover:text-white transition-colors">How it works</a></li>
              {onJoinWaitlist && (
                <li>
                  <button 
                    type="button" 
                    onClick={onJoinWaitlist} 
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Join waitlist
                  </button>
                </li>
              )}
              {onOpenSandbox && (
                <li>
                  <button 
                    type="button" 
                    onClick={onOpenSandbox} 
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Explore demo
                  </button>
                </li>
              )}
              <li><a href="#faq" className="hover:text-white transition-colors">Contact support</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-light gap-4">
          <p>© {new Date().getFullYear()} Polkaa. All rights reserved.</p>
          <p>Lagos, Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
