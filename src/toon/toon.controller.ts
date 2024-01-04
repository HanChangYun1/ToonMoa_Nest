import { Controller, Get, Req, Res } from "@nestjs/common";
import { ToonService } from "./toon.service";

@Controller("toon")
export class ToonController {
  constructor(private readonly toonService: ToonService) {}

  @Get("/genre")
  async getToonByGenre(@Req() req, @Res() res) {}

  @Get("/popularity")
  async getToonByPopularity(@Req() req, @Res() res) {}

  @Get("/favorite")
  async getToonByFavorite(@Req() req, @Res() res) {}

  @Get("/like")
  async getToonByLike(@Req() req, @Res() res) {}
}
