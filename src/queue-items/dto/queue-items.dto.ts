import { TitleType } from '@prisma/client';

export class CreateQueueItemDto {
  memberId: number;
  titleId: number;
  titleType: TitleType;
}
