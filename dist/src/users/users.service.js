"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../utils/prisma.service");
const email_service_1 = require("../utils/email.service");
const crypto_1 = require("crypto");
const responseHelper_service_1 = require("../utils/responseHelper.service");
const jwt_1 = require("@nestjs/jwt");
let UserService = class UserService {
    constructor(responseHelper, prisma, emailService, jwtService) {
        this.responseHelper = responseHelper;
        this.prisma = prisma;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }
    async verifyUser(verifyUserInfo, ip) {
        const user = await this.prisma.user.findFirst({
            where: { email: verifyUserInfo.email },
        });
        if (!user) {
            throw new common_1.BadRequestException("Username or email invalid");
        }
        const isValid = await bcrypt.compare(verifyUserInfo.password, user.password);
        if (!isValid) {
            throw new common_1.BadRequestException("Username Or Password Incorrect!");
        }
        const token = await this.jwtService.signAsync({
            pass: true,
            userId: user.id,
            ip,
        });
        return this.responseHelper.sendSuccessMessage("Successfully Logged Icon", 200, { accessToken: token });
    }
    async createUser(createUserDto, hostUrl) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const userInfo = await this.prisma.user.create({
            data: {
                name: createUserDto.name,
                email: createUserDto.email,
                password: hashedPassword,
            },
        });
        const activationCode = (0, crypto_1.randomUUID)();
        const timeLimit = new Date(new Date().setHours(new Date().getHours() + 3)).toISOString();
        await this.prisma.activationCode.create({
            data: { code: activationCode, expiresAt: timeLimit, userId: userInfo.id },
        });
        return await this.emailService.sendEmail(createUserDto.email, "Activate Your Account", activationCode, hostUrl);
    }
    async activateAccount(code) {
        const activationCode = await this.prisma.activationCode.findUnique({
            where: { code },
            include: { user: true },
        });
        if (!activationCode || activationCode.expiresAt < new Date()) {
            throw new common_1.BadRequestException("Invalid or expired activation code.");
        }
        const { id } = await this.prisma.user.update({
            where: { id: activationCode.userId },
            data: { isActive: true },
            select: {
                id: true,
            }
        });
        await this.prisma.activationCode.deleteMany({
            where: { userId: id },
        });
    }
    async resendActivationCode(email, hostUrl, ip) {
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
                throw new common_1.BadRequestException("You have exceeded limit to access activation code");
            }
            const user = await this.prisma.user.findFirst({ where: { email } });
            console.log(user);
            if (!user) {
                throw new common_1.BadRequestException("There is no such user with that email");
            }
            if (user.isActive) {
                throw new common_1.HttpException("The account is already activated", 409);
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
            const activationCode = (0, crypto_1.randomUUID)();
            const timeLimit = new Date(new Date().setHours(new Date().getHours() + 3)).toISOString();
            await this.prisma.activationCode.create({
                data: {
                    ip,
                    code: activationCode,
                    expiresAt: timeLimit,
                    userId: user.id,
                },
            });
            return this.responseHelper.sendSuccessMessage("Email Has being resent Please check the information", 200);
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                message: error.resoponse || "Woops!We're Shorry there is Something unexcepted happened.",
            }, error.status || 500);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [responseHelper_service_1.ResponseHelper,
        prisma_service_1.PrismaService,
        email_service_1.EmailService,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=users.service.js.map