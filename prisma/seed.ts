import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, SuspensionType } from "../src/generated/prisma/client";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface CarSeed {
  id: number;
  name: string;
  manufacturer: string;
  year: number | null;
  drivetrain: string;
  weight: number;
  horsePower: number;
  bodyHeightRange: {
    frontMin: number;
    frontMax: number;
    rearMin: number;
    rearMax: number;
  };
  stockDefaults: {
    bodyHeightFront: number;
    bodyHeightRear: number;
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
    lsdInitFront: number;
    lsdAccelFront: number;
    lsdDecelFront: number;
    lsdInitRear: number;
    lsdAccelRear: number;
    lsdDecelRear: number;
  };
}

const silvias: CarSeed[] = [
  {
    id: 1,
    name: "Silvia Q's (S13) '88",
    manufacturer: "Nissan",
    year: 1988,
    drivetrain: "FR",
    weight: 1090,
    horsePower: 135,
    bodyHeightRange: { frontMin: 88, frontMax: 138, rearMin: 88, rearMax: 138 },
    stockDefaults: {
      bodyHeightFront: 128, bodyHeightRear: 133,
      natFreqFront: 1.85, natFreqRear: 1.95,
      antiRollFront: 4, antiRollRear: 3,
      compressionFront: 28, compressionRear: 30,
      expansionFront: 38, expansionRear: 40,
      camberFront: 0.5, camberRear: 1.0,
      toeFront: 0.0, toeRear: 0.1,
      lsdInitFront: 0, lsdAccelFront: 0, lsdDecelFront: 0,
      lsdInitRear: 0, lsdAccelRear: 0, lsdDecelRear: 0, // open diff
    },
  },
  {
    id: 2,
    name: "Silvia K's Dia Selection (S13) '90",
    manufacturer: "Nissan",
    year: 1990,
    drivetrain: "FR",
    weight: 1120,
    horsePower: 140,
    bodyHeightRange: { frontMin: 85, frontMax: 135, rearMin: 85, rearMax: 135 },
    stockDefaults: {
      bodyHeightFront: 125, bodyHeightRear: 130,
      natFreqFront: 1.9, natFreqRear: 2.0,
      antiRollFront: 4, antiRollRear: 3,
      compressionFront: 29, compressionRear: 31,
      expansionFront: 39, expansionRear: 41,
      camberFront: 0.5, camberRear: 1.0,
      toeFront: 0.0, toeRear: 0.1,
      lsdInitFront: 0, lsdAccelFront: 0, lsdDecelFront: 0,
      lsdInitRear: 5, lsdAccelRear: 10, lsdDecelRear: 5, // viscous LSD
    },
  },
  {
    id: 3,
    name: "Silvia K's Type S (S14) '94",
    manufacturer: "Nissan",
    year: 1994,
    drivetrain: "FR",
    weight: 1190,
    horsePower: 220,
    bodyHeightRange: { frontMin: 82, frontMax: 132, rearMin: 82, rearMax: 132 },
    stockDefaults: {
      bodyHeightFront: 122, bodyHeightRear: 127,
      natFreqFront: 1.92, natFreqRear: 2.02,
      antiRollFront: 5, antiRollRear: 3,
      compressionFront: 30, compressionRear: 32,
      expansionFront: 40, expansionRear: 42,
      camberFront: 0.3, camberRear: 0.8,
      toeFront: 0.0, toeRear: 0.08,
      lsdInitFront: 0, lsdAccelFront: 0, lsdDecelFront: 0,
      lsdInitRear: 10, lsdAccelRear: 15, lsdDecelRear: 10, // viscous LSD
    },
  },
  {
    id: 4,
    name: "Silvia K's Aero (S14) '96",
    manufacturer: "Nissan",
    year: 1996,
    drivetrain: "FR",
    weight: 1200,
    horsePower: 220,
    bodyHeightRange: { frontMin: 80, frontMax: 130, rearMin: 80, rearMax: 130 },
    stockDefaults: {
      bodyHeightFront: 120, bodyHeightRear: 125,
      natFreqFront: 1.95, natFreqRear: 2.05,
      antiRollFront: 5, antiRollRear: 3,
      compressionFront: 30, compressionRear: 32,
      expansionFront: 40, expansionRear: 42,
      camberFront: 0.3, camberRear: 0.8,
      toeFront: 0.0, toeRear: 0.08,
      lsdInitFront: 0, lsdAccelFront: 0, lsdDecelFront: 0,
      lsdInitRear: 10, lsdAccelRear: 15, lsdDecelRear: 10, // viscous LSD
    },
  },
  {
    id: 5,
    name: "Silvia spec-R Aero (S15) '02",
    manufacturer: "Nissan",
    year: 2002,
    drivetrain: "FR",
    weight: 1240,
    horsePower: 250,
    bodyHeightRange: { frontMin: 80, frontMax: 130, rearMin: 80, rearMax: 130 },
    stockDefaults: {
      bodyHeightFront: 118, bodyHeightRear: 123,
      natFreqFront: 2.0, natFreqRear: 2.1,
      antiRollFront: 5, antiRollRear: 4,
      compressionFront: 31, compressionRear: 33,
      expansionFront: 41, expansionRear: 43,
      camberFront: 0.5, camberRear: 1.0,
      toeFront: 0.0, toeRear: 0.1,
      lsdInitFront: 0, lsdAccelFront: 0, lsdDecelFront: 0,
      lsdInitRear: 15, lsdAccelRear: 20, lsdDecelRear: 15, // helical LSD
    },
  },
  {
    id: 6,
    name: "Silvia spec-R Aero (S15) Touring Car",
    manufacturer: "Nissan",
    year: null,
    drivetrain: "FR",
    weight: 1100,
    horsePower: 300,
    bodyHeightRange: { frontMin: 75, frontMax: 125, rearMin: 75, rearMax: 125 },
    stockDefaults: {
      bodyHeightFront: 100, bodyHeightRear: 105,
      natFreqFront: 2.5, natFreqRear: 2.6,
      antiRollFront: 6, antiRollRear: 5,
      compressionFront: 33, compressionRear: 35,
      expansionFront: 43, expansionRear: 45,
      camberFront: 1.5, camberRear: 1.0,
      toeFront: -0.1, toeRear: 0.15,
      lsdInitFront: 0, lsdAccelFront: 0, lsdDecelFront: 0,
      lsdInitRear: 20, lsdAccelRear: 35, lsdDecelRear: 25, // race setup
    },
  },
];

