import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { AuthDTO } from "./dto/auth.dto";
import { UserService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../utils/prisma.service";
import { ConfigService } from "@nestjs/config";
import { CryptoService } from "../../lib/aes.lib";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly cryptoService: CryptoService,
  ) {}
  async createOauthAccount(createAuthDto: CreateAuthDto) {
    const user = await this.prisma.oauthUser.create({
      data: createAuthDto,
      select: {
        id: true,
      },
    });
    const encryptedId = this.cryptoService.encrypt(user.id);
    const token = await this.jwtService.signAsync(
      { pass: true, uid: encryptedId },
      { secret: this.configService.get("JWT_SECRET") },
    );
    return {
      statusCode: 201,
      message: "Successfully Created User",
      accessToken: token,
    };
  }
}
