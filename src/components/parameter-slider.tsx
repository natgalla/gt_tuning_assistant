"use client";

import { useCallback } from "react";
import TipIcon from "@/components/ui/tipIcon";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParameterSliderProps {
  label: string;
  frontValue: number;
  rearValue: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  disabled?: boolean;
  formatValue?: (value: number) => string;
  onFrontChange: (value: number) => void;
  onRearChange: (value: number) => void;
  frontHighlight?: "increase" | "decrease";
  rearHighlight?: "increase" | "decrease";
  onFrontHighlightClear?: () => void;
  onRearHighlightClear?: () => void;
  frontTip?: string;
  frontTipSeverity?: "info" | "warning";
  rearTip?: string;
  rearTipSeverity?: "info" | "warning";
}

function roundToStep(value: number, step: number): number {
  const decimals = step.toString().split(".")[1]?.length ?? 0;
  return parseFloat(value.toFixed(decimals));
}

export function StepperRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  disabled,
  formatValue,
  onChange,
  highlight,
  onHighlightClear,
  tip,
  tipSeverity,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  disabled: boolean;
  formatValue: (v: number) => string;
  onChange: (v: number) => void;
  highlight?: "increase" | "decrease";
  onHighlightClear?: () => void;
  tip?: string;
  tipSeverity?: "info" | "warning";
}) {
  const decrement = useCallback(() => {
    const next = roundToStep(value - step, step);
    if (next >= min) onChange(next);
    if (highlight === "decrease" && onHighlightClear) onHighlightClear();
  }, [value, step, min, onChange, highlight, onHighlightClear]);

  const increment = useCallback(() => {
    const next = roundToStep(value + step, step);
    if (next <= max) onChange(next);
    if (highlight === "increase" && onHighlightClear) onHighlightClear();
  }, [value, step, max, onChange, highlight, onHighlightClear]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-10 text-right shrink-0">
        {label}
      </span>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "h-9 w-9 shrink-0",
          highlight === "decrease" &&
            "border-red-500 bg-red-500/10 text-red-600",
        )}
        disabled={disabled || value <= min}
        onClick={decrement}
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <span
        className={`flex-1 text-center text-sm font-mono tabular-nums ${disabled ? "text-muted-foreground" : ""}`}
      >
        {formatValue(value)}
        {unit && <span className="text-muted-foreground ml-0.5">{unit}</span>}
      </span>
      {tip && tipSeverity && <TipIcon tip={tip} severity={tipSeverity} />}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "h-9 w-9 shrink-0",
          highlight === "increase" &&
            "border-green-500 bg-green-500/10 text-green-600",
        )}
        disabled={disabled || value >= max}
        onClick={increment}
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export function ParameterSlider({
  label,
  frontValue,
  rearValue,
  min,
  max,
  step,
  unit,
  disabled = false,
  formatValue,
  onFrontChange,
  onRearChange,
  frontHighlight,
  rearHighlight,
  onFrontHighlightClear,
  onRearHighlightClear,
  frontTip,
  frontTipSeverity,
  rearTip,
  rearTipSeverity,
}: ParameterSliderProps) {
  const fmt = formatValue ?? ((v: number) => `${v}`);

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
      )}
      <StepperRow
        label="Front"
        value={frontValue}
        min={min}
        max={max}
        step={step}
        unit={unit}
        disabled={disabled}
        formatValue={fmt}
        onChange={onFrontChange}
        highlight={frontHighlight}
        onHighlightClear={onFrontHighlightClear}
        tip={frontTip}
        tipSeverity={frontTipSeverity}
      />
      <StepperRow
        label="Rear"
        value={rearValue}
        min={min}
        max={max}
        step={step}
        unit={unit}
        disabled={disabled}
        formatValue={fmt}
        onChange={onRearChange}
        highlight={rearHighlight}
        onHighlightClear={onRearHighlightClear}
        tip={rearTip}
        tipSeverity={rearTipSeverity}
      />
    </div>
  );
}
