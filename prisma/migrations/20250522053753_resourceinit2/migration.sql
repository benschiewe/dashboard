/*
  Warnings:

  - You are about to drop the column `resource_type` on the `Resource` table. All the data in the column will be lost.
  - Added the required column `course_number` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "resource_type",
ADD COLUMN     "course_number" TEXT NOT NULL;
