import { Module } from '@nestjs/common';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';
import { QueueItemsModule } from 'src/queue-items/queue-items.module';

@Module({
  imports: [QueueItemsModule],
  controllers: [RentalsController],
  providers: [RentalsService],
})
export class RentalsModule {}
