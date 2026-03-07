import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQueueItemDto } from './dto/queue-items.dto';
import { QueueStatus, TitleType } from '@prisma/client';

@Injectable()
export class QueueItemsService {
  constructor(private prisma: PrismaService) {}

  async addToQueue(dto: CreateQueueItemDto) {
    const existing = await this.prisma.queueItem.findFirst({
      where: {
        memberId: dto.memberId,
        titleId: dto.titleId,
        titleType: dto.titleType,
        status: {
          in: [QueueStatus.WAITING, QueueStatus.READY],
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Already in queue');
    }

    return this.prisma.queueItem.create({
      data: {
        memberId: dto.memberId,
        titleId: dto.titleId,
        titleType: dto.titleType,
        status: QueueStatus.WAITING,
      },
    });
  }

  async findAll() {
    const queueItems = await this.prisma.queueItem.findMany({
      where: {
        status: {
          in: [QueueStatus.WAITING, QueueStatus.READY],
        },
      },
      include: {
        member: true,
      },
      orderBy: {
        timeAdded: 'asc',
      },
    });

    const result = await Promise.all(
      queueItems.map(async (item) => {
        let title: { name: string; author: string } | null = null;

        if (item.titleType === TitleType.BOOK) {
          const book = await this.prisma.book.findUnique({
            where: { id: item.titleId },
          });

          if (book) {
            title = {
              name: book.name,
              author: book.author,
            };
          }
        }

        if (item.titleType === TitleType.DVD) {
          const dvd = await this.prisma.dvd.findUnique({
            where: { id: item.titleId },
          });

          if (dvd) {
            title = {
              name: dvd.name,
              author: dvd.author,
            };
          }
        }

        return {
          ...item,
          title,
        };
      }),
    );

    return result;
  }

  async remove(id: number) {
    return this.prisma.queueItem.delete({
      where: { id },
    });
  }
}
