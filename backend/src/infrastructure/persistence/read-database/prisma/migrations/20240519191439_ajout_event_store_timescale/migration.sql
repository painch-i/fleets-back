-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id", "createdAt")
);

-- CreateIndex
CREATE INDEX "Event_createdAt_idx" ON "Event"("createdAt");

-- CreateIndex
CREATE INDEX "Event_eventType_idx" ON "Event"("eventType");

-- CreateIndex
CREATE INDEX "Event_aggregateId_aggregateType_idx" ON "Event"("aggregateId", "aggregateType");

-- Activer l'extension TimescaleDB
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Créer une hypertable TimescaleDB à partir de la table "Event"
SELECT create_hypertable('"Event"', 'createdAt');
