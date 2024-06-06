-- DropForeignKey
ALTER TABLE "Station" DROP CONSTRAINT "Station_lineId_fkey";

-- CreateTable
CREATE TABLE "_LineToStation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LineToStation_AB_unique" ON "_LineToStation"("A", "B");

-- CreateIndex
CREATE INDEX "_LineToStation_B_index" ON "_LineToStation"("B");

-- AddForeignKey
ALTER TABLE "_LineToStation" ADD CONSTRAINT "_LineToStation_A_fkey" FOREIGN KEY ("A") REFERENCES "Line"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LineToStation" ADD CONSTRAINT "_LineToStation_B_fkey" FOREIGN KEY ("B") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;
