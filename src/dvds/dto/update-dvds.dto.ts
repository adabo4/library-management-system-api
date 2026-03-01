// src/dvds/dto/update-dvd.dto.ts
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateDvdDto {
  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  availableCopies?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalAvailableCopies?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1800)
  publishYear?: number;

  // tu si rozhodni:
  // A) chceš aby update vyžadoval minutes, keď sa posiela:
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  numberOfMinutes?: number;
}
