import { CreateVideoDto } from "./dto/create-video.dto";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { PrismaService } from "../utils/prisma.service";
export declare class VideoService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    create(createVideoDto: CreateVideoDto): string;
    findAll(): Promise<{
        author: {
            id: string;
            name: string;
            picture: string;
        };
        video: {
            id: number;
            title: string;
            url: string;
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
            url: string;
            description: string;
            title: string;
            poster: string;
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
    remove(id: number): string;
    seedVideos(): Promise<void>;
}
