import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { MemberService } from "./member.service";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateUserDto } from "./dto/updateuser.dto";
@Controller("member")
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private jwtService: JwtService
  ) {}


  @Post("saveUser")
  async saveUser(@Req() req, @Res() res){
    try{
      const userInfo = req.body;
    const {email, profile} = userInfo
    const result = await this.memberService.findByEmailOrSave2(email, profile);
    res.status(200).send("saveUser Alright!")
    }catch(e){
      res.status(400).send("saveUser failed")
    }
  }

  @Post("logout")
  async logout(@Res() res) {
    try {
      res.clearCookie("Authorization", { path: "/" });
      res.status(200).send("Logout successful");
    } catch (e) {
      console.error(e);
    }
  }

  @Patch("update")
  @UseInterceptors(FileInterceptor("photo"))
  async updateUser(
    @Req() req,
    @Res() res,
    @UploadedFile() photo,
    @Body() dto: UpdateUserDto
  ) {
    const token = req.cookies.Authorization;
    const result = await this.memberService.update(token, dto, photo);
    res.send(result);
  }

  @Delete("withdrawal")
  async withdrawalUser(@Req() req, @Res() res) {
    const token = req.cookies.Authorization;
    const result = await this.memberService.withdrawal(token);
    res.send(result);
  }

  @Get()
  async getMember(@Req() req, @Res() res) {
    const token = req.cookies.Authorization;
    const member = await this.memberService.getMember(token);
    res.send(member);
  }
}
