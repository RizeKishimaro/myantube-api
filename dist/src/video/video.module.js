"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoModule = void 0;
const common_1 = require("@nestjs/common");
const video_service_1 = require("./video.service");
const video_controller_1 = require("./video.controller");
const prisma_service_1 = require("../utils/prisma.service");
const responseHelper_service_1 = require("../utils/responseHelper.service");
const factory_service_1 = require("../factory/factory.service");
let VideoModule = class VideoModule {
};
exports.VideoModule = VideoModule;
exports.VideoModule = VideoModule = __decorate([
    (0, common_1.Module)({
        controllers: [video_controller_1.VideoController],
        providers: [video_service_1.VideoService, prisma_service_1.PrismaService, responseHelper_service_1.ResponseHelper, factory_service_1.FactoryService],
    })
], VideoModule);
//# sourceMappingURL=video.module.js.map