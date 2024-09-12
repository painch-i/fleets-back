-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notificationToken" TEXT,
ADD COLUMN     "notificationTokenUpdatedAt" TIMESTAMP(3);
