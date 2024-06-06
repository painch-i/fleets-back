/*
  Warnings:

  - Added the required column `linesTaken` to the `Fleet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fleet" ADD COLUMN "linesTaken" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "Fleet" ALTER COLUMN "linesTaken" DROP DEFAULT;
