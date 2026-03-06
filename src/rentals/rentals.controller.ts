import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalsDto } from './dto/create-rentals.dto';
import { UpdateRentalsDto } from './dto/update-rentals.dto';

@Controller('api/rentalEntries')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  create(@Body() dto: CreateRentalsDto) {
    return this.rentalsService.create(dto);
  }

  @Get()
  findAll() {
    return this.rentalsService.findAll();
  }

  @Get('notReturned')
  findNotReturned() {
    return this.rentalsService.findNotReturned();
  }

  @Get('notReturned/:memberId')
  findNotReturnedByMember(@Param('memberId') memberId: string) {
    return this.rentalsService.findNotReturnedByMember(Number(memberId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentalsService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRentalsDto) {
    return this.rentalsService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentalsService.remove(Number(id));
  }

  @Put('returnTitle/:id')
  returnTitle(@Param('id') id: string) {
    return this.rentalsService.returnTitle(Number(id));
  }

  @Put('prolongTitle/:id')
  prolongTitle(@Param('id') id: string) {
    return this.rentalsService.prolongTitle(Number(id));
  }
}
