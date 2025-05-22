/*
  Warnings:

  - Added the required column `created_at` to the `Resource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
