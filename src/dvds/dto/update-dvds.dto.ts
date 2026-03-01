// src/dvds/dto/update-dvd.dto.ts
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UpdateDvdDto {
  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  availableCopies: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalAvailableCopies: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1800)
  publishYear: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  numberOfMinutes: number;
}
