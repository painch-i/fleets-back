/*
  Warnings:

  - Added the required column `userId` to the `JoinRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JoinRequest" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
