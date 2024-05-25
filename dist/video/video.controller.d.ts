import { VideoService } from "./video.service";
import { CreateVideoDto } from "./dto/create-video.dto";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { ResponseHelper } from "../utils/responseHelper.service";
export declare class VideoController {
    private readonly videoService;
    private readonly responseHelper;
    constructor(videoService: VideoService, responseHelper: ResponseHelper);
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
    seedVideo(): Promise<string>;
    findOne(id: string): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    update(id: string, updateVideoDto: UpdateVideoDto): Promise<void>;
    remove(id: string): string;
}
