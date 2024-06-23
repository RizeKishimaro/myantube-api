import { ConfigService } from "@nestjs/config";
export declare class EmailService {
    private configService;
    constructor(configService: ConfigService);
    sendEmail(to: string, subject: string, code: string, hostUrl: string): Promise<unknown>;
}
