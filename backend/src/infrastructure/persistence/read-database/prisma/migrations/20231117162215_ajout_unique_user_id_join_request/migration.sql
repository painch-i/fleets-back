/*
  Warnings:

  - The primary key for the `JoinRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "JoinRequest" DROP CONSTRAINT "JoinRequest_pkey",
ADD CONSTRAINT "JoinRequest_pkey" PRIMARY KEY ("fleetId", "userId");
