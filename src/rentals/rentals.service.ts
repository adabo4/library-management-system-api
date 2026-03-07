import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRentalsDto } from './dto/create-rentals.dto';
import { UpdateRentalsDto } from './dto/update-rentals.dto';
import { QueueStatus, TitleType } from '@prisma/client';
import { QueueItemsService } from 'src/queue-items/queue-items.service';

@Injectable()
export class RentalsService {
  constructor(
    private prisma: PrismaService,
    private queueItemsService: QueueItemsService,
  ) {}

  private calculateMaxReturnDate(titleType: TitleType): Date {
    const date = new Date();

    if (titleType === TitleType.BOOK) {
      date.setDate(date.getDate() + 21);
    } else {
      date.setDate(date.getDate() + 7);
    }

    return date;
  }

  private async attachTitleToRental<
    T extends {
      id: number;
      memberId: number;
      titleId: number;
      titleType: TitleType;
      rentedDate: Date;
      returnDate: Date | null;
      isReturned: boolean;
      timesProlongued: number | null;
      maxReturnDate?: Date | null;
      member?: unknown;
    },
  >(rental: T) {
    let title: {
      id: number;
      author: string;
      name: string;
      availableCopies: number;
      totalAvailableCopies: number;
    } | null = null;

    if (rental.titleType === TitleType.BOOK) {
      title = await this.prisma.book.findUnique({
        where: { id: rental.titleId },
        select: {
          id: true,
          author: true,
          name: true,
          availableCopies: true,
          totalAvailableCopies: true,
        },
      });
    }

    if (rental.titleType === TitleType.DVD) {
      title = await this.prisma.dvd.findUnique({
        where: { id: rental.titleId },
        select: {
          id: true,
          author: true,
          name: true,
          availableCopies: true,
          totalAvailableCopies: true,
        },
      });
    }

    return {
      ...rental,
      title,
    };
  }

  private async attachTitlesToRentals<
    T extends {
      id: number;
      memberId: number;
      titleId: number;
      titleType: TitleType;
      rentedDate: Date;
      returnDate: Date | null;
      isReturned: boolean;
      timesProlongued: number | null;
      maxReturnDate?: Date | null;
      member?: unknown;
    },
  >(rentals: T[]) {
    const bookIds = rentals
      .filter((r) => r.titleType === TitleType.BOOK)
      .map((r) => r.titleId);

    const dvdIds = rentals
      .filter((r) => r.titleType === TitleType.DVD)
      .map((r) => r.titleId);

    const books = await this.prisma.book.findMany({
      where: { id: { in: bookIds } },
      select: {
        id: true,
        author: true,
        name: true,
        availableCopies: true,
        totalAvailableCopies: true,
      },
    });

    const dvds = await this.prisma.dvd.findMany({
      where: { id: { in: dvdIds } },
      select: {
        id: true,
        author: true,
        name: true,
        availableCopies: true,
        totalAvailableCopies: true,
      },
    });

    const booksMap = new Map(books.map((book) => [book.id, book]));
    const dvdsMap = new Map(dvds.map((dvd) => [dvd.id, dvd]));

    return rentals.map((rental) => {
      const title =
        rental.titleType === TitleType.BOOK
          ? (booksMap.get(rental.titleId) ?? null)
          : (dvdsMap.get(rental.titleId) ?? null);

      return {
        ...rental,
        title,
      };
    });
  }

