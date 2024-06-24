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
exports.VideoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../utils/prisma.service");
const path_1 = require("path");
const factory_service_1 = require("../factory/factory.service");
const axios_1 = require("axios");
let VideoService = class VideoService {
    constructor(prismaService, factoryService) {
        this.prismaService = prismaService;
        this.factoryService = factoryService;
    }
    async create(createVideoDto) {
        const { title, description, userId } = createVideoDto;
        const urlData = await this.factoryService.scrapFacebookURL(createVideoDto.url);
        const { id } = await this.prismaService.user.findUnique({
            where: { id: userId },
            select: { id: true }
        });
        await this.prismaService.video.create({
            data: { title,
                description,
                urlHd: urlData.hd,
                urlSd: urlData.sd,
                poster: urlData.thumbnail,
                userId: id,
                duration: urlData.duration_ms,
                originalUrl: urlData.url
            },
        });
    }
    async searchVideos(searchString) {
        const videos = await this.prismaService.video.findMany({
            where: {
                title: {
                    contains: searchString,
                },
            },
        });
        return videos;
    }
    async findAll(page = 0, limit = 10) {
        const skip = page * limit;
        const data = await this.prismaService.video.findMany({
            select: {
                id: true,
                duration: true,
                title: true,
                poster: true,
            },
            include: {
                _count: {
                    select: {
                        likes: true,
                        dislikes: true,
                        views: true,
                    },
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                        picture: true,
                    },
                },
                oauthAuthor: {
                    select: {
                        id: true,
                        name: true,
                        picture: true,
                    },
                },
            },
            skip,
            take: limit,
        });
        const videoData = data.map(({ title, poster, author, oauthAuthor, _count, duration, id, description, }) => {
            return {
                author: {
                    id: author?.id || oauthAuthor?.id,
                    name: author?.name || oauthAuthor?.name,
                    picture: author?.picture || oauthAuthor?.picture,
                },
                video: {
                    id,
                    title,
                    description,
                    duration,
                    poster,
                    status: {
                        likes: _count.likes,
                        dislikes: _count.dislikes,
                        views: _count.views,
                    },
                },
            };
        });
        return videoData;
    }
    async findOne(videoId) {
        const { author, oauthAuthor, id, urlHd, urlSd, description, title, uploadedAt, poster, comments, _count, } = await this.prismaService.video.findFirst({
            where: { id: videoId },
            include: {
                _count: {
                    select: {
                        likes: true,
                        dislikes: true,
                        views: true,
                    },
                },
                author: {
                    select: {
                        name: true,
                        id: true,
                        picture: true,
                    },
                },
                oauthAuthor: {
                    select: {
                        name: true,
                        id: true,
                        picture: true,
                    },
                },
                comments: {
                    take: 1,
                    orderBy: {
                        id: "desc",
                    },
                    include: {
                        author: {
                            select: {
                                name: true,
                                id: true,
                                picture: true,
                                comments: true,
                                createdAt: true,
                            },
                        },
                        oauthAuthor: {
                            select: {
                                name: true,
                                picture: true,
                                id: true,
                                comments: true,
                            },
                        },
                    },
                },
            },
        });
        const responseData = {
            uploader: {
                name: oauthAuthor?.name || author?.name,
                profile: oauthAuthor?.picture || author?.picture,
                id: oauthAuthor?.id || author?.id,
            },
            video: {
                id,
                urlHd,
                urlSd,
                description,
                title,
                poster,
                uploadedAt,
                comment: comments.map((el) => {
                    return {
                        id: el.id,
                        by: el?.userId || el?.oauthUserId,
                        profile: el.author?.picture || el.oauthAuthor?.picture,
                        text: el.content,
                        at: el.createdAt,
                    };
                }),
                status: {
                    likes: _count.likes,
                    dislikes: _count.dislikes,
                    views: _count.views,
                },
            },
        };
        return responseData;
    }
    async fetchImage(imageUrl, res) {
        const response = await axios_1.default.get(imageUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'User Agent: Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36'
            }
        });
        res.setHeader('Content-Type', response.headers['content-type']);
        return new common_1.StreamableFile(Buffer.from(response.data, 'binary'));
    }
    async update(id, updateVideoDto) {
        const videoData = await this.prismaService.video.findUnique({
            where: { id },
        });
        await this.prismaService.video.update({
            where: { id },
            data: {
                title: updateVideoDto.title || videoData.title,
                description: updateVideoDto.description || videoData.description,
                poster: updateVideoDto.poster || videoData.poster,
            },
        });
    }
    async remove(id) {
        await this.prismaService.video.delete({
            where: { id },
        });
    }
    async createComment(createCommentDTO) {
        await this.prismaService.comment.create({
            data: {
                userId: createCommentDTO.userId,
                videoId: +createCommentDTO.videoId,
                content: createCommentDTO.content,
            },
        });
    }
    async addOrRemoveLike(createLikeDTO) {
        const hasLike = await this.prismaService.videoLike.findFirst({
            where: { userId: createLikeDTO.userId },
            select: {
                id: true,
            },
        });
        if (!hasLike.id) {
            await this.prismaService.videoLike.create({
                data: {
                    videoId: createLikeDTO.videoId,
                    userId: createLikeDTO.userId,
                },
            });
        }
        else {
            await this.prismaService.videoLike.delete({
                where: {
                    id: hasLike.id,
                },
            });
        }
    }
    async addOrRemoveDislike(createLikeDTO) {
        const hasDislike = await this.prismaService.videoLike.findFirst({
            where: { userId: createLikeDTO.userId },
            select: {
                id: true,
            },
        });
        if (!hasDislike.id) {
            await this.prismaService.videoLike.create({
                data: {
                    videoId: createLikeDTO.videoId,
                    userId: createLikeDTO.userId,
                },
            });
        }
        else {
            await this.prismaService.videoLike.delete({
                where: {
                    id: hasDislike.id,
                },
            });
        }
    }
    async createView(createViewDTO) {
        await this.prismaService.views.create({
            data: {
                userId: createViewDTO.userId,
                videoId: createViewDTO.videoId,
            },
        });
    }
    async getComments(videoId, page = 0, limit = 5) {
        const skip = page * limit;
        const comments = await this.prismaService.comment.findMany({
            where: {
                videoId,
            },
            orderBy: {
                id: "desc",
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        picture: true,
                    },
                },
                oauthAuthor: {
                    select: {
                        id: true,
                        name: true,
                        picture: true,
                    },
                },
            },
            take: limit,
            skip,
        });
        const mappedComments = comments.map((comment) => {
            return {
                id: comment.id,
                text: comment.content,
                by: comment.author.name || comment.oauthAuthor.name,
                author_id: comment.author.id || comment.oauthAuthor.id,
                author_profile: comment.author.picture || comment.oauthAuthor.picture,
                createdAt: comment.createdAt,
            };
        });
        return mappedComments;
    }
    async seedVideos() {
        const users = await this.prismaService.user.createMany({
            data: [
                {
                    name: "Alice",
                    picture: (0, path_1.join)("public", "profiles", "default-fischl.jpg"),
                    password: "alicepassword",
                    email: "alice@example.com",
                    isActive: true,
                },
                {
                    name: "Rize Kishimaro",
                    picture: (0, path_1.join)("public", "profiles", "anime-default-pfp-5.jpg"),
                    password: "bobpassword",
                    email: "bob@example.com",
                    isActive: true,
                },
            ],
        });
        const createdUsers = await this.prismaService.user.findMany();
        const user1 = createdUsers[0];
        const user2 = createdUsers[1];
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        factory_service_1.FactoryService])
], VideoService);
//# sourceMappingURL=video.service.js.map