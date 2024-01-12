import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { CommentService } from "./comment.service";

@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post("/:service/:webtoonId")
  async createComment(
    @Req() req,
    @Res() res,
    @Param("service") service: string,
    @Param("webtoonId") webtoonId: string,
    @Body("content") content: string
  ) {
    const token = req.cookies.Authorization;
    const result = await this.commentService.createComment(
      token,
      service,
      webtoonId,
      content
    );
    res.json(result);
  }

}
