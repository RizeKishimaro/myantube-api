import { PrismaService } from "../utils/prisma.service";
import { CreateUserDto } from "./dto/createuser.dto";
import { EmailService } from "../utils/email.service";
import { ResponseHelper } from "../utils/responseHelper.service";
import { UserAuthDTO } from "./dto/user.dto";
import { JwtService } from "@nestjs/jwt";
export declare class UserService {
    private responseHelper;
    private prisma;
    private emailService;
    private jwtService;
    constructor(responseHelper: ResponseHelper, prisma: PrismaService, emailService: EmailService, jwtService: JwtService);
    verifyUser(verifyUserInfo: UserAuthDTO, ip: string): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    createUser(createUserDto: CreateUserDto, hostUrl: string): Promise<unknown>;
    activateAccount(code: string): Promise<void>;
    resendActivationCode(email: string, hostUrl: string, ip: string): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}
