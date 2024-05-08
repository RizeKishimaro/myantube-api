import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "src/users/users.service";
import { PrismaService } from "src/utils/prisma.service";
import { EmailService } from "src/utils/email.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService,PrismaService,EmailService],
})
export class AuthModule {}
