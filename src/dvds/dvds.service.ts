import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDvdDto } from './dto/create-dvd.dto';
import { UpdateDvdDto } from './dto/update-dvds.dto';

@Injectable()
export class DvdsService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.dvd.findMany({ orderBy: { id: 'asc' } });
  }

  async getById(id: number) {
    const dvd = await this.prisma.dvd.findUnique({ where: { id } });
    if (!dvd) throw new NotFoundException('DVD not found.');
    return dvd;
  }

  create(dto: CreateDvdDto) {
    return this.prisma.dvd.create({ data: dto });
  }

  async update(id: number, dto: UpdateDvdDto) {
    await this.getById(id);
    return this.prisma.dvd.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.getById(id);
    await this.prisma.dvd.delete({ where: { id } });
    return { statusCode: 200 };
  }
}
