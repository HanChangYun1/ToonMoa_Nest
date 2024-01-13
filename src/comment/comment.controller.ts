import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Res,
} from "@nestjs/common";
import { CommentService } from "./comment.service";

@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async createComment(
    @Res() res,
    @Body("email") email: string,
    @Body("galleryId") galleryId: string,
    @Body("content") content: string
  ) {
    try {
      const result = await this.commentService.createComment(
        email,
        galleryId,
        content
      );
      res.status(200).json(result);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post("get")
  async getCommentList(@Res() res, @Body("galleryId") galleryId: string) {
    try {
      const result = await this.commentService.getCommentList(galleryId);
      res.status(200).json(result);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Patch(":commentId")
  async updateComment(
    @Res() res,
    @Param("commentId") commentId: string,
    @Body("content") content: string
  ) {
    try {
      const result = await this.commentService.updateComment(
        commentId,
        content
      );
      res.status(200).json(result);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Delete(":commentId")
  async deleteComment(@Res() res, @Param("commentId") commentId: string) {
    try {
      const result = await this.commentService.deleteComment(commentId);
      res.status(200).json(result);
    } catch (e) {
      throw new Error(e);
    }
  }
}
