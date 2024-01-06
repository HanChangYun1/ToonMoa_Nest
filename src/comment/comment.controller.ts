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

  @Post("/:service/:webtoonId/:parentId")
  async createReComment(
    @Req() req,
    @Res() res,
    @Param("service") service: string,
    @Param("webtoonId") webtoonId: string,
    @Param("parentId") parentId: string,
    @Body("content") content: string
  ) {
    const token = req.cookies.Authorization;
    const result = await this.commentService.createReComment(
      token,
      service,
      webtoonId,
      parentId,
      content
    );
    res.json(result);
  }

  @Get("/:service/:webtoonId")
  async getAllComments(
    @Res() res,
    @Param("service") service: string,
    @Param("webtoonId") webtoonId: string
  ) {
    const result = await this.commentService.getAllComments(service, webtoonId);
    res.json(result);
  }

  @Patch("/:commentId")
  async updateComment(
    @Req() req,
    @Res() res,
    @Param("commentId") commentId: string,
    @Body("content") content: string
  ) {
    const token = req.cookies.Authorization;
    const result = await this.commentService.updateComment(
      token,
      commentId,
      content
    );
    res.json(result);
  }

  @Delete("/:commentId")
  async deleteComment(
    @Req() req,
    @Res() res,
    @Param("commentId") commentId: string
  ) {
    const token = req.cookies.Authorization;
    const result = await this.commentService.deleteComment(token, commentId);
    res.json(result);
  }
}
