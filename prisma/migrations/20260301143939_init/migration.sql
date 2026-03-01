/*
  Warnings:

  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dvd` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QueueItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RentalEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_memberId_fkey";

-- DropForeignKey
ALTER TABLE "QueueItem" DROP CONSTRAINT "QueueItem_memberId_fkey";

-- DropForeignKey
ALTER TABLE "RentalEntry" DROP CONSTRAINT "RentalEntry_memberId_fkey";

-- DropTable
DROP TABLE "Book";

-- DropTable
DROP TABLE "Dvd";

-- DropTable
DROP TABLE "Member";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "QueueItem";

-- DropTable
DROP TABLE "RentalEntry";

-- CreateTable
CREATE TABLE "books" (
    "id" SERIAL NOT NULL,
    "author" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "availableCopies" INTEGER NOT NULL,
    "totalAvailableCopies" INTEGER NOT NULL,
    "numberOfPages" INTEGER NOT NULL,
    "isbn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dvds" (
    "id" SERIAL NOT NULL,
    "author" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "availableCopies" INTEGER NOT NULL,
    "totalAvailableCopies" INTEGER NOT NULL,
    "numberOfChapters" INTEGER NOT NULL,
    "numberOfMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dvds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "personalId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "messageContext" TEXT NOT NULL,
    "messageSubject" TEXT NOT NULL,
    "sendDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "queue_items" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "titleId" INTEGER NOT NULL,
    "titleType" "TitleType" NOT NULL,
    "timeAdded" TIMESTAMP(3) NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "queue_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rental_entries" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "titleId" INTEGER NOT NULL,
    "titleType" "TitleType" NOT NULL,
    "rentedDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "timesProlongued" INTEGER DEFAULT 0,
    "isReturned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "rental_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_personalId_key" ON "members"("personalId");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "queue_items" ADD CONSTRAINT "queue_items_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_entries" ADD CONSTRAINT "rental_entries_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
