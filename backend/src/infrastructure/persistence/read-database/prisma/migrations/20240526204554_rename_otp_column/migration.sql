/*
  Warnings:

  - You are about to drop the column `otp` on the `OneTimePassword` table. All the data in the column will be lost.
  - Added the required column `code` to the `OneTimePassword` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "OneTimePassword_otp_idx";

-- AlterTable
ALTER TABLE "OneTimePassword" DROP COLUMN "otp",
ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "OneTimePassword_code_idx" ON "OneTimePassword"("code");
