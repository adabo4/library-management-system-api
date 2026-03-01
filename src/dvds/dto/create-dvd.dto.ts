// src/dvds/dto/create-dvd.dto.ts
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateDvdDto {
  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  availableCopies: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalAvailableCopies: number;

  @Type(() => Number)
  @IsInt()
  @Min(1800)
  publishYear: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  numberOfMinutes?: number;
}
