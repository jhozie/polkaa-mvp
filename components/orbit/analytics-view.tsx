"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Wallet,
  Download,
  Calendar,
  Zap,
  Radio,
  Building2,
  Users,
  Check,
} from "lucide-react";
import { useOrbit } from "./orbit-provider";
import { formatCurrency } from "@/lib/mock-data";
import { useToastActions } from "./toast-provider";
import { Button } from "@/components/ui/button";
import { MoneyOutIcon, MoneyInIcon } from "./money-icons";

const PIE_COLORS = ["#004F71", "#FFCC05", "#4D849C", "#003654"];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="p-3 bg-card border border-border/60 rounded-md shadow-lg text-[12px]">
      {label && <p className="font-semibold text-foreground mb-1">{label}</p>}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color || PIE_COLORS[index % PIE_COLORS.length] }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold text-foreground tabular-nums">
            {typeof entry.value === "number" && entry.value >= 1000
              ? formatCurrency(entry.value)
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsView() {
  const { accounts, collections } = useOrbit();
  const toast = useToastActions();
  const [timeRange, setTimeRange] = useState<"30d" | "quarter" | "all">("quarter");

  // Invariant Treasury Calculations
  const stats = useMemo(() => {
    const totalDisbursed = 42675000; // ₦42,675,000.00
    const totalCollectedInflows = collections.reduce((acc, c) => acc + c.amount, 0); // ~₦38.45M
    const activeFloat = 107325000; // ₦107,325,000.00
    const committedBudget = 150000000; // ₦150,000,000.00

    // Status breakdown of disbursed vouchers
    const cashCollected = 35420000; // 83% collected
    const pendingPickup = 6255000;  // 14.7% pending
    const autoRefunded = 1000000;   // 2.3% refunded to float

    return {
      committedBudget,
      activeFloat,
      totalDisbursed,
      totalCollectedInflows,
      cashCollected,
      pendingPickup,
      autoRefunded,
    };
  }, [collections]);

  // Monthly Cash Flow: Collections (Inflows) vs Disbursements (Outflows)
  const cashFlowHistory = useMemo(() => [
    { month: "May 2026", disbursements: 12000000, collections: 6500000, net: -5500000 },
    { month: "Jun 2026", disbursements: 18500000, collections: 11200000, net: -7300000 },
    { month: "Jul 2026", disbursements: 24000000, collections: 16800000, net: -7200000 },
    { month: "Aug 2026", disbursements: 31500000, collections: 22400000, net: -9100000 },
    { month: "Sep 2026", disbursements: 38000000, collections: 31000000, net: -7000000 },
    { month: "Oct 2026", disbursements: 42675000, collections: 38450000, net: -4225000 },
  ], []);

  // How recipients received money
  const methodBreakdown = useMemo(() => [
    { name: "Direct to Phone (Instant Deposit)", value: 18975000, color: "#004f71", count: 760 },
    { name: "Cash at Agent (Withdrawal Code)", value: 23700000, color: "#10B981", count: 948 },
  ], []);

  // Collection speed at agent points
  const fulfillmentVelocity = useMemo(() => [
    { label: "< 6 Hours (Morning Market Pickup)", percentage: 58, amount: 13746000, color: "#10B981" },
    { label: "6 – 24 Hours (Same-Day Evening)", percentage: 28, amount: 6636000, color: "#004f71" },
    { label: "24 – 48 Hours (After SMS Reminder)", percentage: 10, amount: 2370000, color: "#F59E0B" },
    { label: "Returned to Balance (Unclaimed 48h)", percentage: 4, amount: 948000, color: "#64748B" },
  ], []);

  // Regional Agricultural Clusters
  const regionalClusters = useMemo(() => [
    { zone: "Kano Granary Cluster", lga: "Dambatta & Kura", farmers: 3420, capital: 62000000, delivery: "88%", method: "Cash at Agent", status: "Reconciled" },
    { zone: "Kaduna Cotton Belt", lga: "Giwa & Zaria", farmers: 2150, capital: 38000000, delivery: "85%", method: "Direct to Phone", status: "Reconciled" },
    { zone: "Plateau Maize & Potato", lga: "Mangu & Bokkos", farmers: 1480, capital: 25000000, delivery: "82%", method: "Cash at Agent", status: "Reconciled" },
    { zone: "Jigawa Sesame Basin", lga: "Hadejia & Ringim", farmers: 890, capital: 15000000, delivery: "80%", method: "Cash at Agent", status: "Reconciled" },
    { zone: "Bauchi Sorghum Corridor", lga: "Toro & Alkaleri", farmers: 620, capital: 10000000, delivery: "86%", method: "Direct to Phone", status: "Reconciled" },
  ], []);

  const handleExport = () => {
    toast.success("Payment and audit report exported (CSV format)");
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
              Payment Summary & Audit Report
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 shrink-0">
              Verified
            </span>
          </div>
          <p className="text-xs sm:text-[13px] text-muted-foreground mt-0.5">
            AgriCorp Nigeria Ltd • Complete Money Movement & Audit History
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Time Filter */}
          <div className="flex items-center bg-card border border-border/60 rounded-md p-0.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setTimeRange("30d")}
              className={`flex-1 sm:flex-none px-3 py-1.5 sm:py-1 text-xs font-medium rounded transition-colors whitespace-nowrap min-h-[36px] sm:min-h-0 ${timeRange === "30d"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange("quarter")}
              className={`flex-1 sm:flex-none px-3 py-1.5 sm:py-1 text-xs font-medium rounded transition-colors whitespace-nowrap min-h-[36px] sm:min-h-0 ${timeRange === "quarter"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              2026 Wet Season
            </button>
            <button
              onClick={() => setTimeRange("all")}
              className={`flex-1 sm:flex-none px-3 py-1.5 sm:py-1 text-xs font-medium rounded transition-colors whitespace-nowrap min-h-[36px] sm:min-h-0 ${timeRange === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              All Time
            </button>
          </div>

          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs border-border/60 cursor-pointer min-h-[36px] sm:min-h-0 w-full sm:w-auto justify-center"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit CSV</span>
          </Button>
        </div>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3.5 sm:p-4 bg-card rounded-md border border-border/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Total Program Budget
            </span>
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-semibold text-foreground block tabular-nums">
            {formatCurrency(stats.committedBudget)}
          </span>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 block">
            Wallet balance: <strong className="text-primary tabular-nums">{formatCurrency(stats.activeFloat)}</strong> available
          </span>
        </div>

        <div className="p-3.5 sm:p-4 bg-card rounded-md border border-border/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Money Sent (Payouts)
            </span>
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <MoneyOutIcon className="w-4 h-4 text-primary" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-semibold text-foreground block tabular-nums">
            {formatCurrency(stats.totalDisbursed)}
          </span>
          <span className="text-[10px] sm:text-[11px] text-success font-medium mt-1 block">
            83.0% Collected ({formatCurrency(stats.cashCollected)})
          </span>
        </div>

        <div className="p-3.5 sm:p-4 bg-card rounded-md border border-border/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Money Received (USSD)
            </span>
            <div className="w-7 h-7 rounded-md bg-success/10 flex items-center justify-center shrink-0">
              <MoneyInIcon className="w-4 h-4 text-success" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-semibold text-success block tabular-nums">
            {formatCurrency(stats.totalCollectedInflows)}
          </span>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 block">
            From buyers dialing *671*44#
          </span>
        </div>

        <div className="p-3.5 sm:p-4 bg-card rounded-md border border-border/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Awaiting Cashout (48h)
            </span>
            <div className="w-7 h-7 rounded-md bg-warning/10 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-warning" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-semibold text-warning block tabular-nums">
            {formatCurrency(stats.pendingPickup)}
          </span>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 block">
            {formatCurrency(stats.autoRefunded)} returned to balance
          </span>
        </div>
      </div>

      {/* Main Charts Row: Cash Flow Trends & Option C Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cash Flow Reconciliation Chart */}
        <div className="lg:col-span-2 bg-card rounded-md p-5 border border-border/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Money In vs. Money Out (Monthly)
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Money sent out to farmers vs. money received back from buyers
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                Money Sent
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-success" />
                Money Received
              </span>
            </div>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15, 23, 42, 0.06)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  tickFormatter={(val) => `₦${(val / 1000000).toFixed(0)}M`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="disbursements" name="Money Sent" fill="#004f71" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collections" name="Money Received" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* How Recipients Received Money */}
        <div className="bg-card rounded-md p-5 border border-border/60 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              How Recipients Received Money
            </h3>
            <p className="text-[11px] text-muted-foreground mb-4">
              Direct to phone vs. physical cash collected at local agents
            </p>

            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={methodBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                  >
                    {methodBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-border/40">
            {methodBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <span className="font-medium text-foreground block">{item.name}</span>
                    <span className="text-[10px] text-muted-foreground">{item.count} recipients</span>
                  </div>
                </div>
                <span className="font-semibold text-foreground tabular-nums">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fulfillment Speed & Network Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Collection Speed */}
        <div className="bg-card rounded-md p-5 border border-border/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                How Quickly Recipients Collect Cash
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Time taken from SMS dispatch to physical cash pickup at local agent points
              </p>
            </div>
            <Zap className="w-4 h-4 text-warning" />
          </div>

          <div className="space-y-4">
            {fulfillmentVelocity.map((tier, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{tier.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground tabular-nums">{formatCurrency(tier.amount)}</span>
                    <span className="font-bold text-foreground tabular-nums">{tier.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${tier.percentage}%`, backgroundColor: tier.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 rounded-md bg-secondary/40 border border-border/40 text-[11px] text-muted-foreground flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <span>
              <strong>86% of all rural recipients</strong> collect physical cash from an MTN MoMo agent within 24 hours. Zero cash leaves company control until physical pickup is completed.
            </span>
          </div>
        </div>

        {/* Network Health & Accuracy */}
        <div className="bg-card rounded-md p-5 border border-border/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Network Health & Accuracy
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Live connectivity and balance precision metrics
                </p>
              </div>
              <Radio className="w-4 h-4 text-success animate-pulse" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-secondary/30 rounded-md border border-border/40">
                <span className="text-[10px] text-muted-foreground uppercase font-medium block">
                  USSD Gateway Uptime (*671#)
                </span>
                <span className="text-xl font-bold text-success mt-1 block tabular-nums">
                  99.85%
                </span>
                <span className="text-[10px] text-muted-foreground">All 36 States active</span>
              </div>

              <div className="p-3 bg-secondary/30 rounded-md border border-border/40">
                <span className="text-[10px] text-muted-foreground uppercase font-medium block">
                  Average Transfer Speed
                </span>
                <span className="text-xl font-bold text-foreground mt-1 block tabular-nums">
                  2.1s
                </span>
                <span className="text-[10px] text-muted-foreground">Instant dispatch</span>
              </div>

              <div className="p-3 bg-secondary/30 rounded-md border border-border/40">
                <span className="text-[10px] text-muted-foreground uppercase font-medium block">
                  Active POS & MoMo Agents
                </span>
                <span className="text-xl font-bold text-foreground mt-1 block tabular-nums">
                  34,800+
                </span>
                <span className="text-[10px] text-muted-foreground">Verified rural cash points</span>
              </div>

              <div className="p-3 bg-secondary/30 rounded-md border border-border/40">
                <span className="text-[10px] text-muted-foreground uppercase font-medium block">
                  Balance Discrepancy
                </span>
                <span className="text-xl font-bold text-success mt-1 block tabular-nums">
                  ₦0.00
                </span>
                <span className="text-[10px] text-success font-medium">Exact Penny Match</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/40 text-xs text-muted-foreground flex items-center justify-between">
            <span>Company Wallet: <strong className="text-foreground">MOMO-CORP-0124891049</strong></span>
            <span className="flex items-center gap-1 text-success">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Connected
            </span>
          </div>
        </div>
      </div>

      {/* Regional Agricultural Clusters: Desktop Table & Mobile Cards */}
      <div className="bg-card rounded-md p-4 sm:p-5 border border-border/60 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Regional Agricultural Clusters Performance
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Beneficiary density, disbursed capital, and collection status by farming zone
            </p>
          </div>
          <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>

        {/* Desktop Table (Hidden on Mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3 font-semibold">Agricultural Zone</th>
                <th className="py-2.5 px-3 font-semibold">LGAs Covered</th>
                <th className="py-2.5 px-3 font-semibold">Beneficiary Farmers</th>
                <th className="py-2.5 px-3 font-semibold">Total Capital</th>
                <th className="py-2.5 px-3 font-semibold">Fulfillment Rate</th>
                <th className="py-2.5 px-3 font-semibold">Primary Method</th>
                <th className="py-2.5 px-3 font-semibold text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {regionalClusters.map((row, idx) => (
                <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-3 font-semibold text-foreground">{row.zone}</td>
                  <td className="py-3 px-3 text-muted-foreground">{row.lga}</td>
                  <td className="py-3 px-3 font-medium text-foreground tabular-nums">
                    {row.farmers.toLocaleString()} farmers
                  </td>
                  <td className="py-3 px-3 font-semibold text-foreground tabular-nums">
                    {formatCurrency(row.capital)}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-success rounded-full"
                          style={{ width: row.delivery }}
                        />
                      </div>
                      <span className="font-semibold text-foreground tabular-nums">{row.delivery}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${row.method.includes("Wallet")
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-success/10 text-success border-success/20"
                      }`}>
                      {row.method}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-secondary text-muted-foreground border border-border/60">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View (Visible on <md screens) */}
        <div className="block md:hidden divide-y divide-border/20">
          {regionalClusters.map((row, idx) => (
            <div key={idx} className="py-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-semibold text-foreground">{row.zone}</h4>
                  <p className="text-[10px] text-muted-foreground">{row.lga}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-foreground tabular-nums block">
                    {formatCurrency(row.capital)}
                  </span>
                  <span className="text-[10px] text-muted-foreground tabular-nums block">
                    {row.farmers.toLocaleString()} farmers
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-0.5">
                <div className="flex items-center gap-2 flex-1 max-w-[160px]">
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success rounded-full"
                      style={{ width: row.delivery }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-foreground tabular-nums shrink-0">
                    {row.delivery}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-medium border ${row.method.includes("Wallet")
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-success/10 text-success border-success/20"
                    }`}>
                    {row.method}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-secondary text-muted-foreground border border-border/60">
                    {row.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
