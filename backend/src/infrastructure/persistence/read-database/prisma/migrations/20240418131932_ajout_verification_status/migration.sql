/*
  Warnings:

  - Added the required column `verificationStatus` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('NOT_STARTED', 'PENDING', 'VERIFIED', 'INVALID');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'NOT_STARTED';

ALTER TABLE "User" ALTER COLUMN "verificationStatus" DROP DEFAULT;
