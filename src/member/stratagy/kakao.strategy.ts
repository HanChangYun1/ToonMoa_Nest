import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";
import { VerifyCallback } from "jsonwebtoken";
import { MemberService } from "../member.service";

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, "kakao") {
  constructor(private memberService: MemberService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_REDIRECT_URL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) {
    const { _json } = profile;
    console.log(profile);
    const email = _json.kakao_account.email;
    const photo = _json.properties.profile_image;
    const name = _json.properties.nickname;

    const user = await this.memberService.findByEmailOrSave(email, photo, name);

    const payload = { user: { email: user.email } };
    done(null, { payload });
  }
}