function buildTuneConfigs(car: CarSeed) {
  const d = car.stockDefaults;
  const bh = car.bodyHeightRange;

  const sharedDefaults = {
    tireType: "SPORT_HARD" as const,
    weightDefault: car.weight,
    horsePowerDefault: car.horsePower,
    bodyHeightFrontDefault: d.bodyHeightFront,
    bodyHeightRearDefault: d.bodyHeightRear,
    natFreqFrontDefault: d.natFreqFront,
    natFreqRearDefault: d.natFreqRear,
    antiRollFrontDefault: d.antiRollFront,
    antiRollRearDefault: d.antiRollRear,
    compressionFrontDefault: d.compressionFront,
    compressionRearDefault: d.compressionRear,
    expansionFrontDefault: d.expansionFront,
    expansionRearDefault: d.expansionRear,
    camberFrontDefault: d.camberFront,
    camberRearDefault: d.camberRear,
    toeFrontDefault: d.toeFront,
    toeRearDefault: d.toeRear,
    lsdInitFrontDefault: d.lsdInitFront,
    lsdAccelFrontDefault: d.lsdAccelFront,
    lsdDecelFrontDefault: d.lsdDecelFront,
    lsdInitRearDefault: d.lsdInitRear,
    lsdAccelRearDefault: d.lsdAccelRear,
    lsdDecelRearDefault: d.lsdDecelRear,
  };

  const antiRollDefault1 = {
    antiRollFrontDefault: 1,
    antiRollRearDefault: 1,
  };

  const readOnly = {
    carId: car.id,
    ...sharedDefaults,
    ...antiRollDefault1,
  };

  const heightAdjustable = {
    carId: car.id,
    suspensionType: SuspensionType.HEIGHT_ADJUSTABLE_SPORT,
    ...sharedDefaults,
    ...antiRollDefault1,
    bodyHeightFrontMin: bh.frontMin,
    bodyHeightFrontMax: bh.frontMax,
    bodyHeightRearMin: bh.rearMin,
    bodyHeightRearMax: bh.rearMax,
    natFreqFrontMin: 1.0,
    natFreqFrontMax: 5.0,
    natFreqRearMin: 1.0,
    natFreqRearMax: 5.0,
    compressionFrontMin: 20,
    compressionFrontMax: 40,
    compressionRearMin: 20,
    compressionRearMax: 40,
    expansionFrontMin: 30,
    expansionFrontMax: 50,
    expansionRearMin: 30,
    expansionRearMax: 50,
    camberFrontMin: 0.0,
    camberFrontMax: 5.0,
    camberRearMin: 0.0,
    camberRearMax: 3.5,
  };

  const fullyCustomizable = {
    carId: car.id,
    suspensionType: SuspensionType.FULLY_CUSTOMIZABLE,
    ...sharedDefaults,
    bodyHeightFrontMin: bh.frontMin,
    bodyHeightFrontMax: bh.frontMax,
    bodyHeightRearMin: bh.rearMin,
    bodyHeightRearMax: bh.rearMax,
    natFreqFrontMin: 1.0,
    natFreqFrontMax: 5.0,
    natFreqRearMin: 1.0,
    natFreqRearMax: 5.0,
    antiRollFrontMin: 1,
    antiRollFrontMax: 10,
    antiRollRearMin: 1,
    antiRollRearMax: 10,
    compressionFrontMin: 20,
    compressionFrontMax: 40,
    compressionRearMin: 20,
    compressionRearMax: 40,
    expansionFrontMin: 30,
    expansionFrontMax: 50,
    expansionRearMin: 30,
    expansionRearMax: 50,
    camberFrontMin: 0.0,
    camberFrontMax: 5.0,
    camberRearMin: 0.0,
    camberRearMax: 3.5,
    toeFrontMin: -0.5,
    toeFrontMax: 0.5,
    toeRearMin: -0.5,
    toeRearMax: 0.5,
  };

  return [
    { ...readOnly, suspensionType: SuspensionType.STOCK },
    { ...readOnly, suspensionType: SuspensionType.STREET },
    { ...readOnly, suspensionType: SuspensionType.SPORT },
    heightAdjustable,
    fullyCustomizable,
  ];
}

async function main() {
  console.log("Seeding database...");

  for (const car of silvias) {
    await prisma.car.upsert({
      where: { id: car.id },
      update: {
        name: car.name,
        manufacturer: car.manufacturer,
        year: car.year,
        drivetrain: car.drivetrain,
      },
      create: {
        id: car.id,
        name: car.name,
        manufacturer: car.manufacturer,
        year: car.year,
        drivetrain: car.drivetrain,
      },
    });

    const configs = buildTuneConfigs(car);
    for (const config of configs) {
      await prisma.tuneConfig.upsert({
        where: {
          carId_suspensionType: {
            carId: config.carId,
            suspensionType: config.suspensionType,
          },
        },
        update: config,
        create: config,
      });
    }
  }

  console.log("Seeded 6 cars with 30 tune configs.");
}

main()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
