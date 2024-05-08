import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "src/users/users.service";
import { PrismaService } from "src/utils/prisma.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService,PrismaService],
})
export class AuthModule {}
