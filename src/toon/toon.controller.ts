import { Controller, Get, Param, Res } from "@nestjs/common";
import {
  getKakaoWebtoons,
  getKakaoWebtoonsByDate,
  getNaverWebtoons,
  getNaverWebtoonsByDate,
} from "src/api/webtoonList";
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

  @Get("kakao/:date")
  async getKakaoToonByDate(@Param("date") date: string, @Res() res) {
    const dateWebtoons = await getKakaoWebtoonsByDate(date);
    res.status(200).json(dateWebtoons);
  }

  @Get("naver/:date")
  async getNaverToonByDate(@Param("date") date: string, @Res() res) {
    const dateWebtoons = await getNaverWebtoonsByDate(date);
    res.status(200).json(dateWebtoons);
  }

  @Get(":title")
  async getToonByTitle(@Param("title") title: string, @Res() res) {
    const webtoon = await webtoonSearch(title);
    res.status(200).json(webtoon);
  }
}
