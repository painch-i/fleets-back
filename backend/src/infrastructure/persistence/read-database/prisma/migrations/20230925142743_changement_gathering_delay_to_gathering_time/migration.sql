/*
  Warnings:

  - You are about to drop the column `gatheringDelay` on the `Fleet` table. All the data in the column will be lost.
  - Added the required column `gatheringTime` to the `Fleet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fleet" DROP COLUMN "gatheringDelay",
ADD COLUMN     "gatheringTime" TIMESTAMP(3) NOT NULL;
