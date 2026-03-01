import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Prisma } from '@prisma/client';
import { CreateMemberDto } from './dto/create-members.dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.member.findMany({ orderBy: { id: 'asc' } });
  }

  async getById(id: number) {
    const member = await this.prisma.member.findUnique({ where: { id } });
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  async create(dto: CreateMemberDto) {
    try {
      return await this.prisma.member.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          personalId: dto.personalId,
          dateOfBirth: new Date(dto.dateOfBirth),
        },
      });
    } catch (e) {
      // personalId je @unique → ak duplicitný, Prisma hodí error
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('personalId already exists');
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateMemberDto) {
    await this.getById(id);

    const data: any = { ...dto };
    if (dto.dateOfBirth) data.dateOfBirth = new Date(dto.dateOfBirth);

    try {
      return await this.prisma.member.update({
        where: { id },
        data,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('personalId already exists');
      }
      throw e;
    }
  }

  async remove(id: number) {
    await this.getById(id);
    await this.prisma.member.delete({ where: { id } });
    return { statusCode: 200 };
  }
}
