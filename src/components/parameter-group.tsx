"use client";

import { useState } from "react";
import TipIcon from "@/components/ui/tipIcon";
import { ChevronDown, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParameterGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  discrepancyTip?: string;
  discrepancyTipSeverity?: "info" | "warning";
}

export function ParameterGroup({
  title,
  children,
  defaultOpen = true,
  discrepancyTip,
  discrepancyTipSeverity,
}: ParameterGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 px-1 text-sm font-medium"
      >
        <span className="flex items-center gap-1.5">
          {title}
          {discrepancyTip && discrepancyTipSeverity && (
            <TipIcon tip={discrepancyTip} severity={discrepancyTipSeverity} />
          )}
        </span>
        <ChevronDown
          onClick={() => setOpen(!open)}
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && <div className="pb-4 px-1">{children}</div>}
    </div>
  );
}
