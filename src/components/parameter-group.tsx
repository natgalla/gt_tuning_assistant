"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParameterGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function ParameterGroup({
  title,
  children,
  defaultOpen = true,
}: ParameterGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 px-1 text-sm font-medium"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="pb-4 px-1">{children}</div>}
    </div>
  );
}
