import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "../users/users.service";
import { PrismaService } from "../utils/prisma.service";
import { EmailService } from "../utils/email.service";
import { ResponseHelper } from "../utils/responseHelper.service";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "./google.strategy";

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'google' })],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    PrismaService,
    EmailService,
    ResponseHelper,
    GoogleStrategy
  ],
})
export class AuthModule {}
