import { Controller, Get, Req } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req): string {
    console.log(req.protocol + '://' + req.get('host') + req.originalUrl)
    return this.appService.getHello();
  }
}
