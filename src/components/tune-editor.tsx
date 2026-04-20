"use client";

import { useState, useCallback } from "react";
import { SuspensionSelector } from "@/components/selector";
import { ParameterGroup } from "@/components/parameter-group";
import { ParameterSlider, StepperRow } from "@/components/parameter-slider";
import { SavedTunesSheet } from "@/components/saved-tunes-sheet";
import { TuningAdvisor } from "@/components/tuning-advisor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SUSPENSION_ORDER, TIRE_ORDER } from "@/lib/utils";

interface TuneConfig {
  id: number;
  carId: number;
  tireType: string;
  suspensionType: string;
  weightMin: number | null;
  weightMax: number | null;
  bodyHeightFrontMin: number | null;
  bodyHeightFrontMax: number | null;
  bodyHeightRearMin: number | null;
  bodyHeightRearMax: number | null;
  natFreqFrontMin: number | null;
  natFreqFrontMax: number | null;
  natFreqRearMin: number | null;
  natFreqRearMax: number | null;
  antiRollFrontMin: number | null;
  antiRollFrontMax: number | null;
  antiRollRearMin: number | null;
  antiRollRearMax: number | null;
  compressionFrontMin: number | null;
  compressionFrontMax: number | null;
  compressionRearMin: number | null;
  compressionRearMax: number | null;
  expansionFrontMin: number | null;
  expansionFrontMax: number | null;
  expansionRearMin: number | null;
  expansionRearMax: number | null;
  camberFrontMin: number | null;
  camberFrontMax: number | null;
  camberRearMin: number | null;
  camberRearMax: number | null;
  toeFrontMin: number | null;
  toeFrontMax: number | null;
  toeRearMin: number | null;
  toeRearMax: number | null;
  weightDefault: number | null;
  horsePowerDefault: number | null;
  bodyHeightFrontDefault: number | null;
  bodyHeightRearDefault: number | null;
  natFreqFrontDefault: number | null;
  natFreqRearDefault: number | null;
  antiRollFrontDefault: number | null;
  antiRollRearDefault: number | null;
  compressionFrontDefault: number | null;
  compressionRearDefault: number | null;
  expansionFrontDefault: number | null;
  expansionRearDefault: number | null;
  camberFrontDefault: number | null;
  camberRearDefault: number | null;
  toeFrontDefault: number | null;
  toeRearDefault: number | null;
  lsdInitFrontDefault: number | null;
  lsdAccelFrontDefault: number | null;
  lsdDecelFrontDefault: number | null;
  lsdInitRearDefault: number | null;
  lsdAccelRearDefault: number | null;
  lsdDecelRearDefault: number | null;
}

interface Car {
  id: number;
  name: string;
  manufacturer: string;
  year: number | null;
  drivetrain: string;
}

export interface TuneValues {
  weight: number | null;
  horsePower: number | null;
  bodyHeightFront: number | null;
  bodyHeightRear: number | null;
  natFreqFront: number | null;
  natFreqRear: number | null;
  antiRollFront: number | null;
  antiRollRear: number | null;
  compressionFront: number | null;
  compressionRear: number | null;
  expansionFront: number | null;
  expansionRear: number | null;
  camberFront: number | null;
  camberRear: number | null;
  toeFront: number | null;
  toeRear: number | null;
  lsdInitFront: number | null;
  lsdAccelFront: number | null;
  lsdDecelFront: number | null;
  lsdInitRear: number | null;
  lsdAccelRear: number | null;
  lsdDecelRear: number | null;
}

export interface SavedTune extends TuneValues {
  id: string;
  name: string;
  tireType: string;
  suspensionType: string;
  createdAt: string;
}

function getDefaults(config: TuneConfig): TuneValues {
  return {
    weight: config.weightDefault,
    horsePower: config.horsePowerDefault,
    bodyHeightFront: config.bodyHeightFrontDefault,
    bodyHeightRear: config.bodyHeightRearDefault,
    natFreqFront: config.natFreqFrontDefault,
    natFreqRear: config.natFreqRearDefault,
    antiRollFront: config.antiRollFrontDefault,
    antiRollRear: config.antiRollRearDefault,
    compressionFront: config.compressionFrontDefault,
    compressionRear: config.compressionRearDefault,
    expansionFront: config.expansionFrontDefault,
    expansionRear: config.expansionRearDefault,
    camberFront: config.camberFrontDefault,
    camberRear: config.camberRearDefault,
    toeFront: config.toeFrontDefault,
    toeRear: config.toeRearDefault,
    lsdInitFront: config.lsdInitFrontDefault,
    lsdAccelFront: config.lsdAccelFrontDefault,
    lsdDecelFront: config.lsdDecelFrontDefault,
    lsdInitRear: config.lsdInitRearDefault,
    lsdAccelRear: config.lsdAccelRearDefault,
    lsdDecelRear: config.lsdDecelRearDefault,
  };
}

