"use client";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Percent,
  Activity,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp } from "./count-up";

interface MetricCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: typeof DollarSign;
  accentColor?: "primary" | "success" | "warning" | "critical";
  footnote?: string;
}

function MetricCard({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  trend,
  trendValue,
  icon: Icon,
  accentColor = "primary",
  footnote,
}: MetricCardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  const iconColors = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    critical: "text-critical",
  };

  return (
    <div className="p-5 bg-card rounded-md group border border-border/40 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <span className="text-[11px] font-medium text-muted-foreground/80 uppercase tracking-wider">
          {label}
        </span>
        <div className="w-7 h-7 rounded-md bg-secondary/40 flex items-center justify-center">
          <Icon className={cn("w-4 h-4", iconColors[accentColor])} strokeWidth={1.5} />
        </div>
      </div>

      {/* Value */}
      <div className="mb-3">
        <CountUp
          end={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          className="text-2xl font-semibold text-foreground tracking-tight tabular-nums"
        />
      </div>

      {/* Trend - minimal */}
      {trend && trendValue && (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex items-center gap-1 text-[11px] font-medium",
              trend === "up" && "text-success",
              trend === "down" && "text-critical",
              trend === "neutral" && "text-warning"
            )}
          >
            <TrendIcon className="w-3 h-3" />
            {trendValue}
          </span>
          <span className="text-[10px] text-muted-foreground/60">
            {footnote || "AgriCorp Escrow"}
          </span>
        </div>
      )}
    </div>
  );
}

interface SentinelMetricsProps {
  totalArr: number;
  averageNrr: number;
  averageHealthScore: number;
  accountCount: number;
}

export function SentinelMetrics({
  totalArr,
  averageNrr,
  averageHealthScore,
  accountCount,
}: SentinelMetricsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard
        label="Total Program Budget"
        value={150.0}
        prefix="₦"
        suffix="M"
        decimals={2}
        trend="up"
        trendValue="Escrow Funded"
        footnote="MTN MoMo PSB Escrow"
        icon={ShieldCheck}
        accentColor="primary"
      />
      <MetricCard
        label="Cash Collected (Face Value)"
        value={124.5}
        prefix="₦"
        suffix="M"
        decimals={2}
        trend="up"
        trendValue="83.0% Delivered"
        footnote="MoMo Agent 100% Cash OTC"
        icon={CheckCircle2}
        accentColor="success"
      />
      <MetricCard
        label="Pending OTC Pickup"
        value={23.7}
        prefix="₦"
        suffix="M"
        decimals={2}
        trend="neutral"
        trendValue="15.8% In-Flight"
        footnote="*671# Active 48h Window"
        icon={Clock}
        accentColor="warning"
      />
      <MetricCard
        label="Returned to Balance"
        value={1.8}
        prefix="₦"
        suffix="M"
        decimals={2}
        trend="up"
        trendValue="100% Capital Returned"
        footnote="Returned to Company Wallet"
        icon={RotateCcw}
        accentColor="primary"
      />
    </div>
  );
}
