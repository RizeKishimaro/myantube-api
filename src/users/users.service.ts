// user/user.service.ts
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../utils/prisma.service";
import { CreateUserDto } from "./dto/createuser.dto";
import { EmailService } from "../utils/email.service";
import { randomUUID } from "crypto";
import { ResponseHelper } from "../utils/responseHelper.service";
import { UserAuthDTO } from "./dto/user.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
    private responseHelper: ResponseHelper,
    private prisma: PrismaService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}
  async verifyUser(verifyUserInfo: UserAuthDTO, ip: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: verifyUserInfo.email },
    });
    if (!user) {
      throw new BadRequestException("Username or email invalid");
    }
    const isValid = await bcrypt.compare(
      verifyUserInfo.password,
      user.password,
    );
    if (!isValid) {
      throw new BadRequestException("Username Or Password Incorrect!");
    }
    const token = await this.jwtService.signAsync({
      pass: true,
      userId: user.id,
      ip,
    });
    return this.responseHelper.sendSuccessMessage(
      "Successfully Logged Icon",
      200,
      { accessToken: token },
    );
  }
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
  async resendActivationCode(email: string, hostUrl: string) {
    try {
      const user = await this.prisma.user.findFirst({ where: { email } });
      if (!user) {
        throw new BadRequestException("There Is No Such User with that email");
      } else if (user.isActive) {
        throw new HttpException("The account is Already Activated", 409);
      }
      const code = await this.prisma.activationCode.findFirst({
        where: {
          expiresAt: {
            gte: new Date().toISOString(),
          },
          user: {
            email,
          },
        },
        include: { user: true },
      });
      if (!code) {
        const activationCode = randomUUID();
        const timeLimit = new Date(
          new Date().setHours(new Date().getHours() + 3),
        ).toISOString();
        await this.prisma.activationCode.create({
          data: {
            code: activationCode,
            expiresAt: timeLimit,
            userId: user.id,
          },
        });
        await this.emailService.sendEmail(
          email,
          "Activate Your Account",
          activationCode,
          hostUrl,
        );
      } else {
        await this.emailService.sendEmail(
          user.email,
          "Activate Your Account",
          code.code,
          hostUrl,
        );
      }
      return this.responseHelper.sendSuccessMessage(
        "Email Has being resent Please check the information",
        200,
      );
    } catch (error) {
      throw new InternalServerErrorException({
        message: "Woops!We're Shorry there is Something unexcepted happened.",
        emoji: ":3",
      });
    }
  }
}
