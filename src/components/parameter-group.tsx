"use client";

import { useState } from "react";
import { Popover } from "@base-ui/react/popover";
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
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 px-1 text-sm font-medium"
      >
        <span className="flex items-center gap-1.5">
          {title}
          {discrepancyTip && discrepancyTipSeverity && (
            <DiscrepancyTipIcon
              tip={discrepancyTip}
              severity={discrepancyTipSeverity}
            />
          )}
        </span>
        <ChevronDown
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

function DiscrepancyTipIcon({
  tip,
  severity,
}: {
  tip: string;
  severity: "info" | "warning";
}) {
  const Icon = severity === "warning" ? AlertTriangle : Info;
  const colorClass =
    severity === "warning" ? "text-amber-500" : "text-blue-400";

  return (
    <Popover.Root>
      <Popover.Trigger
        className={cn("p-0.5 rounded-sm", colorClass)}
        render={
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") e.stopPropagation();
            }}
          />
        }
      >
        <Icon className="h-4.5 w-4.5" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={6}>
          <Popover.Popup
            className={cn(
              "max-w-[240px] rounded-lg border bg-popover px-3 py-2 text-xs shadow-md",
              severity === "warning"
                ? "text-amber-700 dark:text-amber-400"
                : "text-blue-700 dark:text-blue-400",
            )}
          >
            {tip}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
