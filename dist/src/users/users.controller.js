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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const activation_dto_1 = require("./dto/activation.dto");
const createuser_dto_1 = require("./dto/createuser.dto");
const users_service_1 = require("./users.service");
const throttler_1 = require("@nestjs/throttler");
const throttler_filter_1 = require("../exceptions/throttler.filter");
const user_dto_1 = require("./dto/user.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async signUp(createUserDto, req) {
        const hosturl = req.protocol + "://" + req.get("host");
        await this.userService.createUser(createUserDto, hosturl);
        return { message: "User created. Check your email for activation link." };
    }
    async activateAccount(activationDto) {
        await this.userService.activateAccount(activationDto.code);
        return { message: "Account activated successfully." };
    }
    async generateActivationCode(req, body) {
        const hosturl = req.protocol + "://" + req.get("host");
        const ip = req.ip;
        return await this.userService.resendActivationCode(body.email, hosturl, ip);
    }
    async verifyUser(req, body) {
        const ip = req.ip;
        return this.userService.verifyUser(body, ip);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)("signup"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createuser_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signUp", null);
__decorate([
    (0, common_1.Get)("activate/:code"),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [activation_dto_1.ActivationDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "activateAccount", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, common_1.Post)("regenerate-code"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "generateActivationCode", null);
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UserAuthDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.UseFilters)(new throttler_filter_1.ThrottlerCustomExceptionFilter()),
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [users_service_1.UserService])
], UserController);
//# sourceMappingURL=users.controller.js.map