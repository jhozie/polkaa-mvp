"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrbit } from "./orbit-provider";
import { useToastActions } from "./toast-provider";
import {
  User,
  Bell,
  ShieldCheck,
  Landmark,
  Radio,
  FileSpreadsheet,
  RotateCcw,
  Check,
  KeyRound,
  Lock,
  ArrowRightLeft,
  Smartphone,
  Server,
  AlertTriangle,
} from "lucide-react";

interface SettingsSectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
  children: React.ReactNode;
}

function SettingsSection({
  icon: Icon,
  title,
  description,
  badge,
  children,
}: SettingsSectionProps) {
  return (
    <div className="p-4 sm:p-6 bg-card rounded-md border border-border/60 shadow-sm space-y-4">
      <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-border/40">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-secondary/60 flex items-center justify-center shrink-0 border border-border/60">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">{title}</h3>
              {badge && (
                <span className="px-2 py-0.2 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingsRow({ label, description, children }: SettingsRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 border-b border-border/30 last:border-b-0 gap-2">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-xs font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function SettingsView() {
  const { resetToDefaults } = useOrbit();
  const toast = useToastActions();

  // State
  const [displayName, setDisplayName] = useState("Dr. Aminu Garba");
  const [email, setEmail] = useState("aminu.garba@agricorp.ng");
  const [role, setRole] = useState("Finance Director (Authorized Checker Signer)");
  const [checkerPin, setCheckerPin] = useState("4821");
  const [dualApprovalThreshold, setDualApprovalThreshold] = useState("500000");
  const [require2FA, setRequire2FA] = useState(true);

  // Float & Settlement
  const [floatAlertThreshold, setFloatAlertThreshold] = useState("20000000");
  const [settlementBank, setSettlementBank] = useState("zenith");
  const [settlementNuban, setSettlementNuban] = useState("1012948201");
  const [settlementAccountName, setSettlementAccountName] = useState("AgriCorp Nigeria Ltd — MoMo Treasury Settlement");
  const [liquidationSchedule, setLiquidationSchedule] = useState("daily");
  const [autoRecycleFloat, setAutoRecycleFloat] = useState(true);

  // 48h SLA & Cash Vouchers
  const [slaWindow, setSlaWindow] = useState("48");
  const [smsReminderAt, setSmsReminderAt] = useState("24");
  const [autoRevertToFloat, setAutoRevertToFloat] = useState(true);

  // MoMo USSD & API
  const [merchantUssd, setMerchantUssd] = useState("*671*44#");
  const [merchantId, setMerchantId] = useState("MOMO-MERCHANT-849201");
  const [webhookUrl, setWebhookUrl] = useState("https://api.polkaa.ng/v1/momo/callbacks");
  const [apiEnvironment, setApiEnvironment] = useState("production");

  // Notifications
  const [emailBatchAlerts, setEmailBatchAlerts] = useState(true);
  const [smsLowFloatAlerts, setSmsLowFloatAlerts] = useState(true);
  const [dailyReversalDigest, setDailyReversalDigest] = useState(true);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSaving(false);
    toast.success("Corporate treasury & MTN MoMo compliance configurations saved");
  };

  return (
    <div className="p-4 sm:p-6 pb-12 sm:pb-16 space-y-4 sm:space-y-6 max-w-[1400px]">
      {/* Sticky Action Header (Always visible when scrolling down) */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 p-4 sm:px-6 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
              Security & Payment Settings
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 shrink-0">
              MTN MoMo Rails
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            AgriCorp Nigeria Ltd • Two-Step Approval, Wallet Controls & Bank Settlement
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs cursor-pointer shadow-sm w-full sm:w-auto min-h-[40px] px-5 justify-center shrink-0 font-medium"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </>
          )}
        </Button>
      </div>

      {/* 1. Two-Step Approval & Security PIN */}
      <SettingsSection
        icon={ShieldCheck}
        title="Two-Step Approval & Security PIN"
        description="Require two authorized people (Initiator and Approver) before any batch payment can leave"
        badge="Security"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Authorizing Approver Name</Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-secondary/40 border-border/60 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Approver Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary/40 border-border/60 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Job Role</Label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-secondary/40 border-border/60 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Security Approval PIN</Label>
            <div className="relative">
              <Input
                type="password"
                maxLength={4}
                value={checkerPin}
                onChange={(e) => setCheckerPin(e.target.value)}
                className="bg-secondary/40 border-border/60 text-xs tabular-nums font-semibold tracking-widest pl-8"
              />
              <KeyRound className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
            </div>
            <p className="text-[10px] text-muted-foreground">Default demo PIN: 4821</p>
          </div>
        </div>

        <SettingsRow
          label="Minimum Amount Requiring Approval PIN"
          description="Payment batches equal to or exceeding this amount strictly require the Approver's PIN"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">₦</span>
            <Input
              type="number"
              value={dualApprovalThreshold}
              onChange={(e) => setDualApprovalThreshold(e.target.value)}
              className="w-36 bg-secondary/40 border-border/60 text-xs tabular-nums"
            />
          </div>
        </SettingsRow>

        <SettingsRow
          label="SMS OTP / Biometric 2FA Requirement"
          description="Enforce secondary one-time passcode on the Finance Director's phone upon batch release"
        >
          <Switch checked={require2FA} onCheckedChange={setRequire2FA} />
        </SettingsRow>
      </SettingsSection>

      {/* 2. Company Wallet & Available Balance */}
      <SettingsSection
        icon={Landmark}
        title="Company Wallet & Available Balance"
        description="Your dedicated business wallet on MTN MoMo rails"
        badge="Active Wallet"
      >
        <SettingsRow
          label="Company Wallet ID"
          description="Dedicated mobile money wallet number linked to AgriCorp"
        >
          <span className="text-xs font-semibold text-foreground px-2.5 py-1 bg-secondary/60 rounded border border-border/60 tabular-nums">
            MOMO-CORP-0124891049
          </span>
        </SettingsRow>

        <SettingsRow
          label="Available Wallet Balance"
          description="Real money currently available to send out"
        >
          <span className="text-xs font-bold text-success px-2.5 py-1 bg-success/10 rounded border border-success/20 tabular-nums">
            ₦107,325,000.00 Available
          </span>
        </SettingsRow>

        <SettingsRow
          label="Low Balance Alert (Send SMS below this amount)"
          description="Sends an alert to the finance team when available balance drops below this threshold"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">₦</span>
            <Input
              type="number"
              value={floatAlertThreshold}
              onChange={(e) => setFloatAlertThreshold(e.target.value)}
              className="w-40 bg-secondary/40 border-border/60 text-xs tabular-nums"
            />
          </div>
        </SettingsRow>

        <SettingsRow
          label="Direct Top-Up Code"
          description="Dial this USSD string to top up your wallet directly from your bank"
        >
          <span className="text-xs font-medium text-foreground px-2 py-0.5 bg-secondary rounded border border-border/40 tabular-nums">
            *671*00*124891049#
          </span>
        </SettingsRow>
      </SettingsSection>

      {/* 3. Bank Account for Received Money */}
      <SettingsSection
        icon={ArrowRightLeft}
        title="Bank Account for Received Money"
        description="Commercial bank where USSD collections (*671*44#) are transferred daily"
        badge="Bank Transfer"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Commercial Bank</Label>
            <Select value={settlementBank} onValueChange={setSettlementBank}>
              <SelectTrigger className="bg-secondary/40 border-border/60 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zenith">Zenith Bank Plc</SelectItem>
                <SelectItem value="access">Access Bank Plc</SelectItem>
                <SelectItem value="firstbank">First Bank of Nigeria</SelectItem>
                <SelectItem value="gtbank">Guaranty Trust Bank</SelectItem>
                <SelectItem value="stanbic">Stanbic IBTC Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">NUBAN Account Number</Label>
            <Input
              value={settlementNuban}
              onChange={(e) => setSettlementNuban(e.target.value)}
              className="bg-secondary/40 border-border/60 text-xs tabular-nums"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs font-medium text-foreground">Account Name</Label>
            <Input
              value={settlementAccountName}
              onChange={(e) => setSettlementAccountName(e.target.value)}
              className="bg-secondary/40 border-border/60 text-xs"
            />
          </div>
        </div>

        <SettingsRow
          label="Transfer Schedule"
          description="How often money received sweeps into your Zenith Bank account"
        >
          <Select value={liquidationSchedule} onValueChange={setLiquidationSchedule}>
            <SelectTrigger className="w-44 bg-secondary/40 border-border/60 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily Sweep (11:59 PM)</SelectItem>
              <SelectItem value="twice">Twice Daily (12:00 PM & 11:59 PM)</SelectItem>
              <SelectItem value="manual">Manual Transfer</SelectItem>
            </SelectContent>
          </Select>
        </SettingsRow>

        <SettingsRow
          label="Auto-Transfer 50% into Wallet"
          description="Automatically keep 50% of incoming payments in your wallet for upcoming payouts"
        >
          <Switch checked={autoRecycleFloat} onCheckedChange={setAutoRecycleFloat} />
        </SettingsRow>
      </SettingsSection>

      {/* 4. Withdrawal Code Lifespan & Money Return */}
      <SettingsSection
        icon={Lock}
        title="Withdrawal Code Lifespan & Money Return"
        description="Rules for how long SMS codes remain active before unclaimed money returns to your balance"
        badge="Zero Loss"
      >
        <SettingsRow
          label="Code Expiration Time"
          description="How long recipients have to collect physical cash at an agent"
        >
          <Select value={slaWindow} onValueChange={setSlaWindow}>
            <SelectTrigger className="w-36 bg-secondary/40 border-border/60 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">24 Hours (1 Day)</SelectItem>
              <SelectItem value="48">48 Hours (2 Days - Standard)</SelectItem>
              <SelectItem value="72">72 Hours (3 Days)</SelectItem>
            </SelectContent>
          </Select>
        </SettingsRow>

        <SettingsRow
          label="Return Unclaimed Money to Balance"
          description="Automatically return funds to your company wallet the second a code expires"
        >
          <Switch checked={autoRevertToFloat} onCheckedChange={setAutoRevertToFloat} />
        </SettingsRow>

        <SettingsRow
          label="Send Pickup Reminder SMS"
          description="Send an automated SMS to recipients if their cash is still uncollected"
        >
          <Select value={smsReminderAt} onValueChange={setSmsReminderAt}>
            <SelectTrigger className="w-36 bg-secondary/40 border-border/60 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">After 12 Hours</SelectItem>
              <SelectItem value="24">After 24 Hours</SelectItem>
              <SelectItem value="36">After 36 Hours</SelectItem>
            </SelectContent>
          </Select>
        </SettingsRow>
      </SettingsSection>

      {/* 5. Inbound Collection Rails & Webhooks */}
      <SettingsSection
        icon={Radio}
        title="Inbound Collection Rails & Developer Webhooks"
        description="Configuration for *671*44# USSD, MoMo Business Merchant ID, and transaction webhooks"
        badge="API & USSD"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Dedicated Collection USSD String</Label>
            <Input
              value={merchantUssd}
              onChange={(e) => setMerchantUssd(e.target.value)}
              className="bg-secondary/40 border-border/60 text-xs font-semibold tabular-nums"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">MoMo Business Merchant ID</Label>
            <Input
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              className="bg-secondary/40 border-border/60 text-xs tabular-nums"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs font-medium text-foreground">Webhook Callback URL</Label>
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="bg-secondary/40 border-border/60 text-xs"
            />
            <p className="text-[10px] text-muted-foreground">
              Receives instant POST callbacks on settled collections and OTC cash-outs
            </p>
          </div>
        </div>

        <SettingsRow
          label="MoMo API Environment"
          description="Connection endpoint for the MTN MoMo Open API cluster"
        >
          <Select value={apiEnvironment} onValueChange={setApiEnvironment}>
            <SelectTrigger className="w-48 bg-secondary/40 border-border/60 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="production">Production (MoMo PSB Gateway)</SelectItem>
              <SelectItem value="sandbox">Developer Sandbox Portal</SelectItem>
            </SelectContent>
          </Select>
        </SettingsRow>
      </SettingsSection>

      {/* 6. Notifications & Alerts */}
      <SettingsSection
        icon={Bell}
        title="Disbursement & Treasury Audit Alerts"
        description="Automated notifications dispatched to corporate signatories and logistics leads"
      >
        <SettingsRow
          label="Batch Release Confirmation Alerts"
          description="Immediate email dispatched to signatories upon successful dual-signature execution"
        >
          <Switch checked={emailBatchAlerts} onCheckedChange={setEmailBatchAlerts} />
        </SettingsRow>

        <SettingsRow
          label="Low Balance SMS Alerts"
          description="SMS alert sent to finance team when available balance drops below alert amount"
        >
          <Switch checked={smsLowFloatAlerts} onCheckedChange={setSmsLowFloatAlerts} />
        </SettingsRow>

        <SettingsRow
          label="Daily Return to Balance Digest"
          description="Summary of uncollected cash returned back into company wallet during the day"
        >
          <Switch checked={dailyReversalDigest} onCheckedChange={setDailyReversalDigest} />
        </SettingsRow>
      </SettingsSection>

      {/* 7. Data Ledger & Reset */}
      <SettingsSection
        icon={FileSpreadsheet}
        title="Audit Ledger & State Management"
        description="Export compliance records or reset in-memory demonstration state"
      >
        <SettingsRow
          label="Export Complete Audit Ledger"
          description="Download all disbursement batches, collections, and settlement receipts as CSV"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("AgriCorp audit ledger exported (CSV format)")}
            className="text-xs border-border/60 cursor-pointer"
          >
            Export Ledger CSV
          </Button>
        </SettingsRow>

        <SettingsRow
          label="Restore Baseline Demonstration State"
          description="Reset in-memory balances to the default ₦150M program budget"
        >
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-critical border-critical/30 hover:bg-critical/10 hover:text-critical bg-transparent cursor-pointer"
            onClick={() => {
              if (window.confirm("Reset demo ledger? This will restore the AgriCorp ₦150M baseline state.")) {
                resetToDefaults();
                toast.success("Demo ledger restored to baseline state");
              }
            }}
          >
            Reset Demo Ledger
          </Button>
        </SettingsRow>
      </SettingsSection>

      {/* Bottom Save Action Bar */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/40">
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          Ready to commit changes? Updates take effect immediately on corporate wallet rails.
        </p>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs cursor-pointer shadow-sm w-full sm:w-auto min-h-[44px] px-6 font-medium"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving Configuration...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </>
          )}
        </Button>
      </div>

      {/* Institutional Attribution Footer */}
      <div className="pt-6 pb-2 text-center space-y-1">
        <p className="text-xs font-semibold text-foreground">
          Polkaa Corporate Disbursement & Collection Suite • polkaa.ng
        </p>
        <p className="text-[11px] text-muted-foreground">
          Originator & Product Lead: <strong className="text-foreground">Oladoyin Muhibi</strong> • Technical Team Lead / CTO: <strong className="text-foreground">Joseph Nwankwo</strong>
        </p>
        <p className="text-[10px] text-muted-foreground/60">
          Powered by MTN Mobile Money (MoMo PSB Nigeria Ltd) • Strict Zero-Leakage Integer Minor Unit Engine
        </p>
      </div>
    </div>
  );
}
