/*
  Warnings:

  - You are about to drop the column `numberOfChapters` on the `dvds` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfMinutes` on the `dvds` table. All the data in the column will be lost.
  - Added the required column `publishYear` to the `dvds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dvds" DROP COLUMN "numberOfChapters",
DROP COLUMN "numberOfMinutes",
ADD COLUMN     "publishYear" INTEGER NOT NULL;
