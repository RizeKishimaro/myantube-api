// user/user.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ActivationDto } from './dto/activation.dto';
import { CreateUserDto } from './dto/createuser.dto';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
   // return { message: 'User created. Check your email for activation link.' };
  }

  @Get('activate/:code')
  async activateAccount(@Param() activationDto: ActivationDto) {
    await this.userService.activateAccount(activationDto.code);
    return { message: 'Account activated successfully.' };
  }
}

