/*
  Warnings:

  - Made the column `administratorId` on table `Fleet` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Fleet" DROP CONSTRAINT "Fleet_administratorId_fkey";

-- AlterTable
ALTER TABLE "Fleet" ALTER COLUMN "administratorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Fleet" ADD CONSTRAINT "Fleet_administratorId_fkey" FOREIGN KEY ("administratorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
