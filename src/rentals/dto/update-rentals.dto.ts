import { PartialType } from '@nestjs/mapped-types';
import { CreateRentalsDto } from './create-rentals.dto';

export class UpdateRentalsDto extends PartialType(CreateRentalsDto) {}
