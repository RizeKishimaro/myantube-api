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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../utils/prisma.service");
const config_1 = require("@nestjs/config");
const aes_lib_1 = require("../../lib/aes.lib");
let AuthService = class AuthService {
    constructor(userService, jwtService, prisma, configService, cryptoService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.configService = configService;
        this.cryptoService = cryptoService;
    }
    async createOauthAccount(createAuthDto) {
        const user = await this.prisma.oauthUser.create({
            data: createAuthDto,
            select: {
                id: true,
            },
        });
        const encryptedId = this.cryptoService.encrypt(user.id);
        const token = await this.jwtService.signAsync({ pass: true, uid: encryptedId }, { secret: this.configService.get("JWT_SECRET") });
        return {
            statusCode: 201,
            message: "Successfully Created User",
            accessToken: token,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UserService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService,
        config_1.ConfigService,
        aes_lib_1.CryptoService])
], AuthService);
//# sourceMappingURL=auth.service.js.map