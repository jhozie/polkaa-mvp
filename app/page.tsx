"use client";
// Polkaa Enterprise Corporate Suite & Interactive Landing Page

import { useState, useEffect } from "react";
import { OrbitProvider, useOrbit } from "@/components/orbit/orbit-provider";
import { ToastProvider } from "@/components/orbit/toast-provider";
import { CommandDock, type ViewType } from "@/components/orbit/command-dock";
import { MobileBottomNav } from "@/components/orbit/mobile-bottom-nav";
import { CommandStage } from "@/components/orbit/command-stage";
import { PortfolioPulse } from "@/components/orbit/portfolio-pulse";
import { PayoutsView } from "@/components/orbit/payouts-view";
import { CollectionsView } from "@/components/orbit/collections-view";
import { AnalyticsView } from "@/components/orbit/analytics-view";
import { SettingsView } from "@/components/orbit/settings-view";
import { CommandKMenu } from "@/components/orbit/command-k-menu";
import { AccountModal } from "@/components/orbit/modals/account-modal";
import { BulkImportModal } from "@/components/orbit/modals/bulk-import-modal";
import { PolkaaViewPreloader } from "@/components/orbit/skeletons";
import { LandingPage } from "@/components/landing/landing-page";
import { ArrowLeft, Globe } from "lucide-react";
import type { Account } from "@/lib/mock-data";

interface OrbitAppContentProps {
  onBackToLanding: () => void;
}

function OrbitAppContent({ onBackToLanding }: OrbitAppContentProps) {
  const {
    selectedAccountId,
    selectAccount,
    activeView,
    setActiveView,
  } = useOrbit();

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>(undefined);
  const [isPreloading, setIsPreloading] = useState(true);

  // Initial load shimmer preload & guarantee direct landing on Overview
  useEffect(() => {
    selectAccount(null);
    setActiveView("dashboard");
    const timer = setTimeout(() => {
      setIsPreloading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [selectAccount, setActiveView]);

  const handleSelectAccount = (account: Account) => {
    setIsPreloading(true);
    selectAccount(account.id);
    setActiveView("payouts");
    setTimeout(() => {
      setIsPreloading(false);
    }, 380);
  };

  const handleViewChange = (view: ViewType) => {
    if (view === activeView) return;
    setIsPreloading(true);
    setActiveView(view);
    selectAccount(null);
    setTimeout(() => {
      setIsPreloading(false);
    }, 380);
  };

  const handleNewAccount = () => {
    setEditingAccount(undefined);
    setShowAccountModal(true);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedAccountId) {
        selectAccount(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedAccountId, selectAccount]);

  // Determine stage content based on clean active view
  const renderStageContent = () => {
    if (isPreloading) {
      return <PolkaaViewPreloader view={activeView} />;
    }

    switch (activeView) {
      case "dashboard":
        return (
          <PortfolioPulse
            onNewPayout={handleNewAccount}
            onBulkImport={() => setShowBulkModal(true)}
          />
        );
      case "payouts":
      case "accounts":
        return (
          <PayoutsView
            onNewPayout={handleNewAccount}
            onBulkImport={() => setShowBulkModal(true)}
          />
        );
      case "collections":
        return <CollectionsView />;
      case "analytics":
        return <AnalyticsView />;
      case "settings":
        return <SettingsView />;
      default:
        return (
          <PortfolioPulse
            onNewPayout={handleNewAccount}
            onBulkImport={() => setShowBulkModal(true)}
          />
        );
    }
  };

  const getTitle = () => {
    switch (activeView) {
      case "dashboard":
        return "Overview";
      case "payouts":
      case "accounts":
        return "Payouts (Send Money)";
      case "collections":
        return "Collections (Money Received)";
      case "analytics":
        return "Payment Summary & Audit Report";
      case "settings":
        return "Security & Payment Settings";
      default:
        return "Overview";
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      {/* Command Dock (Left Navigation) */}
      <CommandDock activeView={activeView} onViewChange={handleViewChange} />

      {/* Main Content Area (100% Full-Width) */}
      <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative">
        {/* Top bar - responsive corporate fintech header */}
        <div className="h-14 md:h-16 flex items-center justify-between px-4 md:px-6 border-b border-border/40 bg-card/60 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Mobile Brand Mark */}
            <div 
              onClick={() => handleViewChange('dashboard')}
              className="md:hidden flex items-center gap-2 cursor-pointer"
            >
              <img
                src="/icon-512x512.png"
                alt="Polkaa"
                className="w-7 h-7 rounded-full shadow-xs"
              />
            </div>
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              {getTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Back to Landing Page Switcher */}
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
              title="Return to the Polkaa landing page"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Website</span>
              <span className="sm:hidden">Website</span>
            </button>

            {/* Command-K Search */}
            <CommandKMenu
              onSelectView={handleViewChange}
              onSelectAccount={handleSelectAccount}
              onCreateAccount={handleNewAccount}
            />
          </div>
        </div>

        {/* Stage Content */}
        <div className="flex-1 overflow-hidden pb-16 md:pb-0">
          <CommandStage viewKey={`view-${activeView}`}>
            {renderStageContent()}
          </CommandStage>
        </div>

        {/* Mobile Fixed Bottom Navigation Bar */}
        <MobileBottomNav
          activeView={activeView}
          onViewChange={handleViewChange}
        />
      </div>

      {/* Single Payout Modal */}
      <AccountModal
        isOpen={showAccountModal}
        onClose={() => {
          setShowAccountModal(false);
          setEditingAccount(undefined);
        }}
        account={editingAccount}
      />

      {/* Bulk CSV Import Modal */}
      <BulkImportModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
      />
    </div>
  );
}

export default function AppEntry() {
  const [appMode, setAppMode] = useState<"landing" | "sandbox">("landing");

  // Check URL query parameters for direct deep-linking
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("view") === "sandbox" || params.get("mode") === "app") {
        setAppMode("sandbox");
      }
    }
  }, []);

  const handleOpenSandbox = () => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("orbit_active_view", JSON.stringify("dashboard"));
        sessionStorage.removeItem("orbit_selected_account");
      } catch (e) {
        // ignore
      }
    }
    setAppMode("sandbox");
  };

  if (appMode === "landing") {
    return <LandingPage onOpenSandbox={handleOpenSandbox} />;
  }

  return (
    <OrbitProvider>
      <ToastProvider>
        <OrbitAppContent onBackToLanding={() => setAppMode("landing")} />
      </ToastProvider>
    </OrbitProvider>
  );
}
