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
exports.StreamController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const stream_service_1 = require("./stream.service");
const prisma_service_1 = require("../utils/prisma.service");
const factory_service_1 = require("../factory/factory.service");
let StreamController = class StreamController {
    constructor(streamService, prisma, factoryService) {
        this.streamService = streamService;
        this.prisma = prisma;
        this.factoryService = factoryService;
    }
    async startStream(request, response, id) {
        const range = request.headers.range || "1";
        if (!range) {
            throw new common_1.BadRequestException({
                code: 299,
                message: 'Bad range header or does not exist.',
            });
        }
        const query = await this.prisma.video.findFirst({
            where: {
                id: +id,
            },
            select: {
                urlHd: true,
                urlSd: true,
            },
        });
        if (!query) {
            throw new common_1.BadRequestException({
                code: 404,
                message: 'Video not found.',
            });
        }
        const videoUrl = query.urlHd || query.urlSd;
        try {
            const headResponse = await axios_1.default.head(videoUrl);
            const videoSize = headResponse.headers['content-length'];
            const videoType = headResponse.headers['content-type'] || 'video/mp4';
            const CHUNK_SIZE = 10 ** 6;
            const start = Number(range.replace(/\D/g, ""));
            const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
            const headers = {
                'Content-Range': `bytes ${start}-${end}/${videoSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': end - start + 1,
                'Content-Type': videoType,
            };
            const videoResponse = await axios_1.default.get(videoUrl, {
                responseType: 'stream',
                headers: {
                    Range: `bytes=${start}-${end}`,
                },
            });
            response.writeHead(206, headers);
            videoResponse.data.pipe(response);
        }
        catch (error) {
            if (error.response.status === 403) {
                const { originalUrl } = await this.prisma.video.findUnique({
                    where: { id },
                });
                const urlData = await this.factoryService.scrapFacebookURL(originalUrl);
                await this.prisma.video.update({
                    where: { id },
                    data: {
                        duration: urlData.duration_ms,
                        originalUrl: urlData.url,
                        urlHd: urlData.hd,
                        urlSd: urlData.sd,
                    },
                });
            }
            console.error("Error streaming video:", error.response);
            response.status(500).send("Error streaming video");
        }
    }
};
exports.StreamController = StreamController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)("video", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "startStream", null);
exports.StreamController = StreamController = __decorate([
    (0, common_1.Controller)("stream"),
    __metadata("design:paramtypes", [stream_service_1.StreamService,
        prisma_service_1.PrismaService,
        factory_service_1.FactoryService])
], StreamController);
//# sourceMappingURL=stream.controller.js.map