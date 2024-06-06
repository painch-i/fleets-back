/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `encryptedPassword` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isPreRegistered` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isRegistered` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationStatus` on the `User` table. All the data in the column will be lost.
  - Added the required column `isOnboarded` to the `User` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable
ALTER TABLE "Fleet" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "JoinRequest" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "encryptedPassword",
DROP COLUMN "isPreRegistered",
DROP COLUMN "isRegistered",
DROP COLUMN "verificationStatus",
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastName" TEXT,
ALTER COLUMN "gender" DROP NOT NULL;
ALTER TABLE "User" ALTER COLUMN "isOnboarded" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserMembership" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "OneTimePassword" (
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OneTimePassword_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE INDEX "OneTimePassword_otp_idx" ON "OneTimePassword"("otp");
