import { VideoService } from "./video.service";
import { CreateVideoDto } from "./dto/create-video.dto";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { ResponseHelper } from "../utils/responseHelper.service";
import { CreateCommentDTO } from "./dto/create-comment.dto";
import { CreateLikeDTO } from "./dto/create-like.dto";
import { CreateViewDTO } from "./dto/create-view.dto";
export declare class VideoController {
    private readonly videoService;
    private readonly responseHelper;
    constructor(videoService: VideoService, responseHelper: ResponseHelper);
    createComment(createCommentDTO: CreateCommentDTO): Promise<void>;
    addOrRemoveLike(createLikeDTO: CreateLikeDTO): Promise<void>;
    create(createVideoDto: CreateVideoDto): Promise<void>;
    addOrRemoveDislike(createLikeDTO: CreateLikeDTO): Promise<void>;
    createView(createViewDTO: CreateViewDTO): Promise<void>;
    findAll(page: number, limit: number): Promise<{
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
    seedVideo(): Promise<string>;
    searchVideos(text: string): Promise<{
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
    findOne(id: number): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    findComments(videoId: number, page: number, limit: number): Promise<{
        id: number;
        text: string;
        by: string;
        author_id: string;
        author_profile: string;
        createdAt: Date;
    }[]>;
    update(id: string, updateVideoDto: UpdateVideoDto): Promise<void>;
    remove(id: number): Promise<void>;
}
