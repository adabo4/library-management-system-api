import { IsEnum, IsInt, Min } from 'class-validator';
import { TitleType } from '@prisma/client';

export class CreateRentalsDto {
  @IsInt()
  @Min(1)
  memberId: number;

  @IsInt()
  @Min(1)
  titleId: number;

  @IsEnum(TitleType)
  titleType: TitleType; // BOOK | DVD
}
