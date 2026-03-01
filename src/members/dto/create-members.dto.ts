import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  personalId: string;

  // z frontendu ti príde string (napr. "1993-09-18")
  // IsDateString akceptuje ISO formát; "1993-09-18" je OK.
  @IsDateString()
  dateOfBirth: string;
}
