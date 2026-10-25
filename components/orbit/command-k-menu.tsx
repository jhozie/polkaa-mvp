"use client";

import { useEffect, useState, useMemo } from "react";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  RotateCcw,
  Smartphone,
  ArrowDownLeft,
  ArrowRight,
  ShieldCheck,
  Building2
} from "lucide-react";
import { MoneyInIcon } from "./money-icons";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useOrbit } from "./orbit-provider";
import { formatCurrency, type Account } from "@/lib/mock-data";
import type { ViewType } from "./command-dock";

interface CommandKMenuProps {
  onSelectView: (view: ViewType) => void;
  onSelectAccount: (account: Account) => void;
  onCreateAccount: () => void;
}

export function CommandKMenu({
  onSelectView,
  onSelectAccount,
  onCreateAccount,
}: CommandKMenuProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { accounts, collections } = useOrbit();

  const activeAccounts = accounts.filter((acc) => acc.status !== 'archived');

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "n" && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
        e.preventDefault();
        onCreateAccount();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onCreateAccount]);

  // Filter accounts based on search
  const filteredAccounts = useMemo(() => {
    if (!search.trim()) {
      return [...activeAccounts]
        .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
        .slice(0, 6);
    }
    const query = search.toLowerCase();
    return activeAccounts.filter(
      (acc) =>
        acc.name.toLowerCase().includes(query) ||
        acc.industry.toLowerCase().includes(query) ||
        (acc.website && acc.website.toLowerCase().includes(query)) ||
        (acc.voucherToken && acc.voucherToken.toLowerCase().includes(query))
    );
  }, [search, activeAccounts]);

  // Filter collections based on search
  const filteredCollections = useMemo(() => {
    if (!search.trim()) return [];
    const query = search.toLowerCase();
    return collections
      .filter(
        (c) =>
          c.payerName.toLowerCase().includes(query) ||
          c.payerPhone.toLowerCase().includes(query) ||
          c.reference.toLowerCase().includes(query) ||
          c.channel.toLowerCase().includes(query)
      )
      .slice(0, 4);
  }, [search, collections]);

  // Pending accounts awaiting cashout
  const pendingAccounts = useMemo(() => {
    return activeAccounts
      .filter((acc) => acc.status === 'at-risk')
      .slice(0, 4);
  }, [activeAccounts]);

  const handleSelectView = (view: ViewType) => {
    onSelectView(view);
    setOpen(false);
    setSearch("");
  };

  const handleSelectAccount = (account: Account) => {
    onSelectAccount(account);
    setOpen(false);
    setSearch("");
  };

  const handleCreateAccount = () => {
    onCreateAccount();
    setOpen(false);
    setSearch("");
  };

  return (
    <>
      {/* Search trigger button (Desktop) */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-card border border-border/60 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/40 hover:border-border transition-all cursor-pointer shadow-xs"
      >
        <Search className="w-3.5 h-3.5 text-muted-foreground/60" />
        <span className="text-[12px]">Search farmers, codes, collections...</span>
        <kbd className="ml-2 px-1.5 py-0.5 bg-secondary/80 border border-border/50 rounded text-[10px] text-muted-foreground/80 font-sans tabular-nums">
          ⌘K
        </kbd>
      </button>

      {/* Search trigger button (Mobile) */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-md bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Polkaa Global Search"
        description="Search farmers, withdrawal codes, collections, or navigate Polkaa"
      >
        <CommandInput
          placeholder="Search farmer name, withdrawal code (e.g. PK-749201), collection..."
          value={search}
          onValueChange={setSearch}
        />

        <CommandList className="max-h-[420px] p-2 space-y-1">
          <CommandEmpty>
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/60 mb-2.5">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-foreground">No matches found</p>
              <p className="text-xs text-muted-foreground/70 mt-1 max-w-xs">
                {search ? `No records matching "${search}". Try searching by farmer name, withdrawal code (PK-...), or cluster.` : "Type a farmer name, code, or amount to search."}
              </p>
            </div>
          </CommandEmpty>

          {/* Quick Actions (Always accessible or top of list when query is short) */}
          {(!search || search.length <= 2) && (
            <CommandGroup heading="Quick Navigation">
              <CommandItem onSelect={handleCreateAccount} className="group">
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Plus className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-foreground">Send Money (New Payment)</span>
                  <span className="text-[11px] text-muted-foreground block">Prepare batch transfer or single withdrawal code</span>
                </div>
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>

              <CommandItem onSelect={() => handleSelectView("dashboard")}>
                <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-foreground">Overview</span>
                  <span className="text-[11px] text-muted-foreground block">Company wallet balance and live money movement</span>
                </div>
              </CommandItem>

              <CommandItem onSelect={() => handleSelectView("payouts")}>
                <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
                  <Users className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-foreground">Payouts (Money Sent)</span>
                  <span className="text-[11px] text-muted-foreground block">Direct phone transfers and 48h agent withdrawal codes</span>
                </div>
              </CommandItem>

              <CommandItem onSelect={() => handleSelectView("collections")}>
                <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
                  <Smartphone className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-foreground">Collections (Money Received)</span>
                  <span className="text-[11px] text-muted-foreground block">USSD *671# collections and Zenith Bank transfers</span>
                </div>
              </CommandItem>

              <CommandItem onSelect={() => handleSelectView("analytics")}>
                <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
                  <BarChart3 className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-foreground">Payment Summary & Audit Report</span>
                  <span className="text-[11px] text-muted-foreground block">Zero-leakage proof, pickup speeds, and cluster audit</span>
                </div>
              </CommandItem>

              <CommandItem onSelect={() => handleSelectView("settings")}>
                <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
                  <Settings className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-foreground">Security & Payment Settings</span>
                  <span className="text-[11px] text-muted-foreground block">Approval PIN (4821), low balance alerts, and code lifespan</span>
                </div>
              </CommandItem>
            </CommandGroup>
          )}

          {/* Awaiting Cashout Section (High Priority Alert) */}
          {!search && pendingAccounts.length > 0 && (
            <>
              <CommandSeparator className="my-1.5" />
              <CommandGroup heading="Awaiting Cashout (48h Safety Window)">
                {pendingAccounts.map((account) => (
                  <CommandItem
                    key={account.id}
                    value={`pending-${account.name}`}
                    onSelect={() => handleSelectAccount(account)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-warning/10 flex items-center justify-center text-warning shrink-0">
                        <Clock className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground truncate">
                            {account.name}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-warning/10 text-warning border border-warning/20 tabular-nums">
                            {account.voucherToken || `PK-${account.id.slice(-6).toUpperCase()}`}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground block truncate">
                          {account.website || "Northern Cluster"} • Uncollected
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-foreground tabular-nums text-xs ml-3 shrink-0">
                      {formatCurrency(account.arr)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {/* Collections Results (When Search Query Matches Inflows) */}
          {filteredCollections.length > 0 && (
            <>
              <CommandSeparator className="my-1.5" />
              <CommandGroup heading="Collections (Money Received)">
                {filteredCollections.map((col) => (
                  <CommandItem
                    key={col.id}
                    value={`col-${col.payerName}-${col.reference}`}
                    onSelect={() => handleSelectView("collections")}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-success/10 flex items-center justify-center text-success shrink-0">
                        <MoneyInIcon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground truncate">
                            {col.payerName}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-secondary text-foreground/80 border border-border/40 tabular-nums">
                            {col.reference}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground block truncate">
                          {col.channel} • {col.payerPhone}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-success tabular-nums text-xs ml-3 shrink-0">
                      +{formatCurrency(col.netAmount)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {/* Search results: Recipients & Farmers */}
          {filteredAccounts.length > 0 && (
            <>
              <CommandSeparator className="my-1.5" />
              <CommandGroup heading={search ? "Recipients & Payouts" : "Recent Recipients"}>
                {filteredAccounts.map((account) => {
                  const isCollected = account.status === 'active';
                  const isPending = account.status === 'at-risk';
                  const isReturned = account.status === 'churned';

                  return (
                    <CommandItem
                      key={account.id}
                      value={`account-${account.name}-${account.voucherToken || ''}`}
                      onSelect={() => handleSelectAccount(account)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "w-7 h-7 rounded-md flex items-center justify-center shrink-0",
                            isCollected && "bg-success/10 text-success",
                            isPending && "bg-warning/10 text-warning",
                            isReturned && "bg-secondary text-muted-foreground"
                          )}
                        >
                          {isCollected && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {isPending && <Clock className="w-3.5 h-3.5" />}
                          {isReturned && <RotateCcw className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground truncate">
                              {account.name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-secondary text-foreground/80 border border-border/40 tabular-nums">
                              {account.voucherToken || `PK-${account.id.slice(-6).toUpperCase()}`}
                            </span>
                          </div>
                          <span className="text-[11px] text-muted-foreground block truncate">
                            {account.website || "Kano Cluster"} • {isCollected ? "Cash Collected at Agent" : isPending ? "Awaiting Cashout (48h)" : "Returned to Balance"}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-foreground tabular-nums text-xs ml-3 shrink-0">
                        {formatCurrency(account.arr)}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          )}
        </CommandList>

        {/* Command Palette Keyboard Guide Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/40 bg-secondary/30 text-[11px] text-muted-foreground select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-card border border-border/60 rounded text-[10px] font-sans">↑↓</kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-card border border-border/60 rounded text-[10px] font-sans">↵</kbd>
              <span>select</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-card border border-border/60 rounded text-[10px] font-sans">esc</kbd>
              <span>close</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground/70">
            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
            <span>MTN MoMo Rails (*671#)</span>
          </div>
        </div>
      </CommandDialog>
    </>
  );
}

export default CommandKMenu;
