import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

@Injectable()
export class CryptoService {
  constructor(private readonly configService: ConfigService) {}
  private readonly algorithm = "aes-256-cbc";
  private readonly ivLength = 16;
  private readonly key = this.configService.get("AES_SECRET");

  encrypt(text: string): string {
    const iv = randomBytes(this.ivLength);
    const cipher = createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }

  decrypt(text: string): string {
    const [ivString, encryptedString] = text.split(":");
    const iv = Buffer.from(ivString, "hex");
    const encrypted = Buffer.from(encryptedString, "hex");
    const decipher = createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    decipher.on("error", (error) => {
      console.log(error);
    });
    return decrypted.toString();
  }
}
