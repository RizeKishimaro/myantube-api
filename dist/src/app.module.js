"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const jwt_1 = require("@nestjs/jwt");
const stream_module_1 = require("./stream/stream.module");
const video_module_1 = require("./video/video.module");
const prisma_module_1 = require("./utils/prisma.module");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const factory_service_1 = require("./factory/factory.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [".env"],
            }),
            jwt_1.JwtModule.register({
                global: true,
                secret: "aes256-sha",
                signOptions: {
                    expiresIn: "7d",
                },
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 1,
                },
            ]),
            stream_module_1.StreamModule,
            video_module_1.VideoModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, factory_service_1.FactoryService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map