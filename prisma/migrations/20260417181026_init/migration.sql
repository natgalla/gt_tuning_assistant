-- CreateEnum
CREATE TYPE "SuspensionType" AS ENUM ('STOCK', 'STREET', 'SPORT', 'HEIGHT_ADJUSTABLE_SPORT', 'FULLY_CUSTOMIZABLE');

-- CreateEnum
CREATE TYPE "TireType" AS ENUM ('COMFORT_HARD', 'COMFORT_MEDIUM', 'COMFORT_SOFT', 'SPORT_HARD', 'SPORT_MEDIUM', 'SPORT_SOFT', 'RACING_HARD', 'RACING_MEDIUM', 'RACING_SOFT', 'INTERMEDIATE', 'WET', 'DIRT', 'SNOW');

-- CreateTable
CREATE TABLE "Car" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "year" INTEGER,
    "drivetrain" TEXT NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TuneConfig" (
    "id" SERIAL NOT NULL,
    "carId" INTEGER NOT NULL,
    "suspensionType" "SuspensionType" NOT NULL,
    "tireType" "TireType" NOT NULL,
    "weightMin" INTEGER,
    "weightMax" INTEGER,
    "bodyHeightFrontMin" DOUBLE PRECISION,
    "bodyHeightFrontMax" DOUBLE PRECISION,
    "bodyHeightRearMin" DOUBLE PRECISION,
    "bodyHeightRearMax" DOUBLE PRECISION,
    "natFreqFrontMin" DOUBLE PRECISION,
    "natFreqFrontMax" DOUBLE PRECISION,
    "natFreqRearMin" DOUBLE PRECISION,
    "natFreqRearMax" DOUBLE PRECISION,
    "antiRollFrontMin" INTEGER,
    "antiRollFrontMax" INTEGER,
    "antiRollRearMin" INTEGER,
    "antiRollRearMax" INTEGER,
    "compressionFrontMin" INTEGER,
    "compressionFrontMax" INTEGER,
    "compressionRearMin" INTEGER,
    "compressionRearMax" INTEGER,
    "expansionFrontMin" INTEGER,
    "expansionFrontMax" INTEGER,
    "expansionRearMin" INTEGER,
    "expansionRearMax" INTEGER,
    "camberFrontMin" DOUBLE PRECISION,
    "camberFrontMax" DOUBLE PRECISION,
    "camberRearMin" DOUBLE PRECISION,
    "camberRearMax" DOUBLE PRECISION,
    "toeFrontMin" DOUBLE PRECISION,
    "toeFrontMax" DOUBLE PRECISION,
    "toeRearMin" DOUBLE PRECISION,
    "toeRearMax" DOUBLE PRECISION,
    "weightDefault" INTEGER,
    "horsePowerDefault" INTEGER,
    "bodyHeightFrontDefault" DOUBLE PRECISION,
    "bodyHeightRearDefault" DOUBLE PRECISION,
    "natFreqFrontDefault" DOUBLE PRECISION,
    "natFreqRearDefault" DOUBLE PRECISION,
    "antiRollFrontDefault" INTEGER,
    "antiRollRearDefault" INTEGER,
    "compressionFrontDefault" INTEGER,
    "compressionRearDefault" INTEGER,
    "expansionFrontDefault" INTEGER,
    "expansionRearDefault" INTEGER,
    "camberFrontDefault" DOUBLE PRECISION,
    "camberRearDefault" DOUBLE PRECISION,
    "toeFrontDefault" DOUBLE PRECISION,
    "toeRearDefault" DOUBLE PRECISION,
    "lsdInitFrontDefault" INTEGER,
    "lsdAccelFrontDefault" INTEGER,
    "lsdDecelFrontDefault" INTEGER,
    "lsdInitRearDefault" INTEGER,
    "lsdAccelRearDefault" INTEGER,
    "lsdDecelRearDefault" INTEGER,

    CONSTRAINT "TuneConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tune" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "carId" INTEGER NOT NULL,
    "suspensionType" "SuspensionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "weight" INTEGER,
    "horsePower" INTEGER,
    "bodyHeightFront" DOUBLE PRECISION,
    "bodyHeightRear" DOUBLE PRECISION,
    "natFreqFront" DOUBLE PRECISION,
    "natFreqRear" DOUBLE PRECISION,
    "antiRollFront" INTEGER,
    "antiRollRear" INTEGER,
    "compressionFront" INTEGER,
    "compressionRear" INTEGER,
    "expansionFront" INTEGER,
    "expansionRear" INTEGER,
    "camberFront" DOUBLE PRECISION,
    "camberRear" DOUBLE PRECISION,
    "toeFront" DOUBLE PRECISION,
    "toeRear" DOUBLE PRECISION,
    "lsdInitFront" INTEGER,
    "lsdAccelFront" INTEGER,
    "lsdDecelFront" INTEGER,
    "lsdInitRear" INTEGER,
    "lsdAccelRear" INTEGER,
    "lsdDecelRear" INTEGER,

    CONSTRAINT "Tune_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TuneConfig_carId_suspensionType_key" ON "TuneConfig"("carId", "suspensionType");

-- AddForeignKey
ALTER TABLE "TuneConfig" ADD CONSTRAINT "TuneConfig_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tune" ADD CONSTRAINT "Tune_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
