import type { Drivetrain } from "@/lib/tuning-rules";
import type { TuneValues } from "@/components/tune-editor";

export interface TuningTip {
  parameter: string;
  severity: "info" | "warning";
  message: string;
}

type TireCategory = "comfort" | "sport" | "racing" | "weather" | "offroad";

const TIRE_CATEGORY_MAP: Record<string, TireCategory> = {
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

// Threshold boundaries: [low.warning, low.info, high.info, high.warning]
type Thresholds = [number, number, number, number];
type CategoryThresholds = Record<TireCategory, Thresholds>;

interface ParameterDef {
  thresholds: CategoryThresholds;
  label: string;
  lowConsequence: string;
  highConsequence: string;
}

const PARAMETER_DEFS: Record<string, ParameterDef> = {
  camberFront: {
    thresholds: {
      comfort: [0.5, 1.0, 2.5, 3.5],
      sport: [0.3, 0.8, 3.0, 4.0],
      racing: [0.3, 0.5, 3.5, 4.5],
      weather: [0.5, 1.0, 2.0, 3.0],
      offroad: [0.3, 1.0, 2.0, 3.0],
    },
    label: "front camber",
    lowConsequence: "reduced front grip in corners",
    highConsequence: "reduced contact patch and uneven tire wear",
  },
  camberRear: {
    thresholds: {
      comfort: [0.5, 1.0, 2.5, 3.5],
      sport: [0.3, 0.8, 3.0, 4.0],
      racing: [0.3, 0.5, 3.5, 4.5],
      weather: [0.5, 1.0, 2.0, 3.0],
      offroad: [0.3, 1.0, 2.0, 3.0],
    },
    label: "rear camber",
    lowConsequence: "reduced rear grip in corners",
    highConsequence: "reduced contact patch and oversteer on corner exit",
  },
  natFreqFront: {
    thresholds: {
      comfort: [1.2, 1.5, 2.8, 3.5],
      sport: [1.0, 1.3, 3.2, 4.0],
      racing: [0.8, 1.0, 3.8, 4.5],
      weather: [1.2, 1.5, 2.5, 3.0],
      offroad: [1.0, 1.3, 2.5, 3.0],
    },
    label: "front spring rate",
    lowConsequence: "excessive body roll and sluggish turn-in",
    highConsequence: "a harsh ride and reduced front grip over bumps",
  },
  natFreqRear: {
    thresholds: {
      comfort: [1.2, 1.5, 2.8, 3.5],
      sport: [1.0, 1.3, 3.2, 4.0],
      racing: [0.8, 1.0, 3.8, 4.5],
      weather: [1.2, 1.5, 2.5, 3.0],
      offroad: [1.0, 1.3, 2.5, 3.0],
    },
    label: "rear spring rate",
    lowConsequence: "excessive body roll and rear instability",
    highConsequence: "a harsh ride and reduced rear grip over bumps",
  },
  antiRollFront: {
    thresholds: {
      comfort: [2, 3, 7, 9],
      sport: [2, 2, 8, 9],
      racing: [1, 2, 9, 10],
      weather: [2, 3, 6, 8],
      offroad: [2, 3, 6, 8],
    },
    label: "front anti-roll bar",
    lowConsequence: "excessive body roll in corners",
    highConsequence: "understeer from an overloaded front axle",
  },
  antiRollRear: {
    thresholds: {
      comfort: [2, 3, 7, 9],
      sport: [2, 2, 8, 9],
      racing: [1, 2, 9, 10],
      weather: [2, 3, 6, 8],
      offroad: [2, 3, 6, 8],
    },
    label: "rear anti-roll bar",
    lowConsequence: "excessive body roll and rear instability",
    highConsequence: "oversteer from an overloaded rear axle",
  },
  compressionFront: {
    // Game range: 20–40
    thresholds: {
      comfort: [21, 23, 35, 38],
      sport: [21, 22, 36, 39],
      racing: [20, 21, 38, 40],
      weather: [22, 24, 34, 37],
      offroad: [22, 24, 34, 37],
    },
    label: "front compression damping",
    lowConsequence: "excessive nose dive under braking",
    highConsequence: "reduced front grip over bumps and kerbs",
  },
  compressionRear: {
    // Game range: 20–40
    thresholds: {
      comfort: [21, 23, 35, 38],
      sport: [21, 22, 36, 39],
      racing: [20, 21, 38, 40],
      weather: [22, 24, 34, 37],
      offroad: [22, 24, 34, 37],
    },
    label: "rear compression damping",
    lowConsequence: "excessive squat under acceleration",
    highConsequence: "reduced rear grip over bumps and kerbs",
  },
  expansionFront: {
    // Game range: 30–50
    thresholds: {
      comfort: [31, 33, 45, 48],
      sport: [31, 32, 46, 49],
      racing: [30, 31, 48, 50],
      weather: [32, 34, 44, 47],
      offroad: [32, 34, 44, 47],
    },
    label: "front expansion damping",
    lowConsequence: "slow weight transfer and floaty handling",
    highConsequence:
      "reduced front grip as the suspension cannot extend quickly",
  },
  expansionRear: {
    // Game range: 30–50
    thresholds: {
      comfort: [31, 33, 45, 48],
      sport: [31, 32, 46, 49],
      racing: [30, 31, 48, 50],
      weather: [32, 34, 44, 47],
      offroad: [32, 34, 44, 47],
    },
    label: "rear expansion damping",
    lowConsequence: "slow weight transfer and rear instability on turn-in",
    highConsequence:
      "reduced rear grip as the suspension cannot extend quickly",
  },
  bodyHeightFront: {
    thresholds: {
      comfort: [70, 80, 150, 170],
      sport: [65, 75, 140, 160],
      racing: [60, 70, 130, 150],
      weather: [75, 85, 150, 170],
      offroad: [80, 90, 160, 180],
    },
    label: "front ride height",
    lowConsequence: "bottoming out over bumps and kerbs",
    highConsequence: "a high center of gravity and reduced aerodynamic grip",
  },
  bodyHeightRear: {
    thresholds: {
      comfort: [70, 80, 150, 170],
      sport: [65, 75, 140, 160],
      racing: [60, 70, 130, 150],
      weather: [75, 85, 150, 170],
      offroad: [80, 90, 160, 180],
    },
    label: "rear ride height",
    lowConsequence: "bottoming out over bumps and kerbs",
    highConsequence: "a high center of gravity and reduced rear stability",
  },
  toeFront: {
    thresholds: {
      comfort: [-0.5, -0.3, 0.3, 0.5],
      sport: [-0.6, -0.4, 0.4, 0.6],
      racing: [-0.8, -0.5, 0.5, 0.8],
      weather: [-0.4, -0.2, 0.2, 0.4],
      offroad: [-0.4, -0.2, 0.2, 0.4],
    },
    label: "front toe",
    lowConsequence: "twitchy turn-in and instability at speed",
    highConsequence: "sluggish turn-in and increased tire drag",
  },
  toeRear: {
    thresholds: {
      comfort: [-0.3, -0.1, 0.4, 0.6],
      sport: [-0.4, -0.2, 0.5, 0.7],
      racing: [-0.5, -0.3, 0.6, 0.8],
      weather: [-0.2, -0.1, 0.3, 0.5],
      offroad: [-0.2, -0.1, 0.3, 0.5],
    },
    label: "rear toe",
    lowConsequence: "rear instability and oversteer",
    highConsequence: "excessive tire drag and reduced straight-line speed",
  },
  lsdInitFront: {
    thresholds: {
      comfort: [0, 5, 30, 45],
      sport: [0, 5, 35, 50],
      racing: [0, 5, 40, 55],
      weather: [0, 5, 25, 40],
      offroad: [0, 5, 25, 40],
    },
    label: "front LSD initial torque",
    lowConsequence: "a lack of traction when one wheel loses grip",
    highConsequence: "understeer and resistance to turning",
  },
  lsdAccelFront: {
    thresholds: {
      comfort: [0, 5, 35, 50],
      sport: [0, 5, 40, 52],
      racing: [0, 5, 45, 55],
      weather: [0, 5, 30, 45],
      offroad: [0, 5, 30, 45],
    },
    label: "front LSD accel",
    lowConsequence: "wheelspin from the inside front wheel on exit",
    highConsequence: "understeer on corner exit under power",
  },
  lsdDecelFront: {
    thresholds: {
      comfort: [0, 5, 30, 45],
      sport: [0, 5, 35, 48],
      racing: [0, 5, 40, 52],
      weather: [0, 5, 25, 40],
      offroad: [0, 5, 25, 40],
    },
    label: "front LSD decel",
    lowConsequence: "a loose front end under braking",
    highConsequence: "understeer on corner entry when braking",
  },
  lsdInitRear: {
    thresholds: {
      comfort: [0, 5, 30, 45],
      sport: [0, 5, 35, 50],
      racing: [0, 5, 40, 55],
      weather: [0, 5, 25, 40],
      offroad: [0, 5, 25, 40],
    },
    label: "rear LSD initial torque",
    lowConsequence: "a lack of traction when one wheel loses grip",
    highConsequence: "oversteer and resistance to rotation",
  },
  lsdAccelRear: {
    thresholds: {
      comfort: [0, 5, 35, 50],
      sport: [0, 5, 40, 52],
      racing: [0, 5, 45, 55],
      weather: [0, 5, 30, 45],
      offroad: [0, 5, 30, 45],
    },
    label: "rear LSD accel",
    lowConsequence: "wheelspin from the inside rear wheel on exit",
    highConsequence: "oversteer on corner exit under power",
  },
  lsdDecelRear: {
    thresholds: {
      comfort: [0, 5, 30, 45],
      sport: [0, 5, 35, 48],
      racing: [0, 5, 40, 52],
      weather: [0, 5, 25, 40],
      offroad: [0, 5, 25, 40],
    },
    label: "rear LSD decel",
    lowConsequence: "a loose rear end under braking",
    highConsequence: "snap oversteer on corner entry when braking",
  },
  torqueDistribution: {
    thresholds: {
      comfort: [15, 25, 55, 65],
      sport: [15, 25, 55, 65],
      racing: [10, 20, 60, 70],
      weather: [20, 30, 55, 65],
      offroad: [20, 30, 55, 65],
    },
    label: "torque distribution",
    lowConsequence: "excessive rear bias leading to oversteer under power",
    highConsequence: "excessive front bias leading to understeer under power",
  },
};

// Discrepancy thresholds: [info, warning]
const DISCREPANCY_DEFS: {
  key: string;
  front: keyof TuneValues;
  rear: keyof TuneValues;
  label: string;
  infoThreshold: number;
  warningThreshold: number;
}[] = [
  {
    key: "discrepancy_camber",
    front: "camberFront",
    rear: "camberRear",
    label: "camber",
    infoThreshold: 1.5,
    warningThreshold: 2.5,
  },
  {
    key: "discrepancy_natFreq",
    front: "natFreqFront",
    rear: "natFreqRear",
    label: "spring rate",
    infoThreshold: 1.0,
    warningThreshold: 1.5,
  },
  {
    key: "discrepancy_antiRoll",
    front: "antiRollFront",
    rear: "antiRollRear",
    label: "anti-roll bar",
    infoThreshold: 4,
    warningThreshold: 6,
  },
  {
    key: "discrepancy_compression",
    front: "compressionFront",
    rear: "compressionRear",
    label: "compression damping",
    infoThreshold: 15,
    warningThreshold: 25,
  },
  {
    key: "discrepancy_expansion",
    front: "expansionFront",
    rear: "expansionRear",
    label: "expansion damping",
    infoThreshold: 15,
    warningThreshold: 25,
  },
  {
    key: "discrepancy_bodyHeight",
    front: "bodyHeightFront",
    rear: "bodyHeightRear",
    label: "ride height",
    infoThreshold: 30,
    warningThreshold: 50,
  },
];

function getDescriptor(
  zone: "low.warning" | "low.info" | "high.info" | "high.warning",
): string {
  switch (zone) {
    case "low.warning":
      return "very low";
    case "low.info":
      return "conservative";
    case "high.info":
      return "aggressive";
    case "high.warning":
      return "extreme";
  }
}

function checkParameter(
  value: number,
  thresholds: Thresholds,
  def: ParameterDef,
): TuningTip | null {
  const [lowWarn, lowInfo, highInfo, highWarn] = thresholds;

  if (value < lowWarn) {
    return {
      parameter: "",
      severity: "warning",
      message: `This ${def.label} setting is ${getDescriptor("low.warning")}, which could result in ${def.lowConsequence}.`,
    };
  }
  if (value < lowInfo) {
    return {
      parameter: "",
      severity: "info",
      message: `This ${def.label} setting is ${getDescriptor("low.info")}, which could result in ${def.lowConsequence}.`,
    };
  }
  if (value > highWarn) {
    return {
      parameter: "",
      severity: "warning",
      message: `This ${def.label} setting is ${getDescriptor("high.warning")}, which could result in ${def.highConsequence}.`,
    };
  }
  if (value > highInfo) {
    return {
      parameter: "",
      severity: "info",
      message: `This ${def.label} setting is ${getDescriptor("high.info")}, which could result in ${def.highConsequence}.`,
    };
  }

  return null;
}

function getExcludedParams(drivetrain: Drivetrain): Set<string> {
  const excluded = new Set<string>();
  if (drivetrain !== "4WD") excluded.add("torqueDistribution");
  if (["FR", "MR", "RR"].includes(drivetrain)) {
    excluded.add("lsdAccelFront");
    excluded.add("lsdDecelFront");
    excluded.add("lsdInitFront");
  }
  if (drivetrain === "FF") {
    excluded.add("lsdAccelRear");
    excluded.add("lsdDecelRear");
    excluded.add("lsdInitRear");
  }
  return excluded;
}

export function getTuningTips(
  values: TuneValues,
  tireType: string,
  drivetrain: Drivetrain,
): TuningTip[] {
  const category = TIRE_CATEGORY_MAP[tireType] ?? "sport";
  const excluded = getExcludedParams(drivetrain);
  const tips: TuningTip[] = [];

  // Check individual parameters
  for (const [param, def] of Object.entries(PARAMETER_DEFS)) {
    if (excluded.has(param)) continue;
    const value = values[param as keyof TuneValues];
    if (value == null) continue;

    const thresholds = def.thresholds[category];
    const tip = checkParameter(value, thresholds, def);
    if (tip) {
      tip.parameter = param;
      tips.push(tip);
    }
  }

  // Check front/rear discrepancies
  for (const disc of DISCREPANCY_DEFS) {
    const frontVal = values[disc.front];
    const rearVal = values[disc.rear];
    if (frontVal == null || rearVal == null) continue;
    // Skip if both sides are excluded
    if (excluded.has(disc.front) && excluded.has(disc.rear)) continue;

    const diff = Math.abs(frontVal - rearVal);
    if (diff >= disc.warningThreshold) {
      tips.push({
        parameter: disc.key,
        severity: "warning",
        message: `The front and rear ${disc.label} differ significantly (${diff % 1 === 0 ? diff : diff.toFixed(1)} apart), which could result in unpredictable weight transfer.`,
      });
    } else if (diff >= disc.infoThreshold) {
      tips.push({
        parameter: disc.key,
        severity: "info",
        message: `The front and rear ${disc.label} differ significantly (${diff % 1 === 0 ? diff : diff.toFixed(1)} apart), which could result in unpredictable weight transfer.`,
      });
    }
  }

  // Sort warnings first
  tips.sort((a, b) => {
    if (a.severity === b.severity) return 0;
    return a.severity === "warning" ? -1 : 1;
  });

  return tips;
}
