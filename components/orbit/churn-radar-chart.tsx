"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { churnData as rawChurnData, type ChurnDataPoint } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// Validate fulfillment data
const churnData: ChurnDataPoint[] = rawChurnData.map(point => ({
  month: point.month || 'N/A',
  predicted: typeof point.predicted === 'number' && !isNaN(point.predicted) ? point.predicted : 95.0,
  actual: point.actual === null ? null : (typeof point.actual === 'number' && !isNaN(point.actual) ? point.actual : null),
}));

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  hiddenSeries: Set<string>;
}

function CustomTooltip({ active, payload, label, hiddenSeries }: CustomTooltipProps) {
  if (!active || !payload) return null;

  const visiblePayload = payload.filter(p => !hiddenSeries.has(p.dataKey));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-popover p-3 rounded-md shadow-lg border border-border/40 text-[12px]"
    >
      <p className="font-semibold text-foreground mb-1.5">{label}</p>
      {visiblePayload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-[11px]">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground">
            {entry.value !== null ? `${entry.value}%` : "In-Flight"}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

interface LegendItemProps {
  color: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function LegendItem({ color, label, isActive, onClick }: LegendItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-100 cursor-pointer",
        isActive 
          ? "hover:bg-secondary/60" 
          : "opacity-40 hover:opacity-60"
      )}
    >
      <div 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color, opacity: isActive ? 1 : 0.5 }}
      />
      <span className={cn(
        "text-[11px] text-muted-foreground/80 font-medium",
        !isActive && "line-through"
      )}>
        {label}
      </span>
    </button>
  );
}

export function ChurnRadarChart() {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const toggleSeries = (key: string) => {
    setHiddenSeries(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const isPredictedVisible = !hiddenSeries.has('predicted');
  const isActualVisible = !hiddenSeries.has('actual');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[13px] font-medium text-foreground">
            Fulfillment Velocity & Cash Collection Rate
          </h3>
          <p className="text-[11px] text-muted-foreground/60 mt-0.5">
            Monthly OTC face value claimed at Verified Cash Points vs target corporate SLA
          </p>
        </div>
        <div className="flex items-center gap-1">
          <LegendItem
            color="#004F71"
            label="Target SLA"
            isActive={isPredictedVisible}
            onClick={() => toggleSeries('predicted')}
          />
          <LegendItem
            color="#22C55E"
            label="Actual Payout"
            isActive={isActualVisible}
            onClick={() => toggleSeries('actual')}
          />
        </div>
      </div>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={churnData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#004F71" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#004F71" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="rgba(0,0,0,0.3)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            <YAxis
              stroke="rgba(0,0,0,0.3)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              dx={-5}
              domain={[85, 100]}
            />
            <Tooltip content={<CustomTooltip hiddenSeries={hiddenSeries} />} />
            {isPredictedVisible && (
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#004F71"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorPredicted)"
                name="Target SLA"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#004F71",
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                }}
                animationDuration={600}
                animationEasing="ease-out"
              />
            )}
            {isActualVisible && (
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#22C55E"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorActual)"
                name="Actual Payout"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#22C55E",
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                }}
                connectNulls={false}
                animationDuration={600}
                animationEasing="ease-out"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
