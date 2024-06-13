import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { email, firstName, lastName, accessToken, picture } = req.user;
    this.authService.createOauthAccount({
      name: firstName + lastName,
      email,
      picture,
      accessToken,
    });
    const redirectUrl = "http://127.0.0.1:3000"; // Your redirect URL
    const redirectWithParams = `${redirectUrl}?email=${email}&name=${firstName}+${lastName}&picture=${picture}`;
    res.redirect(redirectWithParams);
  }
}
