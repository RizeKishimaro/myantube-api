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
const create_comment_dto_1 = require("./dto/create-comment.dto");
const create_like_dto_1 = require("./dto/create-like.dto");
const create_view_dto_1 = require("./dto/create-view.dto");
let VideoController = class VideoController {
    constructor(videoService, responseHelper) {
        this.videoService = videoService;
        this.responseHelper = responseHelper;
    }
    createComment(createCommentDTO) {
        console.log(createCommentDTO);
        return this.videoService.createComment(createCommentDTO);
    }
    addOrRemoveLike(createLikeDTO) {
        return this.videoService.addOrRemoveLike(createLikeDTO);
    }
    create(createVideoDto) {
        return this.videoService.create(createVideoDto);
    }
    addOrRemoveDislike(createLikeDTO) {
        return this.videoService.addOrRemoveDislike(createLikeDTO);
    }
    createView(createViewDTO) {
        return this.videoService.createView(createViewDTO);
    }
    findAll() {
        return this.videoService.findAll();
    }
    async seedVideo() {
        await this.videoService.seedVideos();
        return "Success!";
    }
    async searchVideos(text) {
        const videos = this.videoService.searchVideos(text);
        return videos;
    }
    async findOne(id) {
        const data = await this.videoService.findOne(+id);
        return this.responseHelper.sendSuccessMessage("Successfully Searched", 200, data);
    }
    async update(id, updateVideoDto) {
        return await this.videoService.update(+id, updateVideoDto);
    }
    remove(id) {
        return this.videoService.remove(+id);
    }
};
exports.VideoController = VideoController;
__decorate([
    (0, common_1.Post)("createComment"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comment_dto_1.CreateCommentDTO]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "createComment", null);
__decorate([
    (0, common_1.Post)("createLike"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_like_dto_1.CreateLikeDTO]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "addOrRemoveLike", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_video_dto_1.CreateVideoDto]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("createDislike"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_like_dto_1.CreateLikeDTO]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "addOrRemoveDislike", null);
__decorate([
    (0, common_1.Post)("addView"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_view_dto_1.CreateViewDTO]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "createView", null);
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
    __metadata("design:returntype", Promise)
], VideoController.prototype, "seedVideo", null);
__decorate([
    (0, common_1.Get)("search"),
    __param(0, (0, common_1.Query)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "searchVideos", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_video_dto_1.UpdateVideoDto]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "remove", null);
exports.VideoController = VideoController = __decorate([
    (0, common_1.Controller)("video"),
    __metadata("design:paramtypes", [video_service_1.VideoService,
        responseHelper_service_1.ResponseHelper])
], VideoController);
//# sourceMappingURL=video.controller.js.map