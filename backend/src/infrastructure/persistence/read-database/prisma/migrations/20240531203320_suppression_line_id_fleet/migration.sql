/*
  Warnings:

  - You are about to drop the column `lineId` on the `Fleet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Fleet" DROP CONSTRAINT "Fleet_lineId_fkey";

-- AlterTable
ALTER TABLE "Fleet" DROP COLUMN "lineId";
