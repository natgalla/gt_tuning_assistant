"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { SuspensionSelector } from "@/components/selector";
import { CarSelector, type CatalogCar } from "@/components/car-selector";
import { ParameterGroup } from "@/components/parameter-group";
import { ParameterSlider, StepperRow } from "@/components/parameter-slider";
import { SavedTunesSheet } from "@/components/saved-tunes-sheet";
import { TuningAdvisor } from "@/components/tuning-advisor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { SUSPENSION_ORDER, TIRE_ORDER } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { GT7_TRACKS } from "@/lib/tracks";
import type { Drivetrain } from "@/lib/tuning-rules";
import { getTuningTips, type TuningTip } from "@/lib/tuning-tips";

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
  torqueDistribution: number | null;
}

export interface SavedTune extends TuneValues {
  id: string;
  name: string;
  tireType: string;
  suspensionType: string;
  createdAt: string;
  carId?: number | null;
  carName?: string | null;
  track?: string | null;
  bestLap?: string | null;
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
    torqueDistribution: null,
  };
}

const FREEHAND_DEFAULTS: TuneValues = {
  weight: null,
  horsePower: null,
  bodyHeightFront: 100,
  bodyHeightRear: 100,
  natFreqFront: 2.0,
  natFreqRear: 2.0,
  antiRollFront: 4,
  antiRollRear: 4,
  compressionFront: 30,
  compressionRear: 30,
  expansionFront: 40,
  expansionRear: 40,
  camberFront: 3,
  camberRear: 3,
  toeFront: 0,
  toeRear: 0.2,
  lsdInitFront: 10,
  lsdAccelFront: 20,
  lsdDecelFront: 15,
  lsdInitRear: 10,
  lsdAccelRear: 20,
  lsdDecelRear: 15,
  torqueDistribution: 40,
};

const FREEHAND_RANGES = {
  bodyHeightFrontMin: 60,
  bodyHeightFrontMax: 200,
  bodyHeightRearMin: 60,
  bodyHeightRearMax: 200,
  natFreqFrontMin: 0.5,
  natFreqFrontMax: 6.0,
  natFreqRearMin: 0.5,
  natFreqRearMax: 6.0,
  antiRollFrontMin: 1,
  antiRollFrontMax: 10,
  antiRollRearMin: 1,
  antiRollRearMax: 10,
  compressionFrontMin: 0,
  compressionFrontMax: 60,
  compressionRearMin: 0,
  compressionRearMax: 60,
  expansionFrontMin: 0,
  expansionFrontMax: 60,
  expansionRearMin: 0,
  expansionRearMax: 60,
  camberFrontMin: 0,
  camberFrontMax: 5.0,
  camberRearMin: 0,
  camberRearMax: 5.0,
  toeFrontMin: -1.0,
  toeFrontMax: 1.0,
  toeRearMin: -1.0,
  toeRearMax: 1.0,
};

const ADJUSTABLE_SUSPENSIONS = [
  "HEIGHT_ADJUSTABLE_SPORT",
  "FULLY_CUSTOMIZABLE",
];

// Build flat track list for selector
const TRACK_LIST = GT7_TRACKS.flatMap((v) =>
  v.layouts.map((l) =>
    v.layouts.length === 1 ? v.venue : `${v.venue} - ${l}`,
  ),
);

interface TuneEditorProps {
  car: Car | null;
  configs: TuneConfig[];
  savedTunes: SavedTune[];
}

