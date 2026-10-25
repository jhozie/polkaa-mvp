"use client";

import React, { useState } from "react";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Can large companies with hundreds of workers use Polkaa?",
    answer: "Yes. You can upload an Excel sheet to pay hundreds of workers at once, create separate wallets for different branches or departments, and download clean reports for your accountant or tax auditor."
  },
  {
    question: "What happens if a worker doesn't collect their cash within 48 hours?",
    answer: "The 6-digit SMS code expires after 48 hours. 100% of the money automatically returns to your company wallet with a clear record. No money is ever stuck or lost."
  },
  {
    question: "Do our drivers, casual staff, or farmers need smartphones or internet?",
    answer: "No. Workers only need a basic button phone (torchlight phone) that can receive SMS. They simply show their code to any local POS or MoMo agent to collect cash. No app, bank account, or internet connection is needed."
  },
  {
    question: "Can an unauthorized staff member send out company money?",
    answer: "No. We use Two-Person Approval. An accountant or site supervisor can upload the payment list, but money will never leave your wallet until an authorized Director approves with their secret 4-digit PIN."
  },
  {
    question: "Is Polkaa only for agriculture and rural farms?",
    answer: "No. Any business that pays people in the field uses Polkaa—including supermarket suppliers, van delivery drivers, interstate haulage trucks, building site labourers, and wholesale distributors."
  }
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Linearly Aligned Heading (Nearpays Editorial Style) */}
      <div className="mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-normal text-slate-900 tracking-tight leading-tight">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        
        {/* Support Card: Sits below FAQ on mobile (order-2), on the left on desktop (lg:order-1) */}
        <div className="order-2 lg:order-1 lg:col-span-4 flex flex-col">
          <div className="bg-[#EDF3EE] rounded-3xl p-7 sm:p-8 flex flex-col justify-between border border-slate-200/60 shadow-xs text-center h-full">
            <div className="space-y-4 flex flex-col items-center my-auto py-2">
              
              {/* Upgraded Multi-Layered Support Icon Badge (Clean, No Beaming Dot) */}
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-center">
                {/* Inner Gradient Squircle */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#004F71] via-[#003B54] to-[#002738] text-white flex items-center justify-center shadow-xs">
                  {/* Modern Dual Speech Bubble SVG */}
                  <svg 
                    className="w-5 h-5 text-white" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" fill="rgba(255,255,255,0.12)" />
                    <circle cx="8.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
                    <circle cx="12" cy="11.5" r="1" fill="currentColor" stroke="none" />
                    <circle cx="15.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-normal text-slate-900 leading-snug">
                  Have a different question?
                </h3>

                <p className="text-xs sm:text-sm font-light text-slate-600 leading-relaxed max-w-xs mx-auto">
                  Have questions about how Polkaa works for your business? Chat with our team.
                </p>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-200/80 w-full">
              <a
                href="mailto:contact@polkaa.ng"
                className="w-full py-3.5 rounded-xl bg-[#004F71] hover:bg-[#003654] text-white font-normal text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer hover:shadow-md active:scale-[0.99]"
              >
                <span>Talk to our team</span>
              </a>
            </div>
          </div>
        </div>

        {/* Accordion List: Sits above support card on mobile (order-1), on the right on desktop (lg:order-2) */}
        <div className="order-1 lg:order-2 lg:col-span-8 divide-y divide-slate-200">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-6 first:pt-0">
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-normal text-slate-900 group-hover:text-[#004F71] transition-colors pr-4">
                    {faq.question}
                  </span>
                  <div className="text-slate-400 group-hover:text-slate-700 shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3 pr-8 text-sm font-light text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
