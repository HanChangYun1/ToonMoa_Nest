import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./entity/comment.entity";
import { Repository } from "typeorm";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>
  ) {}

  async getComment(commentId) {
    const comment = await this.commentRepository.findOne({
      where: { id: Number(commentId) },
    });
    return comment;
  }
}
