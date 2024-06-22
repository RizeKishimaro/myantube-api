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

    const {id}= await this.prisma.user.update({
      where: { id: activationCode.userId },
      data: { isActive: true },
      select:{
        id: true,
      }
    });

    await this.prisma.activationCode.deleteMany({
      where: { userId: id },
    });
  }
  async resendActivationCode(email: string, hostUrl: string,ip: string) {
    try {
      const todayDate = new Date();
const startOfDay = new Date(todayDate.setHours(0, 0, 0, 0)).toISOString();
const endOfDay = new Date(todayDate.setHours(23, 59, 59, 999)).toISOString();

const reqCount = await this.prisma.activationCode.count({
  where: {
    createdAt: {
      gte: startOfDay,
      lt: endOfDay
    }
  }
});

if (reqCount > 2) {
  throw new BadRequestException("You have exceeded limit to access activation code");
}

const user = await this.prisma.user.findFirst({ where: { email } });
      console.log(user)
if (!user) {
  throw new BadRequestException("There is no such user with that email");
}
if (user.isActive) {
  throw new HttpException("The account is already activated", 409);
}

 await this.prisma.activationCode.findFirst({
  where: {
    expiresAt: {
      gte: new Date().toISOString(),
    },
    user: {
      email,
    }
  },
  include: { user: true }
});
        const activationCode = randomUUID();
        const timeLimit = new Date(
          new Date().setHours(new Date().getHours() + 3),
        ).toISOString();
        await this.prisma.activationCode.create({
          data: {
            ip,
            code: activationCode,
            expiresAt: timeLimit,
            userId: user.id,
          },
        });
       // await this.emailService.sendEmail(
         // email,
          //"Activate Your Account",
          //activationCode,
          //hostUrl,
        //);
      return this.responseHelper.sendSuccessMessage(
        "Email Has being resent Please check the information",
        200,
      );
    } catch (error) {
      console.error(error)
      throw new HttpException({
        message: error.resoponse || "Woops!We're Shorry there is Something unexcepted happened.",
      },error.status || 500);
    }
  }
}
