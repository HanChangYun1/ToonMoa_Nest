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

    return comment;
  }

  async createReComment(token, service, webtoonId, parentId, content) {
    const decodeToken = await this.memberService.decodeToken(token);
    const { user } = decodeToken;

    if (!service || !webtoonId) return "잘못된 웹툰정보입니다.";

    const member = await this.memberService.getUser(user.email);
    if (!member) return "잘못된 유저정보입니다.";

    const comment = await this.getComment(parentId);

    const reComment = await this.commentRepository.save({
      member,
      service,
      webtoonId,
      parent: comment,
      content,
    });

    return reComment;
  }

  async getAllComments(service, webtoonId) {
    if (!service || !webtoonId) return "잘못된 웹툰정보입니다.";

    const commentList = await this.commentRepository
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.member", "member")
      .leftJoinAndSelect("comment.children", "children")
      .where("comment.service = :service", { service })
      .andWhere("comment.webtoonId = :webtoonId", { webtoonId })
      .andWhere("comment.parent is Null")
      .getMany();
    return commentList;
  }

  async updateComment(token, commentId, content) {
    const decodeToken = await this.memberService.decodeToken(token);
    const { user } = decodeToken;

    const member = await this.memberService.getUser(user.email);
    if (!member) return "잘못된 유저정보입니다.";

    const comment = await this.getComment(commentId);
    if (!comment) return "댓글이 존재하지 않습니다.";

    if (member.id !== comment.member.id) return "잘못된 접근입니다.";

    try {
      const updateComment = await this.commentRepository
        .createQueryBuilder()
        .update(Comment)
        .set({ content: content })
        .where("id = :id", { id: commentId })
        .andWhere("memberId = :memberId", { memberId: member.id })
        .execute();
      if (updateComment.affected === 1) return "업데이트에 성공했습니다.";
      else return "업데이트에 실패했습니다.";
    } catch (e) {
      console.error("Error:", e);
    }
  }

  async deleteComment(token, commentId) {
    const decodeToken = await this.memberService.decodeToken(token);
    const { user } = decodeToken;

    const member = await this.memberService.getUser(user.email);
    if (!member) return "잘못된 유저정보입니다.";

    let comment = await this.getComment(commentId);
    if (!comment) return "댓글이 존재하지 않습니다.";

    if (member.id !== comment.member.id) return "잘못된 접근입니다.";

    //댓글 삭제 로직
    const updateComment = await this.commentRepository
      .createQueryBuilder()
      .update(Comment)
      .set({
        content: "이 댓글은 삭제된 댓글입니다.",
        isRemoved: true,
      })
      .where("id = :id", { id: comment.id })
      .andWhere("memberId = :memberId", { memberId: member.id })
      .execute();

    do {
      const boolean = await this.findRemovableList(comment);
      if (boolean === true) {
        await this.commentRepository.delete(comment.id);
        if (comment.parent !== null) {
          comment = await this.getComment(comment.parent.id);
        } else {
          break;
        }
      } else {
        break;
      }
    } while (comment !== null);

    return "삭제에 성공했습니다.";
  }

  async findRemovableList(comment: Comment) {
    if (comment.children && comment.children.length === 0) return true;

    for (const child of comment.children) {
      if (child.isRemoved === false) break;
      return true;
    }
    return false;
  }

  async getComment(commentId) {
    const comment = await this.commentRepository
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.member", "member")
      .leftJoinAndSelect("comment.parent", "parent")
      .leftJoinAndSelect("comment.children", "children")
      .where("comment.id = :commentId", { commentId: Number(commentId) })
      .getOne();
    return comment;
  }
}
