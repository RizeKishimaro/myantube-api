import { StreamService } from "./stream.service";
import { PrismaService } from "../utils/prisma.service";
import { FactoryService } from "../factory/factory.service";
export declare class StreamController {
    private readonly streamService;
    private readonly prisma;
    private readonly factoryService;
    constructor(streamService: StreamService, prisma: PrismaService, factoryService: FactoryService);
    startStream(request: any, response: any, id: number): Promise<void>;
}
