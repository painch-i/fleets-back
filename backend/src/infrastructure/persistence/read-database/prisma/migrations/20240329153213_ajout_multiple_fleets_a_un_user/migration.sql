/*
  Warnings:

  - You are about to drop the column `administratedFleetId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fleetId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_fleetId_fkey";

-- DropIndex
DROP INDEX "Fleet_administratorId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "administratedFleetId",
DROP COLUMN "fleetId";

-- CreateTable
CREATE TABLE "UsersOnFleets" (
    "hasConfirmedHisPresence" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "fleetId" TEXT NOT NULL,

    CONSTRAINT "UsersOnFleets_pkey" PRIMARY KEY ("userId","fleetId")
);

-- AddForeignKey
ALTER TABLE "UsersOnFleets" ADD CONSTRAINT "UsersOnFleets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnFleets" ADD CONSTRAINT "UsersOnFleets_fleetId_fkey" FOREIGN KEY ("fleetId") REFERENCES "Fleet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
