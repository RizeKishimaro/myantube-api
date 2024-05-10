// email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as ejs from "ejs"
import { readFileSync } from 'fs';
import { join } from 'path';
@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async sendEmail(to: string, subject: string,code: string,hostUrl: string) {
    try{
      const activationLink = `${hostUrl}/users/activate/${code}`;
      const emailTemplate = readFileSync(join(process.cwd(),"public","templates","email.ejs"), "utf-8");
      const renderedTemplate = ejs.render(emailTemplate, { activationLink });
      const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: this.configService.get("GMAIL_USER"),
        pass: this.configService.get("GMAIL_PASSWORD"),
    },
    secure: true,
});

await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
            reject(error);
        } else {
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
    // send mail
    transporter.sendMail(mailData, (err, info) => {
        if (err) {
            console.error(err);
            reject(err);
        } else {
            resolve(info);
        }
    });
});
  }
  catch(error){
    console.error(error)
  }
  }
}

