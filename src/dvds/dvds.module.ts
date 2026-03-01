import { Module } from '@nestjs/common';
import { DvdsController } from './dvds.controller';
import { DvdsService } from './dvds.service';

@Module({
  controllers: [DvdsController],
  providers: [DvdsService]
})
export class DvdsModule {}
