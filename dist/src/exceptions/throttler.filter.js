"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrottlerCustomExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
let ThrottlerCustomExceptionFilter = class ThrottlerCustomExceptionFilter extends core_1.BaseExceptionFilter {
    catch(exception, host) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        const now = Date.now();
        let retryAfterMilliseconds = now + 180000;
        if (request.headers["retry-after"]) {
            console.log(request.headers["retry-after"]);
            retryAfterMilliseconds = request.headers["retry-after"];
        }
        const differenceMilliseconds = retryAfterMilliseconds - now;
        const retryAfterSeconds = Math.ceil(differenceMilliseconds / 1000);
        const statusCode = exception.getStatus();
        response
            .setHeader("retry-after", retryAfterMilliseconds.toString())
            .status(statusCode)
            .json({
            statusCode,
            message: `Rate limit exceeded. Please try again in ${retryAfterSeconds} seconds.`,
        })
            .send();
    }
};
exports.ThrottlerCustomExceptionFilter = ThrottlerCustomExceptionFilter;
exports.ThrottlerCustomExceptionFilter = ThrottlerCustomExceptionFilter = __decorate([
    (0, common_1.Catch)(throttler_1.ThrottlerException)
], ThrottlerCustomExceptionFilter);
//# sourceMappingURL=throttler.filter.js.map