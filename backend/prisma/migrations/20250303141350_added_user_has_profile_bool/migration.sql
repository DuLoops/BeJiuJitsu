/*
  Warnings:

  - You are about to drop the column `startDate` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "startDate";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasPassword" BOOLEAN NOT NULL DEFAULT false;
