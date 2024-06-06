-- AddForeignKey
ALTER TABLE "Fleet" ADD CONSTRAINT "Fleet_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fleet" ADD CONSTRAINT "Fleet_startStationId_fkey" FOREIGN KEY ("startStationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fleet" ADD CONSTRAINT "Fleet_endStationId_fkey" FOREIGN KEY ("endStationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