interface TuneEditorProps {
  car: Car;
  configs: TuneConfig[];
  savedTunes: SavedTune[];
}

export function TuneEditor({
  car,
  configs,
  savedTunes: initialSavedTunes,
}: TuneEditorProps) {
  const configMap = Object.fromEntries(
    configs.map((c) => [c.suspensionType, c]),
  );
  const availableTypes = configs.map((c) => c.suspensionType);

  const [suspensionType, setSuspensionType] = useState(
    availableTypes.includes("FULLY_CUSTOMIZABLE")
      ? "FULLY_CUSTOMIZABLE"
      : availableTypes[0],
  );
  const [tireType, setTireType] = useState("SPORT_HARD");
  const currentConfig = configMap[suspensionType];
  const [values, setValues] = useState<TuneValues>(getDefaults(currentConfig));
  const [savedTunes, setSavedTunes] = useState<SavedTune[]>(initialSavedTunes);
  const [saving, setSaving] = useState(false);
  const [highlights, setHighlights] = useState<
    Record<string, "increase" | "decrease">
  >({});

  const handleRecommendations = useCallback(
    (h: Record<string, "increase" | "decrease">) => setHighlights(h),
    [],
  );
  const handleDismissRecommendations = useCallback(
    () => setHighlights({}),
    [],
  );
  const clearHighlight = useCallback(
    (param: string) =>
      setHighlights((prev) => {
        const next = { ...prev };
        delete next[param];
        return next;
      }),
    [],
  );

  const handleSuspensionChange = useCallback(
    (type: string | null) => {
      if (!type) return;
      setSuspensionType(type);
      setValues(getDefaults(configMap[type]));
      setHighlights({});
    },
    [configMap],
  );

  const updateValue = useCallback((key: keyof TuneValues, val: number) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setValues(getDefaults(currentConfig));
    setHighlights({});
  }, [currentConfig]);

  const isAdjustable = (minField: keyof TuneConfig) => {
    return currentConfig[minField] != null;
  };

  const saveTune = async () => {
    const name = prompt("Name your tune:");
    if (!name) return;
    setSaving(true);
    try {
      const res = await fetch("/api/tunes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          carId: car.id,
          suspensionType,
          tireType,
          ...values,
        }),
      });
      if (res.ok) {
        const tune = await res.json();
        setSavedTunes((prev) => [tune, ...prev]);
      }
    } finally {
      setSaving(false);
    }
  };

  const loadTune = (tune: SavedTune) => {
    setSuspensionType(tune.suspensionType);
    setTireType(tune.tireType);
    setValues({
      weight: tune.weight,
      horsePower: tune.horsePower,
      bodyHeightFront: tune.bodyHeightFront,
      bodyHeightRear: tune.bodyHeightRear,
      natFreqFront: tune.natFreqFront,
      natFreqRear: tune.natFreqRear,
      antiRollFront: tune.antiRollFront,
      antiRollRear: tune.antiRollRear,
      compressionFront: tune.compressionFront,
      compressionRear: tune.compressionRear,
      expansionFront: tune.expansionFront,
      expansionRear: tune.expansionRear,
      camberFront: tune.camberFront,
      camberRear: tune.camberRear,
      toeFront: tune.toeFront,
      toeRear: tune.toeRear,
      lsdInitFront: tune.lsdInitFront,
      lsdAccelFront: tune.lsdAccelFront,
      lsdDecelFront: tune.lsdDecelFront,
      lsdInitRear: tune.lsdInitRear,
      lsdAccelRear: tune.lsdAccelRear,
      lsdDecelRear: tune.lsdDecelRear,
    });
  };

  const deleteTune = async (tuneId: string) => {
    const res = await fetch(`/api/tunes/${tuneId}`, { method: "DELETE" });
    if (res.ok) {
      setSavedTunes((prev) => prev.filter((t) => t.id !== tuneId));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-lg font-bold">
            {car.manufacturer} {car.name}
          </h1>
          <Badge variant="secondary" className="text-xs">
            {car.drivetrain}
          </Badge>
        </div>
        {car.year && (
          <p className="text-xs text-muted-foreground">{car.year}</p>
        )}
      </div>

      {/* Tire Type Selector */}
      <div className="mb-4">
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          Tire Type
        </label>
        <SuspensionSelector
          value={tireType}
          availableTypes={TIRE_ORDER}
          orderArray={TIRE_ORDER}
          onChange={(v) => v && setTireType(v)}
        />
      </div>

      {/* Suspension Type Selector */}
      <div className="mb-4">
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          Suspension Type
        </label>
        <SuspensionSelector
          value={suspensionType}
          availableTypes={availableTypes}
          orderArray={SUSPENSION_ORDER}
          onChange={handleSuspensionChange}
        />
      </div>

      {/* Weight & Power */}
      <div className="mb-4 flex gap-3">
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Weight (kg)
          </label>
          <Input
            inputMode="numeric"
            pattern="[0-9]*"
            value={values.weight ?? ""}
            onChange={(e) => {
              const parsed = parseInt(e.target.value, 10);
              if (!isNaN(parsed)) updateValue("weight", parsed);
              else if (e.target.value === "") setValues((prev) => ({ ...prev, weight: null }));
            }}
          />
          {values.weight != null && (
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(values.weight * 2.20462)} lbs
            </p>
          )}
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Power (HP)
          </label>
          <Input
            inputMode="numeric"
            pattern="[0-9]*"
            value={values.horsePower ?? ""}
            onChange={(e) => {
              const parsed = parseInt(e.target.value, 10);
              if (!isNaN(parsed)) updateValue("horsePower", parsed);
              else if (e.target.value === "") setValues((prev) => ({ ...prev, horsePower: null }));
            }}
          />
        </div>
      </div>

      {/* Parameter Groups */}
      <div className="divide-y divide-border border-t border-border">
        {/* Body Height */}
        <ParameterGroup title="Body Height">
          <ParameterSlider
            label=""
            frontValue={
              values.bodyHeightFront ??
              currentConfig.bodyHeightFrontDefault ??
              100
            }
            rearValue={
              values.bodyHeightRear ??
              currentConfig.bodyHeightRearDefault ??
              100
            }
            min={currentConfig.bodyHeightFrontMin ?? 80}
            max={currentConfig.bodyHeightFrontMax ?? 130}
            step={1}
            unit="mm"
            disabled={!isAdjustable("bodyHeightFrontMin")}
            onFrontChange={(v) => updateValue("bodyHeightFront", v)}
            onRearChange={(v) => updateValue("bodyHeightRear", v)}
            frontHighlight={highlights.bodyHeightFront}
            rearHighlight={highlights.bodyHeightRear}
            onFrontHighlightClear={() => clearHighlight("bodyHeightFront")}
            onRearHighlightClear={() => clearHighlight("bodyHeightRear")}
          />
        </ParameterGroup>

        {/* Natural Frequency */}
        <ParameterGroup title="Springs / Natural Frequency">
          <ParameterSlider
            label=""
            frontValue={
              values.natFreqFront ?? currentConfig.natFreqFrontDefault ?? 2.0
            }
            rearValue={
              values.natFreqRear ?? currentConfig.natFreqRearDefault ?? 2.0
            }
            min={currentConfig.natFreqFrontMin ?? 1.0}
            max={currentConfig.natFreqFrontMax ?? 5.0}
            step={0.01}
            unit="Hz"
            disabled={!isAdjustable("natFreqFrontMin")}
            formatValue={(v) => v.toFixed(2)}
            onFrontChange={(v) => updateValue("natFreqFront", v)}
            onRearChange={(v) => updateValue("natFreqRear", v)}
            frontHighlight={highlights.natFreqFront}
            rearHighlight={highlights.natFreqRear}
            onFrontHighlightClear={() => clearHighlight("natFreqFront")}
            onRearHighlightClear={() => clearHighlight("natFreqRear")}
          />
        </ParameterGroup>

        {/* Anti-Roll Bars */}
        <ParameterGroup title="Anti-Roll Bars">
          <ParameterSlider
            label=""
            frontValue={
              values.antiRollFront ?? currentConfig.antiRollFrontDefault ?? 5
            }
            rearValue={
              values.antiRollRear ?? currentConfig.antiRollRearDefault ?? 3
            }
            min={currentConfig.antiRollFrontMin ?? 1}
            max={currentConfig.antiRollFrontMax ?? 10}
            step={1}
            unit=""
            disabled={!isAdjustable("antiRollFrontMin")}
            onFrontChange={(v) => updateValue("antiRollFront", v)}
            onRearChange={(v) => updateValue("antiRollRear", v)}
            frontHighlight={highlights.antiRollFront}
            rearHighlight={highlights.antiRollRear}
            onFrontHighlightClear={() => clearHighlight("antiRollFront")}
            onRearHighlightClear={() => clearHighlight("antiRollRear")}
          />
        </ParameterGroup>

        {/* Damping - Compression */}
        <ParameterGroup title="Damping Ratio - Compression">
          <ParameterSlider
            label=""
            frontValue={
              values.compressionFront ??
              currentConfig.compressionFrontDefault ??
              30
            }
            rearValue={
              values.compressionRear ??
              currentConfig.compressionRearDefault ??
              30
            }
            min={currentConfig.compressionFrontMin ?? 20}
            max={currentConfig.compressionFrontMax ?? 40}
            step={1}
            unit=""
            disabled={!isAdjustable("compressionFrontMin")}
            onFrontChange={(v) => updateValue("compressionFront", v)}
            onRearChange={(v) => updateValue("compressionRear", v)}
            frontHighlight={highlights.compressionFront}
            rearHighlight={highlights.compressionRear}
            onFrontHighlightClear={() => clearHighlight("compressionFront")}
            onRearHighlightClear={() => clearHighlight("compressionRear")}
          />
        </ParameterGroup>

        {/* Damping - Expansion */}
        <ParameterGroup title="Damping Ratio - Expansion">
          <ParameterSlider
            label=""
            frontValue={
              values.expansionFront ?? currentConfig.expansionFrontDefault ?? 40
            }
            rearValue={
              values.expansionRear ?? currentConfig.expansionRearDefault ?? 40
            }
            min={currentConfig.expansionFrontMin ?? 30}
            max={currentConfig.expansionFrontMax ?? 50}
            step={1}
            unit=""
            disabled={!isAdjustable("expansionFrontMin")}
            onFrontChange={(v) => updateValue("expansionFront", v)}
            onRearChange={(v) => updateValue("expansionRear", v)}
            frontHighlight={highlights.expansionFront}
            rearHighlight={highlights.expansionRear}
            onFrontHighlightClear={() => clearHighlight("expansionFront")}
            onRearHighlightClear={() => clearHighlight("expansionRear")}
          />
        </ParameterGroup>

        {/* Camber */}
        <ParameterGroup title="Camber Angle">
          <ParameterSlider
            label=""
            frontValue={
              values.camberFront ?? currentConfig.camberFrontDefault ?? 0
            }
            rearValue={
              values.camberRear ?? currentConfig.camberRearDefault ?? 0
            }
            min={currentConfig.camberFrontMin ?? 0}
            max={currentConfig.camberFrontMax ?? 5.0}
            step={0.1}
            unit={"\u00B0"}
            disabled={!isAdjustable("camberFrontMin")}
            formatValue={(v) => `-${v.toFixed(1)}`}
            onFrontChange={(v) => updateValue("camberFront", v)}
            onRearChange={(v) => updateValue("camberRear", v)}
            frontHighlight={highlights.camberFront}
            rearHighlight={highlights.camberRear}
            onFrontHighlightClear={() => clearHighlight("camberFront")}
            onRearHighlightClear={() => clearHighlight("camberRear")}
          />
        </ParameterGroup>

        {/* Toe */}
        <ParameterGroup title="Toe Angle">
          <ParameterSlider
            label=""
            frontValue={values.toeFront ?? currentConfig.toeFrontDefault ?? 0}
            rearValue={values.toeRear ?? currentConfig.toeRearDefault ?? 0}
            min={currentConfig.toeFrontMin ?? -0.5}
            max={currentConfig.toeFrontMax ?? 0.5}
            step={0.01}
            unit={"\u00B0"}
            disabled={!isAdjustable("toeFrontMin")}
            formatValue={(v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))}
            onFrontChange={(v) => updateValue("toeFront", v)}
            onRearChange={(v) => updateValue("toeRear", v)}
            frontHighlight={highlights.toeFront}
            rearHighlight={highlights.toeRear}
            onFrontHighlightClear={() => clearHighlight("toeFront")}
            onRearHighlightClear={() => clearHighlight("toeRear")}
          />
        </ParameterGroup>

        {/* LSD */}
        <ParameterGroup title="LSD">
          <div className="space-y-3">
            {!["FR", "MR", "RR"].includes(car.drivetrain) && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Front</p>
                <StepperRow
                  label="Init"
                  value={values.lsdInitFront ?? currentConfig.lsdInitFrontDefault ?? 10}
                  min={0}
                  max={60}
                  step={5}
                  unit=""
                  disabled={false}
                  formatValue={(v) => `${v}`}
                  onChange={(v) => updateValue("lsdInitFront", v)}
                  highlight={highlights.lsdInitFront}
                  onHighlightClear={() => clearHighlight("lsdInitFront")}
                />
                <StepperRow
                  label="Accel"
                  value={values.lsdAccelFront ?? currentConfig.lsdAccelFrontDefault ?? 20}
                  min={0}
                  max={60}
                  step={5}
                  unit=""
                  disabled={false}
                  formatValue={(v) => `${v}`}
                  onChange={(v) => updateValue("lsdAccelFront", v)}
                  highlight={highlights.lsdAccelFront}
                  onHighlightClear={() => clearHighlight("lsdAccelFront")}
                />
                <StepperRow
                  label="Decel"
                  value={values.lsdDecelFront ?? currentConfig.lsdDecelFrontDefault ?? 15}
                  min={0}
                  max={60}
                  step={5}
                  unit=""
                  disabled={false}
                  formatValue={(v) => `${v}`}
                  onChange={(v) => updateValue("lsdDecelFront", v)}
                  highlight={highlights.lsdDecelFront}
                  onHighlightClear={() => clearHighlight("lsdDecelFront")}
                />
              </div>
            )}
            {car.drivetrain !== "FF" && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Rear</p>
                <StepperRow
                  label="Init"
                  value={values.lsdInitRear ?? currentConfig.lsdInitRearDefault ?? 10}
                  min={0}
                  max={60}
                  step={5}
                  unit=""
                  disabled={false}
                  formatValue={(v) => `${v}`}
                  onChange={(v) => updateValue("lsdInitRear", v)}
                  highlight={highlights.lsdInitRear}
                  onHighlightClear={() => clearHighlight("lsdInitRear")}
                />
                <StepperRow
                  label="Accel"
                  value={values.lsdAccelRear ?? currentConfig.lsdAccelRearDefault ?? 20}
                  min={0}
                  max={60}
                  step={5}
                  unit=""
                  disabled={false}
                  formatValue={(v) => `${v}`}
                  onChange={(v) => updateValue("lsdAccelRear", v)}
                  highlight={highlights.lsdAccelRear}
                  onHighlightClear={() => clearHighlight("lsdAccelRear")}
                />
                <StepperRow
                  label="Decel"
                  value={values.lsdDecelRear ?? currentConfig.lsdDecelRearDefault ?? 15}
                  min={0}
                  max={60}
                  step={5}
                  unit=""
                  disabled={false}
                  formatValue={(v) => `${v}`}
                  onChange={(v) => updateValue("lsdDecelRear", v)}
                  highlight={highlights.lsdDecelRear}
                  onHighlightClear={() => clearHighlight("lsdDecelRear")}
                />
              </div>
            )}
          </div>
        </ParameterGroup>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6">
        <Button onClick={saveTune} disabled={saving} className="flex-1">
          {saving ? "Saving..." : "Save Tune"}
        </Button>
        <SavedTunesSheet
          tunes={savedTunes}
          onLoad={loadTune}
          onDelete={deleteTune}
        />
        <Button variant="outline" onClick={resetToDefaults}>
          Reset
        </Button>
      </div>

      {/* Bottom padding for fixed advisor bar */}
      <div className="pb-24" />

      {/* Tuning Advisor */}
      <TuningAdvisor
        onRecommendations={handleRecommendations}
        onDismiss={handleDismissRecommendations}
      />
    </div>
  );
}
