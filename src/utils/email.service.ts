// email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async sendEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_PASSWORD'),
      },
    });
    console.log(this.configService.get("GMAIL_USER"))
    console.log(this.configService.get("GMAIL_PASSWORD"))
    const mailOptions = {
      from: this.configService.get<string>('GMAIL_USER'),
      to,
      subject,
      text,
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

