import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "../users/users.service";
import { PrismaService } from "../utils/prisma.service";
import { EmailService } from "../utils/email.service";
import { ResponseHelper } from "../utils/responseHelper.service";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    PrismaService,
    EmailService,
    ResponseHelper,
  ],
})
export class AuthModule {}
