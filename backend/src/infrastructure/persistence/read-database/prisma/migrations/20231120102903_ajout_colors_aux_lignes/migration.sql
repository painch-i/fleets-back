/*
  Warnings:

  - Added the required column `color` to the `Line` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textColor` to the `Line` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Line" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "textColor" TEXT NOT NULL;
