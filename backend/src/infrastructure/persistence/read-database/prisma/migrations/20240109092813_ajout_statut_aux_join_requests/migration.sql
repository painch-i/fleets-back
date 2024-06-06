/*
  Warnings:

  - Added the required column `status` to the `JoinRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JoinRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "JoinRequest" ADD COLUMN     "status" "JoinRequestStatus" NOT NULL;
