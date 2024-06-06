/*
  Warnings:

  - Added the required column `status` to the `Fleet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FleetStatus" AS ENUM ('FORMATION', 'GATHERING', 'TRAVELING', 'ARRIVED');

-- AlterTable
ALTER TABLE "Fleet" ADD COLUMN     "status" "FleetStatus" NOT NULL;