  async create(dto: CreateRentalsDto) {
    const member = await this.prisma.member.findUnique({
      where: { id: dto.memberId },
    });

    if (!member) {
      throw new NotFoundException(`Member ${dto.memberId} not found`);
    }

    const readyQueueItem = await this.prisma.queueItem.findFirst({
      where: {
        titleId: dto.titleId,
        titleType: dto.titleType,
        status: QueueStatus.READY,
      },
      orderBy: {
        timeAdded: 'asc',
      },
    });

    if (readyQueueItem && readyQueueItem.memberId !== dto.memberId) {
      throw new BadRequestException(
        'This title is reserved for another member in queue.',
      );
    }

    if (dto.titleType === TitleType.BOOK) {
      const book = await this.prisma.book.findUnique({
        where: { id: dto.titleId },
      });

      if (!book) {
        throw new NotFoundException(`Book ${dto.titleId} not found`);
      }

      if (readyQueueItem && readyQueueItem.memberId === dto.memberId) {
        const rental = await this.prisma.$transaction(async (tx) => {
          const createdRental = await tx.rentalEntry.create({
            data: {
              memberId: dto.memberId,
              titleId: dto.titleId,
              titleType: dto.titleType,
              rentedDate: new Date(),
              maxReturnDate: this.calculateMaxReturnDate(dto.titleType),
            },
            include: {
              member: true,
            },
          });

          await tx.queueItem.update({
            where: { id: readyQueueItem.id },
            data: { status: QueueStatus.COMPLETED },
          });

          await tx.book.update({
            where: { id: dto.titleId },
            data: { availableCopies: { decrement: 1 } },
          });

          return createdRental;
        });

        const rentalWithTitle = await this.attachTitleToRental(rental);

        return {
          action: 'rented',
          message: 'Reserved title was successfully rented.',
          data: rentalWithTitle,
        };
      }

      if (book.availableCopies <= 0) {
        const queueItem = await this.queueItemsService.addToQueue({
          memberId: dto.memberId,
          titleId: dto.titleId,
          titleType: dto.titleType,
        });

        return {
          action: 'queued',
          message: 'No available copies. Title was added to queue.',
          data: queueItem,
        };
      }

      const rental = await this.prisma.$transaction(async (tx) => {
        const createdRental = await tx.rentalEntry.create({
          data: {
            memberId: dto.memberId,
            titleId: dto.titleId,
            titleType: dto.titleType,
            rentedDate: new Date(),
            maxReturnDate: this.calculateMaxReturnDate(dto.titleType),
          },
          include: {
            member: true,
          },
        });

        await tx.book.update({
          where: { id: dto.titleId },
          data: { availableCopies: { decrement: 1 } },
        });

        return createdRental;
      });

      const rentalWithTitle = await this.attachTitleToRental(rental);

      return {
        action: 'rented',
        message: 'Title was successfully rented.',
        data: rentalWithTitle,
      };
    }

    const dvd = await this.prisma.dvd.findUnique({
      where: { id: dto.titleId },
    });

    if (!dvd) {
      throw new NotFoundException(`Dvd ${dto.titleId} not found`);
    }

    if (readyQueueItem && readyQueueItem.memberId === dto.memberId) {
      const rental = await this.prisma.$transaction(async (tx) => {
        const createdRental = await tx.rentalEntry.create({
          data: {
            memberId: dto.memberId,
            titleId: dto.titleId,
            titleType: dto.titleType,
            rentedDate: new Date(),
            maxReturnDate: this.calculateMaxReturnDate(dto.titleType),
          },
          include: {
            member: true,
          },
        });

        await tx.queueItem.update({
          where: { id: readyQueueItem.id },
          data: { status: QueueStatus.COMPLETED },
        });

        await tx.dvd.update({
          where: { id: dto.titleId },
          data: { availableCopies: { decrement: 1 } },
        });

        return createdRental;
      });

      const rentalWithTitle = await this.attachTitleToRental(rental);

      return {
        action: 'rented',
        message: 'Reserved title was successfully rented.',
        data: rentalWithTitle,
      };
    }

    if (dvd.availableCopies <= 0) {
      const queueItem = await this.queueItemsService.addToQueue({
        memberId: dto.memberId,
        titleId: dto.titleId,
        titleType: dto.titleType,
      });

      return {
        action: 'queued',
        message: 'No available copies. Title was added to queue.',
        data: queueItem,
      };
    }

    const rental = await this.prisma.$transaction(async (tx) => {
      const createdRental = await tx.rentalEntry.create({
        data: {
          memberId: dto.memberId,
          titleId: dto.titleId,
          titleType: dto.titleType,
          rentedDate: new Date(),
          maxReturnDate: this.calculateMaxReturnDate(dto.titleType),
        },
        include: {
          member: true,
        },
      });

      await tx.dvd.update({
        where: { id: dto.titleId },
        data: { availableCopies: { decrement: 1 } },
      });

      return createdRental;
    });

    const rentalWithTitle = await this.attachTitleToRental(rental);

    return {
      action: 'rented',
      message: 'Title was successfully rented.',
      data: rentalWithTitle,
    };
  }

