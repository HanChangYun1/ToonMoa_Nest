import { Controller, Get, Query, Param, Req, Res } from "@nestjs/common";
import { getKakaoWebtoons, getNaverWebtoons } from "src/api/webtoonList";
import { webtoonSearch } from "src/api/webtoonSearch";

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

  @Get(":title")
  async getToonByTitle(@Param("title") title: string, @Res() res) {
    const webtoon = await webtoonSearch(title);
    res.status(200).json(webtoon);
  }
}
