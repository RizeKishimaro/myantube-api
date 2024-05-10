// user/user.service.ts
import { BadRequestException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../utils/prisma.service";
import { CreateUserDto } from "./dto/createuser.dto";
import { EmailService } from "../utils/email.service";
import { randomUUID } from "crypto";
import { ResponseHelper } from "../utils/responseHelper.service";

@Injectable()
export class UserService {
  constructor(
    private responseHelper: ResponseHelper,
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async createUser(createUserDto: CreateUserDto, hostUrl: string) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const userInfo = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      },
    });
    const activationCode = randomUUID();
    const timeLimit = new Date(
      new Date().setHours(new Date().getHours() + 3),
    ).toISOString();
    await this.prisma.activationCode.create({
      data: { code: activationCode, expiresAt: timeLimit, userId: userInfo.id },
    });
    return await this.emailService.sendEmail(
      createUserDto.email,
      "Activate Your Account",
      activationCode,
      hostUrl,
    );
  }

  async activateAccount(code: string) {
    const activationCode = await this.prisma.activationCode.findUnique({
      where: { code },
      include: { user: true },
    });

    if (!activationCode || activationCode.expiresAt < new Date()) {
      throw new BadRequestException("Invalid or expired activation code.");
    }

    await this.prisma.user.update({
      where: { id: activationCode.userId },
      data: { isActive: true },
    });

    await this.prisma.activationCode.delete({
      where: { id: activationCode.id },
    });
  }
  resendActivationCode(email: string) {
    const code = this.prisma.activationCode.findMany({
      where: {
        user: {
          email,
        },
      },
      include: { user: true },
    });
    if (!code) {
      console.log("not existed");
      this.responseHelper.sendErrorMessage(400, "Code Already Exist", 10);
    } else {
      console.log("existes ");
    }
    return this.responseHelper.sendSuccessMessage(
      "Email Has being resent Please check the information",
      200,
    );
  }
}
