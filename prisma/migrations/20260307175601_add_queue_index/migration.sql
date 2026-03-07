/*
  Warnings:

  - A unique constraint covering the columns `[memberId,titleId,titleType]` on the table `queue_items` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "queue_items_titleId_titleType_isResolved_timeAdded_idx" ON "queue_items"("titleId", "titleType", "isResolved", "timeAdded");

-- CreateIndex
CREATE UNIQUE INDEX "queue_items_memberId_titleId_titleType_key" ON "queue_items"("memberId", "titleId", "titleType");
