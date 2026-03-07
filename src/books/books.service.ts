import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.book.findMany({ orderBy: { id: 'asc' } });
  }

  async getById(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  create(dto: CreateBookDto) {
    return this.prisma.book.create({ data: dto });
  }

  async update(id: number, dto: UpdateBookDto) {
    await this.getById(id);
    return this.prisma.book.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const activeRental = await this.prisma.rentalEntry.findFirst({
      where: {
        titleId: id,
        titleType: 'BOOK',
        isReturned: false,
      },
    });

    if (activeRental) {
      throw new BadRequestException(
        'This book is currently rented and cannot be deleted.',
      );
    }
    await this.getById(id);
    await this.prisma.book.delete({ where: { id } });
    return { statusCode: 200 };
  }
}
