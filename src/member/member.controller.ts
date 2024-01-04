import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { MemberService } from "./member.service";
import { AuthGuard } from "@nestjs/passport";
import { sign } from "jsonwebtoken";
import { JwtService } from "@nestjs/jwt";
import { FileInterceptor } from "@nestjs/platform-express";
@Controller("member")
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private jwtService: JwtService
  ) {}

  private generateAccessToken(user: any): string {
    const secretKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
    const expiresIn = "24h";
    const accessToken2 = this.jwtService.sign(
      { user },
      { expiresIn, secret: secretKey }
    );
    const accessToken = sign({ user }, secretKey, { expiresIn });
    return accessToken2;
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleLoginCallback(@Req() req, @Res() res) {
    try {
      const token = this.generateAccessToken(req.user);
      const accessToken = `Bearer ${token}`;
      res.cookie("Authorization", accessToken, {
        httpOnly: false,
        secure: true,
        path: "/",
      });
      res.redirect("http://localhost:3000");
    } catch (error) {
      console.error("Error in googleLoginCallback:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  @Get("kakao/callback")
  @UseGuards(AuthGuard("kakao"))
  async kakaoLoginCallback(@Req() req, @Res() res) {
    try {
      const token = this.generateAccessToken(req.user.user);
      const accessToken = `Bearer ${token}`;
      res.cookie("Authorization", accessToken, {
        httpOnly: false,
        secure: true,
        path: "/",
      });
      res.redirect("http://localhost:3000");
    } catch (error) {
      console.error("Error in kakaoLoginCallback:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  @Get("logout")
  async logout(@Res() res) {
    res.clearCookie("Authorization", { path: "/" });
  }

  // @Put("update")
  // @UseInterceptors(FileInterceptor("photo"))
  // async updateUser(
  //   @Req() req,
  //   @Res() res,
  //   @UploadedFile() photo,
  //   @Body() dto: UpdateUserDto
  // ) {
  //   const token = req.cookies.Authorization;
  //   const result = await this.memberService.update(token, dto, photo);
  //   res.send(result);
  // }

  @Delete("withdrawal")
  async withdrawalUser(@Req() req, @Res() res) {
    const token = req.cookies.Authorization;
    const result = await this.memberService.withdrawal(token);
    res.send(result);
  }

  @Get()
  async getBuyer(@Req() req, @Res() res) {
    const token = req.cookies.Authorization;
    const buyer = await this.memberService.getBuyer(token);
    res.send(buyer);
  }
}
