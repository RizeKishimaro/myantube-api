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
    try{
    const emailTemplate = readFileSync(join(process.cwd(),"public","templates","email.ejs"),"utf-8")
    const renderedTemplate = ejs.render(emailTemplate, { activationLink: `http://127.0.0.1:3000/users/activate/${code}` });
   
      const mailOptions = {
      from: this.configService.get<string>('GMAIL_USER'),
      to,
      subject,
      html: renderedTemplate,
    }
      await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_PASSWORD'),
      },
    }).verify((err,success)=>{
        console.log(err,success)
      })
  }
  catch(error){
    console.log(error)
  }
  }
}

