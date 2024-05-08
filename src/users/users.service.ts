// user/user.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/utils/prisma.service';
import { CreateUserDto } from './dto/createuser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      },
    });
  }

  async activateAccount(code: string) {
    const activationCode = await this.prisma.activationCode.findUnique({
      where: {code},
      include: { user: true },
    });

    if (!activationCode || activationCode.expiresAt < new Date()) {
      throw new Error('Invalid or expired activation code.');
    }

    await this.prisma.user.update({
      where: { id: activationCode.userId },
      data: { isActive: true },
    });

    await this.prisma.activationCode.delete({ where: { id: activationCode.id } });
  }
}

