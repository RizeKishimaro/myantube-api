"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
let CryptoService = class CryptoService {
    constructor(configService) {
        this.configService = configService;
        this.algorithm = "aes-256-cbc";
        this.ivLength = 16;
        this.key = this.configService.get("AES_SECRET");
    }
    encrypt(text) {
        const iv = (0, crypto_1.randomBytes)(this.ivLength);
        const cipher = (0, crypto_1.createCipheriv)(this.algorithm, this.key, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString("hex") + ":" + encrypted.toString("hex");
    }
    decrypt(text) {
        const [ivString, encryptedString] = text.split(":");
        const iv = Buffer.from(ivString, "hex");
        const encrypted = Buffer.from(encryptedString, "hex");
        const decipher = (0, crypto_1.createDecipheriv)(this.algorithm, this.key, iv);
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        decipher.on("error", (error) => {
            console.log(error);
        });
        return decrypted.toString();
    }
};
exports.CryptoService = CryptoService;
exports.CryptoService = CryptoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CryptoService);
//# sourceMappingURL=aes.lib.js.map