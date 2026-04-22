"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { X, Lightbulb } from "lucide-react";
import {
  getRecommendations,
  type Symptom,
  type Phase,
  type CornerSpeed,
  type ThrottleState,
  type Elevation,
  type Drivetrain,
} from "@/lib/tuning-rules";

const PARAM_LABELS: Record<string, string> = {
  bodyHeightFront: "Body Height F",
  bodyHeightRear: "Body Height R",
  natFreqFront: "Springs F",
  natFreqRear: "Springs R",
  antiRollFront: "Anti-Roll F",
  antiRollRear: "Anti-Roll R",
  compressionFront: "Compression F",
  compressionRear: "Compression R",
  expansionFront: "Expansion F",
  expansionRear: "Expansion R",
  camberFront: "Camber F",
  camberRear: "Camber R",
  toeFront: "Toe F",
  toeRear: "Toe R",
  lsdInitFront: "LSD Init F",
  lsdAccelFront: "LSD Accel F",
  lsdDecelFront: "LSD Decel F",
  lsdInitRear: "LSD Init R",
  lsdAccelRear: "LSD Accel R",
  lsdDecelRear: "LSD Decel R",
  torqueDistribution: "Torque Dist",
};

interface TuningAdvisorProps {
  drivetrain: Drivetrain;
  onRecommendations: (
    highlights: Record<string, "increase" | "decrease">,
  ) => void;
  onDismiss: () => void;
}

export function TuningAdvisor({
  drivetrain,
  onRecommendations,
  onDismiss,
}: TuningAdvisorProps) {
  const [symptom, setSymptom] = useState<Symptom | null>(null);
  const [phase, setPhase] = useState<Phase | null>(null);
  const [speed, setSpeed] = useState<CornerSpeed | null>(null);
  const [throttle, setThrottle] = useState<ThrottleState | null>(null);
  const [elevation, setElevation] = useState<Elevation | null>(null);
  const [results, setResults] = useState<Record<
    string,
    "increase" | "decrease"
  > | null>(null);

  const handleAdvise = useCallback(() => {
    if (!symptom) return;
    const recs = getRecommendations(symptom, phase, speed, throttle, elevation, drivetrain);
    setResults(recs);
    onRecommendations(recs);
  }, [symptom, phase, speed, throttle, elevation, drivetrain, onRecommendations]);

  const handleDismiss = useCallback(() => {
    setResults(null);
    onDismiss();
  }, [onDismiss]);

  const handleReset = useCallback(() => {
    setSymptom(null);
    setPhase(null);
    setSpeed(null);
    setThrottle(null);
    setElevation(null);
    setResults(null);
    onDismiss();
  }, [onDismiss]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Results card */}
      {results && Object.keys(results).length > 0 && (
        <div className="mx-auto max-w-lg px-4 pb-2">
          <div className="rounded-lg border bg-background shadow-lg p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground mb-1.5">
                  Try adjusting:
                </p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(results).map(([param, direction]) => (
                    <span
                      key={param}
                      className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                        direction === "increase"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {direction === "increase" ? "+" : "\u2212"}{" "}
                      {PARAM_LABELS[param] ?? param}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={handleDismiss}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Selector bar */}
      <div className="border-t bg-background px-4 py-3">
        <div className="mx-auto max-w-lg">
          <div className="space-y-1.5">
            {/* Row 1: Symptom + Lightbulb + X */}
            <div className="flex gap-1.5 items-center">
              <Select
                value={symptom ?? ""}
                onValueChange={(v) => {
                  setSymptom(v as Symptom);
                  setResults(null);
                  onDismiss();
                }}
              >
                <SelectTrigger className="flex-1 h-9 text-xs">
                  {symptom === "snap-oversteer"
                    ? "Snap OS"
                    : symptom
                      ? symptom.charAt(0).toUpperCase() + symptom.slice(1)
                      : "Symptom"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="understeer">Understeer</SelectItem>
                  <SelectItem value="oversteer">Oversteer</SelectItem>
                  <SelectItem value="snap-oversteer">Snap Oversteer</SelectItem>
                  <SelectItem value="instability">Instability</SelectItem>
                </SelectContent>
              </Select>

              <Button
                size="icon"
                className="h-9 w-9 shrink-0"
                disabled={!symptom}
                onClick={handleAdvise}
              >
                <Lightbulb className="h-4 w-4" />
              </Button>

              {results && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={handleReset}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Row 2: Phase + Speed */}
            <div className="flex gap-1.5 items-center">
              <Select
                value={phase ?? "none"}
                onValueChange={(v) => {
                  setPhase(v === "none" ? null : (v as Phase));
                  setResults(null);
                  onDismiss();
                }}
              >
                <SelectTrigger className="flex-1 h-9 text-xs">
                  {phase
                    ? phase.charAt(0).toUpperCase() + phase.slice(1)
                    : "Phase"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Any</SelectItem>
                  <SelectItem value="entry">Entry</SelectItem>
                  <SelectItem value="mid">Mid</SelectItem>
                  <SelectItem value="exit">Exit</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={speed ?? "none"}
                onValueChange={(v) => {
                  setSpeed(v === "none" ? null : (v as CornerSpeed));
                  setResults(null);
                  onDismiss();
                }}
              >
                <SelectTrigger className="flex-1 h-9 text-xs">
                  {speed
                    ? speed.charAt(0).toUpperCase() + speed.slice(1)
                    : "Speed"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Any</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Row 3: Input + Elevation */}
            <div className="flex gap-1.5 items-center">
              <Select
                value={throttle ?? "none"}
                onValueChange={(v) => {
                  setThrottle(v === "none" ? null : (v as ThrottleState));
                  setResults(null);
                  onDismiss();
                }}
              >
                <SelectTrigger className="flex-1 h-9 text-xs">
                  {throttle
                    ? throttle === "on-throttle"
                      ? "On"
                      : throttle === "off-throttle"
                        ? "Off"
                        : "Brake"
                    : "Input"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Any</SelectItem>
                  <SelectItem value="on-throttle">On-Throttle</SelectItem>
                  <SelectItem value="off-throttle">Off-Throttle</SelectItem>
                  <SelectItem value="braking">Braking</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={elevation ?? "none"}
                onValueChange={(v) => {
                  setElevation(v === "none" ? null : (v as Elevation));
                  setResults(null);
                  onDismiss();
                }}
              >
                <SelectTrigger className="flex-1 h-9 text-xs">
                  {elevation
                    ? elevation.charAt(0).toUpperCase() + elevation.slice(1)
                    : "Elev."}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Any</SelectItem>
                  <SelectItem value="up">Uphill</SelectItem>
                  <SelectItem value="down">Downhill</SelectItem>
                  <SelectItem value="neutral">Flat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
