import { Body, Controller, Get, Param, Post, Req, Res } from "@nestjs/common";
import { LikeService } from "./like.service";

@Controller("like")
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post("/:service/:webtoonId")
  async handleLikeToon(
    @Req() req,
    @Res() res,
    @Param("service") service: string,
    @Param("webtoonId") webtoonId: string
  ) {
    const token = req.cookies.Authorization;
    const result = await this.likeService.handleLikeToon(
      token,
      service,
      webtoonId
    );
    res.send(result);
  }

  @Post("/:service/:webtoonId/:episode")
  async handleLikeEpisode(
    @Req() req,
    @Res() res,
    @Param("service") service: string,
    @Param("webtoonId") webtoonId: string,
    @Param("episode") episode: string
  ) {
    const token = req.cookies.Authorization;
    const result = await this.likeService.handleLikeEpisode(
      token,
      service,
      webtoonId,
      episode
    );
    res.send(result);
  }

  @Post("/:service/:webtoonId/:episode/:commentId")
  async handleLikeComment(
    @Req() req,
    @Res() res,
    @Param("service") service: string,
    @Param("webtoonId") webtoonId: string,
    @Param("episode") episode: string,
    @Param("commentId") commentId: string
  ) {
    const token = req.cookies.Authorization;
    const result = await this.likeService.handleLikeComment(
      token,
      service,
      webtoonId,
      episode,
      commentId
    );
    res.send(result);
  }

  @Get("mytoon")
  async getMyToon(@Req() req, @Res() res) {
    const token = req.cookies.Authorization;
    const result = await this.likeService.getMyToon(token);
    res.send(result);
  }

  @Get("/:service/:webtoonId/:episode")
  async getCountEpisode(
    @Res() res,
    @Param("service") service: string,
    @Param("webtoonId") webtoonId: string,
    @Param("episode") episode: string
  ) {
    const result = await this.likeService.getCountEpisode(
      service,
      webtoonId,
      episode
    );
    res.json(result);
  }

  @Get("/:service/:webtoonId/:episode/:commentId")
  async getCountComment(
    @Res() res,
    @Param("service") service: string,
    @Param("webtoonId") webtoonId: string,
    @Param("episode") episode: string,
    @Param("commentId") commentId: string
  ) {
    const result = await this.likeService.getCountComment(
      service,
      webtoonId,
      episode,
      commentId
    );
    res.json(result);
  }
}
