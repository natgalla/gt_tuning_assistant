"use client";

import { Popover } from "@base-ui/react/popover";
import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TipIcon({
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
        className={cn("shrink-0 p-1 rounded-sm", colorClass)}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        render={<button type="button" />}
      >
        <Icon className="h-5 w-5" />
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
