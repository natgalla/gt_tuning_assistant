import type { Drivetrain } from "./tuning-rules";

export type TireCategory =
  | "comfort"
  | "sport"
  | "racing"
  | "weather"
  | "offroad";

export interface BaseTunePreset {
  tireCategory: TireCategory;
  drivetrain: Drivetrain;
  label: string;

  // Ride height as fraction of car's range (0 = min, 1 = max)
  bodyHeightFrontPct: number;
  bodyHeightRearPct: number;

  // Absolute values (universal ranges)
  natFreqFront: number;
  natFreqRear: number;
  antiRollFront: number;
  antiRollRear: number;
  compressionFront: number;
  compressionRear: number;
  expansionFront: number;
  expansionRear: number;
  camberFront: number;
  camberRear: number;
  toeFront: number;
  toeRear: number;

  // LSD — only relevant fields per drivetrain
  lsdInitFront?: number;
  lsdAccelFront?: number;
  lsdDecelFront?: number;
  lsdInitRear?: number;
  lsdAccelRear?: number;
  lsdDecelRear?: number;
  torqueDistribution?: number; // 4WD only
}

export const TIRE_CATEGORY_MAP: Record<string, TireCategory> = {
  COMFORT_HARD: "comfort",
  COMFORT_MEDIUM: "comfort",
  COMFORT_SOFT: "comfort",
  SPORT_HARD: "sport",
  SPORT_MEDIUM: "sport",
  SPORT_SOFT: "sport",
  RACING_HARD: "racing",
  RACING_MEDIUM: "racing",
  RACING_SOFT: "racing",
  INTERMEDIATE: "weather",
  WET: "weather",
  DIRT: "offroad",
  SNOW: "offroad",
};

export function resolveRideHeight(
  pct: number,
  min: number,
  max: number,
): number {
  return Math.round(min + pct * (max - min));
}

// ── Suspension base values per tire category ──

interface SuspensionBase {
  bodyHeightFrontPct: number;
  bodyHeightRearPct: number;
  natFreqFront: number;
  natFreqRear: number;
  antiRollFront: number;
  antiRollRear: number;
  compressionFront: number;
  compressionRear: number;
  expansionFront: number;
  expansionRear: number;
  camberFront: number;
  camberRear: number;
  toeFront: number;
  toeRear: number;
}

const CATEGORY_BASE: Record<TireCategory, SuspensionBase> = {
  comfort: {
    bodyHeightFrontPct: 0.45,
    bodyHeightRearPct: 0.5,
    natFreqFront: 1.6,
    natFreqRear: 1.5,
    antiRollFront: 3,
    antiRollRear: 2,
    compressionFront: 26,
    compressionRear: 25,
    expansionFront: 34,
    expansionRear: 33,
    camberFront: 0.8,
    camberRear: 0.5,
    toeFront: 0.0,
    toeRear: 0.08,
  },
  sport: {
    bodyHeightFrontPct: 0.18,
    bodyHeightRearPct: 0.22,
    natFreqFront: 2.1,
    natFreqRear: 2.0,
    antiRollFront: 4,
    antiRollRear: 3,
    compressionFront: 30,
    compressionRear: 28,
    expansionFront: 38,
    expansionRear: 36,
    camberFront: 1.8,
    camberRear: 1.2,
    toeFront: -0.05,
    toeRear: 0.12,
  },
  racing: {
    bodyHeightFrontPct: 0.12,
    bodyHeightRearPct: 0.15,
    natFreqFront: 2.6,
    natFreqRear: 2.45,
    antiRollFront: 5,
    antiRollRear: 4,
    compressionFront: 33,
    compressionRear: 31,
    expansionFront: 42,
    expansionRear: 40,
    camberFront: 2.5,
    camberRear: 1.8,
    toeFront: -0.1,
    toeRear: 0.15,
  },
  weather: {
    bodyHeightFrontPct: 0.35,
    bodyHeightRearPct: 0.4,
    natFreqFront: 1.85,
    natFreqRear: 1.75,
    antiRollFront: 3,
    antiRollRear: 3,
    compressionFront: 28,
    compressionRear: 27,
    expansionFront: 36,
    expansionRear: 35,
    camberFront: 1.2,
    camberRear: 0.8,
    toeFront: 0.0,
    toeRear: 0.12,
  },
  offroad: {
    bodyHeightFrontPct: 0.55,
    bodyHeightRearPct: 0.6,
    natFreqFront: 1.35,
    natFreqRear: 1.25,
    antiRollFront: 2,
    antiRollRear: 2,
    compressionFront: 24,
    compressionRear: 23,
    expansionFront: 32,
    expansionRear: 31,
    camberFront: 0.3,
    camberRear: 0.2,
    toeFront: 0.0,
    toeRear: 0.05,
  },
};

// ── Per-drivetrain suspension tweaks (deltas from base) ──

interface DrivetrainTweak {
  antiRollFront?: number;
  antiRollRear?: number;
  natFreqFront?: number;
  natFreqRear?: number;
  camberFront?: number;
  camberRear?: number;
  toeFront?: number;
  toeRear?: number;
}

