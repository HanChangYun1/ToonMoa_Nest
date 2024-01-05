import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./entity/comment.entity";
import { Repository } from "typeorm";
import { MemberService } from "src/member/member.service";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private memberService: MemberService
  ) {}

  async createComment(token, service, webtoonId, content) {
    const decodeToken = await this.memberService.decodeToken(token);
    const { user } = decodeToken;

    const member = await this.memberService.getUser(user.email);
    if (!member) return "잘못된 유저정보입니다.";

    const comment = await this.commentRepository.save({
      member,
      service,
      webtoonId,
      content,
    });

    // member.comments.push(comment);
    return comment;
  }

  async createReComment(token, service, webtoonId, parentId, content) {
    const decodeToken = await this.memberService.decodeToken(token);
    const { user } = decodeToken;

    if (!service || !webtoonId) return "잘못된 웹툰정보입니다.";

    const member = await this.memberService.getUser(user.email);
    if (!member) return "잘못된 유저정보입니다.";
    console.log(member);

    const comment = await this.getComment(parentId);
    console.log(comment);

    const reComment = await this.commentRepository.save({
      member,
      service,
      webtoonId,
      parent: comment,
      content,
    });
    console.log(reComment);

    // member.comments.push(comment);
    // comment.children.push(reComment);

    return reComment;
  }

  async getAllComments(service, webtoonId) {
    if (!service || !webtoonId) return "잘못된 웹툰정보입니다.";

    const commentList = await this.commentRepository
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.member", "member")
      .leftJoinAndSelect("comment.parent", "parent")
      .leftJoinAndSelect("comment.children", "children")
      .where("comment.service = :service", { service })
      .andWhere("comment.webtoonId = :webtoonId", { webtoonId })
      .getMany();
    return commentList;
  }

  async getComment(commentId) {
    const comment = await this.commentRepository.findOne({
      where: { id: Number(commentId) },
    });
    return comment;
  }
}
