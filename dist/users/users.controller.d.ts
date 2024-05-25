import { ActivationDto } from "./dto/activation.dto";
import { CreateUserDto } from "./dto/createuser.dto";
import { UserService } from "./users.service";
import { Request } from "express";
import { UserAuthDTO } from "./dto/user.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    signUp(createUserDto: CreateUserDto, req: any): Promise<{
        message: string;
    }>;
    activateAccount(activationDto: ActivationDto): Promise<{
        message: string;
    }>;
    generateActivationCode(req: Request, email: string): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    verifyUser(req: Request, body: UserAuthDTO): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}
