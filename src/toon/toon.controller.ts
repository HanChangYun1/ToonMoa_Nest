import { Controller, Get, Query, Param, Req, Res } from "@nestjs/common";
import {
  getKakaoWebtoons,
  getNaverWebtoons,
  getWebtoonsByDate,
} from "src/api/webtoonList";

@Controller("toon")
export class ToonController {
  @Get("kakao")
  async getToonKService(@Res() res) {
    const kakaoWebtoons = await getKakaoWebtoons();
    res.status(200).json(kakaoWebtoons);
  }

  @Get("naver")
  async getToonNService(@Res() res) {
    const naverWebtoons = await getNaverWebtoons();
    res.status(200).json(naverWebtoons);
  }

  @Get("date")
  async getToonDate(
    @Param("service") service: string,
    @Param("date") updateday: string
  ) {
    const webtoons = await getWebtoonsByDate(service, updateday);
    return webtoons;
  }
}
