-- CreateEnum
CREATE TYPE "TransportMode" AS ENUM ('BUS', 'RAIL', 'METRO', 'TRAM', 'FUNICULAR');

-- CreateEnum
CREATE TYPE "TransportSubMode" AS ENUM ('REGIONAL_RAIL', 'SUBURBAN_RAILWAY', 'LOCAL', 'RAIL_SHUTTLE');

-- CreateTable
CREATE TABLE "Line" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mode" "TransportMode" NOT NULL,
    "subMode" "TransportSubMode" NOT NULL,
    "pictoUrl" TEXT NOT NULL,

    CONSTRAINT "Line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
