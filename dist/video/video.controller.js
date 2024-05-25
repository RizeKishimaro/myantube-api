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
exports.VideoController = void 0;
const common_1 = require("@nestjs/common");
const video_service_1 = require("./video.service");
const create_video_dto_1 = require("./dto/create-video.dto");
const update_video_dto_1 = require("./dto/update-video.dto");
const responseHelper_service_1 = require("../utils/responseHelper.service");
const seeder_service_1 = require("../utils/seeder.service");
const client_1 = require("@prisma/client");
let VideoController = class VideoController {
    constructor(videoService, responseHelper) {
        this.videoService = videoService;
        this.responseHelper = responseHelper;
    }
    create(createVideoDto) {
        return this.videoService.create(createVideoDto);
    }
    findAll() {
        return this.videoService.findAll();
    }
    seedVideo() {
        const prisma = new client_1.PrismaClient();
        (0, seeder_service_1.default)()
            .catch((e) => {
            console.error(e);
            process.exit(1);
        })
            .finally(async () => {
            await prisma.$disconnect();
            return "Successfully seeded";
        });
    }
    async findOne(id) {
        const data = await this.videoService.findOne(+id);
        return this.responseHelper.sendSuccessMessage("Successfully Searched", 200, data);
    }
    update(id, updateVideoDto) {
        return this.videoService.update(+id, updateVideoDto);
    }
    remove(id) {
        return this.videoService.remove(+id);
    }
};
exports.VideoController = VideoController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_video_dto_1.CreateVideoDto]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("seed"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "seedVideo", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_video_dto_1.UpdateVideoDto]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "remove", null);
exports.VideoController = VideoController = __decorate([
    (0, common_1.Controller)("video"),
    __metadata("design:paramtypes", [video_service_1.VideoService,
        responseHelper_service_1.ResponseHelper])
], VideoController);
//# sourceMappingURL=video.controller.js.map