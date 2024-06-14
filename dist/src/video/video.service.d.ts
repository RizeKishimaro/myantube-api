import { CreateVideoDto } from "./dto/create-video.dto";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { PrismaService } from "../utils/prisma.service";
import { CreateLikeDTO } from "./dto/create-like.dto";
import { CreateCommentDTO } from "./dto/create-comment.dto";
import { CreateViewDTO } from "./dto/create-view.dto";
export declare class VideoService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    create(createVideoDto: CreateVideoDto): Promise<void>;
    searchVideos(searchString: string): Promise<{
        id: number;
        title: string;
        description: string;
        poster: string;
        urlHd: string;
        urlSd: string;
        userId: string;
        oauthUserId: string;
        uploadedAt: Date;
    }[]>;
    findAll(): Promise<{
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
    seedVideos(): Promise<void>;
}
