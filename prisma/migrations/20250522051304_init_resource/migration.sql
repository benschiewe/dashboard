/*
  Warnings:

  - You are about to drop the column `created_at` on the `Resource` table. All the data in the column will be lost.
  - Added the required column `last_edited` to the `Resource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professor` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "created_at",
ADD COLUMN     "last_edited" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "professor" TEXT NOT NULL;
