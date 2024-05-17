import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req) {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { email, firstName, lastName, accessToken, picture } = req.user;
    const response = this.authService.createOauthAccount({
      name: firstName + lastName,
      email,
      picture,
      accessToken,
    });
    return res.json(response).redirect("http://127.0.0.1:3000/auth/thankyou");
  }
  @Get("thankyou")
  sayThanks(res) {
    return { res, message: "thankyou" };
  }
}
