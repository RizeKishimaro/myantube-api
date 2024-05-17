// user/user.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  UseGuards,
  UseFilters,
} from "@nestjs/common";
import { ActivationDto } from "./dto/activation.dto";
import { CreateUserDto } from "./dto/createuser.dto";
import { UserService } from "./users.service";
import { ThrottlerGuard } from "@nestjs/throttler";
import { ThrottlerCustomExceptionFilter } from "../exceptions/throttler.filter";
import { Request } from "express";
import { UserAuthDTO } from "./dto/user.dto";

@UseFilters(new ThrottlerCustomExceptionFilter())
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("signup")
  async signUp(@Body() createUserDto: CreateUserDto, @Req() req) {
    const hosturl = req.protocol + "://" + req.get("host");
    await this.userService.createUser(createUserDto, hosturl);
    return { message: "User created. Check your email for activation link." };
  }

  @Get("activate/:code")
  async activateAccount(@Param() activationDto: ActivationDto) {
    await this.userService.activateAccount(activationDto.code);
    return { message: "Account activated successfully." };
  }

  @UseGuards(ThrottlerGuard)
  @Post("regenerate-code")
  async generateActivationCode(@Req() req: Request, email: string) {
    const hosturl = req.protocol + "://" + req.get("host");
    return await this.userService.resendActivationCode(email, hosturl);
  }
  @Post("login")
  async verifyUser(@Req() req: Request,@Body() body:UserAuthDTO){
    const ip = req.ip;
    return this.userService.verifyUser(body,ip)
  }
}
