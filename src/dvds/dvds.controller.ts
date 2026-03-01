import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { DvdsService } from './dvds.service';
import { UpdateDvdDto } from './dto/update-dvds.dto';
import { CreateDvdDto } from './dto/create-dvd.dto';

@Controller('api/Dvds')
export class DvdsController {
  constructor(private readonly dvdsService: DvdsService) {}

  @Get()
  getAll() {
    return this.dvdsService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.dvdsService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateDvdDto) {
    return this.dvdsService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDvdDto) {
    return this.dvdsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.dvdsService.remove(id);
  }
}
