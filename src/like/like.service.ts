import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like } from "./entity/like.entity";
import { Repository } from "typeorm";
import { MemberService } from "src/member/member.service";
import { CommentService } from "src/comment/comment.service";

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    private memberService: MemberService,
    private commentService: CommentService
  ) {}

  async handleLikeToon(token, service, webtoonId) {
    const decodeToken = await this.memberService.decodeToken(token);
    const { user } = decodeToken;

    const member = await this.memberService.getUser(user.email);
    if (!member) return "잘못된 유저정보입니다.";

    const existLike = await this.likeRepository
      .createQueryBuilder("like")
      .where("like.member.id = :memberId", { memberId: member.id })
      .andWhere("like.service = :service", { service })
      .andWhere("like.webtoonId = :webtoonId", { webtoonId })
      .getOne();
    if (!existLike) {
      const newLikeToon = await this.likeRepository.save({
        member,
        service,
        webtoonId,
      });
      return "좋아요 성공";
    } else {
      await this.likeRepository.remove(existLike);
      return "좋아요 취소 완료";
    }
  }

  async handleLikeEpisode(token, service, webtoonId, episode) {
    const decodeToken = await this.memberService.decodeToken(token);
    const { user } = decodeToken;

    const member = await this.memberService.getUser(user.email);
    if (!member) return "잘못된 유저정보입니다.";

    const existLike = await this.likeRepository
      .createQueryBuilder("like")
      .where("like.member.id = :memberId", { memberId: member.id })
      .andWhere("like.service = :service", { service })
      .andWhere("like.webtoonId = :webtoonId", { webtoonId })
      .andWhere("like.episode = :episode", { episode })
      .getOne();
    if (!existLike) {
      const newLikeToon = await this.likeRepository.save({
        member,
        service,
        webtoonId,
        episode,
      });
      return "좋아요 성공";
    } else {
      await this.likeRepository.remove(existLike);
      return "좋아요 취소 완료";
    }
  }

  async handleLikeComment(token, service, webtoonId, episode, commentId) {
    const decodeToken = await this.memberService.decodeToken(token);
    const { user } = decodeToken;

    const member = await this.memberService.getUser(user.email);
    if (!member) return "잘못된 유저정보입니다.";

    const existLike = await this.likeRepository
      .createQueryBuilder("like")
      .where("like.member.id = :memberId", { memberId: member.id })
      .andWhere("like.service = :service", { service })
      .andWhere("like.webtoonId = :webtoonId", { webtoonId })
      .andWhere("like.episode = :episode", { episode })
      .andWhere("like.comment.id = :commentId", {
        commentId: Number(commentId),
      })
      .getOne();
    if (!existLike) {
      const newLikeToon = await this.likeRepository.save({
        member,
        service,
        webtoonId,
        episode,
        comment: { id: commentId },
      });
      return "좋아요 성공";
    } else {
      await this.likeRepository.remove(existLike);
      return "좋아요 취소 완료";
    }
  }

  async getMyToon(token) {
    const decodeToken = await this.memberService.decodeToken(token);
    const { user } = decodeToken;

    const member = await this.memberService.getUser(user.email);
    if (!member) return "잘못된 유저정보입니다.";

    const toonList = await this.likeRepository
      .createQueryBuilder("like")
      .where("like.member.id = :memberId", { memberId: member.id })
      .andWhere("(like.episode IS NULL AND like.comment IS NULL)")
      .getMany();
    return toonList;
  }

  async getCountEpisode(service, webtoonId, episode) {
    const episodeCount = await this.likeRepository
      .createQueryBuilder("like")
      .where("like.service = :service", { service })
      .andWhere("like.webtoonId = :webtoonId", { webtoonId })
      .andWhere("like.episode = :episode", { episode })
      .andWhere("like.comment IS NULL")
      .getCount();

    return episodeCount;
  }

  async getCountComment(service, webtoonId, episode, commentId) {
    const comment = await this.commentService.getComment(commentId);
    if (!comment) return "존재하지 않는 댓글입니다.";

    const episodeCount = await this.likeRepository
      .createQueryBuilder("like")
      .where("like.service = :service", { service })
      .andWhere("like.webtoonId = :webtoonId", { webtoonId })
      .andWhere("like.episode = :episode", { episode })
      .andWhere("like.comment.id = :commentId", { commentId: comment.id })
      .getCount();
    return episodeCount;
  }
}