const DRIVETRAIN_TWEAKS: Record<Drivetrain, DrivetrainTweak> = {
  FR: { antiRollFront: 1 },
  FF: {
    natFreqFront: 0.15,
    antiRollFront: 1,
    camberFront: 0.3,
    toeFront: -0.03,
  },
  MR: { natFreqRear: 0.1, camberRear: 0.2 },
  RR: { natFreqRear: 0.2, antiRollRear: 1, camberRear: 0.3, toeRear: 0.05 },
  "4WD": {},
};

// ── LSD base values per tire category ──

interface LsdBase {
  init: number;
  accel: number;
  decel: number;
}

const LSD_BY_CATEGORY: Record<TireCategory, LsdBase> = {
  comfort: { init: 10, accel: 18, decel: 14 },
  sport: { init: 15, accel: 26, decel: 20 },
  racing: { init: 20, accel: 35, decel: 25 },
  weather: { init: 12, accel: 20, decel: 16 },
  offroad: { init: 15, accel: 22, decel: 18 },
};

const TORQUE_DIST: Record<TireCategory, number> = {
  comfort: 40,
  sport: 35,
  racing: 30,
  weather: 40,
  offroad: 45,
};

// ── Build all 25 presets ──

const TIRE_CATEGORIES: TireCategory[] = [
  "comfort",
  "sport",
  "racing",
  "weather",
  "offroad",
];
const DRIVETRAINS: Drivetrain[] = ["FR", "FF", "MR", "RR", "4WD"];

const CATEGORY_LABELS: Record<TireCategory, string> = {
  comfort: "Comfort",
  sport: "Sport",
  racing: "Racing",
  weather: "Wet/Intermediate",
  offroad: "Dirt/Snow",
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function buildPreset(cat: TireCategory, dt: Drivetrain): BaseTunePreset {
  const base = CATEGORY_BASE[cat];
  const tweak = DRIVETRAIN_TWEAKS[dt];
  const lsd = LSD_BY_CATEGORY[cat];

  const preset: BaseTunePreset = {
    tireCategory: cat,
    drivetrain: dt,
    label: `${CATEGORY_LABELS[cat]} / ${dt}`,
    bodyHeightFrontPct: base.bodyHeightFrontPct,
    bodyHeightRearPct: base.bodyHeightRearPct,
    natFreqFront: round2(base.natFreqFront + (tweak.natFreqFront ?? 0)),
    natFreqRear: round2(base.natFreqRear + (tweak.natFreqRear ?? 0)),
    antiRollFront: Math.min(
      10,
      base.antiRollFront + (tweak.antiRollFront ?? 0),
    ),
    antiRollRear: Math.min(10, base.antiRollRear + (tweak.antiRollRear ?? 0)),
    compressionFront: base.compressionFront,
    compressionRear: base.compressionRear,
    expansionFront: base.expansionFront,
    expansionRear: base.expansionRear,
    camberFront: round2(
      Math.min(6.0, base.camberFront + (tweak.camberFront ?? 0)),
    ),
    camberRear: round2(
      Math.min(6.0, base.camberRear + (tweak.camberRear ?? 0)),
    ),
    toeFront: round2(
      Math.max(-1.0, Math.min(1.0, base.toeFront + (tweak.toeFront ?? 0))),
    ),
    toeRear: round2(
      Math.max(-1.0, Math.min(1.0, base.toeRear + (tweak.toeRear ?? 0))),
    ),
  };

  // LSD: FF → front only, FR/MR/RR → rear only, 4WD → both
  const hasFront = dt === "FF" || dt === "4WD";
  const hasRear = dt !== "FF";

  if (hasFront) {
    const scale = dt === "4WD" ? 0.6 : 1;
    preset.lsdInitFront = Math.max(5, Math.round(lsd.init * scale));
    preset.lsdAccelFront = Math.max(5, Math.round(lsd.accel * scale));
    preset.lsdDecelFront = Math.max(5, Math.round(lsd.decel * scale));
  }

  if (hasRear) {
    const scale = dt === "4WD" ? 0.85 : 1;
    preset.lsdInitRear = Math.max(5, Math.round(lsd.init * scale));
    preset.lsdAccelRear = Math.max(5, Math.round(lsd.accel * scale));
    preset.lsdDecelRear = Math.max(5, Math.round(lsd.decel * scale));
  }

  if (dt === "4WD") {
    preset.torqueDistribution = TORQUE_DIST[cat];
  }

  return preset;
}

const BASE_TUNE_PRESETS: BaseTunePreset[] = TIRE_CATEGORIES.flatMap((cat) =>
  DRIVETRAINS.map((dt) => buildPreset(cat, dt)),
);

export function getBaseTune(
  tireCategory: TireCategory,
  drivetrain: Drivetrain,
): BaseTunePreset | undefined {
  return BASE_TUNE_PRESETS.find(
    (p) => p.tireCategory === tireCategory && p.drivetrain === drivetrain,
  );
}
