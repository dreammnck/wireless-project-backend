import { FloorsController } from './floors.controller';
import { FloorsService } from './floors.service';
import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [FloorsController],
  providers: [FloorsService],
})
export class FloorsModule {}
