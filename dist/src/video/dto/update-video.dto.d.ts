import { CreateVideoDto } from "./create-video.dto";
declare const UpdateVideoDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateVideoDto>>;
export declare class UpdateVideoDto extends UpdateVideoDto_base {
    poster: string;
    urlHd: string;
    urlSd: string;
    originalUrl: string;
}
export {};
