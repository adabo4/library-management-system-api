/*
  Warnings:

  - Made the column `timesProlongued` on table `rental_entries` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "sendDate" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "queue_items" ALTER COLUMN "timeAdded" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "rental_entries" ADD COLUMN     "maxReturnDate" TIMESTAMP(3),
ALTER COLUMN "rentedDate" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "timesProlongued" SET NOT NULL;
