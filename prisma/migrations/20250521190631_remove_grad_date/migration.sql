/*
  Warnings:

  - You are about to drop the column `graduation_date` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "graduation_date",
DROP COLUMN "start_date";
