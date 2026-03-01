import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { PrismaModule } from '../prisma/prisma.module';
import { DvdsModule } from './dvds/dvds.module';

@Module({
  imports: [
    PrismaModule,
    BooksModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DvdsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
