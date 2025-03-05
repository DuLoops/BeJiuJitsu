/*
  Warnings:

  - You are about to drop the column `hasPassword` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "hasPassword",
ADD COLUMN     "hasProfile" BOOLEAN NOT NULL DEFAULT false;
