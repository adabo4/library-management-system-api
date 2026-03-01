-- CreateEnum
CREATE TYPE "TitleType" AS ENUM ('BOOK', 'DVD');

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "author" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "availableCopies" INTEGER NOT NULL,
    "totalAvailableCopies" INTEGER NOT NULL,
    "numberOfPages" INTEGER NOT NULL,
    "isbn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dvd" (
    "id" SERIAL NOT NULL,
    "author" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "availableCopies" INTEGER NOT NULL,
    "totalAvailableCopies" INTEGER NOT NULL,
    "numberOfChapters" INTEGER NOT NULL,
    "numberOfMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dvd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "personalId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "messageContext" TEXT NOT NULL,
    "messageSubject" TEXT NOT NULL,
    "sendDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueItem" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "titleId" INTEGER NOT NULL,
    "titleType" "TitleType" NOT NULL,
    "timeAdded" TIMESTAMP(3) NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "QueueItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalEntry" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "titleId" INTEGER NOT NULL,
    "titleType" "TitleType" NOT NULL,
    "rentedDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "timesProlongued" INTEGER DEFAULT 0,
    "isReturned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RentalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_personalId_key" ON "Member"("personalId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueItem" ADD CONSTRAINT "QueueItem_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalEntry" ADD CONSTRAINT "RentalEntry_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
