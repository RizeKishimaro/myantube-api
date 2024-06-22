"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const users_service_1 = require("../users/users.service");
const prisma_service_1 = require("../utils/prisma.service");
const email_service_1 = require("../utils/email.service");
const responseHelper_service_1 = require("../utils/responseHelper.service");
const passport_1 = require("@nestjs/passport");
const google_strategy_1 = require("./google.strategy");
const aes_lib_1 = require("../../lib/aes.lib");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [passport_1.PassportModule.register({ defaultStrategy: "google" })],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            users_service_1.UserService,
            prisma_service_1.PrismaService,
            email_service_1.EmailService,
            responseHelper_service_1.ResponseHelper,
            google_strategy_1.GoogleStrategy,
            aes_lib_1.CryptoService,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map