// email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async sendEmail(to: string, subject: string,code: string) {
    try{
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
            console.log("Server is ready to take our messages");
            resolve(success);
        }
    });
});

const mailData = {
    from: {
        name: `loki`,
        address: this.configService.get("GMAIL_USER"),
    },
    replyTo: "sakurahimiko28@gmail.com",
    to: "sakurahimiko28@gmail.com",
    subject: `form message`,
    text: "hi",
    html: `hi`,
};

      return await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailData, (err, info) => {
        if (err) {
            console.error(err);
            reject(err);
        } else {
            console.log(info);
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

