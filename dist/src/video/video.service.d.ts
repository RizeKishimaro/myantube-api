import { CreateVideoDto } from "./dto/create-video.dto";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { PrismaService } from "../utils/prisma.service";
import { CreateLikeDTO } from "./dto/create-like.dto";
import { CreateCommentDTO } from "./dto/create-comment.dto";
import { CreateViewDTO } from "./dto/create-view.dto";
import { FactoryService } from "../factory/factory.service";
export declare class VideoService {
    private readonly prismaService;
    private readonly factoryService;
    constructor(prismaService: PrismaService, factoryService: FactoryService);
    create(createVideoDto: CreateVideoDto): Promise<void>;
    searchVideos(searchString: string): Promise<{
        id: number;
        title: string;
        description: string;
        originalUrl: string;
        duration: number;
        poster: string;
        urlHd: string;
        urlSd: string;
        urlHdHash: string;
        urlSdHash: string;
        userId: string;
        oauthUserId: string;
        uploadedAt: Date;
    }[]>;
    findAll(page?: number, limit?: number): Promise<{
        author: {
            id: string;
            name: string;
            picture: string;
        };
        video: {
            id: number;
            title: string;
            urlHd: string;
            urlSd: string;
            description: string;
            poster: string;
            status: {
                likes: number;
                dislikes: number;
                views: number;
            };
        };
    }[]>;
    findOne(videoId: number): Promise<{
        uploader: {
            name: string;
            picture: string;
            id: string;
        };
        video: {
            id: number;
            urlHd: string;
            urlSd: string;
            description: string;
            title: string;
            poster: string;
            uploadedAt: Date;
            comment: {
                id: number;
                by: string;
                profile: string;
                text: string;
                at: Date;
            }[];
            status: {
                likes: number;
                dislikes: number;
                views: number;
            };
        };
    }>;
    update(id: number, updateVideoDto: UpdateVideoDto): Promise<void>;
    remove(id: number): Promise<void>;
    createComment(createCommentDTO: CreateCommentDTO): Promise<void>;
    addOrRemoveLike(createLikeDTO: CreateLikeDTO): Promise<void>;
    addOrRemoveDislike(createLikeDTO: CreateLikeDTO): Promise<void>;
    createView(createViewDTO: CreateViewDTO): Promise<void>;
    getComments(videoId: number, page?: number, limit?: number): Promise<{
        id: number;
        text: string;
        by: string;
        author_id: string;
        author_profile: string;
        createdAt: Date;
    }[]>;
    seedVideos(): Promise<void>;
}
