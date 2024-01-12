import { Body, Controller, Get, Param, Post, Req, Res } from "@nestjs/common";
import { LikeService } from "./like.service";

@Controller("like")
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  async handleLike(
    @Res() res,
    @Body("email") email: string,
    @Body("galleryId") galleryId: string
  ) {
    try {
      const result = await this.likeService.handleLike(email, galleryId);
      res.status(200).send(result);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post("get")
  async getCount(@Res() res, @Body("galleryId") galleryId) {
    try {
      const result = await this.likeService.getCount(galleryId);
      res.status(200).json(result);
    } catch (e) {
      throw new Error(e);
    }
  }
}
