import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookDto } from './dto/book.dto';

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

  create(dto: BookDto) {
    return this.prisma.book.create({ data: dto });
  }

  async update(id: number, dto: BookDto) {
    await this.getById(id);
    return this.prisma.book.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.getById(id);
    await this.prisma.book.delete({ where: { id } });
    return { statusCode: 200 };
  }
}
