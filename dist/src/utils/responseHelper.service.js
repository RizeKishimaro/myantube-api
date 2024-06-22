"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHelper = void 0;
const common_1 = require("@nestjs/common");
class ResponseHelper {
    sendSuccessMessage(message = "Success", statusCode = 200, data) {
        return {
            statusCode,
            message,
            data,
        };
    }
    sendErrorMessage(statusCode = 500, message = "Something went Wrong", code = 0) {
        throw new common_1.HttpException({
            statusCode,
            code,
            message,
        }, statusCode);
    }
}
exports.ResponseHelper = ResponseHelper;
//# sourceMappingURL=responseHelper.service.js.map