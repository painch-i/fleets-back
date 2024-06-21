-- CreateEnum
CREATE TYPE "UserNetwork" AS ENUM ('ETNA');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "network" "UserNetwork" NOT NULL DEFAULT 'ETNA';
