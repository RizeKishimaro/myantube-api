import { Module } from "@nestjs/common";
import { StreamService } from "./stream.service";
import { StreamController } from "./stream.controller";
import { PrismaService } from "../utils/prisma.service";

@Module({
  controllers: [StreamController],
  providers: [StreamService, PrismaService],
})
export class StreamModule {}
