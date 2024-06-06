/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Line` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Line_externalId_key" ON "Line"("externalId");
