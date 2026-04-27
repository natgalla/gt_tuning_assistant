export type Symptom =
  | "understeer"
  | "oversteer"
  | "snap-oversteer"
  | "instability";
export type Phase = "entry" | "mid" | "exit";
export type CornerSpeed = "low" | "medium" | "high";
export type ThrottleState = "on-throttle" | "off-throttle" | "braking";
export type Elevation = "up" | "down" | "neutral";

export type Direction = "increase" | "decrease";

export interface Recommendation {
  parameter: string;
  direction: Direction;
  score: number; // 0–4, higher = more specific match
}

export type Drivetrain = "FR" | "FF" | "MR" | "RR" | "4WD";

interface Rule {
  symptom: Symptom;
  phase: Phase;
  speed?: CornerSpeed;
  throttle?: ThrottleState;
  elevation?: Elevation;
  parameter: string;
  direction: Direction;
  drivetrain?: Drivetrain; // undefined = applies to all
}

const RULES: Rule[] = [
  // ── Understeer, Entry ──
  {
    symptom: "understeer",
    phase: "entry",
    parameter: "compressionFront",
    direction: "decrease",
  },
  {
    symptom: "understeer",
    phase: "entry",
    parameter: "toeFront",
    direction: "decrease",
  },
  {
    symptom: "understeer",
    phase: "entry",
    throttle: "braking",
    parameter: "lsdDecelFront",
    direction: "decrease",
  },
  {
    symptom: "understeer",
    phase: "entry",
    speed: "high",
    parameter: "bodyHeightFront",
    direction: "decrease",
  },
  {
    symptom: "understeer",
    phase: "entry",
    speed: "high",
    parameter: "bodyHeightRear",
    direction: "increase",
  },

  // ── Understeer, Mid ──
  {
    symptom: "understeer",
    phase: "mid",
    parameter: "antiRollFront",
    direction: "decrease",
  },
  {
    symptom: "understeer",
    phase: "mid",
    parameter: "antiRollRear",
    direction: "increase",
  },
  {
    symptom: "understeer",
    phase: "mid",
    parameter: "natFreqFront",
    direction: "decrease",
  },
  {
    symptom: "understeer",
    phase: "mid",
    parameter: "natFreqRear",
    direction: "increase",
  },
  {
    symptom: "understeer",
    phase: "mid",
    parameter: "camberFront",
    direction: "increase",
  },
  {
    symptom: "understeer",
    phase: "mid",
    speed: "high",
    parameter: "bodyHeightFront",
    direction: "decrease",
  },
  {
    symptom: "understeer",
    phase: "mid",
    speed: "high",
    parameter: "bodyHeightRear",
    direction: "increase",
  },

  // ── Understeer, Exit ──
  {
    symptom: "understeer",
    phase: "exit",
    parameter: "natFreqFront",
    direction: "decrease",
  },
  {
    symptom: "understeer",
    phase: "exit",
    parameter: "natFreqRear",
    direction: "increase",
  },
  {
    symptom: "understeer",
    phase: "exit",
    throttle: "on-throttle",
    parameter: "lsdAccelRear",
    direction: "decrease",
  },
  {
    symptom: "understeer",
    phase: "exit",
    throttle: "on-throttle",
    parameter: "antiRollFront",
    direction: "decrease",
  },
  {
    symptom: "understeer",
    phase: "exit",
    throttle: "on-throttle",
    parameter: "antiRollRear",
    direction: "increase",
  },

  // ── Oversteer, Entry ──
  {
    symptom: "oversteer",
    phase: "entry",
    parameter: "antiRollFront",
    direction: "increase",
  },
  {
    symptom: "oversteer",
    phase: "entry",
    parameter: "antiRollRear",
    direction: "decrease",
  },
  {
    symptom: "oversteer",
    phase: "entry",
    parameter: "toeRear",
    direction: "increase",
  },
  {
    symptom: "oversteer",
    phase: "entry",
    throttle: "braking",
    parameter: "lsdDecelRear",
    direction: "decrease",
  },
  {
    symptom: "oversteer",
    phase: "entry",
    throttle: "braking",
    parameter: "expansionRear",
    direction: "increase",
  },

  // ── Oversteer, Mid ──
  {
    symptom: "oversteer",
    phase: "mid",
    parameter: "antiRollFront",
    direction: "increase",
  },
  {
    symptom: "oversteer",
    phase: "mid",
    parameter: "antiRollRear",
    direction: "decrease",
  },
  {
    symptom: "oversteer",
    phase: "mid",
    parameter: "natFreqFront",
    direction: "increase",
  },
  {
    symptom: "oversteer",
    phase: "mid",
    parameter: "natFreqRear",
    direction: "decrease",
  },
  {
    symptom: "oversteer",
    phase: "mid",
    parameter: "camberRear",
    direction: "increase",
  },
  {
    symptom: "oversteer",
    phase: "mid",
    speed: "high",
    parameter: "bodyHeightFront",
    direction: "increase",
  },
  {
    symptom: "oversteer",
    phase: "mid",
    speed: "high",
    parameter: "bodyHeightRear",
    direction: "decrease",
  },

  // ── Oversteer, Exit ──
  {
    symptom: "oversteer",
    phase: "exit",
    parameter: "natFreqFront",
    direction: "increase",
  },
  {
    symptom: "oversteer",
    phase: "exit",
    parameter: "natFreqRear",
    direction: "decrease",
  },
  {
    symptom: "oversteer",
    phase: "exit",
    parameter: "toeRear",
    direction: "increase",
  },
  {
    symptom: "oversteer",
    phase: "exit",
    throttle: "on-throttle",
    parameter: "lsdAccelRear",
    direction: "decrease",
  },
  {
    symptom: "oversteer",
    phase: "exit",
    speed: "high",
    parameter: "bodyHeightFront",
    direction: "increase",
  },
  {
    symptom: "oversteer",
    phase: "exit",
    speed: "high",
    parameter: "bodyHeightRear",
    direction: "decrease",
  },

  // ── Snap Oversteer, Entry (lift-off / trail-brake snap) ──
  {
    symptom: "snap-oversteer",
    phase: "entry",
    parameter: "expansionRear",
    direction: "increase",
  },
  {
    symptom: "snap-oversteer",
    phase: "entry",
    parameter: "compressionFront",
    direction: "decrease",
  },
  {
    symptom: "snap-oversteer",
    phase: "entry",
    parameter: "toeRear",
    direction: "increase",
  },
  {
    symptom: "snap-oversteer",
    phase: "entry",
    throttle: "braking",
    parameter: "lsdDecelRear",
    direction: "decrease",
  },
  {
    symptom: "snap-oversteer",
    phase: "entry",
    throttle: "off-throttle",
    parameter: "lsdDecelRear",
    direction: "decrease",
  },

  // ── Snap Oversteer, Mid (sudden rotation mid-corner) ──
  {
    symptom: "snap-oversteer",
    phase: "mid",
    parameter: "expansionRear",
    direction: "increase",
  },
  {
    symptom: "snap-oversteer",
    phase: "mid",
    parameter: "toeRear",
    direction: "increase",
  },
  {
    symptom: "snap-oversteer",
    phase: "mid",
    parameter: "natFreqFront",
    direction: "increase",
  },
  {
    symptom: "snap-oversteer",
    phase: "mid",
    parameter: "natFreqRear",
    direction: "decrease",
  },
  {
    symptom: "snap-oversteer",
    phase: "mid",
    parameter: "camberRear",
    direction: "increase",
  },

  // ── Snap Oversteer, Exit (power-on snap) ──
  {
    symptom: "snap-oversteer",
    phase: "exit",
    parameter: "expansionRear",
    direction: "increase",
  },
  {
    symptom: "snap-oversteer",
    phase: "exit",
    parameter: "toeRear",
    direction: "increase",
  },
  {
    symptom: "snap-oversteer",
    phase: "exit",
    throttle: "on-throttle",
    parameter: "lsdAccelRear",
    direction: "decrease",
  },

  // ── Snap Oversteer, Elevation ──
  {
    symptom: "snap-oversteer",
    phase: "entry",
    elevation: "down",
    parameter: "compressionFront",
    direction: "decrease",
  },
  {
    symptom: "snap-oversteer",
    phase: "mid",
    elevation: "down",
    parameter: "bodyHeightRear",
    direction: "decrease",
  },

  // ── Instability, Entry ──
  {
    symptom: "instability",
    phase: "entry",
    parameter: "toeRear",
    direction: "increase",
  },
  {
    symptom: "instability",
    phase: "entry",
    parameter: "compressionRear",
    direction: "increase",
  },
  {
    symptom: "instability",
    phase: "entry",
    throttle: "braking",
    parameter: "lsdDecelRear",
    direction: "increase",
  },

  // ── Instability, Mid ──
  {
    symptom: "instability",
    phase: "mid",
    parameter: "toeRear",
    direction: "increase",
  },
  {
    symptom: "instability",
    phase: "mid",
    parameter: "antiRollFront",
    direction: "decrease",
  },
  {
    symptom: "instability",
    phase: "mid",
    parameter: "antiRollRear",
    direction: "increase",
  },
  {
    symptom: "instability",
    phase: "mid",
    speed: "high",
    parameter: "bodyHeightFront",
    direction: "increase",
  },
  {
    symptom: "instability",
    phase: "mid",
    speed: "high",
    parameter: "bodyHeightRear",
    direction: "decrease",
  },
  {
    symptom: "instability",
    phase: "mid",
    speed: "high",
    parameter: "expansionRear",
    direction: "increase",
  },

  // ── Instability, Exit ──
  {
    symptom: "instability",
    phase: "exit",
    parameter: "toeRear",
    direction: "increase",
  },
  {
    symptom: "instability",
    phase: "exit",
    parameter: "expansionRear",
    direction: "increase",
  },
  {
    symptom: "instability",
    phase: "exit",
    throttle: "on-throttle",
    parameter: "lsdAccelRear",
    direction: "increase",
  },

  // ── FF-specific: front LSD is the primary differential tool ──
  {
    symptom: "understeer",
    phase: "exit",
    throttle: "on-throttle",
    parameter: "lsdAccelFront",
    direction: "increase",
    drivetrain: "FF",
  },
  {
    symptom: "oversteer",
    phase: "entry",
    throttle: "braking",
    parameter: "lsdDecelFront",
    direction: "increase",
    drivetrain: "FF",
  },
  {
    symptom: "oversteer",
    phase: "exit",
    throttle: "on-throttle",
    parameter: "lsdAccelFront",
    direction: "decrease",
    drivetrain: "FF",
  },
  {
    symptom: "snap-oversteer",
    phase: "entry",
    throttle: "off-throttle",
    parameter: "lsdDecelFront",
    direction: "increase",
    drivetrain: "FF",
  },
  {
    symptom: "snap-oversteer",
    phase: "entry",
    throttle: "braking",
    parameter: "lsdDecelFront",
    direction: "increase",
    drivetrain: "FF",
  },
  {
    symptom: "instability",
    phase: "exit",
    throttle: "on-throttle",
    parameter: "lsdAccelFront",
    direction: "increase",
    drivetrain: "FF",
  },

  // ── MR-specific: rear weight bias amplifies rear snap ──
  {
    symptom: "snap-oversteer",
    phase: "mid",
    parameter: "natFreqRear",
    direction: "decrease",
    drivetrain: "MR",
  },
  {
    symptom: "snap-oversteer",
    phase: "entry",
    parameter: "compressionRear",
    direction: "increase",
    drivetrain: "MR",
  },
  {
    symptom: "oversteer",
    phase: "exit",
    parameter: "toeRear",
    direction: "increase",
    drivetrain: "MR",
  },

  // ── Elevation: Uphill (weight shifts rear → front lighter) ──
  {
    symptom: "understeer",
    phase: "entry",
    elevation: "up",
    parameter: "bodyHeightFront",
    direction: "decrease",
  },
  {
    symptom: "understeer",
    phase: "mid",
    elevation: "up",
    parameter: "camberFront",
    direction: "increase",
  },
  {
    symptom: "understeer",
    phase: "exit",
    elevation: "up",
    parameter: "antiRollRear",
    direction: "increase",
  },
  {
    symptom: "oversteer",
    phase: "exit",
    elevation: "up",
    parameter: "lsdAccelRear",
    direction: "increase",
  },

  // ── AWD Torque Distribution ──
  // Lower value = more rear-biased; reduces front drive load → frees front grip for turning
  {
    symptom: "understeer",
    phase: "mid",
    parameter: "torqueDistribution",
    direction: "decrease",
  },
  {
    symptom: "understeer",
    phase: "exit",
    throttle: "on-throttle",
    parameter: "torqueDistribution",
    direction: "decrease",
  },
  // Higher value = more front-biased; reduces rear drive load → stabilises rear
  {
    symptom: "oversteer",
    phase: "mid",
    parameter: "torqueDistribution",
    direction: "increase",
  },
  {
    symptom: "oversteer",
    phase: "exit",
    throttle: "on-throttle",
    parameter: "torqueDistribution",
    direction: "increase",
  },
  {
    symptom: "snap-oversteer",
    phase: "exit",
    throttle: "on-throttle",
    parameter: "torqueDistribution",
    direction: "increase",
  },
  {
    symptom: "instability",
    phase: "exit",
    throttle: "on-throttle",
    parameter: "torqueDistribution",
    direction: "increase",
  },

  // ── Elevation: Downhill (weight shifts front → rear lighter) ──
  {
    symptom: "oversteer",
    phase: "entry",
    elevation: "down",
    parameter: "bodyHeightRear",
    direction: "decrease",
  },
  {
    symptom: "oversteer",
    phase: "mid",
    elevation: "down",
    parameter: "compressionFront",
    direction: "increase",
  },
  {
    symptom: "oversteer",
    phase: "exit",
    elevation: "down",
    parameter: "expansionRear",
    direction: "increase",
  },
  {
    symptom: "instability",
    phase: "entry",
    elevation: "down",
    parameter: "expansionRear",
    direction: "increase",
  },
  {
    symptom: "instability",
    phase: "mid",
    elevation: "down",
    parameter: "bodyHeightRear",
    direction: "decrease",
  },
];

