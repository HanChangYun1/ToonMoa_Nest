import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./entity/comment.entity";
import { Repository, Transaction } from "typeorm";
import { MemberService } from "src/member/member.service";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private memberService: MemberService
  ) {}

  async createComment(token, service, webtoonId, content) {

    const email = "";

    const member = await this.memberService.getUser(email);
    if (!member) return "잘못된 유저정보입니다.";

    const comment = await this.commentRepository.save({
      member,
      service,
      webtoonId,
      content,
    });

    return comment;
  }
}
