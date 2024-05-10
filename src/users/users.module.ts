import { Module } from "@nestjs/common";
import { UserService } from "./users.service";
import { UserController } from "./users.controller";
import { PrismaService } from "../utils/prisma.service";
import { EmailService } from "../utils/email.service";
import { ResponseHelper } from "../utils/responseHelper.service";

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, EmailService, ResponseHelper],
})
export class UsersModule {}
