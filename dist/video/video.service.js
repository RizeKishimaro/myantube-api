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
let VideoService = class VideoService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    create(createVideoDto) {
        return "goffy ahhhh";
    }
    async findAll() {
        const data = await this.prismaService.video.findMany({
            include: {
                _count: {
                    select: {
                        likes: true,
                        dislikes: true,
                        views: true
                    }
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
        });
        const videoData = data.map(({ title, poster, author, oauthAuthor, _count, url, id, description }) => {
            return {
                author: {
                    id: author?.id || oauthAuthor?.id,
                    name: author?.name || oauthAuthor?.name,
                    picture: author?.picture || oauthAuthor?.picture
                },
                video: {
                    id,
                    title,
                    url,
                    description,
                    poster,
                    status: {
                        likes: _count.likes,
                        dislikes: _count.dislikes,
                        views: _count.views
                    }
                }
            };
        });
        return videoData;
    }
    async findOne(videoId) {
        const { author, oauthAuthor, id, url, description, title, uploadedAt, poster, comments, _count } = await this.prismaService.video.findFirst({
            where: { id: videoId },
            include: {
                _count: {
                    select: {
                        likes: true,
                        dislikes: true,
                        views: true
                    }
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
                picture: oauthAuthor?.picture || author?.picture,
                id: oauthAuthor?.id || author?.id,
            },
            video: {
                id,
                url,
                description,
                title,
                poster,
                comment: comments.map((el) => {
                    return {
                        id: el.id,
                        by: el?.userId || el?.oauthUserId,
                        profile: el.author.picture || el.oauthAuthor.picture,
                        text: el.content,
                        at: el.createdAt,
                    };
                }),
                status: {
                    likes: _count.likes,
                    dislikes: _count.dislikes,
                    views: _count.views,
                }
            },
        };
        return responseData;
    }
    async update(id, updateVideoDto) {
        await this.prismaService.videoLike.create({
            data: {
                videoId: updateVideoDto.videoId,
                userId: updateVideoDto.userId,
            },
        });
    }
    remove(id) {
        return `This action removes a #${id} video`;
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VideoService);
//# sourceMappingURL=video.service.js.map