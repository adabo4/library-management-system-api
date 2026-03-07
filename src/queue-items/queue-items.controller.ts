import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { QueueItemsService } from './queue-items.service';
import { CreateQueueItemDto } from './dto/queue-items.dto';

@Controller('api/queueItems')
export class QueueItemsController {
  constructor(private readonly queueItemsService: QueueItemsService) {}

  @Post()
  addToQueue(@Body() dto: CreateQueueItemDto) {
    return this.queueItemsService.addToQueue(dto);
  }

  @Get()
  findAll() {
    return this.queueItemsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.queueItemsService.remove(id);
  }
}