export function TuneEditor({
  car,
  configs,
  savedTunes: initialSavedTunes,
}: TuneEditorProps) {
  const { user } = useAuth();
  const isFreehand = car === null;

  const configMap = Object.fromEntries(
    configs.map((c) => [c.suspensionType, c]),
  );
  const availableTypes = isFreehand
    ? ADJUSTABLE_SUSPENSIONS
    : configs
        .map((c) => c.suspensionType)
        .filter((t) => ADJUSTABLE_SUSPENSIONS.includes(t));

  const [suspensionType, setSuspensionType] = useState(
    availableTypes.includes("FULLY_CUSTOMIZABLE")
      ? "FULLY_CUSTOMIZABLE"
      : availableTypes[0],
  );
  const [tireType, setTireType] = useState("SPORT_HARD");
  const currentConfig = isFreehand ? null : configMap[suspensionType];
  const [values, setValues] = useState<TuneValues>(
    isFreehand ? { ...FREEHAND_DEFAULTS } : getDefaults(currentConfig!),
  );
  const [savedTunes, setSavedTunes] = useState<SavedTune[]>(initialSavedTunes);
  const [saving, setSaving] = useState(false);
  const [highlights, setHighlights] = useState<
    Record<string, "increase" | "decrease">
  >({});

  // Save dialog state
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [tuneName, setTuneName] = useState("");

  // Freehand-specific state
  const [selectedCar, setSelectedCar] = useState<CatalogCar | null>(null);
  const [carName, setCarName] = useState("");
  const [drivetrain, setDrivetrain] = useState<Drivetrain>("FR");
  const [track, setTrack] = useState("");
  const [bestLap, setBestLap] = useState("");

  // Car list for restoring selection on load
  const [carList, setCarList] = useState<CatalogCar[]>([]);

  // Fetch user's tunes in freehand mode when authenticated
  useEffect(() => {
    if (!isFreehand || !user) return;
    fetch("/api/tunes")
      .then((res) => res.json())
      .then((tunes) => setSavedTunes(tunes))
      .catch(() => {});
  }, [isFreehand, user]);

  // Fetch car list for restoring selection on tune load
  useEffect(() => {
    if (!isFreehand) return;
    fetch("/api/cars?fields=catalog")
      .then((res) => res.json())
      .then((data) => setCarList(data))
      .catch(() => {});
  }, [isFreehand]);

  const handleCarSelect = useCallback((selected: CatalogCar | null) => {
    setSelectedCar(selected);
    if (selected) {
      setCarName(`${selected.manufacturer} ${selected.name}`);
      setDrivetrain(selected.drivetrain as Drivetrain);
      setValues((prev) => ({
        ...prev,
        weight: selected.weight,
        horsePower: selected.horsePower,
      }));
    } else {
      setCarName("");
      setDrivetrain("FR");
      setValues((prev) => ({ ...prev, weight: null, horsePower: null }));
    }
  }, []);

  const effectiveDrivetrain =
    (car?.drivetrain as Drivetrain | undefined) ?? drivetrain;

  const tipsByParam = useMemo(() => {
    const tips = getTuningTips(values, tireType, effectiveDrivetrain);
    const map: Record<string, TuningTip> = {};
    for (const tip of tips) {
      // Keep first (highest-severity, since sorted warnings-first)
      if (!map[tip.parameter]) {
        map[tip.parameter] = tip;
      }
    }
    return map;
  }, [values, tireType, effectiveDrivetrain]);

  const handleRecommendations = useCallback(
    (h: Record<string, "increase" | "decrease">) => setHighlights(h),
    [],
  );
  const handleDismissRecommendations = useCallback(() => setHighlights({}), []);
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
      if (!isFreehand) {
        setValues(getDefaults(configMap[type]));
      }
      if (type === "HEIGHT_ADJUSTABLE_SPORT") {
        setValues((prev) => ({ ...prev, toeFront: 0, toeRear: 0.2 }));
      }
      setHighlights({});
    },
    [configMap, isFreehand],
  );

  const updateValue = useCallback((key: keyof TuneValues, val: number) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  }, []);

  const resetToDefaults = useCallback(() => {
    if (isFreehand) {
      setValues({ ...FREEHAND_DEFAULTS });
      setSelectedCar(null);
      setCarName("");
      setDrivetrain("FR");
    } else {
      setValues(getDefaults(currentConfig!));
    }
    setHighlights({});
  }, [currentConfig, isFreehand]);

  const getRange = (param: string, side: "Min" | "Max") => {
    const key = `${param}${side}` as keyof typeof FREEHAND_RANGES;
    if (isFreehand) return FREEHAND_RANGES[key] ?? 0;
    const configKey = key as keyof TuneConfig;
    return (currentConfig![configKey] as number) ?? 0;
  };

  const isAdjustable = (minField: keyof TuneConfig) => {
    if (isFreehand) return true;
    return currentConfig![minField] != null;
  };

  const saveTune = async (name: string) => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name,
        suspensionType,
        tireType,
        ...values,
      };
      if (isFreehand) {
        payload.carName = carName || "Unnamed Car";
        if (selectedCar) payload.carId = selectedCar.id;
      } else {
        payload.carId = car!.id;
      }
      if (track) {
        payload.track = track;
        if (bestLap) payload.bestLap = bestLap;
      }
      const res = await fetch("/api/tunes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      torqueDistribution: tune.torqueDistribution,
    });
    if (isFreehand) {
      if (tune.carId) {
        const found = carList.find((c) => c.id === tune.carId) ?? null;
        setSelectedCar(found);
        if (found) setDrivetrain(found.drivetrain as Drivetrain);
      } else {
        setSelectedCar(null);
      }
      if (tune.carName) setCarName(tune.carName);
    }
    if (tune.track) setTrack(tune.track);
    if (tune.bestLap) setBestLap(tune.bestLap);
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
        {isFreehand ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Car
              </label>
              <CarSelector value={selectedCar} onSelect={handleCarSelect} />
            </div>
            {selectedCar && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {drivetrain}
                </Badge>
                {selectedCar.year && (
                  <span className="text-xs text-muted-foreground">
                    {selectedCar.year}
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
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
          </>
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

      {/* Track Selector */}
      <div className="mb-4">
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          Track
        </label>
        <SuspensionSelector
          value={track || "_none"}
          availableTypes={["_none", ...TRACK_LIST]}
          orderArray={["_none", ...TRACK_LIST]}
          onChange={(v) => {
            setTrack(v === "_none" ? "" : (v ?? ""));
            if (v === "_none" || !v) setBestLap("");
          }}
          formatLabel={(v) => (v === "_none" ? "None" : v)}
        />
      </div>

      {/* Best Lap */}
      {track && (
        <div className="mb-4">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Best Lap Time
          </label>
          <Input
            placeholder="e.g. 1:42.350"
            value={bestLap}
            onChange={(e) => setBestLap(e.target.value)}
          />
        </div>
      )}

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
              else if (e.target.value === "")
                setValues((prev) => ({ ...prev, weight: null }));
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
              else if (e.target.value === "")
                setValues((prev) => ({ ...prev, horsePower: null }));
            }}
          />
        </div>
      </div>

      {/* Parameter Groups */}
      <div className="divide-y divide-border border-t border-border">
        {/* Body Height */}
        <ParameterGroup
          title="Body Height"
          discrepancyTip={tipsByParam.discrepancy_bodyHeight?.message}
          discrepancyTipSeverity={tipsByParam.discrepancy_bodyHeight?.severity}
        >
          <ParameterSlider
            label=""
            frontValue={values.bodyHeightFront ?? 100}
            rearValue={values.bodyHeightRear ?? 100}
            min={getRange("bodyHeightFront", "Min")}
            max={getRange("bodyHeightFront", "Max")}
            step={1}
            unit="mm"
            disabled={!isAdjustable("bodyHeightFrontMin")}
            onFrontChange={(v) => updateValue("bodyHeightFront", v)}
            onRearChange={(v) => updateValue("bodyHeightRear", v)}
            frontHighlight={highlights.bodyHeightFront}
            rearHighlight={highlights.bodyHeightRear}
            onFrontHighlightClear={() => clearHighlight("bodyHeightFront")}
            onRearHighlightClear={() => clearHighlight("bodyHeightRear")}
            frontTip={tipsByParam.bodyHeightFront?.message}
            frontTipSeverity={tipsByParam.bodyHeightFront?.severity}
            rearTip={tipsByParam.bodyHeightRear?.message}
            rearTipSeverity={tipsByParam.bodyHeightRear?.severity}
          />
        </ParameterGroup>

        {/* Natural Frequency */}
        <ParameterGroup
          title="Springs / Natural Frequency"
          discrepancyTip={tipsByParam.discrepancy_natFreq?.message}
          discrepancyTipSeverity={tipsByParam.discrepancy_natFreq?.severity}
        >
          <ParameterSlider
            label=""
            frontValue={values.natFreqFront ?? 2.0}
            rearValue={values.natFreqRear ?? 2.0}
            min={getRange("natFreqFront", "Min")}
            max={getRange("natFreqFront", "Max")}
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
            frontTip={tipsByParam.natFreqFront?.message}
            frontTipSeverity={tipsByParam.natFreqFront?.severity}
            rearTip={tipsByParam.natFreqRear?.message}
            rearTipSeverity={tipsByParam.natFreqRear?.severity}
          />
        </ParameterGroup>

        {/* Anti-Roll Bars */}
        <ParameterGroup
          title="Anti-Roll Bars"
          discrepancyTip={tipsByParam.discrepancy_antiRoll?.message}
          discrepancyTipSeverity={tipsByParam.discrepancy_antiRoll?.severity}
        >
          <ParameterSlider
            label=""
            frontValue={values.antiRollFront ?? 5}
            rearValue={values.antiRollRear ?? 3}
            min={getRange("antiRollFront", "Min")}
            max={getRange("antiRollFront", "Max")}
            step={1}
            unit=""
            disabled={!isAdjustable("antiRollFrontMin")}
            onFrontChange={(v) => updateValue("antiRollFront", v)}
            onRearChange={(v) => updateValue("antiRollRear", v)}
            frontHighlight={highlights.antiRollFront}
            rearHighlight={highlights.antiRollRear}
            onFrontHighlightClear={() => clearHighlight("antiRollFront")}
            onRearHighlightClear={() => clearHighlight("antiRollRear")}
            frontTip={tipsByParam.antiRollFront?.message}
            frontTipSeverity={tipsByParam.antiRollFront?.severity}
            rearTip={tipsByParam.antiRollRear?.message}
            rearTipSeverity={tipsByParam.antiRollRear?.severity}
          />
        </ParameterGroup>

        {/* Damping - Compression */}
        <ParameterGroup
          title="Damping Ratio - Compression"
          discrepancyTip={tipsByParam.discrepancy_compression?.message}
          discrepancyTipSeverity={tipsByParam.discrepancy_compression?.severity}
        >
          <ParameterSlider
            label=""
            frontValue={values.compressionFront ?? 30}
            rearValue={values.compressionRear ?? 30}
            min={getRange("compressionFront", "Min")}
            max={getRange("compressionFront", "Max")}
            step={1}
            unit=""
            disabled={!isAdjustable("compressionFrontMin")}
            onFrontChange={(v) => updateValue("compressionFront", v)}
            onRearChange={(v) => updateValue("compressionRear", v)}
            frontHighlight={highlights.compressionFront}
            rearHighlight={highlights.compressionRear}
            onFrontHighlightClear={() => clearHighlight("compressionFront")}
            onRearHighlightClear={() => clearHighlight("compressionRear")}
            frontTip={tipsByParam.compressionFront?.message}
            frontTipSeverity={tipsByParam.compressionFront?.severity}
            rearTip={tipsByParam.compressionRear?.message}
            rearTipSeverity={tipsByParam.compressionRear?.severity}
          />
        </ParameterGroup>

        {/* Damping - Expansion */}
        <ParameterGroup
          title="Damping Ratio - Expansion"
          discrepancyTip={tipsByParam.discrepancy_expansion?.message}
          discrepancyTipSeverity={tipsByParam.discrepancy_expansion?.severity}
        >
          <ParameterSlider
            label=""
            frontValue={values.expansionFront ?? 40}
            rearValue={values.expansionRear ?? 40}
            min={getRange("expansionFront", "Min")}
            max={getRange("expansionFront", "Max")}
            step={1}
            unit=""
            disabled={!isAdjustable("expansionFrontMin")}
            onFrontChange={(v) => updateValue("expansionFront", v)}
            onRearChange={(v) => updateValue("expansionRear", v)}
            frontHighlight={highlights.expansionFront}
            rearHighlight={highlights.expansionRear}
            onFrontHighlightClear={() => clearHighlight("expansionFront")}
            onRearHighlightClear={() => clearHighlight("expansionRear")}
            frontTip={tipsByParam.expansionFront?.message}
            frontTipSeverity={tipsByParam.expansionFront?.severity}
            rearTip={tipsByParam.expansionRear?.message}
            rearTipSeverity={tipsByParam.expansionRear?.severity}
          />
        </ParameterGroup>

        {/* Camber */}
        <ParameterGroup
          title="Camber Angle"
          discrepancyTip={tipsByParam.discrepancy_camber?.message}
          discrepancyTipSeverity={tipsByParam.discrepancy_camber?.severity}
        >
          <ParameterSlider
            label=""
            frontValue={values.camberFront ?? 0}
            rearValue={values.camberRear ?? 0}
            min={getRange("camberFront", "Min")}
            max={getRange("camberFront", "Max")}
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
            frontTip={tipsByParam.camberFront?.message}
            frontTipSeverity={tipsByParam.camberFront?.severity}
            rearTip={tipsByParam.camberRear?.message}
            rearTipSeverity={tipsByParam.camberRear?.severity}
          />
        </ParameterGroup>

        {/* Toe */}
        <ParameterGroup title="Toe Angle">
          <ParameterSlider
            label=""
            frontValue={
              suspensionType === "HEIGHT_ADJUSTABLE_SPORT"
                ? 0
                : (values.toeFront ?? 0)
            }
            rearValue={
              suspensionType === "HEIGHT_ADJUSTABLE_SPORT"
                ? 0.2
                : (values.toeRear ?? 0)
            }
            min={getRange("toeFront", "Min")}
            max={getRange("toeFront", "Max")}
            step={0.01}
            unit={"\u00B0"}
            disabled={
              suspensionType === "HEIGHT_ADJUSTABLE_SPORT" ||
              !isAdjustable("toeFrontMin")
            }
            formatValue={(v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))}
            onFrontChange={(v) => updateValue("toeFront", v)}
            onRearChange={(v) => updateValue("toeRear", v)}
            frontHighlight={highlights.toeFront}
            rearHighlight={highlights.toeRear}
            onFrontHighlightClear={() => clearHighlight("toeFront")}
            onRearHighlightClear={() => clearHighlight("toeRear")}
            frontTip={tipsByParam.toeFront?.message}
            frontTipSeverity={tipsByParam.toeFront?.severity}
            rearTip={tipsByParam.toeRear?.message}
            rearTipSeverity={tipsByParam.toeRear?.severity}
          />
        </ParameterGroup>

        {/* LSD */}
        <ParameterGroup title="LSD">
          <div className="space-y-3">
            {effectiveDrivetrain === "4WD" && (
              <StepperRow
                label="Torque"
                value={values.torqueDistribution ?? 40}
                min={5}
                max={95}
                step={5}
                unit=""
                disabled={false}
                formatValue={(v) => `${v}:${100 - v}`}
                onChange={(v) => updateValue("torqueDistribution", v)}
                highlight={highlights.torqueDistribution}
                onHighlightClear={() => clearHighlight("torqueDistribution")}
                tip={tipsByParam.torqueDistribution?.message}
                tipSeverity={tipsByParam.torqueDistribution?.severity}
              />
            )}
            {!["FR", "MR", "RR"].includes(effectiveDrivetrain) && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Front
                </p>
                <StepperRow
                  label="Init"
                  value={values.lsdInitFront ?? 10}
                  min={0}
                  max={60}
                  step={1}
                  unit=""
                  disabled={false}
                  formatValue={(v) => `${v}`}
                  onChange={(v) => updateValue("lsdInitFront", v)}
                  highlight={highlights.lsdInitFront}
                  onHighlightClear={() => clearHighlight("lsdInitFront")}
                  tip={tipsByParam.lsdInitFront?.message}
                  tipSeverity={tipsByParam.lsdInitFront?.severity}
                />
                <StepperRow
                  label="Accel"
                  value={values.lsdAccelFront ?? 20}
                  min={0}
                  max={60}
                  step={1}
                  unit=""
                  disabled={false}
                  formatValue={(v) => `${v}`}
                  onChange={(v) => updateValue("lsdAccelFront", v)}
                  highlight={highlights.lsdAccelFront}
                  onHighlightClear={() => clearHighlight("lsdAccelFront")}
                  tip={tipsByParam.lsdAccelFront?.message}
                  tipSeverity={tipsByParam.lsdAccelFront?.severity}
                />
                <StepperRow
                  label="Decel"
                  value={values.lsdDecelFront ?? 15}
                  min={0}
                  max={60}
                  step={1}
                  unit=""
                  disabled={false}
                  formatValue={(v) => `${v}`}
                  onChange={(v) => updateValue("lsdDecelFront", v)}
                  highlight={highlights.lsdDecelFront}
                  onHighlightClear={() => clearHighlight("lsdDecelFront")}
                  tip={tipsByParam.lsdDecelFront?.message}
                  tipSeverity={tipsByParam.lsdDecelFront?.severity}
                />
              </div>
            )}
            {effectiveDrivetrain !== "FF" && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Rear
                </p>
                <StepperRow
                  label="Init"
                  value={values.lsdInitRear ?? 10}
                  min={0}
                  max={60}
                  step={1}
                  unit=""
                  disabled={false}
                  formatValue={(v) => `${v}`}
                  onChange={(v) => updateValue("lsdInitRear", v)}
                  highlight={highlights.lsdInitRear}
                  onHighlightClear={() => clearHighlight("lsdInitRear")}
                  tip={tipsByParam.lsdInitRear?.message}
                  tipSeverity={tipsByParam.lsdInitRear?.severity}
                />
                <StepperRow
                  label="Accel"
                  value={values.lsdAccelRear ?? 20}
                  min={0}
                  max={60}
                  step={1}
                  unit=""
                  disabled={false}
                  formatValue={(v) => `${v}`}
                  onChange={(v) => updateValue("lsdAccelRear", v)}
                  highlight={highlights.lsdAccelRear}
                  onHighlightClear={() => clearHighlight("lsdAccelRear")}
                  tip={tipsByParam.lsdAccelRear?.message}
                  tipSeverity={tipsByParam.lsdAccelRear?.severity}
                />
                <StepperRow
                  label="Decel"
                  value={values.lsdDecelRear ?? 15}
                  min={0}
                  max={60}
                  step={1}
                  unit=""
                  disabled={false}
                  formatValue={(v) => `${v}`}
                  onChange={(v) => updateValue("lsdDecelRear", v)}
                  highlight={highlights.lsdDecelRear}
                  onHighlightClear={() => clearHighlight("lsdDecelRear")}
                  tip={tipsByParam.lsdDecelRear?.message}
                  tipSeverity={tipsByParam.lsdDecelRear?.severity}
                />
              </div>
            )}
          </div>
        </ParameterGroup>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6 mb-10">
        <Button
          onClick={() => {
            setTuneName("");
            setSaveDialogOpen(true);
          }}
          disabled={saving || !user}
          className="flex-1"
        >
          {saving ? "Saving..." : "Save Tune"}
        </Button>
        <SavedTunesSheet
          tunes={savedTunes}
          onLoad={loadTune}
          onDelete={deleteTune}
          disabled={!user}
        />
        <Button variant="outline" onClick={resetToDefaults}>
          Reset
        </Button>
      </div>
      {!user && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Log in to save and load tunes
        </p>
      )}

      {/* Save Tune Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Name your tune</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!tuneName.trim()) return;
              setSaveDialogOpen(false);
              saveTune(tuneName.trim());
            }}
          >
            <Input
              autoFocus
              placeholder="e.g. Nordschleife low downforce"
              value={tuneName}
              onChange={(e) => setTuneName(e.target.value)}
            />
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={!tuneName.trim()}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bottom padding for fixed advisor bar */}
      <div className="pb-24" />

      {/* Tuning Advisor */}
      <TuningAdvisor
        drivetrain={effectiveDrivetrain}
        onRecommendations={handleRecommendations}
        onDismiss={handleDismissRecommendations}
      />
    </div>
  );
}
