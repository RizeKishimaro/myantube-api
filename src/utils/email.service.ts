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

  async sendEmail(to: string, subject: string,code: string) {
    const emailTemplate = readFileSync(join(process.cwd(),"public","templates","email.ejs"))
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_PASSWORD'),
      },
    });
    const renderedTemplate = ejs.render(emailTemplate, { activationLink: `http://127.0.0.1:3000/activate/${code}` });
    const mailOptions = {
      from: this.configService.get<string>('GMAIL_USER'),
      to,
      subject,
      html: renderedTemplate,
    }
transporter.sendMail(mailOptions, (error, info) => {          
  if (error) {                                                
    console.log('Error occurred:', error.message);            
    return;                                                   
  }                                                           
  console.log('Email sent successfully:', info.messageId);    
});
  }
}

