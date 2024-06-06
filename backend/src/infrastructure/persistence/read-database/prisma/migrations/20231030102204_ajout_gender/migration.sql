/*
  Warnings:

  - Added the required column `genderConstraint` to the `Fleet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isJoinable` to the `Fleet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "GenderConstraint" AS ENUM ('MALE_ONLY', 'FEMALE_ONLY', 'NO_CONSTRAINT');

-- AlterTable
ALTER TABLE "Fleet" ADD COLUMN     "genderConstraint" "GenderConstraint" NOT NULL,
ADD COLUMN     "isJoinable" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" "Gender" NOT NULL;
