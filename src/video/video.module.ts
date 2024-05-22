import { Module } from "@nestjs/common";
import { VideoService } from "./video.service";
import { VideoController } from "./video.controller";
import { PrismaService } from "../utils/prisma.service";
import { ResponseHelper } from "../utils/responseHelper.service";

@Module({
  controllers: [VideoController],
  providers: [VideoService, PrismaService, ResponseHelper],
})
export class VideoModule {}
