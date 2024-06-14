import { CreateAuthDto } from "./dto/create-auth.dto";
import { UserService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../utils/prisma.service";
import { ConfigService } from "@nestjs/config";
import { CryptoService } from "../../lib/aes.lib";
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly prisma;
    private readonly configService;
    private readonly cryptoService;
    constructor(userService: UserService, jwtService: JwtService, prisma: PrismaService, configService: ConfigService, cryptoService: CryptoService);
    createOauthAccount(createAuthDto: CreateAuthDto): Promise<{
        statusCode: number;
        message: string;
        accessToken: string;
    }>;
}
