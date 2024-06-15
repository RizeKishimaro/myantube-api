import { Module } from "@nestjs/common";
import { StreamService } from "./stream.service";
import { StreamController } from "./stream.controller";
import { PrismaService } from "../utils/prisma.service";
import { FactoryService } from "../factory/factory.service";

@Module({
  controllers: [StreamController],
  providers: [StreamService, PrismaService,FactoryService],
})
export class StreamModule {}
