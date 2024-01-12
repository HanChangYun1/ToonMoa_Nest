import {
  Controller,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { MemberService } from "./member.service";
import { JwtService } from "@nestjs/jwt";

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
    const result = await this.memberService.findByEmailOrSave(email, profile);
    res.status(200).send("saveUser Alright!")
    }catch(e){
      res.status(400).send("saveUser failed")
    }
  }

  @Post("getMember")
  async getMember(@Req() req, @Res() res) {
    const email = req.body.email;
    const member = await this.memberService.getMember(email);
    res.status(200).json(member);
  }  
}
