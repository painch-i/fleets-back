/*
  Warnings:

  - Added the required column `departureTime` to the `Fleet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gatheringDelay` to the `Fleet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fleet" ADD COLUMN     "departureTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gatheringDelay" INTEGER NOT NULL;
