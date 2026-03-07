import { Module } from '@nestjs/common';
import { QueueItemsController } from './queue-items.controller';
import { QueueItemsService } from './queue-items.service';

@Module({
  controllers: [QueueItemsController],
  providers: [QueueItemsService],
  exports: [QueueItemsService],
})
export class QueueItemsModule {}
