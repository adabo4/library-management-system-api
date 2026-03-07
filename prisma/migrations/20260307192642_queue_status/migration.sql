/*
  Warnings:

  - You are about to drop the column `isResolved` on the `queue_items` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('WAITING', 'READY', 'COMPLETED');

-- DropIndex
DROP INDEX "queue_items_titleId_titleType_isResolved_timeAdded_idx";

-- AlterTable
ALTER TABLE "queue_items" DROP COLUMN "isResolved",
ADD COLUMN     "status" "QueueStatus" NOT NULL DEFAULT 'WAITING';

-- CreateIndex
CREATE INDEX "queue_items_titleId_titleType_timeAdded_idx" ON "queue_items"("titleId", "titleType", "timeAdded");
