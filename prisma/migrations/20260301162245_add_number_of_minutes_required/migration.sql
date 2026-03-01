/*
  Warnings:

  - Made the column `numberOfMinutes` on table `dvds` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "dvds" ALTER COLUMN "numberOfMinutes" SET NOT NULL;