  async findAll() {
    const rentals = await this.prisma.rentalEntry.findMany({
      include: {
        member: true,
      },
      orderBy: { rentedDate: 'desc' },
    });

    return this.attachTitlesToRentals(rentals);
  }

  async findOne(id: number) {
    const rental = await this.prisma.rentalEntry.findUnique({
      where: { id },
      include: {
        member: true,
      },
    });

    if (!rental) {
      throw new NotFoundException(`RentalEntry ${id} not found`);
    }

    return this.attachTitleToRental(rental);
  }

  async update(id: number, dto: UpdateRentalsDto) {
    await this.findOne(id);

    const updated = await this.prisma.rentalEntry.update({
      where: { id },
      data: dto,
      include: {
        member: true,
      },
    });

    return this.attachTitleToRental(updated);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.rentalEntry.delete({ where: { id } });
  }

  async findNotReturned() {
    const rentals = await this.prisma.rentalEntry.findMany({
      where: { isReturned: false },
      include: {
        member: true,
      },
      orderBy: { rentedDate: 'desc' },
    });

    return this.attachTitlesToRentals(rentals);
  }

  async findNotReturnedByMember(memberId: number) {
    const rentals = await this.prisma.rentalEntry.findMany({
      where: { memberId, isReturned: false },
      include: {
        member: true,
      },
      orderBy: { rentedDate: 'desc' },
    });

    return this.attachTitlesToRentals(rentals);
  }

  async returnTitle(id: number) {
    const existingRental = await this.prisma.rentalEntry.findUnique({
      where: { id },
      include: {
        member: true,
      },
    });

    if (!existingRental) {
      throw new NotFoundException(`RentalEntry ${id} not found`);
    }

    if (existingRental.isReturned) {
      return this.attachTitleToRental(existingRental);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const returnedRental = await tx.rentalEntry.update({
        where: { id },
        data: {
          isReturned: true,
          returnDate: new Date(),
        },
        include: {
          member: true,
        },
      });

      if (returnedRental.titleType === TitleType.BOOK) {
        await tx.book.update({
          where: { id: returnedRental.titleId },
          data: { availableCopies: { increment: 1 } },
        });
      } else {
        await tx.dvd.update({
          where: { id: returnedRental.titleId },
          data: { availableCopies: { increment: 1 } },
        });
      }

      const firstWaitingQueueItem = await tx.queueItem.findFirst({
        where: {
          titleId: returnedRental.titleId,
          titleType: returnedRental.titleType,
          status: QueueStatus.WAITING,
        },
        orderBy: {
          timeAdded: 'asc',
        },
      });

      if (firstWaitingQueueItem) {
        await tx.queueItem.update({
          where: { id: firstWaitingQueueItem.id },
          data: { status: QueueStatus.READY },
        });
      }

      return returnedRental;
    });

    return this.attachTitleToRental(updated);
  }

  async prolongTitle(id: number) {
    const rental = await this.prisma.rentalEntry.findUnique({
      where: { id },
      include: {
        member: true,
      },
    });

    if (!rental) {
      throw new NotFoundException(`RentalEntry ${id} not found`);
    }

    if (rental.timesProlongued >= 2) {
      throw new BadRequestException(
        `This title cannot be prolonged more than 3 times.`,
      );
    }

    const updated = await this.prisma.rentalEntry.update({
      where: { id },
      data: {
        timesProlongued: {
          increment: 1,
        },
      },
      include: {
        member: true,
      },
    });

    return this.attachTitleToRental(updated);
  }
}
