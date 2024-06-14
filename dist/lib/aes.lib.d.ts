import { ConfigService } from '@nestjs/config';
export declare class CryptoService {
    private readonly configService;
    constructor(configService: ConfigService);
    private readonly algorithm;
    private readonly ivLength;
    private readonly key;
    encrypt(text: string): string;
    decrypt(text: string): string;
}
