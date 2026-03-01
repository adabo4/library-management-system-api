import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class BookDto {
  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
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
  @Min(1)
  numberOfPages: number;

  @IsString()
  @IsNotEmpty()
  isbn: string;
}
