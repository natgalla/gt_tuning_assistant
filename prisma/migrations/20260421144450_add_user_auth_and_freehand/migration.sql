-- DropForeignKey
ALTER TABLE "Tune" DROP CONSTRAINT "Tune_carId_fkey";

-- AlterTable
ALTER TABLE "Tune" ADD COLUMN     "bestLap" TEXT,
ADD COLUMN     "carName" TEXT,
ADD COLUMN     "track" TEXT,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "carId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Tune" ADD CONSTRAINT "Tune_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tune" ADD CONSTRAINT "Tune_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
