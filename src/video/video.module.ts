import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { PrismaService } from '../utils/prisma.service';

@Module({
  controllers: [VideoController],
  providers: [VideoService, PrismaService],
})
export class VideoModule {}
