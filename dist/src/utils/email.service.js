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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const config_1 = require("@nestjs/config");
const ejs = require("ejs");
const fs_1 = require("fs");
const path_1 = require("path");
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
    }
    async sendEmail(to, subject, code, hostUrl) {
        try {
            const activationLink = `${hostUrl}/users/activate/${code}`;
            const emailTemplate = (0, fs_1.readFileSync)((0, path_1.join)(process.cwd(), "public", "templates", "email.ejs"), "utf-8");
            const renderedTemplate = ejs.render(emailTemplate, { activationLink });
            const transporter = nodemailer.createTransport({
                port: 2525,
                host: "smtp.elasticemail.com",
                auth: {
                    user: this.configService.get("GMAIL_USER"),
                    pass: this.configService.get("GMAIL_PASSWORD"),
                },
                secure: false,
                tls: { ciphers: "SSLv3" },
            });
            await new Promise((resolve, reject) => {
                transporter.verify(function (error, success) {
                    if (error) {
                        console.log(error);
                        reject(error);
                    }
                    else {
                        resolve(success);
                    }
                });
            });
            const mailData = {
                from: {
                    name: `MyanTube Tech Support`,
                    address: this.configService.get("GMAIL_USER"),
                },
                to,
                subject,
                html: renderedTemplate,
            };
            return await new Promise((resolve, reject) => {
                transporter.sendMail(mailData, (err, info) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    }
                    else {
                        resolve(info);
                    }
                });
            });
        }
        catch (error) {
            console.error(error);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map