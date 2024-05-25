import { StreamService } from "./stream.service";
import { PrismaService } from "../utils/prisma.service";
export declare class StreamController {
    private readonly streamService;
    private readonly prisma;
    constructor(streamService: StreamService, prisma: PrismaService);
    startStream(request: any, response: any, id: number): Promise<void>;
}
