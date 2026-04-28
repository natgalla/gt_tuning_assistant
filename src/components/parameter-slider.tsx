"use client";

import { useCallback, useRef } from "react";
import TipIcon from "@/components/ui/tipIcon";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HighlightInfo {
  direction: "increase" | "decrease";
  score: number;
}

interface ParameterSliderProps {
  label: string;
  frontValue: number;
  rearValue?: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  disabled?: boolean;
  formatValue?: (value: number) => string;
  onFrontChange: (value: number) => void;
  onRearChange?: (value: number) => void;
  frontHighlight?: HighlightInfo;
  rearHighlight?: HighlightInfo;
  onFrontHighlightClear?: () => void;
  onRearHighlightClear?: () => void;
  frontTip?: string;
  frontTipSeverity?: "info" | "warning";
  rearTip?: string;
  rearTipSeverity?: "info" | "warning";
}

const SCORE_BORDER: Record<number, string> = {
  0: "",
  1: "border-2",
  2: "border-[3px]",
  3: "border-4",
  4: "border-4",
};

function borderForScore(score: number): string {
  return SCORE_BORDER[Math.min(score, 4)] ?? "";
}

function roundToStep(value: number, step: number): number {
  const decimals = step.toString().split(".")[1]?.length ?? 0;
  return parseFloat(value.toFixed(decimals));
}

function StepperRow({
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
  highlight?: HighlightInfo;
  onHighlightClear?: () => void;
  tip?: string;
  tipSeverity?: "info" | "warning";
}) {
  const decrement = useCallback(() => {
    const next = roundToStep(value - step, step);
    if (next >= min) onChange(next);
    if (highlight?.direction === "decrease" && onHighlightClear) onHighlightClear();
  }, [value, step, min, onChange, highlight, onHighlightClear]);

  const increment = useCallback(() => {
    const next = roundToStep(value + step, step);
    if (next <= max) onChange(next);
    if (highlight?.direction === "increase" && onHighlightClear) onHighlightClear();
  }, [value, step, max, onChange, highlight, onHighlightClear]);

  // Horizontal drag to scrub the value
  const dragRef = useRef<{
    x: number;
    startValue: number;
    lastSet: number;
  } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      dragRef.current = { x: e.clientX, startValue: value, lastSet: value };

      const onMove = (me: PointerEvent) => {
        const drag = dragRef.current;
        if (!drag) return;
        const dx = me.clientX - drag.x;
        if (Math.abs(dx) < 8) return;
        const steps = Math.trunc(dx / 16);
        const next = roundToStep(drag.startValue + steps * step, step);
        const clamped = Math.min(max, Math.max(min, next));
        if (clamped !== drag.lastSet) {
          drag.lastSet = clamped;
          onChange(clamped);
          if (onHighlightClear) onHighlightClear();
        }
      };

      const onUp = () => {
        dragRef.current = null;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [disabled, value, step, min, max, onChange, onHighlightClear],
  );

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-10 text-right shrink-0">
        {label}
      </span>
      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "h-9 w-9 shrink-0",
          highlight?.direction === "decrease" &&
            "border-red-400 bg-red-500/30 text-red-400 hover:bg-red-500/40",
          highlight?.direction === "decrease" && borderForScore(highlight.score),
        )}
        disabled={disabled || value <= min}
        onClick={decrement}
      >
        <Minus className={cn("h-3.5 w-3.5", highlight?.direction === "decrease" && highlight.score > 0 && "stroke-[3]")} />
      </Button>
      <span
        className={cn(
          "flex-1 text-center text-sm font-mono tabular-nums select-none bg-black/40 rounded px-2 py-1",
          disabled ? "text-muted-foreground" : "cursor-ew-resize",
          tip && tipSeverity && "-mr-10",
        )}
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
      >
        {formatValue(value)}
        {unit && <span className="text-muted-foreground ml-0.5">{unit}</span>}
      </span>
      {tip && tipSeverity && <TipIcon tip={tip} severity={tipSeverity} />}
      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "h-9 w-9 shrink-0",
          highlight?.direction === "increase" &&
            "border-green-400 bg-green-500/30 text-green-400 hover:bg-green-500/40",
          highlight?.direction === "increase" && borderForScore(highlight.score),
        )}
        disabled={disabled || value >= max}
        onClick={increment}
      >
        <Plus className={cn("h-3.5 w-3.5", highlight?.direction === "increase" && highlight.score > 0 && "stroke-[3]")} />
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

  if (onRearChange === undefined) {
    return (
      <StepperRow
        label={label}
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
    );
  }

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
        value={rearValue!}
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
