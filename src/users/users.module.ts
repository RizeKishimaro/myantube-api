import { Module } from "@nestjs/common";
import { UserService } from "./users.service";
import { UserController } from "./users.controller";
import { PrismaService } from "src/utils/prisma.service";
import { EmailService } from "src/utils/email.service";

@Module({
  controllers: [UserController],
  providers: [UserService,PrismaService,EmailService],
})
export class UsersModule {}
