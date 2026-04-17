"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

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
}) {
  const decrement = useCallback(() => {
    const next = roundToStep(value - step, step);
    if (next >= min) onChange(next);
  }, [value, step, min, onChange]);

  const increment = useCallback(() => {
    const next = roundToStep(value + step, step);
    if (next <= max) onChange(next);
  }, [value, step, max, onChange]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-10 text-right shrink-0">
        {label}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0"
        disabled={disabled || value <= min}
        onClick={decrement}
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <span className={`flex-1 text-center text-sm font-mono tabular-nums ${disabled ? "text-muted-foreground" : ""}`}>
        {formatValue(value)}
        {unit && <span className="text-muted-foreground ml-0.5">{unit}</span>}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0"
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
      />
    </div>
  );
}