function scoreRule(
  rule: Rule,
  speed: CornerSpeed | null,
  throttle: ThrottleState | null,
  elevation: Elevation | null,
  drivetrain?: Drivetrain,
): number {
  let score = 0;
  if (rule.speed && rule.speed === speed) score++;
  if (rule.throttle && rule.throttle === throttle) score++;
  if (rule.elevation && rule.elevation === elevation) score++;
  if (rule.drivetrain && rule.drivetrain === drivetrain) score++;
  return score;
}

export function getRecommendations(
  symptom: Symptom,
  phase: Phase | null,
  speed: CornerSpeed | null,
  throttle: ThrottleState | null,
  elevation: Elevation | null,
  drivetrain?: Drivetrain,
): Recommendation[] {
  const excludeParams = new Set<string>();
  if (drivetrain !== "4WD") excludeParams.add("torqueDistribution");
  if (drivetrain === "FR" || drivetrain === "MR" || drivetrain === "RR") {
    excludeParams.add("lsdAccelFront");
    excludeParams.add("lsdDecelFront");
    excludeParams.add("lsdInitFront");
  }
  if (drivetrain === "FF") {
    excludeParams.add("lsdAccelRear");
    excludeParams.add("lsdDecelRear");
    excludeParams.add("lsdInitRear");
  }

  if (phase) {
    // Specific phase: collect all matching rules, keep highest score per parameter
    const best = new Map<string, Recommendation>();
    for (const rule of RULES) {
      if (rule.phase !== phase) continue;
      if (excludeParams.has(rule.parameter)) continue;
      if (rule.symptom !== symptom) continue;
      if (rule.speed && rule.speed !== speed) continue;
      if (rule.throttle && rule.throttle !== throttle) continue;
      if (rule.elevation && rule.elevation !== elevation) continue;
      if (rule.drivetrain && rule.drivetrain !== drivetrain) continue;

      const s = scoreRule(rule, speed, throttle, elevation, drivetrain);
      const existing = best.get(rule.parameter);
      if (!existing || s > existing.score) {
        best.set(rule.parameter, {
          parameter: rule.parameter,
          direction: rule.direction,
          score: s,
        });
      }
    }
    return sortRecommendations(best);
  }

  // Any phase: collect from all phases, keep only parameters with consistent direction
  // For consistent parameters, use the maximum score seen across phases
  const seen = new Map<
    string,
    { direction: Direction; score: number; conflict: boolean }
  >();
  for (const rule of RULES) {
    if (excludeParams.has(rule.parameter)) continue;
    if (rule.symptom !== symptom) continue;
    if (rule.speed && rule.speed !== speed) continue;
    if (rule.throttle && rule.throttle !== throttle) continue;
    if (rule.elevation && rule.elevation !== elevation) continue;
    if (rule.drivetrain && rule.drivetrain !== drivetrain) continue;

    const s = scoreRule(rule, speed, throttle, elevation, drivetrain);
    const entry = seen.get(rule.parameter);
    if (!entry) {
      seen.set(rule.parameter, { direction: rule.direction, score: s, conflict: false });
    } else if (entry.direction !== rule.direction) {
      entry.conflict = true;
    } else if (s > entry.score) {
      entry.score = s;
    }
  }

  const best = new Map<string, Recommendation>();
  for (const [param, { direction, score, conflict }] of seen) {
    if (!conflict) {
      best.set(param, { parameter: param, direction, score });
    }
  }
  return sortRecommendations(best);
}

function sortRecommendations(
  map: Map<string, Recommendation>,
): Recommendation[] {
  return Array.from(map.values()).sort(
    (a, b) => b.score - a.score || a.parameter.localeCompare(b.parameter),
  );
}
