/*
  Warnings:

  - Added the required column `endStationId` to the `Fleet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lineId` to the `Fleet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startStationId` to the `Fleet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fleet" ADD COLUMN     "endStationId" TEXT NOT NULL,
ADD COLUMN     "lineId" TEXT NOT NULL,
ADD COLUMN     "startStationId" TEXT NOT NULL;
